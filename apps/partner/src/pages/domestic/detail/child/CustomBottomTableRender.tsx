import React, { useEffect, useState } from "react";
import { DataTable, InfiniteDataTable } from "@repo/ui";
import { getProgessColumns } from "@pages/common/bottom/modal/columns/ProgressCol.tsx";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import type {
  ClaimItemListResponseType,
  CostItemResponseType,
  FileItemListResponseType,
  GracePeriodItemResponseType,
  IdsRequestItem,
  LocarItemListResponseType,
  MaintenanceRequestItem,
  MemoItemType,
  OverseasItemListResponseType,
  PreferenceType,
  ProductItemListResponseType,
  ProgressItemType,
  RenewalItemListResponseType,
  RequiredDocRequestItem,
  RequiredDocsRequestType,
  RndType,
} from "@shared/api/common/commBottomApi.ts";
import { getCostColumns } from "@pages/common/bottom/modal/columns/CostCol.tsx";
import { getGracePeriodColumns } from "@pages/common/bottom/modal/columns/GracePeriodCol.tsx";
import { getPreferenceColumns } from "@pages/common/bottom/modal/columns/PreferenceCol.tsx";
import { getMemoColumns } from "@pages/common/bottom/modal/columns/MemoCol.tsx";
import { getRndColumns } from "@pages/common/bottom/modal/columns/RndCol.tsx";
import { getFileListColumns } from "@pages/common/bottom/modal/columns/FileListCol.tsx";
import { getRenewalColumns } from "@pages/common/bottom/modal/columns/RenewalCol.tsx";
import { getProductColumns } from "@pages/common/bottom/modal/columns/ProductCol.tsx";
import { getOverseasColumns } from "@pages/common/bottom/modal/columns/OverseasCol.tsx";
import { getName, RIGHT_TYPE } from "@shared/enum/domesticType.ts";
import { useNavigate } from "react-router-dom";
import { getLocarColumns } from "@pages/common/bottom/modal/columns/LeCarCol.tsx";
import { getClaimColumns } from "@pages/common/bottom/modal/columns/ClaimCol.tsx";
import { getHardSummaryColumns } from "@pages/common/bottom/modal/columns/HardSummaryCol.tsx";
import { getIdsColumns } from "@pages/common/bottom/modal/columns/IdsCol.tsx";
import { getRequiredDocColumns } from "@pages/common/bottom/modal/columns/RequiredDocsCol.tsx";
import { getMaintenanceColumns } from "@pages/common/bottom/modal/columns/MaintenanceCol.tsx";

type Props = {
  activeTab: string;
  tblSeq?: string;
  addRowTrigger?: number;
  saveTrigger?: number;
  isRefresh?: boolean;
  height?: number | string;
  onRowClick?: (tab: string, rowData: any) => void;
  onSelectedRowsChange?: (tab: string, selectedRows: any[]) => void;
  type?: string;
};

