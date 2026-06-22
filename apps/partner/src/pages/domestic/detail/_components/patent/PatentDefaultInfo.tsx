import { RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext,useWatch } from "react-hook-form";
import type { DomesticFormInput } from "@shared/schema/domestic/domesticSchema.ts";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

interface CodeListType {
  rightCodeList: CodeSelectOption[];
  appCodeList: CodeSelectOption[];
  cateCodeList: CodeSelectOption[];
  appKindCodeList: CodeSelectOption[];
}


const PatentDefaultInfo = (codeList: CodeListType) => {
  const { control } = useFormContext<DomesticFormInput>();
  const { domesticSeq } = useParams<{ domesticSeq: string | undefined }>();


  const isEditMode = !!domesticSeq;


  return (
    <FormUnitBox
      title="출원사건관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <RHF.FormSelect
        control={control}
        name="appCaseMng.category.code"
        items={codeList.cateCodeList}
        label="구분"
      />
      {/*<RHF.Input control={control} name="appCaseMng.rightType" label="권리" disabled />*/}
      <RHF.FormSelect
        key="rightType-fixed"
        control={control}
        name="appCaseMng.rightType.code"
        items={codeList.rightCodeList}
        label="권리"
        ess
        disabled={isEditMode}
      />
      <RHF.FormSelect
        control={control}
        name="appCaseMng.appType.code"
        items={codeList.appKindCodeList}
        label="출원종류"
      />
      <RHF.FormSelect
        control={control}
        name="appCaseMng.appCategory.code"
        items={codeList.appCodeList}
        label="출원구분"
        ess
      />

      <RHF.FormDatePicker control={control} name="appCaseMng.inventionReportDate" label="발명일" />

      <RHF.FormDatePicker control={control} name="appCaseMng.receiptDate" label="접수일" />
      <RHF.Input
        important
        control={control}
        name="appCaseMng.ourRef"
        label="OurRef"
        placeholder="선택"
        maxLength={30}
      />
      <RHF.Input control={control} name="appCaseMng.yourRef" label="YourRef" placeholder="선택" maxLength={30} />
      <RHF.Input control={control} name="appCaseMng.clientRef" label="출원인관리번호" placeholder="선택" maxLength={30} />
      <RHF.FormDatePicker
        important
        control={control}
        name="appCaseMng.draftDeadline"
        label="초안마감일"
      />
      <RHF.FormDatePicker control={control} name="appCaseMng.draftSendDate" label="초안발송일" />
    </FormUnitBox>
  );
};

export default PatentDefaultInfo;
