import { type CustomerFormInput } from "@shared/schema/customer/customerSchema.ts";
import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";
import type { CodeSelectOption } from "@shared/api/common/commApi";

interface DefaultInfoProps {
  customerTypeList: CodeSelectOption[];
  applicantTypeList: CodeSelectOption[];
  companyTypeList: CodeSelectOption[];
}

const DefaultInfo = ({
  customerTypeList,
  applicantTypeList,
  companyTypeList,
}: DefaultInfoProps) => {
  const { control } = useFormContext<CustomerFormInput>();

  return (
    <FormUnitBox
      title="기본정보"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5 [&>div>div>*]:flex-1"
    >
      <RHF.FormSelect control={control} name="clientCategory" items={customerTypeList} label="고객구분" />
      <RHF.FormSelect control={control} name="applicantCategory" items={applicantTypeList} label="출원인구분" />
      <RHF.FormSelect control={control} name="corpCategory" items={companyTypeList} label="기업구분" />
      <RHF.Input control={control} name="attorneyCategory" label="변리사구분" />
    </FormUnitBox>
  );
};

export default DefaultInfo;
