import { apiClient } from "../client";
import type { HistorySearchColType } from "../../../pages/history/list/columns/columnsData";

export interface BaseSearchResponse<T> {
  list: T[];
  totalCount: number;
  totalPage: number;
  size: number;
  page: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type BaseSearchRequest = {
  tblSeq?: string;
  page?: number;
  pageSize?: number;
  offSet?: number;
  searchCondition?: Array<Record<string, string>>;
  textFilters?: Array<Record<string, string>>;
  dateFilters?: Array<Record<string, string>>;
};

export const historyApi = {
  searchList: async (params: BaseSearchRequest) => {
    const { data } = await apiClient.axios.post<ApiResponse<BaseSearchResponse<HistorySearchColType>>>(
      "/api/history/list/search",
      params
    );
    return data.data;
  },
};
