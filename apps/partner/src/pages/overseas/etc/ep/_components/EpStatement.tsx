import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import type { OverseasEpFormInput } from "@shared/schema/overseas/epSchema.ts";

interface CodeListType {
  gradeCodeList: CodeSelectOption[];
}
const EpStatement = (codeList: CodeListType) => {
  const { control } = useFormContext<OverseasEpFormInput>();
  return (
    <FormUnitBox vertical title="명세서 구성요소">
      <RHF.FormField gap={2}>
        <RHF.FormSelect
          control={control}
          name="appSpecificElement.grade.code"
          items={codeList.gradeCodeList}
          label="등급"
        />
      </RHF.FormField>

      <RHF.FormField gap={2}>
        <RHF.Input
          control={control}
          name="appSpecificElement.independentClaims"
          label="독립항"
          align="center"
          numericOnly
          maxLength={5}
        />
        <RHF.Input
          control={control}
          name="appSpecificElement.dependentClaims"
          label="종속항"
          align="center"
          numericOnly
          maxLength={5}
        />
        <RHF.Input
          control={control}
          name="appSpecificElement.overseaSpecPage"
          label="명세서"
          align="center"
          numericOnly
          maxLength={5}
        />
        <RHF.Input
          control={control}
          name="appSpecificElement.drawingCount"
          label="도면"
          align="center"
          numericOnly
          maxLength={5}
        />
      </RHF.FormField>
    </FormUnitBox>
  );
};

export default EpStatement;
