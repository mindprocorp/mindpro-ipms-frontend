import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

// 유저정보 응답
export type UserResponseType = {
  userMstSeq: string;
  userInfoSeq: string;
  userId: string;
  userNameKo: string;
  userNameEn: string;
  userEmail: string;
  userMobileNo: string;
  userTelNo: string;
  userFaxNo: string;
  userCategoryCode: string;
  userPostNo: string;
  userAddr: string;
  userAddrDetail: string;
  deptName: string;
  userPosition: string;
  profileImageUrl: string;
  useYn: string;
  officeId: string;
  createAt: string;
  adminAuth?: string;
  officeEmployeeSeq?: string;
  
  // 권한별 접근 제한을 위한 메뉴 리스트
  menus?: {
    menuSeq: string;
    menuCd: string;
    menuNm: string;
    parentMenuSeq: string | null;
    menuUrl: string;
    menuIcon: string;
    dispOrd: number;
    /** GNB: 상단좌측 | ICON_SIDEBAR: 상단우측아이콘+사이드바 | HIDDEN: 미노출 */
    dispType: string;
    /** FOLDER: 그룹 | PAGE: 페이지 */
    menuType: string;
    canRead: "Y" | "N";
    canWrite: "Y" | "N";
    canDelete: "Y" | "N";
    canExcel: "Y" | "N";
    sidebarYn: "Y" | "N";
  }[];
};

// 사용자 정보 수정 요청
export type UserUpdateRequest = {
  userNameKo: string;
  userNameEn?: string;
  userEmail?: string;
  userMobileNo?: string;
  userTelNo?: string;
  userFaxNo?: string;
  userPostNo?: string;
  userAddr?: string;
  userAddrDetail?: string;
  deptName?: string;
  userPosition?: string;
};

// 비밀번호 변경 요청
export type ChangePasswordRequest = {
  currentPw: string;
  newPw: string;
};


// 공통코드 요청
export type CodeRequestType = {
  codeSeq?: number;
  groupSeq?: number;
  groupCode?: string[];
  groupName?: string;
  code?: string[];
  codeName?: string;
  createUser?: string;
  updateUser?: string;
  delYn?: string;
};

// 공통코드 응답
export type CodeResponseType = {
  codeSeq: number;
  groupSeq: number;
  groupCode: string;
  groupName: string;
  code: string;
  codeName: string;
  createUser: string;
  updateUser: string;
  delYn: string;
};

export interface CodeSelectOption {
  value: string;
  label: string;
}

// 공통코드 요청 ( 새로운 )
export type CodeRequestTypeNew = {
  grpCdList: string[];
};

// 개별 코드 아이템 타입
export interface CodeDetail {
  codeSeq: string;
  grpCd: string;
  dtlCd: string;
  cdNm: string;
  kipoCd: string;
  refVal1: string | null;
  refVal2: string | null;
  dispOrd: number;
  useYn: string;
  note: string;
  createUser: string | null;
  createAt: string | null;
  updateUser: string | null;
  updateAt: string | null;
}

// 상세코드 저장 — timestamp/audit 필드는 백엔드(JWT + CURRENT_TIMESTAMP)에서 자동 세팅하므로 옵셔널
export interface CodeDtlSaveVO {
  codeSeq: string;
  grpCd: string;
  dtlCd: string;
  cdNm: string;
  kipoCd: string;
  refVal1: string | null;
  refVal2: string | null;
  dispOrd: number;
  useYn?: string;   // 사용 여부 (Y/N)
  delYn: string;    // 삭제 마커 (Y=삭제됨)
  note: string;
  rowStatus: string;
  createUser?: string | null;
  createAt?: string | null;
  updateUser?: string | null;
  updateAt?: string | null;
}

// 검색 조건 단건
export type SearchConditionItem = {
  conditionSeq: string;
  menuCode: string;
  conditionName: string;
  searchOptions: Record<string, string>;
  dateFilters: Array<{ type: string; startDate: string; endDate: string; andOrNOT: string }>;
  textFilters: Array<{ type: string; value: string; andOrNOT: string }>;
  useYn: string;
  createAt: string;
};

// 검색 리스트 응답
export type SearchListResponse = {
  list: SearchConditionItem[];
  totalCount: number;
};

// 검색 상세 응답
export type SearchDetailResponse = SearchConditionItem;

// 검색 조건 저장 요청
export type SearchConditionSaveRequest = {
  menuCode: string;
  conditionName: string;
  searchOptions?: Record<string, string>;
  dateFilters?: Array<{ type: string; startDate: string; endDate: string; andOrNOT: string }>;
  textFilters?: Array<{ type: string; value: string; andOrNOT: string }>;
};

