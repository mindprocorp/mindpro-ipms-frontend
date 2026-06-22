import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  type SendReceiveListRequest,
  SendRequestApi,
} from "@shared/api/sendReceive/sendReceiveApi.ts";

export const sendReceiveQueries = {
  getSendReceiveList: () =>
    mutationOptions({
      mutationFn: (payload: SendReceiveListRequest) => SendRequestApi(apiClient).getSendReceiveList(payload),
    }),
};


