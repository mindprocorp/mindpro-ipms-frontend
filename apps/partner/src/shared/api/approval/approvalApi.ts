import { type ApiClient } from "@repo/api";

export type ApprDocLineVO = {
  lineSeq?: string;
  docSeq?: string;
  stepOrder: string;
  stepName?: string;
  stepType?: string;    // APPROVAL | AGREEMENT | REVIEW
  approverSeq?: string;
  approverName?: string;
  approverType?: string; // SELF | USER
  lineStatus?: string;   // PENDING | APPROVED | REJECTED
  actionAt?: string;
  actionComment?: string;
};

export type ApprDocTargetVO = {
  targetSeq?: string;
  docSeq?: string;
  targetRole: string;  // RECEIVE | SHARE
  targetType: string;  // EMPLOYEE | DEPT
  refSeq?: string;
  refName?: string;
};

export type ApprDocVO = {
  docSeq?: string;
  officeSeq?: string;
  formTemplateSeq?: string;
  formTemplateName?: string;
  docNo?: string;
  docTitle?: string;
  docContent?: string;   // 저장된 입력값 JSON {"fieldName": "value"}
  templateData?: string; // 서식 구조 JSON (단건 조회 시 포함)
  /** DRAFT | PENDING | APPROVED | REJECTED | WITHDRAWN */
  docStatus?: string;
  drafterSeq?: string;
  drafterName?: string;
  draftDeptSeq?: string;
  draftDeptName?: string;
  submitAt?: string;
  completeAt?: string;
  createAt?: string;
  lines?: ApprDocLineVO[];
  targets?: ApprDocTargetVO[];
};

export type ApprovalActionRequest = {
  action: "APPROVED" | "REJECTED";
  comment?: string;
};

export function approvalApi(client: ApiClient) {
  return {
    saveDoc: async (payload: ApprDocVO) => {
      const { data } = await client.axios.post("/api/approval/doc", payload);
      return data.data as ApprDocVO;
    },

    getDoc: async (docSeq: string) => {
      const { data } = await client.axios.get(`/api/approval/doc/${docSeq}`);
      return data.data as ApprDocVO;
    },

    getMyDraftList: async (docStatus?: string, keyword?: string) => {
      const { data } = await client.axios.get("/api/approval/doc/my", { params: { docStatus, keyword } });
      return data.data as ApprDocVO[];
    },

    getPendingList: async (keyword?: string) => {
      const { data } = await client.axios.get("/api/approval/doc/pending", { params: { keyword } });
      return data.data as ApprDocVO[];
    },

    getReferenceList: async (keyword?: string) => {
      const { data } = await client.axios.get("/api/approval/doc/reference", { params: { keyword } });
      return data.data as ApprDocVO[];
    },

    getDeptInboxList: async (keyword?: string) => {
      const { data } = await client.axios.get("/api/approval/doc/dept-inbox", { params: { keyword } });
      return data.data as ApprDocVO[];
    },

    getDeptReferenceList: async (keyword?: string) => {
      const { data } = await client.axios.get("/api/approval/doc/dept-reference", { params: { keyword } });
      return data.data as ApprDocVO[];
    },

    getInboxList: async (keyword?: string) => {
      const { data } = await client.axios.get("/api/approval/doc/inbox", { params: { keyword } });
      return data.data as ApprDocVO[];
    },

    processApproval: async (docSeq: string, lineSeq: string, payload: ApprovalActionRequest): Promise<void> => {
      await client.axios.put(`/api/approval/doc/${docSeq}/line/${lineSeq}/action`, payload);
    },

    withdrawDoc: async (docSeq: string): Promise<void> => {
      await client.axios.put(`/api/approval/doc/${docSeq}/withdraw`);
    },

    deleteDoc: async (docSeq: string): Promise<void> => {
      await client.axios.delete(`/api/approval/doc/${docSeq}`);
    },
  };
}
