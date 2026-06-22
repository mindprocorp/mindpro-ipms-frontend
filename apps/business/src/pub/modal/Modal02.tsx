import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, DataTable, FormDialog, Icons, RHF } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";

type ModalProps = {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: any) => void;
};

const TestSchema = z.object({
  val1: z.string().default(""),
  val2: z.string().default(""),
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
};

const data: ListType[] = [
  {
    id: "0000000063",
    classifn: "R1-C0020",
    title: "출원테스트 요청",
    Ipt: "A",
    status: "조사의뢰검토",
  },
  {
    id: "0000000069",
    classifn: "R1-C0020",
    title: "출원테스트 요청",
    Ipt: "S",
    status: "조사의뢰검토",
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
    header: "의뢰번호",
    cell: (info) => info.getValue(),
    meta: {
      align: "center",
    },
  },
  {
    accessorKey: "classifn",
    header: "권리구분",
    // size: 40,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      align: "center",
    },
  },
  {
    accessorKey: "title",
    header: "의뢰제목",
    // size: 40,
    cell: (info) => (
      <Button variant="link-blue" className="h-auto capitalize">
        {info.getValue()}
      </Button>
    ),
  },
  {
    accessorKey: "Ipt",
    header: "조사중요도",
    size: 200,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      align: "center",
    },
  },
  {
    accessorKey: "status",
    header: "진행상태",
    size: 200,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      align: "center",
    },
  },
];

export const Modal02 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
              label="권리구분"
              orientation="horizontal"
              className="w-fit [&>button]:w-30!"
              size="h28"
            />

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
              label="중요도"
              orientation="horizontal"
              className="w-fit [&>button]:w-20!"
              placeholder="선택"
              size="h28"
            />

            <RHF.Input
              control={form.control}
              name="val1"
              label="의뢰번호"
              orientation="horizontal"
              className="w-fit [&>div]:w-40!"
              size="h28"
            />

            <RHF.Input
              control={form.control}
              name="val1"
              label="의뢰제목"
              orientation="horizontal"
              className="w-fit [&>div]:w-46!"
              size="h28"
            />

            <Button size="h28" variant="blue" className="absolute right-5 bottom-4">
              <Icons.Search />
              검색
            </Button>
          </div>

          <div className="">
            <div className="my-2 mt-4 px-3">
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
