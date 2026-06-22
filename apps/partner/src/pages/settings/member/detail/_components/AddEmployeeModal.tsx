import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { FlexBox, FormDialog, Icons, RHF, Separator } from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore";
import { userQueries } from "@shared/query/queries";
import { employeeQueries, orgQueries } from "@shared/query/organization/queries";
import { commonQueries } from "@shared/query/common/queries";
import { publicApiClient } from "@shared/api/client";
import { systemApi } from "@shared/api/system/systemApi";
import { CODE_CLASS } from "@shared/enum/organizationType";
import type { OfficeCodeVO, DeptVO } from "@shared/api/organization/orgApi";
import type { CodeDetail } from "@shared/api/common/commApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import EmployeeFormFields from "./EmployeeFormFields";

// ─── 스키마 ──────────────────────────────────────────────

const schema = z.object({
  // 계정
  name: z.string().min(1, "이름을 입력해주세요."),
  phone: z.string().regex(/^\d{11}$/, "휴대폰 번호 11자리를 입력해주세요."),
  email: z.string().email("이메일 형식이 올바르지 않습니다."),
  password: z.string().min(8, "8자 이상 입력해주세요.").regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/, "영문, 숫자, 특수문자를 조합해주세요."),
  confirmPassword: z.string().min(1, "비밀번호 확인"),
  // 조직
  deptName: z.string().optional().default(""),
  userPosition: z.string().optional().default(""),
  positionCode: z.string().optional().default(""),
  jobGradeCode: z.string().optional().default(""),
  workCode: z.string().optional().default(""),
  // 상태
  userTypeCode: z.string().optional().default(""),
  workStatusCode: z.string().optional().default(""),
  employStatusCode: z.string().optional().default(""),
  acctStatusCode: z.string().optional().default(""),
  // 역할
  roleSeq: z.string().optional().default(""),
  // EmployeeFormFields 가 요구하지만 등록 단계에선 안 쓰는 필드들 (스키마 호환)
  userNameKo: z.string().optional().default(""),
  userEmail: z.string().optional().default(""),
  userMobileNo: z.string().optional().default(""),
  userAddr: z.string().optional().default(""),
  userAddrDetail: z.string().optional().default(""),
}).refine((d) => d.password === d.confirmPassword, { message: "비밀번호 불일치", path: ["confirmPassword"] });

type FormInput = z.infer<typeof schema>;
const PW_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

// ─── 상태 표시 ───────────────────────────────────────────

const Status = ({ status, okMsg, errMsg }: { status: "loading" | "ok" | "error" | null; okMsg?: string; errMsg?: string }) => {
  if (!status) return null;
  if (status === "loading") return <Icons.LoaderIcon className="size-3.5 shrink-0 animate-spin text-muted-foreground" />;
  const isOk = status === "ok";
  return (
    <span className={`flex items-center gap-0.5 text-xs ${isOk ? "text-green-600" : "text-destructive"}`}>
      {isOk ? <Icons.Check className="size-3.5" /> : <Icons.X className="size-3.5" />}
      {isOk ? okMsg : errMsg}
    </span>
  );
};

// ─── 컴포넌트 ────────────────────────────────────────────

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteCode: string;
  onSuccess: () => void;
}

