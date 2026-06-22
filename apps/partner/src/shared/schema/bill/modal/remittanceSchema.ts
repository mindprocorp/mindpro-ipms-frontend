import { z } from "zod";

/**
 * 대리인 송금내역 — DB utb_invoice_banking 기준
 *   - 금액 컬럼(deposit_amount/exchange_amount/exchange_ratio/deposit_fee): numeric(15, 0) → 정수부 14자리
 *   - note: VARCHAR(200)
 */
const remittanceAmountField = z.preprocess(
  (v) => (v == null ? "" : typeof v === "number" ? String(v) : v),
  z.string()
    .optional()
    .refine((v) => !v || /^-?[0-9,.]+$/.test(v), "숫자만 입력 가능합니다")
    .refine(
      (v) => {
        if (!v) return true;
        const intPart = v.replace(/^-/, "").replace(/,/g, "").split(".")[0];
        return intPart.length <= 14;
      },
      "최대 14자리까지 입력 가능합니다",
    )
    .transform((v) => {
      if (!v) return "0";
      const isNeg = v.startsWith("-");
      const body = (isNeg ? v.slice(1) : v).replace(/,/g, "");
      const cleaned = body.replace(/^0+(?!\.)(?!$)/, "") || "0";
      return cleaned === "0" ? "0" : (isNeg ? `-${cleaned}` : cleaned);
    }),
);

export const RemittanceSchema = z.object({
  remittanceDate: z.string().min(1, { message: "송금일을 입력해주세요." }),
  remittanceAmount: remittanceAmountField,
  exchangeRate: remittanceAmountField,
  exchangeAmount: remittanceAmountField,
  remittanceFee: remittanceAmountField,
  note: z.string().max(200, "최대 200자까지 입력 가능합니다").optional(),
});

export type RemittanceFormInput = z.infer<typeof RemittanceSchema>;
