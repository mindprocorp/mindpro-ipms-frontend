import { DepositSchema, type DepositFormInput } from "@shared/schema/bill/depositSchema";
import { Alert, AlertDescription, Button, FlexBox, FormDialog, Icons, RHF } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { billTabsQueries } from "@shared/query/bill/billTabsQueries.ts";
import { useParams } from "react-router-dom";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { PrepaymentSearchModal } from "./PrepaymentSearchModal.tsx";
import { stripObjectFormattedFields } from "@shared/util/formatUtil.ts";


export const DepositModal = ({ title = "입금내역 등록", open, onOpenChange, onSuccess, propData, editData, showPrepayment: externalShowPrepayment }: ModalProps) => {
  const { billSeq } = useParams<{ billSeq: string }>();
  const { openAlert } = useAlertStore();
  const [isPrepaymentModalOpen, setIsPrepaymentModalOpen] = useState(false);

  const isDomestic = propData?.startsWith('INVDOM') || billSeq?.startsWith('INVDOM');
  const showPrepayment = externalShowPrepayment ?? isDomestic;

  useEffect(() => {
    console.log("=== DepositModal Debug ===");
    console.log("open:", open);
    console.log("propData:", propData);
    console.log("billSeq:", billSeq);
    console.log("isDomestic:", isDomestic);
    console.log("externalShowPrepayment:", externalShowPrepayment);
    console.log("showPrepayment:", showPrepayment);
  }, [open, propData, billSeq, isDomestic, externalShowPrepayment, showPrepayment]);

  const buildDefaults = (d: any): DepositFormInput => {
    // "0" 같은 기본값은 빈 문자열로 처리 (placeholder 노출 + UX)
    const normAmt = (v: any) => (v == null || v === "0" || v === 0 ? "" : String(v));
    return {
      depositDate: d?.depositSendDate || d?.depositDate || "",
      depositAmount: d?.depositAmount || "",
      depositFee: d?.depositFee ?? "",
      depositMethod: d?.depositName || "",
      depositBank: d?.depositBank || "",
      note: d?.note || "",
      checkReceiptDate: d?.depositCheckDate || d?.checkReceiptDate || "",
      exchangeRateApplyDate: d?.exchangeRateApplyDate || "",
      exchangeRate: d?.exchangeRate || "",
      exchangeAmount: d?.exchangeAmount || "",
      prepaymentDepositNo: d?.prepaymentDepositNo || "",
      generalPrepaymentBalance: normAmt(d?.generalPrepaymentBalance),
      generalPrepaymentUsedAmount: normAmt(d?.generalPrepaymentUsedAmount),
      designatedPrepaymentBalance: normAmt(d?.designatedPrepaymentBalance),
      designatedPrepaymentUsedAmount: normAmt(d?.designatedPrepaymentUsedAmount),
    };
  };

  const form = useForm<DepositFormInput>({
    resolver: zodResolver(DepositSchema),
    defaultValues: buildDefaults(editData),
  });

  // [수정 모드] 모달 재오픈 시 editData가 갱신되면 form을 reset해서 값 반영.
  // useForm의 defaultValues는 첫 마운트 1회만 적용되므로 reset 없이는 stale 상태.
  useEffect(() => {
    if (open) {
      form.reset(buildDefaults(editData));
    }
  }, [open, editData]);

  const saveBankingMutation = useMutation(billTabsQueries.saveBankingItem());

  const onSubmit = (values: DepositFormInput) => {
    const cleanValues = stripObjectFormattedFields(values);
    const payload: any = {
      invoiceSeq: propData || billSeq,
      bankingCategory: { code: "10", codeName: "" },
      depositSendDate: cleanValues.depositDate,
      depositAmount: cleanValues.depositAmount || 0,
      depositName: cleanValues.depositMethod,
      depositFee: cleanValues.depositFee || 0,
      depositBank: cleanValues.depositBank,
      depositCheckDate: cleanValues.checkReceiptDate,
      note: cleanValues.note,
      // [선수금 5종] 백엔드 누락으로 저장 X 였던 부분 — payload에 포함
      prepaymentDepositNo: cleanValues.prepaymentDepositNo || "",
      generalPrepaymentBalance: cleanValues.generalPrepaymentBalance || 0,
      generalPrepaymentUsedAmount: cleanValues.generalPrepaymentUsedAmount || 0,
      designatedPrepaymentBalance: cleanValues.designatedPrepaymentBalance || 0,
      designatedPrepaymentUsedAmount: cleanValues.designatedPrepaymentUsedAmount || 0,
    };

    console.log("=== payload ===", payload);

    if (editData?.bankingSeq) {
      payload.bankingSeq = editData.bankingSeq;
    }

    saveBankingMutation.mutate(payload, {
      onSuccess: () => {
        onSuccess?.({ callbackData: "DEPOSIT" } as any);
        onOpenChange(false);
      },
      onError: (err) => {
        console.error("저장 실패", err);
        openAlert({ message: "저장 중 오류가 발생했습니다.", confirmText: "확인" });
      }
    });
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
    openAlert({
      className: "w-[400px]",
      message: "필수 항목을 모두 입력해주세요.",
      confirmText: "확인",
    });
  };

  const depositMethodOptions = [
    { value: "bank", label: "무통장" },
    { value: "card", label: "카드결제" }
  ];

  const bankOptions = [
    { value: "kb", label: "국민은행" },
    { value: "nh", label: "농협" },
    { value: "shinhan", label: "신한은행" },
    { value: "woori", label: "우리은행" },
    { value: "hana", label: "하나은행" },
    { value: "ibk", label: "기업은행" },
    { value: "kakao", label: "카카오뱅크" },
    { value: "toss", label: "토스뱅크" },
    { value: "kbank", label: "케이뱅크" },
    { value: "epost", label: "우체국" },
    { value: "kfcc", label: "새마을금고" },
    { value: "sc", label: "SC제일은행" },
    { value: "busan", label: "부산은행" },
    { value: "kyongnam", label: "경남은행" },
    { value: "daegu", label: "대구은행" },
    { value: "kwangju", label: "광주은행" },
    { value: "jeonbuk", label: "전북은행" }
  ];

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-100!"
      >
        <FlexBox vertical>
          <RHF.FormDatePicker control={form.control} name="depositDate" label="입금일" />

          <FlexBox>
            <RHF.Input control={form.control} name="depositAmount" label="입금액" priceOnly />
            <RHF.Input control={form.control} name="depositFee" label="입금수수료" priceOnly />
          </FlexBox>

          <FlexBox>
            <RHF.FormSelect
              control={form.control}
              name="depositMethod"
              items={depositMethodOptions}
              label="입금방법"
              placeholder="선택"
            />

            <RHF.FormSelect
              control={form.control}
              name="depositBank"
              items={bankOptions}
              label="은행"
              placeholder="선택"
            />
          </FlexBox>

          <RHF.FormTextarea control={form.control} name="note" label="비고" />

          {showPrepayment && (
            <>
              <Alert variant="info">
                <Icons.Info />
                <AlertDescription>
                  <p className="text-xs">
                    입금액(입금액+입금수수료) 금액 중 선수금으로 처리된 금액에 대해서만 입력합니다.
                  </p>
                </AlertDescription>
              </Alert>

              <FlexBox className="items-end">
                <RHF.Input
                  control={form.control}
                  name="prepaymentDepositNo"
                  label="선수금 입금번호"
                  inputDisabled
                />
                <Button
                  type="button"
                  onClick={() => setIsPrepaymentModalOpen(true)}
                  className="text-p-color-3! bg-p-color-3/10! hover:bg-p-color-3/16! border-p-color-3! border-l text-xs"
                >
                  선수금 조회
                </Button>
              </FlexBox>

              <FlexBox>
                <RHF.Input control={form.control} name="generalPrepaymentBalance" label="일반선수금 잔액" priceOnly align="right" disabled />
                <RHF.Input control={form.control} name="generalPrepaymentUsedAmount" label="일반선수금 사용액" priceOnly align="right" disabled />
              </FlexBox>

              <FlexBox>
                <RHF.Input control={form.control} name="designatedPrepaymentBalance" label="지정선수금 잔액" priceOnly align="right" disabled />
                <RHF.Input control={form.control} name="designatedPrepaymentUsedAmount" label="지정선수금 사용액" priceOnly align="right" disabled />
              </FlexBox>
            </>
          )}
        </FlexBox>
      </FormDialog>

      <PrepaymentSearchModal
        open={isPrepaymentModalOpen}
        onOpenChange={setIsPrepaymentModalOpen}
        onSuccess={(data: any) => {
          form.setValue("prepaymentDepositNo", data.prepaymentSeq);
          form.setValue("generalPrepaymentBalance", data.generalBalance);
          form.setValue("designatedPrepaymentBalance", data.designatedBalance);
        }}
        title="선수금 조회"
      />
    </FormProvider>
  );
};
