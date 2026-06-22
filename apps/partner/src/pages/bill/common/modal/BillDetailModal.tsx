import { CustomScrollArea, FlexBox, FormDialog, RHF, Separator } from "@repo/ui";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider, useWatch } from "react-hook-form";
import { useMemoModalForm } from "@shared/schema/common/modal/modalform.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  type MemoModalFormInput,
  type MemoModalFormOutput,
  memoModalSchema,
} from "@shared/schema/common/modal/memoModalSchema.ts";
import { useBillDetailModalForm } from "@shared/schema/bill/form.ts";
import { stripObjectFormattedFields } from "@shared/util/formatUtil.ts";
import { billDomesticQueries } from "@shared/query/bill/billDomesticQueries.ts";
import {
  type BillDetailModalFormInput,
  type BillDetailModalFormOutput,
  billDetailModalSchema,
} from "@shared/schema/bill/modal/billDetailModalSchema.ts";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import { BILL, PROGRESS } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { mapToOptionNew } from "@shared/util/stringUtil.ts";
import { commonQueries } from "@shared/query/common/queries.ts";
import { UserModal } from "@pages/common/modal/user/UserModal.tsx";

type SuccessData = {
  callbackData: any;
};

import type { ModalProps } from "@repo/schema";

type BillDetailModalProps = ModalProps;

export const BillDetailModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  editData,
}: BillDetailModalProps) => {
  const form = useBillDetailModalForm();
  const createBillDetailMutation = useMutation(billDomesticQueries.createBillDetail());
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const { openAlert } = useAlertStore();
  const [costCategoryList, setCostCategoryList] = useState<CodeSelectOption[]>([]);
  const [quantityList, setQuantityList] = useState<CodeSelectOption[]>([]);
  const isHydrated = React.useRef(false);

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [BILL.COST_TYPE,BILL.COUNT_UNIT_TYPE],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        const codeDataList = response.data;

        const setupCodes = (codeKey: string, setter: (codes: any[]) => void) => {
          const codeList = getCodeList(codeKey, codeDataList);
          setter(mapToOptionNew(codeList));
        };
        setupCodes(BILL.COST_TYPE, setCostCategoryList);
        setupCodes(BILL.COUNT_UNIT_TYPE, setQuantityList);
      },
    });
  }, [open]);

  useEffect(() => {
    if (open) {
      isHydrated.current = false;
      if (editData) {
        form.reset({
          invoiceSeq: propData,
          costCategory: editData.costCategory || { code: "", codeName: "" },
          itemContent: editData.itemContent || "",
          unitPrice: editData.unitPrice || "",
          quantity: editData.quantity || "",
          amount: editData.amount || "",
          unit: editData.unit || { code: "", codeName: "" },
          vatAmount: editData.vatAmount || "",
          totalAmount: editData.totalAmount || "",
          note: editData.note || "",
        });
      } else {
        form.reset();
        form.setValue("invoiceSeq", propData);
      }
      getCommCodeNew();
      // reset 후 다음 틱에서 hydration 완료로 표시
      setTimeout(() => {
        isHydrated.current = true;
      }, 0);
    }
  }, [open, editData, propData]);

  const unitPrice = useWatch({ control: form.control, name: "unitPrice" });
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const vat = useWatch({ control: form.control, name: "vatAmount" });

  // 큰 수가 setValue 될 때 String(n)이 과학적 표기법(1.5e+16)으로 변환되어
  // zod 정규식(/^-?[0-9,.]+$/)에 걸리는 문제 방지용 안전 변환.
  const toPlainNumberStr = (n: number): string => {
    if (!Number.isFinite(n)) return "0";
    // useGrouping=false → 콤마 없이, e 표기 없이 정수/소수 그대로 출력
    return n.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 4 });
  };

  useEffect(() => {
    if (!isHydrated.current) return;

    const price = Number(String(unitPrice || "").replace(/,/g, "")) || 0;
    const qty = Number(String(quantity || "").replace(/,/g, "")) || 0;
    const amount = price * qty;
    form.setValue("amount", toPlainNumberStr(amount));

    if(amount || vat){
      const total = Number(amount) + (vat ? Number(String(vat).replace(/,/g, "")) : 0);
      form.setValue("totalAmount", toPlainNumberStr(total));
    }
  }, [unitPrice, quantity,vat]);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isHydrated.current = true;
    if (e.target.value === "0") {
      form.setValue(e.target.name as any, "");
    }
  };

  const onSubmit = (values: BillDetailModalFormInput) => {
    openAlert({
      className: "w-[400px]",
      message: "저장하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        const cleanValues = stripObjectFormattedFields(values);
        const payload: any = {
          ...cleanValues,
          invoiceSeq: editData?.invoiceSeq || propData,
          invoiceClaimSeq: editData?.invoiceClaimSeq || "",
          costCategory: cleanValues.costCategory?.code ? cleanValues.costCategory : { code: "", codeName: "" },
        };

        createBillDetailMutation.mutate(payload, {
          onSuccess: (response) => {
            console.log("[성공]", response);
            onOpenChange(false);
            onSuccess?.({
              callbackData: "BILL_DETAIL",
            });
            setTimeout(() => {
              openAlert({
                className: "w-[400px]",
                message: "저장완료하였습니다",
                confirmText: "확인",
              });
            }, 300);
          },
        });
      },
    });

    //onOpenChange(false);
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
  };

  return (

      <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-lg" // Modal22처럼 적절한 폭으로 조정
      >
        <FlexBox vertical className="gap-4">
          {/* 첫 번째 행: 비용구분, 청구내역 */}
          <FlexBox className="gap-2">
            <RHF.FormSelect
              control={form.control}
              name="costCategory.code"
              items={costCategoryList}
              label="비용구분"
            />
            <RHF.Input
              control={form.control}
              name="itemContent"
              label="청구내역"
              maxLength={200}
            />
          </FlexBox>

          {/* 두 번째 행: 수량, 단위 — DB numeric(15,0) 기준 14자리 */}
          <FlexBox className="gap-2">
            <RHF.Input
              control={form.control}
              name="quantity"
              label="수량"
              numericOnly
              maxLength={14}
              onFocus={handleInputFocus}
            />
            <RHF.FormSelect
              control={form.control}
              name="unit.code"
              items={quantityList}
              label="단위"
              placeholder="선택"
            />
          </FlexBox>

          {/* 세 번째 행: 단가, 금액 — DB numeric(15,0) 기반 자릿수 제한 (스키마 상수) */}
          <FlexBox className="gap-2">
            <RHF.Input
              control={form.control}
              name="unitPrice"
              label="단가"
              priceOnly
              maxLength={18}
              onFocus={handleInputFocus}
            />
            <RHF.Input
              control={form.control}
              name="amount"
              label="금액"
              priceOnly
              align="right"
              maxLength={18}
              inputDisabled // 자동계산 항목
            />
          </FlexBox>

          {/* 네 번째 행: 부가세, 청구금액 */}
          <FlexBox className="gap-2">
            <RHF.Input
              control={form.control}
              name="vatAmount"
              label="부가세"
              priceOnly
              maxLength={18}
              onFocus={handleInputFocus}
            />
            <RHF.Input
              control={form.control}
              name="totalAmount"
              label="청구금액"
              priceOnly
              align="right"
              maxLength={18}
              inputDisabled
              important // Modal22 강조 스타일 적용
            />
          </FlexBox>

          {/* 비고: 단독 행 */}
          <RHF.FormTextarea
            control={form.control}
            name="note"
            label="비고"
            maxLength={200}
          />
        </FlexBox>
      </FormDialog>
    </FormProvider>



  );
};
