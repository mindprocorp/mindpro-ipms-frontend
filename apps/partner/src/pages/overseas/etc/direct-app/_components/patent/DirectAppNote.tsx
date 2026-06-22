import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasDirectAppFormInput } from "@shared/schema/overseas/directAppSchema.ts";

const DirectAppNote = () => {
  const { control } = useFormContext<OverseasDirectAppFormInput>();
  return (
    <FormUnitBox vertical fullsize title="비고">
      <RHF.FormTextarea control={control} name="appNote.note" className="w-full" maxLength={2000} />
    </FormUnitBox>
  );
};

export default DirectAppNote;
