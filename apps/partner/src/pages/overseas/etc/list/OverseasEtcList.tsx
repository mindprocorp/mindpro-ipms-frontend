import { InfiniteDataTable } from "@repo/ui";
import DataMenuButton from "@shared/ui/DataMenuButton";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm.tsx";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import ListResultHeader from "@shared/ui/ListResultHeader.tsx";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState, useCallback } from "react";
import { overseasEtcQueries } from "@shared/query/overseas/overseasEtcQueries.ts";
import type {
  OverseasListRequest,
  OverseasListResponse,
} from "@shared/api/overseas/overseasApi.ts";
import { overseasListColumnsData } from "@pages/overseas/etc/list/OverseasListCol.tsx";
import { useNavigate } from "react-router-dom";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";
import { SEARCH_KEY } from "@shared/enum/comCodeType";
import { apiClient } from "@shared/api/client.ts";
import { overseasApi } from "@shared/api/overseas/overseasApi.ts";

const OverseasEtcList = () => {
  const navigate = useNavigate();
  const [pageSize] = useState<number>(25);
  const [searchFilters, setSearchFilters] = useState<Partial<OverseasListRequest>>({});
  const [hasSearched, setHasSearched] = useState(true); // 초기 로드 허용 시 true

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["overseasEtcList", pageSize, searchFilters],
    initialPageParam: 1,
    enabled: hasSearched,
    queryFn: async ({ pageParam }) => {
      const response = await overseasApi(apiClient).getOverseasList({
        page: pageParam as number,
        pageSize,
        ...searchFilters,
      });
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.flatMap((page) => page.list).length;
      return loadedCount < lastPage.totalCount ? allPages.length + 1 : undefined;
    },
  });

  const flatList = useMemo(() => {
    return data?.pages.flatMap((page) => page.list) ?? [];
  }, [data]);

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const onSearch = useCallback((values: any) => {
    const params = buildSearchParams(values, pageSize);
    setHasSearched(true);
    setSearchFilters({
      searchCondition: params.searchCondition,
      dateFilters: params.dateFilters,
      textFilters: params.textFilters,
    });
  }, [pageSize]);

  return (
    <>
      <PageTitleArea className="pb-2" title="해외출원 검색">
        <DataMenuButton data={flatList} fileName="해외출원" columns={overseasListColumnsData} />
      </PageTitleArea>

      <PageSearchForm onSearch={onSearch} searchKey={SEARCH_KEY.OVERSEAS} />

      <ListResultHeader totalCount={totalCount} />
      <InfiniteDataTable
        isColumnVisible={true}
        data={flatList}
        columns={overseasListColumnsData}
        isLoading={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        getRowId={(row) => String(row.appSeq)}
        onCellClick={(data) => {
          const { column, row } = data;
          if (column.id === "select") return;

          const rowData = row.original;
          const categoryCode = rowData.appRoute?.code;

          let categoryGubun = "";
          switch (categoryCode) {
            case "20":
              categoryGubun = "direct";
              break;
            case "30":
              categoryGubun = "pct";
              break;
            case "40":
              categoryGubun = "ep";
              break;
            case "50":
              categoryGubun = "madrid";
              break;
            case "60":
              categoryGubun = "national";
              break;
            default:
              return;
          }
          navigate(`/overseas/${categoryGubun}/detail/${rowData.appSeq}?rightType=${rowData.rightType?.code}`);
        }}
      />
    </>
  );
};

export default OverseasEtcList;
