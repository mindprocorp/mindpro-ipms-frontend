import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

export type BaseSearchResponse<T> = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: T[];
};

export type FileInfo = {
  fileSeq: string,
  fileName: string,
  fileSize: string,
  fileUrl: string,
  docSeq: string,
  docNm: string
}

export type ProgressItemType = {
  progressSeq? : string,
  receiptReportManager: {
    userSeq?: string;
    userName: string;
  }; // 접수보고 담당자
  agentReceiptDate: string; // 대리인 접수일
  submitReportManager: {
    userSeq?: string;
    userName: string;
  }; // 제출보고 담당자
  documentSubmitDate: string; // 서류 제출일
  reviewReportManager: {
    userSeq?: string;
    userName: string;
  }; // 검토보고 담당자
  tblSeq: string; // 업무 시퀀스 (부모)
  progressState?: string; // 진행 상태
  noticeDate: string; // 통지일
  instructionContent: string; // 지시내용
  submitDoc?: {
    docSeq: string;
    docName?: string;
  }; // 제출서류명
  receiptDoc?: {
    docSeq: string;
    docName?: string;
  }; // 접수서류명
  documentLimitDate: string; // 서류 마감일
  extensionCount: string; // 기연 여부/내용
  deptName: string; // 부서명
  examiner: {
    userSeq?: string;
    userName: string;
  }; // 심사관
  note?: string; // 비고
  submitManager?: {
    userSeq?: string;
    userName: string;
  }; // 제출 담당자
  receiptDocContent: string; // 접수서류 내용
  reviewReportDate: string; // 검토보고일
  submitReportDate: string; // 제출보고일
  receiptReportDate: string; // 접수보고일
  instructionDate: string; // 지시일
  receiptReportLimitDate: string; // 접수보고 마감일
  submitReportLimitDate: string; // 제출보고 마감일
  target: {
    code: string;
    codeName?: string;
  }; // 대상코드
  reviewOpinionLimitDate: string; // 검토의견 마감일
  targetFiles?: File[];
  deleteFileSeqList?: string[];
};

// 진행사항 리스트 응답
export type ProgressListResponseType = {
  list: ProgressItemType[];
  totalCount: number;
};

type PaperFile = {
  fileSeq: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  docSeq: string;
  docNm: string;
};

type DocInfo = {
  docSeq: string;
  docName: string;
};

type UserInfo = {
  userSeq: string;
  userName: string;
};

type ProgressDetailResponse = {
  progressSeq: string;
  noticeDate: string;
  agentReceiptDate: string;
  PaperFiles: PaperFile[];
  receiptDoc: DocInfo;
  submitDoc: DocInfo;
  examiner: UserInfo;
  receiptPaperContent: string;
  receiptReportLimitDate: string;
  receiptReportDate: string;
  receiptReportManager: UserInfo;
  reviewOpinionLimitDate: string;
  reviewReportDate: string;
  reviewReportManager: UserInfo;
  instructionDate: string;
  instructionContent: string;
  extensionCount: string;
  documentLimitDate: string;
  documentSubmitDate: string;
  target: string;
  deptName: string;
  submitManager: UserInfo;
  note: string;
  submitReportLimitDate: string;
  submitReportDate: string;
  submitReportManager: UserInfo;
};
///////////// 진행사항 상세 조회

// 메모
export type MemoItemType = {
  createUser: string;
  memoRegDate: string;
  note: string;
  tblSeq: string;
  memoSeq?: string;
  mustReadYn: string;
  memoTitle: string;
  memoUserName: string;
  customerName: string;
  files?: File[];
  fileInfo?: FileInfo[];
  deletedFileSeqList?: string[];
};

// 메모 일괄저장 요청
export type MemoItemResponseType = Omit<MemoItemType, "files" >;


// 메모 리스트 응답 요청
export type MemoListResponseType = {
  list: MemoItemResponseType[];
  totalCount: number;
};

export type MemoDetailResponseType = MemoItemResponseType & {};

// 메모 일괄저장 요청
export type MemoAllCreateRequestType = {
  delYn: string;
  note: string;
  appSeq: string;
  officeSeq: string;
  preferenceSeq: string;
  priorCountryCode: string;
  preferenceAssertDate: string;
  preferenceNo: string;
  wipoCategoryCode: string;
  preferenceSearch: string;
  fullContentUrl: string;
  regDate: string;
  submitDeadLineDate: string;
  submitClosingDate: string;
};

