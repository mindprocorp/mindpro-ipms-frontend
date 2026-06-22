import { FormDialog, RHF } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@shared/api/client";
import { useAlertStore } from "@shared/store/useAlertStore";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userMstSeq: string;
  userName: string;
  onRejected: () => void;
  /** 모달 타이틀/버튼 라벨 ("방출" 기본 / "퇴사 처리" 등) */
  title?: string;
  confirmText?: string;
}

const Schema = z.object({
  password: z.string().min(1, { message: "관리자 비밀번호를 입력해주세요." }),
});
type Input = z.input<typeof Schema>;

/**
 * 직원 방출 모달 — 관리자 본인 비밀번호 재확인 필수.
 */
const RejectEmployeeModal = ({
  open, onOpenChange, userMstSeq, userName, onRejected,
  title = "직원 방출", confirmText = "방출",
}: Props) => {
  // 퇴사 컨텍스트인지 (타이틀에 "퇴사" 포함 시 본문/메시지 자연스럽게 변경)
  const isResign = title.includes("퇴사");
  const { openAlert } = useAlertStore();
  const form = useForm<Input>({
    resolver: zodResolver(Schema),
    defaultValues: { password: "" },
  });

  const rejectMutation = useMutation({
    mutationFn: async (pw: string) => {
      await apiClient.axios.post(`/api/users/employee/${userMstSeq}/reject`, { password: pw });
    },
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleSubmit = form.handleSubmit((values) => {
    rejectMutation.mutate(values.password, {
      onSuccess: () => {
        handleClose();
        onRejected();
        setTimeout(() => {
          openAlert({ message: `${userName} 직원을 ${isResign ? "퇴사 처리했습니다" : "방출했습니다"}.` });
        }, 300);
      },
      onError: (err: any) => {
        form.setError("password", {
          message: err?.response?.data?.message ?? `${isResign ? "퇴사 처리" : "방출"}에 실패했습니다.`,
        });
      },
    });
  });

  return (
    <FormProvider {...form}>
      <FormDialog
        open={open}
        onOpenChange={(o) => (!o ? handleClose() : onOpenChange(o))}
        title={title}
        onSubmit={handleSubmit}
        submitText={confirmText}
        className="max-w-sm"
      >
        <div className="flex flex-col gap-3 py-2">
          <p className="text-sm">
            <strong>{userName}</strong> 직원을 {isResign ? "퇴사 처리" : "방출"}하시겠습니까?
          </p>
          <p className="text-text-200 text-xs">
            {isResign ? "퇴사 처리된" : "방출된"} 직원은 사무소 소속에서 제외되며, 본인 명의의 개인회원으로 자동 전환됩니다.
            본인 확인을 위해 관리자 비밀번호를 입력해주세요.
          </p>
          <RHF.Input
            size="h44"
            control={form.control}
            name="password"
            type="password"
            label="관리자 비밀번호"
            placeholder="본인 비밀번호"
            ess
            noSpace
          />
        </div>
      </FormDialog>
    </FormProvider>
  );
};

export default RejectEmployeeModal;