const CustomBottomTabelRender = ({
  activeTab,
  tblSeq,
  addRowTrigger,
  saveTrigger,
  isRefresh,
  height,
  onRowClick,
  onSelectedRowsChange,
  type,
}: Props) => {
  const getProgressMutation = useMutation(bottomQueries.getProgressist());
  const getCostMutation = useMutation(bottomQueries.getCostList());
  const getGracePeriodMutation = useMutation(bottomQueries.getGracePeriodList());
  const getPreferenceMutation = useMutation(bottomQueries.getPreferenceList());
  const getMemoMutation = useMutation(bottomQueries.getMemoList());
  const getRndMutation = useMutation(bottomQueries.getRndList());
  const getFileListMutation = useMutation(bottomQueries.getFileListList());
  const getRenewListMutation = useMutation(bottomQueries.getRenewalList());
  const getProductListMutation = useMutation(bottomQueries.getProductList());
  const getOverseasListMutation = useMutation(bottomQueries.getOverseasList());
  const getLocarListMutation = useMutation(bottomQueries.getLocarList());
  const getClaimListMutation = useMutation(bottomQueries.getClaimList());
  const getIncidentClaimListMutation = useMutation(bottomQueries.getIncidentClaimList());
  const getIdsistMutation = useMutation(bottomQueries.getIdsList());
  const getRequiredDocListMutation = useMutation(bottomQueries.getRequiredList());
  const getMaintenanceListMutation = useMutation(bottomQueries.getMaintenanceList());
  const [progressList, setProgressList] = useState<ProgressItemType[]>([]);
  const [requiredDocList, setRequiredDocList] = useState<RequiredDocRequestItem[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceRequestItem[]>([]);
  const [idsList, setIdsList] = useState<IdsRequestItem[]>([]);
  const [claimList, setClaimList] = useState<ClaimItemListResponseType[]>([]);
  const [costList, setCostList] = useState<CostItemResponseType[]>([]);
  const [gracePeriodList, setGracePeriodList] = useState<GracePeriodItemResponseType[]>([]);
  const [preferenceList, setPreferenceList] = useState<PreferenceType[]>([]);
  const [memoList, setMemoList] = useState<MemoItemType[]>([]);
  const [rndList, setRndList] = useState<RndType[]>([]);
  const [fileListList, setFileListList] = useState<FileItemListResponseType[]>([]);
  const [renewalList, setRenewalList] = useState<RenewalItemListResponseType[]>([]);
  const [productList, setProductList] = useState<ProductItemListResponseType[]>([]);
  const [overseasList, setOverseasList] = useState<OverseasItemListResponseType[]>([]);
  const [hardSummaryList, setHardSummaryList] = useState<OverseasItemListResponseType[]>([]);
  const [locarList, setLocarList] = useState<LocarItemListResponseType[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({}); // 다중 선택 상태 관리
  const navigate = useNavigate();

  // 데이터 로드 시 첫 번째 항목 자동 선택
  // 탭 변경 시 선택 초기화
  useEffect(() => {
    setRowSelection({});
  }, [activeTab, isRefresh]);

  const renderTable = () => {
    switch (activeTab) {
      case "PROGRESS": // 진행사항
        return (
          <DataTable
            data={progressList}
            columns={getProgessColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("PROGRESS", selectedItems);
            }}
            onRowClick={(row, rowData) => {
              onRowClick?.("PROGRESS", rowData);
            }}
          />
        );
      case "COST": // 연차관리
        return (
          <DataTable
            data={costList}
            columns={getCostColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("COST", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              //alert(JSON.stringify(rowData.memoSeq));
              onRowClick?.("COST", rowData);
            }}
          />
        );
      case "GRACE_PERIOD": // 공지예외
        return (
          <DataTable
            data={gracePeriodList}
            columns={getGracePeriodColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("GRACE_PERIOD", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              //alert(JSON.stringify(rowData.memoSeq));
              onRowClick?.("GRACE_PERIOD", rowData);
            }}
          />
        );
      case "PREFERENCE": // 우선권
        return (
          <DataTable
            data={preferenceList}
            columns={getPreferenceColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("PREFERENCE", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              //alert(JSON.stringify(rowData.memoSeq));
              onRowClick?.("PREFERENCE", rowData);
            }}
          />
        );
      case "MEMO": // 메모
        return (
          <DataTable
            data={memoList}
            columns={getMemoColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("MEMO", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              //alert(JSON.stringify(rowData.memoSeq));
              onRowClick?.("MEMO", rowData);
            }}
          />
        );
      case "RND": // 연구과제
        return (
          <DataTable
            data={rndList}
            columns={getRndColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("RND", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              //alert(JSON.stringify(rowData.memoSeq));
              onRowClick?.("RND", rowData);
            }}
          />
        );
      case "FILE_LIST": // 전자포대
        return (
          <DataTable
            data={fileListList}
            columns={getFileListColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("FILE_LIST", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              //alert(JSON.stringify(rowData.memoSeq));
              onRowClick?.("FILE_LIST", rowData);
            }}
          />
        );
      case "RENEWAL": // 갱신관리
        return (
          <DataTable
            data={renewalList}
            columns={getRenewalColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("RENEWAL", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              onRowClick?.("RENEWAL", rowData);
            }}
          />
        );
      case "PRODUCT": // 지정상품
        return (
          <DataTable
            data={productList}
            columns={getProductColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("PRODUCT", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              onRowClick?.("PRODUCT", rowData);
            }}
          />
        );
      case "LOCAR":
        return (
          <DataTable
            data={locarList}
            columns={getLocarColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("LOCAR", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              onRowClick?.("LOCAR", rowData);
            }}
          />
        );
      case "IDS":
        return (
          <DataTable
            data={idsList}
            columns={getIdsColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("IDS", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              //alert(JSON.stringify(rowData.memoSeq));
              onRowClick?.("IDS", rowData);
            }}
          />
        );
      case "WORK_MANAGE":
        return (
          <DataTable
            data={progressList}
            columns={getProgessColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("WORK_MANAGE", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              onRowClick?.("WORK_MANAGE", rowData);
            }}
          />
        );
      case "CLAIM":
        return (
          <DataTable
            data={claimList}
            columns={getClaimColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("CLAIM", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              onRowClick?.("CLAIM", rowData);
            }}
          />
        );

      case "REQUIRED_DOCS":
        return (
          <DataTable
            data={requiredDocList}
            columns={getRequiredDocColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("REQUIRED_DOCS", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              //alert(JSON.stringify(rowData.memoSeq));
              onRowClick?.("REQUIRED_DOCS", rowData);
            }}
          />
        );
      case "MAINTENANCE_FEE":
        return (
          <DataTable
            data={maintenanceList}
            columns={getMaintenanceColumns(editMode)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("MAINTENANCE_FEE", selectedItems); // 부모로 전달
            }}
            onRowClick={(row, rowData) => {
              //alert(JSON.stringify(rowData.memoSeq));
              onRowClick?.("MAINTENANCE_FEE", rowData);
            }}
          />
        );
      case "HARD_SUMMARY":
        return (
          <DataTable
            data={hardSummaryList}
            columns={getHardSummaryColumns(true)}
            height={height}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getSelectedRow={(selectedItems) => {
              onSelectedRowsChange?.("HARD_SUMMARY", selectedItems); // 부모로 전달
            }}
          />
        );
      case "OVERSEAS": // 해외출원
        return (
          <DataTable
            data={overseasList}
            columns={getOverseasColumns(editMode)}
            height={height}
            onRowClick={(row, rowData) => {
              onRowClick?.("OVERSEAS", rowData);
            }}
          />
        );
      default:
    }
  };

  // useEffect(() => {
  //   getList(tblSeq);
  // }, [activeTab, isInitialized]);
  //

  useEffect(() => {
    if (!tblSeq) return;
    
    // 이전에 조회한 것과 동일하면 스킵
    // (activeTab, isRefresh, tblSeq 중 하나라도 바뀌면 로직 수행)


    switch (activeTab) {
      case "PROGRESS":
        getProgressMutation.mutate(tblSeq, {
          onSuccess: (response) => {
            setProgressList(response.data.list);
          },
        });
        break;
      case "COST":
        getCostMutation.mutate(tblSeq, {
          onSuccess: (response) => {
            setCostList(response.data.list);
          },
        });
        break;
      case "GRACE_PERIOD":
        getGracePeriodMutation.mutate(tblSeq, {
          onSuccess: (response) => {
            if (response.data.list === null) {
              setGracePeriodList([]);
            } else setGracePeriodList(response.data.list);
          },
        });
        break;
      case "PREFERENCE":
        getPreferenceMutation.mutate(tblSeq, {
          onSuccess: (response) => {
            setPreferenceList(response.data.list);
          },
        });
        break;
      case "MEMO":
        getMemoMutation.mutate(tblSeq, {
          onSuccess: (response) => {
            setMemoList(response.data.list);
          },
        });
        break;
      case "RND":
        getRndMutation.mutate(tblSeq, {
          onSuccess: (response) => {
            setRndList(response.data.list);
          },
        });
        break;
      case "FILE_LIST":
        getFileListMutation.mutate(tblSeq, {
          onSuccess: (response) => {
            setFileListList(response.data.list ?? []);
          },
        });
        break;
      case "RENEWAL":
        getRenewListMutation.mutate(tblSeq, {
          onSuccess: (response) => {
            setRenewalList(response.data.list);
          },
        });
        break;
      case "PRODUCT":
        getProductListMutation.mutate(tblSeq, {
          onSuccess: (response) => {
            setProductList(response.data.list);
          },
        });
        break;
      case "OVERSEAS":
        const param = {
          page: 1,
          pageSize: 30,
          tblSeq,
        };
        getOverseasListMutation.mutate(param, {
          onSuccess: (response) => {
            setOverseasList(response.data.list);
          },
        });
        break;
      case "LOCAR":
        getLocarListMutation.mutate(tblSeq, {
          onSuccess: (response) => {
            setLocarList(response.data.list);
          },
        });
        break;
      case "CLAIM":
        if (type === "domestic" || type === "overseas") {
          getIncidentClaimListMutation.mutate(tblSeq, {
            onSuccess: (response) => {
              setClaimList(response.data?.list ?? []);
            },
          });
        } else {
          const payload = {
            tblSeq,
            page: 1,
            pageSize: 50,
          };
          getClaimListMutation.mutate(payload, {
            onSuccess: (response) => {
              setClaimList(response.data?.list ?? []);
            },
          });
        }
        break;
      case "IDS":
        getIdsistMutation.mutate(tblSeq, {
          onSuccess: (response) => {
            setIdsList(response.data.list);
          },
        });
        break;
      case "REQUIRED_DOCS":
        const payload2 = {
          tblSeq,
          page: 1,
          pageSize: 50,
        };
        getRequiredDocListMutation.mutate(payload2, {
          onSuccess: (response) => {
            setRequiredDocList(response.data.list ?? []);
          },
        });
        break;
      case "MAINTENANCE_FEE":

        const payload3 = {
          tblSeq,
          page: 1,
          pageSize: 50,
        };
        getMaintenanceListMutation.mutate(payload3, {
          onSuccess: (response) => {
            setMaintenanceList(response.data.list ?? []);
          },
        });
        break;
    }
  }, [activeTab, isRefresh, tblSeq]); 


  return <>{renderTable()}</>;
};

export default CustomBottomTabelRender;
