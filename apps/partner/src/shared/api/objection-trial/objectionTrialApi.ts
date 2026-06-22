import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

// 공통 원자 타입
export type CodeInfo   = { code: string; codeName: string };
export type PersonInfo = { userSeq: string; userName: string };

// 파일
export type FileItem = {
  fileSeq:  string;
  fileName: string;
  fileSize: string;
  fileUrl:  string;
  docSeq:   string;
  docNm:    string;
  createAt: string;
};

// 1. 사건관리
export type CftCaseMng = {
  courtCategory:     CodeInfo; // 계류법정
  agentCategory:     CodeInfo; // 대리인구분
  appClassification: CodeInfo; // 구분
  rightType:         CodeInfo; // 권리
  caseType:          CodeInfo; // 사건종류
  receiptDate: string;         // 접수일
  ourRef:      string;         // OurRef
  yourRef:     string;         // YourRef
  clientRef:   string;         // 출원인관리번호
};

// 2. 출원 기본정보 — Request 기준 (appSeq 포함 / Response는 cftCaseMng.appSeq에서 이관)
export type AppBaseInfo = {
  appSeq:           string;   // 출원키
  countryCode:      CodeInfo; // 국가코드
  appDate:          string;   // 출원일
  appNo:            string;   // 출원번호
  announcementDate: string;   // 출원/등록공고일
  regDate:          string;   // 등록일
  regNo:            string;   // 등록번호
  dueLimitDate:     string;   // 청구마감일
  claimDate:        string;   // 청구일
  caseNo:           string;   // 사건번호
};

// 3. 담당 정보
export type CftManagerInfo = {
  deptName: string;     // 부서
  adminMgr: PersonInfo; // 관리담당자
  caseMgr:  PersonInfo; // 사건담당자
  attorney: PersonInfo; // 담당변리사
};

// 4. 출원 당사자 정보
export type AppPartyInfo = {
  foreignAgent: PersonInfo; // 해외대리인
  client:       PersonInfo; // 의뢰인
  applicant:    PersonInfo; // 출원인
};

// 5. 출원 명칭 정보
export type AppTitleInfo = {
  titleKo: string; // 국문명칭
  titleEn: string; // 영문명칭
};

// 6. 출원 물품류 정보
export type AppGoodsInfo = {
  goodsClass: string; // 물품류
};

// 7. 청구인/피청구인 정보 — respondent는 String (백엔드 String 타입)
export type CftLitigantInfo = {
  introducer:     string;     // 소개자
  petitionerType: string;     // 청구인 원고/피고
  petitioner:     PersonInfo; // 청구인
  petitionerMemo: string;     // 청구인 메모
  respondentType: string;     // 피청구인 원고/피고
  respondent:     string;     // 피청구인명
  respondentMemo: string;     // 피청구인 메모
};

// 8. 비고 정보
export type CftNoteInfo = {
  note: string; // 비고
};

// 9. 판결 정보
export type CftJudgmentInfo = {
  preExamDate:         string; // 심사전치일
  preExamResult:       string; // 심사전치결과
  finalResult:         string; // 최종결과
  amendLimitDate:      string; // 보정서 마감일
  amendSubmitDate:     string; // 보정서 제출일
  judgmentServedDate:  string; // 판결 송달일
  judgmentDate:        string; // 판결 결정일
  decisionContent:     string; // 결정내용
  appealLimitDate:     string; // 불복제기 마감일
  appealDate:          string; // 불복제기 청구일
  appealContent:       string; // 제기내용
  isAbandoned:         string; // 포기여부
  abandonInstructDate: string; // 포기 지시일
  abandonDate:         string; // 포기 일자
  abandonContent:      string; // 포기 내용
};

// 10. 원심하급심 항목
export type ConflictResultItem = {
  judgmentCaseNo:     string;   // 판결사건번호
  judgmentContent:    string;   // 판결내용
  judgmentSearchUrl:  string;   // 판결문 경로
  judgmentCategory:   CodeInfo; // 판결구분
  resultDecisionDate: string;   // 판결일
  note:               string;   // 비고
};

export type CftResultList = {
  conflictResultList?: ConflictResultItem[];
};

export type CftFileList = {
  fileList: FileItem[];
};

// 공통 데이터 구조 (Request / Response 공용)
export type ObjectionTrialData = {
  cftCaseMng:      CftCaseMng;
  appBaseInfo:     AppBaseInfo;
  cftManagerInfo:  CftManagerInfo;
  appPartyInfo:    AppPartyInfo;
  appTitleInfo:    AppTitleInfo;
  appGoodsInfo:    AppGoodsInfo;
  cftLitigantInfo: CftLitigantInfo;
  cftNoteInfo:     CftNoteInfo;
  cftJudgmentInfo: CftJudgmentInfo;
  cftResultList?:  CftResultList;
  conflictSeq?:    string;
};

