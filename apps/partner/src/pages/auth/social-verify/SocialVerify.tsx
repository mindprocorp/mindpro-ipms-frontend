import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IdFindSchema, type IdFindSchemaType } from "@widgets/auth/id-find/schema";
import { socialCheckAccount, socialLinkAccount } from "@shared/api/auth/social";
import { tokenProvider } from "@shared/providers/tokenProvider";
import { useAlertStore } from "@shared/store/useAlertStore";
import OnlyForm from "@shared/router/layout/page/OnlyForm";

import { FieldSeparator, Button, FlexBox, RHF } from "@repo/ui";
import AuthPageLinks from "@shared/components/AuthPageLinks";

const SocialVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAlert } = useAlertStore();
  const [loading, setLoading] = useState(false);

  const state = location.state as {
    socialEmail?: string;
    socialName?: string;
    provider?: string;
    providerId?: string;
  } | null;

  const form = useForm<IdFindSchemaType>({
    resolver: zodResolver(IdFindSchema),
    defaultValues: { name: "", phone: "" },
  });

  if (!state?.provider) {
    navigate("/", { replace: true });
    return null;
  }

  const providerLabel = { KAKAO: "카카오", GOOGLE: "구글", NAVER: "네이버" }[state.provider?.toUpperCase() ?? ""] ?? state.provider;

  const goToJoin = () => {
    const values = form.getValues();
    navigate("/join", {
      replace: true,
      state: {
        socialEmail: state.socialEmail,
        socialName: state.socialName,
        provider: state.provider,
        providerId: state.providerId,
        userName: values.name,
        userPhone: values.phone,
      },
    });
  };

  const handleLink = async () => {
    const values = form.getValues();
    setLoading(true);
    try {
      const linkResult = await socialLinkAccount(
        values.name, values.phone,
        state.provider!, state.providerId!, state.socialEmail,
      );
      if (linkResult.authenticated && linkResult.loginResponse) {
        tokenProvider?.setAccessToken?.(linkResult.loginResponse.accessToken);
        tokenProvider?.setRefreshToken?.(linkResult.loginResponse.refreshToken);
        openAlert({
          title: "연동 완료",
          message: (
            <div className="space-y-2 text-sm">
              <p>{providerLabel} 로그인이 연동되었습니다.</p>
              <p>다음부터 {providerLabel}로 바로 로그인됩니다.</p>
            </div>
          ),
          onConfirm: () => navigate("/dashboard", { replace: true }),
        });
      }
    } catch {
      openAlert({ message: "연동 중 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: IdFindSchemaType) => {
    setLoading(true);
    try {
      const checkResult = await socialCheckAccount(values.name, values.phone);
      if (checkResult) {
        openAlert({
          title: "기존 계정 확인",
          message: (
            <div className="space-y-3 text-sm">
              <p>기존 회원 정보가 확인되었습니다.</p>
              <div className="bg-muted rounded-md p-3 space-y-1">
                <p>아이디: <strong>{checkResult.maskedUserId}</strong></p>
                <p>가입일: <strong>{checkResult.registeredDate}</strong></p>
              </div>
              <p>이 계정에 {providerLabel} 로그인을 연동하시겠습니까?</p>
            </div>
          ),
          confirmText: "연동하기",
          cancelText: "취소",
          onConfirm: () => handleLink(),
          onCancel: () => navigate("/", { replace: true }),
        });
      } else {
        openAlert({
          title: "신규 회원",
          message: (
            <div className="space-y-2 text-sm">
              <p>입력하신 정보와 일치하는 계정이 없습니다.</p>
              <p>회원가입 완료 후 {providerLabel} 로그인이 자동 연동됩니다.</p>
            </div>
          ),
          confirmText: "회원가입",
          onConfirm: goToJoin,
        });
      }
    } catch {
      openAlert({ message: "계정 확인 중 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnlyForm className="items-center [&>div]:w-[315px]">
      <FormProvider {...form}>
        <div className="space-y-6">
          <FlexBox vertical className="items-start">
            <h2 className="text-2xl">계정 확인</h2>
            <p className="text-text-100 text-xs">
              이름과 전화번호를 입력하여 기존 계정을 확인합니다
            </p>
          </FlexBox>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RHF.Input size="h44" control={form.control} name="name" label="이름" />
            <RHF.Input
              size="h44"
              control={form.control}
              name="phone"
              label="휴대폰 번호"
              mobileOnly
              inputMode="numeric"
            />

            <Button type="submit" variant="primary" size="h44" className="w-full" disabled={loading}>
              {loading ? "확인 중..." : "계정 확인"}
            </Button>
          </form>

          <FieldSeparator />
          <AuthPageLinks items={["home"]} />
        </div>
      </FormProvider>
    </OnlyForm>
  );
};

export default SocialVerify;
