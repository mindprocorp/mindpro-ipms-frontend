import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasEpFormInput } from "@shared/schema/overseas/epSchema.ts";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";

interface CodeListType {
  gracePeriodCodeList: CodeSelectOption[];
}

const EpBasicInfo = (codeList: CodeListType) => {
  const { control } = useFormContext<OverseasEpFormInput>();
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
      <RHF.FormDatePicker control={control} name="appBaseInfo.oaDeliveryDate" label="오더발송일" />
      <RHF.FormDatePicker control={control} name="appBaseInfo.appDate" label="출원일" />
      <RHF.Input control={control} name="appBaseInfo.appNo" label="출원번호" maxLength={30} />
      <RHF.FormDatePicker
        important
        control={control}
        name="appBaseInfo.divAppInfo.divDeadline"
        label="분할출원마감일"
      />
      <RHF.FormDatePicker
        control={control}
        name="appBaseInfo.divAppInfo.divAppDate"
        label="분할출원일"
      />
      <RHF.Input control={control} name="appBaseInfo.divAppInfo.divAppNo" label="분할출원번호" maxLength={30} />
    </FormUnitBox>
  );
};

export default EpBasicInfo;
