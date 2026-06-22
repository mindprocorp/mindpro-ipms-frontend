import { Button, Icons } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { EFileMangerListType } from "@shared/api/eFileManger/eFileMangerApi.ts";
import { selectColumn } from "@shared/util/selectColumn";
import { downloadFile as utilDownloadFile } from "@shared/util/fileUtil";

const fileHandler = {
  openFile: (url: string) => {
    if (url) window.open(url, "_blank");
  },
  downloadFile: (url: string, fileName: string) => {
    utilDownloadFile(url, fileName);
  },
};

export const eFileManageColumnsData: ColumnDef<EFileMangerListType, any>[] = [
  selectColumn<EFileMangerListType>(50),

  {
    id: "caseClassification.codeName",
    accessorFn: (row) => row.caseClassification?.codeName,
    header: "사건구분",
    size: 100,
    cell: (info: any) => <div>{info.getValue()}</div>,
  },
  {
    id: "caseCategory.codeName",
    accessorFn: (row) => row.caseCategory?.codeName,
    header: "구분",
    size: 100,
    cell: (info: any) => <div>{info.getValue()}</div>,
  },
  {
    id: "rightType.codeName",
    accessorFn: (row) => row.rightType?.codeName,
    header: "권리",
    size: 80,
    cell: (info: any) => <div>{info.getValue()}</div>,
  },
  {
    accessorKey: "ourRef",
    header: "OurRef",
    size: 130,
    cell: ({ row }: any) => <div>{row.getValue("ourRef")}</div>,
  },
  {
    accessorKey: "appNo",
    header: "출원번호",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("appNo")}</div>,
  },
  {
    accessorKey: "regNo",
    header: "등록번호",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("regNo")}</div>,
  },
  {
    accessorKey: "uploadAt",
    header: "업로드일/시간",
    size: 160,
    cell: ({ row }: any) => <div>{row.getValue("uploadAt")}</div>,
  },
  {
    id: "docInfo.code",
    accessorFn: (row) => row.docInfo?.code,
    header: "문서코드",
    size: 100,
    cell: (info: any) => <div>{info.getValue()}</div>,
  },
  {
    id: "docInfo.codeName",
    accessorFn: (row) => row.docInfo?.codeName,
    header: "서류구분",
    size: 100,
    cell: (info: any) => <div>{info.getValue()}</div>,
  },
  {
    accessorKey: "attachDocName",
    header: "첨부서류",
    size: 1000,
    cell: ({ row }: any) => <div>{row.getValue("attachDocName")}</div>,
  },
  {
    accessorKey: "fileSize",
    header: "크기(byte)",
    size: 100,
    cell: ({ row }: any) => <div className="text-right">{row.getValue("fileSize")?.toLocaleString()}</div>,
  },
  {
    accessorKey: "fileViewUrl",
    header: "보기",
    size: 60,
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="h24"
          onClick={(e) => {
            e.stopPropagation();
            fileHandler.openFile(getValue() as string);
          }}
          disabled={!getValue()}
        >
          <Icons.Eye size={16} />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "fileDownloadUrl",
    header: "다운",
    size: 60,
    cell: ({ row, getValue }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="h24"
          onClick={(e) => {
            e.stopPropagation();
            fileHandler.downloadFile(getValue() as string, row.original.attachDocName);
          }}
          disabled={!getValue()}
        >
          <Icons.Download size={16} />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "summary",
    header: "요약",
    size: 1000,
    cell: ({ row }: any) => <div>{row.getValue("summary")}</div>,
  },
  {
    accessorKey: "uploadUser",
    header: "업로드자",
    size: 100,
    cell: ({ row }: any) => <div>{row.getValue("uploadUser")}</div>,
  },
];
