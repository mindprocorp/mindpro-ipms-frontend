import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

// ========== 기타사건 리스트 아이템 ==========
export type EtcCaseListItem = {
  conflictSeq: string;      // 기타사건 시퀀스
  caseTitleKo: string;           // 사건명
  domesticRegNo: string;    // 국내등록번호
  status: string;           // 상태
  clientName: string;       // 의뢰인
  receiptDate: string;      // 접수일
  dueLimitDate: string;     // 처리마감일
  ourRef: string;           // OurRef
  yourRef: string;          // YourRef
  caseTypeCode: string;     // 사건구분
};

// ========== 기타사건 리스트 응답 ==========
export type EtcCaseListResponse = {
  etcList: EtcCaseListItem[];  // 기타사건 목록
  totalCount: number;          // 전체 건수
};

// ========== 기타사건 리스트 요청 ==========
export type EtcCaseListRequest = {
  type1?: string;              // 탭 필터 (마감경과, 미처리, 미제출)
};

// ========== 기타사건 상세 요청 ==========
export type EtcCaseDetailRequest = {
  conflictSeq: string;         // 기타사건 시퀀스
};

// 1. 사건관리
export type CftCaseMng = {
  appClassification: { code: string; codeName: string };   // 구분
  rightType: { code: string; codeName: string };           // 권리
  caseType: { code: string; codeName: string };            // 사건종류
  receiptDate: string;         // 접수일
  ourRef: string;              // OurRef
  yourRef: string;             // YourRef
  clientRef: string;           // 출원인관리번호
  appSeq: string;              // 출원 시퀀스
};

// 2. 출원 기본정보 (국내등록번호 포함)
export type AppBaseInfo = {
  countryCode: { code: string; codeName: string };  // 국가코드/국가명
  appDate: string;             // 출원일
  appNo: string;               // 출원번호
  pubDate: string;             // 출원/등록공고일
  regDate: string;             // 등록일
  regNo: string;               // 등록번호
  domesticRegDecisionDate: string; // 국내등록결정일
  domesticRegDate: string;     // 국내등록일
  domesticRegNo: string;       // 국내등록번호
  dueLimitDate: string;        // 처리마감일
  processDate: string;           // 처리일
};

// 3. 명칭 정보
export type AppTitleInfo = {
  titleKo: string;             // 국문명칭
  titleEn: string;             // 영문명칭
};

// 4. 물품류 정보
export type AppGoodsInfo = {
  goodsClass: string;          // 물품류
};

// 5. 당사자 정보
export type AppPartyInfo = {
  foreignAgent: { userSeq: string; userName: string };  // 해외대리인
  client: { userSeq: string; userName: string };
  applicant: { userSeq: string; userName: string };     // 출원인
};

// 6. 청구인/피청구인 정보
export type CftLitigantInfo = {
  caseTitleKo: string;              // 사건명
  introducer: string;//{ userSeq: string; userName: string };    // 소개자
  petitionerType: string;      // 청구인 원고/피고
  petitioner: { userSeq: string; userName: string };    // 청구인
  petitionerMemo: string;      // 청구인 메모
  respondentType: string;      // 피청구인 원고/피고
  respondent: string;   //{ userSeq: string; userName: string };    // 피청구인
  respondentMemo: string;      // 피청구인 메모
};

// 7. 판결 정보
export type CftJudgmentInfo = {
  preExamDate: string;         // 심사전치일
  preExamResult: string;       // 심사전치결과
  finalResult: string;         // 최종결과
  amendLimitDate: string;      // 보정서 마감일
  amendSubmitDate: string;     // 보정서 제출일
  judgmentServedDate: string;  // 판결 송달일
  judgmentDate: string;        // 판결 결정일
  decisionContent: string;     // 결정내용
  appealContent: string;       // 불복 제기내용
  appealLimitDate: string;     // 불복제기 마감일
  appealDate: string;          // 불복제기 청구일
  isAbandoned: string;         // 포기 여부
  abandonInstructDate: string; // 포기 지시일
  abandonDate: string;         // 포기 일자
  abandonContent: string;      // 포기 내용
};

// 8. 담당 정보
export type CftManagerInfo = {
  deptName: string;            // 부서
  adminMgr: { userSeq: string; userName: string };  // 관리담당자
  caseMgr: { userSeq: string; userName: string };   // 사건담당자
  attorney: { userSeq: string; userName: string };  // 담당변리사
};

// 9. 비고 정보
export type CftNoteInfo = {
  note: string;                // 비고
};

// 10. 파일 아이템
export type FileItem = {
  fileSeq: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  docSeq: string;
  docNm: string;
  createAt: string;
};

// 10. 기타사건 파일 정보
export type EtcConflictFile = {
  fileList: FileItem[];
};

// ========== 기타사건 상세 응답 ==========
export type EtcCaseDetailResponse = {
  conflictSeq: string;         // 기타사건 시퀀스
  cftCaseMng: CftCaseMng;      // 사건관리
  appBaseInfo: AppBaseInfo;     // 출원 기본정보
  appTitleInfo: AppTitleInfo;  // 명칭 정보
  appGoodsInfo: AppGoodsInfo;  // 물품류 정보
  appPartyInfo: AppPartyInfo;  // 당사자 정보
  cftLitigantInfo: CftLitigantInfo; // 청구인/피청구인 정보
  cftJudgmentInfo: CftJudgmentInfo; // 판결 정보
  cftManagerInfo: CftManagerInfo;   // 담당 정보
  cftNoteInfo: CftNoteInfo;    // 비고 정보
  etcConflictFile?: EtcConflictFile; // 파일 정보
};

// ========== 기타사건 등록/수정 요청 ==========
export type EtcCaseCreateRequest = {
  data: {
    cftCaseMng: CftCaseMng;
    appBaseInfo: AppBaseInfo;
    appTitleInfo: AppTitleInfo;
    appGoodsInfo: AppGoodsInfo;
    appPartyInfo: AppPartyInfo;
    cftLitigantInfo: CftLitigantInfo;
    cftJudgmentInfo: CftJudgmentInfo;
    cftManagerInfo: CftManagerInfo;
    cftNoteInfo: CftNoteInfo;
    conflictSeq?: string;
  };
  etcConflictFile?: File | null; // 첨부파일
};

export function etcCaseApi(client: ApiClient) {
  return {
    // 기타사건 리스트 검색 조회
    searchList: async (payload?: EtcCaseListRequest): Promise<ApiResponse<EtcCaseListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<EtcCaseListResponse>>(
        "/api/conflict/etc/list/search",
        payload || {}
      );
      return data;
    },

    // 기타사건 상세 조회
    getDetail: async (payload: EtcCaseDetailRequest): Promise<ApiResponse<EtcCaseDetailResponse>> => {
      const { data } = await client.axios.get<ApiResponse<EtcCaseDetailResponse>>(
        `/api/conflict/etc/${payload.conflictSeq}`
      );
      return data;
    },

    // 기타사건 등록
    create: async (payload: EtcCaseCreateRequest): Promise<ApiResponse<void>> => {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(payload.data)], { type: "application/json" }));
      if (payload.etcConflictFile) {
        formData.append("etcConflictFile", payload.etcConflictFile);
      }
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/conflict/etc",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },
 
    // 기타사건 이미지 삭제
    deleteConflictFile: async (payload: { conflictSeq: string; fileSeq: string }): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/conflict/file/${payload.conflictSeq}/${payload.fileSeq}`
      );
      return data;
    },

  };
}
