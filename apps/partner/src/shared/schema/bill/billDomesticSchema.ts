import { z } from "zod";
import { RIGHT_TYPE } from "@shared/enum/domesticType.ts";
import { zDate, zDateReq } from "@shared/schema/utilSchema.ts";




const zString = z.preprocess((v) => (v == null ? "" : v), z.string().optional());

export const BillDomesticSchema = z.object({
  // 청구기본 사항
  billSeq: zString,
  appSeq: zString,
  customerSeq: z.string().min(1, "고객사는 필수 선택입니다"),
  invoiceSeq: zString,
  invCategory: z.object({
    code: z.string().min(1, "청구구분코드 필수 선택입니다"),
    codeName: zString,
  }),

  caseCategory: z.object({
    code: z.string().min(1, "사건구분(국내외) 필수 선택입니다"),
    codeName: zString,
  }),
  invClass: z.object({
    code: z.string().min(1, "청구분류코드 필수 선택입니다"),
    codeName: zString,
  }),

  invType: z.object({
    code: z.string().min(1, "청구종류코드 필수 선택입니다"),
    codeName: zString,
  }),

  invDate: zDateReq("청구일을 입력해주세요"),
  invNo: z.string().min(1, "청구번호를 입력해주세요").max(100, "최대 100자까지 입력 가능합니다"),
  invSendDate: zDateReq("청구서발송일 필수 선택입니다"),
  invMgr: z.object({
    userSeq: zString,
    userName: z.string().min(1, "비용담당자 필수 선택입니다"),
  }),

  ourRef: z.string().min(1, "ourRef 필수 선택입니다").max(100, "최대 100자까지 입력 가능합니다"),
  clientRef: zString.refine((v) => !v || v.length <= 100, "최대 100자까지 입력 가능합니다"),
  deptName: zString.refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"),
  adminMgr: z.object({
      userSeq: zString,
      userName: zString,
  }),

  caseMgr: z.object({
    userSeq: zString,
    userName: zString,
  }),

  attorney: z.object({
    userSeq: zString,
    userName: z.string().min(1, "담당변리사 필수 선택입니다"),
  }),
  oaDocument: zString.refine((v) => !v || v.length <= 50, "최대 50자까지 입력 가능합니다"),
  invContent: zString.refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),

  rightType: z.object({
    code: zString,
    codeName: zString
  }), // 권리
  appDate: zString, // 출원일
  appNo: zString, // 출원번호
  regDate: zString, // 등록일
  regNo: zString, // 등록번호
  grade: zString, // 등급
  finalClaimsCount: zString, // 독립항
  dependentClaims: zString, // 종속항
  specPage: zString, // 명세서
  drawingCount: zString, // 도면수
  figureCount: zString, // 도수
  customerName: zString.default(""), // 고객명
  customerContact: z.object({
    userSeq: zString.default(""),
    userName: zString.default(""),
  }).default({ userSeq: "", userName: "" }), // 고객담당자
  applicantName: zString, // 출원
  clientName: zString, // 의뢰인
  titleKo: zString, // 국문
  titleEn: zString, // 영문
  productClass: zString, // 물품류
  note: zString.refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"), // 비고

  taxBillDate: zDateReq("발행일을 입력해주세요"), // 계산서발행일,
  taxBillNo: z.string().min(1, "발행번호를 입력해주세요").max(100, "최대 100자까지 입력 가능합니다"), // 계산서발행번호,
  taxBillType: z.object({
    code: z.string().min(1, "발행구분코드 필수 선택입니다"),
    codeName: zString,
  }),
  taxBillCategory: z.object({
    code: z.string().min(1, "계산서구분코드 필수 선택입니다"),
    codeName: zString,
  }),
  bizName: zString,
  bizCeo: zString,
  bizRegNo: zString,
  bizWorkplaceNo: zString,
  bizAddr: zString,
  bizType: zString,
  bizItem: zString,
  bizContactName: zString,
  bizDeptName: zString,
  bizEmail: zString,
  govFeePayDate: zDate,
  govFeePayAmount: zString.refine((v) => !v || /^[0-9.,-]+$/.test(v), "숫자만 입력 가능합니다"),
  govFee: zString.refine((v) => !v || /^[0-9.,-]+$/.test(v), "숫자만 입력 가능합니다"),
  agencyFee: zString.refine((v) => !v || /^[0-9.,-]+$/.test(v), "숫자만 입력 가능합니다"),
  vat: zString.refine((v) => !v || /^[0-9.,-]+$/.test(v), "숫자만 입력 가능합니다"),
  etcFee: zString.refine((v) => !v || /^[0-9.,-]+$/.test(v), "숫자만 입력 가능합니다"),
  totalInvAmount: zString.refine((v) => !v || /^[0-9.,-]+$/.test(v), "숫자만 입력 가능합니다"),
  depAmount: zString.refine((v) => !v || /^[0-9.,-]+$/.test(v), "숫자만 입력 가능합니다"),
  unpaidAmount: zString.refine((v) => !v || /^[0-9.,-]+$/.test(v), "숫자만 입력 가능합니다"),
  abandonDate: zDate,
  abandonAmount: zString.refine((v) => !v || /^[0-9.,-]+$/.test(v), "숫자만 입력 가능합니다"),
  abandonContent: zString.refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
  outsourceDate: zDate,
  outsourceContent: zString.refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
  outsourceAmount: zString.refine((v) => !v || /^[0-9,]+$/.test(v), "숫자만 입력 가능합니다").transform((v) => v?.replace(/,/g, "") ?? ""),
  outsourceVat:    zString.refine((v) => !v || /^[0-9,]+$/.test(v), "숫자만 입력 가능합니다").transform((v) => v?.replace(/,/g, "") ?? ""),
  perfDate:        zDate,
  perfAmount:      zString.refine((v) => !v || /^[0-9,]+$/.test(v), "숫자만 입력 가능합니다").transform((v) => v?.replace(/,/g, "") ?? ""),
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
  //  array 핵심
  if (schema instanceof z.ZodArray) {
    return [];
  }

  if (schema instanceof z.ZodBoolean) return false;
  if (schema instanceof z.ZodNumber) return 0;
  if (schema instanceof z.ZodArray) return [];
  if (schema instanceof z.ZodDate) return null;

  return "";
}

export const billDomesticDefaultValues = createDefaultValues(BillDomesticSchema, {
  "invCategory.code": "10"
});



export type BillDomesticFormInput = z.input<typeof BillDomesticSchema> & { billSeq?: string };
export type BillDomesticFormOutput = z.output<typeof BillDomesticSchema> & { billSeq?: string };
