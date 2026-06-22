import { z } from "zod";
import { zDateReq } from "@shared/schema/utilSchema.ts";

export const gracePeriodModalSchema = z.object({
  gracePeriodSeq: z.string().optional(),
  gracePeriodDate: zDateReq("공지예외주장일 필수 선택입니다"), // 공지예외주장일
  gracePeriodContent: z.object({
    code: z.string().min(1, "공지예외주장내용 필수 선택입니다."),
    codeName: z.string().optional(),
  }),
  submitDeadLineDate: zDateReq("제출마감일 필수 선택입니다"), // 제출마감일
  submitClosingDate: zDateReq("제출일 필수 선택입니다"), // 제출일

  note: z.string().min(1, "비고 필수 선택입니다"), // 비고 필수

  appSeq: z.string().min(1, "마스터키 필수 선택입니다"), // 시퀀스 필수
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

export const gracePeriodModalDefaultValues = createDefaultValues(gracePeriodModalSchema, {});

export type GracePeriodModalFormInput = z.input<typeof gracePeriodModalSchema>;
export type GracePeriodModalFormOutput = z.output<typeof gracePeriodModalSchema>;
