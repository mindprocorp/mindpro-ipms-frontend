import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { userQueries } from "@shared/query/queries";
import { useAlertStore } from "@shared/store/useAlertStore";
import {
  Button,
  FlexBox,
  Icons,
  Alert,
  AlertTitle,
  AlertDescription,
  RHF,
} from "@repo/ui";

const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "8자 이상 입력해주세요." })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/, {
        message: "영문, 숫자, 특수문자를 포함해야 합니다.",
      }),
    confirmPassword: z.string().min(1, { message: "비밀번호 확인을 입력해주세요." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormType = z.infer<typeof ResetPasswordSchema>;

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);
  const { openAlert } = useAlertStore();

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const resetMutation = useMutation({
    ...userQueries.resetPassword(),
    onSuccess: () => {
      setSuccess(true);
    },
    onError: () => {
      openAlert({ message: "링크가 만료되었거나 유효하지 않습니다.\n비밀번호 찾기를 다시 진행해주세요." });
    },
  });

  const onSubmit = (values: ResetPasswordFormType) => {
    if (!token) return;
    resetMutation.mutate({
      token,
      newPassword: values.newPassword,
    });
  };

  if (!token) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <Icons.AlertCircle />
          <AlertTitle>잘못된 접근입니다.</AlertTitle>
          <AlertDescription>유효하지 않은 링크입니다. 비밀번호 찾기를 다시 진행해주세요.</AlertDescription>
        </Alert>
        <Button variant="primary" size="h44" className="w-full" onClick={() => navigate("/pwFind")}>
          비밀번호 찾기로 이동
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6">
        <Alert variant="info">
          <Icons.CheckCircle />
          <AlertTitle className="text-md mb-1">비밀번호가 변경되었습니다.</AlertTitle>
          <AlertDescription>새 비밀번호로 로그인해주세요.</AlertDescription>
        </Alert>
        <Button variant="primary" size="h44" className="w-full" onClick={() => navigate("/")}>
          로그인
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <FlexBox vertical className="items-start">
          <h2 className="text-2xl">비밀번호 재설정</h2>
          <p className="text-text-100 text-xs">새로운 비밀번호를 입력해주세요.</p>
        </FlexBox>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <RHF.Input
            size="h44"
            control={form.control}
            name="newPassword"
            label="새 비밀번호"
            type="password"
          />
          <RHF.Input
            size="h44"
            control={form.control}
            name="confirmPassword"
            label="비밀번호 확인"
            type="password"
          />

          <p className="text-text-200 text-xs">
            영문, 숫자, 특수문자를 포함한 8자리 이상
          </p>

          <Button type="submit" variant="primary" size="h44" className="w-full" disabled={resetMutation.isPending}>
            {resetMutation.isPending ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};

export default ResetPasswordForm;
