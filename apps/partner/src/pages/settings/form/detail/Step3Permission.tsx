import { useState } from "react";
import { Label, RadioGroup, RadioGroupItem, Separator } from "@repo/ui";
import type { FormTemplateTargetVO } from "@shared/api/organization/formTemplateApi";
import { FormRow, SectionTitle } from "./FormTemplateWizard";
import TargetTable from "./_common/TargetTable";

interface Props {
  targets: FormTemplateTargetVO[];
  onTargetsChange: (t: FormTemplateTargetVO[]) => void;
}

const SCOPE_ITEMS = [
  { label: "모두 허용", value: "N" },
  { label: "대상 지정", value: "Y" },
];

const Step3Permission = ({ targets, onTargetsChange }: Props) => {
  const [writeAuthYn, setWriteAuthYn] = useState(targets.some((t) => t.targetRole === "WRITE_AUTH") ? "Y" : "N");
  const [readAuthYn, setReadAuthYn] = useState(targets.some((t) => t.targetRole === "READ_AUTH") ? "Y" : "N");

  const handleModeChange = (role: string, val: string) => {
    if (role === "WRITE_AUTH") setWriteAuthYn(val);
    else setReadAuthYn(val);
    if (val === "N") onTargetsChange(targets.filter((t) => t.targetRole !== role));
  };

  return (
    <div>
      <SectionTitle>작성 권한</SectionTitle>
      <FormRow label="작성 권한">
        <RadioGroup value={writeAuthYn} onValueChange={(v) => handleModeChange("WRITE_AUTH", v)} className="flex gap-4">
          {SCOPE_ITEMS.map((item, i) => (
            <Label key={item.value} htmlFor={`write-${i}`} className="flex w-max cursor-pointer items-center gap-3">
              <RadioGroupItem value={item.value} id={`write-${i}`} className="shadow-none" />
              <span>{item.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </FormRow>
      {writeAuthYn === "Y" && (
        <FormRow label="작성 대상" alignTop>
          <TargetTable targets={targets} onTargetsChange={onTargetsChange} role="WRITE_AUTH" label="작성 대상" />
        </FormRow>
      )}

      <Separator className="my-6" />

      <SectionTitle>열람 권한</SectionTitle>
      <FormRow label="열람 권한">
        <RadioGroup value={readAuthYn} onValueChange={(v) => handleModeChange("READ_AUTH", v)} className="flex gap-4">
          {SCOPE_ITEMS.map((item, i) => (
            <Label key={item.value} htmlFor={`read-${i}`} className="flex w-max cursor-pointer items-center gap-3">
              <RadioGroupItem value={item.value} id={`read-${i}`} className="shadow-none" />
              <span>{item.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </FormRow>
      {readAuthYn === "Y" && (
        <FormRow label="열람 대상" alignTop>
          <TargetTable targets={targets} onTargetsChange={onTargetsChange} role="READ_AUTH" label="열람 대상" />
        </FormRow>
      )}
    </div>
  );
};

export default Step3Permission;
