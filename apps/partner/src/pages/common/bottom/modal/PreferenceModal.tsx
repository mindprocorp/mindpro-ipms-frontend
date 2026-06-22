import { CustomScrollArea, FlexBox, FormDialog, RHF, Separator } from "@repo/ui";
import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { usePreferenceModalForm } from "@shared/schema/common/modal/modalform.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  type PreferenceModalFormInput,
  type PreferenceModalFormOutput,
  preferenceModalSchema,
} from "@shared/schema/common/modal/preferenceModalSchema.ts";
import { z } from "zod";

type SuccessData = {
  callbackData: any;
};

type PreferenceModalProps = {
  propData?: any;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: SuccessData) => void;
  rowData?: any; // rowData 추가
};

export const PreferenceModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  rowData, // rowData 추가
}: PreferenceModalProps) => {
  const form = usePreferenceModalForm();
  const createPreferenceMutation = useMutation(bottomQueries.createPreference());
  const { openAlert } = useAlertStore();
  const [isEditMode, setIsEditMode] = useState(false);


  // TODO: API 완성 후 상세조회 함수 연결
  const getPreferenceDetailMutation = useMutation(bottomQueries.getPreferenceDetail());
  const getPreferenceDetail = (preferenceSeq: string) => {
    getPreferenceDetailMutation.mutate(preferenceSeq , {
      onSuccess: (response) => {
        form.reset(response.data);
      },
    });
  };

    useEffect(() => {
    const isEdit = !!rowData?.preferenceSeq;
    setIsEditMode(isEdit);

    if (open) {
      if (isEdit) {
        // 수정 모드: rowData로 form 채우기
        getPreferenceDetail(rowData.preferenceSeq);
      } else {
        // 등록 모드: 초기화
        form.reset();
        form.setValue("appSeq", propData);
      }
    }
  }, [open, propData, rowData, form]);

  const onSubmit = (values: PreferenceModalFormInput) => {
    try {
      const vaildData: PreferenceModalFormOutput = preferenceModalSchema.parse(values);
      const modeText = isEditMode ? "수정" : "저장";

      openAlert({
        className: "w-[400px]",
        message: `${modeText}하시겠습니까?`,
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          // 수정 모드일 때 preferenceSeq 포함
          const payload = isEditMode
            ? { ...vaildData, preferenceSeq: rowData.preferenceSeq }
            : vaildData;

          createPreferenceMutation.mutate(payload, {
            onSuccess: (response) => {
              console.log("[성공]", response);
              onOpenChange(false);
              onSuccess?.({
                callbackData: "PREFERENCE",
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
    if (errors) {
        const firstErrorKey = Object.keys(errors)[0];
        const firstError = errors[firstErrorKey];
        openAlert({
          title: "입력 확인",
          message: firstError.message ?? "입력값 검증에 실패했습니다.",
          confirmText: "확인",
        });
    }
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        // 수정/등록 타이틀 분기
        title={title ?? (isEditMode ? "우선권 수정" : "우선권 등록")}
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
                  name="priorCountryCode"
                  label="우선국"
                  className="w-30"
                  maxLength={30}
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="preferenceAssertDate"
                  label="우선권주장일"
                  className="w-30"
                />
                <RHF.Input
                  control={form.control}
                  name="preferenceNo"
                  label="우선권번호"
                  krPrioNoOnly
                  className="w-30"
                />
                <RHF.Input
                  control={form.control}
                  name="wipoCategoryCode"
                  label="WIPO접근코드"
                  maxLength={30}
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="preferenceRegDate"
                  label="접수일"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="submitDeadLineDate"
                  label="제출마감"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="submitClosingDate"
                  label="제출일"
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
