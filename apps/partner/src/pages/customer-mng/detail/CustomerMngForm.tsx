import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FormProvider } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import AddrInfo from "./_components/AddrInfo";
import CustomerInfo from "./_components/CustomerInfo";
import DefaultInfo from "./_components/DefaultInfo";
import BizPlace from "./_components/BizPlace";
import BasicInfo from "./_components/BasicInfo";
import ReliefReason from "./_components/ReliefReason";
import ImageFile from "./_components/ImageFile";
import Note from "./_components/Note";
import CustomerBottom from "./_components/CustomerBottom";

import { customerQueries } from "@shared/query/customer/queries";
import { type CustomerFormInput } from "@shared/schema/customer/customerSchema.ts";
import { useCustomerForm } from "@shared/schema/customer/form.ts";
import { commonQueries } from "@shared/query/common/queries";
import { type CodeRequestTypeNew, type CodeSelectOption } from "@shared/api/common/commApi";
import { getCodeList } from "@shared/util/codeUtils";
import { mapToOptionNew } from "@shared/util/stringUtil";
import { useAlertStore } from "@shared/store/useAlertStore";
import { fillFormWithDummyData } from "@shared/util/formFillUtil";
import { formatObjectDates, stripObjectFormattedFields } from "@shared/util/formatUtil";
import type { FileItem } from "@shared/api/customer/customerApi";

// 고객관리 공통코드 그룹
const CUSTOMER_CODE = {
  CUSTOMER_TYPE: "CLIENT_DIV",
  APPLICANT_TYPE: "APP_MAN_DIV",
  COMPANY_TYPE: "CORP_DIV",
  RELIEF_TARGET: "REDUC_RATE_CD",
};

