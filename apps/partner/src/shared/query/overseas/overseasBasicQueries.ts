import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  basicApi,
  type OverseasBasicCreateRequest,
  type OverseasBasicListRequest,
} from "@shared/api/overseas/basicApi.ts";



export const overseasBasicQueries = {
  createOverseasBasic: () =>
    mutationOptions({
      mutationFn: (payload: OverseasBasicCreateRequest) =>
        basicApi(apiClient).createBasicOverseas(payload),
    }),
  getOverseasBasicDetail: () =>
    mutationOptions({
      mutationFn: (overseasSeq: string) => basicApi(apiClient).getOverseasBasicDetail(overseasSeq),
    }),
  getOverseasBasicList: () =>
    mutationOptions({
      mutationFn: (payload: OverseasBasicListRequest) =>
        basicApi(apiClient).getOverseasBasicList(payload),
    }),
  deleteAppImageFile: () =>
    mutationOptions({
      mutationFn: ({ appSeq, fileSeq }: { appSeq: string; fileSeq: string }) =>
        basicApi(apiClient).deleteAppImageFile(appSeq, fileSeq),
    }),
};


