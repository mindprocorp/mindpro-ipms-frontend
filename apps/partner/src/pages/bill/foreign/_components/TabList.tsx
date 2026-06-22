import { Button, DataTable, FlexBox, Icons } from "@repo/ui";

export type Payment = { id: string; amount: number; status: string; email: string };
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import FlatItem from "@shared/ui/tab/ui/FlatItem";
import { FlatTab } from "@shared/ui/tab/ui/Tabs";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { billDetailCol } from "@pages/bill/domestic/columns/BillDetailCol.tsx";
import { useMutation } from "@tanstack/react-query";
import { billTabsQueries } from "@shared/query/bill/billTabsQueries.ts";
import { useParams } from "react-router-dom";
import { BillDetailForeignModal } from "../../common/modal/BillDetailForeignModal.tsx";
import { BillRemittanceModal } from "../../common/modal/BillRemittanceModal.tsx";
import { BillDetailModal } from "../../common/modal/BillDetailModal.tsx";
import { FileListModal } from "@pages/common/bottom/modal/FileListModal.tsx";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import type { FileItemListResponseType, MemoItemType } from "@shared/api/common/commBottomApi.ts";
import { getFileListColumns } from "@pages/common/bottom/modal/columns/FileListCol.tsx";
import { getMemoColumns } from "@pages/common/bottom/modal/columns/MemoCol.tsx";
import { MemoModal } from "@pages/common/bottom/modal/MemoModal.tsx";
import { DistributeModal } from "@pages/bill/common/modal/DistributeModal";
import { getDistributeColumns } from "@pages/common/bottom/modal/columns/DistributeCol.tsx";
import { depositCol } from "@pages/bill/common/columns/DepositCol.tsx";
import { DepositModal } from "@pages/bill/common/modal/DepositModal.tsx";
import { billRemittanceCol } from "@pages/bill/common/columns/BillRemittanceCol.tsx";
import { billDetailForeignCol } from "@pages/bill/common/modal/columns/BillDetailForeignCol.tsx";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { useFormContext } from "react-hook-form";

interface TabListProps {
  onSaveAndProceed?: (callback: (newSeq: string) => void) => void;
}

