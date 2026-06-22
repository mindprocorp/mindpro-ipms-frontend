import { Button, Icons } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { ApprTemplateVO, ApprTemplateLineVO } from "@shared/api/organization/apprTemplateApi";

/** 결재선 배지 체인 (병렬 지원) */
export const ApprLineBadges = ({ lines }: { lines?: ApprTemplateLineVO[] }) => {
  if (!lines?.length) return <span className="text-muted-foreground text-xs">-</span>;

  // stepOrder 기준 그룹핑
  const groups: { order: string; name: string; approvers: string[] }[] = [];
  for (const l of lines) {
    const existing = groups.find((g) => g.order === l.stepOrder);
    const label = l.approverName || "";
    if (existing) {
      if (label) existing.approvers.push(label);
    } else {
      groups.push({ order: l.stepOrder, name: l.stepName, approvers: label ? [label] : [] });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {groups.map((g, i) => (
        <span key={g.order} className="flex items-center gap-1">
          {i > 0 && <Icons.ChevronRight className="text-muted-foreground size-3.5" />}
          <span className="whitespace-nowrap rounded-full border bg-muted/40 px-3 py-1 text-xs">
            {g.name}
            {g.approvers.length === 1 && `: ${g.approvers[0]}`}
            {g.approvers.length > 1 && `: ${g.approvers[0]} 외 ${g.approvers.length - 1}명`}
          </span>
        </span>
      ))}
    </div>
  );
};

export const getColumnsData = (
  onEdit: (seq: string) => void,
  onDelete: (item: ApprTemplateVO) => void,
  total: number,
): ColumnDef<ApprTemplateVO>[] => [
  { id: "no", header: "번호", size: 20, cell: ({ row }) => total - row.index },
  { accessorKey: "templateName", header: "결재선 명", size: 70 },
  {
    id: "line",
    header: "결재선",
    cell: ({ row }) => <ApprLineBadges lines={row.original.lines} />,
  },
  {
    id: "edit",
    header: "수정",
    size: 20,
    cell: ({ row }) => (
      <Button size="icon-xs" variant="ghost" onClick={() => onEdit(row.original.apprTemplateSeq!)}>
        <Icons.Pencil className="size-4" />
      </Button>
    ),
  },
  {
    id: "delete",
    header: "삭제",
    size: 20,
    cell: ({ row }) => (
      <Button size="icon-xs" variant="ghost-red" onClick={() => onDelete(row.original)}>
        <Icons.Trash2 className="size-4" />
      </Button>
    ),
  },
];
