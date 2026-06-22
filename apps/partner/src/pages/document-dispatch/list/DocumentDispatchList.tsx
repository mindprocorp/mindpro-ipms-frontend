import {
  type DocumentDispatchColType,
  documentDispatchColumnsData,
} from "./columns/columnsData.tsx";
import { Button, InfiniteDataTable, Icons } from "@repo/ui";
import DataMenuButton from "@shared/ui/DataMenuButton";
import { downloadExcel } from "@shared/util/excelUtil";
import { useAlertStore } from "@shared/store/useAlertStore";
import ListResultHeader from "@shared/ui/ListResultHeader.tsx";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm.tsx";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { useEffect, useState } from "react";
import { SEARCH_KEY } from "@shared/enum/comCodeType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dispatchQueries } from "@shared/query/dispatch/queries";
import type { BaseSearchRequest } from "@shared/api/types";
import DocumentDispatchModal from "./_components/DocumentDispatchModal";
import type { DispatchSchemaType } from "@shared/schema/dispatch/dispatchSchema";
import type { DispatchDetail } from "@shared/api/dispatch/dispatchApi";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";

const DocumentDispatchList = () => {
  const queryClient = useQueryClient();
  const [listData, setListData] = useState<DispatchDetail[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { openAlert } = useAlertStore();
  const [searchParams, setSearchParams] = useState<BaseSearchRequest>({
    pageNo: 1,
    pageSize: 10,
    offSet: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<DispatchSchemaType | null>(null);

  const searchMutation = useMutation(dispatchQueries.searchList());

  const fetchList = (params: BaseSearchRequest) => {
    searchMutation.mutate(params, {
      onSuccess: (response) => {
        if (response.data?.list) {
          setListData(response.data.list);
          setTotalCount(response.data.totalCount || 0);
        }
      },
      onError: (error) => {
        console.error("[문서수발 검색] API 에러:", error);
      },
    });
  };

  useEffect(() => {
    fetchList(searchParams);
  }, []);

  // queryClient 캐시 무효화 시 자동 새로고침을 위한 효과 (선택 사항)
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
        if (event.type === 'updated' && event.query.queryKey.includes('dispatchList')) {
            fetchList(searchParams);
        }
    });
    return () => unsubscribe();
  }, [queryClient, searchParams]);

  const onSearch = (values: any) => {
    const builtParams = buildSearchParams(values);
    const nextParams = {
      ...searchParams,
      ...builtParams,
      pageNo: 1,
      offSet: 0,
      parms: values.parms,
    };
    setSearchParams(nextParams);
    fetchList(nextParams);
  };

  const handleExcelDownload = async () => {
    if (totalCount === 0) {
      openAlert({ message: "다운로드할 데이터가 없습니다. 목록을 먼저 조회해주세요." });
      return;
    }
    const response = await searchMutation.mutateAsync({ ...searchParams, pageNo: 1, pageSize: totalCount, offSet: 0 });
    if (response.data?.list) {
      downloadExcel(response.data.list, "문서수발관리", documentDispatchColumnsData);
    }
  };

  const handleRowClick = (rowData: any) => {
    setSelectedData(rowData);
    setModalOpen(true);
  };

  const handleOpenModal = () => {
    setSelectedData(null);
    setModalOpen(true);
  };

  return (
    <>
      <PageTitleArea className="pb-2" title="문서수발관리">
        <DataMenuButton
          data={listData}
          fileName="문서수발관리"
          columns={documentDispatchColumnsData}
          onExcelClick={handleExcelDownload}
        />
        <Button variant="outline-pink" size="h28" onClick={handleOpenModal}>
          <Icons.Plus />
          신규등록
        </Button>
      </PageTitleArea>

      <PageSearchForm
        searchKey={SEARCH_KEY.DOC_IO}
        onSearch={onSearch}
      />

      <ListResultHeader totalCount={totalCount} />

      <InfiniteDataTable isColumnVisible={true}
        data={listData}
        columns={documentDispatchColumnsData}
        isLoading={searchMutation.isPending}
        offsetTop={340}
        getRowId={(row, index) => row.dispatchSeq ?? String(index)}
        onRowClick={(row, rowData) => handleRowClick(rowData)}
      />

      <DocumentDispatchModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={selectedData}
        onSuccess={() => fetchList(searchParams)}
      />
    </>
  );
};

export default DocumentDispatchList;
