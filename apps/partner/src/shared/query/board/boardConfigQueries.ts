import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { apiClient } from "../../api/client.ts";
import { boardConfigApi, type BoardConfigReq, type BaseSearchRequest } from "../../api/board/boardConfigApi.ts";

export const boardConfigQueries = {
  
  /** 트리 목록 조회 */
  getList: (req: BaseSearchRequest = {}) =>
    queryOptions({
      queryKey: ["boardConfig", "list", req],
      queryFn: () => boardConfigApi(apiClient).getList(req),
    }),
    
  /** 설정 조회(Mutation용으로 쓰일 경우) */
  getListMut: () =>
    mutationOptions({
      mutationFn: (req: BaseSearchRequest = {}) => boardConfigApi(apiClient).getList(req),
    }),

  /** 설정 생성 */
  createConfig: () =>
    mutationOptions({
      mutationFn: (data: BoardConfigReq) => boardConfigApi(apiClient).createConfig(data),
    }),

  /** 설정 수정 */
  updateConfig: () =>
    mutationOptions({
      mutationFn: (data: BoardConfigReq) => boardConfigApi(apiClient).updateConfig(data),
    }),

  /** 설정 삭제 */
  deleteConfig: () =>
    mutationOptions({
      mutationFn: (configSeq: string) => boardConfigApi(apiClient).deleteConfig(configSeq),
    }),

  /** 백업 목록 조회 */
  getBackupList: (req: BaseSearchRequest = {}) =>
    queryOptions({
      queryKey: ["boardConfig", "backup", "list", req],
      queryFn: () => boardConfigApi(apiClient).getBackupList(req),
    }),

  /** 백업 요청 */
  requestBackup: () =>
    mutationOptions({
      mutationFn: (data: any) => boardConfigApi(apiClient).requestBackup(data),
    }),

  /** 백업 삭제 */
  deleteBackup: () =>
    mutationOptions({
      mutationFn: (backupSeq: string) => boardConfigApi(apiClient).deleteBackup(backupSeq),
    }),

  /** 순서 변경 */
  updateOrder: () =>
    mutationOptions({
      mutationFn: (orders: { configSeq: string; dispOrd: number; parentSeq: string | null }[]) =>
        boardConfigApi(apiClient).updateOrder(orders),
    }),

  /** 정리 대상 카운트 조회 */
  getCleanupCount: () =>
    mutationOptions({
      mutationFn: ({ configSeq, days }: { configSeq: string; days: number }) =>
        boardConfigApi(apiClient).getCleanupCount(configSeq, days),
    }),

  /** 정리 실행 */
  executeCleanup: () =>
    mutationOptions({
      mutationFn: ({ configSeq, days }: { configSeq: string; days: number }) =>
        boardConfigApi(apiClient).executeCleanup(configSeq, days),
    }),
};
