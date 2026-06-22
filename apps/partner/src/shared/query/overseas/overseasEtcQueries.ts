import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  basicApi,
  type OverseasBasicCreateRequest,
  type OverseasBasicListRequest,
} from "@shared/api/overseas/basicApi.ts";
import { overseasApi, type OverseasListRequest } from "@shared/api/overseas/overseasApi.ts";



export const overseasEtcQueries = {
  getOverseasList: () =>
    mutationOptions({
      mutationFn: (payload: OverseasListRequest) => overseasApi(apiClient).getOverseasList(payload),
    }),
  getListQuery: (payload: OverseasListRequest) => ({
    queryKey: ["overseasEtcList", payload],
    queryFn: () => overseasApi(apiClient).getOverseasList(payload),
  }),
};


