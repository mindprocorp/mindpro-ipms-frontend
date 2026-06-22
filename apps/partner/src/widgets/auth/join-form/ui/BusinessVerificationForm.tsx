import { useRef, useState, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button, FlexBox, Icons, RHF } from "@repo/ui";
import { publicApiClient } from "@shared/api/client";
import { useAlertStore } from "@shared/store/useAlertStore";

type BusinessVerificationFormProps = {
  regNumberFieldName?: string;
  verifiedFieldName?: string;
  paperUrlFieldName?: string;
  onFileSelect?: (file: File | null) => void;
};

const BusinessVerificationForm = ({
  regNumberFieldName = "corpRegNumber",
  verifiedFieldName = "corpRegVerified",
  paperUrlFieldName = "corpPaperUrl",
  onFileSelect,
}: BusinessVerificationFormProps) => {
  const { control, setValue, getValues, setError, clearErrors } = useFormContext();
  const { openAlert } = useAlertStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; previewUrl: string | null } | null>(null);
  const [verifiedNumber, setVerifiedNumber] = useState<string | null>(null);

  const corpRegNumber = useWatch({ control, name: regNumberFieldName });
  const corpRegVerified = useWatch({ control, name: verifiedFieldName });

  // 사업자등록번호 변경 시 검증 초기화
  useEffect(() => {
    if (corpRegVerified && verifiedNumber && corpRegNumber !== verifiedNumber) {
      setValue(verifiedFieldName, false);
      setVerifiedNumber(null);
      clearErrors(regNumberFieldName);
    }
  }, [corpRegNumber, corpRegVerified, verifiedNumber, setValue, verifiedFieldName]);

  // 사업자등록번호 검증
  const handleVerify = async () => {
    const regNumber = getValues(regNumberFieldName);
    if (!regNumber || regNumber.length !== 10) {
      openAlert({ message: "사업자등록번호 10자리를 입력해주세요." });
      return;
    }

    setIsVerifying(true);
    try {
      const { data } = await publicApiClient.axios.get("/api/v1/common/registry/public/nts/status", {
        params: { bno: regNumber },
      });
      const result = data.data;
      if (result.tax_type_cd && result.tax_type_cd !== "") {
        setValue(verifiedFieldName, true);
        setVerifiedNumber(regNumber);
        clearErrors(regNumberFieldName);
        openAlert({ message: `사업자 확인 완료 (${result.tax_type})` });
      } else {
        setValue(verifiedFieldName, false);
        setError(regNumberFieldName, { message: result.tax_type || "유효하지 않은 사업자등록번호입니다." });
      }
    } catch {
      setValue(verifiedFieldName, false);
      setError(regNumberFieldName, { message: "사업자등록번호 확인에 실패했습니다." });
    } finally {
      setIsVerifying(false);
    }
  };

  // 파일 선택 (로컬 보관만, 업로드 안 함)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/gif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      openAlert({ message: "PNG, JPG, GIF, PDF 파일만 업로드 가능합니다." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      openAlert({ message: "파일 크기는 5MB 이하만 가능합니다." });
      return;
    }

    // 이미지면 미리보기 생성
    const isImage = file.type.startsWith("image/");
    if (isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile({ name: file.name, type: file.type, previewUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile({ name: file.name, type: file.type, previewUrl: null });
    }

    setValue(paperUrlFieldName, file.name);
    clearErrors(paperUrlFieldName);
    // 부모에 File 객체 전달
    onFileSelect?.(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileDelete = () => {
    setValue(paperUrlFieldName, "");
    setSelectedFile(null);
    onFileSelect?.(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      {/* 사업자등록번호 검증 */}
      <RHF.Input
        size="h44"
        control={control}
        name={regNumberFieldName}
        label="사업자등록번호"
        ess
        noSpace
        inputMode="numeric"
        disabled={corpRegVerified}
        placeholder="하이픈(-) 없이 10자리 입력"
        maxLength={10}
        actions={
          <Button
            size="h44"
            type="button"
            variant={corpRegVerified ? "outline" : "primary"}
            className="w-28"
            onClick={handleVerify}
            disabled={corpRegVerified || isVerifying || !corpRegNumber || !/^\d{10}$/.test(corpRegNumber)}
          >
            {isVerifying ? "확인중..." : corpRegVerified ? "확인완료" : "확인"}
          </Button>
        }
      />

      {/* 사업자등록증 업로드 */}
      <RHF.FormGroupField control={control} vertical name={paperUrlFieldName} label="사업자등록증" ess>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {!selectedFile ? (
          <Button
            size="h44"
            type="button"
            variant="primary"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            사업자등록증 등록하기
          </Button>
        ) : (
          <div className="border-border-200 space-y-3 rounded-sm border p-4">
            {selectedFile.previewUrl ? (
              <div className="flex items-center justify-center">
                <img src={selectedFile.previewUrl} alt="사업자등록증" className="max-h-80 object-contain" />
              </div>
            ) : (
              <div className="bg-bg-100 flex items-center gap-3 rounded-md p-3">
                <Icons.FileText className="text-text-200 size-8" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-text-200 text-xs">첨부 완료</p>
                </div>
              </div>
            )}
            <FlexBox grow>
              <Button size="h44" type="button" className="w-full" onClick={handleFileDelete}>
                삭제
              </Button>
              <Button
                size="h44"
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
