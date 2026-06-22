import { BaseLabel, Button, InfiniteDataTable } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";

const data: Payment[] = [
  {
    id: "1234-568-987",
    ckey01: "Republic",
    ckey02: "NHP-2012-10-003",
    ckey03: "출원테스트 요청",
    ckey04: "업체명 노출",
    ckey05: "투자총괄여부",
    ckey06: "홍길동",
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
    accessorKey: "ckey01",
    header: "년도",
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    size: 10000,
  },
  {
    accessorKey: "ckey02",
    header: "금액",
    cell: (info) => (
      <Button variant="link-blue" className="h-auto capitalize" size="h24">
        {info.getValue()}
      </Button>
    ),
    size: 10000,
    meta: {
      cellAlign: "right",
    },
  },
  {
    accessorKey: "ckey03",
    header: "누계",
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    size: 10000,
  },
  {
    accessorKey: "ckey04",
    header: "증가율(연도별)",
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    size: 10000,
  },
];

export const Table08 = () => {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <BaseLabel label="년도별 투자실적" />
      </div>
      <InfiniteDataTable data={data} columns={columnsData} size="sm" className="min-w-0 flex-1" />
    </div>
  );
};
