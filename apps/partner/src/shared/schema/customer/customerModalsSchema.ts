import { z } from "zod";
import { zEmail, zTel } from "../utilSchema";

export const MandateSchema = z.object({
  attorneyName: z.string().min(1, { message: "변리사명을 입력해주세요." }).max(100, "최대 100자까지 입력 가능합니다"),
  designatedAttorney: z.string().optional().catch("").refine((v) => !v || v.length <= 100, "최대 100자까지 입력 가능합니다"),
  agentNo: z.string().optional().catch("").refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
  mandateDate: z.preprocess(
    (v) => (v == null ? "" : String(v)),
    z.string().trim().min(1, { message: "위임일자를 선택해주세요." }),
  ),
  mandateWrapperNo: z.preprocess(
    (v) => (v == null ? "" : String(v)),
    z
      .string()
      .trim()
      .min(1, { message: "위임번호를 입력해주세요." })
      .max(30, "최대 30자까지 입력 가능합니다"),
  ),
  mandateRange: z.string().optional().catch("").refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
  patentCustomerNo: z.string().optional().catch("").refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
  note: z.string().optional().catch("").refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
});
export type MandateFormInput = z.infer<typeof MandateSchema>;

export const ManagerSchema = z.object({
  participantCode: z.string().optional(),
  etaxYn: z.boolean().default(false),
  userNameKo: z.string().min(1, { message: "담당자명을 입력해주세요." }).max(100, "최대 100자까지 입력 가능합니다"),
  userMobileNo: zTel,
  deptName: z.string().optional().catch("").refine((v) => !v || v.length <= 100, "최대 100자까지 입력 가능합니다"),
  userTelNo: zTel,
  userPosition: z.string().optional().catch("").refine((v) => !v || v.length <= 100, "최대 100자까지 입력 가능합니다"),
  userFaxNo: zTel,
  userEmail: zEmail,
  userPostNo: z.string().optional().catch("").refine((v) => !v || v.length <= 20, "최대 20자까지 입력 가능합니다"),
  userAddr: z.string().optional().catch("").refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
  userAddrDetail: z.string().optional().catch("").refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
  note: z.string().optional().catch("").refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
});
export type ManagerFormInput = z.infer<typeof ManagerSchema>;

export const HistorySchema = z.object({
  actionDateTime: z.string().optional(),
  fieldName: z.string().min(1, { message: "변경사항을 입력해주세요." }).max(100, "최대 100자까지 입력 가능합니다"),
  beforeValue: z.string().optional().catch("").refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
  afterValue: z.string().optional().catch("").refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
  note: z.string().optional().catch("").refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
});
export type HistoryFormInput = z.infer<typeof HistorySchema>;

export const MappingSchema = z.object({
  kipoClientNo: z.string().optional().catch("").refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
  relationCode: z.string().optional(),
  note: z.string().optional().catch("").refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
  relatedCustomerName: z.string().min(1, { message: "고객사를 선택해주세요." }).max(100, "최대 100자까지 입력 가능합니다"),
  clientNameEn: z.string().optional().catch("").refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"), // UI display field
  contactAddress: z.string().optional(), // UI display field
  appAddress: z.string().optional(), // UI display field
});
export type MappingFormInput = z.infer<typeof MappingSchema>;
/**
 * 1. 관련고객 리스트 아이템 스키마 (API 응답 기준)
 */
export const MappingListItemSchema = z.object({
  customerMappSeq: z.string(),      // PK
  customerSeq: z.string(),          // 관련 고객 SEQ
  tblSeq: z.string(),               // 부모 고객 SEQ
  relatedCustomerName: z.string(),  // 고객명(한글)
  clientNameEn: z.string(),         // 고객명(영문)
  appAddress: z.string(),           // 출원주소
  contactAddress: z.string(),       // 연락주소
  kipoClientNo: z.string(),         // 출원인코드
  relationCode: z.string(),         // 관계유형
  note: z.string().nullable(),      // 비고
});
