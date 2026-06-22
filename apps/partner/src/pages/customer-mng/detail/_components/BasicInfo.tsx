import { type CustomerFormInput } from "@shared/schema/customer/customerSchema.ts";
import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";
import { CountryModal } from "@pages/common/modal/country/CountryModal";
import { useState } from "react";

const BasicInfo = () => {
  const { control, setValue } = useFormContext<CustomerFormInput>();
  const [countryModal, setCountryModal] = useState(false);

  return (
    <FormUnitBox title="국가정보">
      <RHF.Input
        control={control}
        name="countryNameKo"
        label="국가"
        inputDisabled
        actions={
          <>
            <CustomTooltip message="국가코드를 선택하세요">
              <Button className="w-5" onClick={() => setCountryModal(true)}>
                <Icons.SearchCode className="size-4" />
              </Button>
            </CustomTooltip>
            <RHF.Input
              control={control}
              name="countryCode"
              placeholder="코드"
              className="w-20"
              disabled
            />
          </>
        }
        className="flex-[2]"
      />
      <RHF.Input control={control} name="countryNameEn" label="영문명" className="flex-1" disabled />

      <CountryModal
        open={countryModal}
        onOpenChange={setCountryModal}
        onSuccess={(data) => {
          // CountryModal 은 multiSelect 여부와 무관하게 항상 배열을 전달 — 첫 항목 사용
          const selected = Array.isArray(data) ? data[0] : data;
          if (!selected) return;
          setValue("countryCode", selected.countryCode, { shouldDirty: true });
          setValue("countryNameKo", selected.countryNameKo, { shouldDirty: true });
          setValue("countryNameEn", selected.countryNameEn, { shouldDirty: true });
        }}
      />
    </FormUnitBox>
  );
};

export default BasicInfo;
