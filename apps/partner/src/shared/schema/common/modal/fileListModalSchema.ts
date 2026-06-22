import { z } from "zod";
import { zDateReq } from "@shared/schema/utilSchema.ts";

const fileSchema = z.instanceof(File).refine(
  (file) => file.size <= 10 * 1024 * 1024, // 5MB 이하
  "파일 크기는 5MB 이하여야 합니다",
);

export const fileListModalSchema = z.object({
  tblSeq: z.string().min(1, "시퀀스 필수 선택입니다"),
  fileMappSeq: z.string().optional(),
  attachDocDiv: z.string().min(1, "서류구분 필수 선택입니다"),
  docSeq: z.string().default("393"), // 전자포대 기본값
  inputCreateAt: zDateReq("작성일 필수 선택입니다"), // 작성일
  summary: z.string().min(1, "요약 필수 선택입니다"),
  files: z.array(fileSchema).optional(),
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

export const fileListModalDefaultValues = createDefaultValues(fileListModalSchema, {
  mustReadYn: "Y",
});

export type FileListModalFormInput = z.input<typeof fileListModalSchema>;
export type FileListModalFormOutput = z.output<typeof fileListModalSchema>;
