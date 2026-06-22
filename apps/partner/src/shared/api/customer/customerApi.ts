import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

export type CustomerImageFile = {
  customerFileName: string;
  customerFileSize: string;
  customerFileUrl: string;
} | null;

// ========== 파일 아이템 (히스토리 지원용) ==========
export type FileItem = {
  fileSeq: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  docSeq: string;
  docNm: string;
  createAt: string;
};

export type CustomerFileList = {
  fileList: FileItem[];
};

// ========== 고객 상세 (백엔드 DTO 그대로) ==========
export type CustomerDetail = {
  customerSeq: string;
  // 기본정보
  clientCategory: string;
  applicantCategory: string;
  corpCategory: string;
  attorneyCategory: string;
  // 국가정보
  countryCode: string;
  countryNameKo: string;
  countryNameEn: string;
  // 고객정보
  clientNameKo: string;
  clientNameEn: string;
  clientNameCh: string;
  clientNameJp: string;
  companyName: string;
  deptName: string;
  position: string;
  residentRegNo: string;
  corpRegNo: string;
  kipoClientNo: string;
  managerName: string;
  generalMandateNo: string;
  registrationDate: string;
  mobile: string;
  homepage: string;
  email: string;
  // 주소정보
  appAddress: string;
  appAddrDetail: string;
  appTel: string;
  appFax: string;
  contactAddress: string;
  contactAddrDetail: string;
  contactTel: string;
  contactFax: string;
  contactSameAsApp: string;
  etcAddress: string;
  etcAddrDetail: string;
  etcTel: string;
  etcFax: string;
  overseaAddress: string;
  overseaAddrDetail: string;
  overseaTel: string;
  overseaFax: string;
  // 감면사유
  reliefTarget: string;
  reliefReason: string;
  reliefIssueDate: string;
  reliefExemptionDate: string;
  // 사업장정보
  bizRegNo: string;
  subBizRegNo: string;
  bizName: string;
  bizCEO: string;
  bizAddress: string;
  bizType: string;
  bizItem: string;
  // 비고
  note: string;
  // 이미지
  customerImageFile?: CustomerImageFile;
  customerFileList?: FileItem[];
};

// ========== 고객 리스트 요청 (BaseSearchRequest 패턴) ==========
export type CustomerListRequest = {
  tblSeq?: string;
  page?: number;
  pageSize?: number;
  // [추가] 백엔드검색 구조 매핑
  searchCondition?: Array<Record<string, string>>; // 상단 검색바용
  textFilters?: Array<Record<string, string>>;     // Like 검색(그리드 필터)용
  dateFilters?: Array<Record<string, string>>;     // 날짜 범위 필터용
};
//  외부에서 호출 가능하도록 export 키워드 유지
export const createDefaultCustomerRequest = (): CustomerListRequest => ({
  page: 1,
  pageSize:  20 ,
  textFilters: [],
  searchCondition: [],
});

// ========== 고객 리스트 아이템 ==========
export type CustomerListItem = CustomerDetail;

// ========== 고객 리스트 응답 (BaseSearchResponse 패턴) ==========
export type CustomerListResponse = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: CustomerListItem[];
};

// ========== 고객 등록/수정 요청 ==========
export type CustomerCreateRequest = {
  data: CustomerDetail & { customerSeq?: string };
  customerImageFile?: File | null;
};

// ========== 포괄위임 목록 아이템 ==========
export type MandateListItem = {
  wrappermandateSeq: string;
  attorneyName: string;
  designatedAttorney: string;
  agentNo: string;
  mandateDate: string;
  mandateWrapperNo: string;
  mandateRange: string;
  patentCustomerNo: string;
  note: string;
};

// ========== 포괄위임 저장 요청 ==========
export type MandateSaveRequest = {
  customerSeq: string;
  attorneyName: string;
  designatedAttorney?: string;
  agentNo?: string;
  mandateDate?: string;
  mandateWrapperNo?: string;
  mandateRange?: string;
  patentCustomerNo?: string;
  note?: string;
};

// ========== 담당자 목록 아이템 ==========
export type ManagerListItem = {
  participantSeq: string;
  userInfoSeq: string;
  participantCode: string;
  userNameKo: string;
  userMobileNo: string;
  deptName: string;
  userTelNo: string;
  userPosition: string;
  userFaxNo: string;
  userEmail: string;
  userPostNo: string;
  userAddr: string;
  userAddrDetail: string;
  note: string;
  etaxYn: string;
};

// ========== 담당자 상세 ==========
export type ManagerDetailResponse = ManagerListItem;

// ========== 담당자 저장 요청 ==========
export type ManagerSaveRequest = ManagerListItem & { tblSeq: string };

