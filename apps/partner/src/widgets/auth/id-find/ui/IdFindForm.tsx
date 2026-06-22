import { useState } from "react";
import { useIdFindForm } from "@widgets/auth/id-find/model/form";
import { useNavigate } from "react-router-dom";
import { type IdFindSchemaType } from "../schema";
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
import AuthPageLinks from "@shared/components/AuthPageLinks";
const { UserSearch } = Icons;

const IdFindForm = () => {
  const navigate = useNavigate();
  const form = useIdFindForm();
  const { openAlert } = useAlertStore();
  const [result, setResult] = useState<{ maskedUserId: string; registeredDate: string } | null>(null);

  const findIdMutation = useMutation({
    ...userQueries.findId(),
    onSuccess: (res) => {
      if (res.data?.maskedUserId) {
        setResult(res.data);
      } else {
        openAlert({ message: "입력하신 정보와 일치하는 아이디를 찾을 수 없습니다." });
      }
    },
    onError: () => {
      openAlert({ message: "아이디 찾기에 실패하였습니다. 다시 시도해주세요." });
    },
  });

  const onSubmit = (values: IdFindSchemaType) => {
    setResult(null);
    findIdMutation.mutate({
      userNameKo: values.name,
      userMobileNo: values.phone,
    });
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
          <RHF.Input size="h44" control={form.control} name="name" label="이름" />
          <RHF.Input
            size="h44"
            control={form.control}
            name="phone"
            label="휴대폰 번호"
            mobileOnly
            inputMode="numeric"
          />

          <Button type="submit" variant="primary" size="h44" className="w-full" disabled={findIdMutation.isPending}>
            {findIdMutation.isPending ? "조회 중..." : "아이디 찾기"}
          </Button>
        </form>

        {result && (
          <Alert variant="info">
            <UserSearch />
            <AlertTitle className="text-md mb-1">회원님의 아이디를 찾았습니다.</AlertTitle>
            <AlertDescription>
              <p className="text-lg font-bold">{result.maskedUserId}</p>
              {result.registeredDate && (
                <p className="text-text-200 text-xs">가입일: {result.registeredDate}</p>
              )}
              <p className="text-text-200">아이디(이메일)를 확인하시고 로그인 해주세요</p>
            </AlertDescription>
          </Alert>
        )}

        <FieldSeparator />
        <AuthPageLinks items={["pwFind", "join", "home"]} />
      </div>
    </FormProvider>
  );
};

export default IdFindForm;
