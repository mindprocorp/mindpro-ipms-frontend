import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import React from "react";

type PageResult<TItem> = {
  data: TItem[];
  meta?: { totalRowCount: number };
};

type UseInfiniteTableQueryParams<TItem> = {
  queryKeyBase: readonly unknown[];
  pageSize: number;
  enabled?: boolean;

  queryFn: (args: { start: number; pageSize: number }) => Promise<PageResult<TItem>>;
};

export function useInfiniteTableQuery<TItem>(params: UseInfiniteTableQueryParams<TItem>) {
  const { queryKeyBase, pageSize, enabled = true, queryFn } = params;

  const queryKey = [...queryKeyBase, pageSize] as const;

  const query = useInfiniteQuery({
    queryKey,
    enabled,
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) => {
      const start = (pageParam as number) * pageSize;
      return queryFn({ start, pageSize });
    },
    // getNextPageParam: (lastPage) => getNextCursor(lastPage) ?? undefined,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData, // 필터 바뀔 때 깜빡임 완화
  });

  //   const flatData = query.data?.pages.flatMap((p) => p.data) ?? [];

  const flatData = React.useMemo(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const totalDBRowCount = query.data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  return {
    ...query,
    flatData,
    totalDBRowCount,
    totalFetched,
  };
}
