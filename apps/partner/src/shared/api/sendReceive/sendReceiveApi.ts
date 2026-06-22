import type { ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";
import type { BillDetailListType } from "@shared/api/bill/billDomesticApi.ts";

export type SendReceiveListResponse = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list:   SendReceiveListType[];
};

// 접발송내역 응답
export type SendReceiveListType = {
  appSeq: string;           // 출원 키 (상세 이동용)
  conflictSeq: string;      //심판키
  caseCategoryName: string; // 사건구분 (내국/외국)
  progressTypeName: string; // 구분 (접수/발송)
  rightType: {
    code: string;
    codeName: string;
  }    // 권리 (특허/상표 등)
  ourRef: string;           // OurRef
  appDate: string;          // 출원일
  appNo: string;            // 출원번호
  regDate: string;          // 등록일
  regNo: string;            // 등록번호
  productClass: string;     // 분류 (분류/분류코드)
  eventDate: string;        // 일자 (접수/발송일)
  content: string;          // 내용 (서류명)
  applicantName: string;    // 출원인
  titleKo: string;           // 국문명칭
}

import type { BaseSearchRequest } from "@shared/api/types";

// 접발송내역 요청
export type SendReceiveListRequest = BaseSearchRequest & {
  page: number; // 페이지
  pageSize: number; // 페이지사이즈
};

export function SendRequestApi(client: ApiClient) {
  return {
    // 접발송내역 리스트
    getSendReceiveList: async (payload: SendReceiveListRequest): Promise<ApiResponse<SendReceiveListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<SendReceiveListResponse>>(
        `/api/duedate/progress-history/list`,
        payload,
      );
      return data;
    },
  };
}