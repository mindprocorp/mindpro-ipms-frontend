import { type EtcCaseFormInput } from "@shared/schema/etc-case/etcCaseSchema.ts";
import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";
import { CountryModal } from "@pages/common/modal/country/CountryModal";
import { useState } from "react";
import { AppSearchModal, type SuccessOurRefData, type InputKeyInfoType } from "@pages/common/modal/app-search/AppSearchModal";

const BasicInfo = () => {
  const { control, setValue } = useFormContext<EtcCaseFormInput>();
  const [countryModal, setCountryModal] = useState(false);
  const [appSearchModal, setAppSearchModal] = useState(false);
  const [appSearchInput, setAppSearchInput] = useState<InputKeyInfoType>({ inputKey: "", inputName: "" });

  const onAppSearchSuccess = (rtnData: SuccessOurRefData) => {
    const data = rtnData.ourRefInfo[0];
    setValue("appBaseInfo.appNo", data.appNo ?? "", { shouldValidate: true });
    setValue("appBaseInfo.appDate", data.appDate ?? "", { shouldValidate: true });
    setValue("appBaseInfo.regDate", data.regDate ?? "", { shouldValidate: true });

    // 신규 추가: 국내 등록 및 물품류 연동
    setValue("appBaseInfo.domesticRegNo", data.domesticRegNo ?? "", { shouldValidate: true });
    setValue("appBaseInfo.domesticRegDate", data.domesticRegDate ?? "", { shouldValidate: true });
    setValue("appBaseInfo.domesticRegDecisionDate", data.domesticRegDecisionDate ?? "", { shouldValidate: true });
    setValue("appGoodsInfo.goodsClass", data.niceClass ?? "", { shouldValidate: true });

    setValue("appBaseInfo.countryCode.code", data.country?.code ?? "", { shouldValidate: true });
    setValue("appBaseInfo.countryCode.codeName", data.country?.codeName ?? "", { shouldValidate: true });
    setValue("appTitleInfo.titleKo", data.titleKo ?? "", { shouldValidate: true });
    setValue("appTitleInfo.titleEn", data.titleEn ?? "", { shouldValidate: true });
    // 출원 연결 시 appSeq 및 권리 자동 세팅
    setValue("cftCaseMng.appSeq", data.appSeq ?? "", { shouldValidate: true });
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
          //placeholder=""
          readOnly
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
          placeholder=""
          readOnly
          actions={
            <>
              <CustomTooltip message="출원국코드를 선택하세요">
                <Button className="w-5" onClick={() => setCountryModal(true)}>
                  <Icons.SearchCode className="size-3" />
                </Button>
              </CustomTooltip>
              <RHF.Input control={control} name="appBaseInfo.countryCode.code" placeholder="" readOnly />
            </>
          }
        />
        <RHF.FormDatePicker control={control} name="appBaseInfo.appDate" label="출원일" readOnly placeholder="" />
        <RHF.FormDatePicker control={control} name="appBaseInfo.regDate" label="등록일" readOnly placeholder="" />
        <RHF.Input control={control} name="appBaseInfo.regNo" label="등록번호" placeholder="" readOnly krRegNoOnly />
      </RHF.FormField>

      <RHF.FormField gap={2}>
        <RHF.FormDatePicker control={control} name="appBaseInfo.domesticRegDecisionDate" label="국내 등록 결정일" readOnly placeholder="" />
        <RHF.FormDatePicker control={control} name="appBaseInfo.domesticRegDate" label="국내 등록일" readOnly placeholder="" />
        <RHF.Input control={control} name="appBaseInfo.domesticRegNo" label="국내 등록번호" placeholder="" readOnly krRegNoOnly />
        <RHF.FormDatePicker control={control} name="appBaseInfo.dueLimitDate" label="처리 마감일" />
        <RHF.FormDatePicker control={control} name="appBaseInfo.processDate" label="처리일" />
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
