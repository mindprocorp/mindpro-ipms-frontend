import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

/** * [공통] 백엔드 BaseSearchRequest DTO 대응 타입
 */
export type BillTabListRequest = {
  tblSeq: string;       // ★ 필수: 대상 청구서 일련번호 (invoiceSeq)
  searchCondition?: Array<Record<string, string>>;
  textFilters?: Array<Record<string, string>>;
  dateFilters?: Array<Record<string, string>>;
  page: number;
  pageSize: number;
};

/** [공통] 백엔드 BaseSearchResponse 대응 타입 */
export type BillTabListResponse<T> = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: T[];
};

/* =========================================================================
 * 탭별 데이터 상세 타입 정의 (Queries에서 임포트하는 타입들)
 * ========================================================================= */

/** [탭 1] 청구 상세 내역 타입 */
export type BillClaimDetailType = {
  invoiceSeq: string;
  invoiceClaimSeq?: string;
  costCategory: { code: string; codeName: string };
  itemContent: string;
  unitPrice: string;
  quantity: string;
  amount: string;
  vatAmount: string;
  totalAmount: string;
  note: string;
  unit: { code: string; codeName: string };
  claimKind?: string;
};

/** [탭 2] 입금 및 선수금 타입 */
export type BillBankingDetailType = {
  invoiceSeq: string;
  bankingSeq?: string;
  bankingDate: string;
  bankingCategory: { code: string; codeName: string };
  amount: string;
  memo: string;
};

/** [탭 3] 실적 분배 타입 */
export type BillPerformanceDetailType = {
  invoiceSeq: string;
  performanceSeq?: string;
  staff: { userSeq: string; userName: string };
  performanceCategory: { code: string; codeName: string };
  deptCategory: string;
  performanceContent: string;
  performancePerfDate: string;
  performanceAmount: string;
  shareRatio: string;
  note: string;
};

/**
 * @description 청구서 공통 탭(Claims, Banking, Performance) API 서비스
 */
