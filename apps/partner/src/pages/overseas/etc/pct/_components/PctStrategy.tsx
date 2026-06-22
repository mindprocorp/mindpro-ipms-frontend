import { Button, FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasPctFormInput } from "@shared/schema/overseas/pctAppSchema.ts";
import { useState } from "react";
import { CountryModal, type CountryData } from "@pages/common/modal/country/CountryModal.tsx";

const PctStrategy = () => {
  const { control, setValue, getValues } = useFormContext<OverseasPctFormInput>();
  const [isModal20Open, setIsModal20Open] = useState(false);
  const [isModal30Open, setIsModal30Open] = useState(false);

  const handleCountry20Select = (selected: CountryData[]) => {
    const codes = selected.map((c) => c.countryCode);
    const current = getValues("appStrategy.deadline20Info.app20Country");
    const merged = Array.from(new Set([...(Array.isArray(current) ? current : []), ...codes]));
    setValue("appStrategy.deadline20Info.app20Country", merged as any, { shouldValidate: true });
  };

  const handleCountry30Select = (selected: CountryData[]) => {
    const codes = selected.map((c) => c.countryCode);
    const current = getValues("appStrategy.deadline30Info.app30Country");
    const merged = Array.from(new Set([...(Array.isArray(current) ? current : []), ...codes]));
    setValue("appStrategy.deadline30Info.app30Country", merged as any, { shouldValidate: true });
  };

  return (
    <FormUnitBox vertical boxfull title="출원 전략설정">
      <RHF.FormRadio
        control={control}
        name="appStrategy.krDesignationYn"
        items={[
          {
            value: "Y",
            label: "KR 지정",
          },
          {
            value: "N",
            label: "KR 미지정",
          },
        ]}
        height={7}
        size="sm"
        label="지정국가"
        orientation="horizontal"
      />

      <Separator className="my-2 border-t" />

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="20개월 마감" />
          <FlexBox className="flex-0 [&>div]:justify-end [&>div]:gap-2 [&>div>div]:min-h-8">
            <RHF.FormSelect
              control={control}
              name="appStrategy.deadline20Info.complete20Yn"
              items={[
                {
                  value: "Y",
                  label: "Y",
                },
                {
                  value: "N",
                  label: "N",
                },
              ]}
              placeholder="완료여부"
              className="w-30"
            />
          </FlexBox>
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            important
            control={control}
            name="appStrategy.deadline20Info.npe20Deadline"
            label="국내진입 마감일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appStrategy.deadline20Info.entry20CompleteDate"
            label="진입 완료일"
          />
        </RHF.FormField>
        <RHF.FormTextarea
          control={control}
          name="appStrategy.deadline20Info.app20Country"
          label="출원국가"
          placeholder="돋보기를 눌러 지정해주세요"
          readOnly
          actions={
            <div className="flex flex-col gap-1">
              <Button type="button" className="h-6 w-6" variant="blue" onClick={() => setIsModal20Open(true)}>
                <Icons.Search className="size-3" />
              </Button>
            </div>
          }
          maxLength={2000}
        />
        <CountryModal
          open={isModal20Open}
          onOpenChange={setIsModal20Open}
          onSuccess={handleCountry20Select}
          multiSelect={true}
        />
      </UnitInnerBox>

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="30개월 마감" />
          <FlexBox className="flex-0 [&>div]:justify-end [&>div]:gap-2 [&>div>div]:min-h-8">
            <RHF.FormSelect
              control={control}
              name="appStrategy.deadline30Info.complete30Yn"
              items={[
                {
                  value: "Y",
                  label: "Y",
                },
                {
                  value: "N",
                  label: "N",
                },
              ]}
              placeholder="완료여부"
              className="w-30"
            />
          </FlexBox>
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            important
            control={control}
            name="appStrategy.deadline30Info.npe30Deadline"
            label="국내진입 마감일"
          />
          <RHF.FormDatePicker
            control={control}
            name="appStrategy.deadline30Info.entry30CompleteDate"
            label="진입 완료일"
          />
        </RHF.FormField>
        <RHF.FormTextarea
          control={control}
          name="appStrategy.deadline30Info.app30Country"
          label="출원국가"
          placeholder="돋보기를 눌러 지정해주세요"
          readOnly
          actions={
            <div className="flex flex-col gap-1">
              <Button type="button" className="h-6 w-6" variant="blue" onClick={() => setIsModal30Open(true)}>
                <Icons.Search className="size-3" />
              </Button>
            </div>
          }
          maxLength={2000}
        />
        <CountryModal
          open={isModal30Open}
          onOpenChange={setIsModal30Open}
          onSuccess={handleCountry30Select}
          multiSelect={true}
        />
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default PctStrategy;
