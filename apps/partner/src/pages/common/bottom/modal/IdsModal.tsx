import { Button, CustomTooltip, FlexBox, FormDialog, Icons, RHF, Separator } from "@repo/ui";
import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useIdsModalForm } from "@shared/schema/common/modal/modalform.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  type IdsModalFormInput,
  type IdsModalFormOutput,
  idsModalSchema,
} from "@shared/schema/common/modal/idsModalSchema.ts";
import { z } from "zod";
import { type InputKeyInfoType, UserModal } from "@pages/common/modal/user/UserModal.tsx";
import type { RtnDataType } from "@pages/common/modal/user/model/useMembers.ts";

type SuccessData = {
  callbackData: any;
};

type IdsModalProps = {
  propData?: any;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: SuccessData) => void;
  rowData?: any; // rowData 추가
};

export type SuccessUserData = {
  input: InputKeyInfoType;
  userInfo: RtnDataType[];
};

export const IdsModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  rowData,
}: IdsModalProps) => {
  const form = useIdsModalForm();
  const createIdsMutation = useMutation(bottomQueries.createIds());
  const { openAlert } = useAlertStore();
  const [isUserOpenModal, setIsUserOpenModal] = React.useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputKeyInfo, setInputKeyInfo] = React.useState<InputKeyInfoType>({
    inputKey: "",
    inputName: "",
  });


  // TODO: API 완성 후 상세조회 함수 연결
  const getIdsDetailMutation = useMutation(bottomQueries.getIdsDetail());
  const getIdsDetail = (appSeq : string ,idsSeq: string) => {
    const param = {
      appSeq,
      idsSeq
    }
    getIdsDetailMutation.mutate(param, {
      onSuccess: (response) => {
        form.reset(response.data);
      },
    });
  };

    useEffect(() => {
    const isEdit = !!rowData?.idsSeq;
    setIsEditMode(isEdit);

    if (open) {
      if (isEdit) {
        // 수정 모드: rowData로 form 채우기
        getIdsDetail(propData, rowData.idsSeq);
      } else {
        // 등록 모드: 초기화
        form.reset();
        form.setValue("appSeq", propData);
      }
    }
  }, [open, form, propData]);

  const onSubmit = (values: IdsModalFormInput) => {
    const modeText = isEditMode ? "수정" : "저장";

    openAlert({
      className: "w-[400px]",
      message: `${modeText}하시겠습니까?`,
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        // 수정 모드일 때 idsSeq 포함
        const payload = isEditMode ? { ...values, idsSeq: rowData.idsSeq } : values;

        //@ts-ignore
        createIdsMutation.mutate(payload, {
          onSuccess: (response) => {
            console.log("[성공]", response);
            onOpenChange(false);
            onSuccess?.({ callbackData: "IDS" });
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
  };

  const onClickUserModal = (inputKey: string, inputName: string) => {
    setIsUserOpenModal(true);
    setInputKeyInfo({
      inputKey,
      inputName,
    });
  };

  const onUserModalSuccess = (rtnData: SuccessUserData) => {
    console.log(rtnData.userInfo[0].name);
    form.setValue(rtnData.input.inputKey as any, rtnData.userInfo[0].id, { shouldValidate: true });
    form.setValue(rtnData.input.inputName as any, rtnData.userInfo[0].name, {
      shouldValidate: true,
    });
  };

  const onUserModalOpenChange = (isOpen: boolean) => {
    setIsUserOpenModal(isOpen);
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
    openAlert({
      className: "w-[400px]",
      message: "필수 값을 모두 입력해주세요.",
      confirmText: "확인",
    });
  };

  return (
    <>
      <FormProvider {...form}>
        <FormDialog
          // 수정/등록 타이틀 분기
          title={title ?? (isEditMode ? "IDS 서류 수정" : "IDS 서류 제출")}
          onSubmit={form.handleSubmit(onSubmit, onError)}
          // 버튼 텍스트 분기
          submitText={isEditMode ? "수정" : "저장"}
          open={open}
          onOpenChange={onOpenChange}
          className="max-w-200!"
        >
          <FlexBox vertical className="gap-4">
            <FlexBox className="items-end gap-2">
              <RHF.FormSelect
                control={form.control}
                name="occurCountryCode"
                items={[{ label: "트리니도토바고", value: "TT" }]}
                label="발생국가"
              />
              <RHF.FormDatePicker control={form.control} name="occurDate" label="발생일" />
              <RHF.Input control={form.control} name="occurNo" label="발생번호" maxLength={30} />
              <RHF.FormDatePicker control={form.control} name="idsPubDate" label="공개일" />
              <RHF.Input control={form.control} name="familyNoEn" label="패밀리영문번호" maxLength={30} />
              <RHF.FormDatePicker control={form.control} name="idsReceiptDate" label="접수일" />
              <RHF.FormDatePicker control={form.control} name="idsSendDate" label="IDS발송일" />
              <RHF.FormCheckbox
                control={form.control}
                name="isIdsSubmitted"
                label="IDS 기제출건"
                outputFormat={["Y", "N"]}
              />
            </FlexBox>
            <RHF.FormDatePicker control={form.control} name="idsDeadline" label="IDS제출마감일" />
            <RHF.FormDatePicker control={form.control} name="idsSubmitDate" label="IDS제출일" />

            <RHF.Input
              control={form.control}
              name="idsSubmitMngNm"
              label="제출담당자"
              actions={
                <>
                  <CustomTooltip message="선택하거나 입력 하세요">
                    <Button
                      className="w-5"
                      onClick={() => onClickUserModal("idsSubmitMng", "idsSubmitMngNm")}
                    >
                      <Icons.Search className="size-3" />
                    </Button>
                  </CustomTooltip>
                </>
              }
              className="w-30"
              inputDisabled
            />

            <RHF.Input control={form.control} name="idsSubmitMng" type={"hidden"} />
            <Separator className="border-t" />

            <div className="w-full">
              <RHF.FormTextarea
                control={form.control}
                name="note"
                label="메모 내용"
                className="min-h-40"
              />
            </div>
          </FlexBox>
        </FormDialog>
      </FormProvider>

      <UserModal
        open={isUserOpenModal}
        onOpenChange={onUserModalOpenChange}
        title="담당자 선택"
        input={inputKeyInfo}
        onSuccess={onUserModalSuccess}
      />
    </>
  );
};
