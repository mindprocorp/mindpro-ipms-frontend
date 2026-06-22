import { type EtcCaseFormInput } from "@shared/schema/etc-case/etcCaseSchema.ts";
import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";

const Appellation = () => {
  const { control } = useFormContext<EtcCaseFormInput>();
  return (
    <FormUnitBox vertical title="명칭정보" titleExtra={<span className="text-muted-foreground flex items-center gap-1 text-[11px] font-normal"><span>·</span>출원번호 검색 시 자동으로 입력됩니다.</span>}>
      <RHF.FormTextarea control={control} name="appTitleInfo.titleKo" label="국문" placeholder="" readOnly className="pointer-events-none" />
      <RHF.FormTextarea control={control} name="appTitleInfo.titleEn" label="영문" placeholder="" readOnly className="pointer-events-none" />
    </FormUnitBox>
  );
};

export default Appellation;