// ========== 변경이력 목록 아이템 ==========
export type HistoryListItem = {
  seq: string;             // PK (기존 modifiedHistSeq 역할을 하는 것으로 보임)
  actionDateTime: string;  // 변경일시
  actionType: string;      // 변경구분
  fieldName: string;       // 변경항목 (스키마의 modifiedContent 역할)
  beforeValue: string;     // 변경전
  afterValue: string;      // 변경후
  actionUser: string;      // 변경자
  caseCategory?: string | null;
  ourRef?: string | null;
  appNo?: string | null;
  regNo?: string | null;
};

// ========== 변경이력 저장 요청 ==========
export type HistorySaveRequest = HistoryListItem & { tblSeq: string };

// ========== 관련고객사 목록 아이템 ==========
export type MappingListItem = {
  customerMappSeq: string;
  customerSeq: string;
  kipoClientNo: string;
  relationCode: string;
  note: string;
  relatedCustomerName?: string;
  clientNameEn?: string;
  appAddress?: string;
  contactAddress?: string;
};

// ========== 관련고객사 상세 ==========
export type MappingDetailResponse = MappingListItem;

// ========== 관련고객사 저장 요청 ==========
export type MappingSaveRequest = {
  tblSeq: string;
  customerSeq: string;
  kipoClientNo?: string;
  relationCode?: string;
  note?: string;
};

// ========== 등록권리자 저장 요청 삭제

// ========== 고객담당자 검색 리스트 아이템 ==========
export type CustomerManagerListItem = {
  tblSeq: string;
  officeSeq: string;
  participantSeq: string;
  userInfoSeq: string;
  participantCode: string;
  userNameKo: string;
  userMobileNo: string;
  deptName: string;
  userTelNo: string;
  userPosition: string;
  userFaxNo: string;
  userEmail: string;
  userPostNo: string;
  userAddr: string;
  userAddrDetail: string;
  note: string;
  etaxYn: string;
};

// ========== 고객담당자 검색 응답 ==========
export type CustomerManagerListResponse = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: CustomerManagerListItem[];
};

// ========== [신규] 고객 마스터 자유 검색 항목 (모달 그리드용) ==========
export type CustomerMasterItem = {
  customerSeq: string;
  clientNameKo?: string;
  clientNameEn?: string;
  companyName?: string;
  countryCode?: string;
  kipoClientNo?: string;
};