// 메모 일괄저장 요청
export type MemoCreateRequestType = Omit<
  MemoItemType,
  "createUser" | "customerName" | "memoUserName" | "memoRegDate"
>;

// 요약/청구 응답
export type ClaimSummaryResponseType = {
  appSeq: string;
  officeSeq: string;
  patentSeq: string;
  appCategory: string;
  summary: string;
  claimScope: string;
  mainDrawingFile: {
    mainDrawingFile: string;
  };
};

// 요약/청구 요청
export type ClaimSummaryCreateRequestType = {
  mainDrawingFile: File;
};

// 공지예외 응답
export type GracePeriodResponseType = {
  list: GracePeriodItemResponseType[];
  totalCount: number;
};

export type GracePeriodItemResponseType = {
  note: string;
  appSeq: string;
  gracePeriodContent: {
    code : string
    codeName : string;
  };
  submitDeadLineDate: string;
  submitClosingDate: string;
  gracePeriodDate: string;
};

// 공지예외 요청
export type GracePeriodCreateRequestType = {
  gracePeriodSeq?: string;
  note: string;
  appSeq: string;
  gracePeriodDate: string;
  gracePeriodContent: {
    code : string
    codeName? : string
  };
  submitDeadLineDate: string;
  submitClosingDate: string;
};

// 공지예외상세조회 응답
export type GracePeriodDetailResponseType = GracePeriodItemResponseType & {};

export type CostItemResponseType = {
  remittanceCount: number;
  costFee: number;
  discountRatio: number;
  note: string;
};

// 연차마감 응답
export type CostResponseType = {
  list: CostItemResponseType[];
  totalCount: number;
};

// 연차마감 응답
export type CostResponseDetailType = CostItemResponseType & {};

// 연차마감 요청
export type CostCreateRequestType = {
  note: string;
  tblSeq: string;
  remittanceCount: number;
  costRemittanceDate: string;
  costFee: number | unknown;
  discountRatio: string;
};

export type PreferenceType = {
  appSeq: string;
  preferenceSeq?: string;
  priorCountryCode: string;
  preferenceAssertDate: string;
  preferenceNo: string;
  wipoCategoryCode: string;
  preferenceSearch?: string;
  submitDeadLineDate: string;
  submitClosingDate: string;
  preferenceRegDate: string;
  note: string;
};

// 우선권  응답
export type PreferenceResponseType = {
  list: PreferenceType[];
  totalCount: number;
};

// 우선권  상세 응답
export type PreferenceDetailResponseType = PreferenceType & {};
export type RndType = {
  appSeq: string;
  rndSeq?: string;
  projectNo: string; // 과제번호
  ministryName: string; // 국가부처명
  agencyName: string; // 과제관리(전문기관명)
  researchNo: string; // 연구과제 고유번호
  bizName: string; // 연구사업명
  rndName: string; // 연구과제명
  shareRatio: string; // 기여율
  mainLab: string; // 과제수행기관명(대표연구소)
  performingLab: string; // 참여기관(수행연구소)
  rndStartDate: string; // 연구과제 시작일자
  rndClosingDate: string; // 연구과제 종료일자
  totalRndCost: number | unknown; // 연구비총액
};

// 우선권  요청
export type PreferenceRequestType = PreferenceType & {};

// 연구과제  응답
export type RndResponseType = {
  list: RndType[];
  totalCount: number;
};

// 연구과제 상세조회 응답
export type RndDetailResponseType = RndType & {};

// 연구과제 요청
export type RndRequestType = RndType & {};



export type FileListType = {
  tblSeq: string; // 시퀀스
  attachDocDiv: string; // 서류구분
  docSeq?: string; // 문서구분
  inputCreateAt: string; // 등록일자
  summary: string; // 요약
  files?: File[];
};

