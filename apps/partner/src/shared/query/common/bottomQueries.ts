import { apiClient } from "../../api/client.ts";
import { mutationOptions } from "@tanstack/react-query";
import {
  type ClaimRequestType,
  commBottomAPI,
  type CostCreateRequestType,
  type DistributeRequest,
  type DistributeRequestType,
  type FileListRequestType,
  type GracePeriodCreateRequestType,
  type IdsRequest,
  type LocarnoRequest,
  type MaintenanceRequest,
  type MaintenanceRequestType,
  type MemoCreateRequestType,
  type OverseasRequestType,
  type PreferenceRequestType,
  type ProductRequestType,
  type ProgressItemType,
  type RenewalRequestType,
  type RequiredDocRequest,
  type RequiredDocsRequestType,
  type RndRequestType,
} from "@shared/api/common/commBottomApi.ts";


export const bottomQueries = {
  getProgressist: () =>
    mutationOptions({
      mutationFn: (tblSeq: string) => commBottomAPI(apiClient).getProgressList(tblSeq),
    }),
  createProgress: () =>
    mutationOptions({
      mutationFn: (payload: ProgressItemType) => commBottomAPI(apiClient).createProgress(payload),
    }),
  getProgressDetail: () =>
    mutationOptions({
      mutationFn: (progressSeq: string) => commBottomAPI(apiClient).getProgressDetail(progressSeq),
    }),
  getCostList: () =>
    mutationOptions({
      mutationFn: (tblSeq: string) => commBottomAPI(apiClient).getCostList(tblSeq),
    }),
  getCostDetail: () =>
    mutationOptions({
      mutationFn: ({ tblSeq, costSeq }: { tblSeq: string; costSeq: string }) =>
        commBottomAPI(apiClient).getCostDetail(tblSeq, costSeq),
    }),
  createCost: () =>
    mutationOptions({
      mutationFn: (payload: CostCreateRequestType) => commBottomAPI(apiClient).createCost(payload),
    }),
  getGracePeriodList: () =>
    mutationOptions({
      mutationFn: (tblSeq: string) => commBottomAPI(apiClient).getGracePeriod(tblSeq),
    }),
  getGracePeriodDetail: () =>
    mutationOptions({
      mutationFn: ({ appSeq, gracePeriodSeq }: { appSeq: string; gracePeriodSeq: string }) =>
        commBottomAPI(apiClient).getGracePeriodDetail(appSeq, gracePeriodSeq),
    }),
  createGracePeriod: () =>
    mutationOptions({
      mutationFn: (payload: GracePeriodCreateRequestType) =>
        commBottomAPI(apiClient).createGracePeriod(payload),
    }),
  getPreferenceList: () =>
    mutationOptions({
      mutationFn: (tblSeq: string) => commBottomAPI(apiClient).getPreferenceList(tblSeq),
    }),
  getPreferenceDetail: () =>
    mutationOptions({
      mutationFn: (preferenceSeq: string) =>
        commBottomAPI(apiClient).getPreferenceDetail(preferenceSeq),
    }),
  createPreference: () =>
    mutationOptions({
      mutationFn: (payload: PreferenceRequestType) =>
        commBottomAPI(apiClient).createPreference(payload),
    }),

  saveAllPreference: () =>
    mutationOptions({
      mutationFn: ({ appSeq, payload }: { appSeq: string; payload: PreferenceRequestType[] }) =>
        commBottomAPI(apiClient).saveAllPreference(appSeq, payload),
    }),
  getMemoList: () =>
    mutationOptions({
      mutationFn: (tblSeq: string) => commBottomAPI(apiClient).getMemoList(tblSeq),
    }),
  getMemoDetail: () =>
    mutationOptions({
      mutationFn: (memoSeq: string) => commBottomAPI(apiClient).getMemoDetail(memoSeq),
    }),
  createMemo: () =>
    mutationOptions({
      mutationFn: (payload: MemoCreateRequestType) => commBottomAPI(apiClient).createMemo(payload),
    }),
  deleteMemo: () =>
    mutationOptions({
      mutationFn: ({ tblSeq, memoSeq }: { tblSeq: string; memoSeq: string }) =>
        commBottomAPI(apiClient).deleteMemo(tblSeq, memoSeq),
    }),
  getRndList: () =>
    mutationOptions({
      mutationFn: (tblSeq: string) => commBottomAPI(apiClient).getRndList(tblSeq),
    }),
  getRndDetail: () =>
    mutationOptions({
      mutationFn: ({ appSeq, rndSeq }: { appSeq: string; rndSeq: string }) =>
        commBottomAPI(apiClient).getRndDetail(appSeq,rndSeq),
    }),
  createRnd: () =>
    mutationOptions({
      mutationFn: (payload: RndRequestType) => commBottomAPI(apiClient).createRnd(payload),
    }),

  getFileListList: () =>
    mutationOptions({
      mutationFn: (tblSeq: string) => commBottomAPI(apiClient).getFileListList(tblSeq),
    }),
  getFileListDetail: () =>
    mutationOptions({
      mutationFn: ({ tblSeq, fileMappSeq }: { tblSeq: string; fileMappSeq: string }) =>
        commBottomAPI(apiClient).getFileListDetail(tblSeq, fileMappSeq),
    }),
  createFile: () =>
    mutationOptions({
      mutationFn: (payload: FileListRequestType) =>
        commBottomAPI(apiClient).createFileList(payload),
    }),

  getRenewalList: () =>
    mutationOptions({
      mutationFn: (tblSeq: string) => commBottomAPI(apiClient).getRenewalList(tblSeq),
    }),
  createRenewal: () =>
    mutationOptions({
      mutationFn: (payload: RenewalRequestType) => commBottomAPI(apiClient).createRenewal(payload),
    }),

  getProductList: () =>
    mutationOptions({
      mutationFn: (tblSeq: string) => commBottomAPI(apiClient).getProductList(tblSeq),
    }),
  createProduct: () =>
    mutationOptions({
      mutationFn: (payload: ProductRequestType) => commBottomAPI(apiClient).createProduct(payload),
    }),
  getOverseasList: () =>
    mutationOptions({
      mutationFn: (payload: OverseasRequestType) =>
        commBottomAPI(apiClient).getOverseasList(payload),
    }),
  getLocarList: () =>
    mutationOptions({
      mutationFn: (tblSeq: string) => commBottomAPI(apiClient).getLocarList(tblSeq),
    }),
  getList: () =>
    mutationOptions({
      mutationFn: () => commBottomAPI(apiClient).getList(),
    }),
  getClassList: () =>
    mutationOptions({
      mutationFn: (classNo: string) => commBottomAPI(apiClient).getClassList(classNo),
    }),
  getGoodList: () =>
    mutationOptions({
      mutationFn: ({ classNo, subClassNo }: { classNo: string; subClassNo: string }) =>
        commBottomAPI(apiClient).getGoodList(classNo, subClassNo),
    }),
  createLocar: () =>
    mutationOptions({
      mutationFn: (payload: LocarnoRequest) => commBottomAPI(apiClient).createLocar(payload),
    }),
  getLocarnoGroupDetail: () =>
    mutationOptions({
      mutationFn: ({ appSeq, locarnoGroupId }: { appSeq: string; locarnoGroupId: string }) =>
        commBottomAPI(apiClient).getLocarnoGroupDetail(appSeq, locarnoGroupId),
    }),
  getClaimList: () =>
    mutationOptions({
      mutationFn: (payload: ClaimRequestType) => commBottomAPI(apiClient).getClaimList(payload),
    }),
  getIncidentClaimList: () =>
    mutationOptions({
      mutationFn: (tblSeq: string) => commBottomAPI(apiClient).getIncidentClaimList(tblSeq),
    }),
  createDistribute: () =>
    mutationOptions({
      mutationFn: ({ invoiceSeq, payload }: { invoiceSeq: string; payload: DistributeRequest }) =>
        commBottomAPI(apiClient).createDistribute(invoiceSeq, payload),
    }),
  getDistributeList: () =>
    mutationOptions({
      mutationFn: (payload: DistributeRequestType) =>
        commBottomAPI(apiClient).getDistributeList(payload),
    }),
  getIdsList: () =>
    mutationOptions({
      mutationFn: (appSeq: string) => commBottomAPI(apiClient).getIdsList(appSeq),
    }),
  getIdsDetail: () =>
    mutationOptions({
      mutationFn: ({ appSeq, idsSeq }: { appSeq: string; idsSeq: string }) =>
        commBottomAPI(apiClient).getIdsDetail(appSeq, idsSeq),
    }),
  getRequiredList: () =>
    mutationOptions({
      mutationFn: (payload: RequiredDocsRequestType) =>
        commBottomAPI(apiClient).getRequiredList(payload),
    }),
  createIds: () =>
    mutationOptions({
      mutationFn: (payload: IdsRequest) => commBottomAPI(apiClient).createIds(payload),
    }),
  createRequiredDocs: () =>
    mutationOptions({
      mutationFn: (payload: RequiredDocRequest) =>
        commBottomAPI(apiClient).createRequiredDocs(payload),
    }),
  getRequiredDocsDetail: () =>
    mutationOptions({
      mutationFn: ({ appSeq, requiredDocSeq }: { appSeq: string; requiredDocSeq: string }) =>
        commBottomAPI(apiClient).getRequiredDocsDetail(appSeq, requiredDocSeq),
    }),
  getMaintenanceList: () =>
    mutationOptions({
      mutationFn: (payload: MaintenanceRequestType) =>
        commBottomAPI(apiClient).getMaintenanceList(payload),
    }),
  getMaintenanceDetail: () =>
    mutationOptions({
      mutationFn: ({ appSeq, mainFeeSeq }: { appSeq: string; mainFeeSeq: string }) =>
        commBottomAPI(apiClient).getMaintenanceDetail(appSeq, mainFeeSeq),
    }),
  createMaintenance: () =>
    mutationOptions({
      mutationFn: (payload: MaintenanceRequest) =>
        commBottomAPI(apiClient).createMaintenance(payload),
    }),

  multiDeleteProgress: () =>
    mutationOptions({
      mutationFn: ({ tblSeq, progressSeqList }: { tblSeq: string; progressSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeleteProgress(tblSeq, progressSeqList),
    }),

  multiDeleteMemo: () =>
    mutationOptions({
      mutationFn: ({ tblSeq, memoSeqList }: { tblSeq: string; memoSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeleteMemo(tblSeq, memoSeqList),
    }),

  multiDeleteGracePeriod: () =>
    mutationOptions({
      mutationFn: ({ appSeq, gracePeriodSeqList }: { appSeq: string; gracePeriodSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeleteGracePeriod(appSeq, gracePeriodSeqList),
    }),

  multiDeleteCost: () =>
    mutationOptions({
      mutationFn: ({ tblSeq, costSeqList }: { tblSeq: string; costSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeleteCost(tblSeq, costSeqList),
    }),

  multiDeletePreference: () =>
    mutationOptions({
      mutationFn: ({ appSeq, preferenceSeqList }: { appSeq: string; preferenceSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeletePreference(appSeq, preferenceSeqList),
    }),

  multiDeleteRnd: () =>
    mutationOptions({
      mutationFn: ({ appSeq, rndSeqList }: { appSeq: string; rndSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeleteRnd(appSeq, rndSeqList),
    }),

  multiDeleteFileList: () =>
    mutationOptions({
      mutationFn: ({ tblSeq, fileMappSeqList }: { tblSeq: string; fileMappSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeleteFileList(tblSeq, fileMappSeqList),
    }),

  multiDeleteRenewal: () =>
    mutationOptions({
      mutationFn: ({ appSeq, costSeqList }: { appSeq: string; costSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeleteRenewal(appSeq, costSeqList),
    }),

  multiDeleteProduct: () =>
    mutationOptions({
      mutationFn: ({ appSeq, productSeqList }: { appSeq: string; productSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeleteProduct(appSeq, productSeqList),
    }),

  multiDeleteLocarno: () =>
    mutationOptions({
      mutationFn: ({ appSeq, locarnoSeqList }: { appSeq: string; locarnoSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeleteLocarno(appSeq, locarnoSeqList),
    }),

  multiDeleteIds: () =>
    mutationOptions({
      mutationFn: ({ appSeq, idsSeqList }: { appSeq: string; idsSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeleteIds(appSeq, idsSeqList),
    }),

  multiDeleteRequiredDoc: () =>
    mutationOptions({
      mutationFn: ({ appSeq, requiredDocSeqList }: { appSeq: string; requiredDocSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeleteRequiredDoc(appSeq, requiredDocSeqList),
    }),

  multiDeleteMaintenanceFee: () =>
    mutationOptions({
      mutationFn: ({ appSeq, maintenanceFeeSeqList }: { appSeq: string; maintenanceFeeSeqList: string[] }) =>
        commBottomAPI(apiClient).multiDeleteMaintenanceFee(appSeq, maintenanceFeeSeqList),
    }),

  deleteIncidentClaims: () =>
    mutationOptions({
      mutationFn: (invoiceSeqs: string[]) => commBottomAPI(apiClient).deleteIncidentClaims(invoiceSeqs),
    }),
};
