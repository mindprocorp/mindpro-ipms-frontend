import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

export interface BoardMaster {
  configSeq: string;
  masterUserId: string;
  masterUserName?: string;
}

export interface BoardConfig {
  configSeq?: string;
  parentSeq?: string | null;
  boardType?: "CATEGORY" | "BOARD" | "LINK";
  boardName?: string;
  description?: string;
  shareScope?: "ALL" | "MEMBER";
  adminWriteOnlyYn?: "Y" | "N";
  noticeAuthType?: "ALL" | "ADMIN";
  newPostAlertYn?: "Y" | "N";
  useReactionYn?: "Y" | "N";
  prefixTags?: string;
  viewType?: "LIST" | "PREVIEW" | "ALBUM";
  status?: "ACTIVE" | "ARCHIVED";
  dispOrd?: number;
  
  children?: BoardConfig[];
  masters?: BoardMaster[];
  permissions?: BoardPermissionTarget[];
  canWrite?: boolean;
  canRead?: boolean;
}

export interface BoardPermissionTarget {
  targetSeq?: string;
  configSeq?: string;
  targetRole: "WRITE_AUTH" | "READ_AUTH";
  targetType: "EMPLOYEE" | "DEPT";
  refSeq?: string;
  refName?: string;
  refDept?: string;
  refPosition?: string;
  refEmail?: string;
  refMobile?: string;
}

export interface BoardConfigReq {
  boardConfig: BoardConfig;
  masters: BoardMaster[];
  permissions?: BoardPermissionTarget[];
}

export interface BaseSearchRequest {
  page?: number;
  pageSize?: number;
  searchCondition?: any[];
  textFilters?: any[];
  dateFilters?: any[];
}

export interface BoardBackupVO {
  backupSeq?: string;
  officeSeq?: string;
  configSeq?: string;
  boardName?: string;
  status?: "REQUEST" | "PROCESSING" | "COMPLETED" | "FAILED";
  filePath?: string;
  fileSize?: number;
  fileName?: string;
  requestUserName?: string;
  createAt?: string;
}

/** 게시판 시스템 통합 설정 */
export interface BoardSystemConfig {
  officeSeq?: string;
  maxFileSize: number;
  maxBodySize: number;
  trashRetentionDays: string;
  allowMasterChangeYn: "Y" | "N";
  mainLayoutType?: string;
  recentPostCount?: number;
  newBadgeDuration?: number;
  showPinOnTopYn?: string;
}

export function boardConfigApi(client: ApiClient) {
  return {
    getList: async (req: BaseSearchRequest = {}): Promise<ApiResponse<any>> => {
      const { data } = await client.axios.post<ApiResponse<any>>(
        "/api/board/config/list",
        req
      );
      return data;
    },
    
    createConfig: async (req: BoardConfigReq): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/board/config",
        req
      );
      return data;
    },
    
    updateConfig: async (req: BoardConfigReq): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.put<ApiResponse<void>>(
        "/api/board/config",
        req
      );
      return data;
    },
    
    deleteConfig: async (configSeq: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/board/config/${configSeq}`
      );
      return data;
    },

    // 백업 관련 API
    getBackupList: async (req: BaseSearchRequest = {}): Promise<ApiResponse<any>> => {
      const { data } = await client.axios.post<ApiResponse<any>>(
        "/api/board/backup/list",
        req
      );
      return data;
    },

    requestBackup: async (vo: BoardBackupVO): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/board/backup/request",
        vo
      );
      return data;
    },

    deleteBackup: async (backupSeq: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/board/backup/${backupSeq}`
      );
      return data;
    },

    // 시스템 통합 설정 API
    getSystemConfig: async (): Promise<ApiResponse<BoardSystemConfig>> => {
      const { data } = await client.axios.get<ApiResponse<BoardSystemConfig>>(
        "/api/board/config/system"
      );
      return data;
    },

    saveSystemConfig: async (config: BoardSystemConfig): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>(
        "/api/board/config/system",
        config
      );
      return data;
    },

    // 순서 변경 API
    updateOrder: async (orders: { configSeq: string; dispOrd: number; parentSeq: string | null }[]): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.put<ApiResponse<void>>(
        "/api/board/config/order",
        orders
      );
      return data;
    },

    // 정리(Cleanup) 관련 API
    getCleanupCount: async (configSeq: string, days: number): Promise<ApiResponse<number>> => {
      const { data } = await client.axios.get<ApiResponse<number>>(
        "/api/board/cleanup/count",
        { params: { configSeq, days } }
      );
      return data;
    },

    executeCleanup: async (configSeq: string, days: number): Promise<ApiResponse<number>> => {
      const { data } = await client.axios.post<ApiResponse<number>>(
        "/api/board/cleanup/execute",
        null,
        { params: { configSeq, days } }
      );
      return data;
    },
  };
}
