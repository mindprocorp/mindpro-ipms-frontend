import {
  eFileManageColumnsData,
} from "./columns/columnsData.tsx";
import { Button, InfiniteDataTable, Icons } from "@repo/ui";
import DataMenuButton from "@shared/ui/DataMenuButton";
import { downloadExcel } from "@shared/util/excelUtil";
import { useAlertStore } from "@shared/store/useAlertStore";
import ListResultHeader from "@shared/ui/ListResultHeader.tsx";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm.tsx";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@shared/api/client";
import { eFileMangerApi, type EFileMangerListRequest, type EFileMangerListType } from "@shared/api/eFileManger/eFileMangerApi.ts";
import { SEARCH_KEY } from "@shared/enum/comCodeType.ts";
import { getName } from "@shared/enum/domesticType.ts";
import { downloadFile } from "@shared/util/fileUtil";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";

const EFileManageList = () => {
  const [pageSize] = useState<number>(50);
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [hasSearched, setHasSearched] = useState(true);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { openAlert } = useAlertStore();

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["eFileManagerList", pageSize, searchFilters],
    initialPageParam: 1,
    enabled: hasSearched,
    queryFn: async ({ pageParam }) => {
      const params: EFileMangerListRequest = {
        ...searchFilters,
        page: pageParam as number,
        pageSize,
      };
      const response = await eFileMangerApi(apiClient).getEFileManagerList(params);
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      const total = lastPage.totalCount ?? 0;
      const loadedCount = allPages.flatMap((page) => page.list).length;
      return loadedCount < total ? allPages.length + 1 : undefined;
    },
  });

  const flatList = useMemo(() => {
    return data?.pages.flatMap((page) => page.list) ?? [];
  }, [data]);

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const handleBatchDownload = () => {
    const selectedIndexes = Object.keys(rowSelection).filter((k) => rowSelection[k]);
    if (selectedIndexes.length === 0) {
      alert("다운로드할 항목을 선택해 주세요.");
      return;
    }
    selectedIndexes.forEach((idx) => {
      // rowSelection의 key는 getRowId에서 생성한 고유 ID 문자열입니다.
      // 선택된 행의 실제 데이터를 찾기 위해 flatList에서 비교합니다.
      const row = flatList.find((item, index) => {
        const id = `${item.tblSeq}-${item.attachDocName}-${item.uploadAt}-${index}`;
        return rowSelection[id];
      });
      
      if (row?.fileDownloadUrl) {
        downloadFile(row.fileDownloadUrl, row.attachDocName);
      }
    });
  };

  const onSearch = (values: any) => {
    const params = buildSearchParams(values);
    setSearchFilters(params);
    setHasSearched(true);
  };

  const handleExcelDownload = async () => {
    if (totalCount === 0) {
      openAlert({ message: "다운로드할 데이터가 없습니다. 목록을 먼저 조회해주세요." });
      return;
    }
    const params: EFileMangerListRequest = {
      ...searchFilters,
      page: 1,
      pageSize: totalCount,
    };
    const response = await eFileMangerApi(apiClient).getEFileManagerList(params);
    if (response.data?.list) {
      downloadExcel(response.data.list, "전자포대관리", eFileManageColumnsData);
    }
  };

  return (
    <>
      <PageTitleArea className="pb-2" title="전자포대관리">
        <DataMenuButton data={flatList} fileName="전자포대관리" columns={eFileManageColumnsData} onExcelClick={handleExcelDownload} />
        <Button size="h28" onClick={handleBatchDownload}>
          <Icons.Download />
          일괄다운
        </Button>
      </PageTitleArea>
      <PageSearchForm onSearch={onSearch} searchKey={SEARCH_KEY.DOSSIER} />
      <ListResultHeader totalCount={totalCount} />
      <InfiniteDataTable
        isColumnVisible={true}
        enableRowSelection={true}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        data={flatList}
        columns={eFileManageColumnsData}
        isLoading={isFetching && !isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        offsetTop={340}
        getRowId={(row, index) => `${row.tblSeq}-${row.attachDocName}-${row.uploadAt}-${index}`}
        onRowClick={(row, rowData) => {
          console.log("rowData", rowData);
          const rightTypeValue = getName(rowData.rightType.code).toLowerCase();
          // 국내출원
          if (rowData.caseClassification.code === "10") {
            navigate(`/domestic/detail/${rowData.parentSeq}?type=${rightTypeValue}`);
          }
          // 해외출원
          if (rowData.caseClassification.code === "30") {
            let categoryGubun = "";
            switch (rowData.rightType.code) {
              case "10":
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
            }
            navigate(`/overseas/${categoryGubun}/detail/${rowData.parentSeq}`);
          }

          // 이의심판
          if (rowData.caseClassification.code == "40") {
            navigate(`/objection-trial/detail/${rowData.tblSeq}`);
          }
          // 내국청구서
          if (rowData.caseClassification.code == "60") {
            navigate(`/bill/domestic/detail/${rowData.tblSeq}`);
          }

          // 외국청구서
          if (rowData.caseClassification.code == "70") {
            navigate(`/bill/overseas/detail/${rowData.tblSeq}`);
          }

          // 해외청구서
          if (rowData.caseClassification.code == "80") {
            navigate(`/bill/foreign/detail/${rowData.tblSeq}`);
          }
        }}
      />
    </>
  );
};

export default EFileManageList;
