import { z } from "zod";
import { zDate, zDateReq, zDecimal, zDecimalReq } from "@shared/schema/utilSchema.ts";

/**
 * @description 해외 아웃고잉(Outgoing) 청구서 유효성 검사 및 타입 정의
 * 백엔드 DTO 및 피그마 UI 항목을 기반으로 국내용 스키마와 형식을 통일했습니다.
 */
const zString = z.preprocess((v) => (v == null ? "" : v), z.string().optional());

export const BillOutgoingSchema = z.object({
  // [1] 식별 및 기본 정보
  appSeq: zString,          // 사건 일련번호
  customerSeq: z.string().min(1, "고객사는 필수 선택입니다"),     // 고객사 일련번호
  customerName: zString.default(""),    // 고객사 명칭 (추가)
  bizInfoSeq: zString,      // 사업자정보 일련번호
  invoiceSeq: zString,      // 청구서 일련번호

  invCategory: z.object({
     code: z.string().min(1, "청구구분코드 필수 선택입니다"),
    codeName: zString
  }), // 청구구분 (견적/가청구/청구 등)

  caseCategory: z.object({
    code: zString,
    codeName: zString
  }).optional(), // 사건구분 (내국/해외)

  invClass: z.object({
    code: z.string().min(1, "청구분류코드 필수 선택입니다"),
    codeName: zString
  }), // 청구분류 (내국/인커밍/아웃고잉)

  invType: z.object({
    code: z.string().min(1, "청구종류코드 필수 선택입니다"),
    codeName: zString
  }), // 청구종류 (출원비용/등록비용 등)

  invDate: zDateReq("청구일을 입력해주세요"), // 청구일
  invNo: z.string().min(1, "청구번호를 입력해주세요"), // 청구번호
  invSendDate: zDateReq("청구서발송일 필수 선택입니다"), // 청구서 발송일

  // [2] 담당자 및 참조 정보
  invMgr: z.object({
    userSeq: zString,
    userName: z.string().min(1, "비용담당자 필수 선택입니다")
  }), // 비용담당자

  customerContact: z.object({
    userSeq: zString.default(""),
    userName: zString.default("")
  }).default({ userSeq: "", userName: "" }), // 고객사 담당자

  foreignAgentName: zString, // 해외 대리인

  applicantName: zString, // 출원인

  deptName: zString, // 부서
  adminMgr: z.object({
    userSeq: zString,
    userName: zString
  }).optional(), // 관리 담당자
  caseMgr: z.object({
    userSeq: zString,
    userName: zString
  }).optional(), // 사건 담당자
  attorney: z.object({
    userSeq: zString,
    userName: zString
  }).optional(), // 담당변리사

  clientName: zString, // 의뢰인

  agentInvDate: zDate, // 대리인 인보이스 일자
  debitReceiptDate: zDate, // DEBIT 접수일
  debitNo: zString, // DEBIT 번호
  ourRef: zString, // 당소 참조번호
  yourRef: zString, // 대리인 참조번호
  clientRef: zString, // 고객사 참조번호
  countryCode: z.object({
    code: zString,
    codeName: zString
  }).optional(), // 국가코드

  // [3] 사건 상세 정보 (피그마 중앙 섹션)
  titleKo: zString, // 국문 명칭
  titleEn: zString, // 영문 명칭
  niceClass: zString, // 나이스 분류
  productClass: zString, // 류(Class) (incoming legacy)
  rightType: z.object({
    code: zString,
    codeName: zString
  }).optional(), // 권리
  appDate: zString, // 출원일
  appNo: zString, // 출원번호
  regDate: zString, // 등록일
  regNo: zString, // 등록번호
  grade: zString, // 등급
  independentClaims: zString, // 독립항 수
  finalClaimsCount: zString, // 독립항 (incoming legacy)
  dependentClaims: zString, // 종속항 수
  overseaSpecCount: zString, // 해외 명세서 면수
  drawingCount: zString, // 도면 수
  figureCount: zString, // 도수 (incoming legacy)
  specCount: zString, // 국내 명세서 면수
  specPage: zString, // 명세서 (incoming legacy)

  // [4] 환율 및 송금 정보 (비용상세 섹션)
  currencyUnit: z.object({
    code: zString,
    codeName: zString
  }), // 화폐단위
  exchangeRateDate: zDate, // 환율 적용일
  exchangeRate: zDecimal,
  foreignCostAmount: zDecimal,
  krwAmount: zDecimal,
  remitForeignFee: zDecimal, // (optional decimal)
  remitKrwFee: zDecimal, // (optional decimal)

  // [5] 당소비용 상세
  invContent: zString, // 청구내용
  oaDocument: zString, // OA 대상 서류
  note: zString, // 비고
  agentInvCategory: z.object({
    code: zString,
    codeName: zString
  }).optional(), // 대리인 비용구분

  govFee: zDecimal,
  foreignGovFee: zDecimal,
  agencyFee: zDecimal,
  foreignAgencyFee: zDecimal,
  vat: zDecimal,
  foreignVat: zDecimal,
  etcFee: zDecimal,
  foreignEtcFee: zDecimal,
  totalInvAmount: zDecimal,
  depAmount: zDecimal,
  unpaidAmount: zDecimal,

  // [6] 세금계산서 정보
  taxBillDate: zDateReq("발행일을 입력해주세요"), // 계산서 발행일
  taxBillNo: z.string().min(1, "발행번호를 입력해주세요"), // 계산서 발행번호
  taxBillType: z.object({
    code: zString,
    codeName: zString
  }).optional(), // 발행구분
  taxBillCategory: z.object({
    code: zString,
    codeName: zString
  }).optional(), // 계산서구분
  bizName: zString, // 상호
  bizCeo: zString, // 대표자
  bizRegNo: zString, // 사업자번호
  bizWorkplaceNo: zString, // 종사업장번호
  bizAddr: zString, // 사업장 주소
  bizType: zString, // 업태
  bizItem: zString, // 종목
  bizContactName: zString, // 담당자
  bizDeptName: zString, // 부서
  bizEmail: zString, // 이메일

  // [7] 사후 관리 및 실적
  abandonDate: zDate, // 포기일자
  abandonAmount: zDecimal, // (F) 포기금액
  abandonContent: zString, // 포기내용
  govFeePayDate: zDate, // 관납료 실제 납부일
  govFeePayAmount: zDecimal, // 관납료 실제 납부액
  outsourceDate: zDate, // 외주 송금일
  outsourceContent: zString, // 외주 내역
  outsourceCost: zDecimal, // 실제 지출 외주비용
  outsourceVat: zDecimal, // 외주 부가세
  perfDate: zDate, // 실적 인정일
  perfAmount: zDecimal, // 실적 인정금액
});

