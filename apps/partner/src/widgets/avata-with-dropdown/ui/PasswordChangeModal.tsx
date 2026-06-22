import { FormDialog, Icons, RHF } from "@repo/ui";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useAlertStore } from "@shared/store/useAlertStore";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Schema = z
  .object({
    currentPw: z.string().min(1, { message: "현재 비밀번호를 입력해주세요." }),
    newPw: z
      .string()
      .min(8, { message: "비밀번호는 8자리 이상이어야 합니다." })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/, {
        message: "영문, 숫자, 특수문자를 포함해야 합니다.",
      }),
    newPwConfirm: z.string().min(1, { message: "비밀번호 재확인을 입력해주세요." }),
  })
  .refine((data) => data.newPw === data.newPwConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["newPwConfirm"],
  });
type Input = z.input<typeof Schema>;

const PasswordChangeModal = ({ open, onOpenChange }: Props) => {
  const user = useAuthStore((s) => s.user);
  const { openAlert } = useAlertStore();
  const form = useForm<Input>({
    resolver: zodResolver(Schema),
    defaultValues: { currentPw: "", newPw: "", newPwConfirm: "" },
  });

  // 회원가입과 동일하게 비번 일치 시 ✓ / 불일치 시 × 표시
  const newPw = useWatch({ control: form.control, name: "newPw" });
  const newPwConfirm = useWatch({ control: form.control, name: "newPwConfirm" });
  const pwMatch = newPw && newPwConfirm && newPw === newPwConfirm;

  const pwMutation = useMutation({
    ...commonQueries.changePassword(),
    onSuccess: () => {
      openAlert({ message: "비밀번호가 변경되었습니다." });
      handleClose();
    },
    onError: (err: any) => {
      form.setError("currentPw", {
        message: err?.response?.data?.message ?? "비밀번호 변경에 실패했습니다.",
      });
    },
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleSubmit = form.handleSubmit((values) => {
    if (!user) return;
    pwMutation.mutate({
      userId: user.userId,
      payload: { currentPw: values.currentPw, newPw: values.newPw },
    });
  });

  return (
    <FormProvider {...form}>
      <FormDialog
        open={open}
        onOpenChange={(o) => (!o ? handleClose() : onOpenChange(o))}
        title="비밀번호 변경"
        onSubmit={handleSubmit}
        submitText="변경"
        className="max-w-sm"
      >
        <div className="flex flex-col gap-3 py-2">
          <RHF.Input
            size="h44"
            control={form.control}
            name="currentPw"
            type="password"
            label="현재 비밀번호"
            ess
            noSpace
          />
          <RHF.Input
            size="h44"
            control={form.control}
            name="newPw"
            type="password"
            label="새 비밀번호"
            ess
            noSpace
          />
          <RHF.Input
            size="h44"
            control={form.control}
            name="newPwConfirm"
            type="password"
            label="새 비밀번호 확인"
            ess
            noSpace
            suffix={
              newPwConfirm
                ? pwMatch
                  ? <Icons.Check className="size-4 text-green-600" />
                  : <Icons.X className="text-destructive size-4" />
                : null
            }
          />
          <p className="text-text-200 text-xs">※ 비밀번호는 영문 대/소문자 특수문자를 포함한 8자리 이상</p>
        </div>
      </FormDialog>
    </FormProvider>
  );
};

export default PasswordChangeModal;
