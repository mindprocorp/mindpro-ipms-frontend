import { BaseLabel, Button, Checkbox, InfiniteDataTable, Icons } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";

const data: Payment[] = [
  {
    id: "1234-568-987",
    ckey01: "특허",
    ckey02: "출원테스트 요청",
    ckey03: "S",
    ckey04: "진행중",
    ckey05: "Republic of Korea / KR",
    ckey06: "NHP-2012-10-003",
    ckey07: "홍길동",
    ckey08: "2025-11-330",
    ckey09: "ken99@example.com",
    ckey10: "ken99@example.com",
    ckey11: "ken99@example.com",
    ckey12: "ken99@example.com",
    ckey13: "ken99@example.com",
    ckey14: "ken99@example.com",
    ckey15: "ken99@example.com",
  },
];

export type Payment = {
  id: string;
  ckey01: string;
  ckey02: string;
  ckey03: string;
  ckey04: string;
  ckey05: string;
  ckey06: string;
  ckey07: string;
  ckey08: string;
  ckey09: string;
  ckey10: string;
  ckey11: string;
  ckey12: string;
  ckey13: string;
  ckey14: string;
  ckey15: string;
};

const columnsData: ColumnDef<Payment, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        size="sm"
      />
    ),
    size: 36,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        size="sm"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "의뢰번호",
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "ckey01",
    header: "권리구분",
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "ckey02",
    header: "의뢰제목",
    cell: (info) => (
      <Button variant="link-blue" className="h-auto capitalize" size="h24">
        {info.getValue()}
      </Button>
    ),
    size: 10000,
    meta: {
      cellAlign: "left",
    },
  },
  {
    accessorKey: "ckey03",
    header: "조사중요도",
    size: 100,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "ckey04",
    header: "진행상태",
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
  },
];

export const Table01 = () => {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <BaseLabel label="연관선행기술조사 및 문헌" />
        <div className="flex gap-1">
          <Button variant="outline-blue" size="h24" className="">
            <Icons.Plus />
            추가
          </Button>

          <Button size="h24" className="">
            <Icons.Plus />
            선택삭제
          </Button>
        </div>
      </div>
      <InfiniteDataTable data={data} columns={columnsData} size="sm" className="min-w-0 flex-1" />
    </div>
  );
};