/**
 * 기본값 생성 함수 (제공해주신 국내용 유틸리티 로직과 동일)
 */
function createDefaultValues(
  schema: z.ZodTypeAny,
  overrides: Record<string, any> = {},
  path: string = "",
): any {
  const typeName = (schema._def as any)?.typeName;

  if (typeName === "ZodEffects" || schema.constructor.name === "ZodEffects") {
    return createDefaultValues((schema as any).innerType() as z.ZodTypeAny, overrides, path);
  }
  if (typeName === "ZodOptional" || typeName === "ZodNullable" || schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return createDefaultValues((schema as any).unwrap() as z.ZodTypeAny, overrides, path);
  }
  if (typeName === "ZodObject" || schema instanceof z.ZodObject) {
    const shape = (schema as any).shape;
    return Object.fromEntries(
      Object.entries(shape).map(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (currentPath in overrides) return [key, overrides[currentPath]];
        return [key, createDefaultValues(value as z.ZodTypeAny, overrides, currentPath)];
      }),
    );
  }
  if (schema instanceof z.ZodArray) return [];
  if (schema instanceof z.ZodBoolean) return false;
  if (schema instanceof z.ZodNumber) return 0;
  if (schema instanceof z.ZodDate) return null;
  return "";
}

export const billOutgoingDefaultValues = createDefaultValues(BillOutgoingSchema, {
  "invCategory.code": "20",
  "caseCategory.code": "O"
});

export type BillOutgoingFormInput = z.input<typeof BillOutgoingSchema>;
export type BillOutgoingFormOutput = z.output<typeof BillOutgoingSchema>;
