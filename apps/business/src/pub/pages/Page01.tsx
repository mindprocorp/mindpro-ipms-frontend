import { z } from "zod";
import { Button, RHF, Icons, DataTable, Checkbox } from "@repo/ui";
import { PageTitle } from "@shared/page-title/PageTitle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SearchSelect from "@shared/search-select/ui/SearchSelect";
import type { ColumnDef } from "@tanstack/react-table";
import { SearchBox } from "../SearchBox";

const SearchSchema = z.object({
  val1: z.string().default(""),
  val2: z.string().default(""),
  val3: z.string().default(""),
});

type SearchInput = z.input<typeof SearchSchema>;
type SearchOutput = z.input<typeof SearchSchema>;

const defaultValues = {
  val1: "",
  val2: "",
  val3: "",
};

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
];

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
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
    meta: {
      rowSpan: 2,
      align: "center",
    },
  },
  {
    accessorKey: "id",
    header: "id",
    // size: 40,
    // cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
    columns: [
      {
        header: "firstName",
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
      },
      {
        header: "lastName",
        accessorKey: "lastName",
        id: "lastName",
        cell: (info) => info.getValue(),
      },
    ],
  },
  {
    accessorKey: "amount",
    header: "권리",
    // size: 40,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      rowSpan: 2,
      align: "center",
    },
  },
  {
    accessorKey: "email",
    header: "email",
    // size: 40,
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "사건마감일",
    size: 200,
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
];

const Page01 = () => {
  const form = useForm<SearchInput>({
    resolver: zodResolver(SearchSchema),
    defaultValues,
  });

  return (
    <div>
      <PageTitle title="기한관리현황" />
      <div
        data-slot="search-box"
        className="border-border-100 bg-bg-100 relative flex flex-wrap gap-2 rounded-[6px] border p-4 pr-28 [&>div]:mr-4"
      >
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
          label="선택형"
          orientation="horizontal"
          className="w-fit [&>button]:w-40!"
        />

        <RHF.Input
          control={form.control}
          name="val1"
          label="일반입력"
          orientation="horizontal"
          className="w-fit [&>div]:w-40!"
        />

        <RHF.Input
          control={form.control}
          name="val1"
          label="검색필드"
          orientation="horizontal"
          prefix={<Icons.Search />}
          className="w-fit [&>div]:w-40!"
        />

        <RHF.FormDatePicker
          control={form.control}
          name="val1"
          label="날짜"
          orientation="horizontal"
          className="w-fit [&>div]:w-40!"
        />

        <RHF.FormDateFromToPicker
          control={form.control}
          name={["val", "val"]}
          label="from-to"
          orientation="horizontal"
          className="w-90 flex-none"
        />

        <RHF.Input
          control={form.control}
          name="val1"
          label="검색 셀렉트"
          orientation="horizontal"
          className="w-fit [&>div]:w-40!"
          actions={
            <>
              <SearchSelect control={form.control} name="testVal" />
            </>
          }
        />

        <RHF.FormField name="val1" label="복합 폼 요소" className="[&>div]:gap-1">
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
            orientation="horizontal"
            className="w-fit [&>button]:w-40!"
          />

          <RHF.Input
            control={form.control}
            name="val1"
            orientation="horizontal"
            className="w-fit [&>div]:w-40!"
            actions={
              <>
                <SearchSelect control={form.control} name="testVal" />
              </>
            }
          />
        </RHF.FormField>

        <Button variant="blue" className="absolute right-5 bottom-4">
          <Icons.Search />
          검색
        </Button>
      </div>

      <div className="">
        <div className="my-2 mt-4">
          <p className="text-text-200 text-sm">
            총 <span className="text-p-color-1 font-bold">100</span>건의 결과가 있습니다.
          </p>
        </div>
        <DataTable data={data} columns={columnsData} />
      </div>
    </div>
  );
};

export default Page01;
