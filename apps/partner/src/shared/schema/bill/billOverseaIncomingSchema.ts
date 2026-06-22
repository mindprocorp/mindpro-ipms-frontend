import type CustomerBottom from "@pages/customer-mng/detail/_components/CustomerBottom";
import { z } from "zod";
import { zDate, zDateReq, zDecimal } from "@shared/schema/utilSchema.ts";

/**
 * @description 해외 인커밍(Incoming) 청구서 유효성 검사 및 타입 정의
 * 해외 대리인으로부터 온 비용 청구서를 시스템에 등록하기 위한 규격입니다.
 */
const zString = z.preprocess((v) => (v == null ? "" : v), z.string().optional());

export const BillIncomingSchema = z.object({
  // [0] 시스템 관리 데이터 (Hidden 또는 읽기 전용)
  appSeq: zString,          // 사건(Application) 일련번호
  customerSeq: zString,     // 고객사 일련번호
  bizInfoSeq: zString,      // 사업자 정보 일련번호
  invoiceSeq: zString,      // 청구서(Invoice) 마스터 일련번호

  // [1] 청구 기본 사항 (필수 입력 항목)
  invCategory: z.object({                  // 청구구분 (예: 견적, 정식청구 등)
    code: z.string().min(1, "청구구분코드 필수 선택입니다"),
    codeName: zString,
  }),
  caseCategory: z.object({                 // 사건구분 (예: 국내, 해외, 인커밍 등)
    code: z.string().min(1, "사건구분(국내외) 필수 선택입니다"),
    codeName: zString,
  }),
  invClass: z.object({                     // 청구분류 (예: 출원, 중간사건, 등록 등 비용의 대분류)
    code: z.string().min(1, "청구분류코드 필수 선택입니다"),
    codeName: zString,
  }),
  invType: z.object({                      // 청구종류 (예: 수수료, 관납료, 번역료 등 세부 항목)
    code: z.string().min(1, "청구종류코드 필수 선택입니다"),
    codeName: zString,
  }),

  invDate: zDateReq("청구일 필수 선택입니다"),      // 청구서에 기재된 날짜
  invNo: z.string().min(1, "청구번호 필수 선택입니다"),                                       // 청구서 번호 (Invoice Number)
  invSendDate: zDateReq("청구서발송일 필수 선택입니다"), // 청구서를 발송/수령한 날짜

  // [담당자 정보]
  invMgr: z.object({                       // 청구/비용 담당자 (사내)
    userSeq: zString,
    userName: z.string().min(1, "청구담당자 필수 선택입니다"),
  }),
  adminMgr: z.object({                     // 관리 담당자
    userSeq: zString,
    userName: zString,
  }),
  caseMgr: z.object({                      // 사건 담당자 (실무자)
    userSeq: zString,
    userName: zString,
  }),
  attorney: z.object({                     // 담당 변리사
    userSeq: zString,
    userName: z.string().min(1, "담당변리사 필수 선택입니다"),
  }),
  customerContact: z.object({              // 고객사측 담당자 (청구서를 받을 사람)
    userSeq: zString.default(""),
    userName: zString.default(""),
  }).default({ userSeq: "", userName: "" }),

  invContent: zString, // 청구 사유 및 내용 요약
  clientRef: zString,        // 고객사 관리번호 (Client Reference Number)
  deptName: zString,        // 담당 부서명
  oaDocument: zString,      // 관련 OA(거절이유통지) 또는 대상 서류명
  note: zString,            // 기타 비고 사항

  // [2] UI 렌더링용 사건 정보 (사건 마스터에서 로드되는 정보, 비필수)
  rightType: z.preprocess(                  // 지식재산권 종류 (특허, 상표, 디자인 등)
    (val) => (typeof val === "string" || !val ? { code: "", codeName: "" } : val),
    z.object({
      code: zString,
      codeName: zString,
    })
  ).default({ code: "", codeName: "" }),

  country: z.preprocess(                   // 대상 국가
    (val) => (typeof val === "string" || !val ? { code: "", codeName: "" } : val),
    z.object({
      code: zString,
      codeName: zString,
    })
  ).default({ code: "", codeName: "" }),

  applicantName: zString, // 출원인 명칭
  foreignAgentName: zString,   // 해외 대리인 명칭

  customer: z.object({
    customerSeq: z.string().min(1, "고객사는 필수 선택입니다"),
    customerName: zString,
  }),

  caseCategoryCode: z.preprocess(          // 사건 상세 구분 코드
    (val) => (typeof val === "string" || !val ? { code: "", codeName: "" } : val),
    z.object({
      code: zString,
      codeName: zString,
    })
  ).optional(),

  // [사건 상세 데이터]
  appDate: zString,           // 출원일
  appNo: zString,            // 출원번호
  regDate: zString,           // 등록일
  regNo: zString,            // 등록번호
  grade: zString,            // 사건 등급
  finalClaimsCount: zString, // 독립항 수
  dependentClaims: zString,  // 종속항 수
  specPage: zString,         // 명세서 페이지 수
  drawingCount: zString,     // 도면 수
  figureCount: zString,      // 도수(Figures)
  clientName: zString,                  // 의뢰인 명칭
  titleKo: zString,          // 발명의 명칭 (국문)
  titleEn: zString,          // 발명의 명칭 (영문)
  productClass: zString,     // 상품류 (상표의 경우)
  ourRef: zString,           // 당소 관리번호 (Our Reference Number)

  // [3] 환율 및 통화 정보
  currencyUnit: z.object({                             // 화폐 단위 (USD, EUR, JPY 등)
    code: zString,
    codeName: zString,
  }),
  exchangeRateDate: zDate, // 환율 기준일

  exchangeRate: zDecimal,
  foreignCostAmount: zDecimal,
  krwAmount: zDecimal,
  // 환차손익: zDecimal(음수/콤마/소수점 허용 + 백엔드 전송 시 콤마 제거)
  exchangeDiffAmount: zDecimal,

  // [4] 비용 세부 내역 (숫자 연산을 위해 문자열로 관리)
  govFee: zDecimal,
  foreignGovFee: zDecimal,
  agencyFee: zDecimal,
  foreignAgencyFee: zDecimal,
  vat: zDecimal,
  foreignVat: zDecimal,
  transFee: zDecimal,
  foreignTransFee: zDecimal,
  etcFee: zDecimal,
  foreignEtcFee: zDecimal,

  totalInvAmount: zDecimal,
  depAmount: zDecimal,
  unpaidAmount: zDecimal,

  // [5] 사후 관리 및 납부 정보
  abandonDate: zDate,        // 포기일 (사건 포기 시)
  abandonContent: zString,               // 포기 사유
  abandonAmount: zDecimal,

  govFeePayDate: zDate,      // 관납료 납부일
  govFeePayAmount: zDecimal,
  vatPayDate: zDate,         // 부가세 납부/발행일

  outsourceDate: zDate,      // 외주 송금일 (해외 대리인에게 송금한 날)
  outsourceContent: zString,             // 외주 관련 메모
  outsourceCost: zDecimal,

  perfDate: zDate,           // 실적 인정일
  perfAmount: zDecimal,
});