export type FileItemListResponseType = {
  fileMappSeq: string; // 매핑 시퀀스
  tblSeq: string; // 시퀀스
  docSeq: string; // 시퀀스
  uploadAt: string; // 업로드일자
  inputCreateAt: string; // 입력받은 등록일
  fileKindCode: string; // 서류코드 코드
  fileKindName: string; // 서류코드 명
  fileName: string; // 파일 명
  fileSize: string; // 파일 사이즈
  fileViewUrl: string; // 파일뷰URL
  fileDownloadUrl: string; // 파일다운로드URL
  summary: string; // 요약
  uploadUser: string; // 업로드자
  docCode: string; // 문서코드
  files?: File[];
};
// 전자포대 응답
export type FileListResponseType = {
  list: FileItemListResponseType[];
  totalCount: number;
};

// 전자포대 요청
export type FileListRequestType = FileListType & {
  fileMappSeq?: string; // 수정 시 대상 레코드 식별자
  deletedFileSeqList?: string[];
};

// 전자포대 상세 응답
export type FileListDetailResponseType = FileItemListResponseType & {};


export type RenewalItemListResponseType = {
  appSeq : string;
  costSeq: string;
  remittanceCount : number | unknown;
  paymentDiv : string;
  requestDate : string
  appNo : string;
  costRemittanceDate : string;
  krwAmount : number | unknown;
  note : string;
};

// 갱신관리 응답
export type RenewalListResponseType = {
  list: RenewalItemListResponseType[];
  totalCount: number;
};

// 갱신관리 요청
export type RenewalRequestType = {
  appSeq: string;
  remittanceCount: number | unknown;
  paymentDiv: string;
  requestDate: string;
  appNo: string;
  krwAmount: number | unknown;
  costRemittanceDate: string;
  note: string;
};

export type ProductItemListResponseType = {
  appSeq: string;
  productGroupId: string;
  productClass: string;
  productCount: number | unknown;
  productSummaryKo: string;
  productSummaryEn: string;
};

// 지정상품 응답
export type ProductListResponseType = {
  list: ProductItemListResponseType[];
  totalCount: number;
};

// 지정상품 요청
export type ProductRequestType = {
  appSeq: string;
  remittanceCount: number | unknown;
  paymentDiv: string;
  requestDate: string;
  appNo: string;
  krwAmount: number | unknown;
  costRemittanceDate: string;
  note: string;
};

export type OverseasItemListResponseType = {
  appExtSeq: string;
  appSeq: string;
  appRoute: {
    code: string;
    codeName: string;
  };
  countryCode: {
    code: string;
    codeName: string;
  };
  ourRef: string;
  receiptDate: string;
  rightType: {
    code: string;
    codeName: string;
  };
  caseDeadline: string;
  status: {
    code: string;
    codeName: string;
  };
  clientInfo: {
    userSeq: string;
    userName: string;
  };
  applicantInfo: {
    userSeq: string;
    userName: string;
  };
  appDate: string;
  appNo: string;
  regDate: string;
  regNo: string;
  foreignAgentInfo: {
    userSeq: string;
    userName: string;
  };
  note: string;
  yourRef: string;
};

// 해외출원 응답
export type OverseasListResponseType = {
  list: OverseasItemListResponseType[];
  totalCount: number;
};

// 해외출원 요청
export type OverseasRequestType = {
  page: number;
  pageSize: number;
  tblSeq : string;

};

export type LocarItemListResponseType = {
  appSeq: string;
  classNo: string;
  subClassNo: string;
  locarnoGroupId: string;
  goodsSummaryKo: string;
  goodsSummaryEn: string;
  goodsCount: string;
};

// 로카르노 탭 응답
export type LocarListResponseType = {
  list: LocarItemListResponseType[];
  totalCount: number;
};

export type LocarnoResponse = {
  createUser: string;
  createAt: string;
  updateUser: string;
  updateAt: string;
  delYn: string;
  note: string | null;
  classNo: string;
  locarnoVersion: string;
  categoryGb: string;
  classNmKo: string;
  classNmEn: string;
  classDescKo: string | null;
  classDescEn: string | null;
  subclassNo: string | null;
  subclassNmKo: string | null;
  subclassNmEn: string | null;
  goodsSeq: string | null;
  goodsNo: string | null;
  goodsNmKo: string | null;
  goodsNmEn: string | null;
};

// 로카르노 등록 Item
export interface LocarnoItem {
  appSeq: string;
  classNo: string | null;
  subClassNo: string | null;
  goodsSeq: string | null;
  locarnoNameKo: string | null;
  locarnoNameEn: string | null;
  goodsCount: number;
}

