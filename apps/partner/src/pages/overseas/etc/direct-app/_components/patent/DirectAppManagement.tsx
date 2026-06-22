import { FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasDirectAppFormInput } from "@shared/schema/overseas/directAppSchema.ts";

const DirectAppManagement = () => {
  const { control } = useFormContext<OverseasDirectAppFormInput>();
  return (
    <FormUnitBox
      vertical
      boxfull
      title="출원 행정관리"
      className="[&>div>h2]:text-p-color-3 [&>div]:first-of-type:bg-p-color-3/5"
    >
      <RHF.FormField vertical gap={1}>
        <RHF.Input
          control={control}
          name="appManagement.ipcClassification"
          label="IPC분류"
          className="[&>div]:max-w-36!"
          orientation="horizontal"
          maxLength={100}
        />
        <RHF.FormDatePicker
          important
          control={control}
          name="appManagement.parentRegAppDate"
          label="모등록일"
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
          <BoxTitle title="출원공개" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker control={control} name="appManagement.pubDate" label="일자" />
          <RHF.Input control={control} name="appManagement.pubNo" label="번호" maxLength={30} />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="출원공고" />
        </FlexBox>
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

export default DirectAppManagement;
