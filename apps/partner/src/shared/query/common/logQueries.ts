import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  type LogAccessListRequestType,
  logAPI,
  type LogHistListRequestType,
} from "@shared/api/common/logApi.ts";

export const logQueries = {
  getHistList: () =>
    mutationOptions({
      mutationFn: (payload: LogHistListRequestType) => logAPI(apiClient).getHistList(payload),
    }),
  getLogList: () =>
    mutationOptions({
      mutationFn: (payload: LogAccessListRequestType) => logAPI(apiClient).getLogList(payload),
    }),
};
