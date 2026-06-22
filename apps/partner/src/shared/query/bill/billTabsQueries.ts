import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  basicApi,
  type OverseasBasicCreateRequest,
  type OverseasBasicListRequest,
} from "@shared/api/overseas/basicApi.ts";
import {
  type BillDetailListRequest,
  billDomesticApi,
  type BillDomesticCreateRequest,
  type BillDomesticListRequest,
} from "@shared/api/bill/billDomesticApi.ts";
import { billTabsApi, type BillClaimDetailType, type BillTabListRequest } from "@shared/api/bill/billTabsApi.ts";



export const billDomesticQueries = {
  createBillDomestic: () =>
    mutationOptions({
      mutationFn: (payload: BillDomesticCreateRequest) =>
        billDomesticApi(apiClient).createBillDomestic(payload),
    }),
  getBillDomesticDetail: () =>
    mutationOptions({
      mutationFn: (billSeq: string) => billDomesticApi(apiClient).getBillDomesticDetail(billSeq),
    }),
  getBillDomesticList: () =>
    mutationOptions({
      mutationFn: (payload: BillDomesticListRequest) =>
        billDomesticApi(apiClient).getBillDomesticList(payload),
    }),
  getBillDetailList: () =>
    mutationOptions({
      mutationFn: (payload: BillDetailListRequest) => billDomesticApi(apiClient).getBillDetailList(payload),
    }),
  createBillDetail: () =>
    mutationOptions({
      mutationFn: (payload : BillDetailListRequest ) =>
        billDomesticApi(apiClient).createBillDetail(payload),
    }),
};

