import { cn, Icons, Input, Label, validateFile } from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useState } from "react";
import type { EtcConflictFile } from "@shared/api/etc-case/etcCaseApi";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { etcCaseQueries } from "@shared/query/etc-case/queries";

interface ImageFileProps {
  onFileSelect?: (file: File | null) => void;
  etcConflictFile?: EtcConflictFile | null;
}

const ImageFile = ({ onFileSelect, etcConflictFile }: ImageFileProps) => {
  const { conflictSeq } = useParams<{ conflictSeq: string }>();
  const { openAlert } = useAlertStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const deleteImageMutation = useMutation(etcCaseQueries.deleteConflictFile());

  const style = `
    bg-p-color-1 text-white flex justify-center items-center text-sm p-1.5 rounded-[4px]
    cursor-pointer hover:bg-p-color-1/90
  `;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file, { accept: "image/gif,image/jpeg,image/png" });
      if (!validation.isValid) {
        openAlert({ message: validation.message });
        return;
      }
      onFileSelect?.(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setIsDeleted(false);
      };
      reader.readAsDataURL(file);

      // 동일 파일 재선택이 가능하도록 input value 초기화
      e.target.value = "";
    }
  };

  const existingFile = etcConflictFile?.fileList?.[0];
  const fileUrl = !isDeleted ? existingFile?.fileUrl : null;
  const fileSeq = existingFile?.fileSeq;

  const handleDeleteImage = () => {
    // 아직 저장 안 된 로컬 미리보기만 있는 경우
    if (preview) {
      setPreview(null);
      onFileSelect?.(null);
      return;
    }

    // 서버에 저장된 파일 삭제
    if (!fileSeq) {
      openAlert({ message: "삭제할 이미지 정보를 찾을 수 없습니다." });
      return;
    }

    if (!conflictSeq) {
      openAlert({ message: "사건 정보를 찾을 수 없습니다." });
      return;
    }

    openAlert({
      message: "등록된 이미지를 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      showCancel: true,
      onConfirm: () => {
        deleteImageMutation.mutate(
          { conflictSeq, fileSeq },
          {
            onSuccess: () => {
              // 성공 시 상위 상태 초기화 (상세 페이지의 경우 etcConflictFile은 다음 상세 조회 때 갱신됨)
              setPreview(null);
              setIsDeleted(true);
              onFileSelect?.(null);
              openAlert({ message: "이미지가 삭제되었습니다.", showCancel: false });
            },
            onError: () => {
              openAlert({ message: "이미지 삭제에 실패했습니다. 다시 시도해주세요." });
            },
          }
        );
      },
    });
  };

  return (
    <FormUnitBox vertical title="대표도">
      <div className="w-full">
        <div className="border-border-100 bg-bg-100 mx-auto flex h-47.5 w-47.5 items-center justify-center overflow-hidden rounded-xl border relative group">
          {preview ? (
            <img
              src={preview}
              alt="대표도"
              className="max-h-full max-w-full object-contain"
            />
          ) : fileUrl ? (
            <img
              src={fileUrl}
              alt="대표도"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <Icons.Image className="size-12 opacity-30" />
          )}

          {(preview || fileUrl) && (
            <button
              type="button"
              onClick={handleDeleteImage}
              disabled={deleteImageMutation.isPending}
              className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 disabled:opacity-50 transition-colors"
              title="이미지 삭제"
            >
              <Icons.X className="size-3.5" />
            </button>
          )}
        </div>
      </div>
      <Label htmlFor="etcConflictFile" className={cn("[&>input]:hidden", style)}>
        <Icons.Upload className="size-4" />
        파일등록
        <Input
          id="etcConflictFile"
          type="file"
          accept="image/gif,image/jpeg,image/png"
          onChange={handleFileChange}
        />
      </Label>
      <p className="text-p-color-2 text-xs">10M 이하의 gif,jpeg,png 파일만 등록가능 합니다.</p>
    </FormUnitBox>
  );
};

export default ImageFile;
