import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { FormProvider, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Representative from "@pages/domestic/detail/_components/common/Representative.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { domesticDetailQueries } from "@shared/query/domestic/queries.ts";
import {
  type DomesticFormInput,
  type DomesticFormOutput,
  DomesticSchema
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
import type { DomesticDetailResponse } from "@shared/api/domestic/domesticApi.ts";
import CustomBottom from "@pages/domestic/detail/_components/CustomBottom.tsx";
import { fillFormWithDummyData } from "@shared/util/formFillUtil";
import { formatObjectDates, stripObjectFormattedFields } from "@shared/util/formatUtil";
import { z } from "zod";

const DomesticForm = () => {
  const { domesticSeq } = useParams<{ domesticSeq: string | undefined }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigation = useNavigate();
  const queryClient = useQueryClient();
  const createMutation = useMutation(domesticDetailQueries.createDomestic());
  const getDomesticDetailMutation = useMutation(domesticDetailQueries.getDomesticDetail());
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const form = useDomesticForm();
  const [rightCodeList, setRightCodeList] = useState<CodeSelectOption[]>([]);
  const [gradeCodeList, setGradeCodeList] = useState<CodeSelectOption[]>([]);
  const [appCodeList, setAppCodeList] = useState<CodeSelectOption[]>([]);
  const [designAppCodeList, setDesignAppCodeList] = useState<CodeSelectOption[]>([]);
  const [tradeMarkAppCodeList, setTradeMarkAppCodeList] = useState<CodeSelectOption[]>([]);
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

  useEffect(() => {
    setCurrentSeq(domesticSeq);
  }, [domesticSeq]);

  const onSubmit = async (values: DomesticFormInput, callback?: (seq: string) => void) => {
    // 1. 필수값 검증 선행 (알림창 띄우기 전)
    const isValid = await form.trigger();
    if (!isValid) {
      openAlert({
        className: "w-[400px]",
        message: "필수값을 입력해주세요",
        confirmText: "확인",
      });
      return;
    }

    try {
      // 2. 스키마 파싱 및 데이터 정제
      const vaildData: DomesticFormOutput = DomesticSchema.parse(values);
      const cleanData = stripObjectFormattedFields(vaildData);
      delete (cleanData as { appStatus?: unknown }).appStatus;

      // 디자인의 경우 designDescriptionInfo -> designDescription (백엔드 요청 필드명) 매핑
      if (vaildData.appCaseMng.rightType.code === RIGHT_TYPE.DESIGN.code && cleanData.designDescriptionInfo) {
        (cleanData as any).designDescription = cleanData.designDescriptionInfo;
        delete cleanData.designDescriptionInfo;
      }

      const requestData = {
        payload: cleanData,
        rightType: vaildData.appCaseMng.rightType.code,
      };

      // 3. 검증 성공 시에만 확인 알림창 오픈
      openAlert({
        className: "w-[400px]",
        message: "저장하시겠습니까?",
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          createMutation.mutate(requestData, {
            onSuccess: (response: any) => {
              console.log("[성공] Response Full Object:", JSON.stringify(response, null, 2));
              
              const data = response?.data;
              let newSeq = data?.appSeq || data?.domesticSeq || data?.seq || data?.masterSeq;
              
              if (!newSeq && typeof data === 'string' && data.length > 5) {
                newSeq = data;
              }

              if (!newSeq) {
                const searchId = (obj: any): string | null => {
                  if (!obj) return null;
                  if (typeof obj === 'string' && (obj.startsWith('APP') || obj.startsWith('DOM'))) return obj;
                  if (typeof obj === 'object') {
                    for (const key in obj) {
                      const found = searchId(obj[key]);
                      if (found) return found;
                    }
                  }
                  return null;
                };
                newSeq = searchId(response);
              }

              newSeq = newSeq || domesticSeq;
              
              if (newSeq && newSeq !== "undefined") {
                setCurrentSeq(newSeq);
                navigation(`/domestic/detail/${newSeq}?type=${getName(rightTypeValue).toLowerCase()}`, { replace: true });
                // getDomesticDetail(newSeq, vaildData.appCaseMng.rightType.code);
              }

              queryClient.invalidateQueries({ queryKey: ["domesticList"] });
              useAlertStore.getState().close();

              setTimeout(() => {
                openAlert({
                  className: "w-[400px]",
                  message: "저장완료하였습니다",
                  confirmText: "확인",
                  showCancel: false,
                  onConfirm: () => {
                    useAlertStore.getState().close();
                    if (callback && typeof callback === 'function') {
                      callback(newSeq);
                    } else if (newSeq && newSeq !== "undefined") {
                      navigation(`/domestic/detail/${newSeq}?type=${getName(rightTypeValue).toLowerCase()}`, { replace: true });
                      getDomesticDetail(newSeq, vaildData.appCaseMng.rightType.code);
                    }
                  },
                });
              }, 100);
            },
            onError: (err: any) => {
              console.error("[저장 실패]", err);
            }
          });
        },
      });
    } catch (error) {
      console.error("[Zod or Sync Error]", error);
      if (error instanceof z.ZodError) {
        // 이미 trigger()에서 걸러지겠지만, 혹시 모를 파싱 에러 대응
        const firstError = error.issues[0];
        openAlert({
          title: "입력 확인",
          message: `${firstError.path.join(".")} : ${firstError.message}`,
          confirmText: "확인",
        });
      }
    }
  };

  const handleSaveAndProceed = (tabValue: string, extra?: string) => {
    const values = form.getValues();
    onSubmit(values, (newSeq) => {
      let url = `/domestic/detail/${newSeq}?type=${getName(rightTypeValue).toLowerCase()}&openTab=${tabValue}`;
      if (extra) {
        if (tabValue === "CLAIM") {
          url += `&billTypeGb=${extra}`;
        } else {
          url += `&typeGb=${extra}`;
        }
      }
      navigation(url, { replace: true });
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
        const data = response.data as DomesticDetailResponse;
        // 디자인의 경우 claimSummaryInfo -> designDescriptionInfo 매핑
        if (rightType === RIGHT_TYPE.DESIGN.code && data.claimSummaryInfo) {
          data.designDescriptionInfo = {
            designDescription: data.claimSummaryInfo.designDescription,
            designSummary: data.claimSummaryInfo.designSummary,
          };
        }


        form.reset({
          ...formatObjectDates(data),
          appSeq: domesticSeq,
          appStatus: data.appStatus ?? { code: "", codeName: "" },
        });
      },
    });
  };

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [
        DOMESTIC_APP_MNG.RIGHT_CATE,
        DOMESTIC_APP_SPECIFICELEMENT.GRADE,
        DOMESTIC_APP_MNG.APP_CATE,
        DOMESTIC_APP_MNG.DESIGN_APP_CATE,
        DOMESTIC_APP_MNG.TRADE_APP_CATE,
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
        setupCodes(DOMESTIC_APP_MNG.DESIGN_APP_CATE, setDesignAppCodeList);
        setupCodes(DOMESTIC_APP_MNG.TRADE_APP_CATE, setTradeMarkAppCodeList);
        setupCodes(DOMESTIC_APP_MNG.CATE, setCateCodeList);
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
            rightType = RIGHT_TYPE.PATENT.code;
          } else if (type === RIGHT_TYPE.DESIGN.name.toLowerCase()) {
            rightType = RIGHT_TYPE.DESIGN.code;
          } else if (type === RIGHT_TYPE.TRADE.name.toLowerCase()) {
            rightType = RIGHT_TYPE.TRADE.code;
          }
          if (rightType) {
            getDomesticDetail(domesticSeq as string, rightType);
          } else {
             console.warn("rightType을 결정할 수 없어 상세 조회를 건너뜁니다. (URL의 type 파라미터 확인 필요)");
          }
        }
      },
    });
  }, [domesticSeq]);

  useEffect(() => {
    getCommCodeNew();
    setValue("multiViewDrawingFile", undefined);

    // 신규 등록 시 기본값 강제 설정
    if (!domesticSeq) {
      setValue("appCaseMng.rightType", { code: "10", codeName: "특허" });
    }
  }, [getCommCodeNew, domesticSeq, setValue]);

  const rightTypeValue = useWatch({
    name: "appCaseMng.rightType.code",
    control: form.control,
  }) ?? "";

  const appStatusWatch = useWatch({
    name: "appStatus",
    control: form.control,
  }) as { code?: string; codeName?: string } | undefined;

  const namePart =
    typeof appStatusWatch?.codeName === "string" ? appStatusWatch.codeName.trim() : "";
  const codePart = typeof appStatusWatch?.code === "string" ? appStatusWatch.code.trim() : "";
  const statusProgress: string | undefined = namePart || codePart || undefined;

  // 타이틀 업데이트 (rightCodeList 로드 후에도 반영)
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
    
    // 권리 변경 시 당사자 정보 초기화
    setValue("appCounterPartyInfo.clientInfo", [{ counterPartySeq: "", counterPartyName: "" }]);
    setValue("appCounterPartyInfo.clientContactInfo", { userSeq: "", userName: "" });
    setValue("appCounterPartyInfo.applicantInfo", [{ counterPartySeq: "", counterPartyName: "" }]);
    setValue("appCounterPartyInfo.inventorInfo", { userSeq: "", userName: "" });
    setValue("appCounterPartyInfo.regMgrInfo", [{ counterPartySeq: "", counterPartyName: "" }]);

    clearErrors();
  }, [rightTypeValue]);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit((values) => onSubmit(values), onError)}>
          <PageTitleArea className="pb-2" title={title} progress={statusProgress}>
            <Button size="h28" variant="blue" type="submit">
              <Icons.CloudUpload />
              저장
            </Button>

{/* {import.meta.env.MODE !== "prod" && (
            <Button
              type="button"
              variant="outline-pink"
              size="h28"
              onClick={() => fillFormWithDummyData(form.setValue, form.getValues(), { workType: "DOMESTIC" })}
            >
              임시값 채우기
            </Button>
          )} */}

            <Button size="h28" onClick={() => navigation("/domestic/list")}>
              목록
            </Button>
          </PageTitleArea>
          <FlexBox vertical>
            <FlexBox vertical>
              {/* 출원사건관리 */}
              {domesticRenderMap.defaultInfo(rightTypeValue, {
                rightCodeList,
                appCodeList,
                designAppCodeList,
                tradeMarkAppCodeList,
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
                {domesticRenderMap.directlyInvolved(rightTypeValue )}

                {/* 명칭정보 */}
                {domesticRenderMap.appellation(rightTypeValue)}

                {/* 요약/청구 */}
                {domesticRenderMap.hardSummary(rightTypeValue)}

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

export default DomesticForm;
export class FormInput {}
