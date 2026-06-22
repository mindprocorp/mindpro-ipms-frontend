import { FormProvider } from "react-hook-form";

//Widgets
import { useJoinForm } from "../../../../widgets/auth/joinForm/model/form";
import CorporationForm from "../../../../widgets/auth/joinForm/ui/CorporationForm";
import IndividualForm from "../../../../widgets/auth/joinForm/ui/IndividualForm";
import { type JoinSchemaType } from "../schema";
import { type UserRole } from "../../../../shared/providers/store/authStore";

//ui
import {
  Button,
  FlexBox,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  Icons,
  InfoBox,
} from "@repo/ui";
const { AlertCircleIcon } = Icons;

import TermsAndAgreements from "@features/termsAndAgreements/ui/TermsAndAgreements";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

// Query
import { userQueries } from "../../../../shared/query/queries";

const JoinForm = () => {
  const form = useJoinForm();

  const [acount, setAcount] = useState<UserRole>("ROLE_USER");
  const navigate = useNavigate();

  const tabClickHandler = (value: UserRole) => {
    setAcount(value as UserRole);
    form.setValue("role", value);
    form.clearErrors();
  };

  // 개인 회원가입
  const registerMutation = useMutation({
    ...userQueries.register(),
    onSuccess: () => navigate("/complete"),
  });

  // 사업자 회원가입
  const registerCorporateMutation = useMutation({
    ...userQueries.registerCorporate(),
    onSuccess: () => navigate("/complete"),
  });

  const onSubmit = (values: JoinSchemaType) => {
    const isCorporate = values.role === "ROLE_CROP";

    if (isCorporate) {
      registerCorporateMutation.mutate({
        userCategoryCode: "CORPORATE",
        userEmail: values.email,
        userPassword: values.password,
        userName: values.name,
        mobileNo: values.phone,
        userAddr: values.address,
        userAddrDetail: values.addressDetail,
        userZipCode: values.zonecode,
        termsAgree: values.termsAgree,
        privacyPolicyAgree: values.privacyPolicyAgree,
        marketingAgree: values.marketingAgree ?? false,
        corpInfo: {
          corpType: values.cropType,
          corpName: values.corpName,
          ceoName: values.ceoName,
          corpTel: values.corpPhone,
          corpFax: values.corpFax,
          corpAddr: values.corpAddress,
          corpAddrDetail: values.corpAddressDetail,
          corpZipCode: values.corpZonecode,
          corpRegNumber: values.corpRegNumber,
          businessLicenseFileUrl: "/BLFU/01",
        },
      });
    } else {
      registerMutation.mutate({
        userCategoryCode: "INDIVIDUAL",
        userEmail: values.email,
        userPassword: values.password,
        userName: values.name,
        mobileNo: values.phone,
        userAddr: values.address,
        userAddrDetail: values.addressDetail,
        userZipCode: values.zonecode,
        termsAgree: values.termsAgree,
        privacyPolicyAgree: values.privacyPolicyAgree,
        marketingAgree: values.marketingAgree ?? false,
      });
    }
  };

  const onError = (errors: any) => {
    console.error("폼 유효성 검사 실패:", errors);
  };
  return (
    <>
      <FormProvider {...form}>
        <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
          <Tabs
            defaultValue="ROLE_USER"
            className="h-11 w-full [&>div]:w-full"
            onValueChange={(value) => tabClickHandler(value as UserRole)}
          >
            <TabsList>
              <TabsTrigger value="ROLE_USER">개인회원</TabsTrigger>
              <TabsTrigger value="ROLE_CROP">사업자(법인)회원</TabsTrigger>
            </TabsList>
          </Tabs>

          <InfoBox title="회원가입 안내" icon={AlertCircleIcon}>
            <li>회사소속의 발명자 분들은 사업자(법인) 회원으로 가입하시기 바랍니다.</li>
            <li>
              개인회원은 사업자(법인) 회원으로 전환이 가능하지만 사업자(법인) 회원은 개인회원으로
              전환이 불가 하므로 이점 참고하시기 바랍니다.
            </li>
          </InfoBox>

          <IndividualForm />

          {/* 기업인 경우 */}
          {acount === "ROLE_CROP" && (
            <div className="space-y-8">
              <Separator className="mt-10" />
              <CorporationForm />
            </div>
          )}

          <Separator className="mt-10" />

          <TermsAndAgreements />

          <FlexBox grow>
            <Button variant="outline" className="w-full" type="button" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button type="submit" variant="primary" className="w-full">
              회원가입
            </Button>
          </FlexBox>
        </form>
      </FormProvider>
    </>
  );
};

export default JoinForm;
