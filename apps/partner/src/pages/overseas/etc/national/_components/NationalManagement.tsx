import { FlexBox, RHF } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasNationalFormInput } from "@shared/schema/overseas/nationalSchema.ts";

const NationalManagement = () => {
  const { control } = useFormContext<OverseasNationalFormInput>();
  return (
    <FormUnitBox
      vertical
      boxfull
      title="출원 행정관리"
      className="[&>div>h2]:text-p-color-3 [&>div]:first-of-type:bg-p-color-3/5"
    >
      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="보정" />
        </FlexBox>
        <RHF.FormDatePicker control={control} name="appManagement.amendNoticeDate" label="통지일" />
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            important
            control={control}
            name="appManagement.amendDeadline"
            label="마감일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appManagement.amendSubmitDate"
            label="제출일"
          />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="공개" />
        </FlexBox>

        <RHF.FormField gap={2}>
          <RHF.FormSelect
            control={control}
            name="appManagement.publicYn"
            items={[
              { label: "Y", value: "Y" },
              { label: "N", value: "N" },
            ]}
            label="공개선택"
          />
          <RHF.Input control={control} name="appManagement.defermentMonthCount" label="연기월수" numericOnly maxLength={5} />
        </RHF.FormField>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            important
            control={control}
            name="appManagement.pubDate"
            label="일자"
          />
          <RHF.Input control={control} name="appManagement.pubNo" label="번호" maxLength={30} />
        </RHF.FormField>
      </UnitInnerBox>

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

export default NationalManagement;
