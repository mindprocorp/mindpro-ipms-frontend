import { approvalApi } from "@shared/api/approval/approvalApi";
import { apiClient } from "@shared/api/client";
import ApprovalDocTable from "../_common/ApprovalDocTable";

const InboxList = () => (
  <ApprovalDocTable
    title="문서 수신함"
    description="본인에게 수신된 승인 완료 문서입니다."
    fetchFn={(keyword) => approvalApi(apiClient).getInboxList(keyword)}
  />
);

export default InboxList;
