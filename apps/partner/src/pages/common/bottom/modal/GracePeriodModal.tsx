import { CustomScrollArea, FlexBox, FormDialog, RHF, Separator } from "@repo/ui";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useGracePeriodModalForm } from "@shared/schema/common/modal/modalform.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  type GracePeriodModalFormInput,
  type GracePeriodModalFormOutput,
  gracePeriodModalSchema,
} from "@shared/schema/common/modal/gracePeriodModalSchema.ts";
import { mapToOptionNew } from "@shared/util/stringUtil.ts";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import { GRACE_PERIOD } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { commonQueries } from "@shared/query/common/queries.ts";
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
  rowData?: any; // rowData 추가
};

export const GracePeriodModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  rowData,
}: ProgressModalProps) => {
  const form = useGracePeriodModalForm();
  const createGracePeriodMutation = useMutation(bottomQueries.createGracePeriod());
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const { openAlert } = useAlertStore();
  const [gracePeriodCodeList, setGracePeriodCodeList] = useState<CodeSelectOption[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);


  // TODO: API 완성 후 상세조회 함수 연결
  const getGracePeriodDetailMutation = useMutation(bottomQueries.getGracePeriodDetail());
  const getGracePeriodDetail = (appSeq: string, gracePeriodSeq: string) => {
    const param = {
      appSeq,
      gracePeriodSeq,
    };
    getGracePeriodDetailMutation.mutate(param, {
      onSuccess: (response) => {
        form.reset(response.data);
      },
    });
  };

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [GRACE_PERIOD.GRACE_PRD_CONT],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        console.log("code list ", response);

        const codeDataList = response.data;

        const setupCodes = (codeKey: string, setter: (codes: any[]) => void) => {
          const codeList = getCodeList(codeKey, codeDataList);
          setter(mapToOptionNew(codeList));
        };
        setupCodes(GRACE_PERIOD.GRACE_PRD_CONT, setGracePeriodCodeList);
      },
    });
  }, [open]);

    useEffect(() => {
    getCommCodeNew();

    const isEdit = !!rowData?.gracePeriodSeq;
    setIsEditMode(isEdit);

    if (open) {
      if (isEdit) {
        getGracePeriodDetail(propData, rowData.gracePeriodSeq);
      } else {
        form.reset();
        form.setValue("appSeq", propData);
      }
    }
  }, [open, propData, rowData, getCommCodeNew]);

  const onSubmit = (values: GracePeriodModalFormInput) => {
    try {
      const vaildData: GracePeriodModalFormOutput = gracePeriodModalSchema.parse(values);
      const modeText = isEditMode ? "수정" : "저장";

      openAlert({
        className: "w-[400px]",
        message: `${modeText}하시겠습니까?`,
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          const payload = isEditMode
            ? { ...vaildData, gracePeriodSeq: rowData.gracePeriodSeq }
            : vaildData;

          createGracePeriodMutation.mutate(payload, {
            onSuccess: (response) => {
              console.log("[성공]", response);
              onOpenChange(false);
              onSuccess?.({
                callbackData: "GRACE_PERIOD",
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
        title={title ?? (isEditMode ? "공지예외주장 수정" : "공지예외주장 등록")}
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
                <RHF.FormDatePicker
                  control={form.control}
                  name="gracePeriodDate"
                  label="공지예외주장일"
                  className="w-30"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="submitDeadLineDate"
                  label="제출마감일"
                  className="w-30"
                />
                <RHF.FormDatePicker
                  control={form.control}
                  name="submitClosingDate"
                  label="제출일"
                  className="w-30"
                />

                <RHF.FormSelect
                  control={form.control}
                  name="gracePeriodContent.code"
                  items={gracePeriodCodeList}
                  label="공지예외주장내용"
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
