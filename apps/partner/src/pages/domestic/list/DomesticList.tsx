import { domesticListColumnsData } from "./columns/DomesticListColumnsData.tsx";
import { Button, GN, Icons, InfiniteDataTable } from "@repo/ui";
import DataMenuButton from "@shared/ui/DataMenuButton";
import ListResultHeader from "@shared/ui/ListResultHeader.tsx";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm.tsx";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { FlatTab } from "@shared/ui/tab/ui/Tabs.tsx";
import { useMemo, useState } from "react";
import { domesticDetailQueries } from "@shared/query/domestic/queries.ts";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type {
  DomesticListRequest,
  DomesticListResponse,
} from "@shared/api/domestic/domesticApi.ts";
import { getName } from "@shared/enum/domesticType.ts";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";
import { SEARCH_KEY } from "@shared/enum/comCodeType";
import { downloadExcel } from "@shared/util/excelUtil";
import { useAlertStore } from "@shared/store/useAlertStore";

// const tabs = [
//   { label: "마감경과", value: "DEAD_LINE" },
//   { label: "미출원", value: "NOT_FILED" },
//   { label: "심사미청구", value: "NOT_REQUESTED" },
//   { label: "OV/심판", value: "OV" },
//   { label: "등록료마감", value: "FEE_DEAD_LINE" },
//   { label: "연차마감", value: "ANNUAL_DEAD_LINE" },
//   { label: "갱신마감", value: "RENEWAL_DEAD_LINE" },
// ];

const DomesticList = () => {
  const getDomesticListMutation = useMutation(domesticDetailQueries.getDomesticList());
  const navigate = useNavigate();
  const { openAlert } = useAlertStore();
  // const [listData, setListData] = useState<DomesticListColType[]>([]);
  // const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<string>("DEAD_LINE");
  const [searchFilters, setSearchFilters] = useState<Partial<DomesticListRequest>>({});
  const [hasSearched, setHasSearched] = useState(false);

  const getDomesticList = async (
    listParams: DomesticListRequest,
  ): Promise<DomesticListResponse> => {
    const response = await getDomesticListMutation.mutateAsync(listParams);
    return response.data;
  };

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
    queryKey: ["domesticList", pageSize, searchFilters],
    initialPageParam: 1,
    enabled: hasSearched,
    queryFn: ({ pageParam }) => {
      return getDomesticList({
        page: pageParam as number,
        pageSize,
        ...searchFilters,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.list) return undefined;
      const loadedCount = allPages.flatMap((page) => page?.list ?? []).length;
      const nextPage = loadedCount < (lastPage.totalCount ?? 0) ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  const flatList = useMemo(() => {
    return data?.pages.flatMap((page) => page?.list ?? []) ?? [];
  }, [data]);
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // useEffect(() => {
  //   const param: DomesticListRequest = {
  //     page, // 페이지
  //     pageSize, // 페이지사이즈
  //     //statusCodes: Array.of(activeTab),
  //   };
  //   getDomesticList(param);
  // }, []);

  const onChangeTab = (value: string) => {
    setActiveTab(value);

    const param: DomesticListRequest = {
      page, // 페이지
      pageSize, // 페이지사이즈
      //statusCodes: Array.of(activeTab),
    };
    getDomesticList(param);
  };

  const onSearch = (values: any) => {
    const params = buildSearchParams(values, pageSize);
    setHasSearched(true);
    setSearchFilters({
      searchCondition: params.searchCondition,
      dateFilters: params.dateFilters,
      textFilters: params.textFilters,
    });
  };

  const handleExcelDownload = async () => {
    if (!hasSearched || totalCount === 0) {
      openAlert({ message: "다운로드할 데이터가 없습니다. 목록을 먼저 조회해주세요." });
      return;
    }
    const response = await getDomesticListMutation.mutateAsync({
      page: 1,
      pageSize: totalCount,
      ...searchFilters,
    });
    downloadExcel(response.data.list, "국내출원", domesticListColumnsData);
  };

  // function onRowSelect() {
  //   alert();
  // }

  return (
    <>
      <PageTitleArea className="pb-2" title="국내출원 검색">
        <DataMenuButton data={flatList} fileName="국내출원" columns={domesticListColumnsData} onExcelClick={handleExcelDownload} />
        <Button variant="outline-pink" size="h28" onClick={() => navigate("/domestic/write")}>
          <Icons.Plus />
          신규등록
        </Button>
      </PageTitleArea>

      <PageSearchForm onSearch={onSearch} searchKey={SEARCH_KEY.DOMESTIC} />

      {/* <FlatTab items={tabs} active={activeTab} className="mt-3" onChange={onChangeTab} /> */}

      <ListResultHeader totalCount={totalCount} />
      {/* <DataTable
        data={listData}
        columns={domesticListColumnsData}
        onRowClick={(row, rowData) => {
          console.log("선택된 row ID:", row.id);
          console.log("선택된 data111:", rowData.appSeq);

          const rightTypeValue = getName(rowData.rightType.code).toLowerCase();
          if (row.id === "0") {
            navigate(`/domesticNew/detail/${rowData.appSeq}?type=${rightTypeValue}`);
            return;
          }

          navigate(`/domestic/detail/${rowData.appSeq}?type=${rightTypeValue}`);
        }}

        isColumnVisible
        className="h-200"
        isLoading={getDomesticListMutation.isPending}
      /> */}

      <InfiniteDataTable
        data={flatList}
        columns={domesticListColumnsData}
        isColumnVisible
        isLoading={isFetching}
        offsetTop={340}
        getRowId={(row) => String(row.appSeq)}
        onCellClick={(data) => {
          const { column, row } = data;
          if (column.id === "select") return;

          const rightTypeValue = getName(row.original.rightType.code).toLowerCase();
          if (row.index === 0) {
            navigate(`/domestic/detail/${row.original.appSeq}?type=${rightTypeValue}`);
            return;
          }

          navigate(`/domestic/detail/${row.original.appSeq}?type=${rightTypeValue}`);
        }}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};

export default DomesticList;
