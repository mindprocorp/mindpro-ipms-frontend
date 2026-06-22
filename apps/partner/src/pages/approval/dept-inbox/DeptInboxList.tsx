import { approvalApi } from "@shared/api/approval/approvalApi";
import { apiClient } from "@shared/api/client";
import ApprovalDocTable from "../_common/ApprovalDocTable";

const DeptInboxList = () => (
  <ApprovalDocTable
    title="부서 수신함"
    description="소속 부서로 수신된 승인 완료 문서입니다."
    fetchFn={(keyword) => approvalApi(apiClient).getDeptInboxList(keyword)}
  />
);

export default DeptInboxList;
