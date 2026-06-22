import { type ApiClient } from "@repo/api";

export type FormField = {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  description?: string;
  options?: string[];
  columns?: string[];
};

export type FormTemplateTargetVO = {
  targetSeq?: string;
  formTemplateSeq?: string;
  targetRole: string; // SHARE_GROUP | WRITE_AUTH | READ_AUTH | RECEIVE | REFERENCE
  targetType: string; // EMPLOYEE | DEPT_HEAD | DEPT
  refSeq?: string;
  // 프론트 표시용 (DB 저장 안 됨)
  refName?: string;
  refDept?: string;
  refEmail?: string;
  refMobile?: string;
};

export type FormTemplateVO = {
  formTemplateSeq?: string;
  officeSeq?: string;
  categoryCode?: string;
  templateName: string;
  useYn?: string;
  docModifyYn?: string;
  templateData?: string;
  sortOrd?: string;
  createAt?: string;
  // 1단계: 기본 설정
  docNumYn?: string;
  docNumFormat?: string;
  footerYn?: string;
  footerContent?: string;
  externalYn?: string;
  redirectUrl?: string;
  // 3단계: 결재선 설정
  apprTemplateSeq?: string;
  apprRequiredYn?: string;
  apprAdminSetYn?: string;
  apprDefaultLineYn?: string;
  apprCondLineYn?: string;
  apprChangeAllowYn?: string;
  apprSkipUpperYn?: string;
  fullyApproveYn?: string;
  // 4단계: 수신·공유 설정
  receiveYn?: string;
  receiveTiming?: string;
  receiveChangeYn?: string;
  shareScope?: string;
  shareTiming?: string;
  shareChangeYn?: string;
  referenceYn?: string;
  referenceTiming?: string;
  referenceChangeYn?: string;
  // 공유그룹 + 권한 대상
  targets?: FormTemplateTargetVO[];
  createUser?: string;
  updateUser?: string;
  // 목록 조회 시 현재 사용자 기준 권한 (서버 계산값)
  hasWriteAuth?: boolean;
  hasReadAuth?: boolean;
};

export function formTemplateApi(client: ApiClient) {
  return {
    getList: async (categoryCode?: string, templateName?: string) => {
      const { data } = await client.axios.get("/api/organization/form-template", {
        params: { categoryCode, templateName },
      });
      return data.data as FormTemplateVO[];
    },

    getDetail: async (formTemplateSeq: string) => {
      const { data } = await client.axios.get(`/api/organization/form-template/${formTemplateSeq}`);
      return data.data as FormTemplateVO;
    },

    save: async (payload: FormTemplateVO) => {
      const { data } = await client.axios.post("/api/organization/form-template", payload);
      return data;
    },

    delete: async (formTemplateSeq: string) => {
      const { data } = await client.axios.delete(
        `/api/organization/form-template/${formTemplateSeq}`,
      );
      return data;
    },
  };
}
