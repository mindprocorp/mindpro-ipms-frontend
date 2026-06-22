import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

// 출원사건관리
type AppCaseMng = {
  appRoute: {
    code: string;
    codeName?: string;
  };
  category?: {
    code?: string;
    codeName?: string;
  };
  rightType?: {
    code?: string;
    codeName?: string;
  };
  appCategory?: {
    code?: string;
    codeName?: string;
  };
  receiptDate: string;
  ourRef: string;
  clientRef: string;
};

// 기본정보
type AppBaseInfo = {
  noticeExceptionApply: {
    code: string;
    codeName?: string;
  };
  appDeadline: string;
  appDate: string;
  appNo?: string;
  authorityRefNo?: string;
  authoritySubmissionDate?: string;
  hagueDeliveryDate?: string;
  wipoRefNo?: string;
  regDate?: string;
  regNo?: string;
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
  clientInfo: {
    counterPartySeq: string; // 의뢰인 Seq
    counterPartyName?: string; // 의뢰인 명
  }[];

  applicantInfo: {
    counterPartySeq: string; // 출원인 Seq
    counterPartyName?: string; // 출원인 명
  }[];
  inventorInfo: {
    userSeq: string; // 창작자 Seq
    userName?: string; // 창작자 명
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

// 출원전략설정
type AppStrategy = {
  designated?: string[];
  registeredStates?: string[];
};

// 물품류
type GoodsClass = {
  goodsClass: string;
};

// 출원 행정관리
type AppManagement = {
  amendNoticeDate?: string;
  amendDeadline?: string;
  amendSubmitDate?: string;
  publicYn?: string;
  defermentMonthCount?: string;
  pubDate?: string;
  pubNo?: string;
  abandonReceiptDate?: string;
  abandonDate?: string;
  abandonNote?: string;
};

// 출원 등록및 권리유지
type AppMaintenance = {
  protectionStartDate?: string;
  rightPeriod?: string;
  paymentInstallment?: string;
  standardDeadline?: string;
  penaltyDeadline?: string;
};

// 등록 권리유지관리
type AppNote = {
  note?: string;
};

// 디자인 설명/요점
type DesignDescription = {
  designDescription?: string;
  designSummary?: string;
};

// 해외출원 국제디자인 등록 요청
export type OverseasNationalCreateRequest = {
  appCaseMng: AppCaseMng;
  appBaseInfo: AppBaseInfo;
  appManagerInfo: AppManagerInfo;
  appCounterPartyInfo: AppCounterPartyInfo;
  appNameInfo: AppNameInfo;
  appStrategy: AppStrategy;
  designDescription?: DesignDescription;
  appManagement: AppManagement;
  appMaintenance: AppMaintenance;
  appNote: AppNote;
  mainImageFile?: File;
  appExtSeq: string;
  appSeq?: string;
};

// 첨부파일 정보
export type FileInfo = {
  fileSeq: string;
  fileName: string;
  fileSize?: string;
  fileUrl?: string;
  docSeq?: string;
};

// 해외출원 국제디자인 응답
export type OverseasNationalResponse = {
  appSeq?: string;
  appExtSeq?: string;
  appStatus?: { code?: string; codeName?: string };
  appCaseMng: AppCaseMng;
  appBaseInfo: AppBaseInfo;
  appManagerInfo: AppManagerInfo;
  appCounterPartyInfo: AppCounterPartyInfo;
  appNameInfo: AppNameInfo;
  appStrategy: AppStrategy;
  designDescription?: DesignDescription;
  appManagement: AppManagement;
  appMaintenance: AppMaintenance;
  appNote: AppNote;
  fileInfo?: FileInfo[];
};

export function nationalApi(client: ApiClient) {
  return {
    createNationalOverseas: async (
      payload: OverseasNationalCreateRequest,
    ): Promise<ApiResponse<string>> => {
      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));
      if (payload.mainImageFile) {
        formData.append("mainImageFile", payload.mainImageFile);
      }

      const { data } = await client.axios.post<ApiResponse<string>>(
        "/api/oversea/interDesign",
        formData,
      );
      return data;
    },
    getOverseasNationalDetail: async (
      overseasDirectSeq: string,
    ): Promise<ApiResponse<OverseasNationalResponse>> => {
      const { data } = await client.axios.get<ApiResponse<OverseasNationalResponse>>(
        `/api/oversea/interDesign/${overseasDirectSeq}`,
      );
      return data;
    },
    deleteNationalImage: async ({ appSeq, fileSeq }: { appSeq: string, fileSeq: string }): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/appCommon/file/${appSeq}/${fileSeq}`,
      );
      return data;
    },
  };
}
