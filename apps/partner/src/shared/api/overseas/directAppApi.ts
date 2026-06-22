import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";
import { RIGHT_TYPE } from "@shared/enum/domesticType.ts";

// 출원사건관리
type AppCaseMng = {
  appRoute: { code: string; codeName?: string }; //권리
  rightType: { code: string; codeName?: string }; //권리
  appCategory: { code: string; codeName?: string }; //출원구분
  appCountryInfo: { code: string; codeName?: string };
  appCountry: string; //출원국
  ourRef: string; // OurRef
  yourRef: string; // yourRef
  clientRef: string; // 출원인관리번호
  receiptDate: string; //접수일
};

// 기본정보
type AppBaseInfo = {
  appOrderDate: string; // 출원지시일
  appDeadline: string; // 출원마감일
  oaDeliveryDate: string; // 오더발송일
  appDate: string; // 출원일
  appNo: string; // 출원번호\
  noticeExceptionApply?: { code?: string; codeName?: string };
};

// 담당정보
type AppManagerInfo = {
  deptCode: string; // 부서코드
  deptName?: string; // 부서명

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
  regMgrInfo: {
    counterPartySeq: string; // 등록관리자 Seq
    counterPartyName?: string; // 등록관리자 명
  }[];
};

// 명칭정보
type AppNameInfo = {
  titleKo: string; // 국문명칭
  titleEn: string; // 영문명칭
};

// 명세서구성요소
type AppSpecificElement = {
  grade: { code: string; codeName?: string; }; // 등급
  independentClaims: number | unknown; // 독립항
  dependentClaims: number | unknown; // 종속항
  overseaSpecPage: number | unknown; // 해외명세서
  drawingCount: number | unknown; // 도면수
  specPage: number | unknown; // 국내명세서
};


// 출원전략설정
type AppStrategy = {
  //가출원
  provisionalAppInfo: {
    provisionalAppDate: string;
    provisionalAppNo: string;
  };
  //최초출원
  firstAppInfo: {
    firstAppDate: string;
    firstAppNo: string;
  };
  //원출원
  originalAppInfo: {
    originalAppDate: string;
    originalAppNo: string;
  };
  //원등록
  originalRegInfo: {
    originalRegDate: string;
    originalRegNo: string;
  };
  //재출원
  reAppInfo: {
    reAppDate: string;
    reAppNo: string;
  };
  //국제출원정보
  globalAppInfo: {
    globalAppDate: string;
    globalAppNo: string;
  };
  parentRegAppDate?: string;
  parentRegAppNo?: string;
};

// 출원 행정관리
type AppManagement = {
  ipcClassification: string; // IPC분류
  parentRegAppDate: string; //모등록일
  examRequestDeadline: string; // 심사청구마감일
  examRequestOrderDate: string; // 심사청구지시일
  examRequestDate: string; // 심사청구청구일
  pubDate: string; // 출원공개일자
  pubNo: string; // 출원공개번호
  announcementDate: string; // 출원공고일자
  announcementNo: string; // 출원공고번호
  abandonOrderDate: string; // 포기지시일
  abandonDate: string; // 포기일자
  abandonNote: string; // 포기내용
};

// 출원 등록및 권리유지
type AppMaintenance = {
  finalClaimCount?: number | string | unknown; // 최종항수 (백엔드: finalClaimCount)
  kipoDelayDays?: number | string | unknown; // 특허청지연일
  rightPeriod?: string;
  isAnnuityManaged?: string;
  isRenewalManaged?: string; // 갱신관리여부 (상표)
  renewalDeadline?: string; // 갱신등록마감 (상표)
  regDecisionDate?: string;
  regReceiptDate?: string;
  regNormalDeadline?: string; // 등록 정상마감
  regGraceDeadline?: string; // 등록 과태마감
  regDate?: string;
  regNo?: string;
  regAnnounceDate?: string;
  regAnnounceNo?: string;
  nextPaymentInstallment?: string | number | unknown;
  annuityOrderDate?: string;
  annuityAgency?: string;
  standardDeadline?: string; // 연차 정상마감일 (백엔드: standardDeadline)
  penaltyDeadline?: string; // 연차 과태마감일 (백엔드: penaltyDeadline)
  regOrderDate?: string; // 등록 지시일
  regPaymentDate?: string; // 등록 납부일
  goodsClass?: {
    goodsClass?: string;
  };
};


// 등록 권리유지관리
type AppNote = {
  note: string;
};



// 해외출원 개국 등록 요청
export type OverseasDirectCreateRequest = {
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
  mainImageFile?: File;
  appExtSeq : string;
  appSeq? : string;
};


// 해외출원 개국 응답
export type OverseasDirectResponse = {
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
  fileInfo?: any[]; // 첨부파일정보
};


export function directAppApi(client: ApiClient) {
  return {
    createDirectOverseas: async (
      payload: OverseasDirectCreateRequest,
      rightType: string,
    ): Promise<ApiResponse<string>> => {
      const formData = new FormData();


      if (RIGHT_TYPE.PATENT.code === rightType) {
        formData.append("data", JSON.stringify(payload));
        if (payload.mainImageFile) {
          formData.append("mainImageFile", payload.mainImageFile);
        }
        const { data } = await client.axios.post<ApiResponse<string>>(
          "/api/oversea/individual/patent",
          formData,
        );
        return data;
      } else if (RIGHT_TYPE.PRACTICE.code === rightType) {
        formData.append("data", JSON.stringify(payload));
        if (payload.mainImageFile) {
          formData.append("mainImageFile", payload.mainImageFile);
        }
        const { data } = await client.axios.post<ApiResponse<string>>(
          "/api/oversea/individual/patent",
          formData,
        );
        return data;
      } else if (RIGHT_TYPE.DESIGN.code === rightType) {
        formData.append("data", JSON.stringify(payload));

        if (payload.mainImageFile) {
          formData.append("mainImageFile", payload.mainImageFile);
        }

        const { data } = await client.axios.post<ApiResponse<string>>(
          "/api/oversea/individual/design",
          formData,
        );
        return data;
      } else if (RIGHT_TYPE.TRADE.code === rightType) {
        formData.append("data", JSON.stringify(payload));

        if (payload.mainImageFile) {
          formData.append("mainImageFile", payload.mainImageFile);
        }

        const { data } = await client.axios.post<ApiResponse<string>>(
          "/api/oversea/individual/trademark",
          formData,
        );
        return data;
      }else{
        formData.append("data", JSON.stringify(payload));

        const { data } = await client.axios.post<ApiResponse<string>>(
          "/api/oversea/individual/trademark",
          formData,
        );
        return data;
      }



    },
    getOverseasDirectDetail: async (
      overseasDirectSeq: string,
      rightTypeName: string,
    ): Promise<ApiResponse<OverseasDirectResponse>> => {
      // 실용신안(practice)의 경우 백엔드에서 특허(patent)와 동일한 엔드포인트를 사용함
      const targetTypeName = rightTypeName.toLowerCase() === "practice" ? "patent" : rightTypeName;
      const { data } = await client.axios.get<ApiResponse<OverseasDirectResponse>>(
        `/api/oversea/individual/${targetTypeName}/${overseasDirectSeq}`,
      );
      return data;
    },
    deleteDirectImage: async ({ appSeq, fileSeq }: { appSeq: string, fileSeq: string }): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/appCommon/file/${appSeq}/${fileSeq}`,
      );
      return data;
    },
  };
}
