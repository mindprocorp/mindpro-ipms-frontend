import { type CustomerFormInput } from "@shared/schema/customer/customerSchema.ts";
import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";

const Note = () => {
  const { control } = useFormContext<CustomerFormInput>();
  return (
    <FormUnitBox vertical fullsize title="비고">
      <RHF.FormTextarea control={control} name="note" />
    </FormUnitBox>
  );
};

export default Note;
