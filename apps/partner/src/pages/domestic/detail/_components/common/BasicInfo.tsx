import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import type { DomesticFormInput } from "@shared/schema/domestic/domesticSchema.ts";

interface CodeListType {
  appLangCodeList: CodeSelectOption[];
};

const BasicInfo = (codeList: CodeListType) => {
  const { control } = useFormContext<DomesticFormInput>();
  return (
    <FormUnitBox title="출원 기본정보">
      <RHF.FormDatePicker control={control} name="appBaseInfo.appOrderDate" label="출원지시일" />
      <RHF.FormDatePicker
        important
        control={control}
        name="appBaseInfo.appDeadline"
        label="출원마감일"
      />
      <RHF.FormDatePicker control={control} name="appBaseInfo.appDate" label="출원일" />
      <RHF.Input
        control={control}
        name="appBaseInfo.appNo"
        label="출원번호"
        krAppNoOnly
        // actions={
        //   <>
        //     <CustomTooltip message="출원번호를 선택하거나 입력 하세요">
        //       <Button className="w-5">
        //         <Icons.SearchCheck className="size-4" />
        //       </Button>
        //     </CustomTooltip>
        //   </>
        // }
      />
      <RHF.Input control={control} name="appBaseInfo.accessCode" label="접근코드" maxLength={30} />
      <RHF.FormSelect
        control={control}
        name="appBaseInfo.appLanguage.code"
        items={codeList.appLangCodeList}
        label="출원언어"
      />
      <RHF.FormDatePicker
        important
        control={control}
        name="appBaseInfo.transDeadline"
        label="번역문 마감일"
      />
      <RHF.FormDatePicker
        control={control}
        name="appBaseInfo.transSubmitDate"
        label="번역문 제출일"
      />
    </FormUnitBox>
  );
};

export default BasicInfo;
