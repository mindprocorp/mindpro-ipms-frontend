import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { FormProvider } from "react-hook-form";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Representative from "@pages/domestic/detail/_components/common/Representative.tsx";
import { useMutation } from "@tanstack/react-query";
import { domesticDetailQueries } from "@shared/query/domestic/queries.ts";
import {
  type DomesticFormInput,
  type DomesticFormOutput,
  DomesticSchema,
} from "@shared/schema/domestic/domesticSchema.ts";
import { useDomesticForm } from "@shared/schema/domestic/form.ts";
import { commonQueries } from "@shared/query/common/queries.ts";
import { type CodeRequestTypeNew, type CodeSelectOption } from "@shared/api/common/commApi.ts";
import {
  DOMESTIC_APP_BASE_INFO,
  DOMESTIC_APP_MAINTENANCE,
  DOMESTIC_APP_MANAGERMENT_INFO,
  DOMESTIC_APP_MNG,
  DOMESTIC_APP_SPECIFICELEMENT,
} from "@shared/enum/comCodeType.ts";
import { isEmpty, mapToOptionNew } from "@shared/util/stringUtil.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import domesticRenderMap from "@pages/domestic/detail/child/DynamicCompRender.tsx";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { getName, RIGHT_TYPE } from "@shared/enum/domesticType.ts";
import CustomBottom from "@pages/domestic/detail/_components/CustomBottom.tsx";
import Summary from "./_components/summary/Summary";
import { formatObjectDates, stripObjectDates } from "@shared/util/formatUtil";

