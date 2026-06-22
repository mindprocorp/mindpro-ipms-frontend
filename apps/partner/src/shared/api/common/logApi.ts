import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";


type LogHistListResponseItemType = {
  createUser: string;
  createAt: string;
  updateUsers: string;
  updateAt: string;
  delYn: string;
  notes: string;
  usageHistorySeq: string;
  userMstSeq: string;
  officeSeq: string;
  menuName: string;
  actionName: string;
  reqUrl: string;
  reqMethod: string;
  clientIp: string;
  userAgent: string;
  targetClass: string;
  targetMethod: string;
};
// 사용이력 응답
export type LogHistListResponseType = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: LogHistListResponseItemType[];
};

// 사용이력 요청
export type LogHistListRequestType = {
  userInfoSeq : string;
  tblSeq?: string;
  page: number;
  pageSize: number;
};

type LogAccessListResponseItemType = {
  createUser: string;
  createAt: string;
  updateUser: string;
  updateAt: string;
  delYn: string;
  note: string;
  officeSeq: string;
  userMstSeq: string;
  loginHistorySeq: string;
  category: string;
  loginIp: string;
  userId: string;
  userNameKo: string;
  userNameEn: string;
  userNameZh: string;
  loginSuccessYn: string;
  loginDeviceType: string;
  loginCountry: string;
  loginType: string;
};
// 접근이력 응답
export type LogAccessListResponseType = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list: LogAccessListResponseItemType[];
};

// 접근이력 요청
export type LogAccessListRequestType = {
  userInfoSeq: string;
  tblSeq?: string;
  page: number;
  pageSize: number;
};



export function logAPI(client: ApiClient) {
  return {
    getHistList: async (
      payload: LogHistListRequestType,
    ): Promise<ApiResponse<LogHistListResponseType>> => {
      const { data } = await client.axios.post<ApiResponse<LogHistListResponseType>>(
        "/api/usage-history/list",
        payload,
      );
      return data;
    },
    getLogList: async (
      payload: LogAccessListRequestType,
    ): Promise<ApiResponse<LogAccessListResponseType>> => {
      const { data } = await client.axios.post<ApiResponse<LogAccessListResponseType>>(
        "/api/history/login/list",
        payload,
      );
      return data;
    },
  };
}
