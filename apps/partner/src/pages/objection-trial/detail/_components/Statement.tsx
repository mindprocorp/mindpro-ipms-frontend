import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";
import { frameworks } from "@pages/etc-case/detail/EtcCaseForm.tsx";

const Statement = () => {
  const { control } = useFormContext();
  return (
    <FormUnitBox vertical title="명세서 구성요소">
      <RHF.FormField gap={2}>
        <RHF.FormSelect control={control} name="testVal" items={frameworks} label="등급" />
      </RHF.FormField>

      <RHF.FormField gap={2}>
        <RHF.Input control={control} name="testVal" label="독립항" align="center" value="0" />
        <RHF.Input control={control} name="testVal" label="종속항" align="center" value="0" />
        <RHF.Input control={control} name="testVal" label="명세서" align="center" value="0" />
        <RHF.Input control={control} name="testVal" label="도면" align="center" value="0" />
      </RHF.FormField>
    </FormUnitBox>
  );
};

export default Statement;
