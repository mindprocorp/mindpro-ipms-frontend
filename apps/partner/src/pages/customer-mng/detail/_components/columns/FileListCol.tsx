import type { ColumnDef } from "@tanstack/react-table";
import { Button, Icons } from "@repo/ui";
import { selectColumn } from "@shared/util/selectColumn";
import { downloadFile as utilDownloadFile } from "@shared/util/fileUtil";

export type FileListColType = {
  uploadAt: string; // 업로드일/시간
  inputCreateAt: string; // 등록일
  fileKindCode: string; // 서류구분
  fileName: string; // 첨부서류명
  fileViewUrl: string; // 표기 / 열기
  fileDownloadUrl: string; //다운
  summary: string; // 요약
  uploadUser: string; // 업로드자
  docCode: string; // 문서코드
};

const fileHandler = {
  openFile: (url: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  },

  downloadFile: (url: string, fileName: string) => {
    utilDownloadFile(url, fileName);
  },

};


/**
 * 마감경과 테이블 컬럼
 */
export const getFileListColumns = (editMode: Boolean): ColumnDef<FileListColType>[] => [
  selectColumn<FileListColType>(36),

  {
    accessorKey: "uploadAt1",
    header: "구분",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.uploadAt = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "uploadAt",
    header: "업로드일/시간",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.uploadAt = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },

  {
    accessorKey: "inputCreateAt",
    header: "등록일",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.inputCreateAt = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "fileKindCode",
    header: "서류구분",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.fileKindCode = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },

  {
    accessorKey: "fileName",
    header: "첨부서류",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.fileName = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() + "%"}</div>;
    },
  },


  {
    accessorKey: "fileViewUrl",
    header: "열기",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.fileViewUrl = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return (
        <Button
          variant="ghost"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            fileHandler.openFile(getValue() as string);
          }}
          disabled={!getValue()}
          title="파일 열기"
        >
          <Icons.FileIcon className="size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "fileDownloadUrl",
    header: "다운",
    size: 130,
    cell: ({ row, getValue }) => {
      const fileName = row.original.fileName;
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.fileDownloadUrl = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return (
        <Button
          variant="ghost"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            fileHandler.downloadFile(getValue() as string, fileName);
          }}
          disabled={!getValue()}
          title="파일 열기"
        >
          <Icons.FileIcon className="size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "summary",
    header: "요약",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.summary = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "uploadUser",
    header: "업로드자",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.uploadUser = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "docCode",
    header: "문서코드",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.docCode = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
];
