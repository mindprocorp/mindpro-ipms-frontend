import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

/**
 * @description 해외 아웃고잉(Outgoing) 청구서 기본 타입
 * 백엔드 InvoiceRequest.InvoiceOutgoingDetail DTO와 Swagger 명세를 기반으로 합니다.
 */
export type BillOutgoingType = {
  appSeq: string;          // 사건 일련번호
  customerSeq: string;     // 고객사 일련번호
  bizInfoSeq: string;      // 사업자정보 일련번호
  invoiceSeq?: string;     // 청구서 일련번호

  /** @group [1] 공통코드 객체 */
  invCategory: { code: string; codeName: string };    // 청구구분
  invClass: { code: string; codeName: string };       // 청구분류 (내국/해외 등)
  invType: { code: string; codeName: string };        // 청구종류 (100: 출원 등)

  invDate: string;         // 청구일자 (YYYYMMDD)
  invNo: string;           // 청구번호 (OUT-2026-001)
  invSendDate: string;     // 청구발송일

  /** @group [2] 담당자 및 관계자 정보 */
  invMgr: { userSeq: string; userName: string };      // 청구담당자
  customerContact: { userSeq: string; userName: string }; // 고객사 담당자
  foreignAgent: { userSeq: string; userName: string };    // 해외 대리인 (Agent)
  applicant: { userSeq: string; userName: string };       // 출원인
  client: { userSeq: string; userName: string };          // 의뢰인

  /** @group [3] 아웃고잉 참조 정보 (Incoming과 차별점) */
  agentInvDate: string;      // 대리인 인보이스 일자
  debitReceiptDate: string;  // Debit 수령일
  debitNo: string;           // Debit 번호
  ourRef: string;            // 당소 참조번호
  yourRef: string;           // 상대측 참조번호 (Agent Ref)
  clientRef: string;         // 고객사 참조번호
  countryCode: { code: string; codeName: string }; // 국가코드

  /** @group [4] 사건 상세 스펙 (사건 검색 시 바인딩되는 데이터) */
  titleKo: string;           // 국문 명칭
  titleEn: string;           // 영문 명칭
  niceClass: string;         // 나이스 분류
  grade: string;             // 등급 (S, A 등)
  independentClaims: string; // 독립항 수
  dependentClaims: string;   // 종속항 수
  specCount: string;         // 명세서 면수
  drawingCount: string;      // 도면 수
  domesticSpecCount: string; // 국내 명세서 면수

  /** @group [5] 환율 및 송금 정보 (중요 계산 로직 포함) */
  currencyUnit: { code: string; codeName: string }; // 화폐단위 (USD 등)
  exchangeRateDate: string;  // 환율적용일
  exchangeRate: string;       // 환율
  foreignCostAmount: string;  // 외화 비용 (Debit Amount)
  krwAmount: string;          // 원화 환산액
  remitForeignFee: string;    // 송금 외화 수수료
  remitKrwFee: string;        // 송금 원화 수수료

  /** @group [6] 세금계산서 발행 정보 (사업자 정보) */
  taxBillNo: string;         // 세금계산서 번호
  taxBillDate: string;       // 세금계산서 발행일
  taxBillType: { code: string; codeName: string };     // 계산서 종류
  taxBillCategory: { code: string; codeName: string }; // 계산서 구분
  bizName: string;           // 사업자명
  bizCeo: string;            // 대표자명
  bizRegNo: string;          // 사업자번호
  bizWorkplaceNo: string;    // 종사업장번호
  bizAddr: string;           // 사업장주소
  bizType: string;           // 업태
  bizItem: string;           // 종목
  bizContactName: string;    // 담당자명
  bizDeptName: string;       // 담당부서
  bizEmail: string;          // 담당자 이메일

  /** @group [7] 비용 합계 상세 */
  invContent: string;        // 청구내역
  oaDocument?: string;       // OA 서류
  note?: string;             // 비고
  agentInvCategory: { code: string; codeName: string }; // 대리인 비용구분

  govFee: string;            // 관납료
  agencyFee: string;         // 수수료 (당소 실적)
  vat: string;               // 부가세
  etcFee: string;            // 기타비용
  totalInvAmount: string;    // 총 청구금액
  depAmount: string;         // 입금액
  unpaidAmount: string;      // 미수금

  /** @group [8] 사후 관리 및 실적 */
  abandonDate?: string;      // 포기일자
  abandonAmount: string;     // 포기금액
  abandonContent?: string;   // 포기내용
  govFeePayDate?: string;    // 관납료 납부일
  govFeePayAmount: string;   // 관납료 납부액
  outsourceDate?: string;    // 외주 송금일 (대리인 송금)
  outsourceContent?: string; // 외주 내역
  outsourceCost: string;     // 외주 비용
  outsourceVat: string;      // 외주 부가세
  perfDate?: string;         // 실적 인정일
  perfAmount: string;        // 실적 인정금액
};

export type BillOutgoingCreateRequest = BillOutgoingType;
export type BillOutgoingResponse = BillOutgoingType;

/** 목록 조회 요청 DTO */
export type BillOutgoingListRequest = {
  officeSeq?: string;
  searchCondition?: Array<Record<string, string>>;
  textFilters?: Array<Record<string, string>>;
  dateFilters?: Array<Record<string, string>>;
  page: number;
  pageSize: number;
};

/** 목록 조회 응답 DTO */
export type BillOutgoingListResponse = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: BillOutgoingResponse[];
};

/**
 * @description 해외 아웃고잉(Outgoing) 청구 관리 API 서비스
 */
export function billOverseasOutgoingApi(client: ApiClient) {
  return {
    /** 해외 아웃고잉 청구서 신규 등록 */
    createBillOutgoing: async (payload: BillOutgoingCreateRequest): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>("/api/invoice/outgoing", payload);
      return data;
    },

    /** 해외 아웃고잉 상세 조회 */
    getBillOutgoingDetail: async (billSeq: string): Promise<ApiResponse<BillOutgoingResponse>> => {
      const { data } = await client.axios.get<ApiResponse<BillOutgoingResponse>>(
        `/api/invoice/outgoing/${billSeq}`,
      );
      return data;
    },

    /** 해외 아웃고잉 목록 조회 */
    getBillOutgoingList: async (payload: BillOutgoingListRequest): Promise<ApiResponse<BillOutgoingListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<BillOutgoingListResponse>>(
        "/api/invoice/outgoing/list",
        payload,
      );
      return data;
    },

    /** * [POST] 청구 항목별 상세 내역 (Claims) 조회
     * 백엔드 경로가 @PostMapping("/claims/list") 이므로 GET -> POST로 변경
     */
    getBillDetailList: async (payload: any): Promise<ApiResponse<any>> => {
      const { data } = await client.axios.post<ApiResponse<any>>(
        `/api/invoice/claims/list`,
        payload
      );
      return data;
    },

    /** * [GET] 실적 분배 목록 조회
     * 백엔드 경로: @GetMapping("/performance/list/")
     * 주의: 백엔드 경로상 마지막에 /가 붙어있음. @PathVariable이 아닌 RequestParam 혹은 필터 형태 확인 필요
     */
    getPerformanceList: async (payload: any): Promise<ApiResponse<any>> => {
      const { data } = await client.axios.get<ApiResponse<any>>(
        `/api/invoice/performance/list/`,
        { params: payload }
      );
      return data;
    }
  };
}
