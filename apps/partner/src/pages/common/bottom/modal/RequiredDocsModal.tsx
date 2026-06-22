import { CustomScrollArea, FlexBox, FormDialog, RHF } from "@repo/ui";
import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useRequiredDocsModalForm } from "@shared/schema/common/modal/modalform.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  type RequiredDocsModalFormInput,
  type RequiredDocsModalFormOutput,
  requiredDocsModalSchema,
} from "@shared/schema/common/modal/requiredDocsModalSchema.ts";
import { z } from "zod";

type ModalSuccessData = {
  callbackData: any;
};

type RequiredDocsModalProps = {
  propData?: any;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: ModalSuccessData) => void;
  rowData?: any; // rowData 추가
};

export const RequiredDocsModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  rowData, // rowData 추가
}: RequiredDocsModalProps) => {
  const form = useRequiredDocsModalForm();
  const createRequiredDocsMutation = useMutation(bottomQueries.createRequiredDocs());
  const { openAlert } = useAlertStore();
  const [isEditMode, setIsEditMode] = useState(false);


  // TODO: API 완성 후 상세조회 함수 연결
  const getRequiredDocsDetailMutation = useMutation(bottomQueries.getRequiredDocsDetail());
  const getRequiredDocsDetail = (appSeq : string ,requiredDocsSeq: string) => {
    const param = {
      appSeq ,
      requiredDocSeq : requiredDocsSeq

    }
    getRequiredDocsDetailMutation.mutate(param, {
      onSuccess: (response) => {
        form.reset(response.data);
      },
    });
  };

    useEffect(() => {
    const isEdit = !!rowData?.requiredDocSeq;
    setIsEditMode(isEdit);

    if (open) {
      if (isEdit) {
        // 수정 모드: rowData로 form 채우기
        getRequiredDocsDetail(propData, rowData.requiredDocSeq);
      } else {
        // 등록 모드: 초기화
        form.reset();
        form.setValue("appSeq", propData);
      }
    }
  }, [open, propData, rowData, form]);

  const onSubmit = (values: RequiredDocsModalFormInput) => {
    try {
      const vaildData: RequiredDocsModalFormOutput = requiredDocsModalSchema.parse(values);
      const modeText = isEditMode ? "수정" : "저장";

      openAlert({
        className: "w-[400px]",
        message: `${modeText}하시겠습니까?`,
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          // 수정 모드일 때 requiredDocSeq 포함
          const payload = isEditMode
            ? { ...vaildData, requiredDocSeq: rowData.requiredDocsSeq }
            : vaildData;

          createRequiredDocsMutation.mutate(payload, {
            onSuccess: (response) => {
              console.log("[성공]", response);
              onOpenChange(false);
              onSuccess?.({ callbackData: "REQUIRED_DOCS" });
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
    <>
    <FormProvider {...form}>
      <FormDialog
        // 수정/등록 타이틀 분기
        title={title ?? (isEditMode ? "구비서류 수정" : "구비서류 등록")}
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
              <h2 className="pb-1 text-sm font-semibold">접수사항</h2>
              <FlexBox>
                <RHF.Input
                  control={form.control}
                  name="requiredDocName"
                  label="구비서류"
                  className="w-30"
                  maxLength={50}
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="submitDeadline"
                  label="제출마감일"
                  className="w-30"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="signReqDate"
                  label="서명요청일"
                  className="w-30"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="receiptDate"
                  label="접수일"
                  className="w-30"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="sendDate"
                  label="발송일"
                  className="w-30"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="submitDate"
                  label="제출일"
                  className="w-30"
                />
              </FlexBox>
            </div>
          </FlexBox>
        </CustomScrollArea>
      </FormDialog>
    </FormProvider>
    </>
  );
};
