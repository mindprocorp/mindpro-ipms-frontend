import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { RHF, Button, Icons } from "@repo/ui";
import { publicApiClient } from "@shared/api/client";
import { useAlertStore } from "@shared/store/useAlertStore";

const CompanySearchForm = () => {
  const { control, setValue } = useFormContext();
  const { openAlert } = useAlertStore();
  const [verified, setVerified] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const handleVerify = async () => {
    const code = (document.querySelector<HTMLInputElement>("[name=inviteCode]")?.value || "").trim();
    if (!code) {
      openAlert({ message: "초대코드를 입력해주세요." });
      return;
    }
    try {
      const { data } = await publicApiClient.axios.get("/api/v1/common/registry/public/verify-invite-code", {
        params: { code },
        _skipGlobalError: true,
      } as any);
      if (data.data) {
        setValue("companyId", data.data.id);
        setValue("companyName", data.data.label);
        setCompanyName(data.data.label);
        setVerified(true);
      }
    } catch {
      setVerified(false);
      setValue("companyId", "");
      setValue("companyName", "");
      setCompanyName("");
    }
  };

  const handleReset = () => {
    setVerified(false);
    setCompanyName("");
    setValue("companyId", "");
    setValue("companyName", "");
    setValue("inviteCode", "");
  };

  return (
    <div className="space-y-2">
      <RHF.Input
        size="h44"
        control={control}
        name="inviteCode"
        label="회사 초대코드 (선택)"
        placeholder="회사에서 발급받은 초대코드 입력"
        inputDisabled={verified}
        actions={
          verified ? (
            <Button type="button" size="h44" variant="outline" className="w-28" onClick={handleReset}>
              초기화
            </Button>
          ) : (
            <Button type="button" size="h44" variant="primary" className="w-28" onClick={handleVerify}>
              확인
            </Button>
          )
        }
      />
      {verified && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          <Icons.Check className="size-4" />
          <span className="font-medium">{companyName}</span>에 소속됩니다.
        </div>
      )}
    </div>
  );
};

export default CompanySearchForm;
