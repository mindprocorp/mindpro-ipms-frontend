import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  directAppApi,
  type OverseasDirectCreateRequest,
} from "@shared/api/overseas/directAppApi.ts";
import { type OverseasPctCreateRequest, pctApi } from "@shared/api/overseas/pctApi.ts";

export const overseasPctQueries = {
  createOverseasPct: () =>
    mutationOptions({
      mutationFn: (payload: OverseasPctCreateRequest) =>
        pctApi(apiClient).createPctOverseas(payload),
    }),
  getOverseasPctDetail: () =>
    mutationOptions({
      mutationFn: (appSeq: string) => pctApi(apiClient).getOverseasPctDetail(appSeq),
    }),
};
