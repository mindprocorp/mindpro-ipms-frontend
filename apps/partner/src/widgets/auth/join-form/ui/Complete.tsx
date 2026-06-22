import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertTitle, AlertDescription, Icons, FlexBox, Button, FieldSeparator } from "@repo/ui";
import { userQueries } from "@shared/query/queries";
import { tokenProvider } from "@shared/providers/tokenProvider";
import AuthPageLinks from "@shared/components/AuthPageLinks";

const { CircleCheck } = Icons;

const Complete = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: string;
  } | null;

  const loginMutation = useMutation(userQueries.login());

  const handleLogin = () => {
    if (state?.email && state?.password) {
      loginMutation.mutate(
        { userId: state.email, userPw: state.password },
        {
          onSuccess: (response) => {
            tokenProvider?.setAccessToken?.(response.data.accessToken);
            tokenProvider?.setRefreshToken?.(response.data.refreshToken);
            navigate("/dashboard", { replace: true });
          },
          onError: () => {
            navigate("/", { replace: true });
          },
        },
      );
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      <FlexBox vertical className="items-start">
        <h2 className="text-2xl">회원가입 완료</h2>
        <p className="text-text-100 text-xs">회원가입이 완료되었습니다.</p>
      </FlexBox>

      <Alert variant="success">
        <CircleCheck />
        <AlertTitle className="text-md mb-1">가입정보</AlertTitle>
        <AlertDescription>
          <ul className="-indent-2 text-xs [&>li]:relative [&>li]:pl-2 [&>li]:before:absolute [&>li]:before:content-['-']">
            <li>이름 : {state?.name || "-"}</li>
            <li>이메일 : {state?.email || "-"}</li>
            <li>휴대폰 번호 : {state?.phone || "-"}</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Button
        size="h44"
        variant="primary"
        className="w-full"
        onClick={handleLogin}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "로그인 중..." : "로그인"}
      </Button>

      <FieldSeparator />
      <AuthPageLinks items={["home"]} />
    </div>
  );
};

export default Complete;
