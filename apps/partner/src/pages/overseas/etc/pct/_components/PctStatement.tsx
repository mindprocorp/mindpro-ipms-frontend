import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
// PctStatement는 현재 PctForm에서 미사용 (PCT 백엔드 DTO에 appSpecificElement 미존재)
// 향후 백엔드에 appSpecificElement 추가 시 OverseasPctFormInput으로 타입 교체 필요

interface CodeListType {
  gradeCodeList: CodeSelectOption[];
}
const PctStatement = (codeList: CodeListType) => {
  const { control } = useFormContext<any>();
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

export default PctStatement;
