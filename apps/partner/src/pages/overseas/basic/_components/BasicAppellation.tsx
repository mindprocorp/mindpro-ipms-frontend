import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasBasicCreateRequest } from "@shared/api/overseas/basicApi.ts";
import type { OverseasBasicFormInput } from "@shared/schema/overseas/basicSchema.ts";

const BasicAppellation = () => {
  const { control } = useFormContext<OverseasBasicFormInput>();
  return (
    <FormUnitBox vertical title="명칭정보">
      <RHF.FormTextarea control={control} name="appNameInfo.titleKo" label="국문" maxLength={255} height={15} className="w-full" />
      <RHF.FormTextarea control={control} name="appNameInfo.titleEn" label="영문" maxLength={255} height={15} className="w-full" />
    </FormUnitBox>
  );
};

export default BasicAppellation;