export function customerApi(client: ApiClient) {
  return {


      // 고객 목록 검색 조회
      searchList: async (payload?: CustomerListRequest): Promise<ApiResponse<CustomerListResponse>> => {
    const { data } = await client.axios.post<ApiResponse<CustomerListResponse>>(
      "/api/customer/list/search",
      payload // 직접 Body 데이터로 전달
    );
    return data;
    },

    // 고객담당자 목록 검색 조회
    searchManagerList: async (payload?: CustomerListRequest): Promise<ApiResponse<CustomerManagerListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<CustomerManagerListResponse>>(
        "/api/customer/manager/list/search",
        payload
        //null,
        //{ params: payload }
      );
      return data;
    },

    // [신규] 고객 마스터 자유 검색 — 출원 PK 무관, utb_customer 풀에서 카테고리별 LIKE
    searchMaster: async (params: {
      categoryCode?: string;     // 'client' / 'applicant' / 'regMgr' / 'foreignAgent'
      keyword?: string;
      pageSize?: number;
      offSet?: number;
    }): Promise<ApiResponse<CustomerMasterItem[]>> => {
      const { data } = await client.axios.get<ApiResponse<CustomerMasterItem[]>>(
        "/api/customer/master",
        { params },
      );
      return data;
    },

    // 고객 상세 조회
    getDetail: async (customerSeq: string): Promise<ApiResponse<CustomerDetail>> => {
      const { data } = await client.axios.get<ApiResponse<CustomerDetail>>(
        `/api/customer/${customerSeq}`
      );
      return data;
    },

    // 고객 등록/수정 (multipart/form-data)
    save: async (payload: CustomerCreateRequest): Promise<ApiResponse<void>> => {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(payload.data)], { type: "application/json" }));
      if (payload.customerImageFile) {
        formData.append("customerFile", payload.customerImageFile);
      }
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/customer",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },

    // 포괄위임 목록 조회
    getMandateList: async (customerSeq: string): Promise<ApiResponse<MandateListItem[]>> => {
      const payload: CustomerListRequest = { tblSeq: customerSeq };
      const { data } = await client.axios.post<ApiResponse<{ list: MandateListItem[] }>>(
        `/api/customer/mandate/list`,
        payload
      );
      return { ...data, data: data.data?.list || [] };
    },

    // 포괄위임 저장
    saveMandate: async (payload: MandateSaveRequest): Promise<ApiResponse<void>> => {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/customer/mandate",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },

    // 포괄위임 상세 조회
    getMandateDetail: async (wrappermandateSeq: string): Promise<ApiResponse<MandateListItem>> => {
      const { data } = await client.axios.get<ApiResponse<MandateListItem>>(
        `/api/customer/mandate/detail/${wrappermandateSeq}`
      );
      return data;
    },

    // 담당자 목록 조회
    getManagerList: async (customerSeq: string): Promise<ApiResponse<ManagerListItem[]>> => {
      const payload: CustomerListRequest = { tblSeq: customerSeq };
      const { data } = await client.axios.post<ApiResponse<{ list: ManagerListItem[] }>>(
        `/api/customer/manager/list/search`,
        payload
      );
      return { ...data, data: data.data?.list || [] };
    },

    // 담당자 저장
    saveManager: async (payload: ManagerSaveRequest): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/customer/manager",
        payload
      );
      return data;
    },

    // 담당자 상세 조회
    getManagerDetail: async (participantSeq: string): Promise<ApiResponse<ManagerDetailResponse>> => {
      const { data } = await client.axios.get<ApiResponse<ManagerDetailResponse>>(
        `/api/customer/manager/detail/${participantSeq}`
      );
      return data;
    },

    // 변경이력 목록 조회
    getHistoryList: async (tblSeq: string): Promise<ApiResponse<HistoryListItem[]>> => {
      const payload: CustomerListRequest = {
        tblSeq,
        page: 1,
        pageSize: 50,
      };
      const { data } = await client.axios.post<ApiResponse<{ list: HistoryListItem[] }>>(
        `/api/history/list/search`,
        payload
      );
      return { ...data, data: data.data?.list || [] };
    },

    // 변경이력 상세 조회
    getHistoryDetail: async (modifiedHistSeq: string): Promise<ApiResponse<HistoryListItem>> => {
      const { data } = await client.axios.get<ApiResponse<HistoryListItem>>(
        `/api/history/detail/${modifiedHistSeq}`
      );
      return data;
    },

    // 변경이력 저장
    saveHistory: async (payload: HistorySaveRequest): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/history/save",
        payload
      );
      return data;
    },

    // 관련고객사 목록 조회
    getMappingList: async (customerSeq: string): Promise<ApiResponse<MappingListItem[]>> => {
      const payload: CustomerListRequest = { tblSeq: customerSeq };
      const { data } = await client.axios.post<ApiResponse<{ list: MappingListItem[] }>>(
        `/api/customer/mapping/list`,
        payload
      );
      return { ...data, data: data.data?.list || [] };
    },

    // 관련고객사 등록
    saveMapping: async (payload: MappingSaveRequest): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/customer/mapping/save",
        payload
      );
      return data;
    },

    // 관련고객사 상세
    getMappingDetail: async (customerMappSeq: string): Promise<ApiResponse<MappingDetailResponse>> => {
      const { data } = await client.axios.get<ApiResponse<MappingDetailResponse>>(
        `/api/customer/mapping/detail/${customerMappSeq}`
      );
      return data;
    },

    // ========== 삭제 APIs ==========
    // 고객 삭제
    deleteCustomer: async (customerSeq: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/customer/${customerSeq}`
      );
      return data;
    },

    // 고객 일괄 삭제
    deleteCustomerList: async (ids: string[]): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/customer/delete-list",
        ids
      );
      return data;
    },

    // 포괄위임 삭제
    deleteMandate: async (wrappermandateSeq: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/customer/mandate/${wrappermandateSeq}`
      );
      return data;
    },

    // 담당자 삭제
    deleteManager: async (participantSeq: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/customer/manager/${participantSeq}`
      );
      return data;
    },

    // 변경이력 삭제
    deleteHistory: async (modifiedHistSeq: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/history/${modifiedHistSeq}`
      );
      return data;
    },

    // 변경이력 일괄 삭제
    deleteHistoryList: async (ids: string[]): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/history/delete-list",
        ids
      );
      return data;
    },

    // 관련고객사 삭제
    deleteMapping: async (customerMappSeq: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/customer/mapping/${customerMappSeq}`
      );
      return data;
    },

    // 포괄위임 일괄 삭제
    deleteMandateList: async (ids: string[]): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/customer/mandate/delete-list",
        ids
      );
      return data;
    },

    // 담당자 일괄 삭제
    deleteManagerList: async (ids: string[]): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/customer/manager/delete-list",
        ids
      );
      return data;
    },

    // 관련고객사 일괄 삭제
    deleteMappingList: async (ids: string[]): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/customer/mapping/delete-list",
        ids
      );
      return data;
    },

    // 등록권리자 등록 삭제
    // 고객 이미지 삭제
    deleteCustomerFile: async (params: { customerSeq: string; fileSeq: string }): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/customer/file/${params.customerSeq}/${params.fileSeq}`
      );
      return data;
    },
  };
}
