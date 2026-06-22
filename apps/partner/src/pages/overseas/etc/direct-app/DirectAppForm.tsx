import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { FormProvider, useWatch } from "react-hook-form";

import DirectAppAppellation from "./_components/patent/DirectAppAppellation.tsx";
import DirectAppNote from "./_components/patent/DirectAppNote.tsx";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries.ts";
import { useOverseasDirectAppForm } from "@shared/schema/overseas/form.ts";
import React, { useCallback, useEffect, useState } from "react";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import DirectAppSchema, {
  overseasDirectAppDefaultValues,
  type OverseasDirectAppFormInput,
  type OverseasDirectAppFormOutput,
} from "@shared/schema/overseas/directAppSchema.ts";
import { DOMESTIC_APP_MNG, DOMESTIC_APP_SPECIFICELEMENT } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { isEmpty, mapToOptionNew } from "@shared/util/stringUtil.ts";
import CustomBottom from "@pages/domestic/detail/_components/CustomBottom.tsx";
import DirectAppRepresentative from "@pages/overseas/etc/direct-app/_components/patent/DirectAppRepresentative.tsx";
import { overseasDirectQueries } from "@shared/query/overseas/overseasDirectQueries.ts";
import overseasDirectRenderMap from "@pages/overseas/etc/direct-app/DynaicDirectCompRender.tsx";
import { getName, RIGHT_TYPE } from "@shared/enum/domesticType.ts";
import { appStatusProgressLabel } from "@shared/util/appStatusLabel.ts";

type Props = {
  tblSeq? : string;
  appSeq? : string;
  onSuccess?: () => void;
}

