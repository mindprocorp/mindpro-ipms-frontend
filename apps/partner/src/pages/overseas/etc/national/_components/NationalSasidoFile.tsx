import { cn, Icons, Input, Label, validateFile } from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasNationalFormInput } from "@shared/schema/overseas/nationalSchema.ts";
import { useEffect, useState } from "react";
import type { FileInfo } from "@shared/api/overseas/nationalApi.ts";
import { useMutation } from "@tanstack/react-query";
import { overseasNationalQueries } from "@shared/query/overseas/overseasNationalQueries.ts";

type Props = {
  fileInfo?: FileInfo[];
};

const NationalSasidoFile = ({ fileInfo }: Props) => {
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<OverseasNationalFormInput>();
  const { openAlert } = useAlertStore();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  /** 새로 선택한 파일 (아직 서버에 저장 안 된 상태) */
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const deleteImageMutation = useMutation(overseasNationalQueries.deleteNationalImage());

  const style = `
    bg-p-color-1 text-white flex justify-center items-center text-sm p-1.5 rounded-[4px]
    cursor-pointer hover:bg-p-color-1/90
  `;

  const FIELD_NAME = "mainImageFile";

  useEffect(() => {
    if (fileInfo && fileInfo.length > 0 && fileInfo[0].fileUrl) {
      setPreviewUrl(fileInfo[0].fileUrl);
    } else if (!fileInfo || fileInfo.length === 0) {
      setPreviewUrl("");
    }
  }, [fileInfo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validation = validateFile(file, { accept: ".gif,.jpeg,.jpg,.png" });
    if (!validation.isValid) {
      openAlert({ message: validation.message });
      e.target.value = "";
      return;
    }

    setValue(FIELD_NAME, file);
    setPendingFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 동일 파일 재선택이 가능하도록 input value 초기화
    e.target.value = "";
  };

  const handleDeleteImage = () => {
    // 아직 저장 안 된 파일 -> 로컬 상태만 초기화
    if (pendingFile) {
      setValue(FIELD_NAME, undefined);
      setPendingFile(null);
      setPreviewUrl(fileInfo && fileInfo.length > 0 ? (fileInfo[0].fileUrl || "") : "");
      return;
    }

    // 서버에 저장된 파일 -> 삭제 API 호출
    const existingFile = fileInfo?.[0];
    if (!existingFile?.fileSeq) {
      openAlert({ message: "삭제할 이미지 정보를 찾을 수 없습니다." });
      return;
    }

    openAlert({
      message: "등록된 이미지를 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      showCancel: true,
      onConfirm: () => {
        const appSeq = getValues("appSeq") || existingFile.docSeq || ""; // use form's appSeq or fallback
        deleteImageMutation.mutate({ appSeq, fileSeq: existingFile.fileSeq }, {
          onSuccess: () => {
            setPreviewUrl("");
            // 부모 컴포넌트의 fileInfo 상태는 다음에 상세 조회 시 업데이트됨
            // 현재는 UI에서만 제거
            openAlert({ message: "이미지가 삭제되었습니다.", showCancel: false });
          },
          onError: () => {
            openAlert({ message: "이미지 삭제에 실패했습니다. 다시 시도해주세요." });
          },
        });
      },
    });
  };

  return (
    <FormUnitBox vertical title="대표도">
      <div className="w-full">
        <div className="border-border-100 bg-bg-100 relative mx-auto flex h-47.5 w-47.5 items-center justify-center overflow-hidden rounded-xl border">
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="대표도 미리보기" className="h-full w-full object-contain" />
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={deleteImageMutation.isPending}
                className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 disabled:opacity-50 transition-colors"
                title="이미지 삭제"
              >
                <Icons.X className="size-3.5" />
              </button>
            </>
          ) : (
            <Icons.Image className="size-12 opacity-30" />
          )}
        </div>
      </div>
      <Label htmlFor="nationalImageFile" className={cn("[&>input]:hidden", style)}>
        <Icons.Upload className="size-4" />
        파일등록
        <Input
          id="nationalImageFile"
          type="file"
          onChange={handleFileChange}
          accept=".gif,.jpeg,.jpg,.png"
        />
      </Label>
      {errors.mainImageFile && (
        <p className="text-xs text-red-500">{errors.mainImageFile.message}</p>
      )}
      <p className="text-p-color-2 text-xs">10M 이하의 gif,jpeg,png 파일만 등록가능 합니다.</p>
    </FormUnitBox>
  );
};

export default NationalSasidoFile;
