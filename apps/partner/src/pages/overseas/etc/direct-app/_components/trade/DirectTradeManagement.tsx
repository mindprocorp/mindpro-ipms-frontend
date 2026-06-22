import { FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasDirectAppFormInput } from "@shared/schema/overseas/directAppSchema.ts";

const DirectTradeManagement = () => {
  const { control } = useFormContext<OverseasDirectAppFormInput>();
  return (
    <FormUnitBox
      vertical
      boxfull
      title="출원 행정관리"
      className="[&>div>h2]:text-p-color-3 [&>div]:first-of-type:bg-p-color-3/5"
    >
      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="출원공고" />
        </FlexBox>
        <RHF.FormDatePicker
          control={control}
          name="appManagement.announcementDecisionDate"
          label="결정일"
        />
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appManagement.announcementDate"
            label="일자"
          />
          <RHF.Input control={control} name="appManagement.announcementNo" label="번호" maxLength={30} />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="포기" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appManagement.abandonOrderDate"
            label="접수일"
          />
          <RHF.FormDatePicker control={control} name="appManagement.abandonDate" label="일자" />
        </RHF.FormField>
        <RHF.FormTextarea control={control} name="appManagement.abandonNote" label="내용" maxLength={2000} />
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default DirectTradeManagement;
