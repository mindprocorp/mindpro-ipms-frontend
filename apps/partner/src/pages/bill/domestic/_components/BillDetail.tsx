import { FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext, useWatch } from "react-hook-form";
import type { BillDomesticFormInput } from "@shared/schema/bill/billDomesticSchema.ts";
import { useEffect } from "react";

const BillDetail = () => {
  const { control, setValue, getValues } = useFormContext<BillDomesticFormInput>();

  // [3] 자동 계산을 위한 감시(Watch) 설정
  const parseNumber = (val: any) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") return Number(val.replace(/,/g, "")) || 0;
    return 0;
  };

  const govFee = parseNumber(useWatch({ control, name: "govFee" }));
  const agencyFee = parseNumber(useWatch({ control, name: "agencyFee" }));
  const vat = parseNumber(useWatch({ control, name: "vat" }));
  const etcFee = parseNumber(useWatch({ control, name: "etcFee" }));
  const depAmount = parseNumber(useWatch({ control, name: "depAmount" }));
  const abandonAmount = parseNumber(useWatch({ control, name: "abandonAmount" }));

  useEffect(() => {
    const totalInvAmount = 
      parseNumber(getValues("govFee")) +
      parseNumber(getValues("agencyFee")) +
      parseNumber(getValues("vat")) +
      parseNumber(getValues("etcFee"));

    setValue("totalInvAmount", String(totalInvAmount));

    const unpaidAmount = totalInvAmount - depAmount - abandonAmount;
    setValue("unpaidAmount", String(unpaidAmount));
  }, [govFee, agencyFee, vat, etcFee, depAmount, abandonAmount, setValue, getValues]);

  return (
    <FormUnitBox
      vertical
      title="비용상세"
      className="[&>div>h2]:text-title-6 [&>div]:first-of-type:bg-bg-6 border-border-6 w-1/4 dark:[&>div]:first-of-type:bg-[#11100c]"
    >
      <RHF.FormField vertical gap={1}>
        <RHF.FormDatePicker
          control={control}
          name="govFeePayDate"
          orientation="horizontal"
          label="관납료 납부일"
          className="[&>div]:max-w-36!"
        />

        <RHF.Input
          control={control}
          name="govFeePayAmount"
          orientation="horizontal"
          label="관납료 납부액"
          amountOnly
          onFocus={(e) => { if (e.target.value === "0") setValue("govFeePayAmount", ""); }}
          className="[&>div]:max-w-36!"
        />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      <RHF.FormField
        vertical
        label="당소비용"
        className="[&>label]:text-text [&>div]:gap-2 [&>label]:font-semibold"
      >
        <RHF.Input
          control={control}
          name="govFee"
          orientation="horizontal"
          label="① 관납료"
          amountOnly
          align="right"
          onFocus={(e) => { if (e.target.value === "0") setValue("govFee", ""); }}
          className="[&>div]:max-w-36!"
        />
        <RHF.Input
          control={control}
          name="agencyFee"
          orientation="horizontal"
          label="② 수수료"
          amountOnly
          align="right"
          onFocus={(e) => { if (e.target.value === "0") setValue("agencyFee", ""); }}
          className="[&>div]:max-w-36!"
        />
        <RHF.Input
          control={control}
          name="vat"
          orientation="horizontal"
          label="③ 부가세"
          amountOnly
          align="right"
          onFocus={(e) => { if (e.target.value === "0") setValue("vat", ""); }}
          className="[&>div]:max-w-36!"
        />
        <RHF.Input
          control={control}
          name="etcFee"
          orientation="horizontal"
          label="④ 기타비용"
          amountOnly
          align="right"
          onFocus={(e) => { if (e.target.value === "0") setValue("etcFee", ""); }}
          className="[&>div]:max-w-36!"
        />
        <RHF.Input
          control={control}
          name="totalInvAmount"
          orientation="horizontal"
          label="ⓐ 청구금액(①~④)"
          ess
          align="right"
          amountOnly
          className="[&>label]:text-title-success [&_[data-slot=input-group]]:bg-success/5 [&_[data-slot=input-group]]:text-title-success [&>div]:max-w-36! [&>label]:font-semibold"
          readOnly
        />
        <RHF.Input
          control={control}
          name="depAmount"
          orientation="horizontal"
          label="ⓑ 입금액"
          align="right"
          amountOnly
          onFocus={(e) => { if (e.target.value === "0") setValue("depAmount", ""); }}
          className="[&>label]:text-text [&>div]:max-w-36! [&>label]:font-semibold"
        />
        <RHF.Input
          control={control}
          name="unpaidAmount"
          orientation="horizontal"
          label="미수금(ⓐ-ⓑ-ⓒ)"
          align="right"
          amountOnly
          className="[&>label]:text-p-color-5 [&_[data-slot=input-group]]:bg-p-color-5/5 [&_[data-slot=input-group]]:text-p-color-5 [&>div]:max-w-36! [&>label]:font-semibold"
          readOnly
        />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      <RHF.FormField
        vertical
        label="포기"
        className="[&>label]:text-text [&>div]:gap-2 [&>label]:font-semibold"
      >
        <FlexBox>
          <RHF.FormDatePicker control={control} name="abandonDate" label="일자" />

          <RHF.Input
            control={control}
            name="abandonAmount"
            amountOnly
            label="ⓒ 금액"
            align="right"
            onFocus={(e) => { if (e.target.value === "0") setValue("abandonAmount", ""); }}
          />
        </FlexBox>
        <RHF.Input control={control} name="abandonContent" label="내용" />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      <RHF.FormField
        vertical
        label="외주"
        className="[&>label]:text-text [&>div]:gap-2 [&>label]:font-semibold"
      >
        <FlexBox>
          <RHF.FormDatePicker control={control} name="outsourceDate" label="외주 송금일" />
          <RHF.Input control={control} name="outsourceContent" label="외주내역" />
        </FlexBox>
        <FlexBox>
          <RHF.Input
            control={control}
            name="outsourceAmount"
            amountOnly
            label="외주금액"
            align="right"
            onFocus={(e) => { if (e.target.value === "0") setValue("outsourceAmount", ""); }}
          />
          <RHF.Input
            control={control}
            name="outsourceVat"
            amountOnly
            label="외주 부과세"
            align="right"
            onFocus={(e) => { if (e.target.value === "0") setValue("outsourceVat", ""); }}
          />
        </FlexBox>
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      <RHF.FormField
        vertical
        label="실적"
        className="[&>label]:text-text [&>div]:gap-2 [&>label]:font-semibold"
      >
        <FlexBox>
          <RHF.FormDatePicker control={control} name="perfDate" label="실적 인정일" />

          <RHF.Input
            control={control}
            name="perfAmount"
            label="실적 인정금액"
            amountOnly
            align="right"
            onFocus={(e) => { if (e.target.value === "0") setValue("perfAmount", ""); }}
          />
        </FlexBox>
      </RHF.FormField>
    </FormUnitBox>
  );
};

export default BillDetail;
