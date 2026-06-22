import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, DataTable, FormDialog, Icons, RHF } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";
import SearchSelect from "@shared/search-select/ui/SearchSelect";

type ModalProps = {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: any) => void;
};

const TestSchema = z.object({
  val1: z.string().default(""),
  val2: z.string().min(1, { message: "sdf" }).default(""),
  val3: z.string().default(""),
});

type TestInput = z.input<typeof TestSchema>;
type TestOutput = z.input<typeof TestSchema>;

type ListType = {
  id: string;
  classifn: string;
  title: string;
  Ipt: string;
  status: string;
  cnum: string;
};

const data: ListType[] = [
  {
    id: "China",
    classifn: "R1-C0020",
    title: "출원테스트 요청",
    Ipt: "홍길동",
    status: "2026-01-20",
    cnum: "1234",
  },
  {
    id: "China",
    classifn: "R1-C0020",
    title: "출원테스트 요청",
    Ipt: "홍길동",
    status: "2026-01-20",
    cnum: "1234",
  },
];

const columnsData: ColumnDef<ListType, any>[] = [
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
      align: "center",
    },
  },
  {
    accessorKey: "id",
    header: "REF-NO",
    cell: (info) => info.getValue(),
    meta: {
      align: "center",
    },
  },
  {
    accessorKey: "classifn",
    header: "발명의 명칭",
    // size: 40,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      align: "center",
    },
  },
  {
    accessorKey: "title",
    header: "출원번호",
    // size: 40,
    cell: (info) => (
      <Button variant="link-blue" className="h-auto capitalize">
        {info.getValue()}
      </Button>
    ),
  },
  {
    accessorKey: "Ipt",
    header: "출원일",
    size: 200,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      align: "center",
    },
  },
  {
    accessorKey: "status",
    header: "출원인",
    size: 200,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      align: "center",
    },
  },
  {
    accessorKey: "cnum",
    header: "등록번호",
    size: 120,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      align: "center",
    },
  },
];

export const Modal04 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });

  const onSubmit = (values: TestInput) => {
    const resultValue: TestOutput = TestSchema.parse(values);
    form.reset();
    onOpenChange(false);
    onSuccess?.(resultValue);
  };

  useEffect(() => {
    form.setValue("val1", "test1");
  }, []);

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={form.handleSubmit(onSubmit)}
        open={open}
        onOpenChange={onOpenChange}
        submitText="확인"
        className="max-w-260!"
        bodyFull
      >
        <form className="border-border-100 min-w-0 space-y-4 border-y [&_[data-slot=field-label]]:text-xs! [&_[data-slot=search-box]]:rounded-none [&_[data-slot=search-box]]:border-x-0 [&_[data-slot=table-wrap]]:rounded-none [&_[data-slot=table-wrap]]:border-x-0">
          <div
            data-slot="search-box"
            className="border-border-100 bg-bg-100 relative flex flex-wrap gap-2 rounded-[6px] border p-4 pr-28"
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
              // label="권리구분"
              orientation="horizontal"
              className="w-fit [&>button]:w-30!"
              size="h28"
              defaultValue="test1"
            />

            <RHF.Input
              control={form.control}
              name="val2"
              // label="의뢰번호"
              orientation="horizontal"
              className="flex-1"
              size="h28"
            />

            <RHF.FormCheckbox
              control={form.control}
              name="val2"
              label="유사검색"
              outputFormat={["Y", "N"]}
              size="sm"
              height={7}
            />

            <Button size="h28" variant="blue" className="absolute right-5 bottom-4">
              <Icons.Search />
              검색
            </Button>
          </div>

          <div className="">
            <div className="my-2 mt-4 flex items-center justify-between px-3">
              <p className="text-text-200 text-sm">
                총 <span className="text-p-color-1 font-bold">100</span>건의 결과가 있습니다.
              </p>
            </div>
            <DataTable data={data} columns={columnsData} />
          </div>
        </form>
      </FormDialog>
    </FormProvider>
  );
};