export type CodeResponseTypeNew = Record<string, CodeDetail[]>;

export type CodeDocumentListType = {
  docSeq: string;
  docDiv: string;
  entryType: string;
  patType: string;
  docNm: string;
  autoYn: string;
  baseDateType: string;
  deadlineUnit: string;
  deadlineVal: string;
  refVal: string;
  sortOrd: string;
  createUser: string;
  createAt: string;
  updateUser: string;
  updateAt: string;
  delYn: string;
  note: string;
};

export type CodeDocumentResponseType = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: CodeDocumentListType[];
};

// ========== 코드관리 마스터 (그룹코드) ==========
export type CodeMasterItem = {
  codeSeq: string;
  grpCd: string;
  cdNm: string;
  dispOrd: number;
  useYn: string;
  delYn: string;
  note: string;
  createUser: string;
  createAt: string;
  updateUser: string;
  updateAt: string;
};

// ========== 그룹코드 저장 요청 ==========
export type CodeGroupSaveRequest = {
  groupSeq: number | null;
  groupCode: string;
  groupName: string;
  useYn?: string;   // 사용 여부 (Y/N)
  delYn?: string;   // 삭제 마커 (Y=삭제됨)
  note?: string;
  createUser?: string;
  updateUser?: string;
};

// ========== 사건검색 요청 ==========
export type SearchAppListRequest = {
  searchCondition: Array<{
    ourRef?: string;
    appNo?: string;
    titleKo?: string;
    [key: string]: any; // 기타 조건 대비
  }>;
  page: number;
  pageSize: number;
};

// 사건 검색 결과 아이템 타입 (제공해주신 스웨거 응답 기준)
export type SearchAppItem = {
  appSeq: string;
  appNo: string;
  titleKo: string;
  titleEn: string;
  rightType: { code: string; codeName: string };
  country: { code: string; codeName: string };
  ourRef: string;
  yourRef: string;
  caseCategory: { code: string; codeName: string };
  regNo: string;
  niceClass: string;
  grade: string;
  independentClaims: string;
  dependentClaims: string;
  drawingCount: string;
  figureCount: string | null;
  specCount: string;
  appDate: string;
  regDate: string;
  domesticRegNo: string;
  domesticRegDate: string;
  domesticRegDecisionDate: string;
  pubDate: string;
  intlRegDate: string;
  applicant: { userSeq: string; userName: string };
  client: { userSeq: string; userName: string };
};
// 사건 검색 전체 응답 타입
export type SearchAppListResponse = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: SearchAppItem[];
};

// 국가 목록 응답 타입 (GET /api/v1/common/registry/country)
export type CountryItem = {
  id: string;         // 국가코드 (예: US, JP, KR)
  label: string;      // 국가명 한글
  attributes: string; // 국가명 영문
};

