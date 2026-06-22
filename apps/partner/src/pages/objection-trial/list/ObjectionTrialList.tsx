import { getColumnsData } from "./columns/columnsData";
import { Button, InfiniteDataTable, Icons } from "@repo/ui";
import ListResultHeader from "@shared/ui/ListResultHeader";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FlatTab } from "@shared/ui/tab/ui/Tabs";
import { useEffect, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { objectionTrialQueries } from "@shared/query/objection-trial/queries";
import { type ObjectionTrialListItem, type ObjectionTrialListRequest } from "@shared/api/objection-trial/objectionTrialApi";
import { type Row } from "@tanstack/react-table";
import { commonQueries } from "@shared/query/common/queries";
import { type CodeRequestTypeNew, type CodeSelectOption } from "@shared/api/common/commApi";
import { OBJECTION_TRIAL_CASE_MNG, SEARCH_KEY } from "@shared/enum/comCodeType";
import { getCodeList } from "@shared/util/codeUtils";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";
import { mapToOptionNew } from "@shared/util/stringUtil";
import DataMenuButton from "@shared/ui/DataMenuButton";
import { downloadExcel } from "@shared/util/excelUtil";
import { useAlertStore } from "@shared/store/useAlertStore";

// const tabs = [
//   { label: "마감경과", value: "DEAD_LINE" },
//   { label: "미청구", value: "NOT_CLAIMED" },
//   { label: "보정서마감", value: "AMEND_DEAD_LINE" },
//   { label: "미제출", value: "NOT_SUBMITTED" },
//   { label: "불복마감", value: "APPEAL_DEAD_LINE" },
// ];

const ObjectionTrialList = () => {
  const navigate = useNavigate();
  const [listData, setListData] = useState<ObjectionTrialListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState("DEAD_LINE");
  const [searchFilters, setSearchFilters] = useState<Partial<ObjectionTrialListRequest>>({});
  const { openAlert } = useAlertStore();

  const [courtCodeMap, setCourtCodeMap] = useState<Record<string, string>>({});
  const [agentCodeMap, setAgentCodeMap] = useState<Record<string, string>>({});
  const [caseTypeCodeMap, setCaseTypeCodeMap] = useState<Record<string, string>>({});

  const searchMutation = useMutation(objectionTrialQueries.searchList());
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());

  // 데이터 조회 함수
  const fetchList = useCallback((type1?: string) => {
    const targetTab = type1 || activeTab;

    const searchParams = {
      page: 1,
      pageSize: 20,
      // tabType: targetTab, // 필요시 탭 타입 파라미터 추가
    };

    searchMutation.mutate(searchParams, {
      onSuccess: (response) => {
        const resBody = response?.data;
        if (resBody) {
          setListData([...resBody.list]);
          setTotalCount(resBody.totalCount || resBody.list.length);
        } else {
          setListData([]);
          setTotalCount(0);
        }
      },
      onError: (error) => {
        console.error("API 요청 실패:", error);
      }
    });
  }, [activeTab, searchMutation]);

  // 최초 1회 공통코드 로드 및 데이터 호출
  useEffect(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [
        OBJECTION_TRIAL_CASE_MNG.PENDING_COURT,
        OBJECTION_TRIAL_CASE_MNG.AGENT_CATEGORY,
        OBJECTION_TRIAL_CASE_MNG.CASE_TYPE,
      ],
    };
    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        const codeDataList = response.data;
        const toMap = (list: CodeSelectOption[]) =>
          Object.fromEntries(list.map((item) => [item.value, item.label]));

        setCourtCodeMap(toMap(mapToOptionNew(getCodeList(OBJECTION_TRIAL_CASE_MNG.PENDING_COURT, codeDataList))));
        setAgentCodeMap(toMap(mapToOptionNew(getCodeList(OBJECTION_TRIAL_CASE_MNG.AGENT_CATEGORY, codeDataList))));
        setCaseTypeCodeMap(toMap(mapToOptionNew(getCodeList(OBJECTION_TRIAL_CASE_MNG.CASE_TYPE, codeDataList))));

        // fetchList("DEAD_LINE");
      },
    });
  }, []);

  const handleSearch = () => fetchList(activeTab);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    fetchList(tabValue);
  };

  //   [수정 핵심] Row 클릭 시 상세 페이지 이동 로직
  const handleRowClick = (rowData: ObjectionTrialListItem) => {
    const seq = rowData.conflictSeq;
    if (seq) {
      navigate(`/objection-trial/detail/${seq}`);
    }
  };

  const columnsData = getColumnsData({ courtCodeMap, agentCodeMap, caseTypeCodeMap });

  const onSearch = (values: Record<string, unknown>) => {
    const params = buildSearchParams(values) as ObjectionTrialListRequest;
    setSearchFilters(params);
    searchMutation.mutate({ ...params, page: 1, pageSize: 20 }, {
      onSuccess: (response) => {
        const resBody = response?.data;
        if (resBody) {
          setListData([...resBody.list]);
          setTotalCount(resBody.totalCount || resBody.list.length);
        } else {
          setListData([]);
          setTotalCount(0);
        }
      },
      onError: (error) => {
        console.error("검색 실패:", error);
      },
    });
  };

  const handleExcelDownload = async () => {
    if (totalCount === 0) {
      openAlert({ message: "다운로드할 데이터가 없습니다. 목록을 먼저 조회해주세요." });
      return;
    }
    const response = await searchMutation.mutateAsync({ ...searchFilters, page: 1, pageSize: totalCount });
    const resBody = response?.data;
    if (resBody?.list) {
      downloadExcel(resBody.list, "objection_trial_list", columnsData);
    }
  };

  return (
    <>
      <PageTitleArea className="pb-2" title="이의심판 검색">
        <DataMenuButton data={listData} fileName="objection_trial_list" columns={columnsData} onExcelClick={handleExcelDownload} />
        <Button variant="outline-pink" size="h28" onClick={() => navigate("/objection-trial/write")}>
          <Icons.Plus /> 신규등록
        </Button>
      </PageTitleArea>

      <PageSearchForm onSearch={onSearch} searchKey={SEARCH_KEY.CONFLICT} />

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

export default ObjectionTrialList;
