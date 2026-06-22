import {
  customerApi,
  type CustomerListRequest,
  type CustomerCreateRequest,
  type MandateSaveRequest,
  type ManagerSaveRequest,
  type HistorySaveRequest,
  type MappingSaveRequest,
} from "../../api/customer/customerApi";
import { apiClient } from "../../api/client";
import { mutationOptions } from "@tanstack/react-query";

export const customerQueries = {
  // 고객 목록 검색 조회
  searchList: () =>
    mutationOptions({
      mutationFn: (payload?: CustomerListRequest) =>
        customerApi(apiClient).searchList(payload),
    }),

  // 고객담당자 목록 검색 조회
  searchManagerList: () =>
    mutationOptions({
      mutationFn: (payload?: CustomerListRequest) =>
        customerApi(apiClient).searchManagerList(payload),
    }),

  // 고객 상세 조회
  detail: () =>
    mutationOptions({
      mutationFn: (customerSeq: string) =>
        customerApi(apiClient).getDetail(customerSeq),
    }),

  // 고객 저장 (등록/수정)
  save: () =>
    mutationOptions({
      mutationFn: (payload: CustomerCreateRequest) =>
        customerApi(apiClient).save(payload),
    }),

  // 포괄위임 목록 조회
  mandateList: () =>
    mutationOptions({
      mutationFn: (customerSeq: string) =>
        customerApi(apiClient).getMandateList(customerSeq),
    }),

  // 포괄위임 저장
  mandateSave: () =>
    mutationOptions({
      mutationFn: (payload: MandateSaveRequest) =>
        customerApi(apiClient).saveMandate(payload),
    }),

  // 포괄위임 상세 조회
  mandateDetail: () =>
    mutationOptions({
      mutationFn: (wrappermandateSeq: string) =>
        customerApi(apiClient).getMandateDetail(wrappermandateSeq),
    }),

  // 담당자 목록 조회
  managerList: () =>
    mutationOptions({
      mutationFn: (customerSeq: string) =>
        customerApi(apiClient).getManagerList(customerSeq),
    }),

  // 담당자 저장
  managerSave: () =>
    mutationOptions({
      mutationFn: (payload: ManagerSaveRequest) =>
        customerApi(apiClient).saveManager(payload),
    }),

  // 담당자 상세 조회
  managerDetail: () =>
    mutationOptions({
      mutationFn: (participantSeq: string) =>
        customerApi(apiClient).getManagerDetail(participantSeq),
    }),

  // 변경이력 목록 조회
  historyList: () =>
    mutationOptions({
      mutationFn: (tblSeq: string) =>
        customerApi(apiClient).getHistoryList(tblSeq),
    }),

  // 변경이력 저장
  historySave: () =>
    mutationOptions({
      mutationFn: (payload: HistorySaveRequest) =>
        customerApi(apiClient).saveHistory(payload),
    }),

  // 변경이력 상세 조회
  historyDetail: () =>
    mutationOptions({
      mutationFn: (modifiedHistSeq: string) =>
        customerApi(apiClient).getHistoryDetail(modifiedHistSeq),
    }),

  // 관련고객사 목록 조회
  mappingList: () =>
    mutationOptions({
      mutationFn: (customerSeq: string) =>
        customerApi(apiClient).getMappingList(customerSeq),
    }),

  // 관련고객사 등록
  mappingSave: () =>
    mutationOptions({
      mutationFn: (payload: MappingSaveRequest) =>
        customerApi(apiClient).saveMapping(payload),
    }),

  // 관련고객사 상세
  mappingDetail: () =>
    mutationOptions({
      mutationFn: (customerMappSeq: string) =>
        customerApi(apiClient).getMappingDetail(customerMappSeq),
    }),

  // ========== 삭제 Mutations ==========
  // 고객 삭제
  delete: () =>
    mutationOptions({
      mutationFn: (customerSeq: string) =>
        customerApi(apiClient).deleteCustomer(customerSeq),
    }),

  // 고객 일괄 삭제
  deleteList: () =>
    mutationOptions({
      mutationFn: (ids: string[]) =>
        customerApi(apiClient).deleteCustomerList(ids),
    }),

  // 포괄위임 삭제
  deleteMandate: () =>
    mutationOptions({
      mutationFn: (wrappermandateSeq: string) =>
        customerApi(apiClient).deleteMandate(wrappermandateSeq),
    }),

  // 담당자 삭제
  deleteManager: () =>
    mutationOptions({
      mutationFn: (participantSeq: string) =>
        customerApi(apiClient).deleteManager(participantSeq),
    }),

  // 변경이력 삭제
  deleteHistory: () =>
    mutationOptions({
      mutationFn: (modifiedHistSeq: string) =>
        customerApi(apiClient).deleteHistory(modifiedHistSeq),
    }),

  // 변경이력 일괄 삭제
  deleteHistoryList: () =>
    mutationOptions({
      mutationFn: (ids: string[]) =>
        customerApi(apiClient).deleteHistoryList(ids),
    }),

  // 관련고객사 삭제
  deleteMapping: () =>
    mutationOptions({
      mutationFn: (customerMappSeq: string) =>
        customerApi(apiClient).deleteMapping(customerMappSeq),
    }),

  // 포괄위임 일괄 삭제
  deleteMandateList: () =>
    mutationOptions({
      mutationFn: (ids: string[]) =>
        customerApi(apiClient).deleteMandateList(ids),
    }),

  // 담당자 일괄 삭제
  deleteManagerList: () =>
    mutationOptions({
      mutationFn: (ids: string[]) =>
        customerApi(apiClient).deleteManagerList(ids),
    }),

  // 관련고객사 일괄 삭제
  deleteMappingList: () =>
    mutationOptions({
      mutationFn: (ids: string[]) =>
        customerApi(apiClient).deleteMappingList(ids),
    }),
  // 고객 이미지 삭제
  deleteCustomerFile: () =>
    mutationOptions({
      mutationFn: (params: { customerSeq: string; fileSeq: string }) =>
        customerApi(apiClient).deleteCustomerFile(params),
    }),
};
