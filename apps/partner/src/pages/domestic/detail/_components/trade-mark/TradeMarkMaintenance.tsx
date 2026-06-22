import { Button, CustomTooltip, FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import type { DomesticFormInput } from "@shared/schema/domestic/domesticSchema.ts";


interface CodeListType {
  yearDiscountRatioCodeList: CodeSelectOption[];
  discountRatioCodeList: CodeSelectOption[];
};
const TradeMarkMaintenance = (codeList: CodeListType) => {
  const { control } = useFormContext<DomesticFormInput>();
  return (
    <FormUnitBox
      vertical
      boxfull
      title="등록·권리유지 관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <RHF.FormField vertical className="[&>div]:gap-1">
        <RHF.FormRadio
          control={control}
          name="appMaintenance.isRenewalManaged"
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
          label="갱신관리여부"
          orientation="horizontal"
        />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="등록" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.regDecisionDate"
            label="결정일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.regReceiptDate"
            label="접수일"
          />
        </RHF.FormField>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker control={control} name="appMaintenance.priorityDate" label="기연일" />

          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.regNormalDeadline"
            label="정상마감"
            important
          />
        </RHF.FormField>

        <RHF.FormField gap={2}>
          <RHF.FormDatePicker control={control} name="appMaintenance.regDate" label="등록일" />
          <RHF.Input
            control={control}
            name="appMaintenance.regNo"
            label="등록번호"
            krRegNoOnly
          />
        </RHF.FormField>

        <Separator className="my-2 mb-0 border-t" />

        <RHF.FormRadio
          control={control}
          name="appMaintenance.annuityYear"
          items={[
            {
              value: "5",
              label: "5년",
            },
            {
              value: "10",
              label: "10년",
            },
          ]}
          height={7}
          size="sm"
          label="납부년수"
          orientation="horizontal"
        />
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
          <RHF.Input control={control} name="appMaintenance.regAnnounceNo" label="번호" krRegNoOnly />
        </RHF.FormField>
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="연차관리" />
        </FlexBox>

        <RHF.Input
          control={control}
          name="appMaintenance.nextPaymentInstallment"
          label="차기갱신차수"
          className="[&>div]:max-w-36!"
          orientation="horizontal"
          align="right"
          numericOnly
          maxLength={5}
        />

        <Separator className="my-2 border-t" />

        <FlexBox className="justify-between">
          <BoxTitle title="마감관리" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.standardDeadline"
            label="정상마감일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appMaintenance.penaltyDeadline"
            label="과태마감일"
          />
          <RHF.Input
            control={control}
            important
            name="appMaintenance.trademarkRenewalFee"
            label="갱신등록료"
            amountOnly
            align="right"
          />
          <RHF.Input
            control={control}
            important
            name="appMaintenance.renewalLateFee"
            label="갱신과태료"
            amountOnly
            align="right"
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
          <RHF.Input control={control} name="appMaintenance.annuityAgency" label="업체" maxLength={30} />
        </RHF.FormField>
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default TradeMarkMaintenance;
