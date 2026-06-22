import { Button, Icons } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { selectColumn } from "@shared/util/selectColumn";
import { downloadFile as utilDownloadFile, openFile as utilOpenFile, downloadZipFiles } from "@shared/util/fileUtil";

export type FileListColType = {
  fileMappSeq: string; // 매핑 시퀀스
  uploadAt: string; // 업로드일/시간
  inputCreateAt: string; // 등록일
  fileKindCode: string; // 서류구분
  fileKindName: string; // 서류구분 명
  fileName: string; // 첨부서류명
  fileViewUrl: string; // 표기 / 열기
  fileDownloadUrl: string; //다운
  fileSeqs?: string; // 다중 파일 시퀀스
  summary: string; // 요약
  uploadUser: string; // 업로드자
  docCode: string; // 문서코드
};

const fileHandler = {
  openFile: (url: string) => {
    utilOpenFile(url);
  },
  downloadFile: (url: string, fileName: string) => {
    utilDownloadFile(url, fileName);
  },
};

export const getFileListColumns = (editMode: boolean): ColumnDef<FileListColType>[] => [
  //   1. 맨 앞에 선택(Select) 체크박스 추가
  selectColumn<FileListColType>(36),

  //   2. 서류구분 (중복 제거하고 하나만 남김)
  {
    accessorKey: "fileKindName",
    header: "서류구분",
    size: 130,
    cell: ({ row, getValue }) => {
      const val = getValue() as string;
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={val}
            onChange={(e) => { row.original.fileKindName = e.target.value; }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="text-center">{val || "-"}</div>;
    },
  },
  //   3. 첨부서류명 (fileName + "%" 오타 수정 및 이름 정렬)
  {
    accessorKey: "fileName",
    header: "첨부서류명",
    size: 250,
    cell: ({ row, getValue }) => {
      const val = getValue() as string;
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={val}
            onChange={(e) => { row.original.fileName = e.target.value; }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="px-2 truncate">{val}</div>;
    },
  },
  {
    accessorKey: "uploadAt",
    header: "업로드일시",
    size: 150,
    cell: ({ row, getValue }) => {
      const val = getValue() as string;
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={val}
            onChange={(e) => { row.original.uploadAt = e.target.value; }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="text-center">{val?.replace('T', ' ')}</div>;
    },
  },
  //   4. 열기/다운로드 버튼
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
    cell: ({ row, getValue }) => {
      const downloadUrl = getValue() as string;
      const fileSeqsStr = row.original.fileSeqs;
      
      const fileSeqs = fileSeqsStr ? fileSeqsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

      return (
        <div className="flex justify-center">
          {fileSeqs.length > 1 ? (
            <Button
              variant="ghost"
              size="h24"
              className="p-1 text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                downloadZipFiles(fileSeqs, "attachments.zip");
              }}
              title={`전체 다운로드(ZIP)`}
            >
              <Icons.Download size={16} />
              <span className="ml-1 text-[10px] font-bold">ZIP</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="h24"
              onClick={(e) => {
                e.stopPropagation();
                fileHandler.downloadFile(downloadUrl, row.original.fileName);
              }}
              disabled={!downloadUrl}
            >
              <Icons.Download size={16} />
            </Button>
          )}
        </div>
      );
    },
  },
  //   5. 요약 및 업로드자
  {
    accessorKey: "summary",
    header: "요약",
    size: 200,
    cell: ({ row, getValue }) => {
      const val = getValue() as string;
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={val}
            onChange={(e) => { row.original.summary = e.target.value; }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="px-2 truncate">{val || "-"}</div>;
    },
  },
  {
    accessorKey: "uploadUser",
    header: "업로드자",
    size: 100,
    cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>,
  },
];
