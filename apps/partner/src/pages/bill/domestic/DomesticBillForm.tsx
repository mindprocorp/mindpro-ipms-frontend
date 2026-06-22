import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FormProvider } from "react-hook-form";

import DefaultInfo from "./_components/DefaultInfo";
import BusinessRegistInfo from "./_components/BusinessRegistInfo";
import BillDetail from "./_components/BillDetail";
import { useNavigate, useParams } from "react-router-dom";
import { useBillDomesticForm } from "@shared/schema/bill/form.ts";
import { useMutation } from "@tanstack/react-query";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import React, { useCallback, useEffect, useState } from "react";
import {
  type BillDomesticFormInput,
  BillDomesticSchema,
} from "@shared/schema/bill/billDomesticSchema.ts";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import { BILL_DOMESTIC } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { isEmpty, mapToOptionNew } from "@shared/util/stringUtil.ts";
import { commonQueries } from "@shared/query/common/queries.ts";
import { billDomesticQueries } from "@shared/query/bill/billDomesticQueries.ts";
import { customerQueries } from "@shared/query/customer/queries.ts";
import { createDefaultCustomerRequest } from "@shared/api/customer/customerApi.ts";
import TabList from "./_components/TabList.tsx";
import { fillFormWithDummyData } from "@shared/util/formFillUtil";
import { z } from "zod";

type Props ={
  appSeq? : string;
  billSeq? : string;
  onSuccess?: () => void;
}

