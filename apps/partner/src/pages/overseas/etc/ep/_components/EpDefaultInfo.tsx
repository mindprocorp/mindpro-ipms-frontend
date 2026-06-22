import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import type { OverseasEpFormInput } from "@shared/schema/overseas/epSchema.ts";

interface CodeListType {
  ipProcCodeList: CodeSelectOption[];
  appCodeList: CodeSelectOption[];
  cateCodeList: CodeSelectOption[];
  rightCodeList: CodeSelectOption[];
}
const EpDefaultInfo = ({
  ipProcCodeList,
  appCodeList,
  cateCodeList,
  rightCodeList,
}: CodeListType) => {
  const { control } = useFormContext<OverseasEpFormInput>();

  return (
    <FormUnitBox
      title="출원사건관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <RHF.FormSelect
        control={control}
        name="appCaseMng.appRoute.code"
        items={ipProcCodeList}
        label="출원루트"
        disabled
      />
      <RHF.FormSelect
        control={control}
        name="appCaseMng.rightType.code"
        items={rightCodeList}
        label="권리"
        disabled
      />
      <RHF.FormSelect
        control={control}
        name="appCaseMng.appCategory.code"
        items={cateCodeList}
        label="출원구분"
      />

      <RHF.FormDatePicker control={control} name="appCaseMng.receiptDate" label="접수일" />

      <RHF.Input control={control} name="appCaseMng.ourRef" label="OurRef" maxLength={30} />

      <RHF.Input control={control} name="appCaseMng.yourRef" label="YourRef" maxLength={30} />

      <RHF.Input
        control={control}
        name="appCaseMng.clientRef"
        label="출원인관리번호"
        maxLength={30}
      />
    </FormUnitBox>
  );
};

export default EpDefaultInfo;