export function billTabsApi(client: ApiClient) {

  /** * BaseSearchRequest 필수 필드 및 빈 배열([]) 기본값 할당 함수
   */
  const createSearchPayload = (
    tblSeq: string,
    payload?: Partial<Omit<BillTabListRequest, 'tblSeq'>>
  ): BillTabListRequest => ({
    tblSeq,
    page: 1,
    pageSize: 20,
    ...payload,
  });

  return {
    /* -------------------------------------------------------------------------
     * [탭 1] 청구 상세 내역 (Claim)
     * ------------------------------------------------------------------------- */
    getClaimList: async (tblSeq: string, payload?: Partial<BillTabListRequest>): Promise<ApiResponse<BillTabListResponse<BillClaimDetailType>>> => {
      const requestBody = createSearchPayload(tblSeq, payload);
      const { data } = await client.axios.post("/api/invoice/claims/list", requestBody);
      return data;
    },
    //   단건 조회 추가
    getClaimItem: async (claimSeq: string): Promise<ApiResponse<BillClaimDetailType>> => {
      const { data } = await client.axios.get(`/api/invoice/claims/detail/${claimSeq}`);
      return data;
    },
    saveClaimList: async (invoiceSeq: string, dataList: BillClaimDetailType[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post(`/api/invoice/claims/save-all/${invoiceSeq}`, dataList);
      return data;
    },
    saveClaimItem: async (payload: BillClaimDetailType): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(`/api/invoice/claims`, payload);
      return data;
    },

    /* -------------------------------------------------------------------------
     * [탭 1-서브] 대리인 청구 내역 (Agent Claims)
     * ------------------------------------------------------------------------- */
    //   대리인 목록 조회
    getAgentClaimList: async (tblSeq: string, payload?: Partial<BillTabListRequest>): Promise<ApiResponse<BillTabListResponse<BillClaimDetailType>>> => {
      const requestBody = createSearchPayload(tblSeq, payload);
      const { data } = await client.axios.post("/api/invoice/agentClaims/list", requestBody);
      return data;
    },

    //   대리인 단건 조회
    getAgentClaimItem: async (claimSeq: string): Promise<ApiResponse<BillClaimDetailType>> => {
      const { data } = await client.axios.get(`/api/invoice/agentClaims/detail/${claimSeq}`);
      return data;
    },

    //   대리인 단건 저장
    saveAgentClaimItem: async (payload: BillClaimDetailType): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post("/api/invoice/agentClaims", payload);
      return data;
    },

    /* -------------------------------------------------------------------------
     * [탭 2] 입금 및 선수금 (Banking)
     * ------------------------------------------------------------------------- */
    getBankingList: async (tblSeq: string, payload?: Partial<BillTabListRequest>): Promise<ApiResponse<BillTabListResponse<BillBankingDetailType>>> => {
      const requestBody = createSearchPayload(tblSeq, payload);
      const { data } = await client.axios.post(`/api/invoice/banking/list`, requestBody);
      return data;
    },
    //   단건 조회 추가
    getBankingItem: async (bankingSeq: string): Promise<ApiResponse<BillBankingDetailType>> => {
      const { data } = await client.axios.get(`/api/invoice/banking/detail/${bankingSeq}`);
      return data;
    },
    saveBankingList: async (invoiceSeq: string, dataList: BillBankingDetailType[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post(`/api/invoice/banking/save-all/${invoiceSeq}`, dataList);
      return data;
    },
    saveBankingItem: async (payload: any): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post(`/api/invoice/banking`, payload);
      return data;
    },

    // 해외 송금 내역 단건 조회
    getForeignBankingList: async (tblSeq: string, payload?: Partial<BillTabListRequest>): Promise<ApiResponse<BillTabListResponse<BillBankingDetailType>>> => {
      const requestBody = createSearchPayload(tblSeq, payload);
      const { data } = await client.axios.post(`/api/invoice/foreign-banking/list`, requestBody);
      return data;
    },
    //   단건 조회 추가
    getForeignBankingItem: async (bankingSeq: string): Promise<ApiResponse<any>> => {
      const { data } = await client.axios.get(`/api/invoice/foreign-banking/detail/${bankingSeq}`);
      return data;
    },
    saveForeignBankingList: async (invoiceSeq: string, dataList: BillBankingDetailType[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post(`/api/invoice/foreign-banking/save-all/${invoiceSeq}`, dataList);
      return data;
    },
    saveForeignBankingItem: async (payload: any): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post(`/api/invoice/foreign-banking`, payload);
      return data;
    },

    /* -------------------------------------------------------------------------
     * [탭 3] 실적 분배 (Performance)
     * ------------------------------------------------------------------------- */
    getPerformanceList: async (invoiceSeq: string, payload?: Partial<BillTabListRequest>): Promise<ApiResponse<BillTabListResponse<BillPerformanceDetailType>>> => {
      const requestBody = createSearchPayload(invoiceSeq, payload);
      const { data } = await client.axios.post(`/api/invoice/performance/list`, requestBody);
      return data;
    },
    //   단건 조회 추가
    getPerformanceItem: async (performanceSeq: string): Promise<ApiResponse<BillPerformanceDetailType>> => {
      const { data } = await client.axios.get(`/api/invoice/performance/detail/${performanceSeq}`);
      return data;
    },
    savePerformanceList: async (invoiceSeq: string, dataList: BillPerformanceDetailType[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post(`/api/invoice/performance/save-all/${invoiceSeq}`, dataList);
      return data;
    },
    savePerformanceItem: async (payload: BillPerformanceDetailType): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post(`/api/invoice/performance`, payload);
      return data;
    },

    // ========== 삭제 APIs ==========
    // 청구 상세 삭제
    deleteClaim: async (claimSeq: string): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete(`/api/invoice/claims/${claimSeq}`);
      return data;
    },

    // 청구 상세 일괄 삭제
    deleteClaimList: async (invoiceSeq: string, claimSeqs: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post(`/api/invoice/claims/delete-list/${invoiceSeq}`, claimSeqs);
      return data;
    },

    // 입출금 삭제
    deleteBanking: async (bankingSeq: string): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete(`/api/invoice/banking/${bankingSeq}`);
      return data;
    },

    // 입출금 일괄 삭제
    deleteBankingList: async (invoiceSeq: string, bankingSeqs: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post(`/api/invoice/banking/delete-list/${invoiceSeq}`, bankingSeqs);
      return data;
    },

    // 실적 분배 삭제
    deletePerformance: async (performanceSeq: string): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete(`/api/invoice/performance/${performanceSeq}`);
      return data;
    },

    // 실적 분배 일괄 삭제
    deletePerformanceList: async (invoiceSeq: string, performanceSeqs: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post(`/api/invoice/performance/delete-list/${invoiceSeq}`, performanceSeqs);
      return data;
    },

    // 청구서 일괄 삭제 (메인 목록용)
    deleteInvoiceList: async (invoiceSeqs: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post(`/api/invoice/delete-list`, invoiceSeqs);
      return data;
    },

  };
}
