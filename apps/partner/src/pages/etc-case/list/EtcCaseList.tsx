import { getColumnsData } from "./columns/columnsData";
import { Button, InfiniteDataTable, Icons } from "@repo/ui";
import ListResultHeader from "@shared/ui/ListResultHeader";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FlatTab } from "@shared/ui/tab/ui/Tabs";
import { useEffect, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { etcCaseQueries } from "@shared/query/etc-case/queries";
import { type EtcCaseListItem } from "@shared/api/etc-case/etcCaseApi";
import { commonQueries } from "@shared/query/common/queries";
import { type CodeRequestTypeNew, type CodeSelectOption } from "@shared/api/common/commApi";
import { getCodeList } from "@shared/util/codeUtils";
import { mapToOptionNew } from "@shared/util/stringUtil";
import DataMenuButton from "@shared/ui/DataMenuButton";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";
import { SEARCH_KEY } from "@shared/enum/comCodeType";

const ETC_CASE_CODE = {
  CASE_TYPE: "ETC_CASE_TYPE",
};

// const tabs = [
//   { label: "마감경과", value: "DEAD_LINE" },
//   { label: "미처리", value: "NOT_PROCESSED" },
//   { label: "미제출", value: "NOT_SUBMITTED" },
// ];

const EtcCaseList = () => {
  const navigate = useNavigate();
  const [listData, setListData] = useState<EtcCaseListItem[]>([]);
  const [totalCount, setTotalCount] = useState(100);
  const [activeTab, setActiveTab] = useState("DEAD_LINE");

  const [caseTypeCodeMap, setCaseTypeCodeMap] = useState<Record<string, string>>({});

  const searchMutation = useMutation(etcCaseQueries.searchList());
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());

  // 데이터 조회 함수
  const fetchList = useCallback((type1?: string) => {
    const targetTab = type1 || activeTab;

    searchMutation.mutate(
      { type1: targetTab },
      {
        onSuccess: (response) => {
          if (response.data?.etcList) {
            setListData([...response.data.etcList]);
            setTotalCount(response.data.totalCount || response.data.etcList.length);
          } else {
            setListData([]);
            setTotalCount(0);
          }
        },
        onError: (error) => {
          console.error("[기타사건 검색] API 에러:", error);
        },
      }
    );
  }, [activeTab, searchMutation]);

  // 공통코드 로드 및 초기 데이터 호출
  useEffect(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [ETC_CASE_CODE.CASE_TYPE],
    };
    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        const codeDataList = response.data;
        const toMap = (list: CodeSelectOption[]) =>
          Object.fromEntries(list.map((item) => [item.value, item.label]));

        setCaseTypeCodeMap(toMap(mapToOptionNew(getCodeList(ETC_CASE_CODE.CASE_TYPE, codeDataList))));

        //   코드 로드 후 첫 번째 탭 데이터 로드
        fetchList("DEAD_LINE");
      },
    });
  }, []);

  const handleSearch = () => fetchList(activeTab);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    fetchList(tabValue);
  };

  //   [수정] Row 클릭 시 상세 페이지 이동 및 버블링 방지
  const handleRowClick = (rowData: any) => {
    const seq = rowData?.conflictSeq; // 히든 데이터인 conflictSeq 사용
    if (seq) {
      navigate(`/etc-case/detail/${seq}`);
    }
  };

  const columnsData = getColumnsData();

  const onSearch = (values: any) => {
    const params = buildSearchParams(values);
    searchMutation.mutate(
      { ...params, type1: activeTab },
      {
        onSuccess: (response) => {
          if (response.data?.etcList) {
            setListData([...response.data.etcList]);
            setTotalCount(response.data.totalCount || response.data.etcList.length);
          } else {
            setListData([]);
            setTotalCount(0);
          }
        },
        onError: (error) => {
          console.error("검색 실패:", error);
        },
      }
    );
  };

  return (
    <>
      <PageTitleArea className="pb-2" title="기타사건 검색">
        <DataMenuButton data={listData} fileName="etc_case_list" columns={columnsData} />
        <Button variant="outline-pink" size="h28" onClick={() => navigate("/etc-case/write")}>
          <Icons.Plus /> 신규등록
        </Button>
      </PageTitleArea>

      <PageSearchForm onSearch={onSearch} searchKey={SEARCH_KEY.ETC_EVENT} />

      {/* <FlatTab items={tabs} active={activeTab} onChange={handleTabChange} className="mt-3" /> */}

      <ListResultHeader totalCount={totalCount} />

      <InfiniteDataTable isColumnVisible={true}
        data={listData}
        columns={columnsData}
        isLoading={searchMutation.isPending}
        offsetTop={340}
        getRowId={(row) => String(row.conflictSeq)}
        onRowClick={(row, rowData) => handleRowClick(rowData)}
      />
    </>
  );
};

export default EtcCaseList;