// 로카르노 그룹 상세 항목 (수정 모달 초기 데이터)
export type LocarnoGroupItemType = {
  classNo: string;
  subClassNo: string;
  goodsSeq: string;
  locarnoGroupId: string;
  locarnoNameKo: string;
  locarnoNameEn: string;
  goodsCount: number;
};

// 로카르노 등록 request
export interface LocarnoRequest {
  locarnoList: LocarnoItem[];
  locarnoGroupId?: string;
}

// 청구관리 요청 request
export interface ClaimRequestType {
  tblSeq: string;
  page: number;
  pageSize: number;
}

export type ClaimItemListResponseType = {
  invoiceSeq: string;
  invoiceClaimSeq?: string;
  costCategory: {
    code: string;
    codeName: string;
  };
  itemContent: string;
  quantity?: string;
  unit?: {
    code: string;
    codeName: string;
  };
  unitPrice?: string;
  amount?: string;
  vatAmount?: string;
  totalAmount: string;
  note: string;

  // 마스터 요약 필드 추가
  govFee?: string;
  agencyFee?: string;
  vat?: string;
  etcFee?: string;
  transFee?: string;
  invDate?: string;
  invNo?: string;
  taxBillDate?: string;
  inOutType?: string;
  depAmount?: string;
  unpaidAmount?: string;
  abandonAmount?: string;
};

// 청구관리 응답
export type ClaimListResponseType = {
  list: ClaimItemListResponseType[];
  totalCount: number;
};


// 실적분베
export type DistributeRequestItem = {
  invoiceSeq: string;
  performanceSeq: string;
  performanceCategory: {
    code: string;
    codeName?: string;
  };
  deptCategory: string;
  staff: {
    userSeq: string;
    userName?: string;
  };
  performanceContent: string;
  performancePerfDate: string;
  performanceAmount: string;
  shareRatio: string;
  note: string;
};

export type DistributeRequest = DistributeRequestItem[];

// 실적 조회 요청
export type DistributeRequestType = {
  page: number;
  pageSize: number;
  tblSeq : string;

};

// 실적 조회 응답
export type DistributeResponseType = {
  list: DistributeRequestItem[];
  totalCount: number;
};

// ids
export type IdsRequestItem = {
  officeSeq?: string;
  appSeq: string;
  idsSeq?: string;
  occurCountryCode: string;
  occurCountryName?: string;
  occurNo: string;
  familyNoEn: string;
  isIdsSubmitted: string;
  occurDate: string;
  idsPubDate: string;
  idsReceiptDate: string;
  idsSendDate: string;
  idsDeadline: string;
  idsSubmitDate: string;
  idsSubmitMng: string;
  idsSubmitMngNm?: string;
  note: string;
};

// ids 조회 응답
export type IdsResponseType = {
  list: IdsRequestItem[];
  totalCount: number;
};
export type IdsRequest = IdsRequestItem;

export type IdsDetailResponse = IdsRequestItem & {};


// 구비서류 조회 요청
export type RequiredDocsRequestType = {
  page: number;
  pageSize: number;
  tblSeq : string;

};
// 구비서류
export type RequiredDocRequestItem = {
  requiredDocSeq?: string;
  requiredDocName: string;
  submitDeadline: string;
  signReqDate: string;
  receiptDate: string;
  sendDate: string;
  submitDate: string;
};

// 구비서류 조회 응답
export type RequiredDocResponseType = {
  list: RequiredDocRequestItem[];
  totalCount: number;
};
export type RequiredDocRequest = RequiredDocRequestItem;

export type RequiredDocDetailResponseType = RequiredDocRequestItem & {}

// 유지비 조회 요청
export type MaintenanceRequestType = {
  page: number;
  pageSize: number;
  tblSeq : string;

};

// 유지비 단건 조회 응답
export type MaintenanceDetailResponseType = {
  maintenanceFeeSeq: string;
  appSeq: string;
  nextPaymentInstallment: number;
  maintFeeDeadline: string;
  maintFeePenaltyDeadline: string;
  maintFeeOrderDate: string;
  maintFeePaymentDate: string;
  note: string;
};

