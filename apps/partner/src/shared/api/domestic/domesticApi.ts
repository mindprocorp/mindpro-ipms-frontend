import type { DomesticListColType } from "@pages/domestic/list/columns/DomesticListColumnsData";
import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";
import { RIGHT_TYPE } from "@shared/enum/domesticType.ts";

// 출원사건관리
type AppCaseMng = {
  category: { code: string; codeName?: string }; //구분
  rightType: { code: string; codeName?: string }; //권리
  appType: { code: string; codeName?: string }; //출원종류
  appCategory: { code: string; codeName?: string }; //출원구분
  inventionReportDate?: string; // 발명신고일
  receiptDate: string; //접수일
  ourRef: string; // OurRef
  yourRef: string; // YourRef
  clientRef: string; // 출원인관리번호
  draftDeadline: string; //초안마감일
  draftSendDate: string; // 초안발송일
};

// 출원기본정보
type AppBaseInfo = {
  appOrderDate: string; // 출원지시일
  appDeadline: string; //출원마감일
  appDate: string; // 출원일
  appNo: string; //출원번호
  accessCode?: string; // 접근코드
  appLanguage?: { code: string; codeName?: string }; // 출원언어
  transDeadline?: string; // 번역문마감일
  transSubmitDate?: string; // 번역문제출일
};

// 담당정보
type AppManagerInfo = {
  deptCode: string; // 부서코드
  deptName?: string; // 부서명
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
    counterPartySeq: string; // 해외대리인 Seq
    counterPartyName?: string; // 해외대리인 명
  }[];
  clientContactInfo: {
    userSeq: string; // 의뢰인담당자 Seq
    userName?: string; // 의뢰인담당자 명
  };
  applicantInfo: {
    counterPartySeq: string; // 해외대리인 Seq
    counterPartyName?: string; // 해외대리인 명
  }[];
  inventorInfo: {
    userSeq?: string; // 발명자 Seq
    userName?: string; // 발명자 명
  };
  regMgrInfo: {
    counterPartySeq: string; // 해외대리인 Seq
    counterPartyName?: string; // 해외대리인 명
  }[];
};

// 명칭정보
type AppNameInfo = {
  proposal?: string; // 제안
  titleKo: string; // 국문명칭
  titleEn: string; // 영문명칭
  etcTitle?: string; // 기타표시
};

// 명세서구성요소
type AppSpecificElement = {
  grade?: { code: string; codeName?: string }; // 등급
  independentClaims?: number | unknown; // 독립항
  dependentClaims?: number | unknown; // 종속항
  specPage?: number | unknown; // 명세서
  figureCount?: number | unknown; // 도수
  drawingCount?: number | unknown; // 도면수
};

// 물품류
type GoodsClass = {
  goodsClass?: string; // 물품수
};

// 출원전략설정
type AppStrategy = {
  classificAppNo?: string; // 분류출원번호
  firstAppInfo?: {
    firstAppDate?: string;
    firstAppNo?: string;
  }; // 최초출원번호
  originalAppInfo: {
    originalAppDate: string;
    originalAppNo: string;
  }; // 원출원번호
  reAppInfo: {
    reAppDate: string;
    reAppNo: string;
  }; //
  dualAppInfo?: {
    dualAppDate?: string;
    dualAppNo?: string;
  };
  globalAppInfo?: {
    globalAppDate?: string;
    globalAppNo?: string;
  }; // 원출원번호2
  originalRegInfo?: {
    originalRegDate?: string;
    originalRegNo?: string;
  };
  madridAppInfo?: {
    madridAppDate?: string;
    madridAppNo?: string;
  }; // 마드리드
  foreignAppTiming: { code: string; codeName?: string };
  isForeignApp: string;
  foreign6mDeadline: string;
  foreign1yDeadline?: string;
  foreignAppDate?: string;
  claimsNoticeDate?: string;
  claimsDeadline?: string;
  claimsSubmitDate?: string;
};

// 출원 행정관리
type AppManagement = {
  isPartialDesign?: string; // 부분디자인여부
  isPoaSubmitted: string; // 위임장제출여부
  ipcClassification?: string; // IPC_분류
  isTrademarkResearch?: string; // 상표조사여부
  earlyPubRequestDate?: string; // 조기공개신청일
  hasDomesticPriority?: string; // 국내우선권여부
  domesticPriorDeadline?: string; // 국내우선권마감일
  domesticPriorDate?: string; // 국내우선권주장일
  examRequestDeadline?: string; // 심사청구_마감일
  examRequestDate?: string; // 심사청구_청구일
  priorExamReqDate: string; // 우선심사_청구일
  priorExamDecDate: string; // 우선심사_결정일
  announcementDecisionDate?: string; // 출원공고결정일
  pubDate?: string; // 출원공개_일자
  pubNo?: string; // 출원공개_번호
  announcementDate?: string; // 출원공고_일자
  announcementNo?: string; // 출원공고_번호
  abandonOrderDate: string; // 포기_지시일
  abandonDate: string; // 포기_일자
  abandonNote: string; // 포기_내용
};

