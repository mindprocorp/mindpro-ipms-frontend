import { z } from "zod";
import { zTel, zEmail, zUrl, zBizNo, zSubBizNo, zDate } from "../utilSchema";

export const CustomerGroupSchema = z.object({
  customerSeq: z.string().default(""),
  customerName: z.string().default(""),
});

const CustomerSchemaBase = z.object({
  // 기본정보
  clientCategory:    z.string().min(1, "고객구분을 선택해주세요"),
  applicantCategory: z.string().min(1, "출원인구분을 선택해주세요"),
  corpCategory: z.string().nullable().optional(),
  attorneyCategory: z.string().nullable().optional(),

    // 국가정보
    countryCode: z.string(),
    countryNameKo: z.string(),
    countryNameEn: z.string(),

    // 고객정보
    clientNameKo: z.string().min(1, "고객명(한글)을 입력해주세요").max(100, "최대 100자까지 입력 가능합니다"),
    clientNameEn: z.string().nullable().optional().refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"),
    clientNameCh: z.string().nullable().optional().refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"),
    clientNameJp: z.string().nullable().optional().refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"),
    companyName: z.string().nullable().optional().refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"),
    deptName: z.string().nullable().optional().refine((v) => !v || v.length <= 100, "최대 100자까지 입력 가능합니다"),
    position: z.string().nullable().optional().refine((v) => !v || v.length <= 100, "최대 100자까지 입력 가능합니다"),
    residentRegNo: z.string().nullable().optional().refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    corpRegNo: z.string().nullable().optional().refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    kipoClientNo: z.string().nullable().optional().refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    managerName: z.string().nullable().optional().refine((v) => !v || v.length <= 100, "최대 100자까지 입력 가능합니다"),
    generalMandateNo: z.string().nullable().optional().refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    registrationDate: z.string().nullable().optional(),
    mobile: zTel,
    homepage: zUrl,
    email: zEmail,

    // 주소정보
    appAddress: z.string().nullable().optional(),
    appAddrDetail: z.string().nullable().optional(),
    appTel: zTel,
    appFax: zTel,
    contactAddress: z.string().nullable().optional(),
    contactAddrDetail: z.string().nullable().optional(),
    contactTel: zTel,
    contactFax: zTel,
    contactSameAsApp: z.string().nullable().optional(),
    etcAddress: z.string().nullable().optional(),
    etcAddrDetail: z.string().nullable().optional(),
    etcTel: zTel,
    etcFax: zTel,
    overseaAddress: z.string().nullable().optional(),
    overseaAddrDetail: z.string().nullable().optional(),
    overseaTel: zTel,
    overseaFax: zTel,

    // 감면사유 — 날짜 필드는 zDate 로 형식 검증 (부정확 입력 → BE timestamp 에러 방지)
    reliefTarget: z.string().nullable().optional(),
    reliefReason: z.string().nullable().optional(),
    reliefIssueDate: zDate,
    reliefExemptionDate: zDate,

    // 사업장정보
    bizRegNo: zBizNo,
    subBizRegNo: zSubBizNo,
    bizName: z.string().nullable().optional(),
    bizCEO: z.string().nullable().optional(),
    bizAddress: z.string().nullable().optional(),
    bizType: z.string().nullable().optional(),
    bizItem: z.string().nullable().optional(),

    // 비고
    note: z.string().nullable().optional().refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),

    // customerSeq (수정 시)
    customerSeq: z.string(),
  });

// 감면사유: 대상 선택 시 나머지 3개도 필수 입력 (cross-field validation)
export const CustomerSchema = CustomerSchemaBase.superRefine((data, ctx) => {
  if (data.reliefTarget) {
    if (!data.reliefReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reliefReason"],
        message: "서류/사유를 입력해주세요",
      });
    }
    if (!data.reliefIssueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reliefIssueDate"],
        message: "발급일을 입력해주세요",
      });
    }
    if (!data.reliefExemptionDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reliefExemptionDate"],
        message: "면제기간을 입력해주세요",
      });
    }
  }
});

// defaultValues 자동 생성 함수
function createDefaultValues(
  schema: z.ZodTypeAny,
  overrides: Record<string, any> = {},
  path: string = ""
): any {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    return Object.fromEntries(
      Object.entries(shape).map(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;

        if (currentPath in overrides) {
          return [key, overrides[currentPath]];
        }

        return [key, createDefaultValues(value as z.ZodTypeAny, overrides, currentPath)];
      })
    );
  }

  if (schema instanceof z.ZodBoolean) return false;
  if (schema instanceof z.ZodNumber) return 0;
  if (schema instanceof z.ZodArray) return [];
  if (schema instanceof z.ZodDate) return null;

  return "";
}

// defaultValues 는 base 스키마에서 생성 (superRefine 으로 감싼 후엔 shape 접근 불가)
export const defaultValues = createDefaultValues(CustomerSchemaBase, {
  "contactSameAsApp": "N",
});

export type CustomerFormInput = z.input<typeof CustomerSchema>;
export type CustomerFormOutput = z.output<typeof CustomerSchema>;