// 구비서류
export type MaintenanceRequestItem = {
  maintenanceFeeSeq?: string,
  appSeq?: string,
  nextPaymentInstallment: string,
  maintFeeDeadline: string,
  maintFeePenaltyDeadline: string,
  maintFeeOrderDate: string,
  maintFeePaymentDate: string,
  note: string
};

// 유지비 조회 응답
export type MaintenanceResponseType = {
  list: MaintenanceRequestItem[];
  totalCount: number;
};
export type MaintenanceRequest = MaintenanceRequestItem;

export function commBottomAPI(client: ApiClient) {
  return {
    // 진행사항 list 조회 API
    getProgressList: async (tblSeq: string): Promise<ApiResponse<ProgressListResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<ProgressListResponseType>>(
        `/api/progress/progress/list?tblSeq=${tblSeq}`,
      );
      return data;
    },
    // 진행사항 상세 조회 API
    getProgressDetail: async (
      progressSeq: string,
    ): Promise<ApiResponse<ProgressDetailResponse>> => {
      const { data } = await client.axios.get<ApiResponse<ProgressDetailResponse>>(
        `/api/progress/progress/detail/${progressSeq}`,
      );
      return data;
    },
    // 진행사항 생성 API
    createProgress: async (payload: ProgressItemType): Promise<ApiResponse<null>> => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      if (payload.targetFiles != null && payload.targetFiles.length > 0) {
        for (const file of payload.targetFiles) {
          formData.append("targetFiles", file);
        }
      }
      const { data } = await client.axios.post<ApiResponse<null>>(
        `/api/progress/progress/register`,
        formData,
      );
      return data;
    },

    // 메모 리스트 API
    getMemoList: async (appSeq: string): Promise<ApiResponse<MemoListResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<MemoListResponseType>>(
        `/api/Memo/list/${appSeq}`,
      );
      return data;
    },

    // 메모 상세 API
    getMemoDetail: async (memoSeq: string): Promise<ApiResponse<MemoDetailResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<MemoDetailResponseType>>(
        `/api/Memo/${memoSeq}`,
      );
      return data;
    },

    // 메모 일괄저장 API
    createAllMemo: async (
      appSeq: string,
      payload: MemoAllCreateRequestType,
    ): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(`/api/Memo/${appSeq}`, payload);
      return data;
    },

    // 메모 단건저장 API
    createMemo: async (payload: MemoCreateRequestType): Promise<ApiResponse<null>> => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      if (payload.files != null && payload.files.length > 0) {
        for (const file of payload.files) {
          formData.append("files", file);
        }
      }

      const { data } = await client.axios.post<ApiResponse<null>>(`/api/Memo`, formData);
      return data;
    },

    deleteMemo: async (tblSeq: string, memoSeq: string): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/Memo/delete/${tblSeq}/${memoSeq}`,
      );
      return data;
    },

    // 요약/청구 API
    getClaimSummary: async (patentSeq: string): Promise<ApiResponse<ClaimSummaryResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<ClaimSummaryResponseType>>(
        `/api/claimSummary/${patentSeq}`,
      );
      return data;
    },

    // 요약/청구 등록 API
    createClaimSummary: async (
      payload: ClaimSummaryCreateRequestType,
    ): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(
        `/api/claimSummary/register`,
        payload,
      );
      return data;
    },

    // 공지예외 조회 API
    getGracePeriod: async (appSeq: string): Promise<ApiResponse<GracePeriodResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<GracePeriodResponseType>>(
        `/api/gracePeriod/list/${appSeq}`,
      );
      return data;
    },

    // 공지예외 상세조회 API
    getGracePeriodDetail: async (
      appSeq: string,
      gracePeriodSeq: string,
    ): Promise<ApiResponse<GracePeriodDetailResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<GracePeriodDetailResponseType>>(
        `/api/gracePeriod/${appSeq}/${gracePeriodSeq}`,
      );
      return data;
    },

    // 공지예외 등록 API
    createGracePeriod: async (
      payload: GracePeriodCreateRequestType,
    ): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(
        `/api/gracePeriod/register`,
        payload,
      );
      return data;
    },

    // 연차마감 등록 API
    createCost: async (payload: CostCreateRequestType): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(`/api/cost/register`, payload);
      return data;
    },

    getCostList: async (appSeq: string): Promise<ApiResponse<CostResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<CostResponseType>>(
        `/api/cost/list/${appSeq}`,
      );
      return data;
    },
    // 연차마감 상세조회
    getCostDetail: async (
      tblSeq: string,
      costSeq: string,
    ): Promise<ApiResponse<CostResponseDetailType>> => {
      const { data } = await client.axios.get<ApiResponse<CostResponseDetailType>>(
        `/api/cost/cost/${tblSeq}/${costSeq}`,
      );
      return data;
    },

    // 우선권 등록 API
    createPreference: async (payload: PreferenceRequestType): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(
        `/api/preference/save/${payload.appSeq}`,
        payload,
      );
      return data;
    },

    // 우선권 조회 API
    getPreferenceList: async (appSeq: string): Promise<ApiResponse<PreferenceResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<PreferenceResponseType>>(
        `/api/preference/list/${appSeq}`,
      );
      return data;
    },
    // 우선권 상세 조회 API
    getPreferenceDetail: async (
      preferenceSeq: string,
    ): Promise<ApiResponse<PreferenceDetailResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<PreferenceDetailResponseType>>(
        `/api/preference/detail/${preferenceSeq}`,
      );
      return data;
    },

    // 우선권 일괄 저장 API
    saveAllPreference: async (
      appSeq: string,
      payload: PreferenceRequestType[],
    ): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(
        `/api/preference/saveAll/${appSeq}`,
        payload,
      );
      return data;
    },

    // 연구과제 등록 API
    createRnd: async (payload: RndRequestType): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(`/api/rnd/register`, payload);
      return data;
    },

    // 연구과제 조회 API
    getRndList: async (appSeq: string): Promise<ApiResponse<RndResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<RndResponseType>>(
        `/api/rnd/list/${appSeq}`,
      );
      return data;
    },

    // 연구과제 상세 조회 API
    getRndDetail: async (
      appSeq: string,
      rndSeq: string,
    ): Promise<ApiResponse<RndDetailResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<RndDetailResponseType>>(
        `/api/rnd/${appSeq}/${rndSeq}`,
      );
      return data;
    },

    // 전자포대 등록 API
    createFileList: async (payload: FileListRequestType): Promise<ApiResponse<null>> => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      if (payload.files != null && payload.files.length > 0) {
        for (const file of payload.files) {
          formData.append("files", file);
        }
      }

      const { data } = await client.axios.post<ApiResponse<null>>(
        `/api/fileList/dossier/register`,
        formData,
      );
      return data;
    },

    // 전자포대 조회 API
    getFileListList: async (appSeq: string): Promise<ApiResponse<FileListResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<FileListResponseType>>(
        `/api/fileList/dossier/${appSeq}`,
      );
      return data;
    },

    // 전자포대 상세 조회 API
    getFileListDetail: async (
      tblSeq: string,
      fileMappSeq: string,
    ): Promise<ApiResponse<FileListDetailResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<FileListDetailResponseType>>(
        `/api/fileList/dossier/${tblSeq}/${fileMappSeq}`,
      );
      return data;
    },

    // 갱신관리 등록 API
    createRenewal: async (payload: RenewalRequestType): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(
        `/api/cost/renewalMng/register`,
        payload,
      );
      return data;
    },

    // 갱신관리 조회 API
    getRenewalList: async (appSeq: string): Promise<ApiResponse<RenewalListResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<RenewalListResponseType>>(
        `/api/cost/renewalMng/${appSeq}`,
      );
      return data;
    },

    // 지정상품 등록 API
    createProduct: async (payload: ProductRequestType): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(
        `/api/product/tab/register`,
        payload,
      );
      return data;
    },

    // 지정상품 조회 API
    getProductList: async (appSeq: string): Promise<ApiResponse<ProductListResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<ProductListResponseType>>(
        `/api/product/tab/${appSeq}`,
      );
      return data;
    },

    // 해외출원 조회 API
    getOverseasList: async (
      payload: OverseasRequestType,
    ): Promise<ApiResponse<OverseasListResponseType>> => {
      const { data } = await client.axios.post<ApiResponse<OverseasListResponseType>>(
        `/api/oversea/basic/list/chainApp`,
        payload,
      );
      return data;
    },
    // 로카르노 탭 조회 API
    getLocarList: async (appSeq: string): Promise<ApiResponse<LocarListResponseType>> => {
      const { data } = await client.axios.post<ApiResponse<LocarListResponseType>>(
        `/api/locarno/tab/${appSeq}`,
      );
      return data;
    },

    getList: async (): Promise<ApiResponse<LocarnoResponse[]>> => {
      const { data } = await client.axios.post<ApiResponse<LocarnoResponse[]>>(`/api/locarno/list`);
      return data;
    },
    getClassList: async (classNo: string): Promise<ApiResponse<LocarnoResponse[]>> => {
      const { data } = await client.axios.post<ApiResponse<LocarnoResponse[]>>(
        `/api/locarno/sub-list/${classNo}`,
      );

      return data;
    },
    getGoodList: async (
      classNo: string,
      subClassNo: string,
    ): Promise<ApiResponse<LocarnoResponse[]>> => {
      const { data } = await client.axios.post<ApiResponse<LocarnoResponse[]>>(
        `/api/locarno/goods-list/${classNo}/${subClassNo}`,
      );
      return data;
    },
    // 로카르노 등록 API
    createLocar: async (payload: LocarnoRequest): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(
        `/api/locarno/tab/register`,
        payload,
      );
      return data;
    },
    // 로카르노 그룹 상세 조회 (수정 모달 초기 데이터)
    getLocarnoGroupDetail: async (appSeq: string, locarnoGroupId: string): Promise<ApiResponse<LocarnoGroupItemType[]>> => {
      const { data } = await client.axios.get<ApiResponse<LocarnoGroupItemType[]>>(
        `/api/locarno/tab/detail/${appSeq}/${locarnoGroupId}`,
      );
      return data;
    },
    // 청구관리 탭 조회 API
    getClaimList: async (
      payload: ClaimRequestType,
    ): Promise<ApiResponse<ClaimListResponseType>> => {
      const { data } = await client.axios.post<ApiResponse<ClaimListResponseType>>(
        `/api/invoice/claims/list`,
        payload,
      );
      return data;
    },

    // 업무 시퀀스(tblSeq)별 청구 내역 조회 (Incident 공통)
    getIncidentClaimList: async (tblSeq: string): Promise<ApiResponse<BaseSearchResponse<InvoiceResponse.InvoiceClaimDetail>>> => {
      const { data } = await client.axios.get<ApiResponse<BaseSearchResponse<InvoiceResponse.InvoiceClaimDetail>>>(
        "/api/incident/claims/" + tblSeq,
      );
      return data;
    },

    // 사건 청구서 삭제 (소프트 삭제)
    deleteIncidentClaims: async (invoiceSeqs: string[]): Promise<ApiResponse<number>> => {
      const { data } = await client.axios.delete<ApiResponse<number>>(`/api/incident/claims`, {
        data: invoiceSeqs,
      });
      return data;
    },

    // 실적 단건저장 API
    createDistribute: async (
      invoiceSeq: string,
      payload: DistributeRequest,
    ): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(
        `/api/invoice/performance/save-all/${invoiceSeq}`,
        payload,
      );
      return data;
    },
    getDistributeList: async (
      payload: DistributeRequestType,
    ): Promise<ApiResponse<DistributeResponseType>> => {
      const { data } = await client.axios.post<ApiResponse<DistributeResponseType>>(
        `/api/invoice/performance/list`,
        payload,
      );
      return data;
    },
    getIdsList: async (appSeq: string): Promise<ApiResponse<IdsResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<IdsResponseType>>(
        `/api/ids/list/${appSeq}`,
      );
      return data;
    },

    // ids 상세조회
    getIdsDetail: async (
      appSeq: string,
      idsSeq: string,
    ): Promise<ApiResponse<IdsDetailResponse>> => {
      const { data } = await client.axios.get<ApiResponse<IdsDetailResponse>>(
        `/api/ids/${appSeq}/${idsSeq}`,
      );
      return data;
    },

    // ids 단건저장 API
    createIds: async (payload: IdsRequest): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(`/api/ids/register`, payload);
      return data;
    },

    getRequiredList: async (
      payload: RequiredDocsRequestType,
    ): Promise<ApiResponse<RequiredDocResponseType>> => {
      const { data } = await client.axios.post<ApiResponse<RequiredDocResponseType>>(
        `/api/required-doc/list`,
        payload,
      );
      return data;
    },

    // 구비서류 단건저장 API
    createRequiredDocs: async (payload: RequiredDocRequest): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(`/api/required-doc`, payload);
      return data;
    },

    // 구비서류 상세조회 API
    getRequiredDocsDetail: async (
      appSeq: string,
      requiredDocSeq: string,
    ): Promise<ApiResponse<RequiredDocDetailResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<RequiredDocDetailResponseType>>(
        `/api/required-doc/${appSeq}/${requiredDocSeq}`,
      );
      return data;
    },

    // 유지비
    getMaintenanceList: async (
      payload: MaintenanceRequestType,
    ): Promise<ApiResponse<MaintenanceResponseType>> => {
      const { data } = await client.axios.post<ApiResponse<MaintenanceResponseType>>(
        `/api/maintenance-fee/list`,
        payload,
      );
      return data;
    },

    // 유지비 단건조회
    getMaintenanceDetail: async (
      appSeq: string,
      mainFeeSeq: string,
    ): Promise<ApiResponse<MaintenanceDetailResponseType>> => {
      const { data } = await client.axios.get<ApiResponse<MaintenanceDetailResponseType>>(
        `/api/maintenance-fee/${appSeq}/${mainFeeSeq}`,
      );
      return data;
    },

    // 유지비 단건저장 API
    createMaintenance: async (payload: MaintenanceRequest): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(`/api/maintenance-fee`, payload);
      return data;
    },

    // 일괄 삭제 API 추가
    multiDeleteProgress: async (tblSeq: string, progressSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/progress/progress/multi-delete/soft/${tblSeq}`,
        { data: progressSeqList }
      );
      return data;
    },

    multiDeleteMemo: async (tblSeq: string, memoSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/Memo/multi-delete/soft/${tblSeq}`,
        { data: memoSeqList }
      );
      return data;
    },

    multiDeleteGracePeriod: async (appSeq: string, gracePeriodSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/gracePeriod/multi-delete/soft/${appSeq}`,
        { data: gracePeriodSeqList }
      );
      return data;
    },

    multiDeleteCost: async (tblSeq: string, costSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/cost/multi-delete/soft/${tblSeq}`,
        { data: costSeqList }
      );
      return data;
    },

    multiDeletePreference: async (appSeq: string, preferenceSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/preference/multi-delete/soft/${appSeq}`,
        { data: preferenceSeqList }
      );
      return data;
    },

    multiDeleteRnd: async (appSeq: string, rndSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/rnd/multi-delete/soft/${appSeq}`,
        { data: rndSeqList }
      );
      return data;
    },

    multiDeleteFileList: async (tblSeq: string, fileMappSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/fileList/dossier/multi-delete/soft/${tblSeq}`,
        { data: fileMappSeqList }
      );
      return data;
    },

    multiDeleteRenewal: async (appSeq: string, costSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/cost/multi-delete/soft/${appSeq}`,
        { data: costSeqList }
      );
      return data;
    },

    multiDeleteProduct: async (appSeq: string, productSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/product/tab/multi-delete/soft/${appSeq}`,
        { data: productSeqList }
      );
      return data;
    },

    multiDeleteLocarno: async (appSeq: string, locarnoSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/locarno/tab/multi-delete/soft/${appSeq}`,
        { data: locarnoSeqList }
      );
      return data;
    },

    multiDeleteIds: async (appSeq: string, idsSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/ids/multi-delete/soft/${appSeq}`,
        { data: idsSeqList }
      );
      return data;
    },

    multiDeleteRequiredDoc: async (appSeq: string, requiredDocSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/required-doc/multi-delete/soft/${appSeq}`,
        { data: requiredDocSeqList }
      );
      return data;
    },

    multiDeleteMaintenanceFee: async (appSeq: string, maintenanceFeeSeqList: string[]): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/maintenance-fee/multi-delete/soft/${appSeq}`,
        { data: maintenanceFeeSeqList }
      );
      return data;
    },
  };
}
