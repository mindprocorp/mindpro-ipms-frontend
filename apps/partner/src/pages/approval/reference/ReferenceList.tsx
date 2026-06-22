import { approvalApi } from "@shared/api/approval/approvalApi";
import { apiClient } from "@shared/api/client";
import ApprovalDocTable from "../_common/ApprovalDocTable";

const ReferenceList = () => (
  <ApprovalDocTable
    title="결재 참조/열람"
    description="본인이 공유 대상으로 지정된 문서입니다."
    fetchFn={(keyword) => approvalApi(apiClient).getReferenceList(keyword)}
  />
);

export default ReferenceList;
