import { RHF, Separator } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasDirectAppFormInput } from "@shared/schema/overseas/directAppSchema.ts";

const DirectTradeStrategy = () => {
  const { control } = useFormContext<OverseasDirectAppFormInput>();
  return (
    <FormUnitBox vertical title="출원 전략설정">
      <RHF.FormField gap={2} name="appStrategy.originalAppInfo" label="원출원">
        <RHF.FormDatePicker control={control} name="appStrategy.originalAppInfo.originalAppDate" />
        <RHF.Input
          control={control}
          name="appStrategy.originalAppInfo.originalAppNo"
          placeholder="번호입력"
          maxLength={30}
        />
      </RHF.FormField>

      <RHF.FormField gap={2} name="appStrategy.reAppInfo" label="재출원">
        <RHF.FormDatePicker control={control} name="appStrategy.reAppInfo.reAppDate" />
        <RHF.Input control={control} name="appStrategy.reAppInfo.reAppNo" placeholder="번호입력" maxLength={30} />
      </RHF.FormField>
    </FormUnitBox>
  );
};

export default DirectTradeStrategy;
