import { useNavigate } from "react-router-dom";
import { type PwFindSchemaType } from "../schema";

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
import { useAlertStore } from "@shared/store/useAlertStore";
import { usePwFindForm } from "@widgets/auth/pwFind/model/form";
const { UserRound, UserSearch } = Icons;

const PwFindForm = () => {
  const navigate = useNavigate();
  const form = usePwFindForm();
  const { openAlert } = useAlertStore();

  const onSubmit = (values: PwFindSchemaType) => {
    console.log(values);
  };

  const Message = () => {
    return (
      <div className="py-6 text-center">
        <p>홍길동님의 이메일로( example@gmail.com)로 임시 비밀번호를 보내드렸습니다.</p>
      </div>
    );
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <FlexBox vertical className="items-start">
          <h2 className="text-2xl">비밀번호 찾기</h2>
          <p className="text-text-100 text-xs">아래 정보를 입력하시고 비밀번호를 찾으세요.</p>
        </FlexBox>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <RHF.Input control={form.control} name="email" label="이메일" />
          <RHF.Input control={form.control} name="name" label="이름" />
          <RHF.Input control={form.control} name="phone" label="전화번호" />

          <Button type="submit" variant="primary" size="h44" className="w-full">
            비밀번호 찾기
          </Button>
        </form>

        <FlexBox grow>
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              openAlert({
                // title: '테스트입니다.',
                className: "w-[400px]",
                message: <Message />,
                confirmText: "로그인",
                cancelText: "비밀번호찾기",
                onCancel: () => {
                  navigate("/");
                },
                onConfirm: () => {
                  navigate("/");
                },
              })
            }
          >
            아이디 찾기
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
            로그인
          </Button>
        </FlexBox>

        <FieldSeparator />

        <FlexBox className="justify-between">
          <div className="text-text-200 flex items-center gap-1 text-sm">
            <UserRound className="size-5" />
            아직 회원이 아니신가요?
          </div>
          <Button variant="link-blue">회원가입</Button>
        </FlexBox>
      </div>
    </FormProvider>
  );
};

export default PwFindForm;
