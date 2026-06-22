import { useState } from "react";
import { FormDialog, Input } from "@repo/ui";
import { officeMembershipApi } from "@shared/api/user/officeMembershipApi";
import { useAlertStore } from "@shared/store/useAlertStore";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  officeSeq: string;
  officeName: string;
}

const LeaveOfficeConfirmModal = ({ open, onOpenChange, officeSeq, officeName }: Props) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const leaveMutation = officeMembershipApi.useLeaveOffice();
  const { openAlert } = useAlertStore();

  const handleClose = () => {
    setPassword("");
    setError("");
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    leaveMutation.mutate(
      { officeSeq, password },
      {
        onSuccess: () => {
          openAlert({ message: `${officeName}에서 탈퇴했습니다.` });
          handleClose();
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message ?? "탈퇴에 실패했습니다.");
        },
      },
    );
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={(o) => (!o ? handleClose() : onOpenChange(o))}
      title="사무소 탈퇴"
      onSubmit={handleSubmit}
      submitText="탈퇴"
      className="max-w-sm"
    >
      <div className="flex flex-col gap-3 py-2">
        <p className="text-sm">
          <strong>{officeName}</strong>에서 탈퇴하시겠습니까?
        </p>
        <p className="text-text-200 text-xs">
          탈퇴 후에는 이 사무소의 데이터에 접근할 수 없습니다. 본인 확인을 위해 비밀번호를 입력해주세요.
        </p>
        <Input
          type="password"
          className="h-9 text-sm"
          placeholder="현재 비밀번호"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          autoFocus
        />
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </FormDialog>
  );
};

export default LeaveOfficeConfirmModal;
