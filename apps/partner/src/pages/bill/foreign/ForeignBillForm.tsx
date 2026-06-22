import React, { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { useAlertStore } from "@shared/store/useAlertStore.ts";

// 컴포넌트 임포트
import DefaultInfo from "./_components/DefaultInfo";
import TabList from "./_components/TabList";
import BillDetail from "./_components/BillDetail";
import BusinessRegistInfo from "./_components/BusinessRegistInfo";
import { fillFormWithDummyData } from "@shared/util/formFillUtil";

// 스키마 및 API 쿼리
import {
  BillOutgoingSchema,
  billOutgoingDefaultValues,
  type BillOutgoingFormInput,
} from "@shared/schema/bill/billOverseaOutgoingSchema.ts";
import { commonQueries } from "@shared/query/common/queries.ts";
import { customerQueries } from "@shared/query/customer/queries";
import { createDefaultCustomerRequest } from "@shared/api/customer/customerApi.ts";
import { billOverseasOutgoingQueries } from "@shared/query/bill/billOverseasOutgoingQueries.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { isEmpty, mapToOptionNew } from "@shared/util/stringUtil.ts";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import { stripObjectFormattedFields } from "@shared/util/formatUtil.ts";

const ForeignBillForm = () => {
  const { billSeq: urlBillSeq } = useParams<{ billSeq: string | undefined }>();
  const navigation = useNavigate();
  const { openAlert } = useAlertStore();

  const isEditMode = !!urlBillSeq;

  // [1] 폼 초기화
  const form = useForm<BillOutgoingFormInput>({
    resolver: zodResolver(BillOutgoingSchema),
    defaultValues: billOutgoingDefaultValues,
  });

  // [2] 상태 관리 (공통 코드 리스트)
  const [invCategoryCodeList, setInvCategoryCodeList] = useState<CodeSelectOption[]>([]);
  const [invTypeCodeList, setInvTypeCodeList] = useState<CodeSelectOption[]>([]);
  const [billEventCodeList, setBillEventCodeList] = useState<CodeSelectOption[]>([]);
  const [currencyCodeList, setCurrencyCodeList] = useState<CodeSelectOption[]>([]);
  const [taxBillCategoryCodeList, setTaxBillCategoryCodeList] = useState<CodeSelectOption[]>([]);
  const [taxBillTypeCodeList, setTaxBillTypeCodeList] = useState<CodeSelectOption[]>([]);
  const [customerCodeList, setCustomerCodeList] = useState<CodeSelectOption[]>([]);

  // [3] Mutation 정의
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const createBillOverseasMutation = useMutation(billOverseasOutgoingQueries.createBillOutgoing());
  const getBillOverseasDetailMutation = useMutation(billOverseasOutgoingQueries.getBillOutgoingDetail());
  const getCustomerListMutation = useMutation(customerQueries.searchList());

  // [4] 상세 조회 (Zod null 에러 방지 보정 로직 포함)
  const getBillOverseasDetail = useCallback((seq: string) => {
    getBillOverseasDetailMutation.mutate(seq, {
      onSuccess: (response: any) => {
        const rawData = response.data || {};

        // [수정] 스키마가 객체에서 문자열로 변경됨에 따라 불필요한 객체 보정 로직 제거
        const formattedData = {
          ...rawData,
          billSeq: seq,
          // null 방지를 위해 필수 문자열 필드들만 빈 값 처리
          niceClass: rawData.niceClass ?? "",
          applicantName: rawData.applicantName ?? "",
          clientName: rawData.clientName ?? "",
          foreignAgentName: rawData.foreignAgentName ?? "",
        };

        console.log("상세 데이터 로드:", formattedData);
        form.reset(formattedData);
      },
    });
  }, [form]);

  // [5] 저장 로직 (onSubmit)
  const onSubmit = (values: BillOutgoingFormInput) => {
    openAlert({
      className: "w-[400px]",
      message: isEditMode ? "수정하시겠습니까?" : "저장하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        // urlBillSeq 강제 주입하여 백엔드 Upsert(등록/수정) 유도
        const payload = {
          ...values,
          billSeq: urlBillSeq || values.billSeq
        };

        const validData = BillOutgoingSchema.parse(payload);
        const cleanData = stripObjectFormattedFields(validData);

        //   항상 POST(createBillOverseasMutation)로 전송하여 Method Not Supported 방지
        createBillOverseasMutation.mutate(cleanData as any, {
          onSuccess: (res: any) => {
            const newSeq = res.data?.billSeq;
            openAlert({
              message: isEditMode ? "수정완료하였습니다" : "저장완료하였습니다",
              confirmText: "확인",
              onConfirm: () => {
                if (!isEditMode && newSeq) {
                  navigation(`/bill/foreign/detail/${newSeq}`);
                } else {
                  navigation("/bill/foreign/list");
                }
              },
            });
          },
          onError: (err: any) => {
            console.error(" 저장 실패:", err);
          }
        });
      },
    });
  };

  const handleSaveAndProceed = async (callback: (newSeq: string) => void) => {
    // 1. 이미 SEQ가 있으면 바로 콜백 실행
    if (urlBillSeq) {
      callback(urlBillSeq);
      return;
    }

    // 2. SEQ가 없으면 폼 검증 수행
    const isValid = await form.trigger();
    if (!isValid) {
      openAlert({ message: "필수 항목을 모두 입력해주세요." });
      return;
    }

    // 3. 저장 후 진행 여부 확인
    openAlert({
      message: "저장 후 진행하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        const values = form.getValues();
        const cleanData = stripObjectFormattedFields(values);

        createBillOverseasMutation.mutate(cleanData as any, {
          onSuccess: (res: any) => {
            const newSeq = res.data?.billSeq;
            if (newSeq) {
              // URL 파라미터 갱신 및 콜백 실행
              navigation(`/bill/foreign/detail/${newSeq}`, { replace: true });
              callback(newSeq);
            }
          },
          onError: (err: any) => {
            console.error("저장 실패:", err);
            openAlert({ message: "저장에 실패하였습니다." });
          }
        });
      }
    });
  };

  const onError = (errors: any) => {
    console.log(" 폼 에러 확인:", errors);
  };

  // [6] 초기 데이터 로드 (공통코드 + 고객 리스트)
  const initData = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [
        "BILL_DIV_CD",
        "BILL_EVENT_DIV",
        "BILL_TYPE_CD",
        "CURRENCY_TYPE",
        "TAX_STMT_DIV",
        "TAXBILL_TYPE",
      ],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        const codeDataList = response.data;
        const setupCodes = (codeKey: string, setter: (codes: any[]) => void) => {
          const codeList = getCodeList(codeKey, codeDataList);
          setter(mapToOptionNew(codeList));
        };

        setupCodes("BILL_DIV_CD", setInvCategoryCodeList);
        setupCodes("BILL_EVENT_DIV", setBillEventCodeList);
        setupCodes("BILL_TYPE_CD", setInvTypeCodeList);
        setupCodes("CURRENCY_TYPE", setCurrencyCodeList);
        setupCodes("TAX_STMT_DIV", setTaxBillCategoryCodeList);
        setupCodes("TAXBILL_TYPE", setTaxBillTypeCodeList);

        if (!isEmpty(urlBillSeq)) {
          getBillOverseasDetail(urlBillSeq as string);
        }
      },
    });

    const customerPayload = createDefaultCustomerRequest();
    getCustomerListMutation.mutate(customerPayload, {
      onSuccess: (res) => {
        const list = res?.data?.list || [];
        const options = list.map((item: any) => ({
          value: item.customerSeq || "",
          label: item.clientNameKo || item.bizName || item.companyName || "정보 없음",
        }));
        setCustomerCodeList(options);
      },
    });
  }, [urlBillSeq, getBillOverseasDetail]);

  useEffect(() => {
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <PageTitleArea className="pb-2" title={isEditMode ? "해외청구서 상세" : "해외청구서 등록"}>
          <Button size="h28" variant="blue" type="submit">
            <Icons.CloudUpload /> 저장
          </Button>
{/* {import.meta.env.MODE !== "prod" && (
            <Button
              type="button"
              variant="outline-pink"
              size="h28"
              onClick={() => fillFormWithDummyData(form.setValue, form.getValues(), { workType: "BILL" })}
            >
              임시값 채우기
            </Button>
          )} */}
          <Button size="h28" type="button" onClick={() => navigation("/bill/foreign/list")}>
            목록
          </Button>
        </PageTitleArea>

        <FlexBox vertical className="gap-4">
          <FlexBox className="items-stretch gap-4">
            <DefaultInfo
              invCategoryCodeList={invCategoryCodeList}
              billEventCodeList={billEventCodeList}
              invTypeCodeList={invTypeCodeList}
              customerCodeList={customerCodeList}
            />
            <BusinessRegistInfo
              taxBillCategoryCodeList={taxBillCategoryCodeList}
              taxBillTypeCodeList={taxBillTypeCodeList}
            />
          </FlexBox>

          <FlexBox className="items-stretch gap-4">
            <TabList onSaveAndProceed={handleSaveAndProceed} />
            <BillDetail currencyCodeList={currencyCodeList} />
          </FlexBox>
        </FlexBox>
      </form>
    </FormProvider>
  );
};

export default ForeignBillForm;
