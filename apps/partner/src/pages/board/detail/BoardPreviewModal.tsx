import { Icons, MultiFiles, type ServerFileItem, type FileItem } from "@repo/ui";

const fmtPinnedDate = (d: string) =>
  d?.length === 8 ? `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}` : "";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@repo/ui";
import { downloadFile } from "@shared/util/fileUtil";

interface BoardPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    title: string;
    content: string;
    categoryName: string;
    attachFiles: FileItem[];
    existingFiles: ServerFileItem[];
    userName: string;
    deptName: string;
    profileUrl?: string;
    createdAt: string;
    isPinned?: boolean;
    pinnedStartAt?: string;
    pinnedEndAt?: string;
  };
}

const BoardPreviewModal = ({ open, onOpenChange, data }: BoardPreviewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-full !max-w-5xl sm:!max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none bg-background">
        <DialogHeader className="sr-only">
          <DialogTitle>게시글 미리보기</DialogTitle>
          <DialogDescription>작성 중인 게시글이 다른 사용자에게 어떻게 보이는지 미리 확인합니다.</DialogDescription>
        </DialogHeader>

        {/* 실제 게시글 상세와 유사한 레이아웃 */}
        <div className="flex flex-col bg-background shadow-sm ring-1 ring-border min-w-0">
          {/* 상단 헤더 영역 */}
          <div className="border-b px-8 py-6 min-w-0">
            <div className="mb-3 flex items-center gap-2 flex-wrap">
              <span className="rounded-sm bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {data.categoryName || "카테고리 미선택"}
              </span>
              {data.isPinned && (
                <span className="flex items-center gap-1 rounded-sm bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                  <Icons.Pin className="size-3" />
                  상단 고정
                  <span className="text-red-400 dark:text-red-500 font-normal">
                    {fmtPinnedDate(data.pinnedStartAt ?? "")} ~ {fmtPinnedDate(data.pinnedEndAt ?? "")}
                  </span>
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground leading-tight mb-4 [overflow-wrap:anywhere]">
              {data.title || "제목이 없습니다."}
            </h1>
            <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
              <div className="flex items-center gap-2.5">
                {data.profileUrl ? (
                  <img src={data.profileUrl} alt={data.userName} className="size-8 rounded-full object-cover ring-1 ring-border" />
                ) : (
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground ring-1 ring-border">
                    {data.userName.slice(0, 1)}
                  </div>
                )}
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-foreground">{data.userName}</span>
                  <span className="text-[11px] text-muted-foreground font-medium">{data.deptName}</span>
                </div>
              </div>
              <span className="text-border">|</span>
              <span>{data.createdAt}</span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                <Icons.Eye className="size-3.5" />
                조회 0
              </span>
            </div>
          </div>

          {/* 첨부파일 영역 */}
          {(data.existingFiles.length > 0 || data.attachFiles.length > 0) && (
            <div className="border-b bg-muted/20 px-8 py-4">
              <MultiFiles
                initialFiles={data.existingFiles}
                files={data.attachFiles}
                readOnly={true}
                onDownload={downloadFile}
                className="border-none py-0"
              />
            </div>
          )}

          {/* 본문 영역 */}
          <div className="px-8 py-10 min-h-[300px] min-w-0 overflow-x-auto">
            <div
              className="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-xl [overflow-wrap:anywhere] [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: data.content || "<p class='text-muted-foreground italic'>내용이 없습니다.</p>" }}
            />
          </div>

          {/* 하단 푸터 (버튼 등 생략) */}
          <div className="border-t bg-muted/20 px-8 py-4 text-center">
            <p className="text-xs text-muted-foreground">이 화면은 다른 사용자에게 보여지는 실제 게시글 화면과 동일한 미리보기입니다.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoardPreviewModal;
