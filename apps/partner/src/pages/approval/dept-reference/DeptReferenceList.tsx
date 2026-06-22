import { approvalApi } from "@shared/api/approval/approvalApi";
import { apiClient } from "@shared/api/client";
import ApprovalDocTable from "../_common/ApprovalDocTable";

const DeptReferenceList = () => (
  <ApprovalDocTable
    title="부서 참조/열람"
    description="소속 부서가 참조로 지정된 문서입니다."
    fetchFn={(keyword) => approvalApi(apiClient).getDeptReferenceList(keyword)}
  />
);

export default DeptReferenceList;
