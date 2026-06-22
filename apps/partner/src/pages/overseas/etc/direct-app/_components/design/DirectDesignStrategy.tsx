import { RHF, Separator } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasDirectAppFormInput } from "@shared/schema/overseas/directAppSchema.ts";

const DirectDesignStrategy = () => {
  const { control } = useFormContext<OverseasDirectAppFormInput>();
  return (
    <FormUnitBox vertical boxfull title="출원 전략설정">
      <RHF.FormField gap={2} name="appStrategy.parentRegAppDate" label="모등록">
        <RHF.FormDatePicker control={control} name="appStrategy.parentRegAppDate" />
        <RHF.Input control={control} name="appStrategy.parentRegAppNo" placeholder="모등록번호" />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      <RHF.FormField gap={2} name="appStrategy.firstAppInfo" label="최초출원">
        <RHF.FormDatePicker control={control} name="appStrategy.firstAppInfo.firstAppDate" />
        <RHF.Input
          control={control}
          name="appStrategy.firstAppInfo.firstAppNo"
          placeholder="번호입력"
          maxLength={30}
        />
      </RHF.FormField>

      <RHF.FormField gap={2} name="appStrategy.originalAppInfo" label="원출원">
        <RHF.FormDatePicker control={control} name="appStrategy.originalAppInfo.originalAppDate" />
        <RHF.Input
          control={control}
          name="appStrategy.originalAppInfo.originalAppNo"
          placeholder="번호입력"
          maxLength={30}
        />
      </RHF.FormField>

      <RHF.FormField gap={2} name="appStrategy.originalRegInfo" label="원등록">
        <RHF.FormDatePicker control={control} name="appStrategy.originalRegInfo.originalRegDate" />
        <RHF.Input
          control={control}
          name="appStrategy.originalRegInfo.originalRegNo"
          placeholder="번호입력"
          maxLength={30}
        />
      </RHF.FormField>

      <RHF.FormField gap={2} name="appStrategy.reAppInfo" label="재출원">
        <RHF.FormDatePicker control={control} name="appStrategy.reAppInfo.reAppDate" />
        <RHF.Input control={control} name="appStrategy.reAppInfo.reAppNo" placeholder="번호입력" maxLength={30} />
      </RHF.FormField>
    </FormUnitBox>
  );
};

export default DirectDesignStrategy;
