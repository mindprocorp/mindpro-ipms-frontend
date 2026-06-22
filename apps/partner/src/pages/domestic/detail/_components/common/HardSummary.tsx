import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { DomesticFormInput } from "@shared/schema/domestic/domesticSchema.ts";

const HardSummary = () => {
  const { control } = useFormContext<DomesticFormInput>();

  return (
    <FormUnitBox vertical boxfull title="요약/청구">
      <RHF.FormTextarea
        control={control}
        name="claimSummaryInfo.summary"
        label="요약"
      />
      <RHF.FormTextarea
        control={control}
        name="claimSummaryInfo.claimScope"
        label="청구범위"
      />
    </FormUnitBox>
  );
};

export default HardSummary;
