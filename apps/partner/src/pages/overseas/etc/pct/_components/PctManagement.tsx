import { FlexBox, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasPctFormInput } from "@shared/schema/overseas/pctAppSchema.ts";

const PctManagement = () => {
  const { control } = useFormContext<OverseasPctFormInput>();
  return (
    <FormUnitBox
      vertical
      title="출원 행정관리"
      className="[&>div>h2]:text-p-color-3 [&>div]:first-of-type:bg-p-color-3/5"
    >
      {/*<RHF.FormField vertical className="[&>div]:gap-1">*/}
      {/*  <RHF.FormDatePicker*/}
      {/*    control={control}*/}
      {/*    name="appManagement.claimAmendDate"*/}
      {/*    label="청구보장일"*/}
      {/*    className="[&>div]:max-w-36!"*/}
      {/*    orientation="horizontal"*/}
      {/*  />*/}
      {/*  <RHF.FormDatePicker*/}
      {/*    control={control}*/}
      {/*    name="appManagement.epAnnouncementDate"*/}
      {/*    label="공고일"*/}
      {/*    className="[&>div]:max-w-36!"*/}
      {/*    orientation="horizontal"*/}
      {/*  />*/}
      {/*</RHF.FormField>*/}

      {/*<Separator className="my-2 border-t" />*/}

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="수수료 납부" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            important
            control={control}
            name="appManagement.pctFilingFeeInfo.filingFeeDeadline"
            label="마감일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appManagement.pctFilingFeeInfo.filingFeePayDate"
            label="제출일"
          />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="국제조사" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appManagement.internationalSearchInfo.isaReceiptDate"
            label="접수일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appManagement.internationalSearchInfo.isrReportDate"
            label="보고일"
          />
        </RHF.FormField>
        <RHF.Input
          control={control}
          name="appManagement.internationalSearchInfo.searchResult"
          label="결과"
          maxLength={500}
        />
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="포기" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            important
            control={control}
            name="appManagement.abandonOrderDate"
            label="지시일"
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

export default PctManagement;