// 등록 권리유지관리
type AppMaintenance = {
  finalClaimsCount?: number | unknown; // 등록/권리유지_최종항수(독립/종속)
  multiDesign?: number | unknown; // 등록/권리유지_다의장(물품수, 복수디자인 수)
  kipoDelayDays?: string; // 등록/권리유지_특허청지연일(PAT)
  rightPeriod?: string; // 등록/권리유지_권리종속기간
  isAnnuityManaged: string; // 등록/권리유지_연차관리 여부
  isRenewalManaged?: string; // 갱신관리여부 여부
  regDecisionDate: string; // 등록/등록_결정일
  regReceiptDate: string; // 등록_접수일
  priorityDate?: string; // 기연일
  regNormalDeadline: string; // 등록정상마감
  regGraceDeadline?: string; // 등록과태마감
  regReductionRate?: { code: string; codeName?: string }; // 등록감면율
  regDate: string; // 등록_등록일
  regNo: string; // 등록_등록번호
  regAnnounceDate: string; // 등록공고_일자
  regAnnounceNo: string; // 등록공고_번호
  annuityReducRate?: { code: string; codeName?: string }; // 연차관리_감면율
  trademarkNormalDeadline?: string; // 등록-정상마감일
  trademarkGraceDeadline?: string; // 등록-과태마감일
  nextPaymentInstallment?: string; // 차기납부차수
  annuityYear: string; // 연차관리_차수
  standardDeadline?: string; // 연차관리_정상
  penaltyDeadline?: string; // 연차관리_과태
  recoveryDeadline?: string; // 연차관리_회복
  trademarkRenewalFee?: string; // 갱신등록료
  renewalLateFee?: string; // 갱신과태료
  annuityOrderDate: string; // 연차위임_일자
  annuityAgency: string; // 연차위임_업체
};

// 등록 권리유지관리
type AppNote = {
  note?: string;
};

// 요약/청구 (특허·실용) / 디자인 설명(응답 필드 혼용)
type ClaimSummaryInfo = {
  summary?: string;
  claimScope?: string;
  designDescription?: string;
  designSummary?: string;
};

// 기본정보
type BaseInfo = {
  createUser: string;
  createAt: string;
  updateUser: string;
  updateAt: string;
  delYn: string;
  note: string;
};

// 국내출원 등록 요청
export type DomesticDetailCreateRequest = {
  appCaseMng: AppCaseMng; //출원사건관리
  appBaseInfo: AppBaseInfo; //출원기본정보
  appManagerInfo: AppManagerInfo; //담당정보
  appCounterPartyInfo: AppCounterPartyInfo; //당사자정보
  appNameInfo: AppNameInfo; //명칭정보
  goodsClass?: GoodsClass; //물품류
  appSpecificElement?: AppSpecificElement; //명세서구성요소
  appStrategy: AppStrategy; //출원전략설정
  appManagement: AppManagement; //출원 행정관리
  appMaintenance: AppMaintenance; //등록 권리유지관리
  appNote: AppNote; // 비고
  claimSummaryInfo?: ClaimSummaryInfo; // 요약청구
  multiViewDrawingFile?: File; // 사시도
  appSeq?: string; // 마스터키
};

// 국내출원 응답
export type DomesticDetailResponse = {
  /** 특허/실용신안 상세 등에서 제공 (디자인·상표 DTO에는 없을 수 있음) */
  appStatus?: { code?: string; codeName?: string };
  appCaseMng: AppCaseMng; //출원사건관리
  appBaseInfo: AppBaseInfo; //출원기본정보
  appManagerInfo: AppManagerInfo; //담당정보
  appCounterPartyInfo: AppCounterPartyInfo; //당사자정보
  appNameInfo: AppNameInfo; //명칭정보
  goodsClass?: GoodsClass; //물품류
  appSpecificElement: AppSpecificElement; //명세서구성요소
  appStrategy: AppStrategy; //출원전략설정
  appManagement: AppManagement; //출원 행정관리
  appMaintenance: AppMaintenance; //등록 권리유지관리
  appNote: AppNote; // 비고
  claimSummaryInfo?: ClaimSummaryInfo; // 요약청구 / 디자인 설명
  /** DomesticForm에서 claimSummaryInfo 기반으로 주입 */
  designDescriptionInfo?: {
    designDescription?: string;
    designSummary?: string;
  };
  baseInfo: BaseInfo; // 기본정보
  fileInfo?: FileInfo[];
};

