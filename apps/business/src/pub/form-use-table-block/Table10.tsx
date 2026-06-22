import { BaseLabel, Button, Checkbox, Icons, InfiniteDataTable, RHF } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";

const data: Payment[] = [
  {
    id: "1234-568-987",
    ckey01: "현대자동차",
    ckey02: "현대자동차",
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

type Table10Props = {
  form: UseFormReturn<any>;
};

export const Table10 = ({ form }: Table10Props) => {
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
        header: "구분",
        cell: (info: any) => {
          return (
            <RHF.FormSelect
              control={form.control}
              name="val1"
              items={[
                {
                  value: "test1",
                  label: "테스트 라벨1",
                },
                {
                  value: "test2",
                  label: "테스트 라벨2",
                },
              ]}
              size="h24"
            />
          );
        },
        size: 150,
        meta: {
          cellAlign: "left",
        },
      },
      {
        accessorKey: "ckey02",
        header: "고객사명",
        cell: (info) => info.getValue(),
        size: 10000,
        meta: {
          cellAlign: "left",
        },
      },
      {
        accessorKey: "ckey03",
        header: "투자금액(억원)",
        cell: (info) => info.getValue(),
        size: 10000,
        meta: {
          cellAlign: "right",
        },
      },
      {
        accessorKey: "ckey04",
        header: "메출금액(억원)",
        cell: (info) => info.getValue(),
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
        <BaseLabel label="고객사별 예상매출" />
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
