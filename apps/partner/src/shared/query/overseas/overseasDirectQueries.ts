import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  directAppApi,
  type OverseasDirectCreateRequest,
} from "@shared/api/overseas/directAppApi.ts";

export const overseasDirectQueries = {
  createOverseasDirect: () =>
    mutationOptions({
      mutationFn: ({
        payload,
        rightType,
      }: {
        payload: OverseasDirectCreateRequest;
        rightType: string;
      }) => directAppApi(apiClient).createDirectOverseas(payload, rightType),
    }),
  getOverseasDirectDetail: () =>
    mutationOptions({
      mutationFn: ({
        overseasSeq,
        rightTypeName,
      }: {
        overseasSeq: string;
        rightTypeName: string;
      }) => directAppApi(apiClient).getOverseasDirectDetail(overseasSeq, rightTypeName),
    }),
  deleteDirectImage: () =>
    mutationOptions({
      mutationFn: ({ appSeq, fileSeq }: { appSeq: string, fileSeq: string }) => directAppApi(apiClient).deleteDirectImage({ appSeq, fileSeq }),
    }),
};
