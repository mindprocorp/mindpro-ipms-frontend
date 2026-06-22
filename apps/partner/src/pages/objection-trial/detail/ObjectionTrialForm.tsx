import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import CustomBottom from "@pages/domestic/detail/_components/CustomBottom";
import { FormProvider, type FieldErrors } from "react-hook-form";
import { useEffect, useRef, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Appellation from "./_components/Appellation";
import DirectlyInvolved from "./_components/DirectlyInvolved";
import Note from "./_components/Note";
import Representative from "./_components/Representative";
import DefaultInfo from "./_components/DefaultInfo";
import Products from "./_components/Products";
import BasicInfo from "./_components/BasicInfo";
import ClaimantRespondent from "./_components/ClaimantRespondent";
import Maintenance from "./_components/Maintenance";
import { objectionTrialQueries } from "@shared/query/objection-trial/queries";
import { type ObjectionTrialFormInput } from "@shared/schema/objection-trial/objectionTrialSchema.ts";
import { useObjectionTrialForm } from "@shared/schema/objection-trial/form.ts";
import { commonQueries } from "@shared/query/common/queries";
import { type CodeRequestTypeNew, type CodeSelectOption } from "@shared/api/common/commApi";
import { OBJECTION_TRIAL_CASE_MNG } from "@shared/enum/comCodeType";
import { getCodeList } from "@shared/util/codeUtils";
import { mapToOptionNew } from "@shared/util/stringUtil";
import { useAlertStore } from "@shared/store/useAlertStore";
import type { FileItem } from "@shared/api/objection-trial/objectionTrialApi";
import { fillFormWithDummyData } from "@shared/util/formFillUtil";
import { formatObjectDates, stripObjectFormattedFields } from "@shared/util/formatUtil";

const ObjectionTrial = () => {
  const navigate = useNavigate();
  const { conflictSeq: urlConflictSeq } = useParams<{ conflictSeq: string }>();
  const { openAlert } = useAlertStore();

  //   수정: URL 파라미터가 있으면 수정 모드
  const isEditMode = !!urlConflictSeq;

  const appTrademarkFileRef = useRef<File | null>(null);
  const citedTrademarkFileRef = useRef<File | null>(null);
  const [cftFileList, setCftFileList] = useState<{ fileList: FileItem[] } | null>(null);

  const form = useObjectionTrialForm();

  const setImageFiles = (files: {
    appTrademarkFile?: File | null;
    citedTrademarkFile?: File | null;
  }) => {
    if (files.appTrademarkFile !== undefined) appTrademarkFileRef.current = files.appTrademarkFile;
    if (files.citedTrademarkFile !== undefined) citedTrademarkFileRef.current = files.citedTrademarkFile;
  };

  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const getDetailMutation = useMutation(objectionTrialQueries.detail());

  //   [핵심 수정] 백엔드 컨트롤러가 POST 하나로 처리하므로 createMutation만 사용
  const saveMutation = useMutation(objectionTrialQueries.create());

  const onSubmit = (values: ObjectionTrialFormInput) => {
    openAlert({
      className: "w-[400px]",
      message: isEditMode ? "수정하시겠습니까?" : "저장하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onCancel: () => useAlertStore.getState().close(),
      onConfirm: () => {
        //   payload 구성: conflictSeq가 있으면 백엔드에서 자동으로 Update 처리
        const cleanValues = stripObjectFormattedFields(values);
        const payload = {
          data: {
            ...cleanValues,
            conflictSeq: urlConflictSeq || values.conflictSeq
          },
          appTrademarkFile: appTrademarkFileRef.current,
          citedTrademarkFile: citedTrademarkFileRef.current,
        };

        //   PUT 에러 방지를 위해 항상 POST(saveMutation) 호출
        saveMutation.mutate(payload, {
          onSuccess: () => {
            openAlert({
              className: "w-[400px]",
              message: isEditMode ? "수정완료하였습니다" : "저장완료하였습니다",
              confirmText: "확인",
              onConfirm: () => navigate("/objection-trial/list"),
            });
          },
          onError: (error) => {
            console.error("처리 실패:", error);
            openAlert({
              className: "w-[400px]",
              message: isEditMode ? "수정에 실패하였습니다" : "저장에 실패하였습니다",
              confirmText: "확인",
            });
          },
        });
      },
    });
  };

  const handleSaveAndProceed = async (tabValue: string) => {
    const isValid = await form.trigger();
    if (!isValid) {
      openAlert({
        className: "w-[400px]",
        message: "필수값을 입력해주세요.",
        confirmText: "확인",
      });
      return;
    }

    openAlert({
      className: "w-[400px]",
      message: "저장 후 진행하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onCancel: () => useAlertStore.getState().close(),
      onConfirm: () => {
        const values = form.getValues();
        const cleanValues = stripObjectFormattedFields(values);
        const payload = {
          data: cleanValues,
          appTrademarkFile: appTrademarkFileRef.current,
          citedTrademarkFile: citedTrademarkFileRef.current,
        };

        saveMutation.mutate(payload, {
          onSuccess: (response) => {
            const newSeq = response.data.conflictSeq;
            navigate(`/objection-trial/detail/${newSeq}?openTab=${tabValue}`, { replace: true });
          },
          onError: (error) => {
            console.error("처리 실패:", error);
            openAlert({
              className: "w-[400px]",
              message: "저장에 실패하였습니다",
              confirmText: "확인",
            });
          },
        });
      },
    });
  };

  const onError = (errors: FieldErrors<ObjectionTrialFormInput>) => {
    console.error("Validation errors:", errors);
  };

  // 공통코드 state
  const [pendingCourtCodeList, setPendingCourtCodeList] = useState<CodeSelectOption[]>([]);
  const [agentCategoryCodeList, setAgentCategoryCodeList] = useState<CodeSelectOption[]>([]);
  const [caseCategoryCodeList, setCaseCategoryCodeList] = useState<CodeSelectOption[]>([]);
  const [rightTypeCodeList, setRightTypeCodeList] = useState<CodeSelectOption[]>([]);
  const [caseTypeCodeList, setCaseTypeCodeList] = useState<CodeSelectOption[]>([]);

  const getDetail = useCallback((targetSeq: string) => {
    getDetailMutation.mutate(
      { conflictSeq: targetSeq },
      {
        onSuccess: (response) => {
          const data = { ...response.data };

          //   [데이터 보정] appSeq 위치 불일치 해결
          if (!data.appBaseInfo) {
            data.appBaseInfo = { appSeq: data.cftCaseMng?.appSeq || "" };
          } else {
            data.appBaseInfo.appSeq = data.appBaseInfo.appSeq || data.cftCaseMng?.appSeq || "";
          }

          form.reset({
            ...formatObjectDates(data),
            conflictSeq: targetSeq
          });

          if (response.data?.cftFileList?.fileList) {
            //   createAt 기준으로 내림차순 정렬 (최신순)
            const sortedList = [...response.data.cftFileList.fileList].sort((a, b) => {
              return (b.createAt || "").localeCompare(a.createAt || "");
            });

            //   docSeq별로 가장 최신 것(정렬된 리스트의 첫 번째)만 필터링
            const filteredList: FileItem[] = [];
            const seenDocSeqs = new Set<string>();

            sortedList.forEach((file) => {
              if (!seenDocSeqs.has(file.docSeq)) {
                seenDocSeqs.add(file.docSeq);
                filteredList.push(file);
              }
            });

            setCftFileList({ fileList: filteredList });
          }
        },
      },
    );
  }, [form]);

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [
        OBJECTION_TRIAL_CASE_MNG.PENDING_COURT,
        OBJECTION_TRIAL_CASE_MNG.AGENT_CATEGORY,
        OBJECTION_TRIAL_CASE_MNG.CASE_CATEGORY,
        OBJECTION_TRIAL_CASE_MNG.RIGHT_TYPE,
        OBJECTION_TRIAL_CASE_MNG.CASE_TYPE,
      ],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        const codeDataList = response.data;
        setPendingCourtCodeList(mapToOptionNew(getCodeList(OBJECTION_TRIAL_CASE_MNG.PENDING_COURT, codeDataList)));
        setAgentCategoryCodeList(mapToOptionNew(getCodeList(OBJECTION_TRIAL_CASE_MNG.AGENT_CATEGORY, codeDataList)));
        setCaseCategoryCodeList(mapToOptionNew(getCodeList(OBJECTION_TRIAL_CASE_MNG.CASE_CATEGORY, codeDataList)));
        setRightTypeCodeList(mapToOptionNew(getCodeList(OBJECTION_TRIAL_CASE_MNG.RIGHT_TYPE, codeDataList)));
        setCaseTypeCodeList(mapToOptionNew(getCodeList(OBJECTION_TRIAL_CASE_MNG.CASE_TYPE, codeDataList)));

        if (urlConflictSeq) getDetail(urlConflictSeq);
      },
    });
  }, [getCommonCodeNewMutation, urlConflictSeq, getDetail]);

  useEffect(() => {
    getCommCodeNew();
  }, []);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <PageTitleArea
            className="pb-2"
            title={isEditMode ? "이의심판 상세" : "이의심판 등록"}
            progress="접수중"
          >
            <Button size="h28" variant="blue" type="submit"><Icons.CloudUpload /> 저장</Button>
{/* {import.meta.env.MODE !== "prod" && (
            <Button
              type="button"
              variant="outline-pink"
              size="h28"
              onClick={() => fillFormWithDummyData(form.setValue, form.getValues(), { workType: "TRIAL" })}
            >
              임시값 채우기
            </Button>
          )} */}
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
                  onConfirm: () => navigate("/objection-trial/list"),
                });
              }}
            >
              목록
            </Button>
          </PageTitleArea>

          <FlexBox vertical>
            <FlexBox vertical>
              <DefaultInfo
                pendingCourtCodeList={pendingCourtCodeList}
                agentCategoryCodeList={agentCategoryCodeList}
                caseCategoryCodeList={caseCategoryCodeList}
                rightTypeCodeList={rightTypeCodeList}
                caseTypeCodeList={caseTypeCodeList}
              />
              <BasicInfo />
            </FlexBox>

            <FlexBox className="items-stretch">
              <FlexBox vertical className="flex-1">
                <Representative />
                <DirectlyInvolved />
                <Appellation />
                <Products />
              </FlexBox>

              <FlexBox vertical className="w-1/2 flex-2">
                <ClaimantRespondent
                  conflictSeq={urlConflictSeq}
                  onImageSelect={setImageFiles}
                  cftFileList={cftFileList}
                />
                <Note />
              </FlexBox>

              <FlexBox vertical className="flex-1">
                <Maintenance />
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </form>
      </FormProvider>

      <CustomBottom type="objection-trial" tblSeq={urlConflictSeq ?? ""} onSaveAndProceed={handleSaveAndProceed} />
    </>
  );
};

export default ObjectionTrial;
