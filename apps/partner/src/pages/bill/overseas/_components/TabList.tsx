import { Button, Checkbox, DataTable, FlexBox, Icons } from "@repo/ui";

export type Payment = { id: string; amount: number; status: string; email: string };
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import FlatItem from "@shared/ui/tab/ui/FlatItem";
import { FlatTab } from "@shared/ui/tab/ui/Tabs";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { billDetailCol } from "@pages/bill/domestic/columns/BillDetailCol.tsx";
import { useMutation } from "@tanstack/react-query";
import { billTabsQueries } from "@shared/query/bill/billTabsQueries.ts"; //   공통 탭 쿼리 사용

import { useParams, useSearchParams } from "react-router-dom";
import { BillDetailModal } from "@pages/bill/common/modal/BillDetailModal";
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
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { useFormContext } from "react-hook-form";

const BillDetailList = ({ onSaveAndProceed }: { onSaveAndProceed?: (tabValue: string) => void }) => {
  const { billSeq } = useParams<{ billSeq: string | undefined }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openAlert } = useAlertStore();
  const { setValue, getValues } = useFormContext();

  const [tabActice, setTabActice] = useState<string>("BILL_DETAIL");

  useEffect(() => {
    const openTab = searchParams.get("openTab");
    if (openTab && billSeq) {
      if (["BILL_DETAIL", "FILE_LIST", "MEMO", "DISTRIBUTE"].includes(openTab)) {
        setTabActice(openTab);
        setTimeout(() => {
          if (openTab === "BILL_DETAIL") setIsBillDetailOpenModal(true);
          else if (openTab === "FILE_LIST") setIsFileListOpenModal(true);
          else if (openTab === "MEMO") setIsMemoOpenModal(true);
          else if (openTab === "DISTRIBUTE") setIsDistributeOpenModal(true);
        }, 100);
      } else if (openTab === "DEPOSIT") {
        setBottomTabActive("DEPOSIT");
        setTimeout(() => {
          setIsDepositOpenModal(true);
        }, 100);
      }
      
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("openTab");
      setSearchParams(newParams, { replace: true });
    }
  }, [billSeq, searchParams, setSearchParams]);
  const [bottomTabActive, setBottomTabActive] = useState<string>("DEPOSIT");
  const [isRefresh, setIsRefresh] = useState(false);

  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [bottomRowSelection, setBottomRowSelection] = useState<Record<string, boolean>>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [clickedSection, setClickedSection] = useState<"top" | "bottom" | null>(null);

  // 데이터 상태
  const [billDetailList, setBillDetailList] = useState<any[]>([]);
  const [fileListList, setFileListList] = useState<FileItemListResponseType[]>([]);
  const [memoList, setMemoList] = useState<MemoItemType[]>([]);
  const [distributeList, setDistributeList] = useState<any[]>([]);
  const [depositList, setDepositList] = useState<any[]>([]);

  //   [신규] 대리인 청구내역 기반 요약 정보 자동 업데이트
  useEffect(() => {
    if (billDetailList.length > 0) {
      let gov = 0, agency = 0, vat = 0, trans = 0, etc = 0;
      billDetailList.forEach(item => {
        const amount = Number(item.unitPrice || 0);
        const code = item.costCategory?.code;
        if (code === "10") gov += amount;
        else if (code === "20") agency += amount;
        else if (code === "30") vat += amount;
        else if (code === "40") trans += amount;
        else if (code === "50") etc += amount;
      });
      setValue("foreignGovFee", String(gov));
      setValue("foreignAgencyFee", String(agency));
      setValue("foreignVat", String(vat));
      setValue("foreignTransFee", String(trans));
      setValue("foreignEtcFee", String(etc));
    }
  }, [billDetailList, setValue]);

  //   [신규] 입금내역 기반 입금액 자동 업데이트
  useEffect(() => {
    if (depositList.length > 0) {
      const totalDep = depositList.reduce((acc, cur) => acc + Number(cur.totalAmount || 0), 0);
      setValue("depAmount", String(totalDep));
    }
  }, [depositList, setValue]);

  //   API Mutations (공통 쿼리로 교체)
  const getBillDetailMutation = useMutation(billTabsQueries.getClaimList());
  const getFileListMutation = useMutation(bottomQueries.getFileListList());
  const getMemoMutation = useMutation(bottomQueries.getMemoList());
  const getDistributeMutation = useMutation(bottomQueries.getDistributeList());
  const getBankingMutation = useMutation(billTabsQueries.getBankingList());

  const deleteClaimMutation = useMutation(billTabsQueries.deleteClaim());
  const deleteBankingMutation = useMutation(billTabsQueries.deleteBanking());
  const deleteClaimListMutation = useMutation(billTabsQueries.deleteClaimList());
  const deleteBankingListMutation = useMutation(billTabsQueries.deleteBankingList());
  const deletePerformanceListMutation = useMutation(billTabsQueries.deletePerformanceList());
  const deleteMemoListMutation = useMutation(bottomQueries.multiDeleteMemo());
  const deleteFileListMutation = useMutation(bottomQueries.multiDeleteFileList());

  const getClaimDetailMutation = useMutation(billTabsQueries.getClaimDetail());
  const getBankingDetailMutation = useMutation(billTabsQueries.getBankingDetail());

  // 모달 상태
  const [isBillDetailOpenModal, setIsBillDetailOpenModal] = useState(false);
  const [isFileListOpenModal, setIsFileListOpenModal] = useState(false);
  const [isMemoOpenModal, setIsMemoOpenModal] = useState(false);
  const [isDistributeOpenModal, setIsDistributeOpenModal] = useState(false);
  const [isDepositOpenModal, setIsDepositOpenModal] = useState(false);

  //   데이터 조회 함수 (무한 루프 방지 처리)
  const getDetailData = useCallback((detailType: string) => {
    if (!billSeq) return;

    const payload = { tblSeq: billSeq };

    switch (detailType) {
      case "BILL_DETAIL":
        getBillDetailMutation.mutate(payload, {
          onSuccess: (res) => setBillDetailList(res.data.list || []),
        });
        break;
      case "FILE_LIST":
        getFileListMutation.mutate(billSeq, {
          onSuccess: (res) => setFileListList(res.data.list || []),
        });
        break;
      case "MEMO":
        getMemoMutation.mutate(billSeq, {
          onSuccess: (res) => setMemoList(res.data.list || [])
        });
        break;
      case "DISTRIBUTE":
        getDistributeMutation.mutate({ tblSeq: billSeq, page: 1, pageSize: 100 }, {
          onSuccess: (res) => setDistributeList(res.data.list || [])
        });
        break;
      case "DEPOSIT":
        getBankingMutation.mutate(payload, {
          onSuccess: (res) => setDepositList((res.data.list || []).filter((b: any) => b.bankingCategory === "10")),
        });
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billSeq]);

  const tabClick = (value: string) => {
    setTabActice(value);
    setRowSelection({}); // Reset selection on tab change
    getDetailData(value);
  };

  const addReg = () => {
    if (!billSeq) {
      if (onSaveAndProceed) {
        onSaveAndProceed(tabActice);
      } else {
        openAlert({
          message: "마스터 정보를 먼저 등록해주세요",
          confirmText: "확인",
        });
      }
      return;
    }
    if (tabActice === "BILL_DETAIL") setIsBillDetailOpenModal(true);
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

  const getSeqKey = (tab: string) => {
    switch (tab) {
      case "BILL_DETAIL": return "invoiceClaimSeq";
      case "DEPOSIT": return "bankingSeq";
      case "MEMO": return "memoSeq";
      case "FILE_LIST": return "fileMappSeq";
      case "DISTRIBUTE": return "performanceSeq";
      default: return "";
    }
  };

  const getBatchDeleteMutation = (tab: string) => {
    switch (tab) {
      case "BILL_DETAIL": return deleteClaimListMutation;
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
      ? depositList
      : (tabActice === "BILL_DETAIL" ? billDetailList
          : (tabActice === "DISTRIBUTE" ? distributeList
          : (tabActice === "MEMO" ? memoList
          : (tabActice === "FILE_LIST" ? fileListList : []))));

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
        const seqKey = getSeqKey(currentTab);

        if (batchDeleteMutation) {
          const seqs = selectedItems.map(item => item[seqKey]).filter(Boolean);
          if (seqs.length > 0) {
            let payload: any = { invoiceSeq: billSeq };
            if (currentTab === "DEPOSIT") payload = { invoiceSeq: billSeq, bankingSeqs: seqs };
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
    // Skip if click was on select column (checkbox)
    if (extra?.isSelectColumn) return;

    const rowData = extraRowData || row.original || row;
    setSelectedRow(rowData);
    setClickedSection("top");

    const hasInvoiceClaimSeq = !!rowData?.invoiceClaimSeq;
    const hasBankingSeq = !!rowData?.bankingSeq;

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
      getClaimDetailMutation.mutate(rowData.invoiceClaimSeq, {
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
    } else {
      setEditData(rowData);
      setEditModalOpen(true);
    }
  };

  const handleEdit = () => {
    if (!selectedRow) return;

    const isBottomSection = clickedSection === "bottom";

    const hasInvoiceClaimSeq = !!selectedRow?.invoiceClaimSeq;
    const hasBankingSeq = !!selectedRow?.bankingSeq;

    if (isBottomSection || hasBankingSeq) {
      getBankingDetailMutation.mutate(selectedRow.bankingSeq, {
        onSuccess: (res) => {
          setEditData({ ...selectedRow, ...res.data });
          setEditModalOpen(true);
        },
        onError: () => {
          setEditData(selectedRow);
          setEditModalOpen(true);
        },
      });
    } else if (hasInvoiceClaimSeq) {
      getClaimDetailMutation.mutate(selectedRow.invoiceClaimSeq, {
        onSuccess: (res) => {
          setEditData({ ...selectedRow, ...res.data });
          setEditModalOpen(true);
        },
        onError: () => {
          setEditData(selectedRow);
          setEditModalOpen(true);
        },
      });
    } else if (tabActice === "BILL_DETAIL") {
      const seqKey = getSeqKey(tabActice);
      const seq = selectedRow[seqKey];
      if (!seq) {
        setEditModalOpen(true);
        return;
      }
      getClaimDetailMutation.mutate(seq, {
        onSuccess: (res) => {
          setEditData({ ...selectedRow, ...res.data });
          setEditModalOpen(true);
        },
        onError: () => {
          setEditData(selectedRow);
          setEditModalOpen(true);
        },
      });
    } else {
      setEditData(selectedRow);
      setEditModalOpen(true);
    }
  };

  const getEditModal = () => {
    if (!editData || !editModalOpen) return null;

    const hasBankingSeq = !!editData?.bankingSeq;

    if (hasBankingSeq) {
      return <DepositModal open={editModalOpen} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setClickedSection(null); }} onSuccess={() => { setEditModalOpen(false); setClickedSection(null); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} propData={billSeq} editData={editData} title="입금내역 수정" />;
    }

    switch (tabActice) {
      case "BILL_DETAIL":
        return <BillDetailModal open={editModalOpen} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setClickedSection(null); }} onSuccess={() => { setEditModalOpen(false); setClickedSection(null); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} propData={billSeq} editData={editData} title="청구내역 수정" />;
      case "FILE_LIST":
        return <FileListModal open={editModalOpen} onOpenChange={setEditModalOpen} onSuccess={onSuccess} propData={billSeq} rowData={editData} title="전자포대 수정" />;
      case "MEMO":
        return <MemoModal open={editModalOpen} onOpenChange={setEditModalOpen} onSuccess={onSuccess} propData={billSeq} rowData={editData} title="메모 수정" />;
      case "DISTRIBUTE":
        return null;
      default:
        return <BillDetailModal open={editModalOpen} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setClickedSection(null); }} onSuccess={() => { setEditModalOpen(false); setClickedSection(null); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} propData={billSeq} editData={editData} title="청구내역 수정" />;
    }
  };

  const onSuccess = (rtnData: any) => {
    setIsBillDetailOpenModal(false);
    setIsFileListOpenModal(false);
    setIsMemoOpenModal(false);
    setIsDistributeOpenModal(false);
    setIsDepositOpenModal(false);
    setEditModalOpen(false);
    setEditData(null);

    setIsRefresh((prev) => !prev);
  };

  // 현재 탭 및 입금내역 재조회
  useEffect(() => {
    if (billSeq) {
      getDetailData(tabActice);
      getDetailData("DEPOSIT");
    }
  }, [billSeq, isRefresh, tabActice, getDetailData]);

  return (
    <>
      <FormUnitBox vertical boxfull className="min-w-0">
        <FlatTab className="border-border-100 mb-2 border-b">
          <FlexBox className="flex-0">
            <FlatItem label="청구내역" value="BILL_DETAIL" active={tabActice} onClick={() => tabClick("BILL_DETAIL")} />
            <FlatItem label="첨부서류" value="FILE_LIST" active={tabActice} onClick={() => tabClick("FILE_LIST")} />
            <FlatItem label="메모" value="MEMO" active={tabActice} onClick={() => tabClick("MEMO")} />
            <FlatItem label="실적분배" value="DISTRIBUTE" active={tabActice} onClick={() => tabClick("DISTRIBUTE")} />
          </FlexBox>

          <FlexBox className="w-auto flex-none gap-1">
            <Button variant="blue" size="h24" onClick={addReg}><Icons.Plus /> 추가</Button>
            <Button size="h24" variant="red" onClick={() => handleDelete("top")} disabled={Object.keys(rowSelection).filter(k => rowSelection[k]).length === 0}><Icons.Trash2 /> 삭제</Button>
          </FlexBox>
        </FlatTab>

        <div className="min-h-90">
          {tabActice === "BILL_DETAIL" && <DataTable data={billDetailList} columns={billDetailCol} className="h-90" onRowClick={handleRowClick} enableRowSelection rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />}
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
            <FlatItem label="입금내역" value="DEPOSIT" active={bottomTabActive} onClick={() => setBottomTabActive("DEPOSIT")} />
          </FlexBox>
          <div className="flex gap-1">
            <Button
              size="h24"
              variant="blue"
              onClick={() => {
                if (!billSeq) {
                  if (onSaveAndProceed) {
                    onSaveAndProceed("DEPOSIT");
                  } else {
                    openAlert({
                      message: "마스터 정보를 먼저 등록해주세요",
                      confirmText: "확인",
                    });
                  }
                  return;
                }
                setIsDepositOpenModal(true);
              }}
            >
              <Icons.Plus /> 추가
            </Button>
            {/* <Button size="h24" onClick={handleEdit} disabled={Object.keys(bottomRowSelection).filter(k => bottomRowSelection[k]).length === 0}><Icons.PenLine /> 수정</Button> */}
            <Button size="h24" variant="red" onClick={() => handleDelete("bottom")} disabled={Object.keys(bottomRowSelection).filter(k => bottomRowSelection[k]).length === 0}><Icons.Trash2 /> 삭제</Button>
          </div>
        </FlexBox>

        <DataTable data={depositList} columns={depositCol} className="h-90" onRowClick={handleBottomRowClick} enableRowSelection rowSelection={bottomRowSelection} onRowSelectionChange={setBottomRowSelection} />
      </FormUnitBox>

      {/* 모달 섹션 */}
      {isBillDetailOpenModal && (
        <BillDetailModal open={isBillDetailOpenModal} onOpenChange={setIsBillDetailOpenModal} onSuccess={onSuccess} propData={billSeq} title="청구내역 등록" />
      )}
      {isFileListOpenModal && (
        <FileListModal open={isFileListOpenModal} onOpenChange={setIsFileListOpenModal} onSuccess={onSuccess} propData={billSeq} title="전자포대 등록" />
      )}
      {isMemoOpenModal && (
        <MemoModal open={isMemoOpenModal} onOpenChange={setIsMemoOpenModal} onSuccess={onSuccess} propData={billSeq} title="메모 등록" />
      )}
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
      {isDepositOpenModal && (
        <DepositModal open={isDepositOpenModal} onOpenChange={setIsDepositOpenModal} onSuccess={onSuccess} propData={billSeq} title="입금내역 등록" />
      )}

      {getEditModal()}
    </>
  );
};

export default BillDetailList;
