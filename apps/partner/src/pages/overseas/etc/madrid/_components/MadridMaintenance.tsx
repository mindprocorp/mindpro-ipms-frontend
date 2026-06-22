import { FlexBox, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasMadridFormInput } from "@shared/schema/overseas/madridSchema.ts";

const MadridMaintenance = () => {
  const { control } = useFormContext<OverseasMadridFormInput>();
  return (
    <FormUnitBox
      vertical
      boxfull
      title="등록·권리유지 관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="국내등록" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.domesticRegInfo.domesticRegDate"
            label="일자"
          />
          <RHF.Input
            control={control}
            name="appMaintenance.domesticRegInfo.domesticRegNo"
            label="번호"
            maxLength={30}
          />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="등록" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker control={control} name="appMaintenance.regDate" label="일자" />
          <RHF.Input control={control} name="appMaintenance.regNo" label="번호" maxLength={30} />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="갱신관리" />
        </FlexBox>

        <RHF.Input
          control={control}
          name="appMaintenance.paymentInstallment"
          label="차기갱신차수"
          className="[&>div]:max-w-36!"
          orientation="horizontal"
          maxLength={100}
        />

        <Separator className="my-2 border-t" />

        <FlexBox className="justify-between">
          <BoxTitle title="마감관리" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            important
            name="appMaintenance.standardDeadline"
            label="마감일"
          />
          <RHF.FormDatePicker
            control={control}
            important
            name="appMaintenance.penaltyDeadline"
            label="과태일"
          />
        </RHF.FormField>

        <FlexBox className="mt-4 justify-between">
          <BoxTitle title="관리위임" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.annuityOrderDate"
            label="일자"
          />
          <RHF.Input control={control} name="appMaintenance.annuityAgency" label="업체" maxLength={100} />
        </RHF.FormField>
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default MadridMaintenance;
