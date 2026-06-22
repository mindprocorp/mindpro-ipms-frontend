import { useState } from "react";
import { Button, FormDialog, RHF } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { officeMembershipApi } from "@shared/api/user/officeMembershipApi";
import { useAlertStore } from "@shared/store/useAlertStore";
import { publicApiClient } from "@shared/api/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Schema = z
  .object({
    inviteCode: z.string().min(1, { message: "초대코드를 입력해주세요." }),
    verified: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.verified) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "초대코드 확인이 필요합니다.",
        path: ["inviteCode"],
      });
    }
  });
type Input = z.input<typeof Schema>;

const JoinOfficeModal = ({ open, onOpenChange }: Props) => {
  const form = useForm<Input>({
    resolver: zodResolver(Schema),
    defaultValues: { inviteCode: "", verified: false },
  });
  const [verifiedName, setVerifiedName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const joinMutation = officeMembershipApi.useJoinOffice();
  const { openAlert } = useAlertStore();

  const handleClose = () => {
    form.reset();
    setVerifiedName("");
    onOpenChange(false);
  };

  const handleVerify = async () => {
    const code = form.getValues("inviteCode").trim();
    if (!code) {
      form.setError("inviteCode", { message: "초대코드를 입력해주세요." });
      return;
    }
    setIsVerifying(true);
    try {
      const { data } = await publicApiClient.axios.get(
        "/api/v1/common/registry/public/verify-invite-code",
        { params: { code }, _skipGlobalError: true } as any,
      );
      if (data?.data) {
        form.setValue("verified", true);
        form.clearErrors("inviteCode");
        setVerifiedName(data.data.label);
      }
    } catch {
      form.setValue("verified", false);
      form.setError("inviteCode", { message: "유효하지 않은 초대코드입니다." });
      setVerifiedName("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    joinMutation.mutate(values.inviteCode.trim(), {
      onSuccess: () => {
        openAlert({ message: `${verifiedName}에 가입 신청이 접수되었습니다.\n관리자 승인 후 이용 가능합니다.` });
        handleClose();
      },
      onError: (err: any) => {
        form.setError("inviteCode", { message: err?.response?.data?.message ?? "사무소 합류에 실패했습니다." });
      },
    });
  });

  const verified = form.watch("verified");

  return (
    <FormProvider {...form}>
      <FormDialog
        open={open}
        onOpenChange={(o) => (!o ? handleClose() : onOpenChange(o))}
        title="초대코드로 사무소 합류"
        onSubmit={handleSubmit}
        submitText="합류 신청"
        className="max-w-sm"
      >
        <div className="flex flex-col gap-3 py-2">
          <RHF.Input
            size="h44"
            control={form.control}
            name="inviteCode"
            label="초대코드"
            placeholder="초대코드 입력"
            ess
            disabled={verified}
            actions={
              verified ? (
                <Button type="button" size="h44" variant="outline" className="w-20" disabled>
                  확인완료
                </Button>
              ) : (
                <Button
                  type="button"
                  size="h44"
                  variant="primary"
                  className="w-20"
                  onClick={handleVerify}
                  disabled={isVerifying}
                >
                  {isVerifying ? "확인중..." : "확인"}
                </Button>
              )
            }
          />
          {verified && (
            <p className="text-p-color-1 text-xs">
              ✓ <strong>{verifiedName}</strong> 확인되었습니다.
            </p>
          )}
          <p className="text-text-200 text-xs">
            ※ 합류 후 해당 사무소 관리자가 승인해야 접속할 수 있습니다.
          </p>
        </div>
      </FormDialog>
    </FormProvider>
  );
};

export default JoinOfficeModal;
