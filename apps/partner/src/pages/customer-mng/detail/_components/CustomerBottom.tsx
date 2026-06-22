import { BoxTab } from "@shared/ui/tab/ui/Tabs.tsx";
import { Button, DataTable, FlexBox, Icons } from "@repo/ui";
import { selectColumn } from "@shared/util/selectColumn";
import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { customerQueries } from "@shared/query/customer/queries";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import type {
  MandateListItem,
  ManagerListItem,
  HistoryListItem,
  MappingListItem,
} from "@shared/api/customer/customerApi";
import type { ColumnDef } from "@tanstack/react-table";
import { MandateModal } from "../../common/modal/MandateModal";
import { ManagerModal } from "../../common/modal/ManagerModal";
import { HistoryModal } from "../../common/modal/HistoryModal";
import { MappingModal } from "../../common/modal/MappingModal";
import { MemoModal } from "@pages/common/bottom/modal/MemoModal.tsx";
import { FileListModal } from "@pages/common/bottom/modal/FileListModal.tsx";
import { getFileListColumns } from "@pages/common/bottom/modal/columns/FileListCol.tsx";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { formatDate, formatAppNo } from "@shared/util/formatUtil";

const tabs = [
{ label: "포괄위임", value: "MANDATE" },
{ label: "담당자", value: "MANAGER" },
{ label: "변경사항", value: "HISTORY" },
{ label: "메모", value: "MEMO" },
{ label: "전자포대", value: "FILE" },
{ label: "관련고객", value: "MAPPING" },
];




// --- [수정] 메모 컬럼 정의 (JSON 키값 반영) ---
const memoColumns: ColumnDef<any>[] = [
  selectColumn<any>(36),
{ accessorKey: "memoTitle", header: "제목", size: 200 },
{ accessorKey: "note", header: "내용", size: 400 },
{ accessorKey: "memoUserName", header: "작성자", size: 120 },
{
accessorKey: "memoRegDate",
header: "작성일",
size: 120,
cell: ({ getValue }) => <div>{formatDate(getValue())}</div>
},
];

// 기존 컬럼들 (유지)
const mandateColumns: ColumnDef<MandateListItem>[] = [
  selectColumn<MandateListItem>(36),
{ accessorKey: "mandateWrapperNo", header: "위임번호", size: 150, cell: ({ getValue }) => <div>{formatAppNo(getValue())}</div> },
{ accessorKey: "mandateDate", header: "위임일자", size: 120, cell: ({ getValue }) => <div>{formatDate(getValue())}</div> },
{ accessorKey: "mandateRange", header: "위임구분", size: 120 },
{ accessorKey: "note", header: "비고", size: 200 },
];

const managerColumns: ColumnDef<ManagerListItem>[] = [
  selectColumn<ManagerListItem>(36),
{ accessorKey: "userNameKo", header: "담당자명", size: 120 },
{ accessorKey: "deptName", header: "부서", size: 120 },
{ accessorKey: "userPosition", header: "직책", size: 100 },
{ accessorKey: "userTelNo", header: "전화", size: 150 },
{ accessorKey: "userEmail", header: "이메일", size: 200 },
];

const historyColumns: ColumnDef<HistoryListItem>[] = [
  selectColumn<HistoryListItem>(36),
{ accessorKey: "actionDateTime", header: "변경일시", size: 160, cell: ({ getValue }) => <div>{formatDate(getValue())}</div> },
{ accessorKey: "fieldName", header: "변경항목", size: 150 },
{ accessorKey: "beforeValue", header: "변경전", size: 120 },
{ accessorKey: "afterValue", header: "변경후", size: 300 },
{ accessorKey: "actionUser", header: "변경자", size: 100 },
];

const mappingColumns: ColumnDef<MappingListItem>[] = [
  selectColumn<MappingListItem>(36),
{ accessorKey: "relatedCustomerName", header: "고객사명", size: 200 },
{ accessorKey: "relationCode", header: "관계유형", size: 120 },
{ accessorKey: "note", header: "비고", size: 300 },
];

type CustomerBottomProps = {
  customerSeq?: string;
  onSaveAndProceed?: (tabValue: string) => void;
};

