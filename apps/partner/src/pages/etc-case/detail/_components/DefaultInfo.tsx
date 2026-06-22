import { type EtcCaseFormInput } from "@shared/schema/etc-case/etcCaseSchema.ts";
import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";
import type { CodeSelectOption } from "@shared/api/common/commApi";

interface DefaultInfoProps {
  caseCategoryCodeList: CodeSelectOption[];
  rightTypeCodeList: CodeSelectOption[];
  caseTypeCodeList: CodeSelectOption[];
}

const DefaultInfo = ({
  caseCategoryCodeList,
  rightTypeCodeList,
  caseTypeCodeList,
}: DefaultInfoProps) => {
  const { control } = useFormContext<EtcCaseFormInput>();

  return (
    <FormUnitBox
      title="출원사건관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <RHF.FormSelect control={control} name="cftCaseMng.appClassification.code" items={caseCategoryCodeList} label="구분" />
      <RHF.FormSelect control={control} name="cftCaseMng.rightType.code" items={rightTypeCodeList} label="권리" disabled />
      <RHF.FormSelect control={control} name="cftCaseMng.caseType.code" items={caseTypeCodeList} label="사건종류" />
      <RHF.FormDatePicker control={control} name="cftCaseMng.receiptDate" label="접수일" />

      <RHF.Input
        control={control}
        name="cftCaseMng.ourRef"
        label="OurRef"
        maxLength={30}
        /* actions={
          <>
            <CustomTooltip message="OurRef번호를 선택하세요">
              <Button type="button" className="w-5" onClick={() => {}}>
                <Icons.PenLine className="size-3" />
              </Button>
            </CustomTooltip>
          </>
        } */
      />

      <RHF.Input control={control} name="cftCaseMng.yourRef" label="YourRef" maxLength={30} />
      <RHF.Input control={control} name="cftCaseMng.clientRef" label="출원인관리번호" maxLength={30} />
    </FormUnitBox>
  );
};

export default DefaultInfo;
