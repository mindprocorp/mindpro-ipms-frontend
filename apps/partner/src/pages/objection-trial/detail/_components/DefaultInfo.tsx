import { type ObjectionTrialFormInput } from "@shared/schema/objection-trial/objectionTrialSchema.ts";
import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";
import type { CodeSelectOption } from "@shared/api/common/commApi";
import { useState } from "react";
import { AppSearchModal, type SuccessOurRefData, type InputKeyInfoType } from "@pages/common/modal/app-search/AppSearchModal";

interface DefaultInfoProps {
  pendingCourtCodeList: CodeSelectOption[];
  agentCategoryCodeList: CodeSelectOption[];
  caseCategoryCodeList: CodeSelectOption[];
  rightTypeCodeList: CodeSelectOption[];
  caseTypeCodeList: CodeSelectOption[];
}

const DefaultInfo = ({
  pendingCourtCodeList,
  agentCategoryCodeList,
  caseCategoryCodeList,
  rightTypeCodeList,
  caseTypeCodeList,
}: DefaultInfoProps) => {
  const { control, setValue } = useFormContext<ObjectionTrialFormInput>();
  const [appSearchModal, setAppSearchModal] = useState(false);
  const [appSearchInput, setAppSearchInput] = useState<InputKeyInfoType>({ inputKey: "", inputName: "" });

  const onAppSearchSuccess = (rtnData: SuccessOurRefData) => {
    const data = rtnData.ourRefInfo[0];
    // 사건관리 섹션
    setValue("cftCaseMng.ourRef", data.ourRef ?? "", { shouldValidate: true });
    setValue("cftCaseMng.yourRef", data.yourRef ?? "", { shouldValidate: true });
    setValue("cftCaseMng.clientRef", data.clientRef ?? "", { shouldValidate: true });
    setValue("cftCaseMng.rightType.code", data.rightType?.code ?? "", { shouldValidate: true });
    setValue("cftCaseMng.rightType.codeName", data.rightType?.codeName ?? "", { shouldValidate: true });
    setValue("cftCaseMng.appClassification.code", data.caseCategory?.code ?? "", { shouldValidate: true });

    // 출원 기본정보 섹션 (연동)
    setValue("appBaseInfo.appNo", data.appNo ?? "", { shouldValidate: true });
    setValue("appBaseInfo.appDate", data.appDate ?? "", { shouldValidate: true });
    setValue("appBaseInfo.regDate", data.regDate ?? "", { shouldValidate: true });
    setValue("appBaseInfo.intlRegDate", data.intlRegDate ?? "", { shouldValidate: true });
    setValue("appBaseInfo.announcementDate", data.pubDate ?? "", { shouldValidate: true });
    setValue("appBaseInfo.domesticRegDecisionDate", data.domesticRegDecisionDate ?? "", { shouldValidate: true });
    setValue("appBaseInfo.domesticRegDate", data.domesticRegDate ?? "", { shouldValidate: true });
    setValue("appBaseInfo.domesticRegNo", data.domesticRegNo ?? "", { shouldValidate: true });
    setValue("appBaseInfo.countryCode.code", data.country?.code ?? "", { shouldValidate: true });
    setValue("appBaseInfo.countryCode.codeName", data.country?.codeName ?? "", { shouldValidate: true });

    // 명칭 및 기타
    setValue("appTitleInfo.titleKo", data.titleKo ?? "", { shouldValidate: true });
    setValue("appTitleInfo.titleEn", data.titleEn ?? "", { shouldValidate: true });
    setValue("appGoodsInfo.goodsClass", data.niceClass ?? "", { shouldValidate: true });
    setValue("appBaseInfo.appSeq", data.appSeq ?? "", { shouldValidate: true });
  };

  return (
    <FormUnitBox
      title="출원사건관리"
      className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
    >
      <RHF.FormSelect control={control} name="cftCaseMng.courtCategory.code" items={pendingCourtCodeList} label="계류법정" />
      <RHF.FormSelect control={control} name="cftCaseMng.agentCategory.code" items={agentCategoryCodeList} label="대리인구분" />
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
            <CustomTooltip message="OurRef번호를 검색하세요">
              <Button type="button" className="w-5" onClick={() => { setAppSearchModal(true); setAppSearchInput({ inputKey: "cftCaseMng.ourRef", inputName: "cftCaseMng.ourRef" }); }}>
                <Icons.Search className="size-3" />
              </Button>
            </CustomTooltip>
          </>
        } */
      />

      <RHF.Input control={control} name="cftCaseMng.yourRef" label="YourRef" maxLength={30} />
      <RHF.Input control={control} name="cftCaseMng.clientRef" label="출원인관리번호" maxLength={30} />

      <AppSearchModal
        open={appSearchModal}
        onOpenChange={setAppSearchModal}
        input={appSearchInput}
        onSuccess={onAppSearchSuccess}
      />
    </FormUnitBox>
  );
};

export default DefaultInfo;
