import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  directAppApi,
  type OverseasDirectCreateRequest,
} from "@shared/api/overseas/directAppApi.ts";
import { type OverseasPctCreateRequest, pctApi } from "@shared/api/overseas/pctApi.ts";
import { epApi, type OverseasEpCreateRequest } from "@shared/api/overseas/epApi.ts";
import { madridApi, type OverseasMadridCreateRequest } from "@shared/api/overseas/madridApi.ts";

export const overseasMadridQueries = {
  createOverseasMadrid: () =>
    mutationOptions({
      mutationFn: (payload: OverseasMadridCreateRequest) =>
        madridApi(apiClient).createMadridOverseas(payload),
    }),
  getOverseasMadridDetail: () =>
    mutationOptions({
      mutationFn: (appSeq: string) => madridApi(apiClient).getOverseasMadridDetail(appSeq),
    }),
  deleteMadridImage: () =>
    mutationOptions({
      mutationFn: ({ appSeq, fileSeq }: { appSeq: string, fileSeq: string }) => madridApi(apiClient).deleteMadridImage({ appSeq, fileSeq }),
    }),
};