const DirectAppForm = ({tblSeq, appSeq: propAppSeq, onSuccess}: Props) => {
  const { overseasDirectSeq: paramAppSeq } = useParams<{ overseasDirectSeq: string | undefined }>();
  const appSeq = propAppSeq || paramAppSeq;
  const [searchParams] = useSearchParams();
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const createOverseasDirectMutation = useMutation(overseasDirectQueries.createOverseasDirect());
  const getOverseasDirectMutation = useMutation(overseasDirectQueries.getOverseasDirectDetail());
  const navigation = useNavigate();
  const form = useOverseasDirectAppForm();
  const [rightCodeList, setRightCodeList] = useState<CodeSelectOption[]>([]);
  const [gradeCodeList, setGradeCodeList] = useState<CodeSelectOption[]>([]);
  const [appCodeList, setAppCodeList] = useState<CodeSelectOption[]>([]);
  const [cateCodeList, setCateCodeList] = useState<CodeSelectOption[]>([]);
  const [appKindCodeList, setAppKindCodeList] = useState<CodeSelectOption[]>([]);
  const [ipProcCodeList, setIpProcCodeList] = useState<CodeSelectOption[]>([]);
  const [title, setTitle] = useState<string>("");
  const { openAlert } = useAlertStore();
  const { watch, resetField, clearErrors, setValue } = form;
  const [currentAppSeq, setCurrentAppSeq] = useState<string | undefined>(appSeq);

  const rightTypeValue = watch("appCaseMng.rightType.code");
  const prevRightType = React.useRef<string | undefined>(rightTypeValue);

  // 권리 타입 변경에 따른 타이틀 업데이트 및 초기화 로직
  useEffect(() => {
    if (rightTypeValue && rightCodeList.length > 0) {
      const label = rightCodeList.find((item) => item.value === rightTypeValue)?.label;
      setTitle(label ? (label as string) : "");
    }

    if (!appSeq && prevRightType.current && prevRightType.current !== rightTypeValue) {
      const currentValues = form.getValues();
      form.reset({
        ...overseasDirectAppDefaultValues,
        appExtSeq: currentValues.appExtSeq,
        appCaseMng: {
          ...overseasDirectAppDefaultValues.appCaseMng,
          rightType: { code: rightTypeValue },
          appRoute: currentValues.appCaseMng.appRoute,
        },
        appStatus: currentValues.appStatus,
      });
    }
    prevRightType.current = rightTypeValue;
  }, [rightTypeValue, rightCodeList, appSeq, form]);

  const statusProgress = appStatusProgressLabel(
    useWatch({ name: "appStatus", control: form.control }) as
      | { code?: string; codeName?: string }
      | undefined,
  );

  const handleSaveClick = () => {
    form.handleSubmit(onSubmit, onError)();
  };

  const onSubmit = (values: OverseasDirectAppFormInput) => {
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
        const vaildData: OverseasDirectAppFormOutput = DirectAppSchema.parse(values);
        const { appStatus: _omitDirectAppStatus, ...savePayload } = vaildData;

        const param = {
          payload: savePayload as OverseasDirectAppFormOutput,
          rightType: rightTypeValue,
        };
        // @ts-ignore
        createOverseasDirectMutation.mutate(param, {
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
                  setValue("appSeq", newSeq);

                  // 신규 생성인 경우 상세 페이지로 이동 (모달이 아닐 때만)
                  if (!appSeq && !onSuccess) {
                    navigation(`/overseas/direct/detail/${newSeq}`);
                  } else {
                    // 기존 데이터 수정인 경우 폼 리셋 (필요 시 상세 재조회)
                    getOverseasDirectDetail(newSeq, rightTypeValue);
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

  const onError = (errors: any) => {
    console.log("Validation Failed:", errors);
    openAlert({
      className: "w-[400px]",
      message: "필수 값을 모두 입력해주세요.",
      confirmText: "확인",
    });
  };

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [
        DOMESTIC_APP_MNG.RIGHT_CATE,
        DOMESTIC_APP_SPECIFICELEMENT.GRADE,
        DOMESTIC_APP_MNG.APP_CATE,
        DOMESTIC_APP_MNG.CATE,
        DOMESTIC_APP_MNG.APP_KIND_CODE,
        DOMESTIC_APP_MNG.IP_PROC_TYPE,
      ],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        console.log("code list ", response);

        const codeDataList = response.data;

        const setupCodes = (codeKey: string, setter: (codes: any[]) => void) => {
          const codeList = getCodeList(codeKey, codeDataList);
          if (codeKey === DOMESTIC_APP_MNG.RIGHT_CATE) {
            const convertCodeList = codeList.filter(
              (code) =>
                code.dtlCd === "10" ||
                code.dtlCd === "20" ||
                code.dtlCd === "30" ||
                code.dtlCd === "40",
            );
            setter(mapToOptionNew(convertCodeList));
          } else {
            setter(mapToOptionNew(codeList));
          }
        };

        setupCodes(DOMESTIC_APP_MNG.APP_CATE, setAppCodeList);
        setupCodes(DOMESTIC_APP_MNG.CATE, setCateCodeList);
        setupCodes(DOMESTIC_APP_MNG.RIGHT_CATE, setRightCodeList);
        setupCodes(DOMESTIC_APP_SPECIFICELEMENT.GRADE, setGradeCodeList);
        setupCodes(DOMESTIC_APP_MNG.APP_KIND_CODE, setAppKindCodeList);
        setupCodes(DOMESTIC_APP_MNG.IP_PROC_TYPE, setIpProcCodeList);

        // 상세 조회 로직은 하단 useEffect로 분리됨
      },
    });
  }, []);

  const getOverseasDirectDetail = (overseasDirectSeq: string, rightTypeValue: string) => {
    const param = {
      overseasSeq: overseasDirectSeq,
      rightTypeName: getName(rightTypeValue).toLowerCase(),
    };
    getOverseasDirectMutation.mutate(param, {
      onSuccess: (response) => {
        setCurrentAppSeq(overseasDirectSeq);
        form.setValue("appSeq", overseasDirectSeq);
        // 상세 조회 응답에 appExtSeq가 없을 경우 기존 form의 appExtSeq 값을 유지
        form.reset({
          ...response.data,
          appSeq: overseasDirectSeq,
          appExtSeq: response.data.appExtSeq || form.getValues("appExtSeq"),
          appStatus: response.data.appStatus ?? { code: "", codeName: "" },
        });
      },
    });
  };

  useEffect(() => {
    const rt = searchParams.get("rightType");
    if (rt) {
      setValue("appCaseMng.rightType.code", rt);
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    getCommCodeNew();
  }, [getCommCodeNew]);

  // 상세 데이터 조회 독립 실행
  useEffect(() => {
    if (!isEmpty(appSeq)) {
      getOverseasDirectDetail(appSeq as string, searchParams.get("rightType") || rightTypeValue);
    } else {
      // 신규 등록일 때만 기본값 세팅
      if (tblSeq) form.setValue("appExtSeq", tblSeq as string);
    }
  }, [appSeq, tblSeq, rightTypeValue, searchParams]);



  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <PageTitleArea
            className="pb-2"
            title={title}
            progress={statusProgress}
          >
            {appSeq && (
              <Button
                size="h28"
                variant="outline"
                type="button"
                onClick={() => navigation(`/overseas/direct/detail/${appSeq}?type=${getName(rightTypeValue).toLowerCase()}`)}
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
              {overseasDirectRenderMap.defaultInfo(rightTypeValue, {
                rightCodeList,
                appCodeList,
                cateCodeList,
                appKindCodeList,
                ipProcCodeList,
                appSeq,
              })}

              {/* 출원 기본정보 */}
              {overseasDirectRenderMap.basicInfo(rightTypeValue)}
            </FlexBox>

            <FlexBox className="items-stretch">
              <FlexBox vertical>
                {/* 담당 정보 */}
                <DirectAppRepresentative />

                {/* 당사자 정보 */}
                {overseasDirectRenderMap.directlyInvolved(rightTypeValue)}

                {/* 명칭정보 */}
                <DirectAppAppellation />
              </FlexBox>

              <FlexBox vertical>
                {/* 명세서 구성요소 */}
                {overseasDirectRenderMap.statement(rightTypeValue, {
                  gradeCodeList,
                })}

                {/* 출원 전략설정 */}
                {overseasDirectRenderMap.strategy(rightTypeValue)}

                {overseasDirectRenderMap.products(rightTypeValue)}

                {/* 비고 */}
                <DirectAppNote />
              </FlexBox>

              <FlexBox vertical>
                {/* 출원 행정관리 */}
                {overseasDirectRenderMap.management(rightTypeValue)}

                {/* 출원 대표이미지 */}
                {overseasDirectRenderMap.sasido(rightTypeValue)}
              </FlexBox>

              <FlexBox vertical>
                {/* 등록·권리유지 관리 */}
                {overseasDirectRenderMap.maintenance(rightTypeValue)}
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </form>
      </FormProvider>

      {/* 탭 */}
      {currentAppSeq && (
        <CustomBottom
          type={"overseas"}
          tblSeq={currentAppSeq}
          rightType={form.getValues("appCaseMng.rightType.code")}
          appRoute={form.getValues("appCaseMng.appRoute.code")}
        />
      )}
    </>
  );
};

export default DirectAppForm;
