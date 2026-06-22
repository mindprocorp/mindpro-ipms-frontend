import { Checkbox, Input } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { EditColumn } from "../../../_components/common/DocEditRow";
import SelectBox from "../../../_components/common/SelectBox";

export interface ReceiptDocItem {
  seq: string;
  category: string;
  rightType: string;
  name: string;
  auto: boolean;
  receiptType: string;
  deadline: string;
  deadlineUnit: string;
  extension: string;
  sort: string;
}

const MW = { minWidth: 0 };

const RIGHT_TYPES = [
  { label: "선택", value: "" },
  { label: "특허", value: "특허" },
  { label: "실용", value: "실용" },
  { label: "디자인", value: "디자인" },
  { label: "상표", value: "상표" },
];
const RECEIPT_TYPES = [
  { label: "선택", value: "" },
  { label: "접수일", value: "접수일" },
  { label: "통지일", value: "통지일" },
];
const DEADLINE_UNITS = [
  { label: "선택", value: "" },
  { label: "월", value: "월" },
  { label: "일", value: "일" },
];
const EXTENSIONS = [
  { label: "선택", value: "" },
  { label: "1월", value: "1월" },
  { label: "30일", value: "30일" },
];

export const HAS_RIGHT_TYPE = new Set(["국내", "개국"]);

export const getReceiptColumns = (showRightType: boolean): ColumnDef<ReceiptDocItem>[] => {
  const cols: ColumnDef<ReceiptDocItem>[] = [
    { accessorKey: "category", header: "구분", size: 70, meta: MW },
  ];

  if (showRightType) {
    cols.push({
      accessorKey: "rightType",
      header: "권리",
      size: 70,
      meta: MW,
    });
  }

  cols.push(
    { accessorKey: "name", header: "접수서류", meta: MW },
    {
      accessorKey: "auto",
      header: "자동",
      size: 50,
      meta: MW,
      cell: ({ row }) => (row.original.auto ? "V" : ""),
    },
    { accessorKey: "receiptType", header: "접수구분", size: 80, meta: MW },
    { accessorKey: "deadline", header: "마감", size: 60, meta: MW },
    { accessorKey: "deadlineUnit", header: "월/일", size: 60, meta: MW },
    { accessorKey: "extension", header: "기연", size: 70, meta: MW },
    { accessorKey: "sort", header: "Sort", size: 60, meta: MW },
  );

  return cols;
};

interface EditProps {
  category: string;
  showRight: boolean;
  edit: ReceiptDocItem;
  set: (f: keyof ReceiptDocItem, v: string | boolean) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const getReceiptEditColumns = ({
  category,
  showRight,
  edit,
  set,
  onKeyDown,
}: EditProps): EditColumn[] => [
  {
    header: "구분",
    width: "70px",
    render: () => category,
  },
  ...(showRight
    ? [
        {
          header: "권리",
          width: "90px",
          render: () => (
            <SelectBox
              value={edit.rightType}
              onChange={(v) => set("rightType", v)}
              options={RIGHT_TYPES}
              className="h-7 w-full text-xs"
            />
          ),
        },
      ]
    : []),
  {
    header: "접수서류",
    render: () => (
      <Input
        value={edit.name}
        onChange={(e) => set("name", e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="접수서류명"
      />
    ),
  },
  {
    header: "자동",
    width: "50px",
    render: () => (
      <Checkbox checked={edit.auto} onCheckedChange={(v) => set("auto", !!v)} size="sm" />
    ),
  },
  {
    header: "접수구분",
    width: "90px",
    render: () => (
      <SelectBox
        value={edit.receiptType}
        onChange={(v) => set("receiptType", v)}
        options={RECEIPT_TYPES}
        className="h-7 w-full text-xs"
      />
    ),
  },
  {
    header: "마감",
    width: "60px",
    render: () => (
      <Input
        className="text-center"
        value={edit.deadline}
        onChange={(e) => set("deadline", e.target.value)}
        onKeyDown={onKeyDown}
      />
    ),
  },
  {
    header: "월/일",
    width: "70px",
    render: () => (
      <SelectBox
        value={edit.deadlineUnit}
        onChange={(v) => set("deadlineUnit", v)}
        options={DEADLINE_UNITS}
        className="h-7 w-full text-xs"
      />
    ),
  },
  {
    header: "기연",
    width: "80px",
    render: () => (
      <SelectBox
        value={edit.extension}
        onChange={(v) => set("extension", v)}
        options={EXTENSIONS}
        className="h-7 w-full text-xs"
      />
    ),
  },
  {
    header: "Sort",
    width: "60px",
    render: () => (
      <Input
        className="text-center"
        value={edit.sort}
        onChange={(e) => set("sort", e.target.value)}
        onKeyDown={onKeyDown}
      />
    ),
  },
];
