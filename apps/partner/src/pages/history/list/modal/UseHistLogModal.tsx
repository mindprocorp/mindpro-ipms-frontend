import { DataTable, FlexBox, FormDialog, InfiniteDataTable } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { type AccessLogColType, accessLogColumnsData } from "./columns/accessLogColumnsData.tsx";
import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { logQueries } from "@shared/query/common/logQueries.ts";
import { useAuthStore } from "@shared/store/useUserInfoStore.ts";
import {
  type UseHistLogColType,
  useHistLogColumnsData,
} from "@pages/history/list/modal/columns/useHistLogColumnsData.tsx";
import type {
  LogAccessListRequestType,
  LogAccessListResponseType,
  LogHistListRequestType,
  LogHistListResponseType,
} from "@shared/api/common/logApi.ts";

const UseHistLogModal = ({ title, open, onOpenChange }: ModalProps) => {
  const [listData, setListData] = useState<UseHistLogColType[]>([]);
  const getHistListMutation = useMutation(logQueries.getHistList());
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const {
    data,
    isPending,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    status,
  } = useInfiniteQuery({
    queryKey: ["useHistList", pageSize],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return getHistList({
        userInfoSeq: user?.userInfoSeq as string,
        page: pageParam as number,
        pageSize,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.flatMap((page) => page.list).length;
      const nextPage = loadedCount < lastPage.totalCount ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  const flatList = useMemo(() => {
    return data?.pages.flatMap((page) => page.list) ?? [];
  }, [data]);
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const getHistList = async (
    listParams: LogHistListRequestType,
  ): Promise<LogHistListResponseType> => {
    const response = await getHistListMutation.mutateAsync(listParams);
    return response.data;
  };



  const onSubmit = () => {
    onOpenChange(false);
  };

  return (
    <FormDialog
      title={title}
      onSubmit={onSubmit}
      submitText="확인"
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-250!"
      bodyFull
    >
      <FlexBox className="px-3 pb-2">
        <p className="text-text-200 text-sm">
          총 <span className="text-p-color-1 font-bold">{totalCount.toLocaleString()}</span>건의
          결과가 있습니다.
        </p>
      </FlexBox>
      <InfiniteDataTable
        data={flatList}
        columns={useHistLogColumnsData}
        height={400}
        isColumnVisible
        isLoading={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </FormDialog>
  );
};

export default UseHistLogModal;
