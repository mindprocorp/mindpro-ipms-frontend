import { FlexBox, RHF } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasEpFormInput } from "@shared/schema/overseas/epSchema.ts";

const EpMaintenance = () => {
  const { control } = useFormContext<OverseasEpFormInput>();
  return (
    <FormUnitBox
      vertical
      title="등록·권리유지 관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="등록결정" />
        </FlexBox>
        <RHF.FormDatePicker
          control={control}
          name="appMaintenance.regDecisionDate"
          label="결정일"
        />
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            important
            name="appMaintenance.regNormalDeadline"
            label="마감일"
          />
          <RHF.FormDatePicker
            control={control}
            important
            name="appMaintenance.regGraceDeadline"
            label="과태일"
          />
        </RHF.FormField>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.regOrderDate"
            label="지시일"
          />
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

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="포기취하" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            important
            control={control}
            name="appMaintenance.deemedWithdrawalReceiptDate"
            label="접수일"
          />
          <RHF.FormDatePicker
            important
            control={control}
            name="appMaintenance.deemedWithdrawalDate"
            label="일자"
          />
        </RHF.FormField>
        <RHF.FormTextarea
          important
          control={control}
          name="appMaintenance.deemedWithdrawalContent"
          label="내용"
          maxLength={2000}
        />
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default EpMaintenance;
