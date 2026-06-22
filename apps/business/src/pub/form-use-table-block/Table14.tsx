import { BaseLabel, Button, Checkbox, Icons, InfiniteDataTable, RHF } from "@repo/ui";
import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";

const data: Payment[] = [
  {
    id: "1234-568-987",
    ckey01: "마이크로소프트",
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

type Table10Props = {
  form: UseFormReturn<any>;
};

export const Table14 = ({ form }: Table10Props) => {
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
        header: "업체명",
        cell: (info: any) => info.getValue(),
        size: 10000,
        meta: {
          cellAlign: "left",
        },
      },
      {
        accessorKey: "ckey02",
        header: "지분율(%)",
        cell: (info: any) => {
          return <RHF.Input control={form.control} name="val1" size="h24" align="right" />;
        },
        size: 200,
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <BaseLabel label="귀속권리" />
        <div className="flex gap-1">
          <Button variant="outline-blue" size="h24" className="">
            <Icons.Plus />
            추가
          </Button>

          <Button size="h24" className="">
            <Icons.Plus />
            선택삭제
          </Button>

          <Button variant="outline-pink" size="h24" className="">
            <Icons.Plus />
            지분율 자동계산
          </Button>
        </div>
      </div>
      <InfiniteDataTable data={data} columns={columnsData} size="sm" className="min-w-0 flex-1" />
    </div>
  );
};
