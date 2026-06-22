import {
  duedateApi,
  type DueDateListRequest,
  type DueDateRegisterRequest,
} from "../../api/duedate/duedateApi";
import { apiClient } from "../../../shared/api/client";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export const duedateQueries = {
  // 기일 리스트 조회 (mutation - 직접 호출용)
  searchList: () =>
    mutationOptions({
      mutationFn: (payload: Partial<DueDateListRequest>) =>
        duedateApi(apiClient).searchList(payload),
    }),

  // 기일 리스트 조회 (query - queryKey와 payload를 분리하여 key 변경 시 자동 재조회)
  searchQuery: (queryKey: readonly unknown[], payload: Partial<DueDateListRequest> & Record<string, any>, enabled = true) =>
    queryOptions({
      queryKey: ["duedate", "list", ...queryKey],
      queryFn: () => duedateApi(apiClient).searchList(payload),
      enabled,
    }),

  // 다가오는 기일 조회
  upcoming: () =>
    mutationOptions({
      mutationFn: (officeSeq: string) =>
        duedateApi(apiClient).getUpcoming(officeSeq),
    }),

  // 기일 완료 처리 (Y/N 토글)
  complete: () =>
    mutationOptions({
      mutationFn: ({ duedateSeq, completeYn, dueTypeCategoryCode }: { duedateSeq: string; completeYn: string; dueTypeCategoryCode: string }) =>
        duedateApi(apiClient).complete(duedateSeq, completeYn, dueTypeCategoryCode),
    }),

  // 기일 등록
  register: () =>
    mutationOptions({
      mutationFn: (payload: DueDateRegisterRequest) =>
        duedateApi(apiClient).register(payload),
    }),
};
