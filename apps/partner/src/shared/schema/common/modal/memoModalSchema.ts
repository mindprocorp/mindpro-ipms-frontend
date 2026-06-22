import { z } from "zod";
import { zDate } from "@shared/schema/utilSchema.ts";

const fileSchema = z.instanceof(File).refine(
  (file) => file.size <= 10 * 1024 * 1024, // 5MB 이하
  "파일 크기는 5MB 이하여야 합니다",
);

export const memoModalSchema = z.object({
  // appSeq: z.string().min(1, "시퀀스 필수 선택입니다"),
  memoSeq: z.string().optional(),
  memoRegDate: zDate, // 작성일
  tblSeq: z.string().min(1, "시퀀스 필수 선택입니다"), //
  memoTitle: z.string().min(1, "제목 필수 선택입니다"), // 제목
  mustReadYn: z.string().min(1, "필독 필수 선택입니다"), // 필독
  note: z.string().min(1, "메모 필수 선택입니다"), //메모
  files: z.array(z.instanceof(File)).optional().default([]),
  fileInfo: z
    .array(
      z.object({
        fileSeq: z.string().optional(),
        fileName: z.string().optional(),
        fileSize: z.string().optional(),
        fileUrl: z.string().optional(),
        docSeq: z.string().optional(),
        docNm: z.string().optional()
      }),
    )
    .optional()
    .default([]),
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

export const memoModalDefaultValues = createDefaultValues(memoModalSchema, {
  mustReadYn: "Y",
});

export type MemoModalFormInput = z.input<typeof memoModalSchema>;
export type MemoModalFormOutput = z.output<typeof memoModalSchema>;