export const billTabsQueries = {
  /* -------------------------------------------------------------------------
   * [탭 1] 청구 상세 내역 (Claim)
   * ------------------------------------------------------------------------- */
  //   리스트 조회 (이사 완료)
  getClaimList: () =>
    mutationOptions({
      mutationFn: ({ tblSeq, payload }: { tblSeq: string; payload?: Partial<BillTabListRequest> }) =>
        billTabsApi(apiClient).getClaimList(tblSeq, payload),
    }),

  //   단건 저장/등록 (이사 완료)
  saveClaimItem: () =>
    mutationOptions({
      mutationFn: (payload: BillClaimDetailType) =>
        billTabsApi(apiClient).saveClaimItem(payload),
    }),

  //   청구 상세 단건 조회
  getClaimDetail: () =>
    mutationOptions({
      mutationFn: (claimSeq: string) =>
        billTabsApi(apiClient).getClaimItem(claimSeq),
    }),

  //   전체 저장 (이사 완료)
  saveClaimList: () =>
    mutationOptions({
      mutationFn: ({ invoiceSeq, dataList }: { invoiceSeq: string; dataList: BillClaimDetailType[] }) =>
        billTabsApi(apiClient).saveClaimList(invoiceSeq, dataList),
    }),


    /* -------------------------------------------------------------------------
   * [탭 1-서브] 대리인 청구 내역 (Agent Claims)
   * ------------------------------------------------------------------------- */
  // 목록 조회
  getAgentClaimList: () =>
    mutationOptions({
      mutationFn: ({ tblSeq, payload }: { tblSeq: string; payload?: Partial<BillTabListRequest> }) =>
        billTabsApi(apiClient).getAgentClaimList(tblSeq, payload),
    }),

  //   단건 조회 (추가 완료!)
  getAgentClaimDetail: () =>
    mutationOptions({
      mutationFn: (claimSeq: string) =>
        billTabsApi(apiClient).getAgentClaimItem(claimSeq),
    }),

  // 단건 저장
  saveAgentClaimItem: () =>
    mutationOptions({
      mutationFn: (payload: BillClaimDetailType) =>
        billTabsApi(apiClient).saveAgentClaimItem(payload),
    }),

  /* -------------------------------------------------------------------------
   * [탭 2] 입금 및 선수금 (Banking)
   * ------------------------------------------------------------------------- */
  getBankingList: () =>
    mutationOptions({
      mutationFn: ({ tblSeq, payload }: { tblSeq: string; payload?: any }) =>
        billTabsApi(apiClient).getBankingList(tblSeq, payload),
    }),
  saveBankingItem: () =>
    mutationOptions({
      mutationFn: (payload: any) => billTabsApi(apiClient).saveBankingItem(payload),
    }),

  //   입금내역 단건 조회
  getBankingDetail: () =>
    mutationOptions({
      mutationFn: (bankingSeq: string) =>
        billTabsApi(apiClient).getBankingItem(bankingSeq),
    }),

  saveBankingList: () =>
    mutationOptions({
      mutationFn: ({ invoiceSeq, dataList }: { invoiceSeq: string; dataList: any[] }) =>
        billTabsApi(apiClient).saveBankingList(invoiceSeq, dataList),
    }),

  /* -------------------------------------------------------------------------
   * [탭 2-서브] 해외 송금 내역 (Foreign Banking)
   * ------------------------------------------------------------------------- */
  getForeignBankingList: () =>
    mutationOptions({
      mutationFn: ({ tblSeq, payload }: { tblSeq: string; payload?: any }) =>
        billTabsApi(apiClient).getForeignBankingList(tblSeq, payload),
    }),
  saveForeignBankingItem: () =>
    mutationOptions({
      mutationFn: (payload: any) => billTabsApi(apiClient).saveForeignBankingItem(payload),
    }),

  //   해외 송금내역 단건 조회
  getForeignBankingDetail: () =>
    mutationOptions({
      mutationFn: (bankingSeq: string) =>
        billTabsApi(apiClient).getForeignBankingItem(bankingSeq),
    }),

  saveForeignBankingList: () =>
    mutationOptions({
      mutationFn: ({ invoiceSeq, dataList }: { invoiceSeq: string; dataList: any[] }) =>
        billTabsApi(apiClient).saveForeignBankingList(invoiceSeq, dataList),
    }),

  /* -------------------------------------------------------------------------
   * [탭 3] 실적 분배 (Performance)
   * ------------------------------------------------------------------------- */
  getPerformanceList: () =>
    mutationOptions({
      mutationFn: (invoiceSeq: string) =>
        billTabsApi(apiClient).getPerformanceList(invoiceSeq),
    }),
  savePerformanceItem: () =>
    mutationOptions({
      mutationFn: (payload: any) => billTabsApi(apiClient).savePerformanceItem(payload),
    }),
  savePerformanceList: () =>
    mutationOptions({
      mutationFn: ({ invoiceSeq, dataList }: { invoiceSeq: string; dataList: any[] }) =>
        billTabsApi(apiClient).savePerformanceList(invoiceSeq, dataList),
    }),

  /* -------------------------------------------------------------------------
   * 삭제 Mutations
   * ------------------------------------------------------------------------- */
  deleteClaim: () =>
    mutationOptions({
      mutationFn: (claimSeq: string) =>
        billTabsApi(apiClient).deleteClaim(claimSeq),
    }),
  deleteBanking: () =>
    mutationOptions({
      mutationFn: (bankingSeq: string) =>
        billTabsApi(apiClient).deleteBanking(bankingSeq),
    }),
  deletePerformance: () =>
    mutationOptions({
      mutationFn: (performanceSeq: string) =>
        billTabsApi(apiClient).deletePerformance(performanceSeq),
    }),

  // 청구 상세 일괄 삭제
  deleteClaimList: () =>
    mutationOptions({
      mutationFn: ({ invoiceSeq, claimSeqs }: { invoiceSeq: string; claimSeqs: string[] }) =>
        billTabsApi(apiClient).deleteClaimList(invoiceSeq, claimSeqs),
    }),

  // 입출금 일괄 삭제
  deleteBankingList: () =>
    mutationOptions({
      mutationFn: ({ invoiceSeq, bankingSeqs }: { invoiceSeq: string; bankingSeqs: string[] }) =>
        billTabsApi(apiClient).deleteBankingList(invoiceSeq, bankingSeqs),
    }),

  // 실적 분배 일괄 삭제
  deletePerformanceList: () =>
    mutationOptions({
      mutationFn: ({ invoiceSeq, performanceSeqs }: { invoiceSeq: string; performanceSeqs: string[] }) =>
        billTabsApi(apiClient).deletePerformanceList(invoiceSeq, performanceSeqs),
    }),

  // 청구서 일괄 삭제 (메인 목록용)
  deleteInvoiceList: () =>
    mutationOptions({
      mutationFn: (invoiceSeqs: string[]) =>
        billTabsApi(apiClient).deleteInvoiceList(invoiceSeqs),
    }),
};
