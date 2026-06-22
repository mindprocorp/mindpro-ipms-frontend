import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";
import type {
  DomesticListRequest,
  DomesticListResponse,
} from "@shared/api/domestic/domesticApi.ts";
import type { OverseasBasicResponse } from "@shared/api/overseas/basicApi.ts";

// 출원사건관리
type AppCaseMng = {
  rightType: string; //권리
  appType: string; //출원종류
  receiptDate: string; //접수일
  ourRef: string; // OurRef
  appCompleteDate: string; // 출원완료일
  appManagerInfo: {
    appManagerSeq: string; // 출원담당자 Seq
    appManagerName?: string; // 출원담당자 명
  };
  caseNo: string; // 사건번호
};

// 담당정보
type AppManagerInfo = {
  deptCode: string; // 부서코드
  deptName?: string; // 부서명
  adminMgrInfo: {
    adminMgrSeq: string; // 관리담당자 Seq
    adminMgrName?: string; // 관리담당자 명
  };
  caseMgrInfo: {
    caseMgrSeq: string; // 사건담당자 Seq
    caseMgrName?: string; // 사건담당자 명
  };
  attorneyInfo: {
    attorneySeq: string; // 담당변리사 Seq
    attorneyName?: string; // 담당변리사 명
  };
};

// 당사자정보
type AppCounterPartyInfo = {
  clientInfo: {
    clientSeq: string; // 의뢰인 Seq
    clientName?: string; // 의뢰인 명
  };
  clientContactInfo: {
    clientContactSeq: string; // 의뢰인담당자 Seq
    clientContactName?: string; // 의뢰인담당자 명
  };
  applicantInfo: {
    applicantSeq: string; // 출원인 Seq
    applicantName?: string; // 출원인 명
  };
  inventorInfo: {
    inventorSeq: string; // 발명자 Seq
    inventorName?: string; // 발명자 명
  };
  regMgrInfo: {
    regMgrSeq: string; // 등록관리자 Seq
    regMgrName?: string; // 등록관리자 명
  };
};

// 명칭정보
type AppNameInfo = {
  titleKo: string; // 국문명칭
  titleEn: string; // 영문명칭
};

// 명세서구성요소
type AppSpecificElement = {
  grade: string; // 등급
  independentClaims: number | unknown; // 독립항
  dependentClaims: number | unknown; // 종속항
  specPage: number | unknown; // 명세서
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
};

//포기 정보
type AppAbandonInfo = {
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

// 기본정보
type AppImageFile = {
  fileSeq: string;
  originalFilename: string;
  fileName: string;
  fileUrl: string;
  size: string;
  lastModified: string;
};


export type BillDomesticType = {
  appSeq?: string;
  customerSeq?: string;
  invoiceSeq?: string;
  invCategory: {
    code: string;
    codeName: string;
  };
  caseCategory: {
    code: string;
    codeName: string;
  };
  invClass: {
    code: string;
    codeName: string;
  };
  invType: {
    code: string;
    codeName: string;
  };
  invDate: string;
  invNo: string;
  invSendDate: string;
  invMgr: {
    userSeq?: string;
    userName: string;
  };
  ourRef: string;
  clientRef?: string;
  deptName?: string;
  adminMgr: {
    userSeq?: string;
    userName?: string;
  };
  caseMgr: {
    userSeq?: string;
    userName?: string;
  };
  attorney: {
    userSeq?: string;
    userName: string;
  };

  oaDocument: string;
  invContent: string;
  rightType?: {
    code?: string;
    codeName?: string;
  };
  appDate?: string;
  appNo?: string;
  regDate?: string;
  regNo?: string;
  grade?: string;
  finalClaimsCount?: string;
  dependentClaims?: string;
  specPage?: string;
  drawingCount?: string;
  figureCount?: string;
  customerName?: string;
  customerContact?: {
    userSeq?: string;
    userName?: string;
  };
  applicantName?: string;
  clientName?: string;
  titleKo?: string;
  titleEn?: string;
  productClass?: string; // 물품류
  note: string; // 물품류
  taxBillDate: string;
  taxBillNo: string;
  taxBillType: {
    code: string;
    codeName: string;
  };
  taxBillCategory: {
    code: string;
    codeName: string;
  };
  bizName: string;
  bizCeo: string;
  bizRegNo: string;
  bizWorkplaceNo: string;
  bizAddr: string;
  bizType: string;
  bizItem: string;
  bizContactName: string;
  bizDeptName: string;
  bizEmail: string;
  govFeePayDate: string;
  govFeePayAmount: string;
  govFee: string;
  agencyFee: string;
  vat: string;
  etcFee: string;
  totalInvAmount: string;
  depAmount: string;
  unpaidAmount: string;
  abandonDate: string;
  abandonAmount: string;
  abandonContent: string;
  outsourceContent: string;
  outsourceAmount: string;
  outsourceVat: string;
  perfDate: string;
  perfAmount: string;
  billSeq?: string;
};

// 내국 청구서 request
export type BillDomesticCreateRequest = BillDomesticType & {};

// 내국 청구서  응답
export type BillDomesticResponse = BillDomesticType & {};

// 내국 청구서  리스트 요청
export type BillDomesticListRequest = {
  officeSeq?: string;
  offSet?: number;
  searchCondition?: Array<Record<string, string>>;
  textFilters?: Array<Record<string, string>>;
  dateFilters?: Array<Record<string, string>>;
  page: number;
  pageSize: number;
};

// 내국 청구서  리스트 응딥
export type BillDomesticListResponse = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: DomesticListItems[];
};

