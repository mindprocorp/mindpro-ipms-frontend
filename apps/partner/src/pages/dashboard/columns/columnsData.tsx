import type { ColumnDef } from "@tanstack/react-table";
import { type DashboardRecentCase } from "@shared/schema/dashboard/dashboardSchema";
import { Button, Icons } from "@repo/ui";
import { Link } from "react-router-dom";

// 코드값 매핑 (임시 - 공통 코드 연동 전까지)
const getAppStateName = (code?: string) => {
  if (!code) return "-";
  const maps: Record<string, string> = {
    "10": "신규",
    "20": "진행",
    "30": "완료",
    "40": "취하",
    "50": "포기",
  };
  return maps[code] || code;
};

/**
 * 대시보드 최근 사건 그리드 컬럼 정의
 */
export const columnsData: ColumnDef<DashboardRecentCase>[] = [
  {
    accessorKey: "createDate",
    header: "접수일",
    size: 100,
  },
  {
    accessorKey: "rightCategory",
    header: "권리구분",
    size: 100,
  },
  {
    accessorKey: "appNo",
    header: "출원번호",
    size: 150,
  },
  {
    accessorKey: "titleKo",
    header: "사건명(한글)",
    size: 300,
    className: "text-left",
  },
  {
    accessorKey: "appState",
    header: "출원상태",
    size: 120,
    cell: ({ row }) => {
      const state = row.original.appState;
      // 매핑된 값이 없으면 코드값 그대로 노출 (디버깅 용이)
      return <span className="font-medium text-blue-600 dark:text-blue-400">{getAppStateName(state)}</span>;
    },
  },
  {
    accessorKey: "state",
    header: "현재상태",
    size: 120,
  },
  {
    id: "actions",
    header: "상세보기",
    size: 100,
    cell: ({ row }) => (
      <Link 
        to={`/domestic/detail/${row.original.appSeq}`}
        onClick={() => console.log("Navigating to detail:", row.original.appSeq)}
      >
        <Button variant="outline" size="sm" className="h-8 px-3 text-[11px] font-bold border-blue-200 text-blue-600 hover:bg-blue-50">
          이동하기
        </Button>
      </Link>
    ),
  },
];
