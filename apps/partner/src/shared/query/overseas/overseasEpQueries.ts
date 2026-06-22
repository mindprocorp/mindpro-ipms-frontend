import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  directAppApi,
  type OverseasDirectCreateRequest,
} from "@shared/api/overseas/directAppApi.ts";
import { type OverseasPctCreateRequest, pctApi } from "@shared/api/overseas/pctApi.ts";
import { epApi, type OverseasEpCreateRequest } from "@shared/api/overseas/epApi.ts";

export const overseasEpQueries = {
  createOverseasEp: () =>
    mutationOptions({
      mutationFn: (payload: OverseasEpCreateRequest) =>
        epApi(apiClient).createEpOverseas(payload),
    }),
  getOverseasEpDetail: () =>
    mutationOptions({
      mutationFn: (appSeq: string) => epApi(apiClient).getOverseasEpDetail(appSeq),
    }),
  deleteEpImage: () =>
    mutationOptions({
      mutationFn: ({ appSeq, fileSeq }: { appSeq: string, fileSeq: string }) => epApi(apiClient).deleteEpImage({ appSeq, fileSeq }),
    }),
};
