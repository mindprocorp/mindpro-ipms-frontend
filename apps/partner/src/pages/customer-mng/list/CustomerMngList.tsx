import { getColumnsData } from "./columns/columnsData";
import { Button, InfiniteDataTable, Icons } from "@repo/ui";
import ListResultHeader from "@shared/ui/ListResultHeader";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { customerQueries } from "@shared/query/customer/queries";
import { type CustomerListItem } from "@shared/api/customer/customerApi";
import { commonQueries } from "@shared/query/common/queries";
import { type CodeRequestTypeNew, type CodeSelectOption } from "@shared/api/common/commApi";
import { getCodeList } from "@shared/util/codeUtils";
import { mapToOptionNew } from "@shared/util/stringUtil";
import DataMenuButton from "@shared/ui/DataMenuButton";
import { downloadExcel } from "@shared/util/excelUtil";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { SEARCH_KEY } from "@shared/enum/comCodeType";

const CUSTOMER_CODE = {
  CUSTOMER_TYPE: "CLIENT_DIV",
  APPLICANT_TYPE: "APP_MAN_DIV",
  COMPANY_TYPE: "CORP_DIV",
};

const CustomerMngList = () => {
  const navigate = useNavigate();
  const [listData, setListData] = useState<CustomerListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchFilters, setSearchFilters] = useState<any>({});

  // 공통코드 맵 (code -> label)
  const [clientCategoryMap, setClientCategoryMap] = useState<Record<string, string>>({});
  const [applicantCategoryMap, setApplicantCategoryMap] = useState<Record<string, string>>({});
  const [corpCategoryMap, setCorpCategoryMap] = useState<Record<string, string>>({});

  const [selectedRows, setSelectedRows] = useState<CustomerListItem[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const { openAlert } = useAlertStore();

  const searchMutation = useMutation(customerQueries.searchList());
  const deleteListMutation = useMutation(customerQueries.deleteList());
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());

  // 공통코드 로드
  useEffect(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [
        CUSTOMER_CODE.CUSTOMER_TYPE,
        CUSTOMER_CODE.APPLICANT_TYPE,
        CUSTOMER_CODE.COMPANY_TYPE,
      ],
    };
    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        const codeDataList = response.data;
        const toMap = (list: CodeSelectOption[]) =>
          Object.fromEntries(list.map((item) => [item.value, item.label]));

        setClientCategoryMap(toMap(mapToOptionNew(getCodeList(CUSTOMER_CODE.CUSTOMER_TYPE, codeDataList))));
        setApplicantCategoryMap(toMap(mapToOptionNew(getCodeList(CUSTOMER_CODE.APPLICANT_TYPE, codeDataList))));
        setCorpCategoryMap(toMap(mapToOptionNew(getCodeList(CUSTOMER_CODE.COMPANY_TYPE, codeDataList))));
      },
    });
  }, []);

  // 페이지 로드시 조회
  const fetchList = () => {
    searchMutation.mutate(
      { page: 1, pageSize: 20 },
      {
        onSuccess: (response) => {
          if (response.data?.list) {
            setListData(response.data.list);
            setTotalCount(response.data.totalCount || response.data.list.length);
          }
        },
        onError: (error) => {
          console.error("[고객 검색] API 에러:", error);
        },
      }
    );
  };

  const handleSearch = (values: any) => {
    const params = buildSearchParams(values, 20);
    const filters = {
      searchCondition: params.searchCondition,
      dateFilters: params.dateFilters,
      textFilters: params.textFilters,
    };
    setSearchFilters(filters);
    searchMutation.mutate(
      { page: 1, pageSize: 20, ...filters },
      {
        onSuccess: (response) => {
          if (response.data?.list) {
            setListData(response.data.list);
            setTotalCount(response.data.totalCount || response.data.list.length);
          }
        },
      }
    );
  };

  const handleExcelDownload = async () => {
    if (totalCount === 0) {
      openAlert({ message: "다운로드할 데이터가 없습니다. 목록을 먼저 조회해주세요." });
      return;
    }
    const response = await searchMutation.mutateAsync({ page: 1, pageSize: totalCount, ...searchFilters });
    if (response.data?.list) {
      downloadExcel(response.data.list, "customer_mng_list", columnsData);
    }
  };



  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      openAlert({ message: "삭제할 고객을 선택해주세요.", confirmText: "확인" });
      return;
    }

    const confirmed = await openAlert({
      message: `${selectedRows.length}명의 고객을 삭제하시겠습니까?`,
      confirmText: "삭제",
      cancelText: "취소",
    });

    if (confirmed) {
      const ids = selectedRows.map((row) => row.customerSeq).filter(Boolean);
      deleteListMutation.mutate(ids, {
        onSuccess: () => {
          fetchList();
          setRowSelection({});
          setSelectedRows([]);
        },
        onError: () => {
          openAlert({ message: "삭제 중 오류가 발생했습니다.", confirmText: "확인" });
        },
      });
    }
  };

  const handleRowClick = (rowData: any) => {
    const seq = rowData?.customerSeq;
    if (seq) {
      navigate(`/customer-mng/detail/${seq}`);
    }
  };

  const columnsData = getColumnsData({ clientCategoryMap, applicantCategoryMap, corpCategoryMap });

  return (
    <>
      <PageTitleArea className="pb-2" title="고객관리 검색">
        <DataMenuButton data={listData} fileName="customer_mng_list" columns={columnsData} onExcelClick={handleExcelDownload} />
        <Button
          variant="outline-pink"
          size="h28"
          onClick={() => navigate("/customer-mng/write")}
        >
          <Icons.Plus />
          신규등록
        </Button>
{/* <Button
          variant="red"
          size="h28"
          onClick={handleDelete}
          disabled={selectedRows.length === 0}
        >
          <Icons.Trash2 />
          삭제
        </Button> */}
      </PageTitleArea>

      <PageSearchForm showCaseClass={false} showScope={false} onSearch={handleSearch} searchKey={SEARCH_KEY.CUSTOMER} />

      <ListResultHeader totalCount={totalCount} />

      <InfiniteDataTable isColumnVisible={true}
        data={listData}
        columns={columnsData}
        enableRowSelection={false}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        getSelectedRow={(items: any[]) => setSelectedRows(items)}
        offsetTop={340}
        getRowId={(row) => String(row.customerSeq)}
        onRowClick={(row, rowData) => handleRowClick(rowData)}
      />
    </>
  );
};

export default CustomerMngList;
