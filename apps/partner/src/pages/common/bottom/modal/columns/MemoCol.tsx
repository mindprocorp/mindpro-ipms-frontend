import { Button, Icons } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";
import { downloadFile, downloadZipFiles } from "@shared/util/fileUtil";

export type MemoColType = {
  tblSeq: string;
  memoSeq?: string;
  mustReadYn: string;
  customerName: string;
  memoRegDate: string;
  note: string;
  memoTitle: string;
  memoUserName: string;
  fileInfo?: {
    fileSeq: string;
    fileName: string;
    fileSize: string;
    fileUrl: string;
    docSeq: string;
    docNm: string;
  }[];
};

/**
 * 메모 테이블 컬럼
 */
export const getMemoColumns = (editMode: Boolean): ColumnDef<MemoColType>[] => [
  selectColumn<MemoColType>(36),

  {
    accessorKey: "mustReadYn",
    header: "필독구분",
    size: 80,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.mustReadYn = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "memoRegDate",
    header: "작성일",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            maxLength={10}
            defaultValue={formatDate(getValue())}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9-]/g, "");
              row.original.memoRegDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "memoTitle",
    header: "제목",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.memoTitle = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },

  {
    accessorKey: "note",
    header: "메모",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.note = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "fileInfo",
    header: "첨부파일",
    size: 120,
    cell: ({ row }) => {
      const files = row.original.fileInfo;
      if (!files || files.length === 0) return <div className="text-center">-</div>;

      if (files.length === 1) {
        const file = files[0];
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            <Button
              key={file.fileSeq}
              variant="ghost"
              size="h24"
              className="p-1"
              onClick={(e) => {
                e.stopPropagation();
                downloadFile(file.fileUrl, file.fileName);
              }}
              title={file.fileName}
            >
              <Icons.Download size={16} />
            </Button>
          </div>
        );
      }

      return (
        <div className="flex flex-wrap gap-1 justify-center">
          <Button
            variant="ghost"
            size="h24"
            className="p-1 text-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              const fileSeqs = files.map((f) => f.fileSeq);
              downloadZipFiles(fileSeqs, "attachments.zip");
            }}
            title={`${files.length}개 파일 전체 다운로드(ZIP)`}
          >
            <Icons.Download size={16} />
            <span className="ml-1 text-xs">ZIP</span>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "memoUserName",
    header: "작성자",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.memoUserName = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
];
