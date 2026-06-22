import { BaseLabel, Button, Checkbox, Icons, InfiniteDataTable } from "@repo/ui";
import { useMemo } from "react";

const data: Payment[] = [
  {
    id: "1234-568-987",
    ckey01: "NHP-2012-10-003",
    ckey02: "NHP-2012-10-003",
    ckey03: "2025-11-20",
    ckey04: "특허",
    ckey05: "홍길동",
    ckey06: "발명의명칭을 입력합니다.",
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

type TableProps = {
  hiddenCheck?: boolean;
};

export const Table13 = ({ hiddenCheck }: TableProps) => {
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
        header: "REF-NO",
        cell: (info: any) => info.getValue(),
        size: 200,
      },
      {
        accessorKey: "ckey02",
        header: "출원번호",
        cell: (info: any) => info.getValue(),
        size: 200,
      },
      {
        accessorKey: "ckey03",
        header: "출원일",
        cell: (info: any) => info.getValue(),
        size: 150,
      },
      {
        accessorKey: "ckey04",
        header: "권리",
        cell: (info: any) => info.getValue(),
        size: 150,
      },
      {
        accessorKey: "ckey05",
        header: "건담당자",
        cell: (info: any) => info.getValue(),
        size: 150,
      },
      {
        accessorKey: "ckey06",
        header: "발명의 명칭",
        cell: (info: any) => info.getValue(),
        size: 10000,
        meta: {
          cellAlign: "left",
        },
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <BaseLabel label="인용 REF" />
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
      <InfiniteDataTable
        data={data}
        columns={columnsData}
        size="sm"
        className="min-w-0 flex-1"
        hiddenCheck={hiddenCheck}
      />
    </div>
  );
};
