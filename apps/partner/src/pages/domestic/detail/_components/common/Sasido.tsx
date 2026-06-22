import { cn, Icons, Input, Label, validateFile } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { RightType } from "@pages/domestic/detail/child/DynamicCompRender.tsx";
import { useEffect, useState } from "react";
import type { DomesticFormInput } from "@shared/schema/domestic/domesticSchema.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { useMutation } from "@tanstack/react-query";
import { domesticDetailQueries } from "@shared/query/domestic/queries.ts";

type Rtype = {
  rightType: RightType;
};

const Sasido = (rightType: Rtype) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DomesticFormInput>();
  const { openAlert } = useAlertStore();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  /** 새로 선택한 파일 (아직 서버에 저장 안 된 상태) */
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const fileInfo = watch("fileInfo");
  const appSeq = watch("appSeq");

  const deleteImageMutation = useMutation(domesticDetailQueries.deleteAppImageFile());

  const style = `
    bg-p-color-1 text-white flex justify-center items-center text-sm p-1.5 rounded-[4px]
    cursor-pointer hover:bg-p-color-1/90
  `;

  const FIELD_NAME = "multiViewDrawingFile";

  /** docSeq: 디자인=56, 상표=78 */
  const targetDocSeq = rightType.rightType === "30" ? "56" : "78";

  /** 현재 서버에 저장된 이미지 파일 정보 */
  const existingFile = fileInfo?.find((f) => f.docSeq === targetDocSeq) ?? fileInfo?.[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, { accept: ".gif,.jpeg,.jpg,.png" });
    if (!validation.isValid) {
      openAlert({ message: validation.message });
      return;
    }

    // 파일 객체를 form에 set
    setValue(FIELD_NAME, file);
    setPendingFile(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 동일 파일 재선택이 가능하도록 input value 초기화
    e.target.value = "";
  };

  /** X 버튼 클릭 핸들러 */
  const handleDeleteImage = () => {
    // 아직 저장 안 된 파일 → API 호출 없이 로컬 상태만 초기화
    if (pendingFile) {
      setValue(FIELD_NAME, undefined);
      setPendingFile(null);
      setPreviewUrl("");
      return;
    }

    // 서버에 저장된 파일 → 삭제 API 호출
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
        deleteImageMutation.mutate(
          { appSeq: appSeq ?? "", fileSeq: existingFile.fileSeq! },
          {
            onSuccess: () => {
              // form에서 해당 파일 제거
              const updated = (fileInfo ?? []).filter((f) => f.fileSeq !== existingFile.fileSeq);
              setValue("fileInfo", updated);
              setPreviewUrl("");
              openAlert({ message: "이미지가 삭제되었습니다.", showCancel: false });
            },
            onError: () => {
              openAlert({ message: "이미지 삭제에 실패했습니다. 다시 시도해주세요." });
            },
          },
        );
      },
    });
  };

  useEffect(() => {
    setValue(FIELD_NAME, undefined);
    setPendingFile(null);
  }, [setValue]);

  const previewFileUrl = (() => {
    if (previewUrl) return previewUrl;
    if (!fileInfo || fileInfo.length === 0) return "";
    const matched = fileInfo.find((file) => file.docSeq === targetDocSeq);
    return matched?.fileUrl || fileInfo[0]?.fileUrl || "";
  })();

  const hasImage = !!previewFileUrl;

  return (
    <FormUnitBox vertical title={rightType.rightType === "30" ? "사시도" : "상표이미지"}>
      <div className="w-full">
        <div className="border-border-100 bg-bg-100 relative mx-auto flex h-47.5 w-47.5 items-center justify-center overflow-hidden rounded-xl border">
          <Icons.Image className="size-12 opacity-30" />
          {previewFileUrl ? (
            <img
              src={previewFileUrl}
              className="absolute h-full w-full object-cover"
            />
          ) : null}

          {/* X 삭제 버튼 — 이미지가 있을 때만 표시 */}
          {hasImage && (
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
      <Label htmlFor="picture" className={cn("[&>input]:hidden", style)}>
        <Icons.Upload className="size-4" />
        파일등록
        <Input id="picture" type="file" onChange={handleFileChange} accept=".gif,.jpeg,.jpg,.png" />
      </Label>
      {errors.multiViewDrawingFile && (
        <p className="text-xs text-red-500">{errors.multiViewDrawingFile.message}</p>
      )}
      <p className="text-p-color-2 text-xs">10M 이하의 gif,jpeg,png 파일만 등록가능 합니다.</p>
    </FormUnitBox>
  );
};

export default Sasido;
