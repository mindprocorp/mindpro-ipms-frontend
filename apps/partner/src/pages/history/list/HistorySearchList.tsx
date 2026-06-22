import {
  type HistorySearchColType,
  historySearchColumnsData,
} from "./columns/columnsData.tsx";
import { Button, InfiniteDataTable, Icons } from "@repo/ui";
import DataMenuButton from "@shared/ui/DataMenuButton";
import ListResultHeader from "@shared/ui/ListResultHeader.tsx";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm.tsx";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { useState, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { historyApi } from "@shared/api/history/historyApi";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";
import { SEARCH_KEY } from "@shared/enum/comCodeType";
import AccessLogModal from "./modal/AccessLogModal.tsx";
import ExcelLogModal from "./modal/ExcelLogModal.tsx";
import DownloadLogModal from "./modal/DownloadLogModal.tsx";
import UseHistLogModal from "@pages/history/list/modal/UseHistLogModal.tsx";

const HistorySearchList = () => {
  const [accessLogOpen, setAccessLogOpen] = useState(false);
  const [useHistOpen, setUseHistOpen] = useState(false);
  const [excelLogOpen, setExcelLogOpen] = useState(false);
  const [downloadLogOpen, setDownloadLogOpen] = useState(false);

  const [pageSize] = useState(25);
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [hasSearched, setHasSearched] = useState(true);

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["historyList", pageSize, searchFilters],
    initialPageParam: 1,
    enabled: hasSearched,
    queryFn: async ({ pageParam }) => {
      const params = {
        page: pageParam as number,
        pageSize,
        ...searchFilters,
      };
      return await historyApi.searchList(params);
    },
    getNextPageParam: (lastPage: any, allPages) => {
      const total = lastPage.totalCount ?? 0;
      const loadedCount = allPages.flatMap((page) => page.list).length;
      return loadedCount < total ? allPages.length + 1 : undefined;
    },
  });

  const flatList = useMemo(() => {
    return data?.pages.flatMap((page) => page.list) ?? [];
  }, [data]);

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const onSearch = (values: any) => {
    const params = buildSearchParams(values, pageSize);
    setSearchFilters({
      searchCondition: params.searchCondition,
      dateFilters: params.dateFilters,
      textFilters: params.textFilters,
    });
    setHasSearched(true);
  };

  return (
    <>
      <PageTitleArea className="pb-2" title="히스토리검색">
        <DataMenuButton
          data={flatList}
          fileName="히스토리검색"
          columns={historySearchColumnsData}
        />
        <Button size="h28" onClick={() => setAccessLogOpen(true)}>
          <Icons.FileText />
          접속로그
        </Button>
        <Button size="h28" onClick={() => setUseHistOpen(true)}>
          <Icons.FileText />
          사용이력
        </Button>
        {/* <Button size="h28" onClick={() => setExcelLogOpen(true)}>
          <Icons.FileText />
          엑셀변환로그
        </Button>
        <Button size="h28" onClick={() => setDownloadLogOpen(true)}>
          <Icons.FileText />
          파일다운로드로그
        </Button> */}
      </PageTitleArea>

      <PageSearchForm onSearch={onSearch} searchKey={SEARCH_KEY.HISTORY} />

      <ListResultHeader totalCount={totalCount} />

      <InfiniteDataTable
        isColumnVisible={true}
        data={flatList}
        columns={historySearchColumnsData}
        isLoading={isFetching && !isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        getRowId={(row) => String(row.seq)}
        offsetTop={340}
      />


      <AccessLogModal title="접속로그" open={accessLogOpen} onOpenChange={setAccessLogOpen} />
      <UseHistLogModal title="사용이력로그" open={useHistOpen} onOpenChange={setUseHistOpen} />

      <ExcelLogModal title="엑셀변환로그" open={excelLogOpen} onOpenChange={setExcelLogOpen} />
      <DownloadLogModal
        title="파일다운로드로그"
        open={downloadLogOpen}
        onOpenChange={setDownloadLogOpen}
      />
    </>
  );
};

export default HistorySearchList;


