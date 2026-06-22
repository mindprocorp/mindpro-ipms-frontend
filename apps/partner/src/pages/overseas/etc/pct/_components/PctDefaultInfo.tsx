import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext, useWatch } from "react-hook-form";
import type { OverseasPctFormInput } from "@shared/schema/overseas/pctAppSchema.ts";

const PctDefaultInfo = () => {
  const { control } = useFormContext<OverseasPctFormInput>();
  const appSeq = useWatch({ control, name: "appSeq" });

  return (
    <FormUnitBox
      title="출원사건관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <RHF.FormSelect
        control={control}
        name="appCaseMng.rightType.code"
        label="권리"
        items={[
          { value: "10", label: "특허" },
          { value: "20", label: "실용신안" },
        ]}
        placeholder="권리 선택"
        disabled={!!appSeq}
      />
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

export default PctDefaultInfo;
