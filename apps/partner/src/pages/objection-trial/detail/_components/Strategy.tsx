import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";

const Strategy = () => {
  const { control } = useFormContext();
  return (
    <FormUnitBox vertical title="출원 전략설정">
      <RHF.FormField gap={2} name="testVal" label="원등록">
        <RHF.FormDatePicker control={control} name="testVal" />
        <RHF.Input control={control} name="testVal" placeholder="번호입력" />
      </RHF.FormField>
    </FormUnitBox>
  );
};

export default Strategy;
