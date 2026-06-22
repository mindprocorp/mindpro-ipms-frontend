import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasMadridFormInput } from "@shared/schema/overseas/madridSchema.ts";
import MadridRegiNation from "@pages/overseas/etc/madrid/_components/MadridRegiNation.tsx";
import React from "react";
import MadridDesignatNation from "@pages/overseas/etc/madrid/_components/MadridDesignatNation.tsx";
import MadridDesignatNationAfter from "@pages/overseas/etc/madrid/_components/MadridDesignatNationAfter.tsx";

const MadridStrategy = () => {
  const { control } = useFormContext<OverseasMadridFormInput>();
  return (
    <FormUnitBox vertical title="출원 전략설정">
      <RHF.FormField gap={2} name="appStrategy.originalRegInfo" label="원등록">
        <RHF.FormDatePicker control={control} name="appStrategy.originalRegInfo.originalRegDate" />
        <RHF.Input
          control={control}
          name="appStrategy.originalRegInfo.originalRegNo"
          placeholder="번호입력"
          maxLength={30}
        />
      </RHF.FormField>

      {/* 지정국가 */}
      <MadridDesignatNation />

      {/* 사후지정국가 */}
      <MadridDesignatNationAfter />

      {/* 등록국가 */}
      <MadridRegiNation />
    </FormUnitBox>
  );
};

export default MadridStrategy;
