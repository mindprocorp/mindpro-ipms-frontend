import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasMadridFormInput } from "@shared/schema/overseas/madridSchema.ts";

const MadridDefaultInfo = () => {
  const { control } = useFormContext<OverseasMadridFormInput>();

  return (
    <FormUnitBox
      title="출원사건관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <RHF.FormSelect
        control={control}
        name="appCaseMng.rightType.code"
        items={[{ value: "40", label: "상표" }]}
        label="권리"
        disabled={true}
      />
      <RHF.FormDatePicker control={control} name="appCaseMng.receiptDate" label="접수일" />

      <RHF.Input
        control={control}
        name="appCaseMng.ourRef"
        label="OurRef"
        maxLength={30}
      />

      <RHF.Input
        control={control}
        name="appCaseMng.yourRef"
        label="YourRef"
        maxLength={30}
      />

      <RHF.Input control={control} name="appCaseMng.clientRef" label="출원인관리번호" maxLength={30} />
    </FormUnitBox>
  );
};

export default MadridDefaultInfo;
