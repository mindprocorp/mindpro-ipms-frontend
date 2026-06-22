import { useNavigate } from "react-router-dom";

import { LoginSchema, type LoginFormInput, type LoginFormOutput } from "../schema";
import { useLoginForm } from "../model/form";

import { Link } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import { FieldSeparator, Button, RHF } from "@repo/ui";

import kakao from "@repo/assets/images/ico_kako.png";
import naver from "@repo/assets/images/ico_naver.png";
import google from "@repo/assets/images/ico_google.png";
import { useMutation } from "@tanstack/react-query";
import { userQueries } from "@shared/query/queries";

const LoginForm = () => {
  const form = useLoginForm();
  const navigate = useNavigate();

  const loginMutation = useMutation(userQueries.login());

  const onSubmit = (values: LoginFormInput) => {
    const vaildData: LoginFormOutput = LoginSchema.parse(values);
    loginMutation.mutate(vaildData, {
      onSuccess: () => {
        const target = import.meta.env.VITE_API_PARTNER_URL;
        navigate(target + "/dashboard");
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RHF.Input control={form.control} name="userId" label="이메일" />
        <RHF.Input control={form.control} type="password" name="userPw" label="비밀번호" />

        <div className="[&>button]:text-text-link flex justify-between">
          <Button variant="link" size="h24" onClick={() => navigate("/join")}>
            회원가입
          </Button>
          <Button variant="link" size="h24" onClick={() => navigate("/memModify")}>
            회원정보수정
          </Button>
          <div className="[&>button]:text-text-200 flex gap-2">
            <Button variant="link" size="h24" onClick={() => navigate("/idFind")}>
              아이디찾기
            </Button>
            <Button variant="link" size="h24" onClick={() => navigate("/pwFind")}>
              비밀번호찾기
            </Button>
          </div>
        </div>
        <Button type="submit" variant="primary" size="h44" className="w-full">
          로그인
        </Button>

        <div className="flex flex-col gap-4">
          <FieldSeparator className="mt-4 mb-2">SNS간편로그인</FieldSeparator>
          <div className="flex justify-center gap-4">
            <Link to="http://naver.com" target="_blank">
              <img src={kakao} />
            </Link>
            <Link to="http://naver.com" target="_blank">
              <img src={naver} />
            </Link>
            <Link to="http://naver.com" target="_blank">
              <img src={google} />
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
