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
import { fillFormWithDummyData } from "@shared/util/formFillUtil";

// 스키마 및 API 쿼리
import {
  BillIncomingSchema,
  billIncomingDefaultValues,
  type BillIncomingFormInput,
} from "@shared/schema/bill/billOverseaIncomingSchema.ts";
import { commonQueries } from "@shared/query/common/queries.ts";
import { customerQueries } from "@shared/query/customer/queries";
import { createDefaultCustomerRequest } from "@shared/api/customer/customerApi.ts";
import { billOverseasIncomingQueries } from "@shared/query/bill/billOverseasIncomingQueries.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { isEmpty, mapToOptionNew } from "@shared/util/stringUtil.ts";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import { stripObjectFormattedFields } from "@shared/util/formatUtil.ts";

import { z } from "zod";

type Props = {
  appSeq?: string;
  billSeq? : string;
  onSuccess?: () => void;
};
const OverseasBillForm = ({ appSeq, billSeq: propBillSeq, onSuccess }: Props) => {
  const { billSeq: urlBillSeq } = useParams<{ billSeq: string | undefined }>();
  const navigation = useNavigate();
  const { openAlert } = useAlertStore();

  const isEditMode = !!(urlBillSeq || propBillSeq);

  // [1] 폼 초기화
  const form = useForm<BillIncomingFormInput>({
    resolver: zodResolver(BillIncomingSchema),
    defaultValues: billIncomingDefaultValues,
  });

  // [2] 상태 관리 (공통 코드 리스트)
  const [invCategoryCodeList, setInvCategoryCodeList] = useState<CodeSelectOption[]>([]);
  const [invTypeCodeList, setInvTypeCodeList] = useState<CodeSelectOption[]>([]);
  const [billEventCodeList, setBillEventCodeList] = useState<CodeSelectOption[]>([]);
  const [currencyCodeList, setCurrencyCodeList] = useState<CodeSelectOption[]>([]);
  const [customerCodeList, setCustomerCodeList] = useState<CodeSelectOption[]>([]);

  // [3] Mutation 정의
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const createBillOverseasMutation = useMutation(billOverseasIncomingQueries.createBillIncoming());
  const getBillOverseasDetailMutation = useMutation(
    billOverseasIncomingQueries.getBillIncomingDetail(),
  );
  const getCustomerListMutation = useMutation(customerQueries.searchList());

  // [4] 상세 조회 (form.reset 방식)
  const getBillOverseasDetail = useCallback(
    (seq: string) => {
      getBillOverseasDetailMutation.mutate(seq, {
        onSuccess: (response: any) => {
          console.log("상세 데이터 로드:", response.data);
          //   상세 데이터 로드 시 billSeq가 유실되지 않도록 reset 시점에 보정
          form.reset({
            ...response.data,
            billSeq: seq,
          });
        },
      });
    },
    [form],
  );

  // [5] 저장 로직 (onSubmit)
  const onSubmit = (values: BillIncomingFormInput) => {
    openAlert({
      className: "w-[400px]",
      message: isEditMode ? "수정하시겠습니까?" : "저장하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        try {
          //   Zod 검증 및 데이터 정제 (urlBillSeq 강제 주입하여 Upsert 유도)
          const payload = {
            ...values,
            billSeq: urlBillSeq || values.billSeq,
          };

          const validData = BillIncomingSchema.parse(payload);
          const cleanData = stripObjectFormattedFields(validData);

          //   항상 POST(createBillOverseasMutation)로 전송하여 Method Not Supported 방지
          createBillOverseasMutation.mutate(cleanData as any, {
            onSuccess: () => {
              openAlert({
                message: isEditMode ? "수정완료하였습니다" : "저장완료하였습니다",
                confirmText: "확인",
                onConfirm: () => {
                  if (onSuccess) {
                    onSuccess();
                  } else {
                    navigation("/bill/overseas/list");
                  }
                },
              });
            },
            onError: (err: any) => {
              console.error(" 저장 실패:", err);
            },
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            const firstError = error.errors[0];
            openAlert({
              title: "입력 확인",
              message: `${firstError.path.join(".")} : ${firstError.message}`,
              confirmText: "확인",
            });
          } else {
            console.error(error);
          }
        }
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
        const payload = {
          ...values,
          billSeq: urlBillSeq || values.billSeq,
        };
        const validData = BillIncomingSchema.parse(payload);
        const cleanData = stripObjectFormattedFields(validData);

        createBillOverseasMutation.mutate(cleanData as any, {
          onSuccess: (response: any) => {
            const newSeq = response.data.billSeq || urlBillSeq;
            navigation(`/bill/overseas/detail/${newSeq}?openTab=${tabValue}`, { replace: true });
          },
          onError: (error) => {
            console.error("저장 실패:", error);
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

  const onError = (errors: any) => {
    console.log(" 폼 에러 확인:", errors);
  };

  // [6] 초기 데이터 로드 (공통코드 + 고객 리스트)
  const initData = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: ["BILL_DIV_CD", "BILL_EVENT_DIV", "BILL_TYPE_CD", "CURRENCY_TYPE"],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        const codeDataList = response.data;
        const setupCodes = (codeKey: string, setter: (codes: any[]) => void) => {
          const codeList = getCodeList(codeKey, codeDataList);
          setter(mapToOptionNew(codeList));
        };

        setInvCategoryCodeList(
          mapToOptionNew(getCodeList("BILL_DIV_CD", codeDataList).filter(c => c.dtlCd === "20" || c.dtlCd === "30")),
        );
        setupCodes("BILL_EVENT_DIV", setBillEventCodeList);
        setupCodes("BILL_TYPE_CD", setInvTypeCodeList);
        setupCodes("CURRENCY_TYPE", setCurrencyCodeList);

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
  }, [urlBillSeq, propBillSeq, getBillOverseasDetail]);

  useEffect(() => {
    initData();
    form.setValue("appSeq", appSeq);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (propBillSeq) {
      getBillOverseasDetail(propBillSeq);
    }
  }, [propBillSeq, getBillOverseasDetail]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <PageTitleArea className="pb-2" title={isEditMode ? "외국청구서 상세" : "외국청구서 등록"}>
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
          <Button size="h28" type="button" onClick={() => navigation("/bill/overseas/list")}>
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

export default OverseasBillForm;
