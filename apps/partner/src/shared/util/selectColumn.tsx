import { Checkbox } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";

export type SelectColumnOptions = {
  /** true면 헤더의 전체 선택 체크박스만 숨김 (행 선택 체크박스는 유지) */
  hideHeaderSelectAll?: boolean;
};

export const selectColumn = <T,>(
  size: number = 40,
  options?: SelectColumnOptions,
): ColumnDef<T> => ({
  id: "select",
  size,
  enableSorting: false,
  enableHiding: false,
  header:
    options?.hideHeaderSelectAll === true
      ? () => <span aria-hidden className="inline-block size-4" />
      : ({ table }) => (
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
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      size="sm"
    />
  ),
});
