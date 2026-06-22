import { orgApi, type DeptCreateRequest, type DeptUpdateRequest, type OfficeCodeVO } from "../../api/organization/orgApi";
import { formTemplateApi, type FormTemplateVO } from "../../api/organization/formTemplateApi";
import { apprTemplateApi, type ApprTemplateVO } from "../../api/organization/apprTemplateApi";
import { employeeApi } from "../../api/organization/employeeApi";
import { approvalApi, type ApprDocVO, type ApprovalActionRequest } from "../../api/approval/approvalApi";
import { apiClient } from "../../api/client";
import { mutationOptions } from "@tanstack/react-query";

/* ── 조직 관리 ── */
export const orgQueries = {
  getDeptTree: () =>
    mutationOptions({
      mutationFn: () => orgApi(apiClient).getDeptTree(),
    }),
  createDept: () =>
    mutationOptions({
      mutationFn: (payload: DeptCreateRequest) => orgApi(apiClient).createDept(payload),
    }),
  deleteDept: () =>
    mutationOptions({
      mutationFn: (deptSeq: string) => orgApi(apiClient).deleteDept(deptSeq),
    }),
  updateDept: () =>
    mutationOptions({
      mutationFn: (payload: DeptUpdateRequest) =>
        orgApi(apiClient).updateDept(payload),
    }),
  getOfficeCodeList: () =>
    mutationOptions({
      mutationFn: ({ codeClass }: { codeClass: string }) =>
        orgApi(apiClient).getOfficeCodeList(codeClass),
    }),
  getOrCreateCode: () =>
    mutationOptions({
      mutationFn: ({ codeClass, codeName }: { codeClass: string; codeName: string }) =>
        orgApi(apiClient).getOrCreateCode(codeClass, codeName),
    }),
  updateCode: () =>
    mutationOptions({
      mutationFn: (payload: OfficeCodeVO) => orgApi(apiClient).updateCode(payload),
    }),
  deleteCode: () =>
    mutationOptions({
      mutationFn: (officeCodeSeq: string) =>
        apiClient.axios.delete(`/api/organization/code/${officeCodeSeq}`),
    }),
};

/* ── 서식 템플릿 ── */
export const formTemplateQueries = {
  getList: () =>
    mutationOptions({
      mutationFn: ({ categoryCode, templateName }: { categoryCode?: string; templateName?: string }) =>
        formTemplateApi(apiClient).getList(categoryCode, templateName),
    }),
  getDetail: () =>
    mutationOptions({
      mutationFn: (formTemplateSeq: string) => formTemplateApi(apiClient).getDetail(formTemplateSeq),
    }),
  save: () =>
    mutationOptions({
      mutationFn: (payload: FormTemplateVO) => formTemplateApi(apiClient).save(payload),
    }),
  delete: () =>
    mutationOptions({
      mutationFn: (formTemplateSeq: string) => formTemplateApi(apiClient).delete(formTemplateSeq),
    }),
};

/* ── 직원 관리 ── */
export const employeeQueries = {
  getList: () =>
    mutationOptions({
      mutationFn: (params: import("@shared/api/organization/employeeApi").EmployeeSearchParams) =>
        employeeApi(apiClient).getList(params),
    }),
  getPendingList: () =>
    mutationOptions({
      mutationFn: () => employeeApi(apiClient).getPendingList(),
    }),
  update: () =>
    mutationOptions({
      mutationFn: (payload: { userMstSeq: string; userNameKo?: string; userEmail?: string; userMobileNo?: string; userAddr?: string; userAddrDetail?: string; userPostNo?: string; deptName?: string; userPosition?: string; jobGradeCode?: string; workCode?: string; userTypeCode?: string; workStatusCode?: string; employStatusCode?: string; acctStatusCode?: string; roleSeq?: string; updateUser?: string }) =>
        employeeApi(apiClient).update(payload),
    }),
  reject: () =>
    mutationOptions({
      mutationFn: (userMstSeq: string) => employeeApi(apiClient).reject(userMstSeq),
    }),
  adminCreate: () =>
    mutationOptions({
      mutationFn: (payload: Parameters<ReturnType<typeof employeeApi>["adminCreate"]>[0]) =>
        employeeApi(apiClient).adminCreate(payload),
    }),
};

/* ── 결재 문서 ── */
export const approvalQueries = {
  saveDoc: () =>
    mutationOptions({
      mutationFn: (payload: ApprDocVO) => approvalApi(apiClient).saveDoc(payload),
    }),
  getDoc: () =>
    mutationOptions({
      mutationFn: (docSeq: string) => approvalApi(apiClient).getDoc(docSeq),
    }),
  getMyDraftList: () =>
    mutationOptions({
      mutationFn: ({ docStatus, keyword }: { docStatus?: string; keyword?: string } = {}) =>
        approvalApi(apiClient).getMyDraftList(docStatus, keyword),
    }),
  getPendingList: () =>
    mutationOptions({
      mutationFn: (keyword?: string) => approvalApi(apiClient).getPendingList(keyword),
    }),
  getReferenceList: () =>
    mutationOptions({
      mutationFn: (keyword?: string) => approvalApi(apiClient).getReferenceList(keyword),
    }),
  getDeptInboxList: () =>
    mutationOptions({
      mutationFn: (keyword?: string) => approvalApi(apiClient).getDeptInboxList(keyword),
    }),
  getDeptReferenceList: () =>
    mutationOptions({
      mutationFn: (keyword?: string) => approvalApi(apiClient).getDeptReferenceList(keyword),
    }),
  getInboxList: () =>
    mutationOptions({
      mutationFn: (keyword?: string) => approvalApi(apiClient).getInboxList(keyword),
    }),
  processApproval: () =>
    mutationOptions({
      mutationFn: ({ docSeq, lineSeq, payload }: { docSeq: string; lineSeq: string; payload: ApprovalActionRequest }) =>
        approvalApi(apiClient).processApproval(docSeq, lineSeq, payload),
    }),
  withdrawDoc: () =>
    mutationOptions({
      mutationFn: (docSeq: string) => approvalApi(apiClient).withdrawDoc(docSeq),
    }),
  deleteDoc: () =>
    mutationOptions({
      mutationFn: (docSeq: string) => approvalApi(apiClient).deleteDoc(docSeq),
    }),
};

/* ── 결재선 템플릿 ── */
export const apprTemplateQueries = {
  getList: () =>
    mutationOptions({
      mutationFn: ({ templateName }: { templateName?: string }) =>
        apprTemplateApi(apiClient).getList(templateName),
    }),
  getDetail: () =>
    mutationOptions({
      mutationFn: (apprTemplateSeq: string) => apprTemplateApi(apiClient).getDetail(apprTemplateSeq),
    }),
  save: () =>
    mutationOptions({
      mutationFn: (payload: ApprTemplateVO) => apprTemplateApi(apiClient).save(payload),
    }),
  delete: () =>
    mutationOptions({
      mutationFn: (apprTemplateSeq: string) => apprTemplateApi(apiClient).delete(apprTemplateSeq),
    }),
};
