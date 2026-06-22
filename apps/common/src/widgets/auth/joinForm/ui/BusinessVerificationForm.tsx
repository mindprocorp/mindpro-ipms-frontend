import { useRef, useState, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button, FlexBox, RHF } from "@repo/ui";

type BusinessVerificationFormProps = {
  regNumberFieldName?: string;
  verifiedFieldName?: string;
  paperUrlFieldName?: string;
};

const BusinessVerificationForm = ({
  regNumberFieldName = "corpRegNumber",
  verifiedFieldName = "corpRegVerified",
  paperUrlFieldName = "corpPaperUrl",
}: BusinessVerificationFormProps) => {
  const { control, setValue, getValues } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [verifiedNumber, setVerifiedNumber] = useState<string | null>(null);

  const corpRegNumber = useWatch({ control, name: regNumberFieldName });
  const corpRegVerified = useWatch({ control, name: verifiedFieldName });
  const corpPaperUrl = useWatch({ control, name: paperUrlFieldName });

  // 사업자등록번호 변경 시 검증 초기화
  useEffect(() => {
    if (corpRegVerified && verifiedNumber && corpRegNumber !== verifiedNumber) {
      setValue(verifiedFieldName, false);
      setVerifiedNumber(null);
    }
  }, [corpRegNumber, corpRegVerified, verifiedNumber, setValue, verifiedFieldName]);

  // 사업자등록번호 검증
  const handleVerify = async () => {
    const regNumber = getValues(regNumberFieldName);
    if (!regNumber || regNumber.length !== 10) {
      return;
    }

    setIsVerifying(true);
    try {
      // TODO: 백엔드 API 연동
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setValue(verifiedFieldName, true);
      setVerifiedNumber(regNumber);
    } catch {
      setValue(verifiedFieldName, false);
    } finally {
      setIsVerifying(false);
    }
  };

  // 파일 업로드
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      // TODO: 백엔드 파일 업로드 API 연동
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setValue(paperUrlFieldName, "https://example.com/uploaded-file.jpg");
    } catch {
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDelete = () => {
    setValue(paperUrlFieldName, "");
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displayImageUrl = previewUrl || corpPaperUrl;

  return (
    <>
      {/* 사업자등록번호 검증 */}
      <RHF.FormField>
        <RHF.Input
          control={control}
          name={regNumberFieldName}
          label="사업자등록번호"
          placeholder="하이픈(-) 없이 10자리 입력"
          maxLength={10}
          actions={
            <Button
              type="button"
              variant={corpRegVerified ? "green" : "primary"}
              className="w-28"
              onClick={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? "확인중..." : corpRegVerified ? "확인완료" : "확인"}
            </Button>
          }
        />
      </RHF.FormField>

      {/* 사업자등록증 업로드 */}
      <RHF.FormGroupField control={control} vertical name={paperUrlFieldName} label="사업자등록증">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        {!displayImageUrl ? (
          <Button
            type="button"
            variant="primary"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "업로드 중..." : "사업자등록증 등록하기"}
          </Button>
        ) : (
          <div className="border-border-200 space-y-4 rounded-sm border p-6">
            <div className="flex items-center justify-center">
              <img src={displayImageUrl} alt="사업자등록증" className="max-h-80 object-contain" />
            </div>
            <FlexBox grow>
              <Button type="button" className="w-full" onClick={handleFileDelete}>
                삭제
              </Button>
              <Button
                type="button"
                variant="green"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                다시 등록하기
              </Button>
            </FlexBox>
          </div>
        )}
      </RHF.FormGroupField>
    </>
  );
};

export default BusinessVerificationForm;
