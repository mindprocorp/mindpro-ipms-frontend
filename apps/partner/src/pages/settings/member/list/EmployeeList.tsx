import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FlatTab } from "@shared/ui/tab/ui/Tabs";
import { apiClient } from "@shared/api/client";
import EmployeeListTab from "./_tabs/EmployeeListTab";
import EmployeeApprovalTab from "./_tabs/EmployeeApprovalTab";

const EmployeeList = () => {
  const [activeTab, setActiveTab] = useState("list");

  // 승인 대기 직원 카운트 (탭 라벨 옆 (N) 표시용 — 30초 폴링)
  const { data: pendingCount = 0 } = useQuery({
    queryKey: ["pendingEmployees", "count"],
    queryFn: async () => {
      const { data } = await apiClient.axios.get<{ data: unknown[] }>("/api/users/pending-employees");
      return Array.isArray(data?.data) ? data.data.length : 0;
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  const tabs = useMemo(
    () => [
      { label: "직원 리스트", value: "list" },
      { label: pendingCount > 0 ? `직원 승인 (${pendingCount})` : "직원 승인", value: "approval" },
    ],
    [pendingCount],
  );

  return (
    <>
      <PageTitleArea className="pb-2" title="직원 정보 관리" />
      <FlatTab items={tabs} active={activeTab} onChange={setActiveTab} className="mb-4" />
      {activeTab === "list" ? <EmployeeListTab /> : <EmployeeApprovalTab />}
    </>
  );
};

export default EmployeeList;
