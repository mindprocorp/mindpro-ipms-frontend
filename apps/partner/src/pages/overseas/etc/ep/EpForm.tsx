import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { FormProvider, useWatch } from "react-hook-form";

import EpAppellation from "./_components/EpAppellation.tsx";
import EpDirectlyInvolved from "./_components/EpDirectlyInvolved.tsx";
import EpNote from "./_components/EpNote.tsx";
import EpRepresentative from "./_components/EpRepresentative.tsx";
import EpStatement from "./_components/EpStatement.tsx";
import EpStrategy from "./_components/EpStrategy.tsx";
import EpDefaultInfo from "./_components/EpDefaultInfo.tsx";
import EpProducts from "./_components/EpProducts.tsx";
import EpSasido from "./_components/EpSasido.tsx";
import EpManagement from "./_components/EpManagement.tsx";
import EpBasicInfo from "./_components/EpBasicInfo.tsx";
import EpRegiNation from "./_components/EpRegiNation.tsx";
import EpDesignatNation from "./_components/EpDesignatNation.tsx";
import CustomBottom from "@pages/domestic/detail/_components/CustomBottom.tsx";
import EpMaintenance from "@pages/overseas/etc/ep/_components/EpMaintenance.tsx";
import { useOverseasEpAppForm } from "@shared/schema/overseas/form.ts";
import React, { useCallback, useEffect, useState } from "react";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import {
  DOMESTIC_APP_MNG,
  DOMESTIC_APP_SPECIFICELEMENT,
  GRACE_PERIOD,
} from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { isEmpty, mapToOptionNew } from "@shared/util/stringUtil.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  EpSchema,
  type OverseasEpFormInput,
  type OverseasEpFormOutput,
} from "@shared/schema/overseas/epSchema.ts";
import { overseasEpQueries } from "@shared/query/overseas/overseasEpQueries.ts";
import EpHardSummary from "@pages/overseas/etc/ep/_components/EpHardSummary.tsx";
import { appStatusProgressLabel } from "@shared/util/appStatusLabel.ts";

