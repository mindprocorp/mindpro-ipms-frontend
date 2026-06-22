import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { FormProvider } from "react-hook-form";

import BasicDesignateCountry from "@pages/overseas/basic/_components/BasicDesignateCountry.tsx";
import BasicStrategy from "@pages/overseas/basic/_components/BasicStrategy.tsx";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import { DOMESTIC_APP_MNG, DOMESTIC_APP_SPECIFICELEMENT } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { isEmpty, mapToOptionNew } from "@shared/util/stringUtil.ts";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries.ts";
import BasicDefaultInfo from "@pages/overseas/basic/_components/BasicDefaultInfo.tsx";
import OverseasRepresentative from "@pages/overseas/basic/_components/BasicRepresentative.tsx";
import OverseasBasicDirectlyInvolved from "@pages/overseas/basic/_components/BasicDirectlyInvolved.tsx";
import BasicAppellation from "@pages/overseas/basic/_components/BasicAppellation.tsx";
import BasicProducts from "@pages/overseas/basic/_components/BasicProducts.tsx";
import BasicStatement from "@pages/overseas/basic/_components/BasicStatement.tsx";
import BasicNote from "@pages/overseas/basic/_components/BasicNote.tsx";
import CustomBottom from "@pages/domestic/detail/_components/CustomBottom.tsx";
import { useOverseasBasicForm } from "@shared/schema/overseas/form.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { overseasBasicQueries } from "@shared/query/overseas/overseasBasicQueries.ts";
import {
  BasicSchema,
  type OverseasBasicFormInput,
  type OverseasBasicFormOutput,
} from "@shared/schema/overseas/basicSchema.ts";
import BasicSasido from "@pages/overseas/basic/_components/BasicSasido.tsx";
import { fillFormWithDummyData } from "@shared/util/formFillUtil";