const AddEmployeeModal = ({ open, onOpenChange, inviteCode, onSuccess }: Props) => {
  const { openAlert } = useAlertStore();
  const [emailStatus, setEmailStatus] = useState<"loading" | "ok" | "error" | null>(null);
  const [phoneStatus, setPhoneStatus] = useState<"loading" | "ok" | "error" | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [officeSeq, setOfficeSeq] = useState("");
  const emailTimer = useRef<ReturnType<typeof setTimeout>>();
  const phoneTimer = useRef<ReturnType<typeof setTimeout>>();

  const form = useForm<FormInput>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", phone: "", email: "", password: "", confirmPassword: "",
      deptName: "", userPosition: "", positionCode: "", jobGradeCode: "", workCode: "",
      userTypeCode: "", workStatusCode: "", employStatusCode: "", acctStatusCode: "", roleSeq: "",
      userNameKo: "", userEmail: "", userMobileNo: "", userAddr: "", userAddrDetail: "",
    },
  });

  // ── 코드/역할 fetch ────────────────────────────────────
  const { data: roles = [] } = systemApi.roles.useActiveList();
  const getDeptTreeMutation = useMutation(orgQueries.getDeptTree());
  const getCodeListMutation = useMutation(orgQueries.getOfficeCodeList());
  const getSysCodeMutation = useMutation(commonQueries.getCodeDetail());
  const [depts, setDepts] = useState<DeptVO[]>([]);
  const [positions, setPositions] = useState<OfficeCodeVO[]>([]);
  const [jobPositions, setJobPositions] = useState<OfficeCodeVO[]>([]);
  const [jobGrades, setJobGrades] = useState<OfficeCodeVO[]>([]);
  const [workTypes, setWorkTypes] = useState<OfficeCodeVO[]>([]);
  const [userTypes, setUserTypes] = useState<CodeDetail[]>([]);
  const [workStatuses, setWorkStatuses] = useState<CodeDetail[]>([]);
  const [employStatuses, setEmployStatuses] = useState<CodeDetail[]>([]);
  const [acctStatuses, setAcctStatuses] = useState<CodeDetail[]>([]);

  const name = useWatch({ control: form.control, name: "name" });
  const email = useWatch({ control: form.control, name: "email" });
  const phone = useWatch({ control: form.control, name: "phone" });
  const password = useWatch({ control: form.control, name: "password" });
  const confirmPassword = useWatch({ control: form.control, name: "confirmPassword" });

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
  const isValidPhone = /^\d{11}$/.test(phone || "");
  const pwValid = PW_REGEX.test(password || "");
  const pwMatch = !!(confirmPassword && password === confirmPassword);
  const canSubmit = !!name && emailStatus === "ok" && phoneStatus === "ok" && pwValid && pwMatch;

  useEffect(() => {
    if (open) {
      form.reset(); setEmailStatus(null); setPhoneStatus(null);
      // 초대코드로 회사명 조회
      if (inviteCode) {
        publicApiClient.axios.get("/api/v1/common/registry/public/verify-invite-code", {
          params: { code: inviteCode }, _skipGlobalError: true,
        } as any).then(({ data }) => {
          setCompanyName(data.data?.label || "");
          setOfficeSeq(data.data?.id || "");
        }).catch(() => { setCompanyName(""); setOfficeSeq(""); });
      }
      // 코드/역할 fetch (열릴 때마다 최신값)
      getDeptTreeMutation.mutateAsync(undefined).then(setDepts);
      getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.POSITION }).then(setPositions);
      getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.JOB_POSITION }).then(setJobPositions);
      getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.JOB_GRADE }).then(setJobGrades);
      getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.WORK_TYPE }).then(setWorkTypes);
      getSysCodeMutation.mutateAsync("USER_TYPE").then(setUserTypes);
      getSysCodeMutation.mutateAsync("WORK_STATUS").then(setWorkStatuses);
      getSysCodeMutation.mutateAsync("EMPLOY_STATUS").then(setEmployStatuses);
      getSysCodeMutation.mutateAsync("ACCT_STATUS").then(setAcctStatuses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── 이메일 실시간 중복 체크 ────────────────────────────

  const checkDupMut = useMutation(userQueries.checkDuplicate());

  useEffect(() => {
    if (!isValidEmail) {
      setEmailStatus(null);
      // 포맷이 올바르지 않으면 Zod 에러가 뜰 것이므로 여기서는 중복 체크 에러만 지워줌
      if (form.getFieldState("email").error?.type === "manual") form.clearErrors("email");
      return;
    }
    setEmailStatus("loading");
    if (emailTimer.current) clearTimeout(emailTimer.current);
    emailTimer.current = setTimeout(async () => {
      try {
        const res = await checkDupMut.mutateAsync(email);
        const isDup = !!res.data;
        setEmailStatus(isDup ? "error" : "ok");
        if (isDup) {
          form.setError("email", { type: "manual", message: "이미 사용 중인 이메일입니다." });
        } else {
          form.clearErrors("email");
        }
      } catch { setEmailStatus(null); }
    }, 500);
    return () => { if (emailTimer.current) clearTimeout(emailTimer.current); };
  }, [email, isValidEmail, form]);

  // ── 휴대폰 실시간 중복 체크 ────────────────────────────

  const checkPhoneMut = useMutation(userQueries.checkPhone());

  useEffect(() => {
    if (!phone || !isValidPhone) {
      setPhoneStatus(null);
      if (form.getFieldState("phone").error?.type === "manual") form.clearErrors("phone");
      return;
    }
    setPhoneStatus("loading");
    if (phoneTimer.current) clearTimeout(phoneTimer.current);
    phoneTimer.current = setTimeout(async () => {
      try {
        const res = await checkPhoneMut.mutateAsync(phone);
        const isDup = !!res.data;
        setPhoneStatus(isDup ? "error" : "ok");
        if (isDup) {
          form.setError("phone", { type: "manual", message: "이미 사용 중인 번호입니다." });
        } else {
          form.clearErrors("phone");
        }
      } catch { setPhoneStatus(null); }
    }, 500);
    return () => { if (phoneTimer.current) clearTimeout(phoneTimer.current); };
  }, [phone, isValidPhone, form]);

  // ── 등록 ──────────────────────────────────────────────

  const registerMut = useMutation({
    ...employeeQueries.adminCreate(),
    onSuccess: () => {
      openAlert({ message: "직원이 등록되었습니다. 임시 비밀번호를 전달해주세요." });
      onOpenChange(false);
      onSuccess();
    },
    onError: (e: any) => openAlert({ message: e?.message || "등록에 실패했습니다." }),
  });

  const handleSubmit = (values: FormInput) => {
    registerMut.mutate({
      userEmail: values.email,
      userPassword: values.password,
      userName: values.name,
      mobileNo: values.phone || undefined,
      userCategoryCode: "INDIVIDUAL",
      officeId: officeSeq || inviteCode,
      termsAgree: true,
      privacyPolicyAgree: true,
      marketingAgree: false,
      // 조직 정보 (선택)
      roleSeq: values.roleSeq || undefined,
      officeEmployeePosition: values.userPosition || undefined,
      officeEmployeeDept: values.deptName || undefined,
      positionCode: values.positionCode || undefined,
      jobGradeCode: values.jobGradeCode || undefined,
      workCode: values.workCode || undefined,
      // 상태 (선택)
      userTypeCode: values.userTypeCode || undefined,
      workStatusCode: values.workStatusCode || undefined,
      employStatusCode: values.employStatusCode || undefined,
    });
  };

  // ── 렌더링 ────────────────────────────────────────────

  return (
    <FormProvider {...form}>
      <FormDialog
        title="직원 등록"
        submitText="등록"
        submitDisabled={!canSubmit || registerMut.isPending}
        submitLoading={registerMut.isPending}
        open={open}
        onOpenChange={onOpenChange}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-xl"
      >
        {/* 소속 회사 */}
        {companyName && (
          <>
            <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2.5 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              <Icons.Building2 className="size-4 shrink-0" />
              <span><strong>{companyName}</strong>에 직원으로 등록합니다.</span>
            </div>
            <Separator className="my-4" />
          </>
        )}

        {/* 계정 정보 */}
        <p className="mb-2 text-sm font-semibold">계정 정보</p>
        <FlexBox vertical className="gap-3">
          <RHF.Input control={form.control} name="name" label="이름" ess />
          <RHF.Input
            control={form.control} name="email" label="이메일 (아이디)" ess
            suffix={<Status status={isValidEmail ? emailStatus : null} />}
          />
          <RHF.Input
            control={form.control} name="phone" label="휴대폰" ess maxLength={11} inputMode="numeric"
            suffix={<Status status={isValidPhone ? phoneStatus : null} />}
          />
        </FlexBox>

        <Separator className="my-4" />

        {/* 비밀번호 */}
        <p className="mb-2 text-sm font-semibold">임시 비밀번호</p>
        <FlexBox vertical className="gap-3">
          <RHF.Input
            control={form.control} name="password" label="비밀번호" type="password" ess
          />
          <RHF.Input
            control={form.control} name="confirmPassword" label="비밀번호 확인" type="password" ess
          />
        </FlexBox>

        <Separator className="my-4" />

        <EmployeeFormFields
          control={form.control as any}
          depts={depts}
          positions={positions}
          jobPositions={jobPositions}
          jobGrades={jobGrades}
          workTypes={workTypes}
          userTypes={userTypes}
          workStatuses={workStatuses}
          employStatuses={employStatuses}
          acctStatuses={acctStatuses}
          roles={roles}
          showAcctStatus={false}
        />

        <div className="mt-4 flex items-start gap-1.5 rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          <Icons.Info className="mt-0.5 size-3.5 shrink-0" />
          <span>등록 후 사용자에게 이메일(아이디)과 임시 비밀번호를 전달해주세요.</span>
        </div>
      </FormDialog>
    </FormProvider>
  );
};

export default AddEmployeeModal;
