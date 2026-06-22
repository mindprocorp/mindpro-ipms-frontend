import { FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { DomesticFormInput } from "@shared/schema/domestic/domesticSchema.ts";



const Management = () => {
  const { control } = useFormContext<DomesticFormInput>();
  return (
    <FormUnitBox
      vertical
      boxfull
      title="출원 행정관리"
      className="[&>div>h2]:text-p-color-3 [&>div]:first-of-type:bg-p-color-3/5"
    >
      <RHF.FormField vertical gap={1}>
        <RHF.FormRadio
          control={control}
          name="appManagement.isPoaSubmitted"
          orientation="horizontal"
          items={[
            {
              value: "Y",
              label: "예",
            },
            {
              value: "N",
              label: "아니오",
            },
          ]}
          size="sm"
          height={7}
          label="위임장 제출"
        />

        <RHF.Input
          control={control}
          name="appManagement.ipcClassification"
          label="IPC분류"
          className="[&>div]:max-w-36!"
          orientation="horizontal"
          maxLength={30}
        />

        <RHF.FormDatePicker
          control={control}
          name="appManagement.earlyPubRequestDate"
          orientation="horizontal"
          label="조기공개신청일"
          className="[&>div]:max-w-36!"
        />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="국내우선권" />
          <RHF.FormRadio
            control={control}
            name="appManagement.hasDomesticPriority"
            items={[
              {
                value: "Y",
                label: "예",
              },
              {
                value: "N",
                label: "아니오",
              },
            ]}
            size="sm"
            height={7}
          />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            important
            control={control}
            name="appManagement.domesticPriorDeadline"
            label="마감일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appManagement.domesticPriorDate"
            label="주장일"
          />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="심사청구" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            important
            control={control}
            name="appManagement.examRequestDeadline"
            label="마감일"
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
          <BoxTitle title="우선심사" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appManagement.priorExamReqDate"
            label="청구일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appManagement.priorExamDecDate"
            label="결정일"
          />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="출원공개" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker control={control} name="appManagement.pubDate" label="일자" />
          <RHF.Input control={control} name="appManagement.pubNo" label="번호" krAppNoOnly />
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
          <RHF.Input control={control} name="appManagement.announcementNo" label="번호" krAppNoOnly />
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
            label="지시일"
          />
          <RHF.FormDatePicker control={control} name="appManagement.abandonDate" label="일자" />
        </RHF.FormField>
        <RHF.FormTextarea control={control} name="appManagement.abandonNote" label="내용" />
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default Management;
