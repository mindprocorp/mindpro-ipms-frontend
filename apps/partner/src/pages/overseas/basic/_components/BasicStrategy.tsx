import { Button, CustomTooltip, FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasBasicCreateRequest } from "@shared/api/overseas/basicApi.ts";
import type { OverseasBasicFormInput } from "@shared/schema/overseas/basicSchema.ts";

const BasicStrategy = () => {
  const { control } = useFormContext<OverseasBasicFormInput>();
  return (
    <FormUnitBox vertical title="출원 전략설정">
      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="국제출원" />
          <p className="text-p-color-2 flex shrink-0 text-xs">* 당사 사건이 아닌 경우 기재</p>
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appStrategy.globalAppInfo.globalAppDate"
            label="출원일"
          />
          <RHF.Input
            control={control}
            name="appStrategy.globalAppInfo.globalAppNo"
            label="출원번호"
            maxLength={30}
          />
        </RHF.FormField>
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default BasicStrategy;
