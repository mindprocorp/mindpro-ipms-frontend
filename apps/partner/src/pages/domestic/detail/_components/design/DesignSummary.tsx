import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { DomesticFormInput } from "@shared/schema/domestic/domesticSchema.ts";

const DesignSummary = () => {
  const { control } = useFormContext<DomesticFormInput>();

  return (
    <FormUnitBox vertical boxfull title="설명/요점">
      <RHF.FormTextarea
        control={control}
        name="designDescriptionInfo.designDescription"
        label="설명"
      />
      <RHF.FormTextarea
        control={control}
        name="designDescriptionInfo.designSummary"
        label="요점"
      />
    </FormUnitBox>
  );
};

export default DesignSummary;
