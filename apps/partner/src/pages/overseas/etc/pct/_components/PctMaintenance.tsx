import { FlexBox, RHF } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasPctFormInput } from "@shared/schema/overseas/pctAppSchema.ts";

const PctMaintenance = () => {
  const { control } = useFormContext<OverseasPctFormInput>();
  return (
    <FormUnitBox
      vertical
      boxfull
      title="등록·권리유지 관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="예비심사" />
        </FlexBox>
        <RHF.FormDatePicker
          important
          control={control}
          name="appMaintenance.pctIpeInfo.ipeDeadline"
          label="마감일"
        />
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.pctIpeInfo.ipeRequestDate"
            label="청구일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.pctIpeInfo.ipeReportDate"
            label="보고일"
          />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="국제공개" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.intlPubInfo.intlReceiptDate"
            label="접수일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.intlPubInfo.intlPubDate"
            label="일자"
          />
        </RHF.FormField>
        <RHF.Input control={control} name="appMaintenance.intlPubInfo.intlPubNo" label="번호" maxLength={30} />
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default PctMaintenance;
