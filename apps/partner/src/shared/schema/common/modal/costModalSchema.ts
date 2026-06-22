import { z } from "zod";
import { zDateReq, zAmountReq } from "@shared/schema/utilSchema.ts";

export const costModalSchema = z.object({
  remittanceCount: z.coerce.number().min(1, "납부차수 필수 선택입니다.").max(999, "납부차수는 3자리 이하로 입력해주세요."), // 납부차수
  costRemittanceDate: zDateReq("연차료납부일 필수 선택입니다"), // 연차료납부일
  costFee: zAmountReq("연차료납부액 필수 선택입니다", 99_999_999, "연차료납부액은 억 단위 미만(99,999,999원 이하)으로 입력해주세요."), // 연차료납부액
  discountRatio: z.string().min(1, "감면율 필수 선택입니다"), // 감면율 필수
  note: z.string().min(1, "비고 필수 선택입니다"), // 비고 필수
  tblSeq: z.string(), // 시퀀스 필수
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

export const costModalDefaultValues = createDefaultValues(costModalSchema, {});

export type CostModalFormInput = z.input<typeof costModalSchema>;
export type CostModalFormOutput = z.output<typeof costModalSchema>;
