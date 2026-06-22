import { useState } from "react";
import { Button, Icons } from "@repo/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boardQueries } from "@shared/query/board/boardQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import type { CommentItem } from "@shared/api/board/boardApi.ts";

const MAX_DEPTH = 5;

const fmtDate = (d: string) =>
  d ? `${d.slice(0, 4)}. ${d.slice(5, 7)}. ${d.slice(8, 10)}. ${d.slice(11, 16)}` : "";

function removeDeletedLeaves(list: CommentItem[]): CommentItem[] {
  return list
    .map((c) => ({ ...c, replies: removeDeletedLeaves(c.replies ?? []) }))
    .filter((c) => !(c.delYn === "Y" && c.replies.length === 0));
}

function countComments(list: CommentItem[]): number {
  return list.reduce((acc, c) => acc + (c.delYn === "Y" ? 0 : 1) + countComments(c.replies ?? []), 0);
}

function flattenComments(list: CommentItem[], depth = 0): Array<{ comment: CommentItem; depth: number }> {
  return list.flatMap((c) => [
    { comment: c, depth },
    ...flattenComments(c.replies ?? [], depth + 1),
  ]);
}

// ─── 댓글 단건 컴포넌트 ────────────────────────────────────────────────────

const CommentRow = ({
  comment,
  boardSeq,
  currentUserSeq,
  depth = 0,
}: {
  comment: CommentItem;
  boardSeq: string;
  currentUserSeq?: string;
  depth?: number;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(comment.commentContent);
  const [replyContent, setReplyContent] = useState("");

  const { openAlert } = useAlertStore();
  const queryClient = useQueryClient();

  const isOwner = !!currentUserSeq && currentUserSeq === comment.createUser?.userSeq;

  const deleteMut = useMutation(boardQueries.deleteComment());
  const updateMut = useMutation(boardQueries.updateComment());
  const saveMut = useMutation(boardQueries.saveComment());

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["board", "comment", boardSeq] });

  const handleDelete = () => {
    openAlert({
      message: "댓글을 삭제하시겠습니까?",
      onConfirm: () =>
        deleteMut.mutate(comment.commentSeq, {
          onSuccess: invalidate,
          onError: () => openAlert({ message: "삭제에 실패했습니다.", showCancel: false }),
        }),
    });
  };

  const handleUpdate = () => {
    if (!editContent.trim()) return;
    if (editContent.length > 2000) {
      openAlert({ message: "댓글은 2000자 이내여야 합니다.", showCancel: false });
      return;
    }
    updateMut.mutate(
      { commentSeq: comment.commentSeq, data: { commentContent: editContent } },
      {
        onSuccess: () => { setEditMode(false); invalidate(); },
        onError: () => openAlert({ message: "수정에 실패했습니다.", showCancel: false }),
      }
    );
  };

  const handleReply = () => {
    if (!replyContent.trim()) return;
    if (replyContent.length > 2000) {
      openAlert({ message: "댓글은 2000자 이내여야 합니다.", showCancel: false });
      return;
    }
    saveMut.mutate(
      { boardSeq, data: { parentCommentSeq: comment.commentSeq, commentContent: replyContent } },
      {
        onSuccess: () => { setReplyContent(""); setShowReplyForm(false); invalidate(); },
        onError: () => openAlert({ message: "등록에 실패했습니다.", showCancel: false }),
      }
    );
  };

  const isDeleted = comment.delYn === "Y";
  const indentRem = Math.min(depth, MAX_DEPTH) * 1.5;

  return (
    <div
      style={{ marginLeft: `${indentRem}rem` }}
      className={depth > 0 ? "border-l-2 border-border pl-4" : ""}
    >
      <div className="flex gap-3 py-3.5">
        {!isDeleted && (
          comment.createUser?.profileImageUrl ? (
            <img
              src={comment.createUser.profileImageUrl}
              alt={comment.createUser.userName}
              className="size-8 shrink-0 rounded-full object-cover ring-1 ring-border"
            />
          ) : (
            <div className="size-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground ring-1 ring-border">
              {(comment.createUser?.userName ?? "?").slice(0, 1)}
            </div>
          )
        )}
        <div className="flex-1 min-w-0">
          {isDeleted ? (
            <p className="text-sm text-muted-foreground italic">삭제된 댓글입니다.</p>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[13px] font-semibold text-foreground">
                  {comment.createUser?.userName ?? "-"}
                </span>
                <span className="text-[11px] text-muted-foreground">{comment.createUser?.deptName || "소속 부서 없음"}</span>
                <span className="text-[11px] text-muted-foreground">{fmtDate(comment.createAt)}</span>
              </div>

              {editMode ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                    rows={3}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="flex gap-1.5">
                    <Button size="h28" variant="blue" onClick={handleUpdate} disabled={updateMut.isPending}>
                      저장
                    </Button>
                    <Button
                      size="h28"
                      variant="outline"
                      onClick={() => { setEditMode(false); setEditContent(comment.commentContent); }}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                  {comment.commentContent}
                </p>
              )}

              {!editMode && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="h24"
                    className="px-1.5 text-[11px] text-muted-foreground hover:bg-transparent hover:text-blue-500"
                    onClick={() => setShowReplyForm((v) => !v)}
                  >
                    {showReplyForm ? "답글 취소" : "답글"}
                  </Button>
                  {isOwner && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="h24"
                        className="px-1.5 text-[11px] text-muted-foreground hover:bg-transparent hover:text-foreground"
                        onClick={() => setEditMode(true)}
                      >
                        수정
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="h24"
                        className="px-1.5 text-[11px] text-muted-foreground hover:bg-transparent hover:text-red-500"
                        onClick={handleDelete}
                        disabled={deleteMut.isPending}
                      >
                        삭제
                      </Button>
                    </>
                  )}
                </div>
              )}

              {showReplyForm && (
                <div className="mt-2.5 flex flex-col gap-2">
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                    rows={2}
                    placeholder="답글을 입력하세요."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleReply(); }}
                  />
                  <div className="flex gap-1.5">
                    <Button size="h28" variant="blue" onClick={handleReply} disabled={saveMut.isPending}>
                      등록
                    </Button>
                    <Button
                      size="h28"
                      variant="outline"
                      onClick={() => { setShowReplyForm(false); setReplyContent(""); }}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── 댓글 섹션 ─────────────────────────────────────────────────────────────