export function commAPI(client: ApiClient) {
  return {
    // 유저 정보
    getUserInfo: async (): Promise<ApiResponse<UserResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<UserResponseType>>("/api/common/me");
      return data;
    },

    // 공통 코드
    getCommonCode: async (param: CodeRequestType): Promise<ApiResponse<CodeResponseType[]>> => {
      const { data } = await client.axios.get<ApiResponse<CodeResponseType[]>>("/api/code", {
        params: param,
      });
      return data;
    },
    getCommonCodeNew: async (
      param: CodeRequestTypeNew,
    ): Promise<ApiResponse<CodeResponseTypeNew>> => {
      const { data } = await client.axios.get<ApiResponse<CodeResponseTypeNew>>(
        "/api/code/details/map",
        {
          params: param,
        },
      );
      return data;
    },

    // 공통 검색
    getSearchList: async (menuCode: string): Promise<ApiResponse<SearchListResponse>> => {
      const { data } = await client.axios.get<ApiResponse<SearchListResponse>>(
        "/api/searchcondition/list/" + menuCode,
      );
      return data;
    },
    getSearchDetail: async (conditionSeq: string): Promise<ApiResponse<SearchDetailResponse>> => {
      const { data } = await client.axios.get<ApiResponse<SearchDetailResponse>>(
        "/api/searchcondition/detail/" + conditionSeq,
      );
      return data;
    },

    // 검색 조건 저장
    saveSearchCondition: async (payload: SearchConditionSaveRequest): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(
        "/api/searchcondition/save",
        payload,
      );
      return data;
    },

    // 검색 조건 삭제
    deleteSearchCondition: async (conditionSeq: string): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/searchcondition/${conditionSeq}`,
      );
      return data;
    },

    // 마스터 코드(그룹코드) 목록 조회
    getCodeMaster: async (): Promise<CodeMasterItem[]> => {
      const { data } = await client.axios.get("/api/code/master");
      // 백엔드가 List를 직접 반환하거나 ApiResponse로 감쌀 수 있음
      return Array.isArray(data) ? data : (data?.data ?? []);
    },

    // 상세 코드 목록 조회
    getCodeDetail: async (grpCd: string): Promise<CodeDetail[]> => {
      const { data } = await client.axios.get(`/api/code/detail/${grpCd}`);
      return Array.isArray(data) ? data : (data?.data ?? []);
    },

    // 그룹코드 생성/수정
    saveCodeGroup: async (payload: CodeGroupSaveRequest): Promise<void> => {
      await client.axios.post("/api/code/group", payload);
    },

    // 그룹코드 삭제 (논리 삭제 — 자식 디테일도 함께 삭제)
    deleteCodeGroup: async (codeSeq: string): Promise<void> => {
      await client.axios.delete(`/api/code/group/${codeSeq}`);
    },

    // 상세 코드 일괄 저장 (CodeDtlVO[] 배열 직접 전송)
    saveCodeDetail: async (payload: CodeDtlSaveVO[]): Promise<void> => {
      await client.axios.post("/api/code/detail/save", payload);
    },

    getCommonDoc: async (
      entryType: string,
      patType: string,
      docDiv: string,
    ): Promise<ApiResponse<CodeDocumentResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<CodeDocumentResponseType>>(
        `/api/code/documents?entryType=${entryType}&patType=${patType}&docDiv=${docDiv}`,
      );
      return data;
    },

    // 사건 검색 리스트 조회 (OurRef 모달용)
   getSearchAppList: async (payload: SearchAppListRequest): Promise<ApiResponse<SearchAppListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<SearchAppListResponse>>(
        "/api/invoice/searchApp/list",
        payload
      );
      return data;
    },

    // 사용자 정보 수정 (프로필 이미지 포함)
    updateUser: async (userId: string, payload: UserUpdateRequest, profileImage?: File): Promise<ApiResponse<void>> => {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
      const { data } = await client.axios.put<ApiResponse<void>>(`/api/users/${userId}`, formData);
      return data;
    },

    // 비밀번호 변경
    changePassword: async (userId: string, payload: ChangePasswordRequest): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.patch<ApiResponse<void>>(`/api/users/${userId}/password`, payload);
      return data;
    },

    // 프로필 이미지 삭제
    deleteProfileImage: async (userId: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(`/api/users/${userId}/profile-image`);
      return data;
    },

    // 국가 목록 조회
    getCountryList: async (): Promise<ApiResponse<CountryItem[]>> => {
      const { data } = await client.axios.get<ApiResponse<CountryItem[]>>(
        "/api/v1/common/registry/country",
      );
      return data;
    },

  };
}

export function commBottomAPI(client: ApiClient) {
  return {
    // 진행사항API
    getProgress: async (): Promise<ApiResponse<UserResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<UserResponseType>>(
        "/api/progress/progress/list?tblSeq=",
      );
      return data;
    },

    // 공통 코드
    getCommonCode: async (param: CodeRequestType): Promise<ApiResponse<CodeResponseType[]>> => {
      const { data } = await client.axios.get<ApiResponse<CodeResponseType[]>>("/api/code", {
        params: param,
      });
      return data;
    },
    getCommonCodeNew: async (
      param: CodeRequestTypeNew,
    ): Promise<ApiResponse<CodeResponseTypeNew>> => {
      const { data } = await client.axios.get<ApiResponse<CodeResponseTypeNew>>(
        "/api/code/details/map",
        {
          params: param,
        },
      );
      return data;
    },

    // 공통 검색
    getSearchList: async (menuCode: string): Promise<ApiResponse<SearchListResponse>> => {
      const { data } = await client.axios.get<ApiResponse<SearchListResponse>>(
        "/api/searchcondition/list/" + menuCode,
      );
      return data;
    },
    getSearchDetail: async (conditionSeq: string): Promise<ApiResponse<SearchDetailResponse>> => {
      const { data } = await client.axios.get<ApiResponse<SearchDetailResponse>>(
        "/api/searchcondition/detail/" + conditionSeq,
      );
      return data;
    },



  };
}
