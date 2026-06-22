import { type DomesticDetailCreateRequest } from "@shared/api/domestic/domesticApi.ts";
import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";

const Note = () => {
  const { control } = useFormContext<DomesticDetailCreateRequest>();
  return (
    <FormUnitBox vertical title="비고">
      <RHF.FormTextarea control={control} name="appNote.note" />
    </FormUnitBox>
  );
};

export default Note;
