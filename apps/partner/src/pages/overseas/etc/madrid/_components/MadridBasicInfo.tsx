import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import type { OverseasMadridFormInput } from "@shared/schema/overseas/madridSchema.ts";

interface CodeListType {
  gracePeriodCodeList: CodeSelectOption[];
}

const MadridBasicInfo = (codeList: CodeListType) => {
  const { control } = useFormContext<OverseasMadridFormInput>();
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
      <RHF.Input control={control} name="appBaseInfo.appNo" label="출원번호" maxLength={30} />
      <RHF.Input control={control} name="appBaseInfo.authorityRefNo" label="특허청 참조번호" maxLength={30} />
      <RHF.FormDatePicker
        control={control}
        name="appBaseInfo.autoProtectionDate"
        label="자동보호 결정일"
      />
      <RHF.FormDatePicker control={control} name="appBaseInfo.announcementDate" label="공고일" />
      <RHF.Input control={control} name="appBaseInfo.announcementNo" label="공고번호" maxLength={30} />
    </FormUnitBox>
  );
};

export default MadridBasicInfo;
