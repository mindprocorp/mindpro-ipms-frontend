import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { FormProvider, useWatch } from "react-hook-form";

import NationalAppellation from "./_components/NationalAppellation.tsx";
import NationalDirectlyInvolved from "./_components/NationalDirectlyInvolved.tsx";
import NationalNote from "./_components/NationalNote.tsx";
import NationalRepresentative from "./_components/NationalRepresentative.tsx";
import NationalDefaultInfo from "./_components/NationalDefaultInfo.tsx";
import NationalSasidoFile from "./_components/NationalSasidoFile.tsx";
import NationalBasicInfo from "./_components/NationalBasicInfo.tsx";
import NationalManagement from "./_components/NationalManagement.tsx";
import CustomBottom from "@pages/domestic/detail/_components/CustomBottom.tsx";
import NationalMaintenance from "@pages/overseas/etc/national/_components/NationalMaintenance.tsx";
import { useOverseasNationalAppForm } from "@shared/schema/overseas/form.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import React, { useCallback, useEffect, useState } from "react";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import { GRACE_PERIOD } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { isEmpty, mapToOptionNew } from "@shared/util/stringUtil.ts";
import {
  NationalSchema,
  type OverseasNationalFormInput,
  type OverseasNationalFormOutput,
} from "@shared/schema/overseas/nationalSchema.ts";
import NationalStrategy from "@pages/overseas/etc/national/_components/NationalStrategy.tsx";
import { overseasNationalQueries } from "@shared/query/overseas/overseasNationalQueries.ts";
import type { FileInfo } from "@shared/api/overseas/nationalApi.ts";
import { appStatusProgressLabel } from "@shared/util/appStatusLabel.ts";

type Props = {
  tblSeq?: string;
  appSeq?: string;
  onSuccess?: () => void;
};

const NationalForm = ({ tblSeq, appSeq: propAppSeq, onSuccess } : Props ) => {
  const form = useOverseasNationalAppForm();
  const navigation = useNavigate();
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const getNationalDetailMutation = useMutation(
    overseasNationalQueries.getOverseasNationalDetail(),
  );
  const createNationalMutation = useMutation(overseasNationalQueries.createOverseasNational());
  const { appSeq: paramAppSeq } = useParams<{ appSeq: string | undefined }>();
  const appSeq = propAppSeq || paramAppSeq;
  const { openAlert } = useAlertStore();
  const [gracePeriodCodeList, setGracePeriodCodeList] = useState<CodeSelectOption[]>([]);
  const [existingFileInfo, setExistingFileInfo] = useState<FileInfo[]>([]);

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

  const onSubmit = (values: OverseasNationalFormInput) => {
    const performSave = () => {
      // 진행 중 알럿 표시
      openAlert({
        className: "w-[400px]",
        message: "저장 중입니다. 잠시만 기다려주세요...",
        confirmText: "", // 버튼 없앰
      });

      try {
        const vaildData: OverseasNationalFormOutput = NationalSchema.parse(values);
        const { appStatus: _omitNationalAppStatus, ...savePayload } = vaildData;

        createNationalMutation.mutate(savePayload as OverseasNationalFormOutput, {
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
                    navigation(`/overseas/national/detail/${newSeq}`);
                  } else {
                    // 기존 데이터 수정인 경우 상세 재조회하여 폼 리셋
                    getNationalDetail(newSeq);
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

  const getNationalDetail = (appSeq: string) => {
    getNationalDetailMutation.mutate(appSeq, {
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
            rightType: response.data.appCaseMng?.rightType ?? { code: "30", codeName: "디자인" },
            category: response.data.appCaseMng?.category ?? { code: "20", codeName: "해외" },
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
        //   getNationalDetail(appSeq as string);
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
      getNationalDetail(appSeq as string);
    } else {
      // 신규 등록일 때만 기본값 세팅
      form.setValue("mainImageFile", undefined);
      form.setValue("appExtSeq", tblSeq as string);
      form.setValue("appCaseMng.appRoute.code", "60");
      form.setValue("appCaseMng.rightType", { code: "30", codeName: "디자인" });
      form.setValue("appCaseMng.category", { code: "20", codeName: "해외" });
    }
  }, [appSeq, tblSeq]);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <PageTitleArea
            className="pb-2"
            title="국제디자인 출원"
            progress={statusProgress}
          >
            {appSeq && (
              <Button 
                size="h28" 
                variant="outline" 
                type="button" 
                onClick={() => navigation(`/overseas/national/detail/${appSeq}`)}
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
              <NationalDefaultInfo />

              {/* 출원 기본정보 */}
              <NationalBasicInfo gracePeriodCodeList={gracePeriodCodeList} />
            </FlexBox>

            <FlexBox className="items-stretch">
              <FlexBox vertical>
                {/* 담당 정보 */}
                <NationalRepresentative />

                {/* 당사자 정보 */}
                <NationalDirectlyInvolved />

                {/* 비고 */}
                <NationalNote />
              </FlexBox>

              <FlexBox vertical>
                <NationalStrategy />
                {/* 명칭정보 */}
                <NationalAppellation />

                {/* 대표도 */}
                <NationalSasidoFile fileInfo={existingFileInfo} />
              </FlexBox>

              <FlexBox vertical>
                {/* 출원 행정관리 */}
                <NationalManagement />
              </FlexBox>

              <FlexBox vertical>
                {/* 등록·권리유지 관리 */}
                <NationalMaintenance />
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </form>
      </FormProvider>

      {/* 탭 */}
      {currentAppSeq && <CustomBottom type={"overseas"} tblSeq={currentAppSeq} rightType={"national"} />}
    </>
  );
};

export default NationalForm;
