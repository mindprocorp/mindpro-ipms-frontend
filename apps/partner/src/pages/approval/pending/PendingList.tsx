import { approvalApi } from "@shared/api/approval/approvalApi";
import { apiClient } from "@shared/api/client";
import ApprovalDocTable from "../_common/ApprovalDocTable";

const PendingList = () => (
  <ApprovalDocTable
    title="결재 대기함"
    description="본인이 결재권자로 지정된 문서입니다."
    fetchFn={(keyword) => approvalApi(apiClient).getPendingList(keyword)}
    mode="pending"
  />
);

export default PendingList;