const CustomerBottom = ({ customerSeq, onSaveAndProceed }: CustomerBottomProps) => {
  const { openAlert } = useAlertStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("MANDATE");

  useEffect(() => {
    const openTab = searchParams.get("openTab");
    if (openTab && customerSeq) {
      setActiveTab(openTab);
      setModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [customerSeq, searchParams, setSearchParams]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [editData, setEditData] = useState<any>(null);

  const [mandateList, setMandateList] = useState<MandateListItem[]>([]);
  const [managerList, setManagerList] = useState<ManagerListItem[]>([]);
  const [historyList, setHistoryList] = useState<HistoryListItem[]>([]);
  const [mappingList, setMappingList] = useState<MappingListItem[]>([]);
  const [memoList, setMemoList] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  const mandateListMutation = useMutation(customerQueries.mandateList());
  const managerListMutation = useMutation(customerQueries.managerList());
  const historyListMutation = useMutation(customerQueries.historyList());
  const mappingListMutation = useMutation(customerQueries.mappingList());

  const deleteMandateMutation = useMutation(customerQueries.deleteMandate());
  const deleteManagerMutation = useMutation(customerQueries.deleteManager());
  const deleteHistoryMutation = useMutation(customerQueries.deleteHistory());
  const deleteMappingMutation = useMutation(customerQueries.deleteMapping());

  const deleteMandateListMutation = useMutation(customerQueries.deleteMandateList());
  const deleteManagerListMutation = useMutation(customerQueries.deleteManagerList());
  const deleteMappingListMutation = useMutation(customerQueries.deleteMappingList());
  const deleteHistoryListMutation = useMutation(customerQueries.deleteHistoryList());

  const mandateDetailMutation = useMutation(customerQueries.mandateDetail());
  const managerDetailMutation = useMutation(customerQueries.managerDetail());
  const historyDetailMutation = useMutation(customerQueries.historyDetail());
  const mappingDetailMutation = useMutation(customerQueries.mappingDetail());

  const memoListMutation = useMutation(bottomQueries.getMemoList());
  const fileListMutation = useMutation(bottomQueries.getFileListList());
  const multiDeleteMemoMutation = useMutation(bottomQueries.multiDeleteMemo());
  const multiDeleteFileListMutation = useMutation(bottomQueries.multiDeleteFileList());

  const loadTabData = useCallback((tabValue: string) => {
    if (!customerSeq) return;

    switch (tabValue) {
      case "MANDATE":
        mandateListMutation.mutate(customerSeq, { onSuccess: (res) => setMandateList(res.data || []) });
        break;
      case "MANAGER":
        managerListMutation.mutate(customerSeq, { onSuccess: (res) => setManagerList(res.data || []) });
        break;
      case "HISTORY":
        historyListMutation.mutate(customerSeq, { onSuccess: (res) => setHistoryList(res.data || []) });
        break;
      case "MAPPING":
        mappingListMutation.mutate(customerSeq, { onSuccess: (res) => setMappingList(res.data || []) });
        break;
      case "MEMO":
        //   1. res.data.list 로 수정
        memoListMutation.mutate(customerSeq, { onSuccess: (res) => setMemoList(res.data?.list || []) });
        break;
      case "FILE":
        //   2. res.data.list 로 수정
        fileListMutation.mutate(customerSeq, { onSuccess: (res) => setFileList(res.data?.list || []) });
        break;
    }
  }, [customerSeq]);

  useEffect(() => {
    if (customerSeq) {
      setRowSelection({});
      setSelectedRows([]);
      setSelectedRow(null);
      loadTabData(activeTab);
    }
  }, [customerSeq, activeTab, isRefresh, loadTabData]);

  const renderTable = () => {
    const commonProps = {
      enableRowSelection: true,
      rowSelection,
      onRowSelectionChange: setRowSelection,
      getSelectedRow: (items: any[]) => setSelectedRows(items),
      onRowClick: handleRowClick,
      // 국내/해외 상세 하단탭과 동일한 높이로 통일 (CustomBottom 의 height={300})
      height: 300,
    };

    switch (activeTab) {
      case "MANDATE": return <DataTable data={mandateList} columns={mandateColumns} isLoading={mandateListMutation.isPending} {...commonProps} />;
      case "MANAGER": return <DataTable data={managerList} columns={managerColumns} isLoading={managerListMutation.isPending} {...commonProps} />;
      case "HISTORY": return <DataTable data={historyList} columns={historyColumns} isLoading={historyListMutation.isPending} {...commonProps} />;
      case "MAPPING": return <DataTable data={mappingList} columns={mappingColumns} isLoading={mappingListMutation.isPending} {...commonProps} />;
      case "MEMO": return <DataTable data={memoList} columns={memoColumns} isLoading={memoListMutation.isPending} {...commonProps} />;
      case "FILE": return <DataTable data={fileList} columns={getFileListColumns(false) as any} isLoading={fileListMutation.isPending} {...commonProps} />;
      default: return null;
    }
  };

  const handleDelete = async () => {
    const getSeqKey = (tab: string) => {
      switch (tab) {
        case "MANDATE": return "wrappermandateSeq";
        case "MANAGER": return "participantSeq";
        case "HISTORY": return "modifiedHistSeq";
        case "MAPPING": return "customerMappSeq";
        case "MEMO": return "memoSeq";
        case "FILE": return "fileMappSeq";
        default: return "";
      }
    };

    const getDeleteMutation = (tab: string) => {
      switch (tab) {
        case "MANDATE": return deleteMandateListMutation;
        case "MANAGER": return deleteManagerListMutation;
        case "HISTORY": return deleteHistoryListMutation;
        case "MAPPING": return deleteMappingListMutation;
        case "MEMO": return multiDeleteMemoMutation;
        case "FILE": return multiDeleteFileListMutation;
        default: return null;
      }
    };

    const selectedItems = selectedRows.length > 0 ? selectedRows : (selectedRow ? [selectedRow] : []);
    if (selectedItems.length === 0) {
      openAlert({ message: "삭제할 항목을 선택해주세요.", confirmText: "확인" });
      return;
    }

    const seqKey = getSeqKey(activeTab);
    const deleteMutation = getDeleteMutation(activeTab);
    if (!deleteMutation) return;

    openAlert({
      message: `${selectedItems.length}개 항목을 삭제하시겠습니까?`,
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: () => {
        const seqList = selectedItems.map(item => {
          const data = item.original || item;
          return data[seqKey] || data["modifiedHistSeq"] || data["seq"] || data["historySeq"] || data.id;
        }).filter(Boolean);

        if (seqList.length === 0) {
          openAlert({ message: "삭제할 데이터의 식별키를 찾지 못했습니다.", confirmText: "확인" });
          return;
        }

        if (activeTab === "FILE" || activeTab === "MEMO") {
          const payload = activeTab === "FILE"
            ? { tblSeq: customerSeq!, fileMappSeqList: seqList }
            : { tblSeq: customerSeq!, memoSeqList: seqList };

          deleteMutation.mutate(payload as any, {
            onSuccess: () => {
              setIsRefresh(!isRefresh);
              setSelectedRow(null);
              setSelectedRows([]);
              openAlert({ message: "삭제가 완료되었습니다.", confirmText: "확인" });
            },
            onError: () => {
              openAlert({ message: "삭제 중 오류가 발생했습니다.", confirmText: "확인" });
            },
          });
        } else if (activeTab === "MANDATE" || activeTab === "MANAGER" || activeTab === "MAPPING" || activeTab === "HISTORY") {
          // 일괄 삭제 지원 탭
          deleteMutation.mutate(seqList, {
            onSuccess: () => {
              setIsRefresh(!isRefresh);
              setSelectedRow(null);
              setSelectedRows([]);
              openAlert({ message: "삭제가 완료되었습니다.", confirmText: "확인" });
            },
            onError: () => {
              openAlert({ message: "삭제 중 오류가 발생했습니다.", confirmText: "확인" });
            },
          });
        } else {
          // 기타 벌크 미지원 단건 처리의 경우 (현재는 모두 벌크 치환됨)
          Promise.all(seqList.map(seq => deleteMutation.mutateAsync(seq)))
            .then(() => {
              setIsRefresh(!isRefresh);
              setSelectedRow(null);
              setSelectedRows([]);
              openAlert({ message: "삭제가 완료되었습니다.", confirmText: "확인" });
            })
            .catch(() => {
              openAlert({ message: "삭제 중 오류가 발생했습니다.", confirmText: "확인" });
            });
        }
      }
    });
  };

  const handleRowClick = async (row: any, extraRowData?: any, extra?: { isSelectColumn?: boolean }) => {
    // Skip if click was on select column (checkbox)
    if (extra?.isSelectColumn) return;

    const rowId = row?.original?.wrappermandateSeq || row?.original?.participantSeq || row?.original?.seq || row?.original?.customerMappSeq || JSON.stringify(row.original);

    const rowData = extraRowData || row.original || row;

    // Get seq key for current tab
    const getSeqKey = (tab: string) => {
      switch (tab) {
        case "MANDATE": return "wrappermandateSeq";
        case "MANAGER": return "participantSeq";
        case "HISTORY": return "seq";
        case "MAPPING": return "customerMappSeq";
        default: return "";
      }
    };

    const seqKey = getSeqKey(activeTab);
    const seq = rowData[seqKey];

    // For tabs without detail API or no seq, just open modal with row data
    if (!seq || activeTab === "MEMO" || activeTab === "FILE") {
      setSelectedRow(rowData);
      setEditData(rowData);
      setEditModalOpen(true);
      return;
    }

    // Get detail mutation based on tab
    const getDetailMutation = (tab: string) => {
      switch (tab) {
        case "MANDATE": return mandateDetailMutation;
        case "MANAGER": return managerDetailMutation;
        case "HISTORY": return historyDetailMutation;
        case "MAPPING": return mappingDetailMutation;
        default: return null;
      }
    };

    const detailMutation = getDetailMutation(activeTab);
    setSelectedRow(rowData);

    if (detailMutation) {
      detailMutation.mutate(seq, {
        onSuccess: (res) => {
          const detailData = res.data?.data || res.data || res;
          const mergedData = { ...rowData, ...detailData };
          setEditData(mergedData);
          // Use setTimeout to ensure state is updated before modal opens
          setTimeout(() => {
            setEditModalOpen(true);
          }, 0);
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

  return (
    <>
      <BoxTab items={tabs} active={activeTab} className="mt-4" onClick={(v) => setActiveTab(v)} />
      <FlexBox className="justify-between py-3">
        <FlexBox className="text-text-200 items-center text-sm">* 상세 정보를 확인하고 관리할 수 있습니다.</FlexBox>
        <FlexBox className="flex-0">
          <Button
            variant="blue"
            size="h28"
            onClick={() => {
              if (!customerSeq) {
                if (onSaveAndProceed) {
                  onSaveAndProceed(activeTab);
                } else {
                  openAlert({
                    message: "마스터 정보를 먼저 등록해주세요",
                    confirmText: "확인",
                  });
                }
                return;
              }
              setSelectedRow(null);
              setEditData(null);
              setModalOpen(true);
            }}
          >
            <Icons.Plus /> 추가
          </Button>
          {/* <Button
            size="h28"
            onClick={() => {
              if (selectedRows.length === 1) {
                handleRowClick(null, selectedRows[0]);
              }
            }}
            disabled={selectedRows.length !== 1}
          >
            <Icons.PenLine /> 수정
          </Button> */}
          <Button
            size="h28"
            variant="red"
            onClick={handleDelete}
            disabled={selectedRows.length === 0}
          >
            <Icons.Trash2 /> 삭제
          </Button>
        </FlexBox>
      </FlexBox>
      {renderTable()}

      {/* 추가 모달 */}
      {modalOpen && (
        <>
          {activeTab === "MANDATE" && <MandateModal open={modalOpen} onOpenChange={setModalOpen} propData={customerSeq} onSuccess={() => { setModalOpen(false); setIsRefresh(!isRefresh); }} />}
          {activeTab === "MANAGER" && <ManagerModal open={modalOpen} onOpenChange={setModalOpen} propData={customerSeq} onSuccess={() => { setModalOpen(false); setIsRefresh(!isRefresh); }} />}
          {activeTab === "HISTORY" && <HistoryModal open={modalOpen} onOpenChange={setModalOpen} propData={customerSeq} onSuccess={() => { setModalOpen(false); setIsRefresh(!isRefresh); }} />}
          {activeTab === "MAPPING" && <MappingModal open={modalOpen} onOpenChange={setModalOpen} propData={customerSeq} onSuccess={() => { setModalOpen(false); setIsRefresh(!isRefresh); }} />}
          {activeTab === "MEMO" && <MemoModal open={modalOpen} onOpenChange={setModalOpen} propData={customerSeq} onSuccess={() => { setModalOpen(false); setIsRefresh(!isRefresh); }} title="고객 메모 등록" />}
          {activeTab === "FILE" && <FileListModal open={modalOpen} onOpenChange={setModalOpen} propData={customerSeq} onSuccess={() => { setModalOpen(false); setIsRefresh(!isRefresh); }} title="고객 전자포대 등록" />}
        </>
      )}

      {/* 상세/수정 모달 */}
      {editModalOpen && (selectedRow || editData) && (
        <>
          {activeTab === "MANDATE" && <MandateModal open={editModalOpen} onOpenChange={setEditModalOpen} propData={customerSeq} editData={editData} title="포괄위임 수정" onSuccess={() => { setEditModalOpen(false); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} />}
          {activeTab === "MANAGER" && <ManagerModal open={editModalOpen} onOpenChange={setEditModalOpen} propData={customerSeq} editData={editData} title="담당자 수정" onSuccess={() => { setEditModalOpen(false); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} />}
          {activeTab === "HISTORY" && <HistoryModal open={editModalOpen} onOpenChange={setEditModalOpen} propData={customerSeq} editData={editData} title="변경사항 수정" onSuccess={() => { setEditModalOpen(false); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} />}
          {activeTab === "MAPPING" && <MappingModal open={editModalOpen} onOpenChange={setEditModalOpen} propData={customerSeq} editData={editData} title="관련고객 수정" onSuccess={() => { setEditModalOpen(false); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} />}
          {activeTab === "MEMO" && <MemoModal open={editModalOpen} onOpenChange={setEditModalOpen} propData={customerSeq} rowData={editData} title="고객 메모 수정" onSuccess={() => { setEditModalOpen(false); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} />}
          {activeTab === "FILE" && <FileListModal open={editModalOpen} onOpenChange={setEditModalOpen} propData={customerSeq} rowData={editData} title="고객 전자포대 수정" onSuccess={() => { setEditModalOpen(false); setIsRefresh(!isRefresh); setSelectedRow(null); setEditData(null); }} />}
        </>
      )}
    </>
  );
};

export default CustomerBottom;
