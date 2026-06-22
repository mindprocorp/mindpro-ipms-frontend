import {
  domesticDetailAPI,
  type DomesticDetailCreateRequest,
  type DomesticListRequest,
} from "../../api/domestic/domesticApi.ts";
import { apiClient } from "../../../shared/api/client";
import { mutationOptions } from "@tanstack/react-query";

export const domesticDetailQueries = {
  createDomestic: () =>
    mutationOptions({
      mutationFn: ({
        payload,
        rightType,
      }: {
        payload: DomesticDetailCreateRequest;
        rightType: string;
      }) => domesticDetailAPI(apiClient).createDomestic(payload, rightType),
    }),
  getDomesticDetail: () =>
    mutationOptions({
      mutationFn: ({ domesticSeq, rightType }: { domesticSeq: string; rightType: string }) =>
        domesticDetailAPI(apiClient).getDomesticDetail(domesticSeq, rightType),
    }),
  getDomesticList: () =>
    mutationOptions({
      mutationFn: (payload: DomesticListRequest) =>
        domesticDetailAPI(apiClient).getDomesticList(payload),
    }),
  deleteAppImageFile: () =>
    mutationOptions({
      mutationFn: ({ appSeq, fileSeq }: { appSeq: string; fileSeq: string }) =>
        domesticDetailAPI(apiClient).deleteAppImageFile(appSeq, fileSeq),
    }),
};
