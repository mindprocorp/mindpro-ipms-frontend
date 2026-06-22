import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { DomesticFormInput } from "@shared/schema/domestic/domesticSchema.ts";

const DesignProducts = () => {
  const { control } = useFormContext<DomesticFormInput>();
  return (
    <FormUnitBox fullsize title="물품류">
      <RHF.FormTextarea control={control} name="goodsClass.goodsClass" maxLength={30} />
    </FormUnitBox>
  );
};

export default DesignProducts;