export type DomesticListItems = {
  appSeq: string;
  customerSeq: string;
  bizInfoSeq: string;
  invoiceSeq: string;
  invCategory: {
    code: string;
    codeName: string;
  };
  invClass: {
    code: string;
    codeName: string;
  };
  invType: {
    code: string;
    codeName: string;
  };
  invDate: string;
  invNo: string;
  invSendDate: string;
  invMgr: {
    code: string;
    codeName: string;
  };
  ourRef: string;
  clientRef: string;
  deptName: string;
  adminMgr: {
    userSeq: string;
    userName: string;
  };
  caseMgr: {
    userSeq: string;
    userName: string;
  };
  attorney: {
    userSeq: string;
    userName: string;
  };
  customerContact: {
    userSeq: string;
    userName: string;
  };
  oaDocument: string;
  invContent: string;
  taxBillDate: string;
  taxBillNo: string;
  taxBillType: {
    code: string;
    codeName: string;
  };
  taxBillCategory: {
    code: string;
    codeName: string;
  };
  bizName: string;
  bizCeo: string;
  bizRegNo: string;
  bizWorkplaceNo: string;
  bizAddr: string;
  bizType: string;
  bizItem: string;
  bizContactName: string;
  bizDeptName: string;
  bizEmail: string;
  note: string;
  govFee: string;
  agencyFee: string;
  vat: string;
  etcFee: string;
  totalInvAmount: string;
  depAmount: string;
  unpaidAmount: string;
  abandonDate: string;
  abandonAmount: string;
  abandonContent: string;
  govFeePayDate: string;
  govFeePayAmount: string;
  outsourceDate: string;
  outsourceContent: string;
  outsourceAmount: string;
  outsourceVat: string;
  perfDate: string;
  perfAmount: string;
}

// 청구내역 리스트 요청
export type BillDetailListRequest = BillDetailListType & {};

// 청구내역 리스트 응딥
export type BillDetailListResponse = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: BillDetailListType[];
};

export type BillDetailListType = {
  invoiceSeq: string;
  invoiceClaimSeq?: string;
  costCategory: {
    code: string;
    codeName: string;
  };

  itemContent: string;
  unitPrice: string;
  quantity: string;
  quantity1?: string;
  amount: string;
  vatAmount: string;
  totalAmount: string;
  note: string;
};

export function billDomesticApi(client: ApiClient) {
  return {
    // 백엔드 응답에 invoiceSeq 포함 (InvoiceResponse.InvoiceDomesticDetail). billSeq alias도 함께 노출
    createBillDomestic: async (
      payload: BillDomesticCreateRequest,
    ): Promise<ApiResponse<{ invoiceSeq: string; billSeq?: string } & Record<string, any>>> => {
      const { data } = await client.axios.post<
        ApiResponse<{ invoiceSeq: string; billSeq?: string } & Record<string, any>>
      >("/api/invoice/domestic", payload);
      return data;
    },
    getBillDomesticDetail: async (billSeq: string): Promise<ApiResponse<BillDomesticResponse>> => {
      const { data } = await client.axios.get<ApiResponse<BillDomesticResponse>>(
        "/api/invoice/domestic/" + billSeq,
      );
      return data;
    },
    getBillDomesticList: async (
      payload: BillDomesticListRequest,
    ): Promise<ApiResponse<BillDomesticListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<BillDomesticListResponse>>(
        `/api/invoice/domestic/list`,
        payload,
      );
      return data;
    },
    // 청구내역
    getBillDetailList: async (payload: string): Promise<ApiResponse<BillDetailListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<BillDetailListResponse>>(
        //`/api/invoice/${invoiceSeq}/claims/list`,
        `/api/invoice/claims/list`,
        payload,
      );
      return data;
    },
    // 청구내역 등록
    createBillDetail: async (payload: BillDetailListRequest): Promise<ApiResponse<null>> => {
      const { data } = await client.axios.post<ApiResponse<null>>(
        `/api/invoice/claims`,
        payload,
      );
      return data;
    },
  };
}
