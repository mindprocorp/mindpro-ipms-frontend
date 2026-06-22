import { queryOptions } from "@tanstack/react-query";
import { historyApi } from "../../api/history/historyApi";
import type { BaseSearchRequest } from "../../api/history/historyApi";

export const historyKeys = {
  all: ["history"] as const,
  lists: () => [...historyKeys.all, "list"] as const,
  list: (params: BaseSearchRequest) => [...historyKeys.lists(), params] as const,
};

export const historyQueries = {
  searchList: () => {
    return {
      mutationFn: (params: BaseSearchRequest) => historyApi.searchList(params),
    };
  },
};
