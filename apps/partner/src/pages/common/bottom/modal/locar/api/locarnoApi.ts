import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

export type LocarnoResponse = {
  createUser: string;
  createAt: string;
  updateUser: string;
  updateAt: string;
  delYn: string;
  note: string | null;
  classNo: string;
  locarnoVersion: string;
  categoryGb: string;
  classNmKo: string;
  classNmEn: string;
  classDescKo: string | null;
  classDescEn: string | null;
  subclassNo: string | null;
  subclassNmKo: string | null;
  subclassNmEn: string | null;
  goodsSeq: string | null;
  goodsNo: string | null;
  goodsNmKo: string | null;
  goodsNmEn: string | null;
};

type ApiTypes = ApiResponse<LocarnoResponse[]>;

export const locarnoApi = (client: ApiClient) => {
  return {
    getList: async (): Promise<ApiTypes> => {
      const { data } = await client.axios.post<ApiTypes>(
        "http://192.168.0.103:9000/api/locarno/list",
      );
      return data;
    },
    getClassList: async (classNo: string): Promise<ApiTypes> => {
      const { data } = await client.axios.post<ApiTypes>(
        `http://192.168.0.103:9000/api/locarno/sub-list/${classNo}`,
      );

      return data;
    },
    getGoodList: async (classNo: string, subClassNo: string): Promise<ApiTypes> => {
      const { data } = await client.axios.post<ApiTypes>(
        `http://192.168.0.103:9000/api/locarno/goods-list/${classNo}/${subClassNo}`,
      );
      return data;
    },
  };
};
