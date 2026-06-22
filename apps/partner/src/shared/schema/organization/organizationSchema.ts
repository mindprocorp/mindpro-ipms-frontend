import { z } from "zod";

/*  서식 템플릿 위자드 스키마  */
export const formTemplateSchema = z.object({
  categoryCode: z.string().optional(),
  templateName: z.string().min(1, "서식명을 입력해주세요"),
  useYn: z.string().default("Y"),
  docModifyYn: z.string().default("N"),
  docNumYn: z.string().default("N"),
  docNumFormat: z.string().optional(),
  footerYn: z.string().default("N"),
  footerContent: z.string().optional(),
  externalYn: z.string().default("N"),
  apprTemplateSeq: z.string().optional(),
  receiveYn: z.string().default("N"),
  shareScope: z.string().default("NONE"),
  shareTiming: z.string().default("APPROVED"),
  shareChangeYn: z.string().default("N"),
});

export type FormTemplateSchemaType = z.infer<typeof formTemplateSchema>;

/*  결재선 템플릿 스키마  */
export const apprTemplateSchema = z.object({
  templateName: z.string().min(1, "결재선명을 입력해주세요"),
});

export type ApprTemplateSchemaType = z.infer<typeof apprTemplateSchema>;

/*  부서 등록 스키마  */
export const deptCreateSchema = z.object({
  deptName: z.string().min(1, "조직이름을 입력해주세요"),
});

export type DeptCreateSchemaType = z.infer<typeof deptCreateSchema>;

/*  코드 등록 스키마  */
export const codeCreateSchema = z.object({
  codeName: z.string().min(1, "값을 입력해주세요"),
});

export type CodeCreateSchemaType = z.infer<typeof codeCreateSchema>;
