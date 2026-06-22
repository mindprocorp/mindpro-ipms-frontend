import { zodResolver } from "@hookform/resolvers/zod";
import type { ModalProps } from "@repo/schema";
import { FormDialog, RHF } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

const PasswordChangeSchema = z.object({
  password: z
    .string()
    .min(2, {
      message: "필수입력",
    })
    .default(""),
  newPassword: z
    .email()
    .min(2, {
      message: "필수입력",
    })
    .default(""),
  confirmNewPassword: z
    .string()
    .min(2, {
      message: "필수입력",
    })
    .default(""),
});

type PasswordChangeFormInput = z.input<typeof PasswordChangeSchema>;
type PasswordChangeFormOutput = z.output<typeof PasswordChangeSchema>;

const PasswordChangeModal = ({ open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<PasswordChangeFormInput>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: PasswordChangeSchema.parse({}),
  });
  const onSubmit = (values: PasswordChangeFormInput) => {
    const vaildData: PasswordChangeFormOutput = PasswordChangeSchema.parse(values);
    console.log(values);
    onOpenChange(false);
    onSuccess?.();
  };
  return (
    <FormProvider {...form}>
      <FormDialog
        title="비밀번호 변경"
        onSubmit={form.handleSubmit(onSubmit)}
        open={open}
        onOpenChange={onOpenChange}
      >
        <RHF.FormField vertical>
          <RHF.Input control={form.control} name="password" label="현재 비밀번호" />
          <RHF.Input control={form.control} name="newPassword" label="새 비밀번호" />
          <RHF.Input control={form.control} name="confirmNewPassword" label="새 비밀번호 확인" />
        </RHF.FormField>
      </FormDialog>
    </FormProvider>
  );
};

export default PasswordChangeModal;
