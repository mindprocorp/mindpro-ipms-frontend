import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type PwFindSchemaType } from "../schema";
import { useMutation } from "@tanstack/react-query";
import { userQueries } from "@shared/query/queries";
import { useAlertStore } from "@shared/store/useAlertStore";

import { FormProvider } from "react-hook-form";
import {
  FieldSeparator,
  Button,
  FlexBox,
  Icons,
  Alert,
  AlertTitle,
  AlertDescription,
  RHF,
} from "@repo/ui";
import { usePwFindForm } from "../model/form";
import AuthPageLinks from "@shared/components/AuthPageLinks";
const { Mail } = Icons;

const PwFindForm = () => {
  const navigate = useNavigate();
  const form = usePwFindForm();
  const { openAlert } = useAlertStore();
  const [sent, setSent] = useState(false);

  const forgotMutation = useMutation({
    ...userQueries.forgotPassword(),
    onSuccess: () => {
      setSent(true);
    },
    onError: () => {
      openAlert({ message: "입력하신 정보와 일치하는 계정을 찾을 수 없습니다." });
    },
  });

  const onSubmit = (values: PwFindSchemaType) => {
    setSent(false);
    forgotMutation.mutate({
      userId: values.email,
      userNameKo: values.name,
      userMobileNo: values.phone,
    });
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <FlexBox vertical className="items-start">
          <h2 className="text-2xl">비밀번호 찾기</h2>
          <p className="text-text-100 text-xs">아래 정보를 입력하시고 비밀번호를 찾으세요.</p>
        </FlexBox>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <RHF.Input size="h44" control={form.control} name="email" label="이메일(아이디)" noSpace />
          <RHF.Input size="h44" control={form.control} name="name" label="이름" />
          <RHF.Input size="h44" control={form.control} name="phone" label="휴대폰 번호" mobileOnly inputMode="numeric" />

          <Button type="submit" variant="primary" size="h44" className="w-full" disabled={forgotMutation.isPending}>
            {forgotMutation.isPending ? "발송 중..." : "비밀번호 재설정"}
          </Button>
        </form>

        {sent && (
          <Alert variant="info">
            <Mail />
            <AlertTitle className="text-md mb-1">비밀번호 재설정 링크가 발송되었습니다.</AlertTitle>
            <AlertDescription>
              <p className="text-text-200">
                입력하신 이메일로 비밀번호 재설정 링크를 보내드렸습니다.
              </p>
              <p className="text-text-200">
                링크는 5분간 유효하며, 만료 시 다시 요청해주세요.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <FieldSeparator />
        <AuthPageLinks items={["idFind", "join", "home"]} />
      </div>
    </FormProvider>
  );
};

export default PwFindForm;
