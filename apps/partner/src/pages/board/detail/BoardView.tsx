import { Button, Icons, MultiFiles } from "@repo/ui";
import type { ServerFileItem } from "@repo/ui";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boardQueries } from "@shared/query/board/boardQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { downloadFile } from "@shared/util/fileUtil";
import BoardComments from "./BoardComments.tsx";

const fmtDate = (d: string) =>
  d ? `${d.slice(0, 4)}. ${d.slice(5, 7)}. ${d.slice(8, 10)}. ${d.slice(11, 16)}` : "";

const fmtPinnedDate = (d: string) =>
  d?.length === 8 ? `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}` : "";

const isActivePinned = (isPinned: string, pinnedEndAt?: string) => {
  if (isPinned !== "Y") return false;
  if (!pinnedEndAt || pinnedEndAt.length !== 8) return true;
  const normalized = `${pinnedEndAt.slice(0, 4)}-${pinnedEndAt.slice(4, 6)}-${pinnedEndAt.slice(6, 8)}`;
  return normalized >= new Date().toISOString().slice(0, 10);
};

const BoardView = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { boardSeq } = useParams<{ boardSeq: string }>();
  const { openAlert } = useAlertStore();
  const user = useAuthStore((s) => s.user);

  const { data, isPending } = useQuery(boardQueries.getBoardDetailQuery(boardSeq!));
  const deleteMut = useMutation(boardQueries.deleteBoard());

  useEffect(() => {
    if (data) {
      queryClient.invalidateQueries({ queryKey: ["board", "list"] });
      queryClient.invalidateQueries({ queryKey: ["board", "main"] });
      queryClient.invalidateQueries({ queryKey: ["board", "recent"] });
    }
  }, [data]);

  const detail = data?.data;
  const isAuthor = !!user && !!detail && detail.createUser?.userSeq === user.userInfoSeq;

  const handleDelete = () => {
    if (!boardSeq) return;
    openAlert({
      message: "게시글을 삭제하시겠습니까?",
      onConfirm: () => {
        deleteMut.mutate(boardSeq, {
          onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["board", "list"] });
            queryClient.invalidateQueries({ queryKey: ["board", "main"] });
            queryClient.invalidateQueries({ queryKey: ["board", "recent"] });
            openAlert({ message: "삭제되었습니다.", onConfirm: () => navigate(-1), showCancel: false });
          },
          onError: () => openAlert({ message: "삭제에 실패했습니다.", showCancel: false }),
        });
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        <Icons.Loader2 className="mr-2 size-4 animate-spin" />
        불러오는 중...
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <Icons.FileText className="size-10 opacity-30" />
        <p className="text-sm">게시글을 찾을 수 없습니다.</p>
        <Button variant="outline" size="h28" onClick={() => navigate("/board/list")}>
          목록으로
        </Button>
      </div>
    );
  }

  const existingFiles: ServerFileItem[] = (detail.fileList ?? []).map((f) => ({
    fileSeq: f.fileSeq,
    fileName: f.fileName,
    fileSize: f.fileSize,
    fileUrl: f.fileUrl,
    docSeq: f.docSeq,
    docNm: f.docNm,
  }));

  return (
    <div className="flex h-full flex-col bg-background">
      {/* 상단 액션 바 */}
      <div className="flex shrink-0 items-center gap-1.5 border-b px-4 py-2.5">
        <Button variant="outline" size="h28" onClick={() => navigate("/board/list")}>
          <Icons.ChevronLeft className="size-3.5" />
          목록
        </Button>

        {isAuthor && (
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="blue"
              size="h28"
              onClick={() => navigate(`/board/detail/${boardSeq}`)}
            >
              <Icons.Pencil className="size-3.5" />
              수정
            </Button>
            <Button
              variant="destructive"
              size="h28"
              onClick={handleDelete}
              disabled={deleteMut.isPending}
            >
              <Icons.Trash2 className="size-3.5" />
              삭제
            </Button>
          </div>
        )}
      </div>

      {/* 본문 영역 */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-6">
          {/* 헤더 */}
          <div className="border-b py-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-sm bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {detail.category?.codeName || "카테고리 없음"}
              </span>
              {isActivePinned(detail.isPinned, detail.pinnedEndAt) && (
                <span className="flex items-center gap-1 rounded-sm bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                  <Icons.Pin className="size-3" />
                  상단 고정
                  <span className="text-red-400 dark:text-red-500 font-normal">
                    {fmtPinnedDate(detail.pinnedStartAt)} ~ {fmtPinnedDate(detail.pinnedEndAt)}
                  </span>
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground leading-tight mb-4 break-words">
              {detail.title}
            </h1>
            <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
              <div className="flex items-center gap-2.5">
                {detail.createUser?.profileImageUrl ? (
                  <img
                    src={detail.createUser.profileImageUrl}
                    alt={detail.createUser?.userName}
                    className="size-8 rounded-full object-cover ring-1 ring-border"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground ring-1 ring-border">
                    {(detail.createUser?.userName ?? "?").slice(0, 1)}
                  </div>
                )}
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-foreground">{detail.createUser?.userName ?? "-"}</span>
                  <span className="text-[11px] text-muted-foreground font-medium">{detail.createUser?.deptName || "소속 부서 없음"}</span>
                </div>
              </div>
              <span className="text-border">|</span>
              <span>{fmtDate(detail.createAt)}</span>
              {(detail.viewCount ?? 0) > 0 && (
                <>
                  <span className="text-border">|</span>
                  <span className="flex items-center gap-1">
                    <Icons.Eye className="size-3.5" />
                    조회 {detail.viewCount}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 첨부파일 */}
          {existingFiles.length > 0 && (
            <div className="border-b bg-muted/20 py-4">
              <MultiFiles
                initialFiles={existingFiles}
                files={[]}
                readOnly={true}
                onDownload={downloadFile}
                className="border-none py-0"
              />
            </div>
          )}

          {/* 본문 */}
          <div className="py-10 min-h-[300px]">
            <div
              className="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-xl break-words"
              style={{ fontSynthesis: "style" }}
              dangerouslySetInnerHTML={{ __html: detail.content || "" }}
            />
          </div>

          {/* 댓글 */}
          <BoardComments boardSeq={boardSeq!} />
        </div>
      </div>
    </div>
  );
};

export default BoardView;