const BillDetailList = ({ onSaveAndProceed }: TabListProps) => {
  const { billSeq } = useParams<{ billSeq: string | undefined }>();
  const { openAlert } = useAlertStore();
  const { setValue, getValues } = useFormContext();

  const [tabActice, setTabActice] = useState<string>("BILL_DETAIL");
  const [bottomTabActive, setBottomTabActive] = useState<string>("OUR_BILL");
  const [isRefresh, setIsRefresh] = useState(false);

  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [bottomRowSelection, setBottomRowSelection] = useState<Record<string, boolean>>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [clickedSection, setClickedSection] = useState<"top" | "bottom" | null>(null);

  const getBillDetailMutation = useMutation(billTabsQueries.getClaimList());
  const getAgentClaimMutation = useMutation(billTabsQueries.getAgentClaimList());
  const getFileListMutation = useMutation(bottomQueries.getFileListList());
  const getMemoMutation = useMutation(bottomQueries.getMemoList());
  const getDistributeMutation = useMutation(bottomQueries.getDistributeList());
  const getBankingMutation = useMutation(billTabsQueries.getBankingList());
  const getForeignBankingMutation = useMutation(billTabsQueries.getForeignBankingList());

  const deleteClaimMutation = useMutation(billTabsQueries.deleteClaim());
  const deleteBankingMutation = useMutation(billTabsQueries.deleteBanking());
  const deleteClaimListMutation = useMutation(billTabsQueries.deleteClaimList());
  const deleteBankingListMutation = useMutation(billTabsQueries.deleteBankingList());
  const deletePerformanceListMutation = useMutation(billTabsQueries.deletePerformanceList());
  const deleteMemoListMutation = useMutation(bottomQueries.multiDeleteMemo());
  const deleteFileListMutation = useMutation(bottomQueries.multiDeleteFileList());
  const getAgentClaimDetailMutation = useMutation(billTabsQueries.getAgentClaimDetail());
  const getOurBillDetailMutation = useMutation(billTabsQueries.getClaimDetail());
  const getClaimDetailMutation = useMutation(billTabsQueries.getClaimDetail());
  const getBankingDetailMutation = useMutation(billTabsQueries.getForeignBankingDetail());

  const [billDetailList, setBillDetailList] = useState<any[]>([]);
  const [remittanceList, setRemittanceList] = useState<any[]>([]);
  const [fileListList, setFileListList] = useState<FileItemListResponseType[]>([]);
  const [memoList, setMemoList] = useState<MemoItemType[]>([]);
  const [distributeList, setDistributeList] = useState<any[]>([]);
  const [depositList, setDepositList] = useState<any[]>([]);
  const [ourBillList, setOurBillList] = useState<any[]>([]);

  const [isBillDetailOpenModal, setIsBillDetailOpenModal] = useState(false);
  const [isRemittanceOpenModal, setIsRemittanceOpenModal] = useState(false);
  const [isOurBillOpenModal, setIsOurBillOpenModal] = useState(false);
  const [isFileListOpenModal, setIsFileListOpenModal] = useState(false);
  const [isMemoOpenModal, setIsMemoOpenModal] = useState(false);
  const [isDistributeOpenModal, setIsDistributeOpenModal] = useState(false);
  const [isDepositOpenModal, setIsDepositOpenModal] = useState(false);

  //   [신규] 대리인 청구내역 기반 요약 정보 자동 업데이트
  useEffect(() => {
    if (billDetailList.length > 0) {
      let gov = 0, agency = 0, vat = 0, etc = 0;
      billDetailList.forEach(item => {
        const amount = Number(item.unitPrice || 0);
        const code = item.costCategory?.code;
        if (code === "10") gov += amount;
        else if (code === "20") agency += amount;
        else if (code === "30") vat += amount;
        else if (code === "50") etc += amount;
      });
      setValue("foreignGovFee", gov);
      setValue("foreignAgencyFee", agency);
      setValue("foreignVat", vat);
      setValue("foreignEtcFee", etc);
    }
  }, [billDetailList, setValue]);

  //   [신규] 입금내역 기반 입금액 자동 업데이트
  useEffect(() => {
    if (depositList.length > 0) {
      const totalDep = depositList.reduce((acc, cur) => acc + Number(cur.totalAmount || 0), 0);
      setValue("depAmount", totalDep);
    }
  }, [depositList, setValue]);

  const getDetailData = useCallback((detailType: string, seq?: string) => {
    const targetSeq = seq || billSeq;
    if (!targetSeq) return;

    switch (detailType) {
      case "BILL_DETAIL":
        getAgentClaimMutation.mutate({ tblSeq: targetSeq, payload: { page: 1, pageSize: 50 } }, {
          onSuccess: (res) => setBillDetailList(res.data.list || [])
        });
        break;
      case "REMITTANCE":
        getForeignBankingMutation.mutate({ tblSeq: targetSeq, payload: { page: 1, pageSize: 50 } }, {
          onSuccess: (res) => setRemittanceList(res.data.list || [])
        });
        break;
      case "FILE_LIST":
        getFileListMutation.mutate(targetSeq, {
          onSuccess: (res) => setFileListList(res.data.list || [])
        });
        break;
      case "MEMO":
        getMemoMutation.mutate(targetSeq, {
          onSuccess: (res) => setMemoList(res.data.list || [])
        });
        break;
      case "DISTRIBUTE":
        getDistributeMutation.mutate({ tblSeq: targetSeq, page: 1, pageSize: 100 }, {
          onSuccess: (res) => setDistributeList(res.data.list || [])
        });
        break;
      case "OUR_BILL":
        getBillDetailMutation.mutate({ tblSeq: targetSeq, payload: { page: 1, pageSize: 50 } }, {
          onSuccess: (res) => setOurBillList(res.data.list || [])
        });
        break;
      case "DEPOSIT":
        getBankingMutation.mutate({ tblSeq: targetSeq, payload: { page: 1, pageSize: 50 } }, {
          onSuccess: (res) => setDepositList((res.data.list || []).filter((b: any) => b.bankingCategory === "10"))
        });
        break;
    }
  }, [billSeq]);

  const tabClick = (value: string) => {
    const performTabClick = (seq: string) => {
      setTabActice(value);
      setRowSelection({}); // Reset selection on tab change
      getDetailData(value, seq);
    };

    if (onSaveAndProceed) {
      onSaveAndProceed(performTabClick);
    } else {
      performTabClick(billSeq || "");
    }
  };

  const bottomTabClick = (value: string) => {
    const performBottomTabClick = (seq: string) => {
      setBottomTabActive(value);
      getDetailData(value, seq);
    };

    if (onSaveAndProceed) {
      onSaveAndProceed(performBottomTabClick);
    } else {
      performBottomTabClick(billSeq || "");
    }
  };

  const addReg = () => {
    const performAddReg = () => {
      if (tabActice === "BILL_DETAIL") setIsBillDetailOpenModal(true);
      else if (tabActice === "REMITTANCE") setIsRemittanceOpenModal(true);
      else if (tabActice === "FILE_LIST") setIsFileListOpenModal(true);
      else if (tabActice === "MEMO") setIsMemoOpenModal(true);
      else if (tabActice === "DISTRIBUTE") {
        const perfAmount = Number(getValues("perfAmount") || 0);
        if (perfAmount <= 0) {
          openAlert({
            message: "실적금액이 존재하지 않습니다. 마스터 정보의 실적인정금액을 확인해주세요.",
            confirmText: "확인",
          });
          return;
        }
        setIsDistributeOpenModal(true);
      }
    };

    if (onSaveAndProceed) {
      onSaveAndProceed(performAddReg);
    } else {
      performAddReg();
    }
  };

  const addBottomReg = () => {
    const performAddBottomReg = () => {
      if (bottomTabActive === "OUR_BILL") setIsOurBillOpenModal(true);
      else if (bottomTabActive === "DEPOSIT") setIsDepositOpenModal(true);
    };

    if (onSaveAndProceed) {
      onSaveAndProceed(performAddBottomReg);
    } else {
      performAddBottomReg();
    }
  };

  const getSeqKey = (tab: string) => {
    switch (tab) {
      case "BILL_DETAIL": return "invoiceClaimSeq";
      case "REMITTANCE":
      case "DEPOSIT": return "bankingSeq";
      case "OUR_BILL": return "invoiceClaimSeq";
      case "MEMO": return "memoSeq";
      case "FILE_LIST": return "fileMappSeq";
      case "DISTRIBUTE": return "performanceSeq";
      default: return "";
    }
  };

  const getBatchDeleteMutation = (tab: string) => {
    switch (tab) {
      case "BILL_DETAIL":
      case "OUR_BILL": return deleteClaimListMutation;
      case "REMITTANCE":
      case "DEPOSIT": return deleteBankingListMutation;
      case "DISTRIBUTE": return deletePerformanceListMutation;
      case "MEMO": return deleteMemoListMutation;
      case "FILE_LIST": return deleteFileListMutation;
      default: return null;
    }
  };

  const handleDelete = async (section?: "top" | "bottom") => {
    if (!billSeq) return;
    const isBottom = section ? section === "bottom" : clickedSection === "bottom";
    const currentRowSelection = isBottom ? bottomRowSelection : rowSelection;
    const activeDataList = isBottom
      ? (bottomTabActive === "OUR_BILL" ? ourBillList : depositList)
      : (tabActice === "BILL_DETAIL" ? billDetailList 
          : (tabActice === "REMITTANCE" ? remittanceList 
          : (tabActice === "FILE_LIST" ? fileListList 
          : (tabActice === "MEMO" ? memoList : (tabActice === "DISTRIBUTE" ? distributeList : [])))));

    const selectedIndices = Object.keys(currentRowSelection).filter(key => currentRowSelection[key]);
    const selectedItems = selectedIndices.map(index => activeDataList[parseInt(index)]).filter(Boolean);

    if (selectedItems.length === 0) {
      openAlert({ message: "삭제할 항목을 선택해주세요.", confirmText: "확인" });
      return;
    }

    openAlert({
      message: `${selectedItems.length}개 항목을 삭제하시겠습니까?`,
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: () => {
        const currentTab = isBottom ? bottomTabActive : tabActice;
        const batchDeleteMutation = getBatchDeleteMutation(currentTab);
        const seqKey = getSeqKey(isBottom ? bottomTabActive : tabActice);

        if (batchDeleteMutation) {
          const seqs = selectedItems.map(item => item[seqKey]).filter(Boolean);
          if (seqs.length > 0) {
            let payload: any = { invoiceSeq: billSeq };
            if (currentTab === "REMITTANCE" || currentTab === "DEPOSIT") payload = { invoiceSeq: billSeq, bankingSeqs: seqs };
            else if (currentTab === "DISTRIBUTE") payload = { invoiceSeq: billSeq, performanceSeqs: seqs };
            else if (currentTab === "MEMO") payload = { tblSeq: billSeq, memoSeqList: seqs };
            else if (currentTab === "FILE_LIST") payload = { tblSeq: billSeq, fileMappSeqList: seqs };
            else payload = { invoiceSeq: billSeq, claimSeqs: seqs };

            batchDeleteMutation.mutate(payload as any, {
              onSuccess: () => {
                setIsRefresh(!isRefresh);
                setSelectedRow(null);
                setRowSelection({});
                setBottomRowSelection({});
                openAlert({ message: "삭제되었습니다.", confirmText: "확인" });
              },
              onError: () => {
                openAlert({ message: "삭제 중 오류가 발생했습니다.", confirmText: "확인" });
              },
            });
          }
        }
      }
    });
  };

  const handleRowClick = (row: any, extraRowData?: any, extra?: { isSelectColumn?: boolean }) => {
    if (extra?.isSelectColumn) return;

    const rowData = extraRowData || row.original || row;
    setSelectedRow(rowData);
    setClickedSection("top");

    const hasBankingSeq = !!rowData?.bankingSeq;
    const hasInvoiceClaimSeq = !!rowData?.invoiceClaimSeq;

    if (hasBankingSeq) {
      getBankingDetailMutation.mutate(rowData.bankingSeq, {
        onSuccess: (res) => {
          setEditData({ ...rowData, ...res.data });
          setEditModalOpen(true);
        },
        onError: () => {
          setEditData(rowData);
          setEditModalOpen(true);
        },
      });
    } else if (hasInvoiceClaimSeq) {
      const detailMutation = tabActice === "BILL_DETAIL" ? getAgentClaimDetailMutation : getClaimDetailMutation;
      detailMutation.mutate(rowData.invoiceClaimSeq, {
        onSuccess: (res) => {
          setEditData({ ...rowData, ...res.data });
          setEditModalOpen(true);
        },
        onError: () => {
          setEditData(rowData);
          setEditModalOpen(true);
        },
      });
    } else {
      setEditData(rowData);
      setEditModalOpen(true);
    }
  };

  const handleBottomRowClick = (row: any, extraRowData?: any, extra?: { isSelectColumn?: boolean }) => {
    if (extra?.isSelectColumn) return;

    const rowData = extraRowData || row.original || row;
    setSelectedRow(rowData);
    setClickedSection("bottom");

    const hasBankingSeq = !!rowData?.bankingSeq;
    const hasInvoiceClaimSeq = !!rowData?.invoiceClaimSeq;

    if (hasBankingSeq) {
      getBankingDetailMutation.mutate(rowData.bankingSeq, {
        onSuccess: (res) => {
          setEditData({ ...rowData, ...res.data });
          setEditModalOpen(true);
        },
        onError: () => {
          setEditData(rowData);
          setEditModalOpen(true);
        },
      });
    } else if (hasInvoiceClaimSeq) {
      const detailMutation = bottomTabActive === "OUR_BILL" ? getOurBillDetailMutation : getClaimDetailMutation;
      detailMutation.mutate(rowData.invoiceClaimSeq, {
        onSuccess: (res) => {
          setEditData({ ...rowData, ...res.data });
          setEditModalOpen(true);
        },
        onError: () => {
          setEditData(rowData);
          setEditModalOpen(true);
        },
      });
    } else {
      setEditData(rowData);
      setEditModalOpen(true);
    }
  };

  const onSuccess = () => {
    setIsBillDetailOpenModal(false);
    setIsRemittanceOpenModal(false);
    setIsOurBillOpenModal(false);
    setIsFileListOpenModal(false);
    setIsMemoOpenModal(false);
    setIsDistributeOpenModal(false);
    setIsDepositOpenModal(false);
    setEditModalOpen(false);
    setEditData(null);
    setIsRefresh((prev) => !prev);
  };

  const getEditModal = () => {
    if (!editData || !editModalOpen) return null;

    const isBottomSection = clickedSection === "bottom";
    const activeTab = isBottomSection ? bottomTabActive : tabActice;

    switch (activeTab) {
      case "BILL_DETAIL":
        return <BillDetailForeignModal open={editModalOpen} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setClickedSection(null); }} onSuccess={() => { setEditModalOpen(false); setClickedSection(null); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} propData={billSeq} editData={editData} title="대리인 청구내역 수정" />;
      case "OUR_BILL":
        return <BillDetailModal open={editModalOpen} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setClickedSection(null); }} onSuccess={() => { setEditModalOpen(false); setClickedSection(null); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} propData={billSeq} editData={editData} title="당소 청구내역 수정" />;
      case "REMITTANCE":
        return <BillRemittanceModal open={editModalOpen} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setClickedSection(null); }} onSuccess={() => { setEditModalOpen(false); setClickedSection(null); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} propData={billSeq} editData={editData} title="대리인 송금내역 수정" />;
      case "DEPOSIT":
        return <DepositModal open={editModalOpen} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setClickedSection(null); }} onSuccess={() => { setEditModalOpen(false); setClickedSection(null); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} propData={billSeq} editData={editData} title="입금내역 수정" showPrepayment={true} />;
      case "FILE_LIST":
        return <FileListModal open={editModalOpen} onOpenChange={setEditModalOpen} onSuccess={onSuccess} propData={billSeq} rowData={editData} title="전자포대 수정" />;
      case "MEMO":
        return <MemoModal open={editModalOpen} onOpenChange={setEditModalOpen} onSuccess={onSuccess} propData={billSeq} rowData={editData} title="메모 수정" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (billSeq) {
      getDetailData(tabActice);
      getDetailData(bottomTabActive);
    }
  }, [billSeq, isRefresh, tabActice, bottomTabActive, getDetailData]);

  return (
    <>
      <FormUnitBox vertical boxfull className="min-w-0">
        <FlatTab className="border-border-100 mb-2 border-b">
          <FlexBox className="flex-0">
            <FlatItem label="대리인청구내역" value="BILL_DETAIL" active={tabActice} onClick={() => tabClick("BILL_DETAIL")} />
            <FlatItem label="대리인송금내역" value="REMITTANCE" active={tabActice} onClick={() => tabClick("REMITTANCE")} />
            <FlatItem label="첨부서류" value="FILE_LIST" active={tabActice} onClick={() => tabClick("FILE_LIST")} />
            <FlatItem label="메모" value="MEMO" active={tabActice} onClick={() => tabClick("MEMO")} />
            <FlatItem label="실적분배" value="DISTRIBUTE" active={tabActice} onClick={() => tabClick("DISTRIBUTE")} />
          </FlexBox>
          <FlexBox className="w-auto flex-none">
            <Button variant="blue" size="h24" onClick={addReg}><Icons.Plus /> 추가</Button>
            <Button size="h24" variant="red" onClick={() => handleDelete("top")} disabled={Object.keys(rowSelection).filter(k => rowSelection[k]).length === 0}><Icons.Trash2 /> 삭제</Button>
          </FlexBox>
        </FlatTab>

        <div className="min-h-90">
          {tabActice === "BILL_DETAIL" && <DataTable data={billDetailList} columns={billDetailForeignCol} className="h-90" onRowClick={handleRowClick} enableRowSelection rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />}
          {tabActice === "REMITTANCE" && <DataTable data={remittanceList} columns={billRemittanceCol} className="h-90" onRowClick={handleRowClick} enableRowSelection rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />}
          {tabActice === "FILE_LIST" && <DataTable data={fileListList} columns={getFileListColumns(false)} className="h-90" onRowClick={handleRowClick} enableRowSelection rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />}
          {tabActice === "MEMO" && <DataTable data={memoList} columns={getMemoColumns(false)} className="h-90" onRowClick={handleRowClick} enableRowSelection rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />}
          {tabActice === "DISTRIBUTE" && (
            <DataTable
              data={distributeList || []}
              columns={getDistributeColumns(false)}
              className="h-90"
              enableRowSelection
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              onRowClick={handleRowClick}
            />
          )}
        </div>

        <FlexBox className="border-border-100 justify-between gap-0 border-b mt-6">
          <FlexBox className="gap-4">
            <FlatItem label="당소청구내역" value="OUR_BILL" active={bottomTabActive} onClick={() => bottomTabClick("OUR_BILL")} />
            <FlatItem label="입금내역" value="DEPOSIT" active={bottomTabActive} onClick={() => bottomTabClick("DEPOSIT")} />
          </FlexBox>
          <div className="flex gap-1">
            <Button size="h24" variant="blue" onClick={addBottomReg}><Icons.Plus /> 추가</Button>
            {/* <Button size="h24" onClick={handleEdit} disabled={Object.keys(bottomRowSelection).filter(k => bottomRowSelection[k]).length === 0}><Icons.PenLine /> 수정</Button> */}
            <Button size="h24" variant="red" onClick={() => handleDelete("bottom")} disabled={Object.keys(bottomRowSelection).filter(k => bottomRowSelection[k]).length === 0}><Icons.Trash2 /> 삭제</Button>
          </div>
        </FlexBox>

        <div className="min-h-90">
          {bottomTabActive === "OUR_BILL" && <DataTable data={ourBillList} columns={billDetailCol} className="h-90" onRowClick={handleBottomRowClick} enableRowSelection rowSelection={bottomRowSelection} onRowSelectionChange={setBottomRowSelection} />}
          {bottomTabActive === "DEPOSIT" && <DataTable data={depositList} columns={depositCol} className="h-90" onRowClick={handleBottomRowClick} enableRowSelection rowSelection={bottomRowSelection} onRowSelectionChange={setBottomRowSelection} />}
        </div>
      </FormUnitBox>

      {/* 모달 섹션 */}
      {isBillDetailOpenModal && <BillDetailForeignModal open={isBillDetailOpenModal} onOpenChange={setIsBillDetailOpenModal} onSuccess={onSuccess} propData={billSeq} title="대리인 청구내역 등록" />}
      {isRemittanceOpenModal && <BillRemittanceModal open={isRemittanceOpenModal} onOpenChange={setIsRemittanceOpenModal} onSuccess={onSuccess} propData={billSeq} title="대리인 송금내역 등록" />}
      {isOurBillOpenModal && <BillDetailModal open={isOurBillOpenModal} onOpenChange={setIsOurBillOpenModal} onSuccess={onSuccess} propData={billSeq} title="당소 청구내역 등록" />}
      {isFileListOpenModal && <FileListModal open={isFileListOpenModal} onOpenChange={setIsFileListOpenModal} onSuccess={onSuccess} propData={billSeq} title="전자포대 등록" />}
      {isMemoOpenModal && <MemoModal open={isMemoOpenModal} onOpenChange={setIsMemoOpenModal} onSuccess={onSuccess} propData={billSeq} title="메모 등록" />}
      {isDistributeOpenModal && (
        <DistributeModal
          open={isDistributeOpenModal}
          onOpenChange={setIsDistributeOpenModal}
          onSuccess={onSuccess}
          propData={billSeq}
          title="실적분배 등록"
          masterPerfAmount={Number(getValues("perfAmount") || 0)}
        />
      )}
      {isDepositOpenModal && <DepositModal open={isDepositOpenModal} onOpenChange={setIsDepositOpenModal} onSuccess={onSuccess} propData={billSeq} title="입금내역 등록" showPrepayment={true} />}

      {getEditModal()}
    </>
  );
};

export default BillDetailList;
