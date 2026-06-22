import type { ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

export type EFileMangerListResponse = {
  totalCount: number;
  page: number;
  size: number;
  totalPage: number;
  list:  EFileMangerListType[];
};

// 전자포대 응답
export type EFileMangerListType = {
  appNo: string;
  attachDocName: string;
  parentSeq: string;
  caseCategory: {
    code: string;
    codeName: string;
  };
  caseClassification: {
    code: string;
    codeName: string;
  }
  docInfo: {
    code: string;
    codeName: string;
  }
  docKind: string;
  fileDownloadUrl: string;
  fileKind: string;
  fileSize: string;
  fileViewUrl: string;
  ourRef: string;
  regNo: string;
  rightType : {
    code: string;
    codeName: string;
  }
  summary: string;
  tblSeq: string;
  uploadAt: string;
  uploadUser: string;
}

import type { BaseSearchRequest } from "@shared/api/types";

// 전자폰대 요청
export type EFileMangerListRequest = BaseSearchRequest & {
  page: number; // 페이지
  pageSize: number; // 페이지사이즈
};

export function eFileMangerApi(client: ApiClient) {
  return {
    // 전자포대 리스트
    getEFileManagerList: async (payload: EFileMangerListRequest): Promise<ApiResponse<EFileMangerListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<EFileMangerListResponse>>(
        `/api/fileList/dossier-archives`,
        payload,
      );
      return data;
    },
  };
}