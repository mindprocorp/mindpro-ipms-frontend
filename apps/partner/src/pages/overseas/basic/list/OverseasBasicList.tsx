import { Button, InfiniteDataTable, Icons } from "@repo/ui";
import DataMenuButton from "@shared/ui/DataMenuButton";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm.tsx";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import ListResultHeader from "@shared/ui/ListResultHeader.tsx";
import { FlatTab } from "@shared/ui/tab/ui/Tabs.tsx";
import { useNavigate } from "react-router-dom";
import { getBasicListColumns } from "@pages/overseas/basic/list/BasicListCol.tsx";
import { useEffect, useState } from "react";
import type {
  OverseasBasicListRequest,
  OverseasBasicListResponse,
} from "@shared/api/overseas/basicApi.ts";
import { useMutation } from "@tanstack/react-query";
import { overseasBasicQueries } from "@shared/query/overseas/overseasBasicQueries.ts";
import { getName } from "@shared/enum/domesticType.ts";
import type { OverseasListRequest } from "@shared/api/overseas/overseasApi.ts";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";
import { SEARCH_KEY } from "@shared/enum/comCodeType";

// const tabs = [
//   { label: "마감경과", value: "" },
//   { label: "미출원", value: "" },
//   { label: "심사미청구", value: "" },
//   { label: "OV/심판", value: "" },
//   { label: "등록료마감", value: "" },
//   { label: "연차마감", value: "" },
//   { label: "갱신마감", value: "" },
// ];

const OverseasBasicList = () => {
  const getBasicListMutation = useMutation(overseasBasicQueries.getOverseasBasicList());
  const navigate = useNavigate();
  const [basicResponse, setBasicResponse] = useState<OverseasBasicListResponse>();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);

  const getDomesticBasicList = (param: OverseasBasicListRequest) => {
    getBasicListMutation.mutate(param, {
      onSuccess: (response) => {
        setBasicResponse(response.data);
      },
    });
  };


  const onSearch = (values: any) => {
    const params = buildSearchParams(values, pageSize);
    getDomesticBasicList({
      page: 1,
      pageSize,
      searchCondition: params.searchCondition,
      dateFilters: params.dateFilters,
      textFilters: params.textFilters,
    });
  };

  useEffect(() => {
    const param: OverseasBasicListRequest = {
      page: 1,
      pageSize: 200,
    };
    getDomesticBasicList(param);
  }, []);

  return (
    <>
      <PageTitleArea className="pb-2" title="해외기본 검색">
        <DataMenuButton data={basicResponse?.list || []} fileName="해외기본" columns={getBasicListColumns(false)} />
        <Button variant="outline-pink" size="h28" onClick={() => navigate("/overseas/basic/write")}>
          <Icons.Plus />
          신규등록
        </Button>
      </PageTitleArea>

      <PageSearchForm onSearch={onSearch} searchKey={SEARCH_KEY.OVERSEAS_BASIC} />

      {/* <FlatTab items={tabs} active="마감경과" className="mt-3" /> */}

      <ListResultHeader totalCount={basicResponse?.totalCount ?? 0} />
      <InfiniteDataTable isColumnVisible={true}
        data={basicResponse?.list || []}
        columns={getBasicListColumns(false)}
        offsetTop={340}
        getRowId={(row) => String(row.appExtSeq)}
        onRowClick={(row, rowData) => {
          console.log("선택된 data:" + rowData.rightType.code);
          console.log("선택된 data111:" + rowData.appExtSeq);
          const rightTypeValue = getName(rowData.rightType.code).toLowerCase();
          navigate(`/overseas/basic/detail/${rowData.appExtSeq}?type=${rightTypeValue}`);
        }}
      />
    </>
  );
};

export default OverseasBasicList;
