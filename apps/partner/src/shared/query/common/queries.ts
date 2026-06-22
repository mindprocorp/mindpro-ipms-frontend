import {
  type CodeRequestType,
  type CodeRequestTypeNew,
  type CodeGroupSaveRequest,
  type CodeDtlSaveVO,
  type SearchConditionSaveRequest,
  type SearchAppListRequest,
  type UserUpdateRequest,
  type ChangePasswordRequest,
  commAPI,
  type CountryItem,
} from "../../api/common/commApi.ts";
import { apiClient } from "../../../shared/api/client";
import { mutationOptions } from "@tanstack/react-query";

export const commonQueries = {
  getCommonCode: () =>
    mutationOptions({
      mutationFn: (payload: CodeRequestType) => commAPI(apiClient).getCommonCode(payload),
    }),
  getUserInfo: () =>
    mutationOptions({
      mutationFn: () => commAPI(apiClient).getUserInfo(),
    }),
  getCommonCodeNew: () =>
    mutationOptions({
      mutationFn: (payload: CodeRequestTypeNew) => commAPI(apiClient).getCommonCodeNew(payload),
    }),
  getSearchList: () =>
    mutationOptions({
      mutationFn: (menuCode: string) => commAPI(apiClient).getSearchList(menuCode),
    }),
  getSearchDetail: () =>
    mutationOptions({
      mutationFn: (conditionSeq: string) => commAPI(apiClient).getSearchDetail(conditionSeq),
    }),
  saveSearchCondition: () =>
    mutationOptions({
      mutationFn: (payload: SearchConditionSaveRequest) => commAPI(apiClient).saveSearchCondition(payload),
    }),
  deleteSearchCondition: () =>
    mutationOptions({
      mutationFn: (conditionSeq: string) => commAPI(apiClient).deleteSearchCondition(conditionSeq),
    }),
  getCommonDoc: () =>
    mutationOptions({
      mutationFn: ({
        entryType,
        patType,
        docDiv,
      }: {
        entryType: string;
        patType: string;
        docDiv: string;
      }) => commAPI(apiClient).getCommonDoc(entryType, patType, docDiv),
    }),

  // ========== 코드관리 ==========
  getCodeMaster: () =>
    mutationOptions({
      mutationFn: () => commAPI(apiClient).getCodeMaster(),
    }),
  getCodeDetail: () =>
    mutationOptions({
      mutationFn: (grpCd: string) => commAPI(apiClient).getCodeDetail(grpCd),
    }),
  saveCodeGroup: () =>
    mutationOptions({
      mutationFn: (payload: CodeGroupSaveRequest) => commAPI(apiClient).saveCodeGroup(payload),
    }),
  deleteCodeGroup: () =>
    mutationOptions({
      mutationFn: (codeSeq: string) => commAPI(apiClient).deleteCodeGroup(codeSeq),
    }),
  saveCodeDetail: () =>
    mutationOptions({
      mutationFn: (payload: CodeDtlSaveVO[]) => commAPI(apiClient).saveCodeDetail(payload),
    }),


    // [추가] 사건 검색 리스트 (OurRef 모달용)
  getSearchAppList: () =>
  mutationOptions({
    mutationFn: (payload: SearchAppListRequest) =>
      commAPI(apiClient).getSearchAppList(payload),
  }),

  // ========== 사용자 정보 수정 ==========
  updateUser: () =>
    mutationOptions({
      mutationFn: ({ userId, payload, profileImage }: { userId: string; payload: UserUpdateRequest; profileImage?: File }) =>
        commAPI(apiClient).updateUser(userId, payload, profileImage),
    }),
  changePassword: () =>
    mutationOptions({
      mutationFn: ({ userId, payload }: { userId: string; payload: ChangePasswordRequest }) =>
        commAPI(apiClient).changePassword(userId, payload),
    }),
  deleteProfileImage: () =>
    mutationOptions({
      mutationFn: (userId: string) => commAPI(apiClient).deleteProfileImage(userId),
    }),

  getCountryList: () =>
    mutationOptions({
      mutationFn: () => commAPI(apiClient).getCountryList(),
    }),
};
