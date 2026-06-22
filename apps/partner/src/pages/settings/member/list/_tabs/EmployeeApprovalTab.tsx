import { useState, useEffect, useMemo } from "react";
import { Button, DataTable, Icons } from "@repo/ui";
import ListResultHeader from "@shared/ui/ListResultHeader";
import { employeeQueries } from "@shared/query/organization/queries";
import { commonQueries } from "@shared/query/common/queries";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useMutation } from "@tanstack/react-query";
import { officeMembershipApi } from "@shared/api/user/officeMembershipApi";
import ApproveEmployeeModal from "./ApproveEmployeeModal";
import RejectEmployeeModal from "./RejectEmployeeModal";
import type { EmployeeVO } from "@shared/api/organization/employeeApi";
import type { CodeDetail } from "@shared/api/common/commApi";
import type { ColumnDef } from "@tanstack/react-table";

const EmployeeApprovalTab = () => {
  const { openAlert } = useAlertStore();
  const user = useAuthStore((s) => s.user);

  const getPendingListMutation = useMutation(employeeQueries.getPendingList());
  const approveMutation = officeMembershipApi.useApproveEmployee();
  // rejectMutation 제거됨 — RejectEmployeeModal에서 자체 처리 (관리자 비번 확인 포함)
  const getAcctStatusMutation = useMutation(commonQueries.getCodeDetail());

  const [pendingList, setPendingList] = useState<EmployeeVO[]>([]);
  const [acctStatuses, setAcctStatuses] = useState<CodeDetail[]>([]);
  const [approveTarget, setApproveTarget] = useState<{ userMstSeq: string; userName: string } | null>(null);
  const [rejectTarget, setRejectTarget] = useState<{ userMstSeq: string; userName: string } | null>(null);
  // 승인/거부 처리 완료된 행을 잠깐 보여주기 위한 로컬 상태 — 다음 fetch 시 제거됨
  const [processedMap, setProcessedMap] = useState<Record<string, "approved" | "rejected">>({});

  const fetchData = async () => {
    const [data, codes] = await Promise.allSettled([
      getPendingListMutation.mutateAsync(),
      getAcctStatusMutation.mutateAsync("ACCT_STATUS"),
    ]);
    if (data.status === "fulfilled") setPendingList(data.value);
    if (codes.status === "fulfilled") setAcctStatuses(codes.value);
  };

  const markProcessed = (userMstSeq: string, kind: "approved" | "rejected") => {
    setProcessedMap((prev) => ({ ...prev, [userMstSeq]: kind }));
    // 처리됨 표시를 잠깐 보여준 후 서버 기준 목록으로 갱신
    setTimeout(() => {
      fetchData().then(() => setProcessedMap({}));
    }, 1200);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 승인 시 사용할 '사용중' 코드
  const approveCode = useMemo(
    () => acctStatuses.find((c) => c.cdNm?.includes("사용") || c.cdNm?.includes("정상"))?.dtlCd ?? "",
    [acctStatuses],
  );

  const handleApprove = (emp: EmployeeVO) => {
    if (!emp.userMstSeq) return;
    setApproveTarget({ userMstSeq: emp.userMstSeq, userName: emp.userNameKo ?? "" });
  };

  const handleReject = (emp: EmployeeVO) => {
    if (!emp.userMstSeq) return;
    setRejectTarget({ userMstSeq: emp.userMstSeq, userName: emp.userNameKo ?? "" });
  };

  const columns: ColumnDef<EmployeeVO>[] = useMemo(
    () => [
      {
        id: "no",
        header: "번호",
        size: 50,
        cell: ({ row }) => pendingList.length - row.index,
      },
      {
        accessorKey: "userNameKo",
        header: "이름",
        size: 80,
        cell: ({ getValue }) => <span className="block truncate">{getValue() as string}</span>,
      },
      {
        accessorKey: "userEmail",
        header: "이메일",
        size: 180,
        cell: ({ getValue }) => <span className="block truncate">{getValue() as string}</span>,
      },
      {
        accessorKey: "userMobileNo",
        header: "휴대폰",
        size: 120,
        cell: ({ getValue }) => <span>{getValue() as string}</span>,
      },
      {
        id: "acctStatus",
        header: "계정 상태",
        size: 90,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">{row.original.acctStatus?.name || "-"}</span>
        ),
      },
      {
        accessorKey: "createAt",
        header: "가입일",
        size: 120,
        cell: ({ getValue }) => <span className="text-xs">{(getValue() as string)?.slice(0, 10) || "-"}</span>,
      },
      {
        id: "actions",
        header: "처리",
        size: 160,
        cell: ({ row }) => {
          const seq = row.original.userMstSeq || "";
          const processed = processedMap[seq];
          if (processed) {
            return (
              <span
                className={
                  "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium " +
                  (processed === "approved"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700")
                }
              >
                {processed === "approved" ? (
                  <Icons.Check className="size-3" />
                ) : (
                  <Icons.X className="size-3" />
                )}
                {processed === "approved" ? "승인완료" : "거부완료"}
              </span>
            );
          }
          return (
            <div className="flex gap-1">
              <Button
                size="h28"
                variant="blue"
                disabled={!!approveTarget || !!rejectTarget}
                onClick={() => handleApprove(row.original)}
              >
                <Icons.Check className="size-3" /> 승인
              </Button>
              <Button
                size="h28"
                variant="red"
                disabled={!!approveTarget || !!rejectTarget}
                onClick={() => handleReject(row.original)}
              >
                <Icons.X className="size-3" /> 거부
              </Button>
            </div>
          );
        },
      },
    ],
    [pendingList, approveTarget, rejectTarget, processedMap],
  );

  return (
    <>
      <ListResultHeader totalCount={pendingList.length} />
      <DataTable
        data={pendingList}
        columns={columns}
        className="overflow-auto"
      />
      {approveTarget && (
        <ApproveEmployeeModal
          open
          onOpenChange={(o) => !o && setApproveTarget(null)}
          userMstSeq={approveTarget.userMstSeq}
          userName={approveTarget.userName}
          onApproved={() => markProcessed(approveTarget.userMstSeq, "approved")}
        />
      )}
      {rejectTarget && (
        <RejectEmployeeModal
          open
          onOpenChange={(o) => !o && setRejectTarget(null)}
          userMstSeq={rejectTarget.userMstSeq}
          userName={rejectTarget.userName}
          onRejected={() => markProcessed(rejectTarget.userMstSeq, "rejected")}
        />
      )}
    </>
  );
};

export default EmployeeApprovalTab;