// 등록 Request/Response (POST /api/conflict)
export type ObjectionTrialCreateRequest = {
  data:               ObjectionTrialData;
  appTrademarkFile?:  File | null;
  citedTrademarkFile?: File | null;
};
export type ObjectionTrialCreateResponse = Record<string, never>;

// 상세 조회 Request/Response (GET /api/conflict/{conflictSeq})
export type ObjectionTrialDetailRequest  = { conflictSeq: string };
export type ObjectionTrialDetailResponse = ObjectionTrialData & {
  conflictSeq: string;
  cftFileList?: CftFileList;
};

// 리스트 검색 Request (POST /api/conflict/list/search)
export type ObjectionTrialListRequest = {
  page?:             number;
  pageSize?:         number;
  searchCondition?:  Array<Record<string, string>>;
  dateFilters?:      Array<Record<string, string>>;
  textFilters?:      Array<Record<string, string>>;
};

// 리스트 아이템 — 백엔드 ConflictListDetail 1:1 대응
export type ObjectionTrialListItem = {
  conflictSeq:       string;
  appClassification: CodeInfo | null;  // 구분
  ourRef:            string;           // OurRef
  yourRef:           string;           // YourRef
  status:            CodeInfo | null;  // 현재상태
  caseType:          CodeInfo | null;  // 사건종류
  courtCategoryCode: CodeInfo | null;  // 계류법정
  caseNo:            string;           // 사건번호
  agentCategoryCode: CodeInfo | null;  // 대리인구분
  note:              string | null;    // 비고
  receiptDate:       string | null;    // 접수일
  dueLimitDate:      string | null;    // 청구마감일
  claimDate:         string | null;    // 청구일
  judgmentDate:      string | null;    // 판결결정일
  decisionContent:   string | null;    // 판결내용
  appealLimitDate:   string | null;    // 불복마감일
  appealDate:        string | null;    // 불복제기일
  abandonDate:       string | null;    // 포기취하일
  isAbandoned:       string | null;    // 포기여부
  abandonContent:    string | null;    // 포기내용
  client:            PersonInfo | null; // 의뢰인
  foreignAgent:      PersonInfo | null; // 해외대리인
  petitioner:        PersonInfo | null; // 청구인
  respondent:        string | null;     // 피청구인
  adminMgr:          PersonInfo | null; // 관리담당자
  caseMgr:           PersonInfo | null; // 사건담당자
  attorney:          PersonInfo | null; // 담당변리사
  country:           CodeInfo | null;   // 출원국가
  appCountry:        string | null;     // 출원국가코드 (원문)
  rightType:         CodeInfo | null;   // 권리
  appNo:             string | null;     // 출원번호
  appDate:           string | null;     // 출원일
  regNo:             string | null;     // 등록번호
  regDate:           string | null;     // 등록일
  titleKo:           string | null;     // 국문명칭
};

export type ObjectionTrialListResponse = {
  totalCount: number;
  page:       number;
  size:       number;
  totalPage:  number;
  list:       ObjectionTrialListItem[];
};

export function objectionTrialApi(client: ApiClient) {
  return {
    // 리스트 검색
    searchList: async (payload: ObjectionTrialListRequest): Promise<ApiResponse<ObjectionTrialListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<ObjectionTrialListResponse>>(
        "/api/conflict/list/search",
        payload,
      );
      return data;
    },

    // 상세 조회
    getDetail: async (payload: ObjectionTrialDetailRequest): Promise<ApiResponse<ObjectionTrialDetailResponse>> => {
      const { data } = await client.axios.get<ApiResponse<ObjectionTrialDetailResponse>>(
        `/api/conflict/${payload.conflictSeq}`,
      );
      return data;
    },

    // 등록/수정 (POST 단일 — 백엔드가 conflictSeq 유무로 insert/update 분기)
    create: async (payload: ObjectionTrialCreateRequest): Promise<ApiResponse<ObjectionTrialCreateResponse>> => {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(payload.data)], { type: "application/json" }));
      if (payload.appTrademarkFile)  formData.append("appTrademarkFile",  payload.appTrademarkFile);
      if (payload.citedTrademarkFile) formData.append("citedTrademarkFile", payload.citedTrademarkFile);
      const { data } = await client.axios.post<ApiResponse<ObjectionTrialCreateResponse>>(
        "/api/conflict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return data;
    },
    // 이미지 삭제
    deleteConflictFile: async (payload: { conflictSeq: string; fileSeq: string }): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/conflict/file/${payload.conflictSeq}/${payload.fileSeq}`
      );
      return data;
    },
  };
}
