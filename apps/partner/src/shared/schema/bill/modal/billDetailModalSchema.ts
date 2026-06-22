import { z } from "zod";
import { zNumeric, zAmount } from "@shared/schema/utilSchema.ts";

/**
 * 당소청구내역 금액 필드 공통 검증.
 * DB utb_invoice_claim:
 *   - unit_price/amount/vat_amount/total_amount: numeric(15, 0) → 정수부 최대 14자리
 *   - item_content / note: VARCHAR(200)
 */
const MAX_CLAIM_INT_DIGITS = 14;
const claimAmountField = z.preprocess(
  (v) => (v == null ? "" : typeof v === "number" ? String(v) : v),
  z.string()
    .optional()
    .refine((v) => !v || /^-?[0-9,.]+$/.test(v), "숫자만 입력 가능합니다")
    .refine(
      (v) => {
        if (!v) return true;
        const intPart = v.replace(/^-/, "").replace(/,/g, "").split(".")[0];
        return intPart.length <= MAX_CLAIM_INT_DIGITS;
      },
      `최대 ${MAX_CLAIM_INT_DIGITS}자리까지 입력 가능합니다`,
    )
    .transform((v) => {
      if (!v) return "0";
      const isNeg = v.startsWith("-");
      const body = (isNeg ? v.slice(1) : v).replace(/,/g, "");
      const cleaned = body.replace(/^0+(?!$)/, "") || "0";
      return cleaned === "0" ? "0" : (isNeg ? `-${cleaned}` : cleaned);
    }),
);

export const billDetailModalSchema = z.object({
  invoiceSeq: z.string(),
  invoiceClaimSeq: z.string().optional(),
  costCategory: z.object({
    code: z.string().min(1, "비용구분 필수 선택입니다"),
    codeName: z.string(),
  }),
  itemContent: z.string().max(200, "최대 200자까지 입력 가능합니다").optional(),
  quantity:    zNumeric,
  unit: z.object({
    code: z.string().optional(),
    codeName: z.string().optional(),
  }).optional(),
  // 14자리 제한 공통 적용
  unitPrice:   claimAmountField,
  amount:      claimAmountField,
  vatAmount:   claimAmountField,
  totalAmount: claimAmountField,
  note: z.string().max(200, "최대 200자까지 입력 가능합니다").optional(),
});

// zAmount는 더 이상 직접 사용하지 않지만 import 유지(다른 곳 쓰일 수 있음)
void zAmount;

function createDefaultValues(
  schema: z.ZodTypeAny,
  overrides: Record<string, any> = {},
  path: string = "",
): any {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    return Object.fromEntries(
      Object.entries(shape).map(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;

        if (currentPath in overrides) {
          return [key, overrides[currentPath]];
        }

        return [key, createDefaultValues(value, overrides, currentPath)];
      }),
    );
  }
  // 🔹 array ⭐ 핵심
  if (schema instanceof z.ZodArray) {
    return [];
  }

  if (schema instanceof z.ZodBoolean) return false;
  if (schema instanceof z.ZodNumber) return 0;
  if (schema instanceof z.ZodArray) return [];
  if (schema instanceof z.ZodDate) return null;

  return "";
}

export const billDetailModalDefaultValues = createDefaultValues(billDetailModalSchema, {
  mustReadYn: "Y",
});

export type BillDetailModalFormInput = z.input<typeof billDetailModalSchema>;
export type BillDetailModalFormOutput = z.output<typeof billDetailModalSchema>;
