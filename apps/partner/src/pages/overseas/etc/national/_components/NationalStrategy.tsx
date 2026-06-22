import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasNationalFormInput } from "@shared/schema/overseas/nationalSchema.ts";
import NationalDesignatNation from "@pages/overseas/etc/national/_components/NationalDesignatNation.tsx";
import NationalRegiNation from "@pages/overseas/etc/national/_components/NationalRegiNation.tsx";

const NationalStrategy = () => {
  return (
    <FormUnitBox vertical title="출원 전략설정">
      {/* 지정국가 */}
      <NationalDesignatNation />

      {/* 등록국가 */}
      <NationalRegiNation />
    </FormUnitBox>
  );
};

export default NationalStrategy;
