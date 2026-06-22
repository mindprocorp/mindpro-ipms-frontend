import { FlexBox, FormDialog, RHF } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import React, { useEffect, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { billDomesticQueries } from "@shared/query/bill/billDomesticQueries.ts";
import { billTabsQueries } from "@shared/query/bill/billTabsQueries.ts";
import { commonQueries } from "@shared/query/common/queries.ts";
import { useParams } from "react-router-dom";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { BILL } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { mapToOptionNew } from "@shared/util/stringUtil.ts";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";

import { useBillDetailModalForm } from "@shared/schema/bill/form.ts";
import { stripObjectFormattedFields } from "@shared/util/formatUtil.ts";

export const BillDetailForeignModal = ({ title = "대리인 청구내역 등록", open, onOpenChange, onSuccess, propData, editData }: ModalProps) => {
  const { billSeq } = useParams<{ billSeq: string }>();
  const { openAlert } = useAlertStore();
  const [costCategoryList, setCostCategoryList] = useState<CodeSelectOption[]>([]);

  const form = useBillDetailModalForm();

  const { control, handleSubmit, reset } = form;

  const getCommonCodeMutation = useMutation(commonQueries.getCommonCodeNew());

  const loadCodes = useCallback(() => {
    const request: CodeRequestTypeNew = { grpCdList: [BILL.COST_TYPE] };
    getCommonCodeMutation.mutate(request, {
      onSuccess: (res) => {
        const list = getCodeList(BILL.COST_TYPE, res.data);
        setCostCategoryList(mapToOptionNew(list));
      },
    });
  }, []);

  useEffect(() => {
    if (open) {
      if (editData) {
        // 저장 흐름에 맞춰 모든 값을 안전 정규화 (null/undefined → 기본값).
        const toStr = (v: any) => (v == null ? "" : String(v));
        const codeObj = (o: any, defCode = "") => ({
          code: o?.code ?? defCode,
          codeName: o?.codeName ?? "",
        });
        reset({
          invoiceSeq: propData || billSeq,
          costCategory: codeObj(editData.costCategory),
          itemContent: editData.itemContent ?? "",
          unitPrice: toStr(editData.unitPrice),
          totalAmount: toStr(editData.totalAmount),
          quantity: toStr(editData.quantity ?? 1),
          unit: codeObj(editData.unit, "USD"),
          note: editData.note ?? "",
          vatAmount: toStr(editData.vatAmount),
        });
      } else {
        reset({
          invoiceSeq: propData || billSeq,
          costCategory: { code: "", codeName: "" },
          itemContent: "",
          unitPrice: "0",
          totalAmount: "0",
          quantity: "1",
          note: "",
          unit: { code: "USD", codeName: "" },
        });
      }
      loadCodes();
    }
  }, [open, reset, propData, billSeq, editData, loadCodes]);

  const createBillDetailMutation = useMutation(billTabsQueries.saveAgentClaimItem());

  const onSubmit = (values: any) => {
    const cleanValues = stripObjectFormattedFields(values);

    //   [핵심] 백엔드가 요구하는 JSON 양식으로 페이로드 조립
    const payload: any = {
      invoiceSeq: propData || billSeq,
      invoiceClaimSeq: editData?.invoiceClaimSeq || "",

      costCategory: {
        code: cleanValues.costCategory?.code || "30",
        codeName: cleanValues.costCategory?.codeName || ""
      },

      itemContent: cleanValues.itemContent || "",

      // 수치 데이터는 모두 문자열로 변환 (BigDecimal NPE 방지)
      unitPrice: String(cleanValues.unitPrice || "0"),

      unit: {
        code: cleanValues.unit?.code || "USD",
        codeName: cleanValues.unit?.codeName || ""
      },

      quantity: String(cleanValues.quantity || "1"),
      amount: String(Number(cleanValues.unitPrice || 0) * Number(cleanValues.quantity || 1)),
      vatAmount: String(cleanValues.vatAmount || "0"),
      totalAmount: String(cleanValues.totalAmount || "0"),

      note: cleanValues.note || ""
    };

    console.log("  백엔드로 보낼 최종 데이터:", payload);

    openAlert({
      message: "저장하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        createBillDetailMutation.mutate(payload, {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.({ callbackData: "BILL_DETAIL" });
            setTimeout(() => {
              openAlert({
                message: "저장되었습니다.",
                confirmText: "확인",
              });
            }, 300);
          },
          onError: (err) => {
            console.error("저장 실패:", err);
            openAlert({ message: "서버 저장 중 오류가 발생했습니다." });
          }
        });
      },
    });
  };

  // zod 검증 실패 시 어떤 필드가 막혔는지 한글 라벨로 표시.
  const FIELD_LABELS: Record<string, string> = {
    invoiceSeq: "청구서",
    costCategory: "비용구분",
    itemContent: "청구내역",
    unitPrice: "청구금액",
    totalAmount: "환산액(KRW)",
    vatAmount: "부가세",
    amount: "금액",
    quantity: "수량",
    unit: "단위",
    note: "비고",
  };
  const onValidationError = (errors: any) => {
    console.warn("[BillDetailForeignModal] validation errors:", errors);
    // 중첩 객체(예: costCategory.code) 포함 — 첫 에러의 최상위 키 사용
    const firstField = Object.keys(errors)[0];
    const node = errors[firstField];
    // node.message 또는 node.code?.message 등 nested 케이스 대응
    const findMsg = (n: any): string | undefined => {
      if (!n) return undefined;
      if (typeof n.message === "string") return n.message;
      for (const k of Object.keys(n)) {
        const m = findMsg(n[k]);
        if (m) return m;
      }
      return undefined;
    };
    const msg = findMsg(node) || "필수 항목을 모두 입력해주세요.";
    const label = FIELD_LABELS[firstField] || firstField;
    openAlert({ message: `[${label}] ${msg}`, confirmText: "확인" });
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={handleSubmit(onSubmit, onValidationError)}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-lg"
      >
        <FlexBox vertical className="gap-4">
          <FlexBox className="gap-2">
            <RHF.FormSelect
              control={control}
              name="costCategory.code"
              label="비용구분"
              items={costCategoryList}
              className="flex-1"
            />
            <RHF.Input
              control={control}
              name="itemContent"
              label="청구내역"
              maxLength={200}
              className="flex-1"
            />
          </FlexBox>

          {/* DB utb_invoice_claim numeric(15,0) → 정수부 14자리 + 콤마 = 18자 */}
          <FlexBox className="gap-2">
            <RHF.Input
              control={control}
              name="unitPrice"
              label="청구금액"
              priceOnly
              maxLength={18}
              important
              className="flex-1"
            />
            <RHF.Input
              control={control}
              name="totalAmount"
              label="환산액(KRW)"
              priceOnly
              maxLength={18}
              className="flex-1"
            />
          </FlexBox>

          <RHF.FormTextarea
            control={control}
            name="note"
            label="비고"
            maxLength={200}
          />
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
