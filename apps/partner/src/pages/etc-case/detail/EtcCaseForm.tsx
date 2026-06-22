import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import CustomBottom from "@pages/domestic/detail/_components/CustomBottom";
import { FormProvider, type FieldErrors } from "react-hook-form";
import { useEffect, useState, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Appellation from "./_components/Appellation";
import DirectlyInvolved from "./_components/DirectlyInvolved";
import Note from "./_components/Note";
import Representative from "./_components/Representative";
import DefaultInfo from "./_components/DefaultInfo";
import Products from "./_components/Products";
import ImageFile from "./_components/ImageFile";
import BasicInfo from "./_components/BasicInfo";
import CaseInfo from "./_components/CaseInfo";
import Maintenance from "./_components/Maintenance ";
import { etcCaseQueries } from "@shared/query/etc-case/queries";
import { type EtcCaseFormInput } from "@shared/schema/etc-case/etcCaseSchema.ts";
import { useEtcCaseForm } from "@shared/schema/etc-case/form.ts";
import { commonQueries } from "@shared/query/common/queries";
import { type CodeRequestTypeNew, type CodeSelectOption } from "@shared/api/common/commApi";
import { ETC_CASE_MNG } from "@shared/enum/comCodeType";
import { getCodeList } from "@shared/util/codeUtils";
import { mapToOptionNew } from "@shared/util/stringUtil";
import { useAlertStore } from "@shared/store/useAlertStore";
import type { EtcConflictFile, FileItem } from "@shared/api/etc-case/etcCaseApi";
import { fillFormWithDummyData } from "@shared/util/formFillUtil";
import { formatObjectDates, stripObjectDates } from "@shared/util/formatUtil";

//   Strategy.tsx 에러 방지용 더미데이터 유지
export const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const EtcCase = () => {
  const navigate = useNavigate();
  const { conflictSeq: urlConflictSeq } = useParams<{ conflictSeq: string }>();
  const { openAlert } = useAlertStore();

  const isEditMode = !!urlConflictSeq;

  // 첨부파일 상태
  const etcConflictFileRef = useRef<File | null>(null);
  const [etcConflictFile, setEtcConflictFile] = useState<EtcConflictFile | null>(null);

  const form = useEtcCaseForm();

  const setFileRef = (file: File | null) => {
    etcConflictFileRef.current = file;
  };

  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const getDetailMutation = useMutation(etcCaseQueries.detail());

  //   [중요] 백엔드가 POST만 지원하므로 createMutation(POST) 하나로 통합 사용
  const saveMutation = useMutation(etcCaseQueries.create());

  // 공통코드 state
  const [caseCategoryCodeList, setCaseCategoryCodeList] = useState<CodeSelectOption[]>([]);
  const [rightTypeCodeList, setRightTypeCodeList] = useState<CodeSelectOption[]>([]);
  const [caseTypeCodeList, setCaseTypeCodeList] = useState<CodeSelectOption[]>([]);

  //   상세 데이터 로드 및 Zod 에러 방지 보정
  const getDetail = useCallback((targetSeq: string) => {
    getDetailMutation.mutate(
      { conflictSeq: targetSeq },
      {
        onSuccess: (response) => {
          const rawData = response.data || {};

          // Zod 'expected string, received undefined' 에러 방지용 기본값 세팅 및 날짜 포맷팅
          const formattedData = {
            ...formatObjectDates(rawData),
            conflictSeq: targetSeq // 수정 시 필수 키값 보장
          };

          form.reset(formattedData);

          if (response.data?.etcConflictFile?.fileList) {
            //   createAt 기준으로 내림차순 정렬 (최신순)
            const sortedList = [...response.data.etcConflictFile.fileList].sort((a, b) => {
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

            setEtcConflictFile({ fileList: filteredList });
          }
        },
      },
    );
  }, [form]);

  //   공통코드 조회
  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [
        ETC_CASE_MNG.CASE_CATEGORY,
        ETC_CASE_MNG.RIGHT_TYPE,
        ETC_CASE_MNG.CASE_TYPE,
      ],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        const codeDataList = response.data;
        setCaseCategoryCodeList(mapToOptionNew(getCodeList(ETC_CASE_MNG.CASE_CATEGORY, codeDataList)));
        setRightTypeCodeList(mapToOptionNew(getCodeList(ETC_CASE_MNG.RIGHT_TYPE, codeDataList)));
        setCaseTypeCodeList(mapToOptionNew(getCodeList(ETC_CASE_MNG.CASE_TYPE, codeDataList)));

        if (urlConflictSeq) {
          getDetail(urlConflictSeq);
        }
      },
    });
  }, [urlConflictSeq, getDetail]);

  //   무한 루프 방지를 위한 빈 의존성 배열
  useEffect(() => {
    getCommCodeNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (values: EtcCaseFormInput) => {
    openAlert({
      className: "w-[400px]",
      message: isEditMode ? "수정하시겠습니까?" : "저장하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        const cleanValues = stripObjectDates(values);
        const payload = {
          data: {
            ...cleanValues,
            //   URL의 Seq를 우선 적용하여 백엔드에서 Update를 타도록 유도
            conflictSeq: urlConflictSeq || values.conflictSeq
          },
          etcConflictFile: etcConflictFileRef.current,
        };

        //   PUT 에러 방지를 위해 항상 POST(saveMutation)로 전송
        saveMutation.mutate(payload, {
          onSuccess: () => {
            openAlert({
              className: "w-[400px]",
              message: isEditMode ? "수정완료하였습니다" : "저장완료하였습니다",
              confirmText: "확인",
              onConfirm: () => navigate("/etc-case/list"),
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
      onConfirm: () => {
        const values = form.getValues();
        const cleanValues = stripObjectDates(values);
        const payload = {
          data: cleanValues,
          etcConflictFile: etcConflictFileRef.current,
        };

        saveMutation.mutate(payload, {
          onSuccess: (response) => {
            const newSeq = response.data.conflictSeq;
            navigate(`/etc-case/detail/${newSeq}?openTab=${tabValue}`, { replace: true });
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

  const onError = (errors: FieldErrors<EtcCaseFormInput>) => {
    console.error("Validation errors:", errors);
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <PageTitleArea className="pb-2" title={isEditMode ? "기타사건 상세" : "기타사건 등록"} progress="접수중">
            <Button size="h28" variant="blue" type="submit"><Icons.CloudUpload /> 저장</Button>
{/* {import.meta.env.MODE !== "prod" && (
            <Button
              type="button"
              variant="outline-pink"
              size="h28"
              onClick={() => fillFormWithDummyData(form.setValue, form.getValues(), { workType: "ETC" })}
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
                  onConfirm: () => navigate("/etc-case/list"),
                });
              }}
            >
              목록
            </Button>
          </PageTitleArea>

          <FlexBox vertical>
            <FlexBox vertical>
              <DefaultInfo
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
                <CaseInfo />
                <ImageFile onFileSelect={setFileRef} etcConflictFile={etcConflictFile} />
                <Note />
              </FlexBox>

              <FlexBox vertical className="flex-1">
                <Maintenance />
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </form>
      </FormProvider>

      <CustomBottom type="etc-case" tblSeq={urlConflictSeq ?? ""} onSaveAndProceed={handleSaveAndProceed} />
    </>
  );
};

export default EtcCase;
