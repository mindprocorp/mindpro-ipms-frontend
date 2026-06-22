import { Button, CustomTooltip, FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasDirectAppFormInput } from "@shared/schema/overseas/directAppSchema.ts";
const DirectDesignMaintenance = () => {
  const { control } = useFormContext<OverseasDirectAppFormInput>();
  return (
    <FormUnitBox
      vertical
      boxfull
      title="등록·권리유지 관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <RHF.FormField vertical className="[&>div]:gap-1">
        <RHF.Input
          control={control}
          name="appMaintenance.goodsClass.goodsClass"
          label="물폼분류"
          className="[&>div]:max-w-36!"
          orientation="horizontal"
          maxLength={30}
        />

        <RHF.Input
          control={control}
          name="appMaintenance.kipoDelayDays"
          label="특허청지연일(PAT)"
          className="[&>div]:max-w-36!"
          orientation="horizontal"
          numericOnly
          maxLength={100}
        />

        <RHF.FormDatePicker
          control={control}
          name="appMaintenance.rightPeriod"
          label="권리존속기간"
          className="[&>div]:max-w-36!"
          orientation="horizontal"
        />
        <RHF.FormRadio
          control={control}
          name="appMaintenance.isAnnuityManaged"
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
          height={7}
          size="sm"
          label="연차관리여부"
          orientation="horizontal"
        />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="등록결정" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.regDecisionDate"
            label="결정일"
          />
        </RHF.FormField>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.regNormalDeadline"
            label="정상마감"
            important
          />
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.regGraceDeadline"
            label="과태마감"
            important
          />
        </RHF.FormField>

        <RHF.FormField gap={2}>
          <RHF.FormDatePicker control={control} name="appMaintenance.regOrderDate" label="지시일" />
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.regPaymentDate"
            label="납부일"
          />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="등록" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker control={control} name="appMaintenance.regDate" label="등록일" />
          <RHF.Input control={control} name="appMaintenance.regNo" label="등록번호" maxLength={30} />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="등록 공고" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.regAnnounceDate"
            label="일자"
          />
          <RHF.Input control={control} name="appMaintenance.regAnnounceNo" label="번호" maxLength={30} />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="연차관리" />
        </FlexBox>

        <RHF.Input
          control={control}
          name="appMaintenance.nextPaymentInstallment"
          label="차기납부차수"
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
            label="정상마감일"
          />
          <RHF.FormDatePicker
            control={control}
            important
            name="appMaintenance.penaltyDeadline"
            label="과태마감일"
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

export default DirectDesignMaintenance;
