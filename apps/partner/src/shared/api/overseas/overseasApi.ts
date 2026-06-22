import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";
import type { OverseasBasicListItem } from "@shared/api/overseas/basicApi.ts";


export type OverseasListRequest = {
  officeSeq?: string;
  offSet?: number;
  searchCondition?: Array<Record<string, string>>;
  textFilters?: Array<Record<string, string>>;
  dateFilters?: Array<Record<string, string>>;
  page: number;
  pageSize: number;
};

export type OverseasListResponse = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: OverseasListItem[];
};

export type OverseasListItem = {
  appSeq: string;
  appRoute: {
    code: string;
    codeName: string;
  };
  rightType: {
    code: string;
    codeName: string;
  };
  receiptDate: string;
  category: {
    code: string;
    codeName: string;
  };
  countryCode: {
    code: string;
    codeName: string;
  };
  ourRef: string;
  caseDeadline: string;
  status: {
    code: string;
    codeName: string;
  };
  clientInfo: {
    userSeq: string;
    userName: string;
  };
  applicantInfo: {
    userSeq: string;
    userName: string;
  };
  appDate: string;
  appNo: string;
  regDate: string;
};

export function overseasApi(client: ApiClient) {
  return {
    getOverseasList: async (
      overseasListRequest: OverseasListRequest,
    ): Promise<ApiResponse<OverseasListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<OverseasListResponse>>(
        "/api/oversea/list",overseasListRequest
      );
      return data;
    },
  };
}
