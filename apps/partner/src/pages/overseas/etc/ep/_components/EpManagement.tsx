import { FlexBox, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasEpFormInput } from "@shared/schema/overseas/epSchema.ts";

const EpManagement = () => {
  const { control } = useFormContext<OverseasEpFormInput>();
  return (
    <FormUnitBox
      vertical
      boxfull
      title="출원 행정관리"
      className="[&>div>h2]:text-p-color-3 [&>div]:first-of-type:bg-p-color-3/5"
    >
      <RHF.FormField vertical className="[&>div]:gap-1">
        <RHF.FormDatePicker
          control={control}
          name="appManagement.claimAmendDate"
          label="청구보장일"
          className="[&>div]:max-w-36!"
          orientation="horizontal"
        />
        <RHF.FormDatePicker
          control={control}
          name="appManagement.announcementDate"
          label="공고일"
          className="[&>div]:max-w-36!"
          orientation="horizontal"
        />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="심사청구" />
        </FlexBox>
        <RHF.FormDatePicker
          important
          control={control}
          name="appManagement.examRequestDeadline"
          label="마감일"
        />
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appManagement.examRequestOrderDate"
            label="지시일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appManagement.examRequestDate"
            label="청구일"
          />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="서치" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appManagement.searchReceiptDate"
            label="접수일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appManagement.searchReportDate"
            label="보고일"
          />
        </RHF.FormField>
        <RHF.Input control={control} name="appManagement.epSearchResult" label="결과" maxLength={500} />
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="출원공개" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker control={control} name="appManagement.pubDate" label="일자" />
          <RHF.Input control={control} name="appManagement.pubNo" label="번호" maxLength={30} />
        </RHF.FormField>
      </UnitInnerBox>


    </FormUnitBox>
  );
};

export default EpManagement;
