import { FlexBox, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasEpFormInput } from "@shared/schema/overseas/epSchema.ts";

const EpStrategy = () => {
  const { control } = useFormContext<OverseasEpFormInput>();
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

      <Separator className="my-2 border-t" />

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="국제출원" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appStrategy.globalAppInfo.globalAppDate"
            label="일자"
          />
          <RHF.Input control={control} name="appStrategy.globalAppInfo.globalAppNo" label="번호" maxLength={30} />
        </RHF.FormField>
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default EpStrategy;
