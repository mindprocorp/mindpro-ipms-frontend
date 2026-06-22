import { FlexBox, RHF } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasMadridFormInput } from "@shared/schema/overseas/madridSchema.ts";

const MadridManagement = () => {
  const { control } = useFormContext<OverseasMadridFormInput>();
  return (
    <FormUnitBox
      vertical
      title="출원 행정관리"
      className="[&>div>h2]:text-p-color-3 [&>div]:first-of-type:bg-p-color-3/5"
    >
      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="포기" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            important
            control={control}
            name="appManagement.abandonReceiptDate"
            label="접수일"
          />
          <RHF.FormDatePicker
            important
            control={control}
            name="appManagement.abandonDate"
            label="일자"
          />
        </RHF.FormField>
        <RHF.FormTextarea
          important
          control={control}
          name="appManagement.abandonNote"
          label="내용"
          maxLength={2000}
        />
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default MadridManagement;