/**
 * @description 기본값 생성 함수
 */
function createDefaultValues(schema: z.ZodTypeAny, overrides: Record<string, any> = {}, path: string = ""): any {
  if (path in overrides) return overrides[path];
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    return Object.fromEntries(
      Object.entries(shape).map(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        return [key, createDefaultValues(value as z.ZodTypeAny, overrides, currentPath)];
      }),
    );
  }
  if (schema instanceof z.ZodArray) return [];
  const schemaDef = (schema as any)._def;
  if (schemaDef?.typeName === "ZodOptional" || schemaDef?.typeName === "ZodNullable") {
    return createDefaultValues((schema as any).unwrap(), overrides, path);
  }
  if (schemaDef?.typeName === "ZodDefault") return schemaDef.defaultValue();
  if (schemaDef?.typeName === "ZodEffects") return createDefaultValues((schema as any).innerType(), overrides, path);
  if (schema instanceof z.ZodBoolean) return false;
  if (schema instanceof z.ZodNumber) return 0;
  if (schema instanceof z.ZodDate) return null;
  return "";
}

export const billIncomingDefaultValues = createDefaultValues(BillIncomingSchema, {
  "invCategory.code": "10",
  "caseCategory.code": "I"
});

export type BillIncomingFormInput = z.input<typeof BillIncomingSchema>;
export type BillIncomingFormOutput = z.output<typeof BillIncomingSchema>;
