import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

// 기일 아이템
export type DueDateItem = {
  mappingDuedateSeq: string;
  tblSeq: string;
  tblCode: string;
  officeSeq: string;
  userInfoSeq: string;
  workCategory: string;
  duedateSeq: string;
  duedateDate: string;
  duedateKindCode: string;
  duedateCategoryCode: string;
  duedateCompleteYn: string;
  alarmEstablishmentCode: string;
  alarmYn: string;
  alarmCompleteYn: string;
  alarmCategoryCode: string;
  note: string;
  createUser: string;
  createAt: string;
  updateUser: string;
  updateAt: string;
  // 리스트 조회 시 조인 필드
  caseCategory: string;
  classification: string;
  countryCode: string;
  rightType: string;
  deadlineDate: string;
  deadlineKind: string;
  ourRef: string;
  appNo: string;
  appDate: string;
  regNo: string;
  regDate: string;
  titleKo: string;
  titleEn: string;
  applicant: string;
  client: string;
  inventor: string;
  deptName: string;
  yourRef: string;
  clientRef: string;
  adminMgr: string;
  caseMgr: string;
  attorney: string;
  appSeq?: string;
  appRoute?: any;
};

// 기일 리스트 검색 요청
export type DueDateListRequest = {
  officeSeq: string;
  duedateKindCode: string;
  duedateCategoryCode: string;
  duedateCompleteYn: string;
  duedateDate: string;
  workCategory: string;
  searchStartDate: string;
  searchEndDate: string;
};

// 기일 등록 요청
export type DueDateRegisterRequest = {
  tblSeq: string;
  tblCode: string;
  officeSeq: string;
  userInfoSeq: string;
  workCategory: string;
  duedateDate: string;
  duedateKindCode: string;
  duedateCategoryCode: string;
  duedateCompleteYn: string;
  alarmEstablishmentCode: string;
  alarmYn: string;
  alarmCategoryCode: string;
  note: string;
};

export function duedateApi(client: ApiClient) {
  return {
    // 기일 리스트 조회
    searchList: async (payload: Partial<DueDateListRequest>): Promise<ApiResponse<DueDateItem[]>> => {
      const { data } = await client.axios.post<ApiResponse<{ list: DueDateItem[] }>>(
        "/api/duedate/list",
        payload
      );
      return { ...data, data: data.data?.list || [] };
    },

    // 다가오는 기일 조회
    getUpcoming: async (officeSeq: string): Promise<ApiResponse<DueDateItem[]>> => {
      const { data } = await client.axios.get<ApiResponse<DueDateItem[]>>(
        `/api/duedate/upcoming/${officeSeq}`
      );
      return data;
    },

    // 기일 완료 처리 (Y/N 토글)
    complete: async (duedateSeq: string, completeYn: string, dueTypeCategoryCode: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.patch<ApiResponse<void>>(
        `/api/duedate/${duedateSeq}/complete?completeYn=${completeYn}&dueTypeCategoryCode=${dueTypeCategoryCode}`
      );
      return data;
    },

    // 기일 등록
    register: async (payload: DueDateRegisterRequest): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/duedate/register",
        payload
      );
      return data;
    },
  };
}