type FileInfo = {
  fileSeq?: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  docSeq?: string;
};

type DomesticListType = {
  rowNum: number; // 순번
  appSeq: string; // APP PK
  officeSeq: string; // 사무소 PK
  category: {
    code: string;
    codeName?: string;
  }; // 구분
  rightType: {
    code: string;
    codeName?: string;
  }; // 권리
  status: {
    code: string;
    codeName?: string;
  }; // 현재상태
  receiptDate: string; //접수일
  caseDeadline: string; // 사건마감일
  ourRef: string; // OurRef
  yourRef: string; // YourRef
  clientRef: string; // 출원인관리번호
  accessCode: string; // 접근코드
  clientName: string; // 의뢰인
  applicantName: string; // 출원인
  inventorName: string; // 발명자
  regMgrName: string; // 등록권리자
  appDate: string; // 출원일
  appNo: string; // 출원번호
} & DomesticListColType;

// 국내출원 리스트 응답
export type DomesticListResponse = {
  totalCount: number; //전체 데이터 개수
  page: number; //조회 페이지
  size: number; //조회사이즈
  totalPage: number; //전체 페이지 수
  list: DomesticListType[]; // 리스트
};

// 국내출원 리스트 파라미터
export type DomesticListRequest = {
  page: number; // 페이지
  pageSize: number; // 페이지사이즈
  searchCondition?: Array<Record<string, string>>;
  dateFilters?: Array<Record<string, string>>;
  textFilters?: Array<Record<string, string>>;
};

export function domesticDetailAPI(client: ApiClient) {
  return {
    createDomestic: async (
      payload: DomesticDetailCreateRequest,
      rightType: string,
    ): Promise<ApiResponse<string>> => {
      if (rightType === RIGHT_TYPE.PATENT.code || rightType === RIGHT_TYPE.PRACTICE.code) {
        const formData = new FormData();

        const jsonBlob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });

        formData.append("data", jsonBlob);

        if (payload.multiViewDrawingFile) {
          formData.append("mainDrawingFile", payload.multiViewDrawingFile);
        }

        const { data } = await client.axios.post<ApiResponse<null>>(
          "/api/domesticApp/patent",
          formData,
        );
        return data;
      } else if (rightType === RIGHT_TYPE.DESIGN.code) {
        const formData = new FormData();

        const jsonBlob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });

        formData.append("data", jsonBlob);

        if (payload.multiViewDrawingFile) {
          formData.append("multiViewDrawingFile", payload.multiViewDrawingFile);
        }

        const { data } = await client.axios.post<ApiResponse<null>>(
          "/api/domesticApp/design",
          formData,
        );
        return data;
      } else if (rightType === RIGHT_TYPE.TRADE.code) {
        const formData = new FormData();

        const jsonBlob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });

        formData.append("data", jsonBlob);

        if (payload.multiViewDrawingFile) {
          // 백엔드 DomesticAppController#createTrademark 에서 기대하는 RequestPart 이름
          formData.append("trademarkImageFile", payload.multiViewDrawingFile);
        }

        const { data } = await client.axios.post<ApiResponse<null>>(
          "/api/domesticApp/trademark",
          formData,
        );
        return data;
      } else {
        const formData = new FormData();

        const jsonBlob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });

        formData.append("data", jsonBlob);

        const { data } = await client.axios.post<ApiResponse<null>>(
          "/api/domesticApp/patent",
          formData,
        );
        return data;
      }
    },
    getDomesticDetail: async (
      domesticSeq: string,
      rightType: string,
    ): Promise<ApiResponse<DomesticDetailResponse>> => {
      const { data } = await client.axios.get<ApiResponse<DomesticDetailResponse>>(
        `/api/domesticApp/${rightType}/${domesticSeq}`,
      );
      return data;
    },
    getDomesticList: async (
      payload: DomesticListRequest,
    ): Promise<ApiResponse<DomesticListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<DomesticListResponse>>(
        `/api/domesticApp/list`,
        payload,
      );
      return data;
    },
    deleteAppImageFile: async (
      appSeq: string,
      fileSeq: string,
    ): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/appCommon/file/${appSeq}/${fileSeq}`,
      );
      return data;
    },
  };
}
