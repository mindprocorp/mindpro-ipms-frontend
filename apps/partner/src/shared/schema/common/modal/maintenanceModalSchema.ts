import { z } from "zod";
import { zDateReq } from "@shared/schema/utilSchema.ts";

const fileSchema = z.instanceof(File).refine(
  (file) => file.size <= 10 * 1024 * 1024, // 5MB 이하
  "파일 크기는 5MB 이하여야 합니다",
);

export const maintenanceModalSchema = z.object({
  maintenanceFeeSeq: z.string().optional(), // 구비서류 시퀀스키
  appSeq: z.string().min(1, "마스터키 필수 선택입니다"), // 마스터키
  nextPaymentInstallment: z.coerce
    .string()
    .min(1, "차기납부차수 필수 선택입니다")
    .max(3, "차기납부차수는 3자리 이하 숫자만 입력 가능합니다")
    .refine((v) => /^\d+$/.test(v), "차기납부차수는 숫자만 입력 가능합니다"),
  maintFeeDeadline: zDateReq(" 납부마감일 필수 선택입니다"),
  maintFeePenaltyDeadline: zDateReq("과태마감일 필수 선택입니다"),
  maintFeeOrderDate: zDateReq("납부지시일 필수 선택입니다"),
  maintFeePaymentDate: zDateReq("납부일 필수 선택입니다"), // 발송일
  note: z
    .string()
    .min(1, "비고 필수 선택입니다")
});



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

export const maintenanceModalDefaultValues = createDefaultValues(maintenanceModalSchema, {});

export type MaintenanceModalFormInput = z.input<typeof maintenanceModalSchema>;
export type MaintenanceModalFormOutput = z.output<typeof maintenanceModalSchema>;