const CustomerMngForm = () => {
  const navigate = useNavigate();
  const { customerSeq } = useParams<{ customerSeq: string }>();
  const { openAlert } = useAlertStore();
  const isEditMode = !!customerSeq;

  // 첨부파일 상태
  const customerImageFileRef = useRef<File | null>(null);
  const [customerImageFile, setCustomerImageFile] = useState<{
    customerFileName?: string | null;
    customerFileUrl?: string | null;
    customerFileSize?: string | null;
    fileSeq?: string | null;
  } | null>(null);

  const setFileRef = (file: File | null) => {
    customerImageFileRef.current = file;
  };

  const form = useCustomerForm();

  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const saveMutation = useMutation(customerQueries.save());
  const getDetailMutation = useMutation(customerQueries.detail());
  const getCountryListMutation = useMutation(commonQueries.getCountryList());

  // 국가 목록 캐시 — countryCode 로 영문명 backfill 용
  const [countryMap, setCountryMap] = useState<Map<string, { ko: string; en: string }>>(new Map());

  const onSubmit = (values: CustomerFormInput) => {
    openAlert({
      className: "w-[400px]",
      message: isEditMode ? "수정하시겠습니까?" : "저장하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onCancel: () => useAlertStore.getState().close(),
      onConfirm: () => {
        const cleanValues = stripObjectFormattedFields(values);
        saveMutation.mutate(
          {
            data: isEditMode
              ? { ...cleanValues, customerSeq: customerSeq! }
              : cleanValues,
            customerImageFile: customerImageFileRef.current,
          },
          {
            onSuccess: (response) => {
              console.log("[고객 저장 성공]", response);
              openAlert({
                className: "w-[400px]",
                message: isEditMode ? "수정완료하였습니다" : "저장완료하였습니다",
                confirmText: "확인",
                onConfirm: () => {
                  navigate("/customer-mng/list");
                },
                onClose: () => {
                  navigate("/customer-mng/list");
                },
              });
            },
            onError: (error) => {
              console.error("[고객 저장 실패]", error);
              openAlert({
                className: "w-[400px]",
                message: isEditMode ? "수정에 실패하였습니다" : "저장에 실패하였습니다",
                confirmText: "확인",
              });
            },
          }
        );
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
        const cleanValues = stripObjectFormattedFields(values);
        saveMutation.mutate(
          {
            data: cleanValues,
            customerImageFile: customerImageFileRef.current,
          },
          {
            onSuccess: (response) => {
              const newSeq = response.data.customerSeq;
              navigate(`/customer-mng/detail/${newSeq}?openTab=${tabValue}`, { replace: true });
            },
            onError: (error) => {
              console.error("[고객 저장 실패]", error);
              openAlert({
                className: "w-[400px]",
                message: "저장에 실패하였습니다",
                confirmText: "확인",
              });
            },
          }
        );
      },
    });
  };

  const onError = (errors: any) => {
    console.log("Validation errors:", errors);
    console.log("Current form values:", form.getValues());
    Object.keys(errors).forEach((key) => {
      console.log(`[${key}]`, errors[key]);
    });
  };

  // 공통코드 state
  const [customerTypeList, setCustomerTypeList] = useState<CodeSelectOption[]>([]);
  const [applicantTypeList, setApplicantTypeList] = useState<CodeSelectOption[]>([]);
  const [companyTypeList, setCompanyTypeList] = useState<CodeSelectOption[]>([]);
  const [reliefTargetList, setReliefTargetList] = useState<CodeSelectOption[]>([]);

  const getCommCodeNew = () => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [
        CUSTOMER_CODE.CUSTOMER_TYPE,
        CUSTOMER_CODE.APPLICANT_TYPE,
        CUSTOMER_CODE.COMPANY_TYPE,
        CUSTOMER_CODE.RELIEF_TARGET,
      ],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        console.log("고객관리 공통코드 조회 성공", response);
        const codeDataList = response.data;

        const customerTypes = getCodeList(CUSTOMER_CODE.CUSTOMER_TYPE, codeDataList);
        if (customerTypes) setCustomerTypeList(mapToOptionNew(customerTypes));

        const applicantTypes = getCodeList(CUSTOMER_CODE.APPLICANT_TYPE, codeDataList);
        if (applicantTypes) setApplicantTypeList(mapToOptionNew(applicantTypes));

        const companyTypes = getCodeList(CUSTOMER_CODE.COMPANY_TYPE, codeDataList);
        if (companyTypes) setCompanyTypeList(mapToOptionNew(companyTypes));

        const reliefTargets = getCodeList(CUSTOMER_CODE.RELIEF_TARGET, codeDataList);
        if (reliefTargets) setReliefTargetList(mapToOptionNew(reliefTargets));
      },
    });
  };

  const getDetail = (customerSeq: string, map: Map<string, { ko: string; en: string }>) => {
    getDetailMutation.mutate(customerSeq, {
      onSuccess: (response) => {
        console.log("[고객 상세 조회 성공]", response);
        const data = { ...response.data };

        // BE 가 코드만 저장하고 국가명을 비워 보낼 수 있어 — 국가목록(공통)으로 ko/en backfill
        if (data.countryCode) {
          const mapped = map.get(data.countryCode);
          if (mapped) {
            if (!data.countryNameKo) data.countryNameKo = mapped.ko;
            if (!data.countryNameEn) data.countryNameEn = mapped.en;
          }
        }

        form.reset(formatObjectDates(data));

        //   파일 히스토리에서 최신 파일만 필터링 (대표 이미지 등)
        if (response.data?.customerFileList) {
          const sortedList = [...response.data.customerFileList].sort((a, b) => {
            return (b.createAt || "").localeCompare(a.createAt || "");
          });

          const filteredList: FileItem[] = [];
          const seenDocSeqs = new Set<string>();

          sortedList.forEach((file) => {
            if (!seenDocSeqs.has(file.docSeq)) {
              seenDocSeqs.add(file.docSeq);
              filteredList.push(file);
            }
          });

          const latestFile = filteredList[0]; // 보통 고객은 파일이 하나이므로 첫 번째 것을 사용
          if (latestFile) {
            setCustomerImageFile({
              customerFileName: latestFile.fileName,
              customerFileUrl: latestFile.fileUrl,
              customerFileSize: latestFile.fileSize,
              fileSeq: latestFile.fileSeq,
            });
          }
        }

        // 레거시/기본 이미지 정보 대응
        if (response.data?.customerImageFile && !customerImageFile) {
          setCustomerImageFile(response.data.customerImageFile);
        }
      },
      onError: (error) => {
        console.error("[고객 상세 조회 실패]", error);
        openAlert({
          className: "w-[400px]",
          message: "상세 조회에 실패하였습니다",
          confirmText: "확인",
        });
      },
    });
  };

  useEffect(() => {
    getCommCodeNew();
    // 국가 목록 미리 로드 — countryNameEn backfill 용
    getCountryListMutation.mutate(undefined, {
      onSuccess: (response) => {
        const map = new Map<string, { ko: string; en: string }>();
        (response.data ?? []).forEach((item) => {
          map.set(item.id, { ko: item.label, en: item.attributes ?? "" });
        });
        setCountryMap(map);
      },
    });
  }, []);

  // 상세 정보 로드 — `customerSeq`가 있을 때 호출
  useEffect(() => {
    if (isEditMode && customerSeq && countryMap.size > 0) {
      getDetail(customerSeq, countryMap);
    }
  }, [isEditMode, customerSeq, countryMap]);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <PageTitleArea className="pb-2" title={isEditMode ? "고객관리 상세" : "고객관리 등록"}>
            {/* <Button variant="outline-green" size="h28">
              <Icons.Mail />
              Outlook
            </Button> */}

            <Button size="h28" variant="blue" type="submit">
              <Icons.CloudUpload />
              저장
            </Button>

