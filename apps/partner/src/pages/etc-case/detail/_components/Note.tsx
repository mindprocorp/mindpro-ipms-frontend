import { type EtcCaseFormInput } from "@shared/schema/etc-case/etcCaseSchema.ts";
import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";

const Note = () => {
  const { control } = useFormContext<EtcCaseFormInput>();
  return (
    <FormUnitBox vertical title="비고">
      <RHF.FormTextarea control={control} name="cftNoteInfo.note" className="w-full" maxLength={2000} />
    </FormUnitBox>
  );
};

export default Note;
