import { mutationOptions } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { dispatchApi, type DispatchDetail } from "../../api/dispatch/dispatchApi";
import type { BaseSearchRequest } from "../../api/types";

export const dispatchQueries = {
  /**
   * 문서수발 목록 검색 조회
   */
  searchList: () =>
    mutationOptions({
      mutationFn: (payload: BaseSearchRequest) =>
        dispatchApi(apiClient).searchList(payload),
    }),

  /**
   * 문서수발 저장 (등록/수정)
   */
  save: () =>
    mutationOptions({
      mutationFn: (payload: DispatchDetail) =>
        dispatchApi(apiClient).save(payload),
    }),

  /**
   * 문서수발 삭제
   */
  delete: () =>
    mutationOptions({
      mutationFn: (dispatchSeq: string) =>
        dispatchApi(apiClient).delete(dispatchSeq),
    }),

  /**
   * 문서수발 일괄 삭제
   */
  deleteList: () =>
    mutationOptions({
      mutationFn: (ids: string[]) =>
        dispatchApi(apiClient).deleteList(ids),
    }),
};
