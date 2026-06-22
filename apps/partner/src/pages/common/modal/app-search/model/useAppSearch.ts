import { useState, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries.ts";
import type { SearchAppItem, SearchAppListRequest } from "@shared/api/common/commApi.ts";

export const useAppSearch = () => {
  const [appList, setAppList] = useState<SearchAppItem[]>([]);
  const [check, setCheck] = useState<SearchAppItem[]>([]);
  const searchMutation = useMutation(commonQueries.getSearchAppList());

  const fetchApps = useCallback((searchValue: string = "") => {
    const payload: SearchAppListRequest = {
      searchCondition: [{ codeName: "appNo", codeValue: searchValue }],
      page: 1,
      pageSize: 20
    };

    searchMutation.mutate(payload, {
      onSuccess: (response) => {
        setAppList(response.data.list || []);
      }
    });
  }, [searchMutation.mutate]);

  useEffect(() => {
    fetchApps("");
  }, []);

  const memFind = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length >= 1) {
      fetchApps(value);
    } else {
      setAppList([]);
    }
  }, [fetchApps]);

  const singleSelectHandle = (item: SearchAppItem) => {
    setCheck([item]);
  };

  const clearCheck = () => {
    setCheck([]);
  };

  return {
    appList,
    check,
    memFind,
    singleSelectHandle,
    clearCheck,
    isLoading: searchMutation.isPending
  };
};
