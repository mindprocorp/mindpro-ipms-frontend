import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasNationalFormInput } from "@shared/schema/overseas/nationalSchema.ts";

const NationalDefaultInfo = () => {
  const { control } = useFormContext<OverseasNationalFormInput>();

  return (
    <FormUnitBox
      title="출원사건관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <RHF.FormDatePicker control={control} name="appCaseMng.receiptDate" label="접수일" />

      <RHF.Input
        control={control}
        name="appCaseMng.ourRef"
        label="OurRef"
        maxLength={30}
      />

      <RHF.Input control={control} name="appCaseMng.clientRef" label="출원인관리번호" maxLength={30} />
    </FormUnitBox>
  );
};

export default NationalDefaultInfo;
