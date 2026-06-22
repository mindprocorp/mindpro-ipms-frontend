import { z } from "zod";
import { zDateReq } from "@shared/schema/utilSchema.ts";

const fileSchema = z.instanceof(File).refine(
  (file) => file.size <= 10 * 1024 * 1024, // 5MB 이하
  "파일 크기는 5MB 이하여야 합니다",
);

export const requiredDocsModalSchema = z.object({
  requiredDocSeq: z.string().optional(), // 구비서류 시퀀스키
  appSeq: z.string().min(1, "마스터키 필수 선택입니다"), // 마스터키
  requiredDocName: z
    .string()
    .min(1, " 구비서류 필수 선택입니다")
    .max(50, "구비서류는 50자 이하로 입력해주세요."),
  submitDeadline: zDateReq(" 제출마감일 필수 선택입니다"),
  signReqDate: zDateReq("서명요청일 필수 선택입니다"),
  receiptDate: zDateReq("접수일 필수 선택입니다"),
  sendDate: zDateReq("발송일 필수 선택입니다"), // 발송일
  submitDate: zDateReq("제출일 필수 선택입니다"), // 제출서류명
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

export const requiredDocsModalDefaultValues = createDefaultValues(requiredDocsModalSchema, {});

export type RequiredDocsModalFormInput = z.input<typeof requiredDocsModalSchema>;
export type RequiredDocsModalFormOutput = z.output<typeof requiredDocsModalSchema>;
