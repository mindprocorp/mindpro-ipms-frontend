import {
  Button,
  FlexBox,
  FormDialog,
  RHF,
  AddressForm,
} from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ManagerSchema, type ManagerFormInput } from "@shared/schema/customer/customerModalsSchema";
import { useMutation } from "@tanstack/react-query";
import { customerQueries } from "@shared/query/customer/queries";
import { useAlertStore } from "@shared/store/useAlertStore.ts";

export const ManagerModal = ({ title = "담당자 등록", open, onOpenChange, onSuccess, propData, editData }: ModalProps) => {
  const { openAlert } = useAlertStore();
  const form = useForm<ManagerFormInput>({
    resolver: zodResolver(ManagerSchema),
    defaultValues: {
      participantCode: editData?.participantCode || "",
      userNameKo: editData?.userNameKo || "",
      userMobileNo: editData?.userMobileNo || "",
      deptName: editData?.deptName || "",
      userTelNo: editData?.userTelNo || "",
      userPosition: editData?.userPosition || "",
      userFaxNo: editData?.userFaxNo || "",
      userEmail: editData?.userEmail || "",
      userPostNo: editData?.userPostNo || "",
      userAddr: editData?.userAddr || "",
      userAddrDetail: editData?.userAddrDetail || "",
      note: editData?.note || "",
      etaxYn: editData?.etaxYn === "Y",
    },
  });

  React.useEffect(() => {
    if (open && editData) {
      form.reset({
        participantCode: editData?.participantCode || "",
        userNameKo: editData?.userNameKo || "",
        userMobileNo: editData?.userMobileNo || "",
        deptName: editData?.deptName || "",
        userTelNo: editData?.userTelNo || "",
        userPosition: editData?.userPosition || "",
        userFaxNo: editData?.userFaxNo || "",
        userEmail: editData?.userEmail || "",
        userPostNo: editData?.userPostNo || "",
        userAddr: editData?.userAddr || "",
        userAddrDetail: editData?.userAddrDetail || "",
        note: editData?.note || "",
        etaxYn: editData?.etaxYn === "Y",
      });
    } else if (!open) {
      form.reset();
    }
  }, [editData, open, form]);

  const saveMutation = useMutation(customerQueries.managerSave());

  const onSubmit = (values: ManagerFormInput) => {
    const payload = {
      tblSeq: propData,
      userInfoSeq: editData?.userInfoSeq || "",
      participantCode: values.participantCode,
      participantSeq: editData?.participantSeq || "",
      userNameKo: values.userNameKo,
      userMobileNo: values.userMobileNo,
      deptName: values.deptName,
      userTelNo: values.userTelNo,
      userPosition: values.userPosition,
      userFaxNo: values.userFaxNo,
      userEmail: values.userEmail,
      userPostNo: values.userPostNo,
      userAddr: values.userAddr,
      userAddrDetail: values.userAddrDetail,
      note: values.note,
      etaxYn: values.etaxYn ? "Y" : "N",
    };

    const modeText = editData?.participantSeq ? "수정" : "저장";
    openAlert({
      className: "w-[400px]",
      message: `${modeText}하시겠습니까?`,
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        saveMutation.mutate(payload as any, {
          onSuccess: () => {
            onSuccess?.({ callbackData: "MANAGER" } as any);
            form.reset();
            onOpenChange(false);
            setTimeout(() => {
              openAlert({ className: "w-[400px]", message: `${modeText}완료하였습니다`, confirmText: "확인" });
            }, 300);
          },
          onError: () => {
            openAlert({ message: "담당자 저장에 실패했습니다.", confirmText: "확인" });
          },
        });
      },
    });
  };

  const onError = () => {
    openAlert({ message: "필수 항목을 모두 입력해주세요.", confirmText: "확인" });
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
      >
        <FlexBox vertical>
          <FlexBox>
            <RHF.Input
              orientation="horizontal"
              control={form.control}
              name="participantCode"
              label="업무구분"
              className="data-[slot=field]:w-56"
            />
            <RHF.FormCheckbox
              control={form.control}
              name="etaxYn"
              label="e-Tex 담당자"
              size="sm"
            />
          </FlexBox>

          <FlexBox>
            <RHF.Input control={form.control} name="userNameKo" label="담당자" />
            <RHF.Input control={form.control} name="userMobileNo" label="휴대폰" telOnly />
          </FlexBox>

          <FlexBox>
            <RHF.Input control={form.control} name="deptName" label="부서" />
            <RHF.Input control={form.control} name="userTelNo" label="전화" telOnly />
          </FlexBox>

          <FlexBox>
            <RHF.Input control={form.control} name="userPosition" label="직책" />
            <RHF.Input control={form.control} name="userFaxNo" label="팩스" telOnly />
          </FlexBox>

          <RHF.Input control={form.control} name="userEmail" label="이메일" />

          <AddressForm
            setValue={form.setValue}
            addressFieldName="userAddr"
            detailFieldName="userAddrDetail"
            zonecodeFieldName="userPostNo"
          />
          <RHF.FormTextarea control={form.control} name="note" label="메모" />
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
