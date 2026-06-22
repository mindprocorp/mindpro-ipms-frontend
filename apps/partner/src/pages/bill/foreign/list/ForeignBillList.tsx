import {
  overseaBillColumnsData,
} from "./columns/BIllListColumnsData.tsx";
import { Button, DataTable, FlexBox, GN, Icons } from "@repo/ui";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm.tsx";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import ListResultHeader from "@shared/ui/ListResultHeader.tsx";
import { FlatTab } from "@shared/ui/tab/ui/Tabs.tsx";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { BillOutgoingListRequest } from "@shared/api/bill/billOverseasOutgoingApi.ts";
import { billOverseasOutgoingQueries } from "@shared/query/bill/billOverseasOutgoingQueries.ts";
import { SEARCH_KEY } from "@shared/enum/comCodeType";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";
import { billTabsQueries } from "@shared/query/bill/billTabsQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import DataMenuButton from "@shared/ui/DataMenuButton";
import { downloadExcel } from "@shared/util/excelUtil";

const tabs = [
  { label: "전체", value: "ALL" },
];

const ForeignBillList = () => {
  const getBillListMutation = useMutation(billOverseasOutgoingQueries.getBillOutgoingList());
  const deleteInvoiceListMutation = useMutation(billTabsQueries.deleteInvoiceList());
  const { openAlert } = useAlertStore();
  const navigate = useNavigate();

  // 💡 1. 타입을 any[]로 받아서 타입 충돌 원천 차단
  const [listData, setListData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [searchFilters, setSearchFilters] = useState<any>({});

  const getBillList = (listParams: BillOutgoingListRequest) => {
    getBillListMutation.mutate(listParams, {
      onSuccess: (response: any) => {
        // 💡 2. 데이터 유무 확인 후 바로 세팅
        if (response.data && response.data.list) {
          setTotalCount(response.data.totalCount);
          setListData(response.data.list); // 이제 에러 안 남
        } else {
          setListData([]);
          setTotalCount(0);
        }
      },
    });
  };

  useEffect(() => {
    const param: BillOutgoingListRequest = {
      page,
      pageSize,
    };
    getBillList(param);
  }, [page, pageSize]);

  const onChangeTab = (value: string) => {
    setActiveTab(value);
    getBillList({ page: 1, pageSize });
  };

  const onSearch = (values: any) => {
    const params = buildSearchParams(values, pageSize);
    const filters = {
      searchCondition: params.searchCondition,
      dateFilters: params.dateFilters,
      textFilters: params.textFilters,
    };
    setSearchFilters(filters);
    getBillList({ page: 1, pageSize, ...filters });
  };

  const handleExcelDownload = async () => {
    if (totalCount === 0) {
      openAlert({ message: "다운로드할 데이터가 없습니다. 목록을 먼저 조회해주세요." });
      return;
    }
    const response = await getBillListMutation.mutateAsync({ page: 1, pageSize: totalCount, ...searchFilters }) as any;
    if (response.data?.list) {
      downloadExcel(response.data.list, "foreign_bill_list", overseaBillColumnsData);
    }
  };

  const handleDelete = async () => {
    const selectedIndices = Object.keys(rowSelection).filter((key) => rowSelection[key]);
    const selectedItems = selectedIndices.map((index) => listData[parseInt(index)]).filter(Boolean);

    if (selectedItems.length === 0) {
      openAlert({ message: "삭제할 항목을 선택해주세요.", confirmText: "확인" });
      return;
    }

    openAlert({
      message: `${selectedItems.length}개 청구서를 삭제하시겠습니까?`,
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: () => {
        const seqs = selectedItems.map((item) => item.invoiceSeq || item.tblSeq).filter(Boolean);
        if (seqs.length > 0) {
          deleteInvoiceListMutation.mutate(seqs, {
            onSuccess: () => {
              setRowSelection({});
              getBillList({ page, pageSize });
              openAlert({ message: "삭제되었습니다.", confirmText: "확인" });
            },
            onError: () => {
              openAlert({ message: "삭제 중 오류가 발생했습니다.", confirmText: "확인" });
            },
          });
        }
      }
    });
  };

  return (
    <>
      <PageTitleArea className="pb-2" title="해외청구서(아웃고잉) 검색">
        <DataMenuButton data={listData} fileName="foreign_bill_list" columns={overseaBillColumnsData} onExcelClick={handleExcelDownload} />
        <Button variant="outline-pink" size="h28" onClick={() => navigate("/bill/foreign/write")}>
          <Icons.Plus />
          신규등록
        </Button>
{/* <Button
          size="h28"
          variant="red"
          onClick={handleDelete}
          disabled={Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0}
        >
          <Icons.Trash2 />
          삭제
        </Button> */}
      </PageTitleArea>

      <PageSearchForm onSearch={onSearch}  searchKey={SEARCH_KEY.BILL}/>


      <ListResultHeader totalCount={totalCount} />

      <DataTable
        isLoading={getBillListMutation.isPending}
        isColumnVisible={true}
        data={listData}
        columns={overseaBillColumnsData}
        enableRowSelection={false}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onRowClick={(_, rowData) => {
          // 💡 3. rowData에 값이 있을 때만 이동 (invoiceSeq 또는 tblSeq)
          const id = rowData.invoiceSeq || rowData.tblSeq;
          if (id) {
            navigate(`/bill/foreign/detail/${id}`);
          }
        }}
      />
    </>
  );
};

export default ForeignBillList;
