import {
  FlexBox,
  FormDialog,
  Icons,
  RHF,
} from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HistorySchema, type HistoryFormInput } from "@shared/schema/customer/customerModalsSchema";
import { useMutation } from "@tanstack/react-query";
import { customerQueries } from "@shared/query/customer/queries";
import { useAlertStore } from "@shared/store/useAlertStore.ts";

export const HistoryModal = ({ title = "변경사항 등록", open, onOpenChange, onSuccess, propData, editData }: ModalProps) => {
  const { openAlert } = useAlertStore();
  const form = useForm<HistoryFormInput>({
    resolver: zodResolver(HistorySchema),
    defaultValues: {
      fieldName: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      if (editData) {
        // actionDateTime: "2026-04-16 05:27:27" 와 같이 오므로 그대로 사용하거나 날짜만 추출
        const rawDate = editData.actionDateTime || "";
        const formattedDate = rawDate.includes(" ") ? rawDate.split(" ")[0] : rawDate;

        form.reset({
          actionDateTime: formattedDate,
          fieldName: editData.fieldName || "",
          beforeValue: editData.beforeValue || "",
          afterValue: editData.afterValue || "",
          note: editData.note || "",
        });
      } else {
        form.reset();
      }
    }
  }, [open, editData]);

  const saveMutation = useMutation(customerQueries.historySave());

  const onSubmit = (values: HistoryFormInput) => {
    // HistorySaveRequest 형태에 맞춰 매핑
    const payload: any = {
      tblSeq: propData,
      seq: editData?.seq || "",
      actionDateTime: values.actionDateTime || "",
      actionType: editData?.actionType || "",
      fieldName: values.fieldName,
      beforeValue: values.beforeValue || "",
      afterValue: values.afterValue || "",
      actionUser: editData?.actionUser || "",
    };

    const modeText = editData?.seq ? "수정" : "저장";
    openAlert({
      className: "w-[400px]",
      message: `${modeText}하시겠습니까?`,
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        saveMutation.mutate(payload, {
          onSuccess: () => {
            onSuccess?.({ callbackData: "HISTORY" } as any);
            form.reset();
            onOpenChange(false);
            setTimeout(() => {
              openAlert({ className: "w-[400px]", message: `${modeText}완료하였습니다`, confirmText: "확인" });
            }, 300);
          },
          onError: () => {
            openAlert({ message: "변경사항 저장에 실패했습니다.", confirmText: "확인" });
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
        className="max-w-180!"
      >
        <FlexBox vertical>
          <RHF.Input control={form.control} name="fieldName" label="변경항목" important />

          <FlexBox>
            <RHF.FormTextarea control={form.control} name="beforeValue" label="변경전" />
            <div className="pt-5">
              <Icons.ArrowRight className="size-4" />
            </div>
            <RHF.FormTextarea control={form.control} name="afterValue" label="변경후" />
          </FlexBox>
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