const BoardComments = ({ boardSeq }: { boardSeq: string }) => {
  const [newComment, setNewComment] = useState("");
  const { openAlert } = useAlertStore();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery(boardQueries.getCommentListQuery(boardSeq));
  const saveMut = useMutation(boardQueries.saveComment());

  const commentList = removeDeletedLeaves(data?.data ?? []);
  const total = countComments(commentList);
  const flatList = flattenComments(commentList);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    if (newComment.length > 2000) {
      openAlert({ message: "댓글은 2000자 이내여야 합니다.", showCancel: false });
      return;
    }
    saveMut.mutate(
      { boardSeq, data: { commentContent: newComment } },
      {
        onSuccess: () => {
          setNewComment("");
          queryClient.invalidateQueries({ queryKey: ["board", "comment", boardSeq] });
        },
        onError: () => openAlert({ message: "댓글 등록에 실패했습니다.", showCancel: false }),
      }
    );
  };

  return (
    <div className="border-t pt-6 pb-10">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-1.5">
        <Icons.MessageSquare className="size-4" />
        댓글{total > 0 && <span className="text-blue-500 ml-0.5">{total}</span>}
      </h3>

      {isPending ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Icons.Loader2 className="size-4 animate-spin" />
          불러오는 중...
        </div>
      ) : flatList.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">아직 댓글이 없습니다.</p>
      ) : (
        <div className="divide-y divide-border">
          {flatList.map(({ comment, depth }) => (
            <CommentRow
              key={comment.commentSeq}
              comment={comment}
              boardSeq={boardSeq}
              currentUserSeq={user?.userInfoSeq}
              depth={depth}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <textarea
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
          rows={3}
          placeholder="댓글을 입력하세요. (Ctrl+Enter로 등록)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit(); }}
        />
        <div className="flex justify-end">
          <Button
            size="h28"
            variant="blue"
            onClick={handleSubmit}
            disabled={saveMut.isPending || !newComment.trim()}
          >
            댓글 등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoardComments;
