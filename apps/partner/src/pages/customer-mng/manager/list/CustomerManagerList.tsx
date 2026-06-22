import { getColumnsData } from "./columns/columnsData";
import { Button, DataTable, Icons } from "@repo/ui";
import ListResultHeader from "@shared/ui/ListResultHeader";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { useEffect, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { customerQueries } from "@shared/query/customer/queries";
import { type CustomerManagerListItem } from "@shared/api/customer/customerApi";
import { commonQueries } from "@shared/query/common/queries";
import { type CodeRequestTypeNew, type CodeSelectOption } from "@shared/api/common/commApi";
import { getCodeList } from "@shared/util/codeUtils";
import { mapToOptionNew } from "@shared/util/stringUtil";
import DataMenuButton from "@shared/ui/DataMenuButton";
import { downloadExcel } from "@shared/util/excelUtil";
import { useAlertStore } from "@shared/store/useAlertStore";
import { ManagerModal } from "../../common/modal/ManagerModal";
import { SEARCH_KEY } from "@shared/enum/comCodeType";

const CUSTOMER_CODE = {
  CUSTOMER_TYPE: "CLIENT_DIV",
};

const CustomerManagerList = () => {
  const [listData, setListData] = useState<CustomerManagerListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [clientCategoryMap, setClientCategoryMap] = useState<Record<string, string>>({});
  const { openAlert } = useAlertStore();

  //   검색 조건을 상태로 관리 (페이징이나 새로고침 시 필요)
  const [searchParams, setSearchParams] = useState<any>({ page: 1, pageSize: 30 });

  const searchMutation = useMutation(customerQueries.searchManagerList());
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());

  // 공통 코드 로드
  useEffect(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [CUSTOMER_CODE.CUSTOMER_TYPE],
    };
    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        const codeDataList = response.data;
        const toMap = (list: CodeSelectOption[]) =>
          Object.fromEntries(list.map((item) => [item.value, item.label]));
        setClientCategoryMap(toMap(mapToOptionNew(getCodeList(CUSTOMER_CODE.CUSTOMER_TYPE, codeDataList))));
      },
    });
  }, []);

  //   리스트 조회 함수 (검색 파라미터를 받을 수 있도록 수정)
  const fetchList = useCallback((params = searchParams) => {
    searchMutation.mutate(params, {
      onSuccess: (response) => {
        // API 응답 구조 data.list 에 맞춰서 데이터 세팅
        if (response.data?.list) {
          setListData(response.data.list);
          setTotalCount(response.data.totalCount || 0);
        } else {
          setListData([]);
          setTotalCount(0);
        }
      },
    });
  }, [searchMutation, searchParams]);

  //   검색 버튼 클릭 핸들러 (폼에서 입력된 값을 파라미터로 전달)
  const handleSearch = (values: any) => {
    const newParams = {
      ...searchParams,
      ...values, // 폼에서 넘어온 검색어들 (고객명, 담당자명 등)
      page: 1,   // 검색 시에는 다시 1페이지부터
    };
    setSearchParams(newParams);
    fetchList(newParams);
  };

  // 초기 로드
  useEffect(() => {
    fetchList();
  }, []);

  const columnsData = getColumnsData({ clientCategoryMap });

  const handleExcelDownload = async () => {
    if (totalCount === 0) {
      openAlert({ message: "다운로드할 데이터가 없습니다. 목록을 먼저 조회해주세요." });
      return;
    }
    const response = await searchMutation.mutateAsync({ ...searchParams, page: 1, pageSize: totalCount });
    if (response.data?.list) {
      downloadExcel(response.data.list, "customer_manager_list", columnsData);
    }
  };

const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const managerDetailMutation = useMutation(customerQueries.managerDetail());

  const handleRowClick = (row: any) => {
    // Skip if row is currently selected (checkbox is checked or unchecked)
    if (row.getIsSelected?.()) return;

    const rowData = row.original;
    setSelectedManager(rowData);

    // 상세 정보를 조회하여 최신 데이터로 모달 오픈
    if (rowData.participantSeq) {
      managerDetailMutation.mutate(rowData.participantSeq, {
        onSuccess: (res) => {
          const detailData = res.data || res;
          setSelectedManager({ ...rowData, ...detailData });
          setIsModalOpen(true);
        },
        onError: () => {
          setIsModalOpen(true);
        },
      });
    } else {
      setIsModalOpen(true);
    }
  };


  return (
    <>
      <PageTitleArea className="pb-2" title="고객담당자 검색">
        <DataMenuButton data={listData} fileName="customer_manager_list" columns={columnsData} onExcelClick={handleExcelDownload} />
      </PageTitleArea>

      {/*   onSearch 에 handleSearch 연결 */}
      <PageSearchForm
        showCaseClass={false}
        showScope={false}
        onSearch={handleSearch}
        searchKey={SEARCH_KEY.CUST_MNG}
      />

      <ListResultHeader totalCount={totalCount} />

      <DataTable
        data={listData}
        columns={columnsData}
        isLoading={searchMutation.isPending}
        onRowClick={handleRowClick}
      />

      {isModalOpen && (
        <ManagerModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          propData={selectedManager?.tblSeq}
          editData={selectedManager}
          title="담당자 수정"
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedManager(null);
            fetchList();
          }}
        />
      )}
    </>
  );
};

export default CustomerManagerList;
