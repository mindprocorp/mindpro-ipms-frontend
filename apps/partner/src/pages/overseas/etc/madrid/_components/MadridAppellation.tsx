import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasMadridFormInput } from "@shared/schema/overseas/madridSchema.ts";

const MadridAppellation = () => {
  const { control } = useFormContext<OverseasMadridFormInput>();
  return (
    <FormUnitBox vertical boxfull title="명칭정보">
      <RHF.FormTextarea control={control} name="appNameInfo.titleKo" label="국문" maxLength={255} />
      <RHF.FormTextarea control={control} name="appNameInfo.titleEn" label="영문" maxLength={255} />
    </FormUnitBox>
  );
};

export default MadridAppellation;
