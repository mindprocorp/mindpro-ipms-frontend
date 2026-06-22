import { Button, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasNationalFormInput } from "@shared/schema/overseas/nationalSchema.ts";
import { useState } from "react";
import { CountryModal, type CountryData } from "@pages/common/modal/country/CountryModal.tsx";

const NationalRegiNation = () => {
  const { control, setValue, getValues } = useFormContext<OverseasNationalFormInput>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCountrySelect = (selected: CountryData[]) => {
    const codes = selected.map((c) => c.countryCode);
    const current = getValues("appStrategy.registeredStates");
    const merged = Array.from(new Set([...(Array.isArray(current) ? current : []), ...codes]));
    setValue("appStrategy.registeredStates", merged as any, { shouldValidate: true });
  };

  return (
    <FormUnitBox fullsize title="등록국가">
      <RHF.FormTextarea
        control={control}
        name="appStrategy.registeredStates"
        actions={
          <div className="flex flex-col gap-1">
            <Button type="button" className="h-6 w-6" variant="blue" onClick={() => setIsModalOpen(true)}>
              <Icons.Search className="size-3" />
            </Button>
          </div>
        }
        maxLength={2000}
        placeholder="돋보기를 눌러 지정해주세요"
        readOnly
      />
      <CountryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleCountrySelect}
        multiSelect={true}
      />
    </FormUnitBox>
  );
};

export default NationalRegiNation;
