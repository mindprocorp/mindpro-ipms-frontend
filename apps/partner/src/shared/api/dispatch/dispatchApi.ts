import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";
import type { BaseSearchRequest, BaseSearchResponse } from "@shared/api/types";

export type DispatchDetail = {
  dispatchSeq?: string;
  category?: string;
  docType?: string;
  dispatchDate?: string;
  client?: string;
  manager?: string;
  docContent?: string;
  method?: string;
  sendDate?: string;
  regNo?: string;
  ackYn?: string;
  postAddr?: string;
  note?: string;
  uploadDate?: string;
  uploadUserName?: string;
};

/**
 * 문서수발 API 클라이언트
 */
export function dispatchApi(client: ApiClient) {
  return {
    /**
     * 문서수발 목록 조회 (검색)
     */
    searchList: async (payload: BaseSearchRequest): Promise<ApiResponse<BaseSearchResponse<DispatchDetail>>> => {
      const { data } = await client.axios.post<ApiResponse<BaseSearchResponse<DispatchDetail>>>(
        "/api/dispatch/list",
        payload
      );
      return data;
    },

    /**
     * 문서수발 저장 (등록/수정)
     */
    save: async (payload: DispatchDetail): Promise<ApiResponse<DispatchDetail>> => {
      const { data } = await client.axios.post<ApiResponse<DispatchDetail>>(
        "/api/dispatch",
        payload
      );
      return data;
    },

    /**
     * 문서수발 삭제
     */
    delete: async (dispatchSeq: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/dispatch/${dispatchSeq}`
      );
      return data;
    },

    /**
     * 문서수발 일괄 삭제
     */
    deleteList: async (ids: string[]): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/dispatch/delete-list",
        ids
      );
      return data;
    },
  };
}
