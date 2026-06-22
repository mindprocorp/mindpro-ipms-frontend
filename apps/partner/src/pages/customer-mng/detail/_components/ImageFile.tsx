import { cn, Icons, Input, Label, validateFile } from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { customerQueries } from "@shared/query/customer/queries";

interface ImageFileProps {
  onFileSelect: (file: File | null) => void;
  customerImageFile?: {
    customerFileName?: string | null;
    customerFileUrl?: string | null;
    customerFileSize?: string | null;
    fileSeq?: string | null;
  } | null;
}

const ImageFile = ({ onFileSelect, customerImageFile }: ImageFileProps) => {
  const { customerSeq } = useParams<{ customerSeq: string }>();
  const { openAlert } = useAlertStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const deleteImageMutation = useMutation(customerQueries.deleteCustomerFile());

  const style = `
    bg-p-color-1 text-white flex justify-center items-center text-sm p-1.5 rounded-[4px]
    cursor-pointer hover:bg-p-color-1/90 w-full mt-2
  `;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file, { accept: "image/gif,image/jpeg,image/png" });
      if (!validation.isValid) {
        openAlert({ message: validation.message });
        return;
      }
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setIsDeleted(false);
      };
      reader.readAsDataURL(file);

      // 동일 파일 재선택이 가능하도록 input value 초기화
      e.target.value = "";
    }
  };

  const fileUrlFromProps = !isDeleted ? customerImageFile?.customerFileUrl : null;
  const imageUrl = previewUrl || fileUrlFromProps || null;
  const fileSeq = customerImageFile?.fileSeq;

  const handleDeleteImage = () => {
    // 아직 저장 안 된 로컬 미리보기만 있는 경우
    if (previewUrl) {
      setPreviewUrl(null);
      onFileSelect(null);
      return;
    }

    // 서버에 저장된 파일 삭제
    if (!fileSeq) {
      openAlert({ message: "삭제할 이미지 정보를 찾을 수 없습니다." });
      return;
    }

    if (!customerSeq) {
      openAlert({ message: "고객 정보를 찾을 수 없습니다." });
      return;
    }

    openAlert({
      message: "등록된 이미지를 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      showCancel: true,
      onConfirm: () => {
        deleteImageMutation.mutate(
          { customerSeq, fileSeq },
          {
            onSuccess: () => {
              setPreviewUrl(null);
              setIsDeleted(true);
              onFileSelect(null);
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
    <FormUnitBox vertical title="이미지">
      <div className="w-full space-y-2">
        <div className="border-border-100 bg-bg-100 mx-auto flex h-47.5 w-47.5 items-center justify-center overflow-hidden rounded-xl border relative group">
          {imageUrl ? (
            <>
              <img src={imageUrl} className="max-h-full max-w-full object-contain" alt="고객 이미지" />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                title="이미지 삭제"
              >
                <Icons.X className="size-4" />
              </button>
            </>
          ) : (
            <Icons.Image className="size-12 opacity-30" />
          )}
        </div>
        
        <Label htmlFor="customerImage" className={cn("[&>input]:hidden", style)}>
          <Icons.Upload className="size-4" />
          파일등록
          <Input id="customerImage" type="file" accept="image/gif,image/jpeg,image/png" onChange={handleFileChange} />
        </Label>
        
        <div className="text-center">
            <p className="text-p-color-2 text-xs">10M 이하의 gif,jpeg,png 파일만 등록가능 합니다.</p>
            {customerImageFile?.customerFileName && !previewUrl && !isDeleted && (
                <p className="text-[10px] text-muted-foreground mt-1 truncate">
                    현재파일: {customerImageFile.customerFileName}
                </p>
            )}
        </div>
      </div>
    </FormUnitBox>
  );
};

export default ImageFile;