const DomesticBillForm = ( { appSeq, billSeq: propBillSeq, onSuccess } : Props  ) => {
  const { billSeq: urlBillSeq } = useParams<{ billSeq: string | undefined }>();
  const navigation = useNavigate();
  const form = useBillDomesticForm();
  const { openAlert } = useAlertStore();

  const isEditMode = !!(urlBillSeq || propBillSeq);

  // Mutations
  const createBillDomesticMutation = useMutation(billDomesticQueries.createBillDomestic());
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const getBillDomesticDetailMutation = useMutation(billDomesticQueries.getBillDomesticDetail());
  const getCustomerListMutation = useMutation(customerQueries.searchList());

  // States
  const [invCategoryCodeList, setInvCategoryCodeList] = useState<CodeSelectOption[]>([]);
  const [invTypeCodeList, setInvTypeCodeList] = useState<CodeSelectOption[]>([]);
  const [taxBillCategoryCodeList, setTaxBillCategoryCodeList] = useState<CodeSelectOption[]>([]);
  const [taxBillTypeCodeList, setTaxBillTypeCodeList] = useState<CodeSelectOption[]>([]);
  const [billEventCodeList, setBillEventCodeList] = useState<CodeSelectOption[]>([]);
  const [customerCodeList, setCustomerCodeList] = useState<CodeSelectOption[]>([]);

  const [localBillSeq, setLocalBillSeq] = useState<string | undefined>(propBillSeq || urlBillSeq);

  //   상세 조회 함수
  const getBillDomesticDetail = useCallback(
    (targetSeq: string) => {
      getBillDomesticDetailMutation.mutate(targetSeq, {
        onSuccess: (response) => {
          // 상세 데이터 로드 시 billSeq가 유실되지 않도록 reset
          form.reset({
            ...response.data,
            finalClaimsCount: response.data.independentClaims,
            specPage: response.data.specCount,
            billSeq: targetSeq,
          });
        },
      });
    },
    [form],
  );

  useEffect(() => {
    if (propBillSeq) {
      getBillDomesticDetail(propBillSeq);
    }
  }, [propBillSeq, getBillDomesticDetail]);

  //   저장/수정 실행 함수 (Upsert)
  const onSubmit = (values: BillDomesticFormInput) => {
    openAlert({
      className: "w-[400px]",
      message: (localBillSeq || urlBillSeq) ? "수정하시겠습니까?" : "저장하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        // Zod 검증 및 데이터 정제 — invoiceSeq를 함께 채워 백엔드 INSERT/UPDATE 분기 트리거
        const existingSeq = localBillSeq || urlBillSeq || values.billSeq || values.invoiceSeq;
        const payload = {
          ...values,
          billSeq: existingSeq,
          invoiceSeq: existingSeq,
        };

        const validData = BillDomesticSchema.parse(payload);

        //   백엔드 설계에 따라 create Mutation 하나로 처리 (POST 방식)
        createBillDomesticMutation.mutate(validData, {
          onSuccess: (response) => {
            const data: any = response?.data;
            const newSeq =
              data && typeof data === "object"
                ? data.invoiceSeq || data.billSeq || data.seq || data.masterSeq
                : data;
            if (newSeq) setLocalBillSeq(newSeq);

            openAlert({
              className: "w-[400px]",
              message: (localBillSeq || urlBillSeq) ? "수정완료하였습니다" : "저장완료하였습니다",
              confirmText: "확인",
              onConfirm: () => {
                if (onSuccess) {
                  onSuccess();
                } else {
                  if (!isEditMode && newSeq) {
                    navigation(`/bill/domestic/detail/${newSeq}`);
                  } else {
                    navigation("/bill/domestic/list");
                  }
                }
              },
            });
          },
          onError: (err: any) => {
            console.error(" 처리 실패:", err);
          },
        });
      },
    });
  };

  /**
   * 저장 + 자식 탭 모달 오픈을 위한 로직
   */
  const handleSaveAndProceed = async (callback: (newSeq: string) => void) => {
    // 1. 이미 SEQ가 있으면 바로 콜백 실행
    const existingSeq = localBillSeq || urlBillSeq || propBillSeq;
    if (existingSeq) {
      callback(existingSeq);
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
        const validData = BillDomesticSchema.parse(values);

        createBillDomesticMutation.mutate(validData, {
          onSuccess: (response) => {
            const data: any = response?.data;
            const newSeq =
              (data && typeof data === "object"
                ? data.invoiceSeq || data.billSeq || data.seq || data.masterSeq
                : data) || localBillSeq || urlBillSeq;

            if (newSeq) {
              setLocalBillSeq(newSeq);
              // URL 파라미터 갱신 및 콜백 실행
              navigation(`/bill/domestic/detail/${newSeq}`, { replace: true });
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

  //   공통코드 및 초기 데이터 로드
  const initData = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [
        BILL_DOMESTIC.BILL_DIV_CD,
        BILL_DOMESTIC.BILL_EVENT_DIV,
        BILL_DOMESTIC.BILL_TYPE_CD,
        BILL_DOMESTIC.TAX_STMT_DIV,
        BILL_DOMESTIC.TAXBILL_TYPE,
      ],
    };

    // 공통코드 조회
    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        const codeDataList = response.data;
        setInvCategoryCodeList(
          mapToOptionNew(getCodeList(BILL_DOMESTIC.BILL_DIV_CD, codeDataList).filter(c => c.dtlCd === "10")),
        );
        setInvTypeCodeList(mapToOptionNew(getCodeList(BILL_DOMESTIC.BILL_TYPE_CD, codeDataList)));
        setBillEventCodeList(
          mapToOptionNew(getCodeList(BILL_DOMESTIC.BILL_EVENT_DIV, codeDataList)),
        );
        setTaxBillCategoryCodeList(
          mapToOptionNew(getCodeList(BILL_DOMESTIC.TAX_STMT_DIV, codeDataList)),
        );
        setTaxBillTypeCodeList(
          mapToOptionNew(getCodeList(BILL_DOMESTIC.TAXBILL_TYPE, codeDataList)),
        );

        // 코드 로드 후 수정 모드일 때 상세 정보 조회
        if (!isEmpty(urlBillSeq)) {
          getBillDomesticDetail(urlBillSeq as string);
        }
      },
    });

    // 고객 리스트 조회
    const payload = createDefaultCustomerRequest();
    getCustomerListMutation.mutate(payload, {
      onSuccess: (res) => {
        const list = res?.data?.list || [];
        const options = list.map((item: any) => ({
          value: item.customerSeq || "",
          label: item.clientNameKo || item.bizName || item.companyName || "정보 없음",
        }));
        setCustomerCodeList(options);
      },
    });
  }, [urlBillSeq, getBillDomesticDetail]);

  useEffect(() => {
    initData();
    form.setValue("appSeq",appSeq)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <PageTitleArea
            className="pb-2"
            title={isEditMode ? "내국청구서 상세" : "내국청구서 등록"}
          >
            {/* <Button variant="outline-green" size="h28" type="button">
              <Icons.WalletCards /> 전자세금
            </Button> */}
            <Button size="h28" variant="blue" type="submit">
              <Icons.CloudUpload /> 저장
            </Button>
{/* {import.meta.env.MODE !== "prod" && (
              <Button
                size="h28"
                type="button"
                variant="outline-pink"
                onClick={() => fillFormWithDummyData(form.setValue, form.getValues(), { workType: "BILL" })}
              >
                임시값 채우기
              </Button>
            )} */}
            <Button size="h28" type="button" onClick={() => navigation("/bill/domestic/list")}>
              목록
            </Button>
          </PageTitleArea>

          <FlexBox vertical>
            <FlexBox className="items-stretch">
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

            <FlexBox className="items-stretch">
              <TabList
                billSeq={localBillSeq || urlBillSeq || propBillSeq}
                onSaveAndProceed={handleSaveAndProceed}
              />
              <BillDetail />
            </FlexBox>
          </FlexBox>
        </form>
      </FormProvider>
    </>
  );
};

export default DomesticBillForm;
