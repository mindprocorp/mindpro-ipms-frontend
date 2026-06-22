import { Button, CustomTooltip, FlexBox, Icons, Input, RHF } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext, Controller } from "react-hook-form";
import type { OverseasBasicFormInput } from "@shared/schema/overseas/basicSchema.ts";
import { useState } from "react";
import {
  CountryModal,
  type CountryData,
} from "@pages/common/modal/country/CountryModal.tsx";
import type { Path } from "react-hook-form";

type DesignatedField =
  | "designatedStateInfo.designatedIndividual"
  | "designatedStateInfo.designatedPct"
  | "designatedStateInfo.designatedEp"
  | "designatedStateInfo.designatedMadrid"
  | "designatedStateInfo.designatedIntlDesign";

const BasicDesignateCountry = () => {
  const { control, setValue, getValues } = useFormContext<OverseasBasicFormInput>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeField, setActiveField] = useState<DesignatedField | null>(null);

  const openCountryModal = (field: DesignatedField) => {
    setActiveField(field);
    setIsModalOpen(true);
  };

  const handleCountrySelect = (selected: CountryData[]) => {
    if (!activeField) return;
    const codes = selected.map((c) => c.countryCode);
    const current = getValues(activeField as Path<OverseasBasicFormInput>) as string[];
    const merged = Array.from(new Set([...(Array.isArray(current) ? current : []), ...codes]));
    setValue(activeField as Path<OverseasBasicFormInput>, merged, { shouldValidate: true });
  };

  const sections: { title: string; field: DesignatedField }[] = [
    { title: "개국", field: "designatedStateInfo.designatedIndividual" },
    { title: "PCT", field: "designatedStateInfo.designatedPct" },
    { title: "EP", field: "designatedStateInfo.designatedEp" },
    { title: "마드리드", field: "designatedStateInfo.designatedMadrid" },
    { title: "국제디자인", field: "designatedStateInfo.designatedIntlDesign" },
  ];

  return (
    <FormUnitBox
      vertical
      title="지정국가"
      className="[&>div>h2]:text-p-color-3 [&>div]:first-of-type:bg-p-color-3/5"
    >
      {sections.map(({ title, field }) => (
        <UnitInnerBox key={field}>
          <FlexBox className="justify-between">
            <BoxTitle title={title} />
            <div className="flex shrink-0 items-center gap-2 text-xs">
              <Controller
                control={control}
                name={field as Path<OverseasBasicFormInput>}
                render={({ field: { value } }) => (
                  <span className="text-p-color-2">
                    {Array.isArray(value) && value.filter(Boolean).length > 0
                      ? `${value.filter(Boolean).length} 선택`
                      : "0 선택"}
                  </span>
                )}
              />
              <Button
                size="h24"
                variant="outline-blue"
                type="button"
                onClick={() => openCountryModal(field)}
              >
                국수선택
              </Button>
            </div>
          </FlexBox>

          <Controller
            control={control}
            name={field as Path<OverseasBasicFormInput>}
            render={({ field: { onChange, value, ref } }) => (
              <div className="relative flex items-center">
                <Input
                  ref={ref}
                  value={Array.isArray(value) ? value.filter(Boolean).join(", ") : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    const arrayVal = val
                      .split(",")
                      .map((v) => v.trim())
                      .filter((v) => v !== "");
                    onChange(arrayVal);
                  }}
                  className="pr-10"
                  placeholder="국가를 선택하거나 쉼표로 구분하여 입력하세요"
                  maxLength={2000}
                />
                <div className="absolute right-2 flex items-center">
                  <CustomTooltip message="국수선택 버튼으로 선택하거나 직접 입력하세요">
                    <Button
                      type="button"
                      className="w-5 h-5 p-0 bg-transparent hover:bg-slate-100 text-slate-500"
                      onClick={() => openCountryModal(field)}
                    >
                      <Icons.PenLine className="size-3" />
                    </Button>
                  </CustomTooltip>
                </div>
              </div>
            )}
          />
        </UnitInnerBox>
      ))}

      <UnitInnerBox>
        <FlexBox>
          <BoxTitle title="포기" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            important
            control={control}
            name="designatedStateInfo.abandonDate"
            label="일자"
          />
          <RHF.Input
            important
            control={control}
            name="designatedStateInfo.abandonContent"
            label="내용"
            maxLength={2000}
          />
        </RHF.FormField>
      </UnitInnerBox>

      <CountryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleCountrySelect}
        multiSelect={true}
      />
    </FormUnitBox>
  );
};

export default BasicDesignateCountry;
