import { type ApiClient } from "@repo/api";

export type DeptVO = {
  deptSeq: string;
  officeSeq: string;
  parentDeptSeq: string | null;
  deptCode: string;
  deptName: string;
  deptPath: string;
  depth: string;
  sortOrd: string;
  useYn: string;
};

export type OfficeCodeVO = {
  officeCodeSeq: string;
  officeSeq: string;
  codeClass: string;
  officeCode: string;
  codeName: string;
  codeNameEn: string | null;
  sortOrd: string;
  useYn: string;
};

export type DeptCreateRequest = {
  parentDeptSeq?: string;
  deptCode: string;
  deptName: string;
  sortOrd?: string;
};

export type DeptUpdateRequest = {
  deptSeq: string;
  parentDeptSeq?: string;
  deptCode: string;
  deptName: string;
  sortOrd?: string;
  useYn?: string;
};

export function orgApi(client: ApiClient) {
  return {
    // 부서 트리 조회
    getDeptTree: async () => {
      const { data } = await client.axios.get("/api/organization/dept/tree");
      return data.data as DeptVO[];
    },

    // 부서 등록
    createDept: async (payload: {
      parentDeptSeq?: string;
      deptCode: string;
      deptName: string;
      sortOrd?: string;
    }) => {
      const { data } = await client.axios.post("/api/organization/dept", payload);
      return data;
    },

    // 부서 수정
    updateDept: async (payload: {
      deptSeq: string;
      parentDeptSeq?: string;
      deptCode: string;
      deptName: string;
      sortOrd?: string;
      useYn?: string;
    }) => {
      const { data } = await client.axios.put("/api/organization/dept", payload);
      return data;
    },

    // 부서 삭제
    deleteDept: async (deptSeq: string) => {
      const { data } = await client.axios.delete(`/api/organization/dept/${deptSeq}`);
      return data;
    },

    // 사무소별 코드 조회
    getOfficeCodeList: async (codeClass: string) => {
      const { data } = await client.axios.get("/api/organization/code", {
        params: { codeClass },
      });
      return data.data as OfficeCodeVO[];
    },

    // 코드 자동 등록
    getOrCreateCode: async (codeClass: string, codeName: string) => {
      const { data } = await client.axios.post("/api/organization/code/auto", null, {
        params: { codeClass, codeName },
      });
      return data.data as OfficeCodeVO;
    },

    // 코드 수정
    updateCode: async (payload: OfficeCodeVO) => {
      const { data } = await client.axios.put("/api/organization/code", payload);
      return data;
    },
  };
}
