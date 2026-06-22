import { CustomScrollArea, FlexBox, FormDialog, RHF, Separator } from "@repo/ui";
import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useCostModalForm } from "@shared/schema/common/modal/modalform.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  type CostModalFormInput,
  type CostModalFormOutput,
  costModalSchema,
} from "@shared/schema/common/modal/costModalSchema.ts";
import { z } from "zod";

type SuccessData = {
  callbackData: any;
};

type CostModalProps = {
  propData?: any;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: SuccessData) => void;
  rowData?: any; // rowData 추가
};

export const CostModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  rowData, // rowData 추가
}: CostModalProps) => {
  const form = useCostModalForm();
  const createCostMutation = useMutation(bottomQueries.createCost());
  const { openAlert } = useAlertStore();
  const [isEditMode, setIsEditMode] = useState(false);

  // 수정/등록 모드 구분

  // TODO: API 완성 후 상세조회 함수 연결
  const getCostDetailMutation = useMutation(bottomQueries.getCostDetail());
  const getCostDetail = (tblSeq: string, costSeq: string) => {
    const param = {
      tblSeq,
      costSeq
    }

    getCostDetailMutation.mutate( param , {
      onSuccess: (response) => {
        //@ts-ignore
        form.reset(response.data);
        form.setValue('discountRatio',response.data.discountRatio.toString())


      },
    });
  };

    useEffect(() => {
    const isEdit = !!rowData?.costSeq;
    setIsEditMode(isEdit);

    if (open) {
      if (isEdit) {
        // 수정 모드: rowData로 form 채우기
        getCostDetail(propData, rowData.costSeq);
      } else {
        // 등록 모드: 초기화
        form.reset();
        form.setValue("tblSeq", propData);
      }
    }
  }, [open, propData, rowData, form]);

  const onSubmit = (values: CostModalFormInput) => {
    try {
      const vaildData: CostModalFormOutput = costModalSchema.parse(values);
      const modeText = isEditMode ? "수정" : "저장";

      openAlert({
        className: "w-[400px]",
        message: `${modeText}하시겠습니까?`,
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          // 수정 모드일 때 costSeq 포함
          const payload = isEditMode ? { ...vaildData, costSeq: rowData.costSeq } : vaildData;

          createCostMutation.mutate(payload, {
            onSuccess: (response) => {
              console.log("[성공]", response);
              onOpenChange(false);
              onSuccess?.({
                callbackData: "COST",
              });

              setTimeout(() => {
                openAlert({
                  className: "w-[400px]",
                  message: `${modeText}완료하였습니다`,
                  confirmText: "확인",
                  onConfirm: () => {
                    useAlertStore.getState().close();
                  },
                });
              }, 300);
            },
          });
        },
      });
    } catch (error) {
      console.error("Validation failed:", error);
      // 알럿을 띄우지 않음으로써 RHF의 인라인 에러(빨간 글씨)가 사용자에게 노출되도록 함
    }
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
          // 수정/등록 타이틀 분기
          title={title ?? (isEditMode ? "비용 수정" : "비용 등록")}
          onSubmit={form.handleSubmit(onSubmit, onError)}
          // 버튼 텍스트 분기
          submitText={isEditMode ? "수정" : "저장"}
          open={open}
          onOpenChange={onOpenChange}
          className="max-w-300!"
        >
          <CustomScrollArea className="h-140">
              <FlexBox vertical className="gap-4 pt-3">
                <div className="w-full">
                  <FlexBox>
                    <RHF.Input
                      control={form.control}
                      name="remittanceCount"
                      label="납부차수"
                      className="w-30"
                      numericOnly
                      maxLength={3}
                    />
                    <RHF.FormDatePicker
                      control={form.control}
                      name="costRemittanceDate"
                      label="연차료납부일"
                      className="w-30"
                    />
                    <RHF.Input
                      control={form.control}
                      name="costFee"
                      label="연차료납부액"
                      amountOnly
                      align="right"
                      className="w-30"
                    />
                    <RHF.FormSelect
                      control={form.control}
                      name="discountRatio"
                      items={[
                        { label: "30%", value: "30" },
                        { label: "50%", value: "50" },
                        { label: "70%", value: "70" },
                      ]}
                      label="감면율"
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
