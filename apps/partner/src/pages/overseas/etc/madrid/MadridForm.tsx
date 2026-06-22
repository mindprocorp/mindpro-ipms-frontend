import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { FormProvider, useWatch } from "react-hook-form";

import MadridAppellation from "./_components/MadridAppellation.tsx";
import MadridDirectlyInvolved from "./_components/MadridDirectlyInvolved.tsx";
import MadridNote from "./_components/MadridNote.tsx";
import MadridRepresentative from "./_components/MadridRepresentative.tsx";
import MadridStrategy from "./_components/MadridStrategy.tsx";
import MadridDefaultInfo from "./_components/MadridDefaultInfo.tsx";
import MadridProducts from "./_components/MadridProducts.tsx";
import MadridSasidoFile from "./_components/MadridSasidoFile.tsx";
import MadridBasicInfo from "./_components/MadridBasicInfo.tsx";
import MadridManagement from "./_components/MadridManagement.tsx";
import MadridMaintenance from "@pages/overseas/etc/madrid/_components/MadridMaintenance.tsx";
import { useOverseasMadridAppForm } from "@shared/schema/overseas/form.ts";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import React, { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { GRACE_PERIOD } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { isEmpty, mapToOptionNew } from "@shared/util/stringUtil.ts";
import CustomBottom from "@pages/domestic/detail/_components/CustomBottom.tsx";
import {
  MadridSchema,
  type OverseasMadridFormInput,
  type OverseasMadridFormOutput,
} from "@shared/schema/overseas/madridSchema.ts";
import { overseasMadridQueries } from "@shared/query/overseas/overseasMadridQueries.ts";
import type { MadridFileInfo } from "@shared/api/overseas/madridApi.ts";
import { appStatusProgressLabel } from "@shared/util/appStatusLabel.ts";

type Props = {
  tblSeq?: string;
  appSeq?: string;
  onSuccess?: () => void;
};
const MadridForm = ({ tblSeq, appSeq: propAppSeq, onSuccess }: Props) => {
  const form = useOverseasMadridAppForm();
  const navigation = useNavigate();
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const getMadridDetailMutation = useMutation(overseasMadridQueries.getOverseasMadridDetail());
  const createMadridMutation = useMutation(overseasMadridQueries.createOverseasMadrid());
  const { appSeq: paramAppSeq } = useParams<{ appSeq: string | undefined }>();
  const appSeq = propAppSeq || paramAppSeq;
  const { openAlert } = useAlertStore();
  const [gracePeriodCodeList, setGracePeriodCodeList] = useState<CodeSelectOption[]>([]);
  const [existingFileInfo, setExistingFileInfo] = useState<MadridFileInfo[]>([]);

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

  const onSubmit = (values: OverseasMadridFormInput) => {
    const rightTypeValue = form.getValues("appCaseMng.rightType.code");
    if (!rightTypeValue) {
      openAlert({
        className: "w-[400px]",
        message: "출원을 선택하세요",
        confirmText: "확인",
      });
      return;
    }

    const performSave = () => {
      // 진행 중 알럿 표시
      openAlert({
        className: "w-[400px]",
        message: "저장 중입니다. 잠시만 기다려주세요...",
        confirmText: "", // 버튼 없앰
      });

      try {
        const vaildData: OverseasMadridFormOutput = MadridSchema.parse(values);
        const { appStatus: _omitMadridAppStatus, ...savePayload } = vaildData;

        createMadridMutation.mutate(savePayload as OverseasMadridFormOutput, {
          onSuccess: (response) => {
            console.log("[성공]", response);
            const newSeq = response.data;
            
            setExistingFileInfo([]);
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
                    navigation(`/overseas/madrid/detail/${newSeq}`);
                  } else {
                    // 기존 데이터 수정인 경우 상세 재조회하여 폼 리셋
                    getMadridDetail(newSeq);
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

  const getMadridDetail = (appSeq: string) => {
    getMadridDetailMutation.mutate(appSeq, {
      onSuccess: (response) => {
        setCurrentAppSeq(appSeq);
        const currentExtSeq = form.getValues("appExtSeq");
        form.reset({
          ...response.data,
          appSeq,
          appExtSeq: response.data.appExtSeq || currentExtSeq,
          appStatus: response.data.appStatus ?? { code: "", codeName: "" },
          appCaseMng: {
            ...response.data.appCaseMng,
            rightType: { code: "40", codeName: "상표" },
          },
        });
        if (response.data.fileInfo && response.data.fileInfo.length > 0) {
          setExistingFileInfo(response.data.fileInfo);
        }
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
        //   getMadridDetail(appSeq as string);
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
      getMadridDetail(appSeq as string);
    } else {
      // 신규 등록일 때만 기본값 세팅
      form.setValue("trademarkImage", undefined);
      form.setValue("appExtSeq", tblSeq as string);
      form.setValue("appCaseMng.appRoute.code", "50");
      form.setValue("appCaseMng.rightType", { code: "40", codeName: "상표" });
    }
  }, [appSeq, tblSeq]);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <PageTitleArea
            className="pb-2"
            title="마드리드 출원"
            progress={statusProgress}
          >
            {appSeq && (
              <Button 
                size="h28" 
                variant="outline" 
                type="button" 
                onClick={() => navigation(`/overseas/madrid/detail/${appSeq}`)}
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
              <MadridDefaultInfo />

              {/* 출원 기본정보 */}
              <MadridBasicInfo gracePeriodCodeList={gracePeriodCodeList} />
            </FlexBox>

            <FlexBox className="items-stretch">
              <FlexBox vertical>
                {/* 담당 정보 */}
                <MadridRepresentative />

                {/* 당사자 정보 */}
                <MadridDirectlyInvolved />

                {/* 명칭정보 */}
                <MadridAppellation />
              </FlexBox>

              <FlexBox vertical>
                {/* 출원 전략설정 */}
                <MadridStrategy />
              </FlexBox>

              <FlexBox vertical>
                {/* 출원 행정관리 */}
                <MadridManagement />

                {/* 물품류 */}
                <MadridProducts />

                {/* 상표이미지 */}
                <MadridSasidoFile fileInfo={existingFileInfo} />
              </FlexBox>

              <FlexBox vertical>
                {/* 등록·권리유지 관리 */}
                <MadridMaintenance />

                {/* 비고 */}
                <MadridNote />
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </form>
      </FormProvider>

      {/* 탭 */}
      {currentAppSeq && <CustomBottom type={"overseas"} tblSeq={currentAppSeq} rightType={"madrid"} />}
    </>
  );
};

export default MadridForm;
