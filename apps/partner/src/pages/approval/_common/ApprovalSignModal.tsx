import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormDialog,
  Button,
  Icons,
  Alert,
  AlertTitle,
  AlertDescription,
  Checkbox,
} from "@repo/ui";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { loadSignature, saveSignature } from "./signatureStorage";
import SignaturePad from "./SignaturePad";

export type SignResult = {
  /** 결재에 박힐 서명 (base64 PNG dataURL) */
  signatureImage: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (result: SignResult) => void;
  isPending?: boolean;
}

/**
 * 승인 직전에 띄우는 서명 모달.
 *
 * 흐름:
 * 1. 등록된 서명 있음 → 미리보기 + [이대로 결재] + [새로 그리기 옵션]
 * 2. 등록된 서명 없음 → 안내 + 캔버스 + [영구 저장 옵션]
 *
 * 영구 저장: 현재는 localStorage(signatureStorage). 추후 백엔드 연동 시 API 호출로 전환.
 */
const ApprovalSignModal = ({ open, onOpenChange, onConfirm, isPending }: Props) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [registered, setRegistered] = useState<string | null>(null);
  const [drawSignature, setDrawSignature] = useState<string | null>(null);
  const [forceRedraw, setForceRedraw] = useState(false);
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  useEffect(() => {
    if (!open) {
      setDrawSignature(null);
      setForceRedraw(false);
      setSaveAsDefault(false);
      return;
    }
    setRegistered(loadSignature(user?.officeId, user?.userId, "signature"));
  }, [open, user?.officeId, user?.userId]);

  const useExisting = !!registered && !forceRedraw;
  const canSubmit = useExisting || !!drawSignature;

  const handleSubmit = () => {
    const signature = useExisting ? registered! : drawSignature!;
    if (!signature) return;

    // 그린 서명 + "다음에도 사용" 체크 시 localStorage 영구 저장
    if (!useExisting && saveAsDefault) {
      saveSignature(user?.officeId, user?.userId, "signature", signature);
    }

    onConfirm({ signatureImage: signature });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="결재 서명"
      submitText="서명하고 결재"
      cancelText="취소"
      submitDisabled={!canSubmit}
      submitLoading={isPending}
      onSubmit={handleSubmit}
      className="max-w-md"
    >
      <div className="space-y-4">
        {useExisting ? (
          <>
            <div className="rounded-md border bg-white p-3">
              <p className="mb-2 text-xs text-muted-foreground">등록된 서명</p>
              <div className="flex h-20 items-center justify-center">
                <img
                  src={registered!}
                  alt="등록된 서명"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
            <Button
              size="h28"
              variant="outline"
              type="button"
              onClick={() => setForceRedraw(true)}
            >
              <Icons.Pencil className="size-3.5" />
              새로 서명
            </Button>
          </>
        ) : (
          <>
            {!registered && (
              <Alert>
                <Icons.AlertCircle className="size-4" />
                <AlertTitle>등록된 서명이 없습니다</AlertTitle>
                <AlertDescription>
                  아래에 직접 서명하거나{" "}
                  <button
                    type="button"
                    className="text-blue-600 underline hover:text-blue-700"
                    onClick={() => {
                      onOpenChange(false);
                      navigate("/approval/signature");
                    }}
                  >
                    서명관리
                  </button>
                  에서 미리 등록할 수 있습니다.
                </AlertDescription>
              </Alert>
            )}

            <div>
              <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Icons.Pencil className="size-3.5" />
                아래 영역에 마우스로 서명하세요
              </p>
              <SignaturePad onChange={setDrawSignature} height={150} />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-xs">
              <Checkbox
                checked={saveAsDefault}
                onCheckedChange={(c) => setSaveAsDefault(c === true)}
              />
              <span>이 서명을 다음에도 사용하도록 저장</span>
            </label>
          </>
        )}
      </div>
    </FormDialog>
  );
};

export default ApprovalSignModal;
