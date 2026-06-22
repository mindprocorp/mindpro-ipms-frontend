import {
  objectionTrialApi,
  type ObjectionTrialListRequest,
  type ObjectionTrialDetailRequest,
  type ObjectionTrialCreateRequest,
} from "../../api/objection-trial/objectionTrialApi";
import { apiClient } from "../../../shared/api/client";
import { queryOptions, mutationOptions } from "@tanstack/react-query";

export const objectionTrialQueries = {
  // 이의심판 리스트 검색 조회
  searchList: () =>
    mutationOptions({
      mutationFn: (payload: ObjectionTrialListRequest) =>
        objectionTrialApi(apiClient).searchList(payload),
    }),

  // 이의심판 상세 조회
  detail: () =>
    mutationOptions({
      mutationFn: (payload: ObjectionTrialDetailRequest) =>
        objectionTrialApi(apiClient).getDetail(payload),
    }),

  // 이의심판 등록
  create: () =>
    mutationOptions({
      mutationFn: (payload: ObjectionTrialCreateRequest) =>
        objectionTrialApi(apiClient).create(payload),
    }),

  // 이미지 삭제
  deleteConflictFile: () =>
    mutationOptions({
      mutationFn: (payload: { conflictSeq: string; fileSeq: string }) =>
        objectionTrialApi(apiClient).deleteConflictFile(payload),
    }),
};
