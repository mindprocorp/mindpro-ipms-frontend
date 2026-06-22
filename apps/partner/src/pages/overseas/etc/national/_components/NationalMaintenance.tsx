import { FlexBox, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasNationalFormInput } from "@shared/schema/overseas/nationalSchema.ts";

const NationalMaintenance = () => {
  const { control } = useFormContext<OverseasNationalFormInput>();
  return (
    <FormUnitBox
      vertical
      boxfull
      title="등록·권리유지 관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <RHF.FormField vertical gap={1}>
        <RHF.FormDatePicker
          control={control}
          name="appMaintenance.protectionStartDate"
          orientation="horizontal"
          label="보호시작일"
          className="[&>div]:max-w-36!"
        />

        <RHF.FormDatePicker
          control={control}
          name="appMaintenance.rightPeriod"
          orientation="horizontal"
          label="권리존속기간"
          className="[&>div]:max-w-36!"
        />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="연차관리" />
        </FlexBox>

        <RHF.FormField gap={2}>
          <RHF.Input
            control={control}
            name="appMaintenance.paymentInstallment"
            label="차기차수"
            maxLength={100}
          />
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.standardDeadline"
            label="마감일"
            important
          />
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.penaltyDeadline"
            label="과태일"
            important
          />
        </RHF.FormField>
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default NationalMaintenance;