type Props = {
  tblSeq?: string;
  appSeq?: string;
  onSuccess?: () => void;
};
const EpForm = ({tblSeq, appSeq: propAppSeq, onSuccess} : Props) => {
  const form = useOverseasEpAppForm();
  const navigation = useNavigate();
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const getEpDetailMutation = useMutation(overseasEpQueries.getOverseasEpDetail());
  const createEpMutation = useMutation(overseasEpQueries.createOverseasEp());
  const { appSeq: paramAppSeq } = useParams<{ appSeq: string | undefined }>();
  const appSeq = propAppSeq || paramAppSeq;
  
  const { openAlert } = useAlertStore();
  const [gradeCodeList, setGradeCodeList] = useState<CodeSelectOption[]>([]);
  const [ipProcCodeList, setIpProcCodeList] = useState<CodeSelectOption[]>([]);
  const [appCodeList, setAppCodeList] = useState<CodeSelectOption[]>([]);
  const [cateCodeList, setCateCodeList] = useState<CodeSelectOption[]>([]);
  const [rightCodeList, setRightCodeList] = useState<CodeSelectOption[]>([]);
  const [gracePeriodCodeList, setGracePeriodCodeList] = useState<CodeSelectOption[]>([]);

  const statusProgress = appStatusProgressLabel(
    useWatch({ name: "appStatus", control: form.control }) as
      | { code?: string; codeName?: string }
      | undefined,
  );

  const [currentAppSeq, setCurrentAppSeq] = useState<string | undefined>(appSeq);

  const handleSaveClick = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const values = form.getValues();
      onSubmit(values);
    } else {
      console.log("Validation Failed:", form.formState.errors);
      openAlert({
        className: "w-[400px]",
        message: "필수 값을 모두 입력해주세요.",
        confirmText: "확인",
      });
    }
  };

  const onSubmit = (values: OverseasEpFormInput) => {
    const performSave = () => {
      // 진행 중 알럿 표시
      openAlert({
        className: "w-[400px]",
        message: "저장 중입니다. 잠시만 기다려주세요...",
        confirmText: "", // 버튼 없앰
      });

      try {
        const vaildData: OverseasEpFormOutput = EpSchema.parse(values);
        const { appStatus: _omitEpAppStatus, ...savePayload } = vaildData;

        createEpMutation.mutate(savePayload as OverseasEpFormOutput, {
          onSuccess: (response) => {
            console.log("[성공]", response);
            const newSeq = response.data;
            
            // 기존 "저장 중..." 알럿 닫기
            useAlertStore.getState().close();

            // 완료 알럿 표시
            openAlert({
              className: "w-[400px]",
              message: "저장완료하였습니다",
              confirmText: "확인",
              onConfirm: () => {
                useAlertStore.getState().close();
                if (newSeq) {
                  setCurrentAppSeq(newSeq);
                  form.setValue("appSeq", newSeq);

                  // 신규 생성인 경우 상세 페이지로 이동 (모달이 아닐 때만)
                  if (!appSeq && !onSuccess) {
                    navigation(`/overseas/ep/detail/${newSeq}`);
                  } else {
                    // 기존 데이터 수정인 경우 상세 재조회하여 폼 리셋
                    getEpDetail(newSeq);
                  }
                }
                // 부모 컴포넌트(모달 등)에 성공 알림
                onSuccess?.();
              },
            });
          },
          onError: () => {
            openAlert({
              className: "w-[400px]",
              message: "저장 중 오류가 발생했습니다.",
              confirmText: "확인",
            });
          },
        });
      } catch (error) {
        console.error("Schema Parse Error:", error);
        openAlert({
          className: "w-[400px]",
          message: "데이터 형식이 올바르지 않습니다.",
          confirmText: "확인",
        });
      }
    };

    openAlert({
      className: "w-[400px]",
      message: appSeq ? "기본정보를 수정하시겠습니까?" : "저장하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onCancel: () => useAlertStore.getState().close(),
      onConfirm: () => {
        useAlertStore.getState().close();
        performSave();
      },
    });
  };

  const getEpDetail = (appSeq: string) => {
    getEpDetailMutation.mutate(appSeq, {
      onSuccess: (response) => {
        setCurrentAppSeq(appSeq);
        form.setValue("appSeq", appSeq);
        // 상세 조회 응답에 appExtSeq가 없을 경우 기존 form의 appExtSeq 값을 유지
        form.reset({
          ...response.data,
          appSeq,
          appExtSeq: response.data.appExtSeq || form.getValues("appExtSeq"),
          appStatus: response.data.appStatus ?? { code: "", codeName: "" },
        });
      },
    });
  };

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [
        DOMESTIC_APP_MNG.IP_PROC_TYPE,
        DOMESTIC_APP_SPECIFICELEMENT.GRADE,
        DOMESTIC_APP_MNG.APP_CATE,
        DOMESTIC_APP_MNG.CATE,
        DOMESTIC_APP_MNG.RIGHT_CATE,
        GRACE_PERIOD.GRACE_PRD_CONT,
      ],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        console.log("code list ", response);

        const codeDataList = response.data;

        const setupCodes = (codeKey: string, setter: (codes: any[]) => void) => {
          const codeList = getCodeList(codeKey, codeDataList);
          setter(mapToOptionNew(codeList));
        };
        setupCodes(DOMESTIC_APP_MNG.IP_PROC_TYPE, setIpProcCodeList);
        setupCodes(DOMESTIC_APP_SPECIFICELEMENT.GRADE, setGradeCodeList);
        setupCodes(DOMESTIC_APP_MNG.APP_CATE, setAppCodeList);
        setupCodes(DOMESTIC_APP_MNG.CATE, setCateCodeList);
        setupCodes(DOMESTIC_APP_MNG.RIGHT_CATE, setRightCodeList);
        setupCodes(GRACE_PERIOD.GRACE_PRD_CONT, setGracePeriodCodeList);

        // if (!isEmpty(appSeq)) {
        //   console.log("상세 조회를 하자");
        //   getEpDetail(appSeq as string);
        // }
      },
    });
  }, []);

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
  };

  useEffect(() => {
    getCommCodeNew();
  }, [getCommCodeNew]);

  // 상세 데이터 조회 독립 실행
  useEffect(() => {
    if (!isEmpty(appSeq)) {
      getEpDetail(appSeq as string);
    } else {
      // 신규 등록일 때만 기본값 세팅
      form.setValue("mainDrawingFile", undefined);
      if (tblSeq) form.setValue("appExtSeq", tblSeq as string);
      form.setValue("appCaseMng.appCategory.code", "30");
      form.setValue("appCaseMng.appRoute.code", "40");
    }
  }, [appSeq, tblSeq]);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <PageTitleArea
            className="pb-2"
            title="EP출원"
            progress={statusProgress}
          >
            {appSeq && (
              <Button 
                size="h28" 
                variant="outline" 
                type="button" 
                onClick={() => {
                  if (onSuccess) {
                    // 모달 안일 경우 알럿 등으로 닫고 이동할지 확인하거나 즉시 이동
                    navigation(`/overseas/ep/detail/${appSeq}`);
                  } else {
                    navigation(`/overseas/ep/detail/${appSeq}`);
                  }
                }}
              >
                <Icons.ExternalLink />
                상세보기
              </Button>
            )}
            <Button size="h28" variant="blue" type="button" onClick={handleSaveClick}>
              <Icons.CloudUpload />
              저장
            </Button>
          </PageTitleArea>
          <FlexBox vertical>
            <FlexBox vertical>
              {/* 출원사건관리 */}
              <EpDefaultInfo
                ipProcCodeList={ipProcCodeList}
                appCodeList={appCodeList}
                cateCodeList={cateCodeList}
                rightCodeList={rightCodeList}
              />

              {/* 출원 기본정보 */}
              <EpBasicInfo gracePeriodCodeList={gracePeriodCodeList} />
            </FlexBox>

            <FlexBox className="items-stretch">
              <FlexBox vertical>
                {/* 담당 정보 */}
                <EpRepresentative />

                {/* 당사자 정보 */}
                <EpDirectlyInvolved />

                {/* 명칭정보 */}
                <EpAppellation />

                <EpNote />
              </FlexBox>

              <FlexBox vertical>
                {/* 명세서 구성요소 */}
                <EpStatement gradeCodeList={gradeCodeList} />

                {/* 출원 전략설정 */}
                <EpStrategy />

                {/* 물품류 */}
                <EpProducts />

                {/* 대표도 */}
                <EpSasido />
              </FlexBox>

              <FlexBox vertical>
                {/* 출원 행정관리 */}
                <EpManagement />
              </FlexBox>

              <FlexBox vertical>
                {/* 등록·권리유지 관리 */}
                <EpMaintenance />

                {/* 등록국가 */}
                <EpRegiNation />

                {/* 지정국가 */}
                <EpDesignatNation />
              </FlexBox>

              <FlexBox vertical>
                {/* 요약/청구 */}
                <EpHardSummary />
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </form>
      </FormProvider>

      {/* 탭 */}
      {currentAppSeq && <CustomBottom type={"overseas"} tblSeq={currentAppSeq} rightType={"ep"} />}
    </>
  );
};

export default EpForm;
