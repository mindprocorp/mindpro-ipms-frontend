import { Button, Icons } from "@repo/ui";
import { formatDate } from "@shared/util/formatUtil";
import type { ColumnDef } from "@tanstack/react-table";
import { selectColumn } from "@shared/util/selectColumn";
import { downloadFile, downloadZipFiles } from "@shared/util/fileUtil";

export type ProgressColType = {
  progressSeq: string;
  noticeDate: string;
  agentReceiptDate: string;
  receiptDoc: {
    docSeq: string;
    docName?: string;
  };
  receiptReportLimitDate: string;
  receiptReportDate: string;
  reviewOpinionLimitDate: string;
  reviewReportDate: string;
  instructionDate: string;
  extensionCount?: string;
  documentLimitDate?: string;
  documentSubmitDate?: string;
  submitDoc: {
    docSeq: string;
    docName?: string;
  };
  submitReportLimitDate?: string;
  submitReportDate?: string;
  PaperFiles?: {
    fileSeq: string;
    fileName: string;
    fileSize: string;
    fileUrl: string;
    docSeq: string;
    docNm: string;
  }[];
};

/**
 * 마감경과 테이블 컬럼
 */
export const getProgessColumns = (editMode: Boolean): ColumnDef<ProgressColType>[] => [
  selectColumn<ProgressColType>(28),

  {
    accessorKey: "noticeDate",
    header: "통지일",
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
              row.original.noticeDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "agentReceiptDate",
    header: "서류접수일",
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
              row.original.agentReceiptDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    id: "receiptDoc.docName",
    accessorFn: (row) => row.receiptDoc?.docName,
    header: "접수보고서",
    size: 130,
  },
  {
    accessorKey: "receiptReportLimitDate",
    header: "보고기한",
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
              row.original.receiptReportLimitDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "receiptReportDate",
    header: "보고일",
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
              row.original.receiptReportDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "reviewOpinionLimitDate",
    header: "검토마감일",
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
              row.original.reviewOpinionLimitDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "reviewReportDate",
    header: "검토보고일",
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
              row.original.reviewReportDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "instructionDate",
    header: "지시일",
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
              row.original.instructionDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "extensionCount",
    header: "연장횟수",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.extensionCount = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "documentLimitDate",
    header: "제출기한",
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
              row.original.documentLimitDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "documentSubmitDate",
    header: "제출일",
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
              row.original.documentSubmitDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "PaperFiles",
    header: "첨부파일",
    size: 100,
    cell: ({ row }) => {
      const files = row.original.PaperFiles;
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
    id: "submitDoc.docName",
    accessorFn: (row) => row.submitDoc?.docName,
    header: "제출보고서",
    size: 130,
  },
  {
    accessorKey: "submitReportLimitDate",
    header: "보고기한",
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
              row.original.submitReportLimitDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "submitReportDate",
    header: "제출보고일",
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
              row.original.submitReportDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
];
