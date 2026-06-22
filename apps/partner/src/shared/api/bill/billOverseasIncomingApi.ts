import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

/**
 * @description 공통 코드 데이터 구조 (서버 응답 대응)
 */
type CodeInfo = {
  code: string | null;
  codeName: string | null;
};

/**
 * @description 사용자/담당자 데이터 구조 (서버 응답 대응)
 */
type PersonInfo = {
  userSeq: string | null;
  userName: string | null;
};

/**
 * @description 해외 인커밍(Incoming) 청구서 기본 타입
 */
export type BillIncomingType = {
  appSeq: string;
  customerSeq: string;
  bizInfoSeq: string;
  invoiceSeq?: string;

  /** @group 공통코드 객체 (선택적 프로퍼티로 변경하여 에러 방지) */
  invCategory?: CodeInfo;
  invClass?: CodeInfo;
  invType?: CodeInfo;
  caseCategory?: CodeInfo;
  caseCategoryCode?: CodeInfo; // 서버 응답 필드명 대응

  invDate: string;
  invNo: string;
  invSendDate: string;

  /** @group 담당자 정보 (null 허용 구조) */
  invMgr?: PersonInfo;
  adminMgr?: PersonInfo;
  caseMgr?: PersonInfo;
  attorney?: PersonInfo;
  customerContact?: PersonInfo;

  invContent: string;
  clientRef?: string;
  deptName?: string;
  oaDocument?: string;
  note?: string;

  /** @group 환율 정보 */
  currencyUnit?: CodeInfo;
  exchangeRateDate: string;
  exchangeRate: string;
  foreignCostAmount: string;
  krwAmount: string;
  exchangeDiffAmount: string;

  /** @group 당소비용 상세 */
  govFee: string;
  agencyFee: string;
  vat: string;
  transFee: string;
  etcFee: string;

  /** @group 합계 및 잔액 */
  totalInvAmount: string;
  depAmount: string;
  unpaidAmount: string;

  /** @group 사후 관리 및 조회 전용 필드 */
  abandonDate?: string | null;
  abandonContent?: string;
  abandonAmount: string;

  govFeePayDate?: string | null;
  govFeePayAmount: string;
  vatPayDate?: string | null;

  outsourceDate?: string | null;
  outsourceContent?: string;
  outsourceCost: string;

  perfDate?: string | null;
  perfAmount: string;

  // UI 렌더링용 추가 필드들 (DefaultInfo 대응)
  rightType?: CodeInfo;
  country?: CodeInfo;
  applicantName?: CodeInfo;
  customerName?: CodeInfo;
  appDate?: string | null;
  appNo?: string | null;
  regDate?: string | null;
  regNo?: string | null;
  grade?: string | null;
  finalClaimsCount?: string;
  dependentClaims?: string;
  specPage?: string;
  drawingCount?: string;
  figureCount?: string;
  titleKo?: string | null;
  titleEn?: string | null;
  productClass?: string | null;
  ourRef?: string | null;
};

export type BillIncomingCreateRequest = BillIncomingType;
export type BillIncomingResponse = BillIncomingType;

export type BillIncomingListRequest = {
  officeSeq?: string;
  searchCondition?: Array<Record<string, string>>;
  textFilters?: Array<Record<string, string>>;
  dateFilters?: Array<Record<string, string>>;
  page: number;
  pageSize: number;
};

export type BillIncomingListResponse = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: BillIncomingResponse[];
};

/**
 * @description 해외 인커밍(Incoming) 청구 관리 API 서비스
 */
export function billOverseasIncomingApi(client: ApiClient) {
  return {
    /** [POST] 해외 인커밍 청구서 신규 등록 */
    createBillIncoming: async (payload: BillIncomingCreateRequest): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>("/api/invoice/incoming", payload);
      return data;
    },

    /** [GET] 해외 인커밍 청구서 상세 조회 */
    getBillIncomingDetail: async (billSeq: string): Promise<ApiResponse<BillIncomingResponse>> => {
      const { data } = await client.axios.get<ApiResponse<BillIncomingResponse>>(
        `/api/invoice/incoming/${billSeq}`,
      );
      return data;
    },

    /** [POST] 해외 인커밍 청구서 목록 조회 */
    getBillIncomingList: async (payload: BillIncomingListRequest): Promise<ApiResponse<BillIncomingListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<BillIncomingListResponse>>(
        "/api/invoice/incoming/list",
        payload,
      );
      return data;
    },

    /** [POST] 청구 항목별 세부 Claims 내역 조회 */
    getBillDetailList: async (payload: any): Promise<ApiResponse<any>> => {
      const { data } = await client.axios.post<ApiResponse<any>>(
        `/api/invoice/claims/list`,
        payload
      );
      return data;
    },
  };
}
