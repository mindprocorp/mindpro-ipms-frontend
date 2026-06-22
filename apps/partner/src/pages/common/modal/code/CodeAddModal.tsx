import { FlexBox, FormDialog, RHF } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAlertStore } from "@shared/store/useAlertStore";
import { commonQueries } from "@shared/query/common/queries";
import z from "zod";

const CodeAddSchema = z.object({
  grpCd: z.string(),
  cdNm: z.string(),
  delYn: z.string(),
  note: z.string(),
});

type CodeAddFormInput = z.infer<typeof CodeAddSchema>;

type CodeAddModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (grpCd: string) => void;
};

export const CodeAddModal = ({ open, onOpenChange, onSuccess }: CodeAddModalProps) => {
  const { openAlert } = useAlertStore();
  const form = useForm<CodeAddFormInput>({
    resolver: zodResolver(CodeAddSchema),
    defaultValues: {
      grpCd: "",
      cdNm: "",
      delYn: "N",
      note: "",
    },
  });

  const saveCodeGroupMutation = useMutation(commonQueries.saveCodeGroup());

  const onSubmit = () => {
    const values = form.getValues();
    if (!values.grpCd || !values.cdNm) {
      openAlert({ message: "분류코드와 코드명을 입력해주세요." });
      return;
    }
    saveCodeGroupMutation.mutate(
      {
        groupSeq: null,
        groupCode: values.grpCd,
        groupName: values.cdNm,
        delYn: values.delYn,
        createUser: "",
        updateUser: "",
      },
      {
        onSuccess: () => {
          onSuccess?.(values.grpCd);
          handleClose();
        },
        onError: () => openAlert({ message: "저장에 실패했습니다." }),
      }
    );
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title="코드추가"
        onSubmit={onSubmit}
        submitText="저장"
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose();
          else onOpenChange(isOpen);
        }}
      >
        <FlexBox vertical>
          <FlexBox>
            <RHF.Input control={form.control} name="grpCd" label="분류코드" ess />
            <RHF.Input control={form.control} name="cdNm" label="코드명" ess />
          </FlexBox>
          <FlexBox vertical>
            <RHF.FormSelect
              control={form.control}
              name="delYn"
              items={[
                { label: "Y", value: "Y" },
                { label: "N", value: "N" },
              ]}
              label="사용여부"
            />
            <RHF.FormTextarea control={form.control} name="note" label="비고" />
          </FlexBox>
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
