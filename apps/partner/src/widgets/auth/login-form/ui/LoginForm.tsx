import { useLocation, useNavigate } from "react-router-dom";

import { LoginSchema, type LoginFormInput, type LoginFormOutput } from "../schema";
import { useLoginForm } from "../model/form";

import { FormProvider } from "react-hook-form";
import { FieldSeparator, Button, RHF } from "@repo/ui";

import kakao from "@repo/assets/images/ico_kako.png";
import naver from "@repo/assets/images/ico_naver.png";
import google from "@repo/assets/images/ico_google.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userQueries } from "../../../../shared/query/queries";
import { tokenProvider } from "@shared/providers/tokenProvider";
import { socialAuthUrls } from "@shared/api/auth/social";
import { useAlertStore } from "@shared/store/useAlertStore";

const LoginForm = () => {
  const form = useLoginForm();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { openAlert } = useAlertStore();
  const loginMutation = useMutation(userQueries.login());

  // 미인증으로 막혀서 들어온 경우 원래 시도한 URL이 location.state에 있음
  const returnUrl = (location.state as { from?: string } | null)?.from;

  const onSubmit = (values: LoginFormInput) => {
    const vaildData: LoginFormOutput = LoginSchema.parse(values);
    loginMutation.mutate(vaildData, {
      onSuccess: (response) => {
        // 새 로그인 시작 — 이전 세션 캐시 잔재 제거
        queryClient.clear();
        tokenProvider?.setAccessToken?.(response.data.accessToken);
        tokenProvider?.setRefreshToken?.(response.data.refreshToken);
        // 미인증 진입 차단으로 들어온 경우 원래 URL로 복귀
        navigate(returnUrl ?? "/dashboard", { replace: true });
      },
      onError: (error: any) => {
        const serverMessage =
          error?.message ?? error?.response?.data?.message;
        openAlert({
          message: serverMessage ?? "아이디 또는 비밀번호가 올바르지 않습니다.",
        });
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RHF.Input size="h44" control={form.control} name="userId" label="이메일" />
        <RHF.Input
          size="h44"
          control={form.control}
          type="password"
          name="userPw"
          label="비밀번호"
        />

        <div className="[&>button]:text-text-link dark:[&>button]:text-p-color-1 flex justify-between">
          <Button variant="link" size="h24" onClick={() => navigate("/join")}>
            회원가입
          </Button>
          {/*<Button variant="link" size="h24" onClick={() => navigate("/memModify")}>*/}
          {/*  회원정보수정*/}
          {/*</Button>*/}
          <div className="[&>button]:text-text-200 flex gap-2">
            <Button variant="link" size="h24" onClick={() => navigate("/idFind")}>
              아이디찾기
            </Button>
            <Button variant="link" size="h24" onClick={() => navigate("/pwFind")}>
              비밀번호찾기
            </Button>
          </div>
        </div>
        <Button type="submit" variant="primary" size="h44" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </Button>

        <div className="flex flex-col gap-4">
          <FieldSeparator className="mt-4 mb-2">SNS간편로그인</FieldSeparator>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => (window.location.href = socialAuthUrls.kakao())}
              className="size-12 overflow-hidden rounded-lg"
              aria-label="카카오 로그인"
            >
              <img src={kakao} alt="카카오 로그인" className="size-full object-cover" />
            </button>
            {/*<button type="button" onClick={() => (window.location.href = socialAuthUrls.naver())}>*/}
            {/*  <img src={naver} alt="네이버 로그인" />*/}
            {/*</button>*/}
            <button
              type="button"
              onClick={() => (window.location.href = socialAuthUrls.google())}
              className="size-12 overflow-hidden rounded-lg dark:bg-white"
              aria-label="구글 로그인"
            >
              <img src={google} alt="구글 로그인" className="size-full object-cover" />
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
