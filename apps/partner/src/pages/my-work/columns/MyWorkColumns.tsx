import type { ColumnDef } from "@tanstack/react-table";
import { Badge, cn, Checkbox } from "@repo/ui";
import { formatDate } from "@shared/util/formatUtil";

// 기일 관리 실제 JSON 응답 구조에 맞춰 accessorKey 및 렌더링 로직을 최적화합니다.
export const getColumns = (props?: { onToggleComplete?: (rowData: any) => void }): ColumnDef<any>[] => [
  {
    id: "status",
    header: "완료",
    size: 64,
    cell: ({ row }) => {
      const isComplete = row.original.duedateCompleteYn === "Y";
      return (
        <div
          className="w-full h-full min-h-[40px] flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            props?.onToggleComplete?.(row.original);
          }}
        >
          {isComplete ? (
            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] cursor-pointer hover:bg-emerald-100">
              완료
            </Badge>
          ) : (
            <Badge className="bg-slate-100 text-slate-400 border-none font-bold text-[10px] cursor-pointer hover:bg-blue-50 hover:text-blue-500">
              미처리
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dueType",
    header: "구분",
    size: 100,
    cell: ({ row }) => <span className="text-xs font-medium">{row.original.dueType?.codeName || row.original.classification || "-"}</span>
  },
  {
    accessorKey: "deadline",
    header: "마감일",
    size: 100,
    cell: ({ row }) => {
      const rawDate = row.original.deadline || row.original.duedateDate || "";
      const isComplete = row.original.duedateCompleteYn === "Y";

      let isUrgent = false;
      if (!isComplete && rawDate) {
        const cleanDate = rawDate.replace(/\D/g, "");
        if (cleanDate.length === 8) {
          const y = parseInt(cleanDate.slice(0, 4));
          const m = parseInt(cleanDate.slice(4, 6)) - 1;
          const d = parseInt(cleanDate.slice(6, 8));
          if (new Date(y, m, d) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
            isUrgent = true;
          }
        }
      }

      return (
        <span className={cn(
          "font-bold text-[11px]",
          isUrgent ? "text-red-500" : "text-slate-500",
          isComplete && "line-through opacity-40"
        )}>
          {formatDate(rawDate) || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "titleKo",
    header: "사건명 / 업무내용",
    size: 250,
    cell: ({ row }) => {
       const isComplete = row.original.duedateCompleteYn === "Y";
       const title = row.original.titleKo || row.original.dueType?.codeName || row.original.note || "-";
       return (
         <div className={cn(
           "text-left font-bold text-slate-700 text-xs truncate",
           isComplete && "line-through text-slate-400 opacity-60"
         )} title={title}>
           {title}
         </div>
       );
    }
  },
  {
    accessorKey: "client",
    header: "고객사",
    size: 120,
    cell: ({ row }) => {
      const client = row.original.client;
      const clientName = client?.userName || client?.clientNameKo || (typeof client === "string" ? client : "-");
      return <span className="text-xs truncate">{clientName}</span>;
    }
  },
];
