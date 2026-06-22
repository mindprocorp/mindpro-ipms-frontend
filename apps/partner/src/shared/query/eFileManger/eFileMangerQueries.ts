import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  eFileMangerApi,
  type EFileMangerListRequest,
} from "@shared/api/eFileManger/eFileMangerApi.ts";

export const eFileMangerQueries = {
  getEFileManagerList: () =>
    mutationOptions({
      mutationFn: (payload: EFileMangerListRequest) => eFileMangerApi(apiClient).getEFileManagerList(payload),
    }),
};


