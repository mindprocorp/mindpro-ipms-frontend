import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasBasicCreateRequest } from "@shared/api/overseas/basicApi.ts";
import type { OverseasBasicFormInput } from "@shared/schema/overseas/basicSchema.ts";

const BasicProducts = () => {
  const { control } = useFormContext<OverseasBasicFormInput>();
  return (
    <FormUnitBox fullsize title="물품류">
      <RHF.FormTextarea control={control} name="goodsClass.goodsClass" maxLength={30} />
    </FormUnitBox>
  );
};

export default BasicProducts;
