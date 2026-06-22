import { cn, Icons, Input, Label, validateFile } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import type { OverseasBasicFormInput } from "@shared/schema/overseas/basicSchema.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { overseasBasicQueries } from "@shared/query/overseas/overseasBasicQueries.ts";

const BasicSasido = () => {
  const { overseasSeq } = useParams<{ overseasSeq: string }>();
  const {
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext<OverseasBasicFormInput>();
  const { openAlert } = useAlertStore();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const deleteAppImageFileMutation = useMutation(overseasBasicQueries.deleteAppImageFile());

  const appImageFile = useWatch({
    control,
    name: "fileInfo"
  });

  const existingFile = Array.isArray(appImageFile) && appImageFile.length > 0 ? appImageFile[0] : null;
  const serverFileUrl = existingFile ? existingFile.fileUrl : null;
  const serverFileSeq = existingFile ? existingFile.fileSeq : null;

  const style = `
    bg-p-color-1 text-white flex justify-center items-center text-sm p-1.5 rounded-[4px]
    cursor-pointer hover:bg-p-color-1/90
  `;

  const FIELD_NAME = "mainImageFile";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validation = validateFile(file, { accept: ".gif,.jpeg,.jpg,.png" });
    if (!validation.isValid) {
      openAlert({ message: validation.message });
      return;
    }

    // 1. 파일 객체를 form에 set
    setValue(FIELD_NAME, file);

    // 2. 미리보기 이미지 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 동일 파일 재선택이 가능하도록 input value 초기화
    e.target.value = "";
  };

  const handleDeleteImage = () => {
    const pendingFile = watch(FIELD_NAME);
    // 아직 저장 안 된 파일 -> 로컬 상태만 초기화
    if (pendingFile || previewUrl) {
      setValue(FIELD_NAME, undefined);
      setPreviewUrl("");
      return;
    }

    // 서버에 저장된 파일 -> 삭제 API 호출
    if (!serverFileSeq) {
      openAlert({ message: "삭제할 이미지 정보를 찾을 수 없습니다." });
      return;
    }

    if (!overseasSeq) {
      openAlert({ message: "출원 정보를 찾을 수 없습니다." });
      return;
    }

    openAlert({
      message: "등록된 이미지를 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      showCancel: true,
      onConfirm: () => {
        deleteAppImageFileMutation.mutate(
          { appSeq: overseasSeq, fileSeq: serverFileSeq },
          {
            onSuccess: () => {
              // form에서 해당 파일 제거
              const updated = (appImageFile ?? []).filter((f: any) => f.fileSeq !== serverFileSeq);
              setValue("fileInfo", updated);
              setValue(FIELD_NAME, undefined);
              setPreviewUrl("");
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

  useEffect(() => {
    setValue(FIELD_NAME, undefined);
  }, []);

  return (
    <FormUnitBox vertical title="대표도">
      <div className="w-full">
        <div className="border-border-100 bg-bg-100 mx-auto flex h-47.5 w-47.5 items-center justify-center overflow-hidden rounded-xl border relative group">
          {/* 이미지가 둘 다 없으면 아이콘 표시 */}
          {!(serverFileUrl || previewUrl) && <Icons.Image className="size-12 opacity-30" />}

          {(serverFileUrl || previewUrl) && (
            <>
              <img
                src={previewUrl || serverFileUrl}
                alt="대표도"
                className="h-full w-full object-contain"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={deleteAppImageFileMutation.isPending}
                className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 disabled:opacity-50 transition-colors"
                title="이미지 삭제"
              >
                <Icons.X className="size-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
      <Label htmlFor="basicMainImageFile" className={cn("[&>input]:hidden", style)}>
        <Icons.Upload className="size-4" />
        파일등록
        <Input
          id="basicMainImageFile"
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

export default BasicSasido;