const DomesticFormNew = () => {
  const { domesticSeq } = useParams<{ domesticSeq: string | undefined }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigation = useNavigate();
  const createMutation = useMutation(domesticDetailQueries.createDomestic());
  const getDomesticDetailMutation = useMutation(domesticDetailQueries.getDomesticDetail());
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const form = useDomesticForm();
  const [rightCodeList, setRightCodeList] = useState<CodeSelectOption[]>([]);
  const [gradeCodeList, setGradeCodeList] = useState<CodeSelectOption[]>([]);
  const [appCodeList, setAppCodeList] = useState<CodeSelectOption[]>([]);
  const [cateCodeList, setCateCodeList] = useState<CodeSelectOption[]>([]);
  const [appLangCodeList, setAppLangCodeList] = useState<CodeSelectOption[]>([]);
  const [appKindCodeList, setAppKindCodeList] = useState<CodeSelectOption[]>([]);
  const [discountRatioCodeList, setDiscountRatioCodeList] = useState<CodeSelectOption[]>([]);
  const [yearDiscountRatioCodeList, setYearDiscountRatioCodeList] = useState<CodeSelectOption[]>(
    [],
  );
  const [foreignAppTiming, setForeignAppTiming] = useState<CodeSelectOption[]>([]);
  const [title, setTitle] = useState<string>("");
  const [bottomTabActice, setBottomTabActice] = useState<string>("DEAD_LINE");
  const { openAlert } = useAlertStore();
  const { watch, resetField, clearErrors, setValue } = form;
  const isFirstRender = useRef(true);
  const isResetting = useRef(false);
  const [currentSeq, setCurrentSeq] = useState<string | undefined>(domesticSeq);

  const onSubmit = async (values: DomesticFormInput) => {
    // 1. ZodResolver가 이미 검증을 수행하지만, 다시 한번 트리거하여 화면에 에러(빨간 글씨)를 확실히 표시함
    const isValid = await form.trigger();
    console.log("Validation Result (trigger):", isValid);
    console.log("Current Form Errors:", form.formState.errors);

    if (!isValid) {
      openAlert({
        className: "w-[400px]",
        message: "필수값을 입력해주세요",
        confirmText: "확인",
      });
      return;
    }

    try {
      const vaildData: DomesticFormOutput = DomesticSchema.parse(values);
      const cleanData = stripObjectDates(vaildData);
      const modeText = "저장";

      openAlert({
        className: "w-[400px]",
        message: `${modeText}하시겠습니까?`,
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          const requestData = {
            payload: cleanData,
            rightType: vaildData.appCaseMng.rightType.code,
          };
          createMutation.mutate(requestData, {
            onSuccess: (response) => {
              console.log("[성공]", response);
              openAlert({
                className: "w-[400px]",
                message: `${modeText}완료하였습니다`,
                confirmText: "확인",
                onConfirm: () => {
                  const data = response?.data;
                  const newSeq = data?.appSeq || data?.domesticSeq || data?.seq || data?.masterSeq || (typeof data === 'string' ? data : "");
                  const rightType = vaildData.appCaseMng.rightType.code;
                  const typeName = getName(rightType).toLowerCase();

                  if (newSeq && newSeq !== "undefined") {
                    setCurrentSeq(newSeq);
                    // navigation(`/domestic/detail/${newSeq}?type=${typeName}`, { replace: true });

                    // 저장 후 데이터 재조회하여 폼 동기화
                    if (newSeq && newSeq !== "undefined" && typeName) {
                      getDomesticDetailMutation.mutate({
                        domesticSeq: newSeq,
                        rightType: typeName
                      }, {
                        onSuccess: (res) => {
                          isResetting.current = true;
                          form.reset(res.data);
                        }
                      });
                    }
                  } else {
                    // navigation("/domestic/list");
                  }
                  useAlertStore.getState().close();
                },
              });
            },
          });
        },
      });
    } catch (error) {
      console.error("Zod validation failed in onSubmit:", error);
      // 검증 실패 시 아무것도 하지 않고 리턴 (이미 trigger에 의해 빨간 글씨가 나옴)
      return;
    }
  };

  const handleSaveAndProceed = async (tabValue: string) => {
    // 1. trigger()를 통해 필드 검증을 수행하고, 화면에 빨간 글씨(에러)를 노출함
    const isValid = await form.trigger();
    if (!isValid) {
      // 검증 실패 시 추가 알럿 없이 그대로 종료 (사용자는 빨간 글씨를 보게 됨)
      return;
    }

    openAlert({
      className: "w-[400px]",
      message: "저장 후 진행하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        const values = form.getValues();
        try {
          const vaildData: DomesticFormOutput = DomesticSchema.parse(values);
          const cleanData = stripObjectDates(vaildData);
          const requestData = {
            payload: cleanData,
            rightType: vaildData.appCaseMng.rightType.code,
          };

          createMutation.mutate(requestData, {
            onSuccess: (response) => {
              const newSeq = response.data.domesticSeq;
              const rightType = vaildData.appCaseMng.rightType.code;
              const typeName = getName(rightType).toLowerCase();
              navigation(`/domestic/detail/${newSeq}?type=${typeName}&openTab=${tabValue}`, { replace: true });
            },
            onError: (error) => {
              console.error("[저장 실패]", error);
              openAlert({
                className: "w-[400px]",
                message: "저장에 실패하였습니다",
                confirmText: "확인",
              });
            },
          });
        } catch (error) {
          console.error("Validation failed during handleSaveAndProceed:", error);
        }
      },
    });
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
  };

  const getDomesticDetail = (domesticSeq: string, rightType: string) => {
    const requestData = {
      domesticSeq: domesticSeq,
      rightType: getName(rightType).toLowerCase(),
    };
    getDomesticDetailMutation.mutate(requestData, {
      onSuccess: (response) => {
        isResetting.current = true;
        form.reset({ ...formatObjectDates(response.data), appSeq: domesticSeq });
      },
    });
  };

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [
        DOMESTIC_APP_MNG.RIGHT_CATE,
        DOMESTIC_APP_SPECIFICELEMENT.GRADE,
        DOMESTIC_APP_MNG.APP_CATE,
        DOMESTIC_APP_MNG.CATE,
        DOMESTIC_APP_BASE_INFO.APP_LANG,
        DOMESTIC_APP_MNG.APP_KIND_CODE,
        DOMESTIC_APP_MAINTENANCE.DIS_COUNT_RATIO,
        DOMESTIC_APP_MAINTENANCE.YEAR_DISCOUNT_RATIO,
        DOMESTIC_APP_MANAGERMENT_INFO.FOREIGN_APP_TIMING,
      ],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        console.log("code list ", response);

        const codeDataList = response.data;

        const setupCodes = (codeKey: string, setter: (codes: any[]) => void) => {
          const codeList = getCodeList(codeKey, codeDataList);
          if (codeKey === DOMESTIC_APP_MNG.RIGHT_CATE) {
            const convertCodeList = codeList.filter((code) => code.dtlCd === "10"
            || code.dtlCd === "20" || code.dtlCd === "30" || code.dtlCd === "40");
            setter(mapToOptionNew(convertCodeList));
          } else {
            setter(mapToOptionNew(codeList));
          }
        };
        setupCodes(DOMESTIC_APP_MNG.APP_CATE, setAppCodeList);
        setCateCodeList(
          mapToOptionNew(getCodeList(DOMESTIC_APP_MNG.CATE, codeDataList).filter(c => c.dtlCd === "10")),
        );
        setupCodes(DOMESTIC_APP_MNG.RIGHT_CATE, setRightCodeList);
        setupCodes(DOMESTIC_APP_SPECIFICELEMENT.GRADE, setGradeCodeList);
        setupCodes(DOMESTIC_APP_BASE_INFO.APP_LANG, setAppLangCodeList);
        setupCodes(DOMESTIC_APP_MNG.APP_KIND_CODE, setAppKindCodeList);
        setupCodes(DOMESTIC_APP_MAINTENANCE.DIS_COUNT_RATIO, setDiscountRatioCodeList);
        setupCodes(DOMESTIC_APP_MAINTENANCE.YEAR_DISCOUNT_RATIO, setYearDiscountRatioCodeList);
        setupCodes(DOMESTIC_APP_MANAGERMENT_INFO.FOREIGN_APP_TIMING, setForeignAppTiming);

        if (!isEmpty(domesticSeq)) {
          console.log("상세 조회를 하자");
          const type = searchParams.get("type") as string;
          let rightType = "";
          if (type === RIGHT_TYPE.PATENT.name.toLowerCase()) {
            rightType = RIGHT_TYPE.PATENT.code;
          } else if (type === RIGHT_TYPE.PRACTICE.name.toLowerCase()) {
            rightType = RIGHT_TYPE.PRACTICE.code;
          } else if (type === RIGHT_TYPE.DESIGN.name.toLowerCase()) {
            rightType = RIGHT_TYPE.DESIGN.code;
          } else if (type === RIGHT_TYPE.TRADE.name.toLowerCase()) {
            rightType = RIGHT_TYPE.TRADE.code;
          }
          getDomesticDetail(domesticSeq as string, rightType);
        }
      },
    });
  }, [domesticSeq]);

  useEffect(() => {
    getCommCodeNew();
    setValue("multiViewDrawingFile", undefined);
  }, [getCommCodeNew]);

  const rightTypeValue = watch("appCaseMng.rightType.code");

  useEffect(() => {
    setTitle(
      rightTypeValue
        ? (`${rightCodeList.find((item) => item.value === rightTypeValue)?.label}출원` as string)
        : "",
    );
  }, [rightTypeValue, rightCodeList]);

  useEffect(() => {
    if (isResetting.current) {
      isResetting.current = false;
      return;
    }
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setValue("appCaseMng.appCategory", { code: "", codeName: "" });
    clearErrors();
  }, [rightTypeValue]);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <PageTitleArea className="pb-2" title={title}>
            <Button size="h28" variant="blue" type="submit">
              <Icons.CloudUpload />
              저장
            </Button>

            <Button size="h28" onClick={() => navigation("/domestic/list")}>
              목록
            </Button>
          </PageTitleArea>
          <FlexBox vertical>
            <FlexBox vertical>
              <Summary />
              {/* 출원사건관리 */}
              {domesticRenderMap.defaultInfo(rightTypeValue, {
                rightCodeList,
                appCodeList,
                cateCodeList,
                appKindCodeList,
              })}

              {/* 출원 기본정보 */}
              {domesticRenderMap.basicInfo(rightTypeValue, { appLangCodeList })}
            </FlexBox>

            <FlexBox className="items-stretch">
              <FlexBox vertical>
                {/* 담당 정보 */}
                <Representative />

                {/* 당사자 정보 */}
                {domesticRenderMap.directlyInvolved(rightTypeValue)}

                {/* 명칭정보 */}
                {domesticRenderMap.appellation(rightTypeValue)}

                {/* 물품류 */}
                {rightTypeValue === RIGHT_TYPE.TRADE.code &&
                  domesticRenderMap.products(rightTypeValue)}
              </FlexBox>

              <FlexBox vertical>
                {/* 명세서 구성요소 */}
                {domesticRenderMap.statement(rightTypeValue, { gradeCodeList })}

                {/* 출원 전략설정 */}
                {domesticRenderMap.strategy(rightTypeValue, { foreignAppTiming })}

                {/* 물품류 */}
                {rightTypeValue === RIGHT_TYPE.DESIGN.code &&
                  domesticRenderMap.products(rightTypeValue)}

                {/* 사시드 */}
                {domesticRenderMap.sasido(rightTypeValue)}
              </FlexBox>

              <FlexBox vertical>
                {/* 출원 행정관리 */}
                {domesticRenderMap.management(rightTypeValue)}
              </FlexBox>

              <FlexBox vertical>
                {/* 등록·권리유지 관리 */}
                {domesticRenderMap.maintenance(rightTypeValue, {
                  discountRatioCodeList,
                  yearDiscountRatioCodeList,
                })}
              </FlexBox>
            </FlexBox>

            <FlexBox className="w-full [&>div]:w-full">
              {/* 비고 */}
              {domesticRenderMap.note(rightTypeValue)}
            </FlexBox>
          </FlexBox>
        </form>
      </FormProvider>

      {/* 탭 */}
      <CustomBottom
        type={"domestic"}
        rightType={rightTypeValue}
        tblSeq={currentSeq}
        onSaveAndProceed={handleSaveAndProceed}
      />
    </>
  );
};

export default DomesticFormNew;
