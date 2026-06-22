import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasBasicCreateRequest } from "@shared/api/overseas/basicApi.ts";
import type { OverseasBasicFormInput } from "@shared/schema/overseas/basicSchema.ts";

const BasicNote = () => {
  const { control } = useFormContext<OverseasBasicFormInput>();
  return (
    <FormUnitBox vertical fullsize title="비고">
      <RHF.FormTextarea control={control} name="appNote.note" maxLength={2000} height="full" className="w-full" />
    </FormUnitBox>
  );
};

export default BasicNote;
