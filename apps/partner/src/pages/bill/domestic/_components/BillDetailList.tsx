import { Button, DataTable, FlexBox, Icons } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import FlatItem from "@shared/ui/tab/ui/FlatItem";
import { FlatTab } from "@shared/ui/tab/ui/Tabs";
import React, { useEffect, useState } from "react";
import { billDetailCol } from "@pages/bill/domestic/columns/BillDetailCol.tsx";
import { useMutation } from "@tanstack/react-query";
import { billDomesticQueries } from "@shared/query/bill/billDomesticQueries.ts";
import { billTabsQueries } from "@shared/query/bill/billTabsQueries.ts";
import { useParams } from "react-router-dom";
import type { BillDetailListType } from "@shared/api/bill/billDomesticApi.ts";
import { BillDetailModal } from "@pages/bill/common/modal/BillDetailModal";
import { FileListModal } from "@pages/common/bottom/modal/FileListModal.tsx";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import type { DistributeRequestItem, FileItemListResponseType, MemoItemType } from "@shared/api/common/commBottomApi.ts";
import { getFileListColumns } from "@pages/common/bottom/modal/columns/FileListCol.tsx";
import { getMemoColumns } from "@pages/common/bottom/modal/columns/MemoCol.tsx";
import { MemoModal } from "@pages/common/bottom/modal/MemoModal.tsx";
import { DistributeModal } from "@pages/bill/common/modal/DistributeModal";
import { billDistributeCol } from "@pages/bill/domestic/columns/BillDistributeCol.tsx";
import { depositCol } from "@pages/bill/common/columns/DepositCol.tsx";
import { DepositModal } from "@pages/bill/common/modal/DepositModal.tsx";
import { useLocation } from 'react-router-dom';
import { getDistributeColumns } from "@pages/common/bottom/modal/columns/DistributeCol.tsx";

export type ColType = {
  appSeq: string;
  productClass: string;
  productCount: number;
  productSummaryKo: string;
  productSummaryEn: string;
};

