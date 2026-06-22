import { Input } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { EditColumn } from "../../../_components/common/DocEditRow";

export interface DocItem {
  seq: string;
  category: string;
  name: string;
  sort: string;
}

export const submitColumns: ColumnDef<DocItem>[] = [
  { accessorKey: "category", header: "구분", size: 80 },
  { accessorKey: "name", header: "제출서류" },
  { accessorKey: "sort", header: "Sort", size: 80 },
];

interface EditProps {
  category: string;
  name: string;
  sort: string;
  setName: (v: string) => void;
  setSort: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const getSubmitEditColumns = ({
  category,
  name,
  sort,
  setName,
  setSort,
  onKeyDown,
}: EditProps): EditColumn[] => [
  {
    header: "구분",
    width: "80px",
    render: () => category,
  },
  {
    header: "제출서류",
    render: () => (
      <Input
        size="h28"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="제출서류명 입력"
      />
    ),
  },
  {
    header: "Sort",
    width: "80px",
    render: () => (
      <Input
        size="h28"
        className="text-center"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        onKeyDown={onKeyDown}
      />
    ),
  },
];
