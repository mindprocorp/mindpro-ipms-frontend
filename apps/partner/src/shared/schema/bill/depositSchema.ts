import { z } from "zod";
import { zDecimal } from "@shared/schema/utilSchema.ts";

export const DepositSchema = z.object({
  checkReceiptDate: z.string().optional(),
  depositDate: z.string().min(1, { message: "입력조건은 필수 입니다." }),
  exchangeRateApplyDate: z.string().optional(),
  exchangeRate: zDecimal,
  depositAmount: zDecimal,
  depositFee: zDecimal,
  exchangeAmount: zDecimal,
  depositMethod: z.string().optional(),
  depositBank: z.string().optional(),
  note: z.string().optional(),
  prepaymentDepositNo: z.string().optional(),
  generalPrepaymentBalance: zDecimal,
  generalPrepaymentUsedAmount: zDecimal,
  designatedPrepaymentBalance: zDecimal,
  designatedPrepaymentUsedAmount: zDecimal,
});

export type DepositFormInput = z.input<typeof DepositSchema>;
export type DepositFormOutput = z.output<typeof DepositSchema>;
