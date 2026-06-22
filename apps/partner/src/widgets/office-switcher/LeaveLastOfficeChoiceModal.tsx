import { FormDialog, RHF } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { officeMembershipApi } from "@shared/api/user/officeMembershipApi";
import { useAlertStore } from "@shared/store/useAlertStore";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  officeSeq: string;
  officeName: string;
  /** 개인 사무소(USRKR)면 true — "개인회원으로 전환" 옵션 숨기고 계정 탈퇴만 노출 */
  isPersonalOffice?: boolean;
  /** 시스템관리자(사업주)면 true — 탈퇴 차단 안내만 표시 */
  isSysAdmin?: boolean;
}

const Schema = z.object({
  choice: z.enum(["PERSONAL", "CLOSE_ACCOUNT"], { message: "선택해주세요." }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요." }),
});
type Input = z.input<typeof Schema>;

const LeaveLastOfficeChoiceModal = ({ open, onOpenChange, officeSeq, officeName, isPersonalOffice, isSysAdmin }: Props) => {
  const { openAlert } = useAlertStore();
  const leaveToPersonalMutation = officeMembershipApi.useLeaveToPersonal();
  const closeAccountMutation = officeMembershipApi.useCloseAccount();

  // 개인 사무소면 "개인회원 전환" 옵션 자체가 의미 없음 → CLOSE_ACCOUNT 고정
  const form = useForm<Input>({
    resolver: zodResolver(Schema),
    defaultValues: { choice: isPersonalOffice ? "CLOSE_ACCOUNT" : "PERSONAL", password: "" },
  });

  const handleClose = () => {
    form.reset({ choice: isPersonalOffice ? "CLOSE_ACCOUNT" : "PERSONAL", password: "" });
    onOpenChange(false);
  };

  const handleSubmit = form.handleSubmit((values) => {
    if (values.choice === "PERSONAL") {
      leaveToPersonalMutation.mutate(
        { officeSeq, password: values.password },
        {
          onSuccess: () => {
            openAlert({ message: `${officeName}에서 탈퇴하고 개인회원으로 전환했습니다.` });
            handleClose();
          },
          onError: (err: any) => form.setError("password", { message: err?.response?.data?.message ?? "처리에 실패했습니다." }),
        },
      );
      return;
    }
    openAlert({
      type: "confirm",
      message: "정말 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      confirmText: "탈퇴",
      onConfirm: () => {
        closeAccountMutation.mutate(values.password, {
          onSuccess: () => {
            openAlert({ message: "계정이 탈퇴 처리되었습니다." });
            handleClose();
          },
          onError: (err: any) => form.setError("password", { message: err?.response?.data?.message ?? "계정 탈퇴에 실패했습니다." }),
        });
      },
    });
  });

  const choice = form.watch("choice");
  const setChoice = (v: "PERSONAL" | "CLOSE_ACCOUNT") => form.setValue("choice", v);
  const title = isSysAdmin ? "탈퇴 안내" : choice === "PERSONAL" ? "개인회원으로 전환" : "계정 탈퇴";
  const confirmText = isSysAdmin ? "확인" : choice === "PERSONAL" ? "전환" : "탈퇴";

  return (
    <FormProvider {...form}>
      <FormDialog
        open={open}
        onOpenChange={(o) => (!o ? handleClose() : onOpenChange(o))}
        title={title}
        onSubmit={isSysAdmin ? () => handleClose() : handleSubmit}
        submitText={confirmText}
        className="max-w-sm"
      >
        <div className="flex flex-col gap-3 py-2">
          {isSysAdmin ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm">
                <strong>{officeName}</strong>의 시스템관리자(사업주) 탈퇴는 운영팀에게 문의해주세요.
              </p>
              <div className="bg-bg-100 rounded-md p-2.5">
                <p className="text-text-200 text-[11px] leading-relaxed">
                  사업주는 사무소 소유자라서 아래 항목들이 함께 정리되어야 합니다.
                </p>
                <ul className="text-text-200 mt-1 ml-3 list-disc text-[11px] leading-relaxed">
                  <li>사업자등록증·결제 수단 등 법인 명의 자산</li>
                  <li>소속 직원·고객 데이터 인계</li>
                  <li>구독 플랜·미납금 정산</li>
                </ul>
                <p className="text-text-200 mt-1 text-[11px] leading-relaxed">
                  관리자 권한 이관 또는 사무소 폐쇄 절차를 함께 진행해드려요.
                </p>
              </div>
              <p className="text-text-200 text-xs">
                아래로 연락 주시면 빠르게 안내해드립니다.<br />
                · 이메일: support@mindpro.co.kr<br />
                · 전화: 02-XXX-XXXX
              </p>
            </div>
          ) : isPersonalOffice ? (
            <p className="text-sm">
              계정을 완전히 탈퇴하시겠습니까?<br />
              <span className="text-text-200 text-xs">
                이 작업은 되돌릴 수 없습니다. 본인 확인을 위해 비밀번호를 입력해주세요.
              </span>
            </p>
          ) : (
            <>
              <p className="text-sm">
                <strong>{officeName}</strong>는 마지막 소속 사무소입니다. 어떻게 하시겠어요?
              </p>
              <div className="flex flex-col gap-2">
                <label className="border-border-100 flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-bg-100">
                  <input
                    type="radio"
                    name="leaveChoice"
                    value="PERSONAL"
                    checked={choice === "PERSONAL"}
                    onChange={() => setChoice("PERSONAL")}
                    className="size-4 shrink-0"
                  />
                  <div className="flex-1 text-sm">
                    <div className="font-medium">개인회원으로 전환</div>
                    <div className="text-text-200 text-xs">
                      회사에서 탈퇴하고 개인회원 상태로 돌아갑니다. 계정은 유지됩니다.
                    </div>
                  </div>
                </label>

                <label className="border-border-100 flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-bg-100">
                  <input
                    type="radio"
                    name="leaveChoice"
                    value="CLOSE_ACCOUNT"
                    checked={choice === "CLOSE_ACCOUNT"}
                    onChange={() => setChoice("CLOSE_ACCOUNT")}
                    className="size-4 shrink-0"
                  />
                  <div className="flex-1 text-sm">
                    <div className="text-destructive font-medium">계정 탈퇴</div>
                    <div className="text-text-200 text-xs">
                      계정을 완전히 삭제합니다. 이 작업은 되돌릴 수 없습니다.
                    </div>
                  </div>
                </label>
              </div>
            </>
          )}

          {!isSysAdmin && (
            <RHF.Input
              size="h44"
              control={form.control}
              name="password"
              type="password"
              label="비밀번호"
              placeholder="현재 비밀번호"
              ess
              noSpace
            />
          )}
        </div>
      </FormDialog>
    </FormProvider>
  );
};

export default LeaveLastOfficeChoiceModal;
