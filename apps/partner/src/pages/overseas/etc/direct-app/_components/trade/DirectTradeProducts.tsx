import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasDirectAppFormInput } from "@shared/schema/overseas/directAppSchema.ts";

const DirectTradeProducts = () => {
  const { control } = useFormContext<OverseasDirectAppFormInput>();
  return (
    <FormUnitBox fullsize title="물품류">
      <RHF.FormTextarea control={control} name="goodsClass.goodsClass" maxLength={30} />
    </FormUnitBox>
  );
};

export default DirectTradeProducts;
