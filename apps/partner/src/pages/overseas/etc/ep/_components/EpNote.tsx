import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasEpFormInput } from "@shared/schema/overseas/epSchema.ts";

const EpNote = () => {
  const { control } = useFormContext<OverseasEpFormInput>();
  return (
    <FormUnitBox vertical fullsize title="비고">
      <RHF.FormTextarea control={control} name="appNote.note" className="w-full" maxLength={2000} />
    </FormUnitBox>
  );
};

export default EpNote;
