import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

// 출원사건관리
type AppCaseMng = {
  appRoute: {
    code: string;
    codeName?: string;
  }; // 출원루트
  receiptDate: string; // 접수일
  ourRef: string; // OurRef
  clientRef: string; // 출원인관리번호
};

// 기본정보
type AppBaseInfo = {
  noticeExceptionApply: {
    code: string;
    codeName?: string;
  }; // 공지예외적용
  appDeadline: string; // 출원마감일
  appOrderDate: string; // 출원지시일
  appDate: string; // 출원일
  appNo: string; // 출원번호
};

// 담당정보
type AppManagerInfo = {
  deptCode: string; // 부서코드
  deptName?: string; // 부서명
  applicantContactInfo: {
    userSeq: string; // 출원인담당 Seq
    userName?: string; // 출원인담당 명
  };
  adminMgrInfo: {
    userSeq: string; // 관리담당자 Seq
    userName?: string; // 관리담당자 명
  };
  caseMgrInfo: {
    userSeq: string; // 사건담당자 Seq
    userName?: string; // 사건담당자 명
  };
  attorneyInfo: {
    userSeq: string; // 담당변리사 Seq
    userName?: string; // 담당변리사 명
  };
};

// 당사자정보
type AppCounterPartyInfo = {
  clientInfo: {
    counterPartySeq: string; // 의뢰인 Seq
    counterPartyName?: string; // 의뢰인 명
  }[];
  applicantInfo: {
    counterPartySeq: string; // 출원인 Seq
    counterPartyName?: string; // 출원인 명
  }[];
  inventorInfo: {
    userSeq: string; // 발명자 Seq
    userName?: string; // 발명자 명
  };
};

// 명칭정보
type AppNameInfo = {
  titleKo: string; // 국문명칭
  titleEn: string; // 영문명칭
};

// 출원전략설정 - 백엔드 DTO(PctAppStrategy) 필드명 기준
type AppStrategy = {
  krDesignationYn: string; // 지정국가
  // 20개월 마감 - 백엔드 Deadline20Info 필드명
  deadline20Info: {
    complete20Yn: string;      // 완료여부
    npe20Deadline: string;     // 국내진입마감일
    entry20CompleteDate: string; // 진입완료일
    app20Country?: string[];   // 출원국가
  };
  // 30개월 마감 - 백엔드 Deadline30Info 필드명
  deadline30Info: {
    complete30Yn: string;      // 완료여부
    npe30Deadline: string;     // 국내진입마감일
    entry30CompleteDate: string; // 진입완료일
    app30Country?: string[];   // 출원국가
  };
};

// 출원 행정관리 - 백엔드 PctAppManagement DTO 필드명 기준
type AppManagement = {
  pctFilingFeeInfo: {
    filingFeeDeadline: string; // 마감일
    filingFeePayDate: string;  // 제출일
  };
  internationalSearchInfo: {
    isaReceiptDate: string; // 접수일
    isrReportDate: string;  // 보고일
    searchResult: string;   // 결과
  };
  abandonOrderDate: string; // 포기 지시일 (abandonnReceiptDate → abandonOrderDate)
  abandonDate: string;      // 포기 일자
  abandonNote: string;      // 포기 내용
};

// 출원 등록및 권리유지
type AppMaintenance = {
  pctIpeInfo: {
    ipeDeadline: string;    // 마감일
    ipeRequestDate: string; // 청구일
    ipeReportDate: string;  // 보고일
  };
  intlPubInfo: {
    intlReceiptDate: string; // 접수일
    intlPubDate: string;     // 일자
    intlPubNo: string;       // 번호
  };
};

// 등록 권리유지관리
type AppNote = {
  note: string;
};

type ClaimSummaryInfo = {
  summary: string;
  claimScope: string;
};


// 해외출원 PCT 등록 요청 (appSpecificElement 제거 - 백엔드 CreatePctAppRequest에 미존재)
export type OverseasPctCreateRequest = {
  appCaseMng: AppCaseMng;                 // 출원사건관리
  appBaseInfo: AppBaseInfo;               // 기본정보
  appManagerInfo: AppManagerInfo;         // 담당정보
  appCounterPartyInfo: AppCounterPartyInfo; // 당사자정보
  appNameInfo: AppNameInfo;               // 명칭정보
  appStrategy: AppStrategy;              // 출원전략설정
  appManagement: AppManagement;          // 출원행정관리
  appMaintenance: AppMaintenance;        // 출원 등록 및 권리유지 관리
  appNote: AppNote;                      // 비고
  claimSummaryInfo?: ClaimSummaryInfo;   // 요약/청구
  appExtSeq: string;
  appSeq?: string;
};

// 해외출원 PCT 응답
export type OverseasPctResponse = {
  appSeq: string;
  appExtSeq?: string;
  appStatus?: { code?: string; codeName?: string };
  appCaseMng: AppCaseMng;                 // 출원사건관리
  appBaseInfo: AppBaseInfo;               // 기본정보
  appManagerInfo: AppManagerInfo;         // 담당정보
  appCounterPartyInfo: AppCounterPartyInfo; // 당사자정보
  appNameInfo: AppNameInfo;               // 명칭정보
  appStrategy: AppStrategy;              // 출원전략설정
  appManagement: AppManagement;          // 출원행정관리
  appMaintenance: AppMaintenance;        // 출원 등록 및 권리유지 관리
  appNote: AppNote;                      // 비고
  claimSummaryInfo?: ClaimSummaryInfo;   // 요약/청구
};

export function pctApi(client: ApiClient) {
  return {
    createPctOverseas: async (
      payload: OverseasPctCreateRequest,
    ): Promise<ApiResponse<string>> => {
      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));
      const { data } = await client.axios.post<ApiResponse<string>>(
        "/api/oversea/pct",
        formData,
      );

      return data;
    },
    getOverseasPctDetail: async (
      appSeq: string
    ): Promise<ApiResponse<OverseasPctResponse>> => {
      const { data } =
        await client.axios.get<ApiResponse<OverseasPctResponse>>(`/api/oversea/pct/${appSeq}`);
      return data;
    },
  };
}
