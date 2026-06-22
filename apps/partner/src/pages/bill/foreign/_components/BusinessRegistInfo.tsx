import { FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { testItems, type FormInput } from "@shared/schema";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";
import type { BillDomesticFormInput } from "@shared/schema/bill/billDomesticSchema.ts";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";

interface CodeListType {
  taxBillCategoryCodeList: CodeSelectOption[];
  taxBillTypeCodeList: CodeSelectOption[];
}

const BusinessRegistInfo = (codeList: CodeListType) => {
  const { control, setValue } = useFormContext<BillDomesticFormInput>();
  return (
    <FormUnitBox
      vertical
      title="사업자등록정보(세금계산서 발행용)"
      className="[&>div>h2]:text-p-color-3 [&>div]:first-of-type:bg-p-color-3/5 w-1/4"
    >
      <RHF.FormDatePicker control={control} name="taxBillDate" label="계산서 발행일" ess />
      <RHF.Input control={control} name="taxBillNo" label="발행번호" ess maxLength={100} />

      <RHF.FormSelect
        control={control}
        name="taxBillType.code"
        items={codeList.taxBillTypeCodeList}
        label="발행구분"
        ess
      />

      <RHF.FormSelect
        control={control}
        name="taxBillCategory.code"
        items={codeList.taxBillCategoryCodeList}
        label="계산서 구분"
        ess
      />

      <RHF.Input control={control} name="bizName" label="상호" maxLength={30} />
      <RHF.Input control={control} name="bizCeo" label="대표자" maxLength={30} />
      <RHF.Input control={control} name="bizRegNo" label="사업자 번호" maxLength={30} />
      <RHF.Input control={control} name="bizWorkplaceNo" label="종사업장 번호" maxLength={100} />

      <RHF.FormTextarea control={control} name="bizAddr" label="사업장" maxLength={255} />

      <FlexBox>
        <RHF.Input control={control} name="bizType" label="업태" maxLength={30} />
        <RHF.Input control={control} name="bizItem" label="종목" maxLength={30} />
      </FlexBox>

      <FlexBox>
        <RHF.Input control={control} name="bizContactName" label="담당자" maxLength={100} />
        <RHF.Input control={control} name="bizDeptName" label="부서" maxLength={100} />
      </FlexBox>

      <RHF.Input control={control} name="bizEmail" label="이메일" maxLength={100} />
    </FormUnitBox>
  );
};

export default BusinessRegistInfo;
