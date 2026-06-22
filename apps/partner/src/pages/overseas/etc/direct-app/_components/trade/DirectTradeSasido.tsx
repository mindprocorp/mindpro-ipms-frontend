import { cn, Icons, Input, Label, validateFile } from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext, useWatch } from "react-hook-form";
import type { OverseasDirectAppFormInput } from "@shared/schema/overseas/directAppSchema.ts";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { overseasDirectQueries } from "@shared/query/overseas/overseasDirectQueries.ts";

const DirectTradeSasido = () => {
  const { setValue, watch, control, formState: { errors } } = useFormContext<OverseasDirectAppFormInput>();
  const { openAlert } = useAlertStore();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const appImageFile = useWatch({ control, name: "fileInfo" as any }) as any;
  const appSeq = useWatch({ control, name: "appSeq" }) as string;
  const existingFile = Array.isArray(appImageFile) && appImageFile.length > 0 ? appImageFile[0] : null;
  const serverFileUrl = existingFile ? existingFile.fileUrl : null;

  const deleteImageMutation = useMutation(overseasDirectQueries.deleteDirectImage());

  const FIELD_NAME = "mainImageFile";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, { accept: ".gif,.jpeg,.jpg,.png" });
    if (!validation.isValid) {
      openAlert({ message: validation.message });
      return;
    }

    setValue(FIELD_NAME, file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleDeleteImage = () => {
    const pendingFile = watch(FIELD_NAME);
    if (pendingFile) {
      setValue(FIELD_NAME, undefined);
      setPreviewUrl("");
      return;
    }

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
        deleteImageMutation.mutate({ appSeq: appSeq || existingFile.docSeq || "", fileSeq: existingFile.fileSeq }, {
          onSuccess: () => {
            const updated = (appImageFile ?? []).filter((f: any) => f.fileSeq !== existingFile.fileSeq);
            setValue("fileInfo" as any, updated);
            setPreviewUrl("");
            openAlert({ message: "이미지가 삭제되었습니다.", showCancel: false });
          },
          onError: () => {
            openAlert({ message: "이미지 삭제에 실패했습니다. 다시 시도해주세요." });
          },
        });
      },
    });
  };

  useEffect(() => {
    setValue(FIELD_NAME, undefined);
  }, []);
  const style = `
    bg-p-color-1 text-white flex justify-center items-center text-sm p-1.5 rounded-[4px]
    cursor-pointer hover:bg-p-color-1/90
  `;
  return (
    <FormUnitBox vertical title="대표도">
      <div className="w-full">
        <div className="border-border-100 bg-bg-100 mx-auto flex h-47.5 w-47.5 items-center justify-center overflow-hidden rounded-xl border relative group">
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
                disabled={deleteImageMutation.isPending}
                className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 disabled:opacity-50 transition-colors"
                title="이미지 삭제"
              >
                <Icons.X className="size-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
      <Label htmlFor="directTradeMainImageFile" className={cn("[&>input]:hidden", style)}>
        <Icons.Upload className="size-4" />
        파일등록
        <Input
          id="directTradeMainImageFile"
          type="file"
          onChange={handleFileChange}
          accept=".gif,.jpeg,.jpg,.png"
        />
      </Label>
      {errors.mainImageFile && (
        <p className="text-red-500 text-xs">{errors.mainImageFile.message}</p>
      )}
      <p className="text-p-color-2 text-xs">10M 이하의 gif,jpeg,png 파일만 등록가능 합니다.</p>
    </FormUnitBox>
  );
};

export default DirectTradeSasido;
