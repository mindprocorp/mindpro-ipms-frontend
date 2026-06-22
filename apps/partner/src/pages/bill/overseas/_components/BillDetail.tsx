import { FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
// 인커밍 전용 스키마 타입 임포트
import { type BillIncomingFormInput } from "@shared/schema/bill/billOverseaIncomingSchema.ts";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts"; // 타입 임포트 추가

// [1] Props 인터페이스 정의
interface BillDetailProps {
  currencyCodeList: CodeSelectOption[];
}

// [2] Props를 인자로 받도록 수정 (구조 분해 할당)
const BillDetail = ({ currencyCodeList }: BillDetailProps) => {
  // 제네릭 타입을 BillIncomingFormInput으로 설정하여 타입 안정성 확보
  const { control, setValue, getValues } = useFormContext<BillIncomingFormInput>();

  //   [신규] 어느 쪽 금액이 기준인지를 추적 ('FOREIGN' | 'KRW')
  //   [신규] 어느 쪽 금액이 기준인지를 추적 ('FOREIGN' | 'KRW')
  const lastModifiedCurrency = useRef<'FOREIGN' | 'KRW' | 'NONE'>('NONE');

  // [3] 자동 계산을 위한 감시(Watch) 설정
  const parseNumber = (val: any) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") return Number(val.replace(/,/g, "")) || 0;
    return 0;
  };

  // [3.1] 외화 필드 감시
  const foreignGovFee = parseNumber(useWatch({ control, name: "foreignGovFee" }));
  const foreignAgencyFee = parseNumber(useWatch({ control, name: "foreignAgencyFee" }));
  const foreignVat = parseNumber(useWatch({ control, name: "foreignVat" }));
  const foreignTransFee = parseNumber(useWatch({ control, name: "foreignTransFee" }));
  const foreignAgencyVat = parseNumber(useWatch({ control, name: "foreignVat" })); // typo?
  const foreignEtcFee = parseNumber(useWatch({ control, name: "foreignEtcFee" }));

  // [3.2] 원화 필드 감시 (합계 계산용)
  const govFee = parseNumber(useWatch({ control, name: "govFee" }));
  const agencyFee = parseNumber(useWatch({ control, name: "agencyFee" }));
  const vat = parseNumber(useWatch({ control, name: "vat" }));
  const transFee = parseNumber(useWatch({ control, name: "transFee" }));
  const etcFee = parseNumber(useWatch({ control, name: "etcFee" }));

  // [3.3] 기타 필드 감시
  const exchangeRate = parseNumber(useWatch({ control, name: "exchangeRate" }));
  const depAmount = parseNumber(useWatch({ control, name: "depAmount" }));
  const abandonAmount = parseNumber(useWatch({ control, name: "abandonAmount" }));

  // [1] 외화 -> 원화 자동 동기화 (환율 반영)
  useEffect(() => {
    // 💡 초기 로드 시에는 동기화 로직을 건너뜀 (DB에서 가져온 원화 값이 0(외화)으로 덮어써지는 것 방지)
    if (lastModifiedCurrency.current === 'NONE') {
      // 초기 로드 시에도 외화 합계는 계산해줌
      const totalForeign = foreignGovFee + foreignAgencyFee + foreignVat + foreignTransFee + foreignEtcFee;
      setValue("foreignCostAmount", String(totalForeign));
      return;
    }

    const rate = exchangeRate || 1;

    // 💡 기준 통화가 KRW인 경우 환율 변경 시 외화를 업데이트함
    if (lastModifiedCurrency.current === 'KRW') {
      const syncToForeign = (krwVal: number, foreignFieldName: keyof BillIncomingFormInput) => {
        const calculatedForeign = Math.round((krwVal / rate) * 100) / 100;
        const currentForeign = parseNumber(getValues(foreignFieldName));
        if (Math.abs(calculatedForeign - currentForeign) > 0.01) {
          setValue(foreignFieldName, calculatedForeign);
        }
      };

      syncToForeign(govFee, "foreignGovFee");
      syncToForeign(agencyFee, "foreignAgencyFee");
      syncToForeign(vat, "foreignVat");
      syncToForeign(transFee, "foreignTransFee");
      syncToForeign(etcFee, "foreignEtcFee");
    } else if (lastModifiedCurrency.current === 'FOREIGN') {
      // 기본값: 기준 통화가 FOREIGN인 경우 원화를 업데이트함
      const syncToKRW = (foreignVal: number, krwFieldName: keyof BillIncomingFormInput) => {
        const calculatedKRW = Math.round(foreignVal * rate);
        const currentKRW = parseNumber(getValues(krwFieldName));
        if (Math.abs(calculatedKRW - currentKRW) > 1) {
          setValue(krwFieldName, String(calculatedKRW));
        }
      };

      syncToKRW(foreignGovFee, "govFee");
      syncToKRW(foreignAgencyFee, "agencyFee");
      syncToKRW(foreignVat, "vat");
      syncToKRW(foreignTransFee, "transFee");
      syncToKRW(foreignEtcFee, "etcFee");
    }

    // 외화 합계 계산
    const totalForeign = foreignGovFee + foreignAgencyFee + foreignVat + foreignTransFee + foreignEtcFee;
    setValue("foreignCostAmount", String(totalForeign));
  }, [foreignGovFee, foreignAgencyFee, foreignVat, foreignTransFee, foreignEtcFee, govFee, agencyFee, vat, transFee, etcFee, exchangeRate, setValue, getValues]);

  // [2] 합계 및 미수금 자동 계산
  useEffect(() => {
    const totalKRW = govFee + agencyFee + vat + transFee + etcFee;
    setValue("totalInvAmount", String(totalKRW));
    setValue("krwAmount", String(totalKRW));
    setValue("unpaidAmount", String(totalKRW - depAmount - abandonAmount));
    setValue("exchangeDiffAmount", String(totalKRW - depAmount));
  }, [govFee, agencyFee, vat, transFee, etcFee, depAmount, abandonAmount, setValue]);

  //   [신규] 원화 입력 시 외화 역산 로직 (onBlur 권장하여 입력 방해 최소화)
  const handleKRWBlur = (foreignName: keyof BillIncomingFormInput, krwValue: string) => {
    lastModifiedCurrency.current = 'KRW'; // 원화를 수정했음을 기록
    const krw = parseNumber(krwValue);
    if (!krw) return;
    const rate = exchangeRate || 1;
    const calculatedForeign = Math.round((krw / rate) * 100) / 100;
    setValue(foreignName, calculatedForeign);
  };

  return (
    <FormUnitBox
      vertical
      title="비용상세"
      className="[&>div>h2]:text-title-6 [&>div]:first-of-type:bg-bg-6 border-border-6 w-1/4 dark:[&>div]:first-of-type:bg-[#11100c]"
    >
      {/* 상단 납부 정보 */}
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
          label="관납료납부액"
          align="right"
          priceOnly
          decimalOnly
          // DB utb_cost_mst.krw_amount = numeric(15,0) — 정수부 최대 14자리 + 콤마 표시 자릿수 포함 18 (14 digits + 4 commas)
          maxLength={18}
          onFocus={(e) => { if (e.target.value === "0") setValue("govFeePayAmount", ""); }}
          className="[&>div]:max-w-36!"
        />
        <RHF.FormDatePicker
          control={control}
          name="vatPayDate"
          orientation="horizontal"
          label="부가세 납부일"
          className="[&>div]:max-w-36!"
        />
      </RHF.FormField>

      {/* 환율 정보 섹션 */}
      <UnitInnerBox className="bg-bg-50 rounded-[4px]">
        <BoxTitle title="환율정보" />
        <FlexBox>
          <RHF.FormSelect
            control={control}
            name="currencyUnit.code"
            // [3] 부모로부터 전달받은 currencyCodeList 바인딩
            items={currencyCodeList}
            label="화페단위"
            placeholder="선택"
          />
          <RHF.FormDatePicker control={control} name="exchangeRateDate" label="환율적용일" />
          <RHF.Input control={control} name="exchangeRate" align="right" label="환율" priceOnly decimalOnly onFocus={(e) => { if (e.target.value === "0") setValue("exchangeRate", ""); }} />
        </FlexBox>

        <RHF.Input
          control={control}
          name="totalInvAmount"
          orientation="horizontal"
          align="right"
          label="(㉠)청구"
          readOnly
          priceOnly
          decimalOnly
          className="[&>div]:max-w-36!"
        />
        <RHF.Input
          control={control}
          name="depAmount"
          orientation="horizontal"
          align="right"
          label="(㉡)입금"
          priceOnly
          decimalOnly
          onFocus={(e) => { if (e.target.value === "0") setValue("depAmount", ""); }}
          className="[&>div]:max-w-36!"
        />
        <RHF.Input
          control={control}
          name="exchangeDiffAmount"
          orientation="horizontal"
          align="right"
          label="환차손익(㉠-㉡)"
          priceOnly
          decimalOnly
          readOnly
          className="[&>div]:max-w-36!"
        />
      </UnitInnerBox>

      {/* 당소비용 상세 내역 */}
      <RHF.FormField
        vertical
        label="당소비용"
        className="[&>label]:text-text [&>div]:gap-2 [&>label]:font-semibold"
      >
        <div className="flex justify-between">
          <div></div>
          <div className="flex w-36">
            <div className="w-full text-xs text-center">외화</div>
            <div className="w-full text-xs text-center">원화(₩)</div>
          </div>
        </div>

        {/* 1. 관납료 */}
        <RHF.FormField label="① 관납료" className="flex-row justify-between [&>div]:w-36 [&>div]:gap-2">
          <RHF.Input control={control} name="foreignGovFee" align="right" placeholder="외화" readOnly priceOnly decimalOnly onFocus={(e) => { lastModifiedCurrency.current = 'FOREIGN'; if (e.target.value === "0") setValue("foreignGovFee", ""); }} />
          <RHF.Input control={control} name="govFee" align="right" placeholder="원화" priceOnly decimalOnly onFocus={(e) => { lastModifiedCurrency.current = 'KRW'; if (e.target.value === "0") setValue("govFee", ""); }} onBlur={(e) => handleKRWBlur("foreignGovFee", e.target.value)} />
        </RHF.FormField>

        {/* 2. 수수료 */}
        <RHF.FormField label="② 수수료" className="flex-row justify-between [&>div]:w-36 [&>div]:gap-2">
          <RHF.Input control={control} name="foreignAgencyFee" align="right" placeholder="외화" readOnly priceOnly decimalOnly onFocus={(e) => { lastModifiedCurrency.current = 'FOREIGN'; if (e.target.value === "0") setValue("foreignAgencyFee", ""); }} />
          <RHF.Input control={control} name="agencyFee" align="right" placeholder="원화" priceOnly decimalOnly onFocus={(e) => { lastModifiedCurrency.current = 'KRW'; if (e.target.value === "0") setValue("agencyFee", ""); }} onBlur={(e) => handleKRWBlur("foreignAgencyFee", e.target.value)} />
        </RHF.FormField>

        {/* 3. 부가세 */}
        <RHF.FormField label="③ 부가세" className="flex-row justify-between [&>div]:w-36 [&>div]:gap-2">
          <RHF.Input control={control} name="foreignVat" align="right" placeholder="외화" readOnly priceOnly decimalOnly onFocus={(e) => { lastModifiedCurrency.current = 'FOREIGN'; if (e.target.value === "0") setValue("foreignVat", ""); }} />
          <RHF.Input control={control} name="vat" align="right" placeholder="원화" priceOnly decimalOnly onFocus={(e) => { lastModifiedCurrency.current = 'KRW'; if (e.target.value === "0") setValue("vat", ""); }} onBlur={(e) => handleKRWBlur("foreignVat", e.target.value)} />
        </RHF.FormField>

        {/* 4. 번역료 */}
        <RHF.FormField label="④ 번역료" className="flex-row justify-between [&>div]:w-36 [&>div]:gap-2">
          <RHF.Input control={control} name="foreignTransFee" align="right" placeholder="외화" readOnly priceOnly decimalOnly onFocus={(e) => { lastModifiedCurrency.current = 'FOREIGN'; if (e.target.value === "0") setValue("foreignTransFee", ""); }} />
          <RHF.Input control={control} name="transFee" align="right" placeholder="원화" priceOnly decimalOnly onFocus={(e) => { lastModifiedCurrency.current = 'KRW'; if (e.target.value === "0") setValue("transFee", ""); }} onBlur={(e) => handleKRWBlur("foreignTransFee", e.target.value)} />
        </RHF.FormField>

        {/* 5. 기타비용 */}
        <RHF.FormField label="⑤ 기타비용" className="flex-row justify-between [&>div]:w-36 [&>div]:gap-2">
          <RHF.Input control={control} name="foreignEtcFee" align="right" placeholder="외화" readOnly priceOnly decimalOnly onFocus={(e) => { lastModifiedCurrency.current = 'FOREIGN'; if (e.target.value === "0") setValue("foreignEtcFee", ""); }} />
          <RHF.Input control={control} name="etcFee" align="right" placeholder="원화" priceOnly decimalOnly onFocus={(e) => { lastModifiedCurrency.current = 'KRW'; if (e.target.value === "0") setValue("etcFee", ""); }} onBlur={(e) => handleKRWBlur("foreignEtcFee", e.target.value)} />
        </RHF.FormField>

        {/* 합계: 청구금액 */}
        <RHF.FormField
          label="ⓐ 청구금액(①~⑤)"
          className="[&>label]:text-title-success [&_[data-slot=input-group]]:bg-success/5 [&_[data-slot=input-group]]:text-title-success flex-row justify-between [&>div]:w-36 [&>div]:gap-2 [&>label]:font-semibold"
        >
          <RHF.Input control={control} name="foreignCostAmount" align="right" readOnly priceOnly decimalOnly />
          <RHF.Input control={control} name="totalInvAmount" align="right" readOnly priceOnly decimalOnly />
        </RHF.FormField>

        {/* 입금액 및 미수금 */}
        <RHF.FormField label="ⓑ 입금액" className="flex-row justify-between [&>div]:w-36 [&>div]:gap-2 [&>label]:font-semibold">
          <RHF.Input control={control} name="foreignCostAmount" align="right" readOnly className="invisible" priceOnly />
          <RHF.Input control={control} name="depAmount" align="right" priceOnly decimalOnly onFocus={(e) => { if (e.target.value === "0") setValue("depAmount", ""); }} />
        </RHF.FormField>

        <RHF.FormField
          label="미수금(ⓐ-ⓑ-ⓓ)"
          className="[&>label]:text-p-color-5 [&_[data-slot=input-group]]:bg-p-color-5/5 [&_[data-slot=input-group]]:text-p-color-5 flex-row justify-between [&>div]:w-36 [&>div]:gap-2 [&>label]:font-semibold"
        >
          <RHF.Input control={control} name="foreignCostAmount" align="right" readOnly className="invisible" priceOnly />
          <RHF.Input control={control} name="unpaidAmount" align="right" readOnly priceOnly decimalOnly />
        </RHF.FormField>
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      {/* 포기/외주/실적 섹션 */}
      <RHF.FormField vertical label="포기" className="[&>label]:text-text [&>div]:gap-2 [&>label]:font-semibold">
        <FlexBox>
          <RHF.FormDatePicker control={control} name="abandonDate" label="일자" />
          <RHF.Input control={control} name="abandonAmount" label="ⓓ 금액" align="right" priceOnly decimalOnly onFocus={(e) => { if (e.target.value === "0") setValue("abandonAmount", ""); }} />
        </FlexBox>
        <RHF.Input control={control} name="abandonContent" label="내용" />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      {/* 외주 */}
      <RHF.FormField vertical label="외주" className="[&>label]:text-text [&>div]:gap-2 [&>label]:font-semibold">
        <FlexBox>
          <RHF.FormDatePicker control={control} name="outsourceDate" label="외주 송금일" />
          <RHF.Input control={control} name="outsourceContent" label="외주내역" />
        </FlexBox>
        <RHF.Input control={control} name="outsourceCost" label="외주비용" align="right" priceOnly decimalOnly onFocus={(e) => { if (e.target.value === "0") setValue("outsourceCost", ""); }} />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      {/* 실적 */}
      <RHF.FormField vertical label="실적" className="[&>label]:text-text [&>div]:gap-2 [&>label]:font-semibold">
        <FlexBox>
          <RHF.FormDatePicker control={control} name="perfDate" label="실적 인정일" />
          <RHF.Input control={control} name="perfAmount" label="실적 인정금액" align="right" priceOnly decimalOnly onFocus={(e) => { if (e.target.value === "0") setValue("perfAmount", ""); }} />
        </FlexBox>
      </RHF.FormField>
    </FormUnitBox>
  );
};

export default BillDetail;
