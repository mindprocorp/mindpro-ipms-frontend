import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";
import { RIGHT_TYPE } from "@shared/enum/domesticType.ts";

// 출원사건관리
type AppCaseMng = {
  appRoute: {
    code: string;
    codeName?: string;
  };
  rightType: {
    code: string;
    codeName?: string;
  };
  appCategory: {
    code: string;
    codeName?: string;
  };
  category: {
    code: string;
    codeName?: string;
  };
  receiptDate: string;
  ourRef: string;
  yourRef: string;
  clientRef: string;
};

// 기본정보
type AppBaseInfo = {
  noticeExceptionApply: {
    code : string;
    codeName? : string;
  }; // 공지예외적용
  appDeadline: string; // 출원마감일
  oaDeliveryDate: string; // 오더발송일
  appDate: string; // 출원일
  appNo: string; // 출원번호\
  divAppInfo: {
    divDeadline: string; // 분할출원마감일
    divAppDate?: string; // 분할 출원일
    divAppNo?: string; // 분할출원번호
  };
};

// 담당정보
type AppManagerInfo = {
  deptCode: string; // 부서코드
  deptName?: string; // 부서명

  applicantContactInfo: {
    userSeq: string; // 출원인담당 Seq
    userName?: string; // 출원인담당 Seq
  };
  adminMgrInfo: {
    userSeq: string; // 관리담당자 Seq
    userName?: string; // 관리담당자 Seq
  };
  caseMgrInfo: {
    userSeq: string; // 사건담당자 Seq
    userName?: string; // 사건담당자 Seq
  };
  attorneyInfo: {
    userSeq: string; // 담당변리사 Seq
    userName?: string; // 담당변리사 Seq
  };
};

// 당사자정보
type AppCounterPartyInfo = {
  foreignAgentInfo: {
    counterPartySeq: string; // 해외대리인 Seq
    counterPartyName?: string; // 해외대리인 명
  }[];
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

// 명세서구성요소
type AppSpecificElement = {
  grade: {
    code : string;
    codeName? : string;
  }; // 등급
  independentClaims: number | unknown; // 독립항
  dependentClaims: number | unknown; // 종속항
  overseaSpecPage: number | unknown; // 해외명세서
  drawingCount: number | unknown; // 도면수
};

// 출원전략설정
type AppStrategy = {
  //원등록
  originalAppInfo: {
    originalAppDate: string;
    originalAppNo: string;
  };
  //국제출원정보
  globalAppInfo: {
    globalAppDate: string;
    globalAppNo: string;
  };
};

// 지정국가
type DesignatedStateInfo = {
    designated?: string[];
};

// 등록국가
type RegisteredStates = {
  registeredStates?: string[];
};

// 물품류(IPC분류)
type AppIpcClass = {
  ipcClassification: string;
};

// 출원 행정관리
type AppManagement = {
  claimAmendDate: string; // 청구보장일
  announcementDate: string; //공고일
  examRequestDeadline: string; // 심사청구마감일
  examRequestOrderDate: string; // 심사청구지시일
  examRequestDate: string; // 심사청구청구일
  searchReceiptDate: string; // 서치 접수일
  searchReportDate: string; // 서치 보고일
  epSearchResult: string; // 서치 결과
  pubDate: string; // 출원공개일자
  pubNo: string; // 출원공개번호
};

// 출원 등록및 권리유지
type AppMaintenance = {
  regDecisionDate: string;
  regNormalDeadline: string;
  regGraceDeadline: string;
  regOrderDate: string;
  regPaymentDate: string;
  regDate: string;
  regNo: string;
  regAnnounceDate: string;
  regAnnounceNo: string;
  annuityOrderDate: string;
  annuityAgency: string;
  deemedWithdrawalReceiptDate: string;
  deemedWithdrawalDate: string;
  deemedWithdrawalContent: string;
};

// 등록 권리유지관리
type AppNote = {
  note: string;
};

type ClaimSummaryInfo = {
  summary: string;
  claimScope: string;
};


// 해외출원 EP 등록 요청
export type OverseasEpCreateRequest = {
  appCaseMng: AppCaseMng; //출원사건관리
  appBaseInfo: AppBaseInfo; //기본정보
  appManagerInfo: AppManagerInfo; //담당정보
  appCounterPartyInfo: AppCounterPartyInfo; //당사자정보
  appNameInfo: AppNameInfo; //명칭정보
  appSpecificElement: AppSpecificElement; //명세서구성요소
  appStrategy: AppStrategy; //출원전략설정
  appManagement: AppManagement; //출원행정관리
  appMaintenance: AppMaintenance; //출원 등록 및 권리유지 관리
  appNote: AppNote; // 비고
  claimSummaryInfo?: ClaimSummaryInfo; // 요약/청구
  mainDrawingFile?: File;
  designatedStateInfo: DesignatedStateInfo;
  registeredStates: RegisteredStates;
  appIpcClass: AppIpcClass;
  appExtSeq: string;
  appSeq?: string;
};

// 해외출원 EP 응답
export type OverseasEpResponse = {
  appSeq?: string;
  appExtSeq?: string;
  appStatus?: { code?: string; codeName?: string };
  appCaseMng: AppCaseMng; //출원사건관리
  appBaseInfo: AppBaseInfo; //기본정보
  appManagerInfo: AppManagerInfo; //담당정보
  appCounterPartyInfo: AppCounterPartyInfo; //당사자정보
  appNameInfo: AppNameInfo; //명칭정보
  appSpecificElement: AppSpecificElement; //명세서구성요소
  appStrategy: AppStrategy; //출원전략설정
  appManagement: AppManagement; //출원행정관리
  appMaintenance: AppMaintenance; //출원 등록 및 권리유지 관리
  appNote: AppNote; // 비고
  claimSummaryInfo?: ClaimSummaryInfo; // 요약/청구
  designatedStateInfo: DesignatedStateInfo;
  registeredStates: RegisteredStates;
  appIpcClass: AppIpcClass;
  fileInfo?: any[];
};

export function epApi(client: ApiClient) {
  return {
    createEpOverseas: async (
      payload: OverseasEpCreateRequest,
    ): Promise<ApiResponse<string>> => {
      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));

      if (payload.mainDrawingFile != null) {
        formData.append("mainDrawingFile", payload.mainDrawingFile);
      }
      const { data } = await client.axios.post<ApiResponse<string>>("/api/oversea/ep", formData);
      return data;
    },
    getOverseasEpDetail: async (
      overseasDirectSeq: string,
    ): Promise<ApiResponse<OverseasEpResponse>> => {
      const { data } = await client.axios.get<ApiResponse<OverseasEpResponse>>(
        `/api/oversea/ep/${overseasDirectSeq}`,
      );
      return data;
    },
    deleteEpImage: async ({ appSeq, fileSeq }: { appSeq: string, fileSeq: string }): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/appCommon/file/${appSeq}/${fileSeq}`,
      );
      return data;
    },
  };
}
