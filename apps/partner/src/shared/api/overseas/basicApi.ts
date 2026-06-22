import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";
import type {
  DomesticListRequest,
  DomesticListResponse,
} from "@shared/api/domestic/domesticApi.ts";

// 출원사건관리
type AppCaseMng = {
  rightType: { code: string; codeName?: string }; //권리
  appType: { code: string; codeName?: string }; //출원종류
  receiptDate: string; //접수일
  ourRef: string; // OurRef
  appCompleteDate: string; // 출원완료일
  appManagerInfo: {
    userSeq: string; // 출원담당자 Seq
    userName?: string; // 출원담당자 명
  };
  caseNo: string; // 사건번호
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
    userSeq: string; // 발명자 Seq
    userName?: string; // 발명자 명
  };
  regMgrInfo: {
    counterPartySeq: string; // 해외대리인 Seq
    counterPartyName?: string; // 해외대리인 명
  }[];
};

// 명칭정보
type AppNameInfo = {
  titleKo: string; // 국문명칭
  titleEn: string; // 영문명칭
};

// 명세서구성요소
type AppSpecificElement = {
  grade: { code: string; codeName: string; }; // 등급
  independentClaims: number | unknown; // 독립항
  dependentClaims: number | unknown; // 종속항
  overseaSpecPage: number | unknown; // 명세서
  drawingCount: number | unknown; // 도면
};

// 물품류
type GoodsClass = {
  goodsClass: string; // 물품수
};

// 출원전략설정
type AppStrategy = {
  //국제출원정보
  globalAppInfo: {
    globalAppDate: string;
    globalAppNo: string;
  };
};

//지정국가 정보
type DesignatedStateInfo = {
  designatedIndividual: string[]; //개국
  designatedPct?: string[]; //PCT
  designatedEp?: string[]; //EP
  designatedMadrid?: string[]; // 마드리드
  designatedIntlDesign?: string[]; // 국제디자인
  abandonDate: string; // 일자
  abandonContent: string; //내용
};

// 등록 권리유지관리
type AppNote = {
  note: string;
};

// 기본정보
type BaseInfo = {
  createUser : string
  createAt : string
  updateUser : string
  updateAt : string
  delYn : string
  note : string
};

// 이미지/파일 정보 (basicSchema.ts fileInfo 구조와 통일)
type AppImageFile = {
  fileSeq: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  docSeq: string;
  docNm: string;
};




// 해외출원 등록 요청
export type OverseasBasicCreateRequest = {
  appCaseMng: AppCaseMng; //출원사건관리
  appManagerInfo: AppManagerInfo; //담당정보
  appCounterPartyInfo: AppCounterPartyInfo; //당사자정보
  appNameInfo: AppNameInfo; //명칭정보
  goodsClass: GoodsClass; //물품류
  appSpecificElement: AppSpecificElement; //명세서구성요소
  appStrategy: AppStrategy; //출원전략설정
  designatedStateInfo: DesignatedStateInfo; //지정국가 정보 (해외 전용)
  appNote: AppNote; // 비고
  mainImageFile?: File; // 대표이미지
};



// 해외출원 응답
export type OverseasBasicResponse = {
  appCaseMng: AppCaseMng; //출원사건관리
  appManagerInfo: AppManagerInfo; //담당정보
  appCounterPartyInfo: AppCounterPartyInfo; //당사자정보
  appNameInfo: AppNameInfo; //명칭정보
  goodsClass: GoodsClass; //물품류
  appSpecificElement: AppSpecificElement; //명세서구성요소
  appStrategy: AppStrategy; //출원전략설정
  designatedStateInfo: DesignatedStateInfo; //지정국가 정보 (해외 전용)
  appNote: AppNote; // 비고
  baseInfo: BaseInfo; // 기본정보
  appImageFile: AppImageFile; // 이미지정보
};

// 해외출원 기본 리스트 요청
export type OverseasBasicListRequest = {
  officeSeq?: string;
  offSet?: number;
  searchCondition?: Array<Record<string, string>>;
  textFilters?: Array<Record<string, string>>;
  dateFilters?: Array<Record<string, string>>;
  page: number;
  pageSize: number;
};

// 해외출원 기본 리스트 응딥
export type OverseasBasicListResponse = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: OverseasBasicListItem[];
};

export type OverseasBasicListItem = {
  appExtSeq: string;
  rightType: {
    code: string;
    codeName: string;
  };
  status: {
    code: string;
    codeName: string;
  };
  ourRef: string;
  receiptDate: string;
  appType: {
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
  appNameInfo: {
    titleKo: string;
    titleEn: string;
  };
  designatedPctCnt: number;
  designatedEpCnt: number;
  designatedIndividualCnt: number;
  designatedMadridCnt: number;
  designatedIntlDesignCnt: number;
};



export function basicApi(client: ApiClient) {
  return {
    createBasicOverseas: async (
      payload: OverseasBasicCreateRequest,
    ): Promise<ApiResponse<string>> => {
      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));
      if (payload.mainImageFile) {
        formData.append("mainImageFile", payload.mainImageFile);
      }

      const { data } = await client.axios.post<ApiResponse<string>>("/api/oversea/basic", formData);
      return data;
    },
    getOverseasBasicDetail: async (
      overseasSeq: string,
    ): Promise<ApiResponse<OverseasBasicResponse>> => {
      const { data } = await client.axios.get<ApiResponse<OverseasBasicResponse>>(
        "/api/oversea/basic/" + overseasSeq,
      );
      return data;
    },
    getOverseasBasicList: async (
      payload: OverseasBasicListRequest,
    ): Promise<ApiResponse<OverseasBasicListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<OverseasBasicListResponse>>(
        `/api/oversea/basic/list`,
        payload,
      );
      return data;
    },
    /**
     * 출원 공통 - 첨부 이미지 삭제 (사시도/상표이미지 등)
     * DELETE /api/appCommon/file/{appSeq}/{fileSeq}
     */
    deleteAppImageFile: async (appSeq: string, fileSeq: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/appCommon/file/${appSeq}/${fileSeq}`,
      );
      return data;
    },
  };
}
