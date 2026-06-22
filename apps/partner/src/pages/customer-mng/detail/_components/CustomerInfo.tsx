import { type CustomerFormInput } from "@shared/schema/customer/customerSchema.ts";
import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";

const CustomerInfo = () => {
  const { control } = useFormContext<CustomerFormInput>();
  return (
    <FormUnitBox vertical title="고객정보">
      <RHF.FormField gap={2}>
        <RHF.Input control={control} name="clientNameKo" label="고객명(한글)" />
        <RHF.Input control={control} name="clientNameEn" label="고객명(영문)" />
      </RHF.FormField>

      <RHF.FormField gap={2}>
        <RHF.Input control={control} name="clientNameCh" label="고객명(한자)" />
        <RHF.Input control={control} name="clientNameJp" label="고객명(일문)" />
      </RHF.FormField>

      <RHF.Input control={control} name="companyName" label="회사명" />

      <RHF.FormField gap={2}>
        <RHF.Input control={control} name="deptName" label="부서" />
        <RHF.Input control={control} name="position" label="직책" />
      </RHF.FormField>

      <RHF.FormField gap={2}>
        <RHF.Input control={control} name="residentRegNo" label="주민등록번호" />
        <RHF.Input control={control} name="corpRegNo" label="법인등록번호" />
      </RHF.FormField>

      <RHF.FormField gap={2}>
        <RHF.Input control={control} name="kipoClientNo" label="특허고객번호" />
        <RHF.Input control={control} name="managerName" label="관리자" />
      </RHF.FormField>

      <RHF.FormField gap={2}>
        <RHF.Input control={control} name="generalMandateNo" label="포괄위임번호" krAppNoOnly />
        <RHF.FormDatePicker control={control} name="registrationDate" label="고객등록일" />
      </RHF.FormField>

      <RHF.Input control={control} name="mobile" label="휴대폰" telOnly />
      <RHF.Input control={control} name="homepage" label="홈페이지" urlOnly />
      <RHF.Input control={control} name="email" label="이메일" emailOnly />
    </FormUnitBox>
  );
};

export default CustomerInfo;
