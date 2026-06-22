import {
  type DomesticListColType,
  domesticBIllListColumnsData,
} from "./columns/DomesticBIllListColumnsData.tsx";
import { Button, InfiniteDataTable, Icons } from "@repo/ui";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm.tsx";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import ListResultHeader from "@shared/ui/ListResultHeader.tsx";
import { FlatTab } from "@shared/ui/tab/ui/Tabs.tsx";
import { useEffect, useState } from "react";
import { billDomesticQueries } from "@shared/query/bill/billDomesticQueries.ts";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { BillDomesticListRequest } from "@shared/api/bill/billDomesticApi.ts";
import { getName } from "@shared/enum/domesticType.ts";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";
import { SEARCH_KEY } from "@shared/enum/comCodeType";
import { billTabsQueries } from "@shared/query/bill/billTabsQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import DataMenuButton from "@shared/ui/DataMenuButton";
import { downloadExcel } from "@shared/util/excelUtil";

const tabs = [
  { label: "미수금", value: "DEAD_LINE" },
];

const DomesticBillList = () => {
  const getDomesticListMutation = useMutation(billDomesticQueries.getBillDomesticList());
  const deleteInvoiceListMutation = useMutation(billTabsQueries.deleteInvoiceList());
  const { openAlert } = useAlertStore();
  const navigate = useNavigate();
  const [listData, setListData] = useState<DomesticListColType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<string>("DEAD_LINE");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [searchFilters, setSearchFilters] = useState<any>({});

  const getDomesticList = (listParams: BillDomesticListRequest) => {
    getDomesticListMutation.mutate(listParams, {
      onSuccess: (response) => {
        if (response.data.list !== null && response.data.list.length > 0) {
          setTotalCount(response.data.totalCount);
          setListData(response.data.list);
        }
      },
    });
  };

  useEffect(() => {
    const param: BillDomesticListRequest = {
      page,
      pageSize,
    };
    getDomesticList(param);
  }, []);

  const onChangeTab = (value: string) => {
    setActiveTab(value);

    const param: BillDomesticListRequest = {
      page,
      pageSize,
    };
    getDomesticList(param);
  };

  const onSearch = (values: any) => {
    const params = buildSearchParams(values, pageSize);
    const filters = {
      searchCondition: params.searchCondition,
      dateFilters: params.dateFilters,
      textFilters: params.textFilters,
    };
    setSearchFilters(filters);
    getDomesticList({ page: 1, pageSize, ...filters });
  };

  const handleExcelDownload = async () => {
    if (totalCount === 0) {
      openAlert({ message: "다운로드할 데이터가 없습니다. 목록을 먼저 조회해주세요." });
      return;
    }
    const response = await getDomesticListMutation.mutateAsync({ page: 1, pageSize: totalCount, ...searchFilters });
    if (response.data?.list) {
      downloadExcel(response.data.list, "domestic_bill_list", domesticBIllListColumnsData);
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
              getDomesticList({ page, pageSize });
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
      <PageTitleArea className="pb-2" title="내국청구서 검색">
        <DataMenuButton data={listData} fileName="domestic_bill_list" columns={domesticBIllListColumnsData} onExcelClick={handleExcelDownload} />
        <Button variant="outline-pink" size="h28" onClick={() => navigate("/bill/domestic/write")}>
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

      <PageSearchForm onSearch={onSearch} searchKey={SEARCH_KEY.BILL} />


      <ListResultHeader totalCount={totalCount} />
      <InfiniteDataTable
        isLoading={getDomesticListMutation.isPending}
        isColumnVisible={true}
        data={listData}
        columns={domesticBIllListColumnsData}
        enableRowSelection={false}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        offsetTop={340}
        getRowId={(row) => String(row.invoiceSeq || row.tblSeq)}
        onRowClick={(row, rowData) => {
          const id = rowData.invoiceSeq || rowData.tblSeq;
          navigate(`/bill/domestic/detail/${id}`);
        }}
      />
    </>
  );
};

export default DomesticBillList;
