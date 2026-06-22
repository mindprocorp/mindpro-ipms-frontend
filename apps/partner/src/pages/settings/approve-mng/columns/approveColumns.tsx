import { Button, Icons } from "@repo/ui";
import { selectColumn } from "@shared/util/selectColumn";

export const approveColumns = [
  selectColumn<any>(36),

  {
    accessorKey: "fileNm",
    header: "서식명",
    size: 10000,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
  {
    accessorKey: "line",
    header: "결재선",
    size: 10000,
    cell: (info: any) => {
      const items = info.getValue();
      const id = info.row.id;
      return (
        <div className="flex items-center gap-1">
          {items?.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className="border-p-color-1 bg-p-color-1/5 text-p-color-1 flex items-center overflow-hidden rounded-full border pl-2 capitalize"
              >
                {item.type}
                {item.pos}
                <Button variant="ghost" className="h-4 w-4">
                  <Icons.X className="size-3" />
                </Button>
              </div>
            );
          })}
        </div>
      );
    },
    meta: {
      cellAlign: "left",
    },
  },
  {
    accessorKey: "modify",
    header: "수정",
    size: 60,
    cell: (info: any) => (
      <Button variant="ghost" size="h24">
        <Icons.PencilLine />
      </Button>
    ),
  },
  {
    accessorKey: "delete",
    header: "삭제",
    size: 60,
    cell: (info: any) => (
      <Button variant="ghost" size="h24">
        <Icons.Trash />
      </Button>
    ),
  },
];
