import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import { frameworks } from "@pages/etc-case/detail/EtcCaseForm.tsx";
import type { OverseasDirectAppFormInput } from "@shared/schema/overseas/directAppSchema.ts";




const noticeExceptCodeList = [
  {
    label: "적용안함",
    value: "00",
  },
  {
    label: "6개월",
    value: "10",
  },
];

const DirectDesignBasicInfo = () => {
  const { control } = useFormContext<OverseasDirectAppFormInput>();
  return (
    <FormUnitBox title="출원 기본정보">
      <RHF.FormSelect
        control={control}
        name="appBaseInfo.noticeExceptionApply.code"
        items={noticeExceptCodeList}
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
    </FormUnitBox>
  );
};

export default DirectDesignBasicInfo;
