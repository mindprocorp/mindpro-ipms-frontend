import {
  FlexBox,
  FormDialog,
  RHF,
} from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MandateSchema, type MandateFormInput } from "@shared/schema/customer/customerModalsSchema";
import { useMutation } from "@tanstack/react-query";
import { customerQueries } from "@shared/query/customer/queries";
import { useAlertStore } from "@shared/store/useAlertStore.ts";

export const MandateModal = ({ title = "포괄위임 등록", open, onOpenChange, onSuccess, propData, editData }: ModalProps) => {
  const { openAlert } = useAlertStore();
  const form = useForm<MandateFormInput>({
    resolver: zodResolver(MandateSchema),
    defaultValues: {
      attorneyName: editData?.attorneyName || "",
      designatedAttorney: editData?.designatedAttorney || "",
      agentNo: editData?.agentNo || "",
      mandateDate: editData?.mandateDate || "",
      mandateWrapperNo: editData?.mandateWrapperNo || "",
      mandateRange: editData?.mandateRange || "",
      patentCustomerNo: editData?.patentCustomerNo || "",
      note: editData?.note || "",
    },
  });

  const saveMutation = useMutation(customerQueries.mandateSave());

  const onSubmit = (values: MandateFormInput) => {
    const payload = {
      customerSeq: propData,
      wrappermandateSeq: editData?.wrappermandateSeq || "",
      attorneyName: values.attorneyName,
      designatedAttorney: values.designatedAttorney,
      agentNo: values.agentNo,
      mandateDate: values.mandateDate ? values.mandateDate.replace(/-/g, "") : "",
      mandateWrapperNo: values.mandateWrapperNo,
      mandateRange: values.mandateRange,
      patentCustomerNo: values.patentCustomerNo,
      note: values.note,
    };

    const modeText = editData?.wrappermandateSeq ? "수정" : "저장";
    openAlert({
      className: "w-[400px]",
      message: `${modeText}하시겠습니까?`,
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        saveMutation.mutate(payload, {
          onSuccess: () => {
            onSuccess?.({ callbackData: "MANDATE" } as any);
            form.reset();
            onOpenChange(false);
            setTimeout(() => {
              openAlert({ className: "w-[400px]", message: `${modeText}완료하였습니다`, confirmText: "확인" });
            }, 300);
          },
          onError: () => {
            openAlert({ message: "포괄위임 저장에 실패했습니다.", confirmText: "확인" });
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
              control={form.control}
              name="attorneyName"
              label="변리사명"
              important
            />
            <RHF.Input control={form.control} name="designatedAttorney" label="지정변리사" />
          </FlexBox>

          <FlexBox>
            <RHF.Input control={form.control} name="agentNo" label="대리인번호" />
            <RHF.FormDatePicker control={form.control} name="mandateDate" label="위임일자" important />
          </FlexBox>
          <FlexBox>
            <RHF.Input control={form.control} name="mandateWrapperNo" label="위임번호" krAppNoOnly important />
            <RHF.Input control={form.control} name="mandateRange" label="위임범위" />
          </FlexBox>
          <RHF.Input control={form.control} name="patentCustomerNo" label="고객특허번호" />

          <RHF.FormTextarea control={form.control} name="note" label="메모" />
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
