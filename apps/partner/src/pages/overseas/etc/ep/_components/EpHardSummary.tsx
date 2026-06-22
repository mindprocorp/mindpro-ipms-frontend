import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { DomesticFormInput } from "@shared/schema/domestic/domesticSchema.ts";
import type { OverseasEpFormInput } from "@shared/schema/overseas/epSchema.ts";

const EpHardSummary = () => {
  const { control } = useFormContext<OverseasEpFormInput>();
  return (
    <FormUnitBox vertical boxfull title="요약/청구">
      <RHF.FormTextarea control={control} name="claimSummaryInfo.summary" label="요약" maxLength={2000} />
      <RHF.FormTextarea control={control} name="claimSummaryInfo.claimScope" label="청구범위" maxLength={2000} />
    </FormUnitBox>
  );
};

export default EpHardSummary;
