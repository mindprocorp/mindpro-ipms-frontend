import { z } from "zod";
import { zNumericReq, zPercentReq } from "@shared/schema/utilSchema.ts";
import { productModalSchema } from "@shared/schema/common/modal/productModalSchema.ts";

export const DistributeSchema = z.object({
  invoiceSeq: z.string().optional(),
  performanceSeq: z.string().optional(),
  performanceCategory: z.object({
    code: z.preprocess((v) => (v == null ? "" : v), z.string().min(1, "실적구분은 필수입력입니다")),
    codeName: z.string().optional(),
  }),
  deptCategory: z.preprocess((v) => (v == null ? "" : v), z.string().optional()),
  staff: z.object({
    userSeq: z.string().optional(),
    userName: z.preprocess((v) => (v == null ? "" : v), z.string().min(1, "담당자 필수 선택입니다")),
  }),
  // performanceContent: z.string().min(1, "실적 상세 내용 필수 선택입니다"),
  performancePerfDate: z.preprocess((v) => (v == null ? "" : v), z.string().min(1, "실적인정일 필수 선택입니다")),
  performanceAmount: zNumericReq("실적 분배 금액 필수 선택입니다"),
  shareRatio: zPercentReq("분배 비율 (0~100) 필수 입력입니다"),
  note: z.preprocess((v) => (v == null ? "" : v), z.string().optional()),
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

export const distributeModalDefaultValues = createDefaultValues(DistributeSchema, {
  "performanceCategory.code": "10",
});

export type DistributeFormInput = z.input<typeof DistributeSchema>;
export type DistributeFormOutput = z.output<typeof DistributeSchema>;
