import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useJoinForm } from "@widgets/auth/join-form/model/form";
import { type JoinSchemaType } from "@widgets/auth/join-form/schema";
import IndividualForm from "@widgets/auth/join-form/ui/IndividualForm";
import CorporationForm from "@widgets/auth/join-form/ui/CorporationForm";
import TermsAndAgreements from "@features/terms-and-agreements/ui/TermsAndAgreements";
import { userQueries } from "@shared/query/queries";
import { Button, Separator, Tabs, TabsList, TabsTrigger, Icons, InfoBox, FieldSeparator } from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore";
import AuthPageLinks from "@shared/components/AuthPageLinks";

type SocialState = {
  socialEmail?: string;
  provider?: string;
  providerId?: string;
  userName?: string;
  userPhone?: string;
} | null;

/** 에러 발생 시 순서대로 첫 번째 에러 필드를 찾아 토스트 + 포커싱 */
const FIELD_ORDER: [string, string][] = [
  ["name", "성명"], ["phone", "휴대폰 번호"], ["phoneChecked", "휴대폰 번호"],
  ["email", "이메일"], ["emailVerified", "이메일 인증"],
  ["password", "비밀번호"], ["confirmPassword", "비밀번호 재확인"],
  ["cropType", "회사 가입구분"], ["ceoName", "대표자명"], ["corpName", "회사명"],
  ["corpPhone", "대표전화"], ["corpFax", "팩스"],
  ["corpRegNumber", "사업자등록번호"], ["corpRegVerified", "사업자등록번호 검증"],
  ["corpPaperUrl", "사업자등록증"],
  ["termsAgree", "이용약관"], ["privacyPolicyAgree", "개인정보처리방침"],
];


const JoinForm = () => {
  const { openAlert } = useAlertStore();
  const form = useJoinForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [accountType, setAccountType] = useState("ROLE_USER");
  const [isSocialJoin, setIsSocialJoin] = useState(false);
  const bizFileRef = useRef<File | null>(null);

  const focusFirstError = (errors: Record<string, unknown>) => {
    const match = FIELD_ORDER.find(([key]) => key in errors);
    const [key, label] = match || [Object.keys(errors)[0], Object.keys(errors)[0]];

    openAlert({
      message: `'${label}'을(를) 확인해주세요.`,
      confirmText: "확인",
      showCancel: false,
    });

    const focusKey = key === "phoneChecked" ? "phone" : key;
    const el = document.querySelector<HTMLElement>(`[name="${focusKey}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus();
  };

  // 소셜 로그인에서 넘어온 경우
  useEffect(() => {
    const state = location.state as SocialState;
    if (!state?.userName && !state?.userPhone) return;

    setIsSocialJoin(true);
    if (state.socialEmail) form.setValue("email", state.socialEmail);
    if (state.userName) form.setValue("name", state.userName);
    if (state.userPhone) form.setValue("phone", state.userPhone);
    form.setValue("emailVerified", true);
  }, [location.state]);

  const goComplete = () => {
    const { name, email, phone, password, role } = form.getValues();
    navigate("/complete", { state: { name, email, phone, password, role } });
  };

  const registerMutation = useMutation({ ...userQueries.register(), onSuccess: goComplete });
  const registerCorporateMutation = useMutation({ ...userQueries.registerCorporate(), onSuccess: goComplete });

  const onSubmit = (values: JoinSchemaType) => {
    const state = location.state as SocialState;
    const socialInfo = state?.provider
      ? { socialProvider: state.provider, socialProviderId: state.providerId, socialEmail: state.socialEmail }
      : {};

    const basePayload = {
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
      ...socialInfo,
    };

    if (values.role === "ROLE_CROP") {
      registerCorporateMutation.mutate({
        ...basePayload,
        userCategoryCode: "CORPORATE",
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
        },
        bizFile: bizFileRef.current ?? undefined,
      });
    } else {
      registerMutation.mutate({
        ...basePayload,
        userCategoryCode: "INDIVIDUAL",
        officeId: values.companyId || undefined,
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit, focusFirstError)}
        className="space-y-6"
      >
        <Tabs
          defaultValue="ROLE_USER"
          className="h-11 w-full [&>div]:w-full"
          onValueChange={(v) => {
            setAccountType(v);
            form.setValue("role", v as "ROLE_USER" | "ROLE_CROP");
            form.clearErrors();
          }}
        >
          <TabsList>
            <TabsTrigger value="ROLE_USER">개인회원</TabsTrigger>
            <TabsTrigger value="ROLE_CROP">사업자(법인)회원</TabsTrigger>
          </TabsList>
        </Tabs>

        <InfoBox title="회원가입 안내" icon={Icons.AlertCircleIcon}>
          <li>회사소속의 발명자 분들은 사업자(법인) 회원으로 가입하시기 바랍니다.</li>
          <li>
            개인회원은 사업자(법인) 회원으로 전환이 가능하지만 사업자(법인) 회원은 개인회원으로
            전환이 불가 하므로 이점 참고하시기 바랍니다.
          </li>
        </InfoBox>

        <IndividualForm isSocialJoin={isSocialJoin} />

        {accountType === "ROLE_CROP" && (
          <div className="space-y-6">
            <Separator />
            <CorporationForm onFileSelect={(file) => { bizFileRef.current = file; }} />
          </div>
        )}

        <Separator />
        <TermsAndAgreements />

        <Button size="h44" type="submit" variant="primary" className="w-full">
          회원가입
        </Button>

        <FieldSeparator />
        <AuthPageLinks items={["home"]} />
      </form>
    </FormProvider>
  );
};

export default JoinForm;
