import { DataTable, FlexBox, FormDialog, InfiniteDataTable } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { type AccessLogColType, accessLogColumnsData } from "./columns/accessLogColumnsData.tsx";
import { useEffect, useMemo, useState } from "react";
import { logQueries } from "@shared/query/common/logQueries.ts";
import { useAuthStore } from "@shared/store/useUserInfoStore.ts";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import type {
  DomesticListRequest,
  DomesticListResponse,
} from "@shared/api/domestic/domesticApi.ts";
import type { LogAccessListRequestType, LogAccessListResponseType } from "@shared/api/common/logApi.ts";

const AccessLogModal = ({ title, open, onOpenChange }: ModalProps) => {
  const [listData, setListData] = useState<AccessLogColType[]>([]);
  const getLogListMutation = useMutation(logQueries.getLogList());
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);



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
    queryKey: ["accessLogList", pageSize],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return getLogList2({
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

  const getLogList2 = async (
    listParams: LogAccessListRequestType,
  ): Promise<LogAccessListResponseType> => {
    const response = await getLogListMutation.mutateAsync(listParams);
    return response.data;
  };

  // const getLogList = () => {
  //   const param = {
  //     userInfoSeq: user?.userInfoSeq as string,
  //     page: 1,
  //     pageSize: 10,
  //   };
  //
  //   getLogListMutation.mutate(param, {
  //     onSuccess: (response) => {
  //       setListData(response.data.list);
  //       setTotalCount(response.data.list.length);
  //     },
  //   });
  // };
  //
  // useEffect(() => {
  //   getLogList();
  // }, [open]);

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
          총 <span className="text-p-color-1 font-bold">{totalCount}</span>건의
          결과가 있습니다.
        </p>
      </FlexBox>
      <InfiniteDataTable
        data={flatList}
        columns={accessLogColumnsData}
        isColumnVisible
        isLoading={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </FormDialog>
  );
};

export default AccessLogModal;
