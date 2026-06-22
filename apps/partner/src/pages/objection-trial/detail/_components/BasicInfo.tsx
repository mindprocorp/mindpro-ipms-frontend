import { type ObjectionTrialFormInput } from "@shared/schema/objection-trial/objectionTrialSchema.ts";
import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";
import { CountryModal } from "@pages/common/modal/country/CountryModal";
import { useState } from "react";
import { AppSearchModal, type SuccessOurRefData, type InputKeyInfoType } from "@pages/common/modal/app-search/AppSearchModal";

const BasicInfo = () => {
  const { control, setValue } = useFormContext<ObjectionTrialFormInput>();
  const [countryModal, setCountryModal] = useState(false);
  const [appSearchModal, setAppSearchModal] = useState(false);
  const [appSearchInput, setAppSearchInput] = useState<InputKeyInfoType>({ inputKey: "", inputName: "" });

  const onAppSearchSuccess = (rtnData: SuccessOurRefData) => {
    const data = rtnData.ourRefInfo[0];
    setValue("appBaseInfo.appNo", data.appNo ?? "", { shouldValidate: true });
    setValue("appBaseInfo.appDate", data.appDate ?? "", { shouldValidate: true });
    setValue("appBaseInfo.regDate", data.regDate ?? "", { shouldValidate: true });
    setValue("appBaseInfo.intlRegDate", data.intlRegDate ?? "", { shouldValidate: true });
    setValue("appBaseInfo.announcementDate", data.pubDate ?? "", { shouldValidate: true });

    setValue("appBaseInfo.domesticRegDecisionDate", data.domesticRegDecisionDate ?? "", { shouldValidate: true });
    setValue("appBaseInfo.domesticRegDate",         data.domesticRegDate         ?? "", { shouldValidate: true });
    setValue("appBaseInfo.domesticRegNo",           data.domesticRegNo           ?? "", { shouldValidate: true });
    setValue("appGoodsInfo.goodsClass", data.niceClass ?? "", { shouldValidate: true });

    setValue("appBaseInfo.countryCode.code", data.country?.code ?? "", { shouldValidate: true });
    setValue("appBaseInfo.countryCode.codeName", data.country?.codeName ?? "", { shouldValidate: true });
    setValue("appTitleInfo.titleKo", data.titleKo ?? "", { shouldValidate: true });
    setValue("appTitleInfo.titleEn", data.titleEn ?? "", { shouldValidate: true });
    setValue("appBaseInfo.appSeq", data.appSeq ?? "", { shouldValidate: true });
    // 출원 연결 시 권리 자동 세팅
    setValue("cftCaseMng.rightType.code", data.rightType?.code ?? "", { shouldValidate: true });
    setValue("cftCaseMng.rightType.codeName", data.rightType?.codeName ?? "", { shouldValidate: true });
  };

  return (
    <FormUnitBox
      vertical
      title="출원 기본정보"
      titleExtra={
        <span className="text-muted-foreground flex items-center gap-1 text-[11px] font-normal">
          <span>·</span>
          출원번호 검색 시 회색 필드는 자동으로 입력됩니다.
        </span>
      }
    >
      <RHF.FormField gap={2}>
        <RHF.Input
          control={control}
          name="appBaseInfo.appNo"
          label="출원번호"
          readOnly
          placeholder=""
          krAppNoOnly
          actions={
            <CustomTooltip message="출원번호를 선택하세요">
              <Button className="w-5" type="button" onClick={() => { setAppSearchModal(true); setAppSearchInput({ inputKey: "appBaseInfo.appNo", inputName: "appBaseInfo.appNo" }); }}>
                <Icons.Search className="size-3" />
              </Button>
            </CustomTooltip>
          }
        />
        <RHF.Input
          control={control}
          name="appBaseInfo.countryCode.codeName"
          label="출원국가"
          readOnly
          placeholder=""
          actions={
            <>
              <CustomTooltip message="출원국코드를 선택하세요">
                <Button className="w-5" onClick={() => setCountryModal(true)}>
                  <Icons.SearchCode className="size-3" />
                </Button>
              </CustomTooltip>
              <RHF.Input
                control={control}
                name="appBaseInfo.countryCode.code"
                placeholder=""
                readOnly
              />
            </>
          }
        />
        <RHF.FormDatePicker control={control} name="appBaseInfo.appDate" label="출원일" readOnly placeholder="" />
        <RHF.FormDatePicker control={control} name="appBaseInfo.announcementDate" label="공고일" dateOnly readOnly placeholder="" />
        <RHF.FormDatePicker control={control} name="appBaseInfo.intlRegDate" label="국제 등록일" dateOnly readOnly placeholder="" />
        <RHF.Input control={control} name="appBaseInfo.regNo" label="등록번호" readOnly krRegNoOnly placeholder="" />
      </RHF.FormField>

      <RHF.FormField gap={2}>
        <RHF.FormDatePicker control={control} name="appBaseInfo.domesticRegDecisionDate" label="국내 등록결정일" readOnly placeholder="" />
        <RHF.FormDatePicker control={control} name="appBaseInfo.domesticRegDate" label="국내 등록일" readOnly placeholder="" />
        <RHF.Input control={control} name="appBaseInfo.domesticRegNo" label="국내 등록번호" krRegNoOnly readOnly placeholder="" />
        <RHF.FormDatePicker control={control} name="appBaseInfo.dueLimitDate" label="청구 마감일" dateOnly />
        <RHF.FormDatePicker control={control} name="appBaseInfo.claimDate" label="청구일" dateOnly />
        <RHF.Input control={control} name="appBaseInfo.caseNo" label="사건번호" maxLength={30} />
      </RHF.FormField>

      <CountryModal
        open={countryModal}
        onOpenChange={setCountryModal}
        onSuccess={(data) => {
          setValue("appBaseInfo.countryCode.code", data.countryCode);
          setValue("appBaseInfo.countryCode.codeName", data.countryNameKo);
        }}
      />

      <AppSearchModal
        open={appSearchModal}
        onOpenChange={setAppSearchModal}
        input={appSearchInput}
        onSuccess={onAppSearchSuccess}
      />
    </FormUnitBox>
  );
};

export default BasicInfo;
