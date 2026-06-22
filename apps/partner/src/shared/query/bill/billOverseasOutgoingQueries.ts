import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  billOverseasOutgoingApi,
  type BillOutgoingCreateRequest,
  type BillOutgoingListRequest,
} from "@shared/api/bill/billOverseasOutgoingApi.ts";

export const billOverseasOutgoingQueries = {
  createBillOutgoing: () =>
    mutationOptions({
      mutationFn: (payload: BillOutgoingCreateRequest) =>
        billOverseasOutgoingApi(apiClient).createBillOutgoing(payload),
    }),

  getBillOutgoingDetail: () =>
    mutationOptions({
      mutationFn: (billSeq: string) =>
        billOverseasOutgoingApi(apiClient).getBillOutgoingDetail(billSeq),
    }),

  getBillOutgoingList: () =>
    mutationOptions({
      mutationFn: (payload: BillOutgoingListRequest) =>
        billOverseasOutgoingApi(apiClient).getBillOutgoingList(payload),
    }),
};
