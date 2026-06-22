import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import type { OverseasNationalFormInput } from "@shared/schema/overseas/nationalSchema.ts";

interface CodeListType {
  gracePeriodCodeList: CodeSelectOption[];
}

const NationalBasicInfo = (codeList: CodeListType) => {
  const { control } = useFormContext<OverseasNationalFormInput>();
  return (
    <FormUnitBox title="출원 기본정보">
      <RHF.FormSelect
        control={control}
        name="appBaseInfo.noticeExceptionApply.code"
        items={codeList.gracePeriodCodeList}
        label="공지예외적용"
      />
      <RHF.FormDatePicker
        important
        control={control}
        name="appBaseInfo.appDeadline"
        label="출원마감일"
      />
      <RHF.FormDatePicker control={control} name="appBaseInfo.appDate" label="출원일" />
      <RHF.Input control={control} name="appBaseInfo.authorityRefNo" label="특허청참조번호" maxLength={30} />
      <RHF.Input control={control} name="appBaseInfo.wipoRefNo" label="WIPO 참조번호" maxLength={30} />
      <RHF.FormDatePicker control={control} name="appBaseInfo.regDate" label="등록일" />
      <RHF.Input control={control} name="appBaseInfo.regNo" label="등록번호" maxLength={30} />
    </FormUnitBox>
  );
};

export default NationalBasicInfo;
