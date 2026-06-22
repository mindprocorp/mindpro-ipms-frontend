import { z } from "zod";
import { zDateReq } from "@shared/schema/utilSchema.ts";

export const preferenceModalSchema = z.object({
  appSeq: z.string().min(1, "검토의견 마감일 필수 선택입니다"),
  preferenceSeq: z.string().optional(), // 시퀀스키
  priorCountryCode: z.string().min(1, "국가코드 필수 선택입니다").regex(/^[a-zA-Z]+$/, "영문(문자)만 입력 가능합니다"), // 국가코드
  preferenceAssertDate: zDateReq("우선권 주장일 필수 선택입니다"), // 우선권 주장일
  preferenceNo: z.string().min(1, "우선권번호 필수 선택입니다"), // 우선권번호
  wipoCategoryCode: z.string().min(1, "WIPO 분류 코드 필수 선택입니다"), // WIPO 분류 코드
  preferenceSearch: z.string().optional(), // 우선권조회
  submitDeadLineDate: zDateReq("제출 마감일 필수 선택입니다"), // 제출 마감일
  submitClosingDate: zDateReq("제출 완료일 필수 선택입니다"), // 제출 완료일
  preferenceRegDate: zDateReq("접수일 필수 선택입니다"), // 접수
  note: z.string().min(1, "비고 필수 선택입니다"), //비고
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

export const preferenceModalDefaultValues = createDefaultValues(preferenceModalSchema, {});

export type PreferenceModalFormInput = z.input<typeof preferenceModalSchema>;
export type PreferenceModalFormOutput = z.output<typeof preferenceModalSchema>;
