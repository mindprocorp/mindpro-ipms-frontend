import { CustomScrollArea, FlexBox, FormDialog, RHF, Separator } from "@repo/ui";
import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useRndModalForm } from "@shared/schema/common/modal/modalform.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  type RndModalFormInput,
  type RndModalFormOutput,
  rndModalSchema,
} from "@shared/schema/common/modal/rndModalSchema.ts";
import { z } from "zod";

type SuccessData = {
  callbackData: any;
};

type RndModalProps = {
  propData?: any;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: SuccessData) => void;
  rowData?: any; // rowData 추가
};

export const RndModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  rowData, // rowData 추가
}: RndModalProps) => {
  const form = useRndModalForm();
  const createRndMutation = useMutation(bottomQueries.createRnd());
  const { openAlert } = useAlertStore();
  const [isEditMode, setIsEditMode] = useState(false);


  const getRndDetailMutation = useMutation(bottomQueries.getRndDetail());
  const getRndDetail = (rndSeq: string) => {
    const param = {
      appSeq : propData,
      rndSeq

    }

    getRndDetailMutation.mutate(param, {
      onSuccess: (response) => {
        form.reset(response.data);
      },
    });
  };

    useEffect(() => {
    const isEdit = !!rowData?.rndSeq;
    setIsEditMode(isEdit);

    if (open) {
      if (isEdit) {
        // 수정 모드: rowData로 form 채우기
        getRndDetail(rowData.rndSeq);
      } else {
        // 등록 모드: 초기화
        form.reset();
        form.setValue("appSeq", propData);
      }
    }
  }, [open, propData, rowData, form]);

  const onSubmit = async (values: RndModalFormInput) => {
    const isValid = await form.trigger();
    if (!isValid) {
      openAlert({
        className: "w-[400px]",
        message: "필수값을 입력해주세요",
        confirmText: "확인",
      });
      return;
    }

    try {
      const vaildData: RndModalFormOutput = rndModalSchema.parse(values);
      const modeText = isEditMode ? "수정" : "저장";

      openAlert({
        className: "w-[400px]",
        message: `${modeText}하시겠습니까?`,
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          // 수정 모드일 때 costSeq 포함
          const payload = isEditMode ? { ...vaildData, rndSeq: rowData.rndSeq } : vaildData;

          createRndMutation.mutate(payload, {
            onSuccess: (response) => {
              console.log("[성공]", response);
              onOpenChange(false);
              onSuccess?.({
                callbackData: "RND",
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
      console.error("Validation failed:", error);
      return;
    }
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        // 수정/등록 타이틀 분기
        title={title ?? (isEditMode ? "R&D 수정" : "R&D 등록")}
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
                  name="researchNo"
                  label="과제고유번호"
                  className="w-30"
                  maxLength={30}
                />
                <RHF.Input
                  control={form.control}
                  name="projectNo"
                  label="과제번호"
                  className="w-30"
                  maxLength={30}
                />
                <RHF.Input
                  control={form.control}
                  name="ministryName"
                  label="국가부처명"
                  className="w-30"
                  maxLength={50}
                />
                <RHF.Input
                  control={form.control}
                  name="agencyName"
                  label="과제관리(전문)기관"
                  className="w-30"
                  maxLength={100}
                />
                <RHF.Input
                  control={form.control}
                  name="bizName"
                  label="연구사업명"
                  className="w-30"
                  maxLength={100}
                />
                <RHF.Input
                  control={form.control}
                  name="rndName"
                  label="연구과제명"
                  className="w-30"
                  maxLength={500}
                />
                <RHF.Input
                  control={form.control}
                  name="shareRatio"
                  label="기여율"
                  className="w-30"
                  percentOnly
                  align="right"
                />
                <RHF.Input
                  control={form.control}
                  name="mainLab"
                  label="과제수행기관명"
                  className="w-30"
                  maxLength={255}
                />
              </FlexBox>

              <FlexBox>
                <RHF.Input
                  control={form.control}
                  name="performingLab"
                  label="참여기관"
                  className="w-30"
                  maxLength={255}
                />
                <div className="w-80">
                  <RHF.FormDateFromToPicker
                    control={form.control}
                    name={[`rndStartDate`, `rndClosingDate`]}
                    label="연구기간"
                  />
                </div>
                <RHF.Input
                  control={form.control}
                  name="totalRndCost"
                  label="연구비총액"
                  amountOnly
                  align="right"
                  className="w-30"
                  maxLength={50}
                />
              </FlexBox>
            </div>

            <Separator className="border-t" />
          </FlexBox>
        </CustomScrollArea>
      </FormDialog>
    </FormProvider>
  );
};
