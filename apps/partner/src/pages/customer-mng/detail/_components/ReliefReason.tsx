import { type CustomerFormInput } from "@shared/schema/customer/customerSchema.ts";
import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import type { CodeSelectOption } from "@shared/api/common/commApi";

interface ReliefReasonProps {
  reliefTargetList: CodeSelectOption[];
}

const ReliefReason = ({ reliefTargetList }: ReliefReasonProps) => {
  const { control, trigger } = useFormContext<CustomerFormInput>();
  // reliefTarget 변경 시 cross-field(zod superRefine) 재검증 → 인라인 에러 노출
  const reliefTarget = useWatch({ control, name: "reliefTarget" });
  const required = !!reliefTarget;

  useEffect(() => {
    trigger(["reliefReason", "reliefIssueDate", "reliefExemptionDate"]);
  }, [reliefTarget, trigger]);

  return (
    <FormUnitBox vertical title="감면사유">
      <RHF.FormSelect control={control} name="reliefTarget" items={reliefTargetList} label="대상(%)" />
      <RHF.Input control={control} name="reliefReason" label="사류/사유" important={required} />
      <RHF.FormField gap={2}>
        <RHF.FormDatePicker control={control} name="reliefIssueDate" label="발급일" important={required} />
        <div className="flex w-full items-center gap-2">
          <RHF.FormDatePicker control={control} name="reliefExemptionDate" label="면제기간" important={required} />
          <span className="text-text-200 shrink-0 pt-5 text-xs">까지 면제</span>
        </div>
      </RHF.FormField>
    </FormUnitBox>
  );
};

export default ReliefReason;
