import { useIdFindForm } from "@widgets/auth/idFind/model/form";
import { useNavigate } from "react-router-dom";
import { type IdFindSchemaType } from "../schema";

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
const { UserRound, UserSearch } = Icons;

const IdFindForm = () => {
  const navigate = useNavigate();
  const form = useIdFindForm();
  const { openAlert } = useAlertStore();

  const onSubmit = (values: IdFindSchemaType) => {
    console.log(values);
  };

  const Message = () => {
    return (
      <div className="text-text-200 flex flex-col items-center gap-2 py-6 text-xs">
        <p>홍길동님의 아이디(이메일)은</p>
        <p className="text-text text-lg font-bold">example@gmail.com</p>
        <p>입니다.</p>
      </div>
    );
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <FlexBox vertical className="items-start">
          <h2 className="text-2xl">아이디 찾기</h2>
          <p className="text-text-100 text-xs">
            이름과 전화번호를 입력 후 아이디 찾기 버튼을 클릭하세요
          </p>
        </FlexBox>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <RHF.Input control={form.control} name="name" label="이름" />
          <RHF.Input control={form.control} type="password" name="phone" label="전화번호" />

          <Button type="submit" variant="primary" size="h44" className="w-full">
            아이디 찾기
          </Button>
        </form>

        <Alert variant="info">
          <UserSearch />
          <AlertTitle className="text-md mb-1">회원님의 아이디를 찾았습니다.</AlertTitle>
          <AlertDescription>
            <p className="text-lg font-bold">example@gmail.com</p>
            <p className="text-text-200">아이디(이메일)를 확인하시고 로그인 해주세요</p>
          </AlertDescription>
        </Alert>

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
            비밀번호 찾기
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

export default IdFindForm;
