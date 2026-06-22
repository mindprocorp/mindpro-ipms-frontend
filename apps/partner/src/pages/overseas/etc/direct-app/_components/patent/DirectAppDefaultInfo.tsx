import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import type { OverseasDirectAppFormInput } from "@shared/schema/overseas/directAppSchema.ts";
import { useState } from "react";
import {
  CountryModal,
  type CountryData,
} from "@pages/common/modal/country/CountryModal.tsx";

interface CodeListType {
  rightCodeList: CodeSelectOption[];
  appCodeList: CodeSelectOption[];
  cateCodeList: CodeSelectOption[];
  appKindCodeList: CodeSelectOption[];
  ipProcCodeList: CodeSelectOption[];
  appSeq?: string;
}

const DirectAppDefaultInfo = (codeList: CodeListType) => {
  const { control, setValue } = useFormContext<OverseasDirectAppFormInput>();
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);

  const handleCountrySelect = (selected: CountryData[]) => {
    const country = selected[0];
    if (!country) return;
    setValue("appCaseMng.appCountry", country.countryNameKo, { shouldValidate: true });
    setValue("appCaseMng.appCountryInfo.code", country.countryCode, { shouldValidate: true });
  };

  return (
    <FormUnitBox
      title="출원사건관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <RHF.FormSelect
        control={control}
        name="appCaseMng.appRoute.code"
        items={codeList.ipProcCodeList}
        label="출원루트"
        disabled
      />
      <RHF.FormSelect
        control={control}
        name="appCaseMng.rightType.code"
        items={codeList.rightCodeList}
        label="권리"
        disabled={!!codeList.appSeq}
      />
      <RHF.FormSelect
        control={control}
        name="appCaseMng.appCategory.code"
        items={codeList.appCodeList}
        label="출원구분"
      />

      <RHF.Input
        control={control}
        name="appCaseMng.appCountry"
        label="출원국명"
        inputDisabled
        actions={
          <>
            <CustomTooltip message="출원국을 선택하세요">
              <Button
                type="button"
                className="w-5"
                onClick={() => setIsCountryModalOpen(true)}
              >
                <Icons.SearchCode className="size-4" />
              </Button>
            </CustomTooltip>
            <RHF.Input
              control={control}
              name="appCaseMng.appCountryInfo.code"
              placeholder="코드"
              className="w-20"
              maxLength={10}
              inputDisabled
            />
          </>
        }
        className="w-80"
        maxLength={100}
      />

      <RHF.FormDatePicker control={control} name="appCaseMng.receiptDate" label="접수일" />
      <RHF.Input
        control={control}
        name="appCaseMng.ourRef"
        label="OurRef"
        maxLength={30}
      />
      <RHF.Input control={control} name="appCaseMng.yourRef" label="YourRef" maxLength={30} />
      <RHF.Input control={control} name="appCaseMng.clientRef" label="출원인관리번호" maxLength={30} />

      <CountryModal
        open={isCountryModalOpen}
        onOpenChange={setIsCountryModalOpen}
        onSuccess={handleCountrySelect}
        multiSelect={false}
      />
    </FormUnitBox>
  );
};

export default DirectAppDefaultInfo;