const BillDetailList = () => {
  const { billSeq } = useParams<{ billSeq: string | undefined }>();
  const [tabActice, setTabActice] = useState<string>("BILL_DETAIL");
  const getBillDetailMutation = useMutation(billDomesticQueries.getBillDetailList());
  const getFileListMutation = useMutation(bottomQueries.getFileListList());
  const getMemoMutation = useMutation(bottomQueries.getMemoList());
  const getDistributeList = useMutation(bottomQueries.getDistributeList());
  const getBankingMutation = useMutation(billTabsQueries.getBankingList());
  const [billDetailList, setBillDetailList] = useState<BillDetailListType[]>([]);
  const [isBillDetailOpenModal, setIsBillDetailOpenModal] = React.useState(false);
  const [isFileListOpenModal, setIsFileListOpenModal] = React.useState(false);
  const [isMemoOpenModal, setIsMemoOpenModal] = React.useState(false);
  const [isDistributeOpenModal, setIsDistributeOpenModal] = React.useState(false);
  const [isDepositOpenModal, setIsDepositOpenModal] = React.useState(false);
  const [isRefresh, setIsRefresh] = React.useState(false);
  const [fileListList, setFileListList] = useState<FileItemListResponseType[]>([]);
  const [memoList, setMemoList] = useState<MemoItemType[]>([]);
  const [distributeList, setDistributeList] = useState<DistributeRequestItem[]>([]);
  // TODO: Add depositList state
  const [depositList, setDepositList] = useState<any[]>([]);
  const location = useLocation();
  const [isCreate, setIsCreate] = useState(location.pathname.includes('write') ? true : false);

  const getDetailData = (detailType: string) => {
    if (billSeq) {
      switch (detailType) {
        case "BILL_DETAIL":
          getBillDetailMutation.mutate(billSeq, {
            onSuccess: (response) => {
              setBillDetailList(response.data.list);
            },
          });
          break;
        case "FILE_LIST":
          getFileListMutation.mutate(billSeq, {
            onSuccess: (response) => {
              setFileListList(response.data.list);
            },
          });
          break;
        case "MEMO":
          getMemoMutation.mutate(billSeq, {
            onSuccess: (response) => {
              setMemoList(response.data.list);
            },
          });
          break;
        case "DISTRIBUTE":
          const param = {
            page : 1,
            pageSize : 100,
            tblSeq : billSeq
          }
          getDistributeList.mutate(param, {
            onSuccess: (response) => {
              alert(response)
              setDistributeList(response.data.list);
            },
          });
          break;
        case "DEPOSIT":
          getBankingMutation.mutate({ tblSeq: billSeq }, {
            onSuccess: (response) => {
              setDepositList((response.data.list || []).filter((b: any) => b.bankingCategory === "20"));
            },
          });
          break;
        default:
          break;
      }
    }
  };

  const tabClick = (value: string) => {
    setTabActice(value);
    getDetailData(value);
  };

  const addReg = () => {
    switch (tabActice) {
      case "BILL_DETAIL":
        setIsBillDetailOpenModal(true);
        break;
      case "FILE_LIST":
        setIsFileListOpenModal(true);
        break;
      case "MEMO":
        setIsMemoOpenModal(true);
        break;
      case "DISTRIBUTE":
        setIsDistributeOpenModal(true);
        break;
    }
  };

  const onSuccess = (rtnData: any) => {
    switch (rtnData.callbackData) {
      case "BILL_DETAIL":
        setIsBillDetailOpenModal(false);
        getDetailData('BILL_DETAIL')
        break;
      case "FILE_LIST":
        setIsFileListOpenModal(false);
        getDetailData('FILE_LIST')
        break;
      case "MEMO":
        setIsMemoOpenModal(false);
        getDetailData('MEMO')
        break;
      case "DISTRIBUTE":
        setIsDistributeOpenModal(false);
        getDetailData('DISTRIBUTE')
        break;
      case "DEPOSIT":
        setIsDepositOpenModal(false);
        getDetailData('DEPOSIT')
        break;
    }
    setIsRefresh(!isRefresh);
  };

  const onOpenChange = (isOpen: boolean) => {
    switch (tabActice) {
      case "BILL_DETAIL":
        setIsBillDetailOpenModal(isOpen);
        break;
      case "FILE_LIST":
        setIsFileListOpenModal(isOpen);
        break;
      case "MEMO":
        setIsMemoOpenModal(isOpen);
        break;
      case "DISTRIBUTE":
        setIsDistributeOpenModal(isOpen);
        break;
    }
  };

  useEffect(() => {
    getDetailData("BILL_DETAIL");
    if (billSeq) {
      getBankingMutation.mutate(
        { tblSeq: billSeq },
        {
          onSuccess: (res) => {
            console.log('res', res)
            setDepositList((res.data.list || []).filter((b: any) => b.bankingCategory === "10"))
          }
        },
      );
    }
  }, [billSeq]);

  return (
    <>
      <FormUnitBox vertical boxfull className="min-w-0">
        <FlatTab className="border-border-100 mb-2 border-b">
          <FlexBox className="flex-0">
            <FlatItem
              label="청구내역"
              value="BILL_DETAIL"
              active={tabActice}
              onClick={() => tabClick("BILL_DETAIL")}
            />
            <FlatItem
              label="첨부서류"
              value="FILE_LIST"
              active={tabActice}
              onClick={() => tabClick("FILE_LIST")}
            />
            <FlatItem
              label="메모"
              value="MEMO"
              active={tabActice}
              onClick={() => tabClick("MEMO")}
            />
            {/*<FlatItem*/}
            {/*  label="실적분배"*/}
            {/*  value="DISTRIBUTE"*/}
            {/*  active={tabActice}*/}
            {/*  onClick={() => tabClick("DISTRIBUTE")}*/}
            {/*/>*/}
          </FlexBox>
          {!isCreate && (
            <FlexBox className="w-auto flex-none">
              <Button variant="blue" size="h24" onClick={addReg}>
                <Icons.Plus />
                추가
              </Button>

              {tabActice !== "DISTRIBUTE" && (
                <>
                  <Button size="h24">
                    <Icons.PenLine />
                    수정
                  </Button>
                  <Button size="h24">
                    <Icons.Trash2 />
                    삭제
                  </Button>
                </>
              )}
            </FlexBox>
          )}
        </FlatTab>

        {tabActice === "BILL_DETAIL" && (
          <DataTable data={billDetailList} columns={billDetailCol} className="h-90" />
        )}
        {tabActice === "FILE_LIST" && (
          <DataTable data={fileListList} columns={getFileListColumns(false)} className="h-90" />
        )}
        {tabActice === "MEMO" && (
          <DataTable data={memoList} columns={getMemoColumns(false)} className="h-90" />
        )}
        {tabActice === "DISTRIBUTE" && (
          <DataTable data={distributeList} columns={getDistributeColumns(false)} className="h-90" />
        )}

        <FlexBox className="border-border-100 justify-between gap-0 border-b">
          <FlexBox className="gap-4">
            <FlatItem label="입금내역" value="DEPOSIT" active="DEPOSIT" />
          </FlexBox>
          {!isCreate && (
            <div className="flex gap-1">
              <Button size="h24" variant="blue" onClick={() => setIsDepositOpenModal(true)}>
                <Icons.Plus />
                추가
              </Button>
              <Button size="h24">
                <Icons.PenLineIcon />
                수정
              </Button>
              <Button size="h24">
                <Icons.Trash2 />
                삭제
              </Button>
            </div>
          )}

        </FlexBox>

        <DataTable data={depositList} columns={depositCol} className="h-90" />
      </FormUnitBox>

      {isBillDetailOpenModal && (
        <BillDetailModal
          open={isBillDetailOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={billSeq}
          title="청구내역등록"
        />
      )}
      {isFileListOpenModal && (
        <FileListModal
          open={isFileListOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={billSeq}
          title="첨부서류"
        />
      )}

      {isMemoOpenModal && (
        <MemoModal
          open={isMemoOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={billSeq}
          title="메모"
        />
      )}
      {isDistributeOpenModal && (
        <DistributeModal
          open={isDistributeOpenModal}
          onOpenChange={setIsDistributeOpenModal}
          onSuccess={onSuccess}
          propData={billSeq}
          title="실적분배"
        />
      )}
      {isDepositOpenModal && (
        <DepositModal
          open={isDepositOpenModal}
          onOpenChange={setIsDepositOpenModal}
          onSuccess={onSuccess}
          title="입금내역"
        />
      )}
    </>
  );
};

export default BillDetailList;
