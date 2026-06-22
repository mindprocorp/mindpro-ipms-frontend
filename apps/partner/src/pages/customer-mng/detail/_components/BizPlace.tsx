import { type CustomerFormInput } from "@shared/schema/customer/customerSchema.ts";
import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";

const BizPlace = () => {
  const { control } = useFormContext<CustomerFormInput>();
  return (
    <FormUnitBox vertical boxfull title="사업장정보">
      <RHF.FormField gap={2}>
        <RHF.Input control={control} name="bizRegNo" label="번호" bizNoOnly />
        <RHF.Input control={control} name="subBizRegNo" label="종사업장번호" numericOnly maxLength={4} />
      </RHF.FormField>

      <RHF.FormField gap={2}>
        <RHF.Input control={control} name="bizName" label="상호" />
        <RHF.Input control={control} name="bizCEO" label="대표자" />
      </RHF.FormField>

      <RHF.Input control={control} name="bizAddress" label="사업장" />

      <RHF.FormField gap={2}>
        <RHF.Input control={control} name="bizType" label="업태" />
        <RHF.Input control={control} name="bizItem" label="종목" />
      </RHF.FormField>
    </FormUnitBox>
  );
};

export default BizPlace;
