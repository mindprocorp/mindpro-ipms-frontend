import { Button, FlexBox, FormDialog, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { FormProvider, useWatch } from "react-hook-form";

import PctAppellation from "./_components/PctAppellation.tsx";
import PctDirectlyInvolved from "./_components/PctDirectlyInvolved.tsx";
import PctNote from "./_components/PctNote.tsx";
import PctRepresentative from "./_components/PctRepresentative.tsx";
// import PctStatement from "./_components/PctStatement.tsx"; // PCT 백엔드 DTO에 appSpecificElement 미존재로 미사용
import PctStrategy from "./_components/PctStrategy.tsx";
import PctDefaultInfo from "./_components/PctDefaultInfo.tsx";
import PctManagement from "./_components/PctManagement.tsx";
import PctBasicInfo from "./_components/PctBasicInfo.tsx";
import CustomBottom from "@pages/domestic/detail/_components/CustomBottom.tsx";
import PctMaintenance from "@pages/overseas/etc/pct/_components/PctMaintenance.tsx";
import { useOverseasPctAppForm } from "@shared/schema/overseas/form.ts";
import React, { useCallback, useEffect, useState } from "react";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import { GRACE_PERIOD } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { isEmpty, mapToOptionNew } from "@shared/util/stringUtil.ts";
import { appStatusProgressLabel } from "@shared/util/appStatusLabel.ts";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries.ts";
import { overseasPctQueries } from "@shared/query/overseas/overseasPctQueries.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  type OverseasPctFormInput,
  type OverseasPctFormOutput,
  PctSchema,
} from "@shared/schema/overseas/pctAppSchema.ts";
import EpHardSummary from "@pages/overseas/etc/ep/_components/EpHardSummary.tsx";

type Props = {
  tblSeq?: string;
  appSeq?: string;
  onSuccess?: () => void;
};
const PctForm = ({ tblSeq, appSeq: propAppSeq, onSuccess } : Props) => {
  const navigation = useNavigate();
  const form = useOverseasPctAppForm();
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const createPctMutation = useMutation(overseasPctQueries.createOverseasPct());
  const getPctDetailMutation = useMutation(overseasPctQueries.getOverseasPctDetail());
  const { appSeq: paramAppSeq } = useParams<{ appSeq: string | undefined }>();
  const appSeq = propAppSeq || paramAppSeq;
  const { openAlert } = useAlertStore();
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
      onSubmit(form.getValues());
    } else {
      openAlert({
        className: "w-[400px]",
        message: "필수 값을 모두 입력해주세요.",
        confirmText: "확인",
      });
    }
  };

  const onSubmit = (values: OverseasPctFormInput) => {
    const performSave = () => {
      // 진행 중 알럿 표시
      openAlert({
        className: "w-[400px]",
        message: "저장 중입니다. 잠시만 기다려주세요...",
        confirmText: "", // 버튼 없앰
      });

      try {
        const vaildData: OverseasPctFormOutput = PctSchema.parse(values);
        const { appStatus: _omitPctAppStatus, ...savePayload } = vaildData;

        createPctMutation.mutate(savePayload as OverseasPctFormOutput, {
          onSuccess: (response) => {
            console.log("[성공]", response);
            const newSeq = response.data;
            
            // 완료 알럿으로 교체
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
                    navigation(`/overseas/pct/detail/${newSeq}`);
                  } else {
                    // 기존 데이터 수정인 경우 상세 재조회하여 폼 리셋
                    getPctDetail(newSeq);
                  }
                }
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

  const getPctDetail = (appSeq: string) => {
    getPctDetailMutation.mutate(appSeq, {
      onSuccess: (response) => {
        setCurrentAppSeq(appSeq);
        form.setValue("appSeq", appSeq );
        // 상세 조회 응답에 appExtSeq가 없을 경우 기존 form의 appExtSeq 값을 유지
        form.reset({
          ...response.data,
          appExtSeq: response.data.appExtSeq || form.getValues("appExtSeq"),
          appStatus: response.data.appStatus ?? { code: "", codeName: "" },
        });
      },
    });
  };

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [GRACE_PERIOD.GRACE_PRD_CONT],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        console.log("code list ", response);

        const codeDataList = response.data;

        const setupCodes = (codeKey: string, setter: (codes: any[]) => void) => {
          const codeList = getCodeList(codeKey, codeDataList);
          setter(mapToOptionNew(codeList));
        };
        setupCodes(GRACE_PERIOD.GRACE_PRD_CONT, setGracePeriodCodeList);

        // if (!isEmpty(appSeq)) {
        //   console.log("상세 조회를 하자");
        //   getPctDetail(appSeq as string);
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
      getPctDetail(appSeq as string);
    } else {
      // 신규 등록일 때만 기본값 세팅
      if (tblSeq) form.setValue("appExtSeq", tblSeq as string);
      form.setValue("appCaseMng.appRoute.code", "30");
      form.setValue("appCaseMng.rightType", { code: "10", codeName: "특허" });
    }
  }, [appSeq, tblSeq]);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <PageTitleArea
            className="pb-2"
            title="PCT출원"
            progress={statusProgress}
          >
            {appSeq && (
              <Button 
                size="h28" 
                variant="outline" 
                type="button" 
                onClick={() => navigation(`/overseas/pct/detail/${appSeq}`)}
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
            <FlexBox>
              {/* 출원사건관리 */}
              <PctDefaultInfo />

              {/* 출원 기본정보 */}
              <PctBasicInfo gracePeriodCodeList={gracePeriodCodeList} />
            </FlexBox>

            <FlexBox className="items-stretch">
              <FlexBox vertical>
                {/* 담당 정보 */}
                <PctRepresentative />

                {/* 당사자 정보 */}
                <PctDirectlyInvolved />

                {/* 명칭정보 */}
                <PctAppellation />
              </FlexBox>

              <FlexBox vertical>
                {/* 명세서 구성요소 - PCT 백엔드 DTO에 appSpecificElement 미존재로 미사용 */}
                {/* <PctStatement gradeCodeList={gradeCodeList} /> */}

                {/* 출원 전략설정 */}
                <PctStrategy />
              </FlexBox>

              <FlexBox vertical>
                {/* 출원 행정관리 */}
                <PctManagement />


                <PctNote />
              </FlexBox>

              <FlexBox vertical>
                {/* 등록·권리유지 관리 */}
                <PctMaintenance />
              </FlexBox>
              <FlexBox vertical>
                <EpHardSummary />
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </form>
      </FormProvider>

      {/* 탭 */}
      {currentAppSeq && <CustomBottom type={"overseas"} tblSeq={currentAppSeq} rightType={"pct"} />}
    </>
  );
};

export default PctForm;
