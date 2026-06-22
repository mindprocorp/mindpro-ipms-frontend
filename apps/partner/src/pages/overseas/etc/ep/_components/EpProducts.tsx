import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasEpFormInput } from "@shared/schema/overseas/epSchema.ts";

const EpProducts = () => {
  const { control } = useFormContext<OverseasEpFormInput>();
  return (
    <FormUnitBox fullsize title="물품류">
      <RHF.FormTextarea control={control} name="appIpcClass.ipcClassification" maxLength={30} />
    </FormUnitBox>
  );
};

export default EpProducts;
