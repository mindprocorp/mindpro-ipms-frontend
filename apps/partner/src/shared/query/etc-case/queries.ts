import {
  etcCaseApi,
  type EtcCaseListRequest,
  type EtcCaseDetailRequest,
  type EtcCaseCreateRequest,
} from "../../api/etc-case/etcCaseApi";
import { apiClient } from "../../api/client";
import { mutationOptions } from "@tanstack/react-query";

export const etcCaseQueries = {
  // 기타사건 리스트 검색 조회
  searchList: () =>
    mutationOptions({
      mutationFn: (payload?: EtcCaseListRequest) =>
        etcCaseApi(apiClient).searchList(payload),
    }),

  // 기타사건 상세 조회
  detail: () =>
    mutationOptions({
      mutationFn: (payload: EtcCaseDetailRequest) =>
        etcCaseApi(apiClient).getDetail(payload),
    }),

  // 기타사건 등록/수정 (백엔드 POST 단일 처리)
  create: () =>
    mutationOptions({
      mutationFn: (payload: EtcCaseCreateRequest) =>
        etcCaseApi(apiClient).create(payload),
    }),

  // 기타사건 이미지 삭제
  deleteConflictFile: () =>
    mutationOptions({
      mutationFn: (payload: { conflictSeq: string; fileSeq: string }) =>
        etcCaseApi(apiClient).deleteConflictFile(payload),
    }),
};
