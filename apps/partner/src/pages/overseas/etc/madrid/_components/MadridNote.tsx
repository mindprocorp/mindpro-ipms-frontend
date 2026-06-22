import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasMadridFormInput } from "@shared/schema/overseas/madridSchema.ts";

const MadridNote = () => {
  const { control } = useFormContext<OverseasMadridFormInput>();
  return (
    <FormUnitBox vertical fullsize title="비고">
      <RHF.FormTextarea control={control} name="appNote.note" className="w-full" maxLength={2000} />
    </FormUnitBox>
  );
};

export default MadridNote;
