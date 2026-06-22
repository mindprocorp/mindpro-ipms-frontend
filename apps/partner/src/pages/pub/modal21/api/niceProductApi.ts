import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

export type NiceProductResponse = {
  createUser: string;
  createAt: string;
  updateUser: string;
  updateAt: string;
  delYn: string;
  note: string | null;
  classNo: string;
  niceVersion: string;
  categoryGb: string;
  classNmKo: string;
  classNmEn: string;
  classDescKo: string | null;
  classDescEn: string | null;
};

export type ClassResponse = {
  createUser: string;
  createAt: string;
  updateUser: string;
  updateAt: string;
  delYn: string;
  note: string | null;
  classNo: string;
  niceVersion: string;
  productId: string;
  similarityCode: string;
  productNmKo: string;
  productNmEn: string;
};

export const niceProductApi = (client: ApiClient) => {
  return {
    getMasterList: async (): Promise<ApiResponse<NiceProductResponse[]>> => {
      const { data } = await client.axios.get<ApiResponse<NiceProductResponse[]>>(
        "http://192.168.0.103:9000/api/product/nice-class",
      );
      return data;
    },
    getClassList: async (classNo: string): Promise<ApiResponse<ClassResponse[]>> => {
      const { data } = await client.axios.post<ApiResponse<ClassResponse[]>>(
        `http://192.168.0.103:9000/api/product/master-product/class/${classNo}`,
      );
      return data;
    },
  };
};
