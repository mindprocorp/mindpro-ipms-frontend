import { type ObjectionTrialFormInput } from "@shared/schema/objection-trial/objectionTrialSchema.ts";
import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";

const Products = () => {
  const { control } = useFormContext<ObjectionTrialFormInput>();
  return (
    <FormUnitBox fullsize title="물품류" titleExtra={<span className="text-muted-foreground flex items-center gap-1 text-[11px] font-normal"><span>·</span>출원번호 검색 시 자동으로 입력됩니다.</span>}>
      <RHF.FormTextarea control={control} name="appGoodsInfo.goodsClass" placeholder="" readOnly className="pointer-events-none" />
    </FormUnitBox>
  );
};

export default Products;
