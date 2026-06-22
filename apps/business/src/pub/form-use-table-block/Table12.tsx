import { BaseLabel, Button, Checkbox, cn, Icons, InfiniteDataTable, RHF } from "@repo/ui";
import { OrganizationPopup } from "@shared/organization/ui/Popup";
import { AddItemModal } from "pub/modal/AddItemModal";
import { useEffect, useMemo, useState } from "react";
import { useController, useFieldArray, type UseFormReturn } from "react-hook-form";
const appendItem = {
  id: "1234-568-987",
  ckey01: "",
  ckey02: "",
  ckey03: "",
  ckey04: "",
  ckey05: "",
  ckey06: "",
  ckey07: "재직",
  ckey08: "",
  ckey09: "내부",
  ckey10: "",
  ckey11: "",
  ckey12: "",
  ckey13: "",
  ckey14: "",
  ckey15: "",
};

const data: Payment[] = [
  {
    id: "1234-568-987",
    ckey01: "Y",
    ckey02: "123-456",
    ckey03: "홍길동",
    ckey04: "hong gil dong",
    ckey05: "",
    ckey06: "법무팀",
    ckey07: "",
    ckey08: "10",
    ckey09: "내부",
    ckey10: "ken99@example.com",
    ckey11: "ken99@example.com",
    ckey12: "ken99@example.com",
    ckey13: "ken99@example.com",
    ckey14: "ken99@example.com",
    ckey15: "ken99@example.com",
  },
  {
    id: "1234-568-987",
    ckey01: "N",
    ckey02: "123-456",
    ckey03: "홍길동",
    ckey04: "hong gil dong",
    ckey05: "",
    ckey06: "법무팀",
    ckey07: "",
    ckey08: "10",
    ckey09: "내부",
    ckey10: "ken99@example.com",
    ckey11: "ken99@example.com",
    ckey12: "ken99@example.com",
    ckey13: "ken99@example.com",
    ckey14: "ken99@example.com",
    ckey15: "ken99@example.com",
  },
  {
    id: "1234-568-987",
    ckey01: "N",
    ckey02: "123-456",
    ckey03: "홍길동",
    ckey04: "hong gil dong",
    ckey05: "",
    ckey06: "법무팀",
    ckey07: "",
    ckey08: "10",
    ckey09: "내부",
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
  form: UseFormReturn<any>;
  hiddenCheck?: boolean;
  onlyRead?: boolean;
};

export const Table12 = ({ form, hiddenCheck, onlyRead }: TableProps) => {
  const { append, remove, update, fields } = useFieldArray({
    name: "tableArray",
    control: form.control,
  });
  const { field } = useController({ name: "selId", control: form.control });

  const appendHandler = () => {
    append(appendItem);
  };

  const updateHandler = (idx) => {
    field.onChange(idx);
  };

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
        header: "주",
        cell: (info: any) => {
          const idx = info.row.original.ckey02;
          const checked = info.row.original.ckey02 === field.value;

          return (
            <Button
              id={idx}
              data-selected={checked ? "true" : "false"}
              className={cn(
                `data-[selected=true]:border-p-color-1 relative h-4 w-4 rounded-full p-0 ${onlyRead ? "cursor-default" : ""}`,
              )}
              onClick={() => (onlyRead ? null : updateHandler(idx))}
            >
              {checked && (
                <span className="bg-p-color-1 absolute top-1/2 left-1/2 h-2 w-2 -translate-1/2 rounded-full"></span>
              )}
            </Button>
          );
        },
        size: 60,
      },
      {
        accessorKey: "ckey02",
        header: "사번",
        cell: (info: any) => {
          if (onlyRead) {
            return info.getValue();
          }
          return (
            <div className="flex items-center gap-2">
              {info.getValue()}
              {/* <Button className="absolute top-1/2 right-0 h-5 w-5 -translate-1/2 p-0">
                <Icons.Search className="size-3" />
              </Button> */}
            </div>
          );
        },
        size: 150,
      },
      {
        accessorKey: "ckey03",
        header: "성명(국문)",
        cell: (info: any) => {
          return info.getValue();
        },
        size: 10000,
        meta: {
          cellAlign: "left",
        },
      },
      {
        accessorKey: "ckey04",
        header: "성명(영문)",
        cell: (info: any) => {
          return info.getValue();
        },
        size: 10000,
        meta: {
          cellAlign: "left",
        },
      },
      {
        accessorKey: "ckey05",
        header: "성명(한문)",
        cell: (info: any) => {
          return info.getValue();
        },
        size: 10000,
        meta: {
          cellAlign: "left",
        },
      },
      {
        accessorKey: "ckey06",
        header: "팀",
        cell: (info: any) => info.getValue(),
        size: 200,
        meta: {
          cellAlign: "left",
        },
      },
      {
        accessorKey: "ckey07",
        header: "휴퇴구분",
        cell: (info: any) => {
          return info.getValue();
        },
        size: 100,
      },
      {
        accessorKey: "ckey08",
        header: "지분율(%)",
        cell: (info: any) => {
          const rowId = info.row.id;
          if (onlyRead) {
            return info.getValue();
          }
          return (
            <RHF.Input
              control={form.control}
              name={`tableArray.${rowId}.ckey08`}
              size="h24"
              align="right"
            />
          );
        },
        size: 100,
      },
      {
        accessorKey: "ckey09",
        header: "내외",
        cell: (info: any) => {
          return info.getValue();
        },
        size: 100,
      },
    ],
    [field.value],
  );

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <BaseLabel label="발명자" ess />
        <div className="flex gap-1">
          <Button variant="outline-blue" size="h24" className="" onClick={appendHandler}>
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
      <InfiniteDataTable
        data={fields}
        columns={columnsData}
        size="sm"
        className="min-w-0 flex-1"
        hiddenCheck={hiddenCheck}
      />
    </div>
  );
};