{/* {import.meta.env.MODE !== "prod" && (
            <Button
              type="button"
              variant="outline-pink"
              size="h28"
              onClick={() => fillFormWithDummyData(form.setValue, form.getValues(), { workType: "CUSTOMER" })}
            >
              임시값 채우기
            </Button>
          )} */}

            <Button
              size="h28"
              onClick={() => {
                openAlert({
                  className: "w-[400px]",
                  message: (
                    <>
                      작성내용은 저장되지 않습니다.
                      <br />
                      목록으로 이동하시겠습니까?
                    </>
                  ),
                  confirmText: "확인",
                  cancelText: "취소",
                  onConfirm: () => {
                    navigate("/customer-mng/list");
                  },
                });
              }}
            >
              목록
            </Button>
          </PageTitleArea>
          <FlexBox vertical>
            <FlexBox>
              {/* 기본정보 */}
              <FlexBox className="flex-[2] min-w-0">
                <DefaultInfo
                  customerTypeList={customerTypeList}
                  applicantTypeList={applicantTypeList}
                  companyTypeList={companyTypeList}
                />
              </FlexBox>

              {/* 국가정보 */}
              <FlexBox className="flex-1 min-w-0">
                <BasicInfo />
              </FlexBox>
            </FlexBox>

            <FlexBox className="items-stretch">
              <FlexBox vertical className="min-w-0">
                {/* 고객정보 */}
                <CustomerInfo />

                {/* 비고 */}
                <Note />
              </FlexBox>

              <FlexBox vertical className="min-w-0">
                {/* 주소정보 */}
                <AddrInfo />
              </FlexBox>

              <FlexBox vertical className="min-w-0">
                {/* 감면사유 */}
                <ReliefReason reliefTargetList={reliefTargetList} />

                {/* 사업장정보 */}
                <BizPlace />

                {/* 이미지 */}
                <ImageFile
                  onFileSelect={setFileRef}
                  customerImageFile={customerImageFile}
                />
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </form>
      </FormProvider>

      {/* 하단 탭 */}
      <CustomerBottom customerSeq={customerSeq} onSaveAndProceed={handleSaveAndProceed} />
    </>
  );
};

export default CustomerMngForm;