const BasicForm = () => {
  const { overseasSeq } = useParams<{ overseasSeq: string | undefined }>();
  const [searchParams] = useSearchParams();
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const createOverseasBasicMutation = useMutation(overseasBasicQueries.createOverseasBasic());
  const getOverseasBasicMutation = useMutation(overseasBasicQueries.getOverseasBasicDetail());
  const navigation = useNavigate();
  const form = useOverseasBasicForm();
  const [rightCodeList, setRightCodeList] = useState<CodeSelectOption[]>([]);
  const [gradeCodeList, setGradeCodeList] = useState<CodeSelectOption[]>([]);
  const [appCodeList, setAppCodeList] = useState<CodeSelectOption[]>([]);
  const [cateCodeList, setCateCodeList] = useState<CodeSelectOption[]>([]);
  const [appKindCodeList, setAppKindCodeList] = useState<CodeSelectOption[]>([]);
  const { openAlert } = useAlertStore();

  const [currentSeq, setCurrentSeq] = useState<string | undefined>(overseasSeq);

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

  const onSubmit = (values: OverseasBasicFormInput, onSuccessCallback?: (newSeq: string) => void, isProceeding: boolean = false) => {
    const rightTypeValue = form.getValues("appCaseMng.rightType.code");
    if (!rightTypeValue && !onSuccessCallback) {
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
        const submitData = { ...values, appExtSeq: currentSeq };
        const vaildData: OverseasBasicFormOutput = BasicSchema.parse(submitData);

        createOverseasBasicMutation.mutate(vaildData, {
          onSuccess: (response) => {
            console.log("[성공]", response);
            const newSeq = response.data;

            if (newSeq) {
              setCurrentSeq(newSeq);
            }

            // 완료 알럿으로 교체
            openAlert({
              className: "w-[400px]",
              message: "저장완료하였습니다",
              confirmText: "확인",
              onConfirm: () => {
                useAlertStore.getState().close();
                if (onSuccessCallback && newSeq) {
                  onSuccessCallback(newSeq);
                } else if (newSeq) {
                  // 신규 생성인 경우 상세 페이지로 이동
                  if (!overseasSeq) {
                    navigation(`/overseas/basic/detail/${newSeq}`);
                  } else {
                    getOverseasDetail(newSeq);
                  }
                }
              },
            });
          },
          onError: () => {
            openAlert({
              className: "w-[400px]",
              message: "저장 중 오류가 발생했습니다.",
              confirmText: "확인",
            });
          }
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

    // 항상 확인 알럿 표시
    openAlert({
      className: "w-[400px]",
      message: overseasSeq 
        ? "기본정보를 수정하시겠습니까?" 
        : (isProceeding ? "저장 후 진행하시겠습니까?" : "저장하시겠습니까?"),
      confirmText: "확인",
      cancelText: "취소",
      onCancel: () => useAlertStore.getState().close(),
      onConfirm: () => {
        useAlertStore.getState().close();
        performSave();
      },
    });
  };

  const handleSaveAndProceed = async (tabValue: string, extra?: string) => {
    const isValid = await form.trigger();
    if (isValid) {
      onSubmit(form.getValues(), (newSeq) => {
        const rightTypeValue = (form.getValues("appCaseMng.rightType.code") || "").toLowerCase();
        let url = `/overseas/basic/detail/${newSeq}?type=${rightTypeValue}&openTab=${tabValue}`;
        if (extra) {
          url += `&typeGb=${extra}`;
        }
        navigation(url, { replace: true });
      }, true);
    } else {
      openAlert({
        className: "w-[400px]",
        message: "필수 값을 모두 입력해주세요.",
        confirmText: "확인",
      });
    }
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
  };

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [
        DOMESTIC_APP_MNG.RIGHT_CATE,
        DOMESTIC_APP_SPECIFICELEMENT.GRADE,
        DOMESTIC_APP_MNG.APP_CATE,
        DOMESTIC_APP_MNG.CATE,
        DOMESTIC_APP_MNG.APP_KIND_CODE,
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

        if (!isEmpty(overseasSeq)) {
          console.log("상세 조회를 하자");
          getOverseasDetail(overseasSeq as string);

        }
      },
    });
  }, [overseasSeq]);

  const getOverseasDetail = (targetSeq: string) => {
    getOverseasBasicMutation.mutate(targetSeq, {
      onSuccess: (response) => {
        form.reset(response.data);
      },
    });
  };

  useEffect(() => {
    getCommCodeNew();
  }, [getCommCodeNew]);

  useEffect(() => {
    if (overseasSeq) {
      setCurrentSeq(overseasSeq);
    }
  }, [overseasSeq]);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <PageTitleArea
            className="sticky top-0 z-10 bg-white pb-2"
            title="해외기본 신규·상세"
          >
            <Button size="h28" variant="blue" type="button" onClick={handleSaveClick}>
              <Icons.CloudUpload />
              저장
            </Button>

            <Button
              size="h28"
              type="button"
              onClick={() => {
                openAlert({
                  className: "w-[400px]",
                  message: <>작성내용은 저장되지 않습니다.<br />목록으로 이동하시겠습니까?</>,
                  confirmText: "확인",
                  cancelText: "취소",
                  onCancel: () => useAlertStore.getState().close(),
                  onConfirm: () => navigation("/overseas/basic/list"),
                });
              }}
            >
              목록
            </Button>
          </PageTitleArea>
          <FlexBox vertical className="gap-3">
            <BasicDefaultInfo
              rightCodeList={rightCodeList}
              appCodeList={appCodeList}
              cateCodeList={cateCodeList}
              appKindCodeList={appKindCodeList}
            />

            <FlexBox className="items-stretch gap-3">
              <FlexBox vertical className="flex-1 min-w-0 gap-3">
                {/* 담당 정보 */}
                <OverseasRepresentative />
                {/* 당사자 정보 */}
                <OverseasBasicDirectlyInvolved />
              </FlexBox>

              <FlexBox vertical className="flex-1 min-w-0 gap-3">
                {/* 명칭정보 */}
                <BasicAppellation />
                {/* 물품류 */}
                <BasicProducts />
                {/* 명세서 구성요소 (맨 아래로) */}
                <BasicStatement gradeCodeList={gradeCodeList} />
              </FlexBox>

              <FlexBox vertical className="flex-1 min-w-0 gap-3">
                {/* 출원 전략설정 */}
                <BasicStrategy />
                {/* 대표도-이미지 */}
                <BasicSasido />
                {/* 비고 */}
                <BasicNote />
              </FlexBox>

              <FlexBox vertical className="flex-1 min-w-0 gap-3">
                {/* 지정국가 */}
                <BasicDesignateCountry />
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </form>
      </FormProvider>

      {/* 탭 */}
      <CustomBottom 
        type={"basic"} 
        tblSeq={currentSeq || ""} 
        rightType={"basic"} 
        onSaveAndProceed={handleSaveAndProceed}
      />
    </>
  );
};

export default BasicForm;
