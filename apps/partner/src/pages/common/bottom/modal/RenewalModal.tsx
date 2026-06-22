import { CustomScrollArea, FlexBox, FormDialog, RHF, Separator } from "@repo/ui";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useRenewalListModalForm } from "@shared/schema/common/modal/modalform.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  type RenewalModalFormInput,
  type RenewalModalFormOutput,
  renewalModalSchema,
} from "@shared/schema/common/modal/renewalModalSchema.ts";
import { commonQueries } from "@shared/query/common/queries.ts";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import { GRACE_PERIOD, RENEWAL } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { mapToOptionNew } from "@shared/util/stringUtil.ts";
import { z } from "zod";

type SuccessData = {
  callbackData: any;
};

type ProgressModalProps = {
  propData?: any;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: SuccessData) => void;
  rowData?: any;
};

export const RenewalModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  rowData,
}: ProgressModalProps) => {
  const form = useRenewalListModalForm();
  const createRenewalMutation = useMutation(bottomQueries.createRenewal());
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const { openAlert } = useAlertStore();
  const [paymentDivList, setPaymentDivList] = useState<CodeSelectOption[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [RENEWAL.PAYMENT_DIV],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        console.log("code list ", response);

        const codeDataList = response.data;

        const setupCodes = (codeKey: string, setter: (codes: any[]) => void) => {
          const codeList = getCodeList(codeKey, codeDataList);
          setter(mapToOptionNew(codeList));
        };
        setupCodes(RENEWAL.PAYMENT_DIV, setPaymentDivList);
      },
    });
  }, [open]);

  useEffect(() => {
    const isEdit = !!rowData?.costSeq;
    setIsEditMode(isEdit);

    if (open) {
      getCommCodeNew();
      if (isEdit) {
        form.reset({
          ...rowData,
          remittanceCount: rowData.remittanceCount != null ? String(rowData.remittanceCount) : "",
          krwAmount: rowData.krwAmount != null ? String(rowData.krwAmount) : "",
        });
      } else {
        form.reset();
        form.setValue("appSeq", propData);
      }
    }
  }, [open, propData, rowData, getCommCodeNew, form]);


  const onSubmit = (values: RenewalModalFormInput) => {
    try {
      const vaildData: RenewalModalFormOutput = renewalModalSchema.parse(values);
      const modeText = isEditMode ? "수정" : "저장";

      openAlert({
        className: "w-[400px]",
        message: `${modeText}하시겠습니까?`,
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          // 수정 모드일 때 costSeq 포함
          const payload = isEditMode ? { ...vaildData, costSeq: rowData.costSeq } : vaildData;

          createRenewalMutation.mutate(payload, {
            onSuccess: (response) => {
              console.log("[성공]", response);
              onOpenChange(false);
              onSuccess?.({
                callbackData: "RENEWAL",
              });
              setTimeout(() => {
                openAlert({
                  className: "w-[400px]",
                  message: `${modeText}완료하였습니다`,
                  confirmText: "확인",
                });
              }, 300);
            },
          });
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues?.[0];
        openAlert({
          title: "입력 확인",
          message: firstError 
            ? `${firstError.path.join(".")} : ${firstError.message}`
            : "입력값 검증에 실패했습니다.",
          confirmText: "확인",
        });
      } else {
        console.error(error);
      }
    }
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title ?? (isEditMode ? "갱신관리 수정" : "갱신관리 등록")}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        submitText={isEditMode ? "수정" : "저장"}
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-300!"
      >
        <CustomScrollArea className="h-140">
          <FlexBox vertical className="gap-4 pt-3">
            <div className="w-full">
              <h2 className="pb-1 text-sm font-semibold"></h2>
              <FlexBox>
                <RHF.Input
                  control={form.control}
                  name="remittanceCount"
                  label="차수"
                  className="w-30"
                  numericOnly
                  maxLength={3}
                />
                <RHF.FormSelect
                  control={form.control}
                  name="paymentDiv"
                  items={paymentDivList}
                  label="납부구분"
                  className="w-30"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="requestDate"
                  label="출원일/신청일"
                  className="w-30"
                />
                <RHF.Input
                  control={form.control}
                  name="appNo"
                  label="출원번호"
                  krAppNoOnly
                  className="w-30"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="costRemittanceDate"
                  label="등록일/납부일"
                  className="w-30"
                />
                <RHF.Input
                  control={form.control}
                  name="krwAmount"
                  label="납부금액"
                  amountOnly
                  align="right"
                  className="w-30"
                />
              </FlexBox>
            </div>

            <Separator className="border-t" />

            <div className="w-full">
              <h2 className="pb-1 text-sm font-semibold">비고</h2>
              <FlexBox>
                <RHF.FormTextarea control={form.control} name="note" />
              </FlexBox>
            </div>
          </FlexBox>
        </CustomScrollArea>
      </FormDialog>
    </FormProvider>
  );
};
