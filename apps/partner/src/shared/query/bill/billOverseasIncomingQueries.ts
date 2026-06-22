import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  billOverseasIncomingApi,
  type BillIncomingCreateRequest,
  type BillIncomingListRequest,
} from "@shared/api/bill/billOverseasIncomingApi.ts";

/**
 * @description 해외 인커밍(Overseas Incoming) 청구서 기본 정보 관련 React Query Mutation 옵션들입니다.
 * 하위 공통 탭(Claims, Banking, Performance)은 billTabsQueries를 사용하세요.
 */
export const billOverseasIncomingQueries = {
  /* =========================================================================
   * [1] 인커밍 기본 정보 (Master)
   * ========================================================================= */

  /** 인커밍 청구서 저장 (등록 및 수정) */
  createBillIncoming: () =>
    mutationOptions({
      mutationFn: (payload: BillIncomingCreateRequest) =>
        billOverseasIncomingApi(apiClient).createBillIncoming(payload),
    }),

  /** 인커밍 청구서 상세 단건 조회 */
  getBillIncomingDetail: () =>
    mutationOptions({
      mutationFn: (billSeq: string) =>
        billOverseasIncomingApi(apiClient).getBillIncomingDetail(billSeq),
    }),

  /** 인커밍 청구서 목록 검색 조회 */
  getBillIncomingList: () =>
    mutationOptions({
      mutationFn: (payload: BillIncomingListRequest) =>
        billOverseasIncomingApi(apiClient).getBillIncomingList(payload),
    }),

  /* =========================================================================
   * [참고] 하위 탭 정보 (공통 API 사용 권장)
   * =========================================================================
   * 기존에 이곳에 있던 getBillDetailList, getBankingList, getPerformanceList는
   * 유지보수를 위해 'billTabsQueries'를 임포트하여 통합 사용하는 것을 권장합니다.
   * 필요 시 아래에 직접 정의할 수도 있지만, billTabsQueries와 형식을 맞췄습니다.
   */
};
