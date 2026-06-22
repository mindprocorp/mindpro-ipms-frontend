import { BaseLabel, Button, Checkbox, Icons, InfiniteDataTable } from "@repo/ui";
import { useMemo } from "react";

const data: Payment[] = [
  {
    id: "1234-568-987",
    ckey01: "2025",
    ckey02: "30,000",
    ckey03: "30,000",
    ckey04: "30,000",
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

export const Table11 = () => {
  const columnsData = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: any) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            size="sm"
          />
        ),
        size: 36,
        cell: (info: any) => (
          <Checkbox
            checked={info.row.getIsSelected()}
            onCheckedChange={(value) => info.row.toggleSelected(!!value)}
            aria-label="Select row"
            size="sm"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "ckey01",
        header: "년도",
        cell: (info: any) => info.getValue(),
        size: 10000,
      },
      {
        accessorKey: "ckey02",
        header: "금액",
        cell: (info: any) => info.getValue(),
        size: 10000,
        meta: {
          cellAlign: "right",
        },
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <BaseLabel label="연도별 예상매출" />
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
