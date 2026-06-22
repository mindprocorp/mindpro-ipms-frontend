import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  directAppApi,
  type OverseasDirectCreateRequest,
} from "@shared/api/overseas/directAppApi.ts";
import { type OverseasPctCreateRequest, pctApi } from "@shared/api/overseas/pctApi.ts";
import { epApi, type OverseasEpCreateRequest } from "@shared/api/overseas/epApi.ts";
import {
  nationalApi,
  type OverseasNationalCreateRequest,
} from "@shared/api/overseas/nationalApi.ts";

export const overseasNationalQueries = {
  createOverseasNational: () =>
    mutationOptions({
      mutationFn: (payload: OverseasNationalCreateRequest) =>
        nationalApi(apiClient).createNationalOverseas(payload),
    }),
  getOverseasNationalDetail: () =>
    mutationOptions({
      mutationFn: (appSeq: string) => nationalApi(apiClient).getOverseasNationalDetail(appSeq),
    }),
  deleteNationalImage: () =>
    mutationOptions({
      mutationFn: ({ appSeq, fileSeq }: { appSeq: string, fileSeq: string }) => nationalApi(apiClient).deleteNationalImage({ appSeq, fileSeq }),
    }),
};
