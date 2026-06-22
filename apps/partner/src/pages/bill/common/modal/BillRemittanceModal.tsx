import {
  Button,
  FlexBox,
  FormDialog,
  RHF,
} from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import React, { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RemittanceSchema, type RemittanceFormInput } from "@shared/schema/bill/modal/remittanceSchema";
import { useMutation } from "@tanstack/react-query";
import { billTabsQueries } from "@shared/query/bill/billTabsQueries.ts";
import { useParams } from "react-router-dom";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { stripObjectFormattedFields } from "@shared/util/formatUtil.ts";

export const BillRemittanceModal = ({ title = "대리인 송금내역 등록", open, onOpenChange, onSuccess, propData, editData }: ModalProps) => {
  const { billSeq } = useParams<{ billSeq: string }>();
  const { openAlert } = useAlertStore();
  const lastModifiedCurrency = useRef<'FOREIGN' | 'KRW' | 'NONE'>('NONE');

  const form = useForm<RemittanceFormInput>({
    resolver: zodResolver(RemittanceSchema),
    defaultValues: {
      remittanceDate: editData?.depositSendDate || "",
      remittanceAmount: editData?.exchangeAmount || "",
      exchangeRate: editData?.exchangeRatio || "",
      exchangeAmount: editData?.depositAmount || "",
      remittanceFee: editData?.depositFee || "",
      note: editData?.note || "",
    },
  });

  const { watch, setValue } = form;
  const remittanceAmount = watch("remittanceAmount");
  const exchangeRate = watch("exchangeRate");
  const exchangeAmount = watch("exchangeAmount");

  const parseNumber = (val: any) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") return Number(val.replace(/,/g, "")) || 0;
    return 0;
  };

  // 큰 수가 setValue 될 때 String(n)이 과학적 표기법(1.5e+16)으로 변환되어
  // zod 정규식(/^-?[0-9,.]+$/)에 걸리는 문제 방지용 안전 변환.
  const toPlainNumberStr = (n: number): string => {
    if (!Number.isFinite(n)) return "0";
    return n.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 4 });
  };

  useEffect(() => {
    // 💡 초기 로드 시에는 자동 동기화 로직을 건너뜀
    if (lastModifiedCurrency.current === 'NONE') return;

    const rate = parseNumber(exchangeRate);
    if (!rate) return;

    if (lastModifiedCurrency.current === 'KRW') {
      const krw = parseNumber(exchangeAmount);
      const calculatedForeign = Math.round((krw / rate) * 100) / 100;
      const currentForeign = parseNumber(remittanceAmount);
      if (Math.abs(calculatedForeign - currentForeign) > 0.01) {
        setValue("remittanceAmount", toPlainNumberStr(calculatedForeign));
      }
    } else if (lastModifiedCurrency.current === 'FOREIGN') {
      const foreign = parseNumber(remittanceAmount);
      const calculatedKRW = Math.round(foreign * rate);
      const currentKRW = parseNumber(exchangeAmount);
      if (Math.abs(calculatedKRW - currentKRW) > 1) {
        setValue("exchangeAmount", toPlainNumberStr(calculatedKRW));
      }
    }
  }, [remittanceAmount, exchangeRate, exchangeAmount, setValue]);

const saveMutation = useMutation(billTabsQueries.saveForeignBankingItem());

  const onSubmit = (values: RemittanceFormInput) => {
    const cleanValues = stripObjectFormattedFields(values);
    const payload: any = {
      invoiceSeq: propData || billSeq,
      // 1. 송금일 (백엔드 키: depositSendDate)
      depositSendDate: cleanValues.remittanceDate,

      // 2. 외화 송금액 (백엔드 키: exchangeAmount)
      exchangeAmount: cleanValues.remittanceAmount || 0,

      // 3. 환율 (백엔드 키: exchangeRatio) ★ 중요: Rate가 아니라 Ratio
      exchangeRatio: cleanValues.exchangeRate || 0,

      // 4. 환산 원화금액 (백엔드 키: depositAmount)
      depositAmount: cleanValues.exchangeAmount || 0,

      // 5. 송금 수수료 (백엔드 키: depositFee)
      depositFee: cleanValues.remittanceFee || 0,

      // 6. 비고
      note: cleanValues.note,

      // 7. 카테고리 (필요시 문자열 혹은 객체 - 백엔드 로그에는 안 보였지만 보통 20으로 쏨)
      bankingCategory: "20",

      // 8. 기타 (로그에 null로 찍혔던 필드들 기본값 세팅)
      currencyUnit: { code: "USD", codeName: "USD" },
      depositWay: { code: "계좌이체", codeName: "송금" },
    };

    if (editData?.bankingSeq) {
      payload.bankingSeq = editData.bankingSeq;
    }

    saveMutation.mutate(payload as any, {
      onSuccess: () => {
        onSuccess?.({ callbackData: "REMITTANCE" } as any);
        onOpenChange(false);
      },
      onError: (err) => {
        console.error("저장 실패", err);
        openAlert({ message: "저장 중 오류가 발생했습니다.", confirmText: "확인" });
      }
    });
  };

  const onError = () => {
    openAlert({
      className: "w-[400px]",
      message: "필수 항목을 모두 입력해주세요.",
      confirmText: "확인",
    });
  };

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
        {/* DB utb_invoice_banking 금액 = numeric(15,0) → 정수부 14자리 + 콤마 = 18자, note VARCHAR(200) */}
        <FlexBox vertical className="gap-3">
          <FlexBox className="gap-2">
            <RHF.FormDatePicker control={form.control} name="remittanceDate" label="송금일" />
            <RHF.Input
              control={form.control}
              name="remittanceAmount"
              label="송금액"
              priceOnly
              maxLength={18}
              onFocus={() => { lastModifiedCurrency.current = 'FOREIGN'; }}
            />
          </FlexBox>

          <FlexBox className="gap-2">
            <RHF.Input
              control={form.control}
              name="exchangeRate"
              label="환율"
              priceOnly
              maxLength={18}
              onFocus={() => { if (lastModifiedCurrency.current === 'NONE') lastModifiedCurrency.current = 'FOREIGN'; }}
            />
            <RHF.Input
              control={form.control}
              name="exchangeAmount"
              label="환산비용"
              priceOnly
              maxLength={18}
              important
              onFocus={() => { lastModifiedCurrency.current = 'KRW'; }}
            />
          </FlexBox>

          <RHF.Input
            control={form.control}
            name="remittanceFee"
            label="송금수수료"
            priceOnly
            maxLength={18}
          />

          <RHF.FormTextarea
            control={form.control}
            name="note"
            label="비고"
            maxLength={200}
          />
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
