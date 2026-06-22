import { z } from "zod";
import { YN, TIMING, SHARE_SCOPE } from "./constants";

/** 서식 템플릿 위자드 스키마 */
export const FormTemplateSchema = z.object({
  // 1단계: 기본 설정
  categoryCode: z.string().default(""),
  templateName: z.string().min(1, "서식명을 입력해주세요.").default(""),
  useYn: z.string().default(YN.YES),
  docModifyYn: z.string().default(YN.NO),
  docNumYn: z.string().default(YN.NO),
  docNumFormat: z.string().default(""),
  footerYn: z.string().default(YN.NO),
  footerContent: z.string().default(""),
  externalYn: z.string().default(YN.NO),
  redirectUrl: z.string().default(""),

  // 3단계: 결재선 설정
  apprTemplateSeq: z.string().default(""),
  apprRequiredYn: z.string().default(YN.NO),
  apprAdminSetYn: z.string().default(YN.NO),
  apprDefaultLineYn: z.string().default(YN.NO),
  apprCondLineYn: z.string().default(YN.NO),
  apprChangeAllowYn: z.string().default(YN.NO),
  apprSkipUpperYn: z.string().default(YN.NO),
  fullyApproveYn: z.string().default(YN.NO),

  // 4단계: 수신·공유 설정
  receiveYn: z.string().default(YN.YES),
  receiveTiming: z.string().default(TIMING.APPROVED),
  receiveChangeYn: z.string().default(YN.YES),
  shareScope: z.string().default(SHARE_SCOPE.GROUP),
  shareTiming: z.string().default(TIMING.APPROVED),
  shareChangeYn: z.string().default(YN.YES),

  // 참조 설정
  referenceYn: z.string().default(YN.NO),
  referenceTiming: z.string().default(TIMING.APPROVED),
  referenceChangeYn: z.string().default(YN.YES),
});

export type FormTemplateInput = z.input<typeof FormTemplateSchema>;
export type FormTemplateOutput = z.output<typeof FormTemplateSchema>;
