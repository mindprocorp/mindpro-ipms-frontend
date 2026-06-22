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
      mutationFn: (invoiceSeq: string) => billDomesticApi(apiClient).getBillDetailList(invoiceSeq),
    }),
  createBillDetail: () =>
    mutationOptions({
      mutationFn: (payload : BillDetailListRequest ) =>
        billDomesticApi(apiClient).createBillDetail(payload),
    }),
};


