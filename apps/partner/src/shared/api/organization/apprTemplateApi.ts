import { type ApiClient } from "@repo/api";

export type ApproverType = "SELF" | "DIRECT_PERSON";

export type ApprTemplateLineVO = {
  templateLineSeq?: string;
  apprTemplateSeq?: string;
  stepOrder: string;
  stepType: string;
  stepName: string;
  approverType?: ApproverType;
  approverRefSeq?: string;
  approverName?: string;
};

export type ApprTemplateVO = {
  apprTemplateSeq?: string;
  officeSeq?: string;
  templateName: string;
  sortOrd?: string;
  lines?: ApprTemplateLineVO[];
  createUser?: string;
  updateUser?: string;
  createAt?: string;
};

export function apprTemplateApi(client: ApiClient) {
  return {
    getList: async (templateName?: string) => {
      const { data } = await client.axios.get("/api/organization/appr-template", {
        params: { templateName },
      });
      return data.data as ApprTemplateVO[];
    },

    getDetail: async (apprTemplateSeq: string) => {
      const { data } = await client.axios.get(`/api/organization/appr-template/${apprTemplateSeq}`);
      return data.data as ApprTemplateVO;
    },

    save: async (payload: ApprTemplateVO) => {
      const { data } = await client.axios.post("/api/organization/appr-template", payload);
      return data;
    },

    delete: async (apprTemplateSeq: string) => {
      const { data } = await client.axios.delete(`/api/organization/appr-template/${apprTemplateSeq}`);
      return data;
    },
  };
}
