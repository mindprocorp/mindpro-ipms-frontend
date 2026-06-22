import {
  sendReceiveListColumnsData,
} from "./columns/columnsData.tsx";
import { Button, InfiniteDataTable, Icons } from "@repo/ui";
import DataMenuButton from "@shared/ui/DataMenuButton";
import { downloadExcel } from "@shared/util/excelUtil";
import { useAlertStore } from "@shared/store/useAlertStore";
import ListResultHeader from "@shared/ui/ListResultHeader.tsx";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm.tsx";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  SendReceiveListRequest,
  SendReceiveListType,
} from "@shared/api/sendReceive/sendReceiveApi.ts";
import { useMutation } from "@tanstack/react-query";
import { sendReceiveQueries } from "@shared/query/sendReceive/sendReceiveQueries.ts";
import { getName } from "@shared/enum/domesticType.ts";
import { SEARCH_KEY } from "@shared/enum/comCodeType.ts";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";

const SendReceiveList = () => {
  const [listData, setListData] = useState<SendReceiveListType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);
  const [searchFilters, setSearchFilters] = useState<any>({});
  const getSendReveiveListMutation = useMutation(sendReceiveQueries.getSendReceiveList());
  const navigate = useNavigate();
  const { openAlert } = useAlertStore();

  const getSendReveiveList = (listParams: SendReceiveListRequest) => {
    getSendReveiveListMutation.mutate(listParams, {
      onSuccess: (response) => {
        if (response.data.list != null && response.data.list.length > 0) {
          setListData(response.data.list);
          setTotalCount(response.data.totalCount);
        } else {
          setListData([]);
          setTotalCount(0);
        }
      },
    });
  };

  const onSearch = (values: any) => {
    const params = buildSearchParams(values);
    setSearchFilters(params);
    const listParams: SendReceiveListRequest = {
      ...params,
      page,
      pageSize,
    };
    getSendReveiveList(listParams);
  };

  const handleExcelDownload = async () => {
    if (totalCount === 0) {
      openAlert({ message: "다운로드할 데이터가 없습니다. 목록을 먼저 조회해주세요." });
      return;
    }
    const response = await getSendReveiveListMutation.mutateAsync({ ...searchFilters, page: 1, pageSize: totalCount });
    if (response.data?.list) {
      downloadExcel(response.data.list, "send_receive_list", sendReceiveListColumnsData);
    }
  };

  useEffect(() => {
    onSearch({});
  }, []);

  return (
    <>
      <PageTitleArea className="pb-2" title="접발송내역">
        <DataMenuButton data={listData} fileName="send_receive_list" columns={sendReceiveListColumnsData} onExcelClick={handleExcelDownload} />
      </PageTitleArea>

      <PageSearchForm onSearch={onSearch} searchKey={SEARCH_KEY.SENDRECEIVE} />

      <ListResultHeader totalCount={totalCount}>
      </ListResultHeader>

      <InfiniteDataTable
        isLoading={getSendReveiveListMutation.isPending}
        isColumnVisible={true}
        data={listData}
        columns={sendReceiveListColumnsData}
        offsetTop={340}
        getRowId={(row) => String(row.tblSeq || row.appSeq)}
        onRowClick={(row, rowData) => {
          const rightTypeValue = getName(rowData.rightType.code).toLowerCase();
          navigate(`/domestic/detail/${rowData.appSeq}?type=${rightTypeValue}`);
        }}
      />
    </>
  );
};

export default SendReceiveList;
