import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

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
  receiptDate: string;
  ourRef: string;
  yourRef: string;
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
  autoProtectionDate?: string;
  announcementDate?: string;
  announcementNo?: string;
};

// 담당정보
type AppManagerInfo = {
  deptCode: string; // 부서코드
  deptName?: string; // 부서명

  applicantContactInfo: {
    userSeq?: string; // 출원인담당 Seq
    userName: string; // 출원인담당 Seq
  };
  adminMgrInfo: {
    userSeq?: string; // 관리담당자 Seq
    userName: string; // 관리담당자 Seq
  };
  caseMgrInfo: {
    userSeq?: string; // 사건담당자 Seq
    userName: string; // 사건담당자 Seq
  };
  attorneyInfo: {
    userSeq?: string; // 담당변리사 Seq
    userName: string; // 담당변리사 Seq
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
};

// 명칭정보
type AppNameInfo = {
  titleKo: string; // 국문명칭
  titleEn: string; // 영문명칭
};

// 출원전략설정
type AppStrategy = {
  //원등록
  originalRegInfo: {
    originalRegDate: string;
    originalRegNo: string;
  };
  designated?: string[];
  subsequent?: string[];
  registeredStates?: string[];
};

// 물품류
type GoodsClass = {
  goodsClass: string;
};

// 출원 행정관리
type AppManagement = {
  abandonReceiptDate?: string;
  abandonDate?: string;
  abandonNote?: string;
};

// 출원 등록및 권리유지
type AppMaintenance = {
  domesticRegInfo: {
    domesticRegDate?: string;
    domesticRegNo?: string;
  };
  regDate?: string;
  regNo?: string;
  paymentInstallment?: string;
  standardDeadline?: string;
  penaltyDeadline?: string;
  annuityOrderDate?: string;
  annuityAgency?: string;
};

// 등록 권리유지관리
type AppNote = {
  note?: string;
};

// 첨부파일 정보
export type MadridFileInfo = {
  fileSeq: string;
  fileName: string;
  fileSize?: string;
  fileUrl?: string;
  docSeq?: string;
};

// 해외출원 마드리드 등록 요청
export type OverseasMadridCreateRequest = {
  appSeq?: string;
  appExtSeq: string;
  appCaseMng: AppCaseMng;
  appBaseInfo: AppBaseInfo;
  appManagerInfo: AppManagerInfo;
  appCounterPartyInfo: AppCounterPartyInfo;
  appNameInfo: AppNameInfo;
  appStrategy: AppStrategy;
  appManagement: AppManagement;
  appMaintenance: AppMaintenance;
  appNote: AppNote;
  goodsClass: GoodsClass;
  trademarkImage?: File;
};

// 해외출원 마드리드 응답
export type OverseasMadridResponse = {
  appSeq?: string;
  appExtSeq?: string;
  appStatus?: { code?: string; codeName?: string };
  appCaseMng: AppCaseMng;
  appBaseInfo: AppBaseInfo;
  appManagerInfo: AppManagerInfo;
  appCounterPartyInfo: AppCounterPartyInfo;
  appNameInfo: AppNameInfo;
  appStrategy: AppStrategy;
  appManagement: AppManagement;
  appMaintenance: AppMaintenance;
  appNote: AppNote;
  goodsClass: GoodsClass;
  fileInfo?: MadridFileInfo[];
};

export function madridApi(client: ApiClient) {
  return {
    createMadridOverseas: async (
      payload: OverseasMadridCreateRequest,
    ): Promise<ApiResponse<string>> => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      if (payload.trademarkImage != null) {
        formData.append("trademarkImage", payload.trademarkImage);
      }
      const { data } = await client.axios.post<ApiResponse<string>>("/api/oversea/madrid", formData);
      return data;
    },
    getOverseasMadridDetail: async (
      overseasMadridSeq: string,
    ): Promise<ApiResponse<OverseasMadridResponse>> => {
      const { data } = await client.axios.get<ApiResponse<OverseasMadridResponse>>(
        `/api/oversea/madrid/${overseasMadridSeq}`,
      );
      return data;
    },
    deleteMadridImage: async ({ appSeq, fileSeq }: { appSeq: string, fileSeq: string }): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.delete<ApiResponse<null>>(
        `/api/appCommon/file/${appSeq}/${fileSeq}`,
      );
      return data;
    },
  };
}
