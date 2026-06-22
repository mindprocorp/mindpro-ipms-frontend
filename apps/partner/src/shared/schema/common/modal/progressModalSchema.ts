import { z } from "zod";
import { zDateReq } from "@shared/schema/utilSchema.ts";

const fileSchema = z.instanceof(File).refine(
  (file) => file.size <= 10 * 1024 * 1024, // 10MB 이하
  "파일 크기는 10MB 이하여야 합니다",
);

// 유저 피커 공통 null 처리 헬퍼
const zUser = (label: string) => ({
  userName: z.preprocess(v => v == null ? "" : v, z.string().min(1, `${label}은(는) 필수 선택사항입니다.`)),
  userSeq:  z.preprocess(v => v == null ? "" : v, z.string()),
});

export const progressModalSchema = z.object({
  tblSeq: z.string().optional(),

  // 접수사항
  noticeDate:        zDateReq("통지일은 필수입니다."),
  agentReceiptDate:  zDateReq("대리인 접수일은 필수입니다."),
  receiptDoc: z.object({
    docSeq:  z.string().min(1, "접수서류는 필수 선택사항입니다."),
    docName: z.string().optional(),
  }),
  examiner:          z.object(zUser("심사관")),
  receiptDocContent: z.string().min(1, "접수서류내용은 필수입니다."),

  // 보고사항
  receiptReportLimitDate: zDateReq("접수보고 마감일은 필수입니다."),
  receiptReportDate:      zDateReq("접수보고일은 필수입니다."),
  receiptReportManager:   z.object(zUser("접수보고 담당자")),
  reviewOpinionLimitDate: zDateReq("검토의견 마감일은 필수입니다."),
  reviewReportDate:       zDateReq("검토보고일은 필수입니다."),
  reviewReportManager:    z.object(zUser("검토보고 담당자")),
  instructionDate:        zDateReq("지시일은 필수입니다."),
  instructionContent:     z.string().min(1, "지시내용은 필수입니다."),

  // 제출사항
  extensionCount:     z.coerce.number().optional(),
  documentLimitDate:  zDateReq("서류 마감일은 필수입니다."),
  documentSubmitDate: zDateReq("서류 제출일은 필수입니다."),
  submitDoc: z.object({
    docSeq:  z.string().min(1, "제출서류는 필수 선택사항입니다."),
    docName: z.string().optional(),
  }),
  target: z.object({
    code:     z.string().min(1, "대상은 필수 선택사항입니다."),
    codeName: z.string().optional(),
  }),
  deptName:              z.string().min(1, "부서는 필수입니다."),
  submitManager:         z.object(zUser("제출 담당자")),
  submitReportLimitDate: zDateReq("제출보고 마감일은 필수입니다."),
  submitReportDate:      zDateReq("제출보고일은 필수입니다."),
  submitReportManager:   z.object(zUser("제출보고 담당자")),

  targetFiles:        z.array(z.any()).optional(),
  deleteFileSeqList:  z.array(z.string()).optional().catch([]),
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
  if (schema instanceof z.ZodArray) {
    return [];
  }

  if (schema instanceof z.ZodBoolean) return false;
  if (schema instanceof z.ZodNumber) return 0;
  if (schema instanceof z.ZodDate) return null;

  return "";
}

export const progressModalDefaultValues = createDefaultValues(progressModalSchema, {});

export type ProgressModalFormInput = z.input<typeof progressModalSchema>;
export type ProgressModalFormOutput = z.output<typeof progressModalSchema>;
