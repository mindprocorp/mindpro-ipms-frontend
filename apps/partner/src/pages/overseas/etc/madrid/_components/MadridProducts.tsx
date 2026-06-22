import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasMadridFormInput } from "@shared/schema/overseas/madridSchema.ts";

const MadridProducts = () => {
  const { control } = useFormContext<OverseasMadridFormInput>();
  return (
    <FormUnitBox fullsize title="물품류">
      <RHF.FormTextarea control={control} name="goodsClass.goodsClass" maxLength={30} />
    </FormUnitBox>
  );
};

export default MadridProducts;
