import { CustomScrollArea, FlexBox, FormDialog, RHF, Separator } from "@repo/ui";
import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useMaintenancesModalForm } from "@shared/schema/common/modal/modalform.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  type MaintenanceModalFormInput,
  type MaintenanceModalFormOutput,
  maintenanceModalSchema,
} from "@shared/schema/common/modal/maintenanceModalSchema.ts";
import { z } from "zod";

type ModalSuccessData = {
  callbackData: any;
};

type MaintenanceModalProps = {
  propData?: any;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: ModalSuccessData) => void;
  rowData?: any;
};

export const MaintenanceModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  rowData,
}: MaintenanceModalProps) => {
  const form = useMaintenancesModalForm();
  const createMaintenanceMutation = useMutation(bottomQueries.createMaintenance());
  const getMaintenanceDetailMutation = useMutation(bottomQueries.getMaintenanceDetail());
  const { openAlert } = useAlertStore();
  const [isEditMode, setIsEditMode] = useState(false);


  const getMaintenanceDetail = (appSeq: string, mainFeeSeq: string) => {
    const param = {
      appSeq,
      mainFeeSeq,
    };
    getMaintenanceDetailMutation.mutate(param, {
      onSuccess: (response) => {
        console.log("상세조회 ", response);
        const detailData = response.data;
        // @ts-ignore
        form.reset(detailData);

      },
    });
  };

    useEffect(() => {
    const isEdit = !!rowData?.maintenanceFeeSeq;
    setIsEditMode(isEdit);

    if (open) {
      if (isEdit) {
        // 수정 모드: rowData로 form 채우기
        getMaintenanceDetail(propData, rowData.maintenanceFeeSeq);
      } else {
        // 등록 모드: 초기화
        form.reset();
        form.setValue("appSeq", propData);
      }
    }
  }, [open, propData, rowData, form]);

  const onSubmit = (values: MaintenanceModalFormInput) => {
    try {
      const vaildData: MaintenanceModalFormOutput = maintenanceModalSchema.parse(values);
      const modeText = isEditMode ? "수정" : "저장";

      openAlert({
        className: "w-[400px]",
        message: `${modeText}하시겠습니까?`,
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          // 수정 모드일 때 maintenanceFeeSeq 포함
          const payload = isEditMode
            ? { ...vaildData, maintenanceFeeSeq: rowData.maintenanceFeeSeq }
            : vaildData;

          createMaintenanceMutation.mutate(payload, {
            onSuccess: (response) => {
              console.log("[성공]", response);
              onOpenChange(false);
              onSuccess?.({
                callbackData: "MAINTENANCE_FEE",
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
    <>
    <FormProvider {...form}>
      <FormDialog
        // 수정/등록 타이틀 분기
        title={title ?? (isEditMode ? "유지비 수정" : "유지비 등록")}
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
              <h2 className="pb-1 text-sm font-semibold">유지비등록</h2>
              <FlexBox>
                <RHF.Input
                  control={form.control}
                  name="nextPaymentInstallment"
                  label="차기납부차수"
                  className="w-30"
                  numericOnly
                  maxLength={3}
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="maintFeeDeadline"
                  label="납부마감일"
                  className="w-30"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="maintFeePenaltyDeadline"
                  label="과태마감일"
                  className="w-30"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="maintFeeOrderDate"
                  label="납부지시일"
                  className="w-30"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="maintFeePaymentDate"
                  label="납부일"
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
    </>
  );
};
