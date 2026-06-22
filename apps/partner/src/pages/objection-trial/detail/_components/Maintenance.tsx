import { type ObjectionTrialFormInput } from "@shared/schema/objection-trial/objectionTrialSchema.ts";
import { FlexBox, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";

const Maintenance = () => {
  const { control } = useFormContext<ObjectionTrialFormInput>();
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
          name="cftJudgmentInfo.preExamDate"
          orientation="horizontal"
          label="심사전치일"
          className="[&>div]:max-w-36!"
        />

        <RHF.Input
          control={control}
          name="cftJudgmentInfo.preExamResult"
          label="심사전치결과"
          className="[&>div]:max-w-36!"
          orientation="horizontal"
          maxLength={100}
        />

        <RHF.Input
          control={control}
          name="cftJudgmentInfo.finalResult"
          label="최종결과"
          className="[&>div]:max-w-36!"
          orientation="horizontal"
          maxLength={100}
        />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="보정서" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker important control={control} name="cftJudgmentInfo.amendLimitDate" label="마감일" />
          <RHF.FormDatePicker control={control} name="cftJudgmentInfo.amendSubmitDate" label="제출일" />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="판결" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker control={control} name="cftJudgmentInfo.judgmentServedDate" label="송달일" />
          <RHF.FormDatePicker control={control} name="cftJudgmentInfo.judgmentDate" label="결정일" />
        </RHF.FormField>
        <RHF.Input control={control} name="cftJudgmentInfo.decisionContent" label="결정내용" maxLength={2000} />
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="불복제기" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker important control={control} name="cftJudgmentInfo.appealLimitDate" label="마감일" />
          <RHF.FormDatePicker control={control} name="cftJudgmentInfo.appealDate" label="청구일" />
        </RHF.FormField>
        <RHF.Input control={control} name="cftJudgmentInfo.appealContent" label="제기내용" maxLength={2000} />
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="포기" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker control={control} name="cftJudgmentInfo.abandonInstructDate" label="지시일" />
          <RHF.FormDatePicker control={control} name="cftJudgmentInfo.abandonDate" label="일자" />
        </RHF.FormField>
        <RHF.FormTextarea control={control} name="cftJudgmentInfo.abandonContent" label="내용" maxLength={2000} />
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default Maintenance;
