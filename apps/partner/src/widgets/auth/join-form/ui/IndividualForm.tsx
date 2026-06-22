import { useFormContext, useWatch } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";

import type { JoinSchemaType } from "@widgets/auth/join-form/schema";
import CompanySearchForm from "./CompanySearchForm";
import PasswordChangeModal from "@widgets/auth/join-form/ui/PasswordChangeModal";

import { Button, Icons, InfoBox, RHF, AddressForm } from "@repo/ui";
import User from "@shared/assets/user-3-line.svg?react";
import { useAlertStore } from "@shared/store/useAlertStore";
import { userQueries } from "@shared/query/queries";

type EmailStatus = "IDLE" | "SENDING" | "SENT" | "VERIFYING" | "VERIFIED";

type IndividualFormProps = {
  mode?: "join" | "modify";
  isSocialJoin?: boolean;
};

const VERIFY_TIMEOUT = 300; // 5분

const IndividualForm = ({ mode = "join", isSocialJoin = false }: IndividualFormProps) => {
  const { control, setValue, getValues, setError, clearErrors } = useFormContext<JoinSchemaType>();
  const { openAlert } = useAlertStore();
  const [pwModalOpen, setPwModalOpen] = useState(false);

  // 단일 상태머신
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("IDLE");

  // 인증 타이머 (5분)
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isResendRef = useRef(false);

  useEffect(() => {
    if (isSocialJoin) setEmailStatus("VERIFIED");
  }, [isSocialJoin]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startVerifyTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(VERIFY_TIMEOUT);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(0);
  };

  const email = useWatch({ control, name: "email" });
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");

  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });
  const pwMatch = confirmPassword ? password === confirmPassword : null;

  const phone = useWatch({ control, name: "phone" });
  const lastCheckedPhone = useRef("");

  const role = useWatch({ control, name: "role" });
  const isJoin = mode === "join";
  const isModify = mode === "modify";
  const isIndividual = role === "ROLE_USER";

  const phoneCheckMutation = useMutation({
    ...userQueries.checkPhone(),
    onSuccess: (res) => {
      const isDuplicate = res.data;
      setValue("phoneChecked", !isDuplicate);
      if (isDuplicate) {
        setError("phone", { message: "이미 사용중인 번호입니다." });
      } else {
        clearErrors("phone");
      }
    },
  });

  useEffect(() => {
    if (phone?.length === 11 && /^\d{11}$/.test(phone) && phone !== lastCheckedPhone.current) {
      lastCheckedPhone.current = phone;
      phoneCheckMutation.mutate(phone);
    }
    if (phone?.length !== 11) {
      setValue("phoneChecked", true);
      clearErrors("phone");
      lastCheckedPhone.current = "";
    }
  }, [phone]);

  const checkDupMutation = useMutation({
    ...userQueries.checkDuplicate(),
    onSuccess: (res) => {
      if (res.data) {
        setEmailStatus("IDLE");
        openAlert({ className: "w-80", message: "이미 사용 중인 아이디(이메일)입니다." });
      } else {
        sendVerificationMutation.mutate(getValues("email"));
      }
    },
    onError: () => setEmailStatus("IDLE"),
  });

  const sendVerificationMutation = useMutation({
    ...userQueries.sendVerification(),
    onSuccess: () => {
      setEmailStatus("SENT");
      setValue("verificationCode", "");
      startVerifyTimer();
      openAlert({ className: "w-80", message: isResendRef.current ? "인증 코드가 재발송되었습니다." : "인증 코드가 발송되었습니다." });
      isResendRef.current = false;
    },
    onError: () => setEmailStatus("IDLE"),
  });

  const verifyEmailMutation = useMutation({
    ...userQueries.verifyEmail(),
    onSuccess: (res) => {
      if (res.data) {
        stopAllTimers();
        setEmailStatus("VERIFIED");
        setValue("emailVerified", true);
        openAlert({ className: "w-80", message: "이메일 인증이 완료되었습니다." });
      } else {
        setEmailStatus("SENT");
        openAlert({ className: "w-80", message: "인증 코드가 올바르지 않거나 만료되었습니다." });
      }
    },
    onError: () => setEmailStatus("SENT"),
  });

  // 최초 인증요청 (중복확인 → 발송)
  const handleRequestVerification = () => {
    const rawEmail = getValues("email");
    const trimmed = rawEmail?.trim();
    if (trimmed !== rawEmail) setValue("email", trimmed);
    if (!trimmed) {
      openAlert({ className: "w-80", message: "이메일을 입력해주세요." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      openAlert({ className: "w-80", message: "이메일 형식이 올바르지 않습니다." });
      return;
    }
    setEmailStatus("SENDING");
    checkDupMutation.mutate(trimmed);
  };

  // 재발송 (중복확인 생략, 바로 발송)
  const handleResend = () => {
    isResendRef.current = true;
    setEmailStatus("SENDING");
    sendVerificationMutation.mutate(getValues("email"));
  };

  // 이메일 재입력 (SENT → IDLE 리셋)
  const handleResetEmail = () => {
    stopAllTimers();
    setValue("verificationCode", "");
    setValue("emailVerified", false);
    setEmailStatus("IDLE");
  };

  // 코드 확인
  const handleVerifyCode = () => {
    const code = getValues("verificationCode");
    if (!code) {
      openAlert({ className: "w-80", message: "인증 코드를 입력해주세요." });
      return;
    }
    setEmailStatus("VERIFYING");
    verifyEmailMutation.mutate({ email: getValues("email"), code });
  };

  const isEmailLocked = emailStatus !== "IDLE";
  const isSent = emailStatus === "SENT";
  const isVerified = emailStatus === "VERIFIED";
  const isSending = emailStatus === "SENDING";
  const isVerifying = emailStatus === "VERIFYING";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <User className="size-8" />
        가입자정보
      </div>

      <div className="grid grid-cols-2 gap-3">
        <RHF.Input size="h44" control={control} name="name" label="성명" ess disabled={isSocialJoin} noSpace />
        <RHF.Input
          size="h44"
          control={control}
          name="phone"
          label="휴대폰 번호"
          ess
          disabled={isSocialJoin}
          mobileOnly
          inputMode="numeric"
        />
      </div>

      {/* 이메일 */}
      <RHF.Input
        control={control}
        name="email"
        size="h44"
        label="이메일 (아이디)"
        ess
        noSpace
        disabled={isEmailLocked}
        actions={
          isVerified ? (
            <Button type="button" size="h44" variant="outline" className="w-28" disabled>
              인증완료
            </Button>
          ) : isSent || isVerifying ? undefined : (
            <Button
              type="button"
              size="h44"
              variant="primary"
              className="w-28"
              onClick={handleRequestVerification}
              disabled={isSending || !isValidEmail}
            >
              {isSending ? <Icons.Loader2 className="size-4 animate-spin" /> : "인증요청"}
            </Button>
          )
        }
      />

      {/* SENT: 이메일 재입력 / 재발송 */}
      {isJoin && isSent && (
        <div className="flex gap-3">
          <button
            type="button"
            className="text-text-200 hover:text-primary text-xs underline underline-offset-2"
            onClick={handleResetEmail}
          >
            이메일 재입력
          </button>
          <button
            type="button"
            className="text-text-200 hover:text-primary text-xs underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={handleResend}
            disabled={isSending}
          >
            재발송
          </button>
        </div>
      )}

      {/* 인증 코드 입력 */}
      {isJoin && (isSent || isVerifying) && (
        <RHF.Input
          control={control}
          name="verificationCode"
          size="h44"
          label="인증 코드"
          noSpace
          placeholder="6자리 숫자 입력"
          maxLength={6}
          inputMode="numeric"
          disabled={isVerifying}
          suffix={
            timer === 0 && (
              <span className="text-destructive text-xs font-medium">만료</span>
            )
          }
          actions={
            <Button
              type="button"
              size="h44"
              variant="primary"
              className="w-28"
              onClick={handleVerifyCode}
              disabled={isVerifying || timer === 0}
            >
              {isVerifying ? <Icons.Loader2 className="size-4 animate-spin" /> : "확인"}
            </Button>
          }
        />
      )}

      {isJoin && (
        <>
          <RHF.Input size="h44" control={control} name="password" label="비밀번호" type="password" ess noSpace />
          <RHF.Input
            size="h44"
            control={control}
            name="confirmPassword"
            label="비밀번호 재확인"
            ess
            noSpace
            type="password"
            suffix={confirmPassword && (
              pwMatch
                ? <Icons.Check className="size-4 text-green-600" />
                : <Icons.X className="size-4 text-destructive" />
            )}
          />
          <p className="text-text-200 text-xs">※ 비밀번호는 영문 대/소문자 특수문자를 포함한 8자리 이상</p>
        </>
      )}

      {isModify && (
        <>
          <div>
            <p className="text-text-200 mb-1 text-xs font-medium">비밀번호</p>
            <Button size="h44" variant="outline" className="w-full" onClick={() => setPwModalOpen(true)}>
              비밀번호 변경
            </Button>
          </div>
          <PasswordChangeModal open={pwModalOpen} onOpenChange={setPwModalOpen} />
        </>
      )}

      <AddressForm
        setValue={setValue}
        addressFieldName="address"
        detailFieldName="addressDetail"
        zonecodeFieldName="zonecode"
      />

      {isJoin && isIndividual && <CompanySearchForm />}

      {isModify && (
        <>
          <InfoBox title="회원변경 안내" icon={Icons.Info}>
            <li>
              개인회원은 사업자(법인) 회원으로 전환이 가능하지만 사업자(법인) 회원은 개인회원으로
              전환이 불가 하므로 이점 참고하시기 바랍니다.
            </li>
          </InfoBox>
          <Button
            size="h44"
            variant="red"
            className="w-full"
            onClick={() => {
              openAlert({
                className: "w-80",
                title: "회원전환 안내",
                message: `개인회원에서 사업자(법인)으로 회원을 변경하려 합니다.\n한번 사업자(법인)으로 전환하시면 개인회원으로 돌아 가실 수 없습니다.\n그래도 변경 하시겠습니까?`,
                confirmText: "예 변경하겠습니다.",
                cancelText: "취소",
                onConfirm: () => {},
              });
            }}
          >
            사업자(법인) 회원으로 변경하기
          </Button>
        </>
      )}
    </div>
  );
};

export default IndividualForm;
