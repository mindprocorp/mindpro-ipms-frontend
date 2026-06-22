import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormDialog,
  FlexBox,
  Icons,
  Separator,
} from "@repo/ui";
import { useMutation } from "@tanstack/react-query";
import { approvalQueries } from "@shared/query/organization/queries";
import type { ApprDocVO, ApprDocLineVO } from "@shared/api/approval/approvalApi";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useAlertStore } from "@shared/store/useAlertStore";
import FormRenderer from "./FormRenderer";
import ApprLinePreview from "./ApprLinePreview";
import ApprovalSignModal, { type SignResult } from "./ApprovalSignModal";
import { DOC_STATUS_BADGE, formatDate } from "./constants";

// ─── ApprDocLineVO → ApprLinePreview용 타입 변환 ──────────────────────────
// signatureImage 는 백엔드 스키마 확정 후 서버에서 내려옴 (현재는 undefined)
const toPreviewLines = (lines: ApprDocLineVO[]) =>
  lines.map((l) => ({
    templateLineSeq: l.lineSeq,
    stepOrder: l.stepOrder,
    stepName: l.stepName ?? "",
    stepType: l.stepType ?? "",
    approverType: l.approverType,
    approverName: l.approverName,
    lineStatus: l.lineStatus,
    actionComment: l.actionComment,
    signatureImage: (l as any).signatureImage as string | undefined,
  }));

// ─── 우측 패널 공통 카드 ───────────────────────────────────────────────────
const PanelCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="rounded-md border bg-background">
    <header className="flex items-center gap-1.5 border-b bg-muted/30 px-3 py-2">
      {icon}
      <h3 className="text-[12px] font-semibold text-foreground">{title}</h3>
    </header>
    <div className="p-3">{children}</div>
  </section>
);

const TARGET_STYLE: Record<string, { label: string; cls: string }> = {
  RECEIVE: { label: "수신", cls: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300" },
  REFERENCE: { label: "참조", cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  SHARE: { label: "공유", cls: "bg-muted text-muted-foreground" },
};

interface Props {
  docSeq: string | null;
  open: boolean;
  onClose: () => void;
  onRefresh?: () => void;
  /** pending: 결재 처리 버튼 표시 */
  mode?: "view" | "pending";
}

const ApprDocDetailModal = ({ docSeq, open, onClose, onRefresh, mode = "view" }: Props) => {
  const { user } = useAuthStore();
  const { openAlert } = useAlertStore();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<ApprDocVO | null>(null);
  const [actionComment, setActionComment] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [signOpen, setSignOpen] = useState(false);

  const getDocMut = useMutation(approvalQueries.getDoc());
  const processApprovalMut = useMutation(approvalQueries.processApproval());
  const withdrawMut = useMutation(approvalQueries.withdrawDoc());
  const deleteMut = useMutation(approvalQueries.deleteDoc());

  useEffect(() => {
    if (open && docSeq) {
      getDocMut.mutate(docSeq, {
        onSuccess: setDoc,
        onError: () => openAlert({ message: "문서를 불러오는데 실패했습니다." }),
      });
    } else {
      setDoc(null);
      setActionComment("");
      setRejectOpen(false);
      setSignOpen(false);
    }
  }, [open, docSeq]); // eslint-disable-line react-hooks/exhaustive-deps

  const myPendingLine = doc?.lines?.find(
    (l) => l.approverSeq === user?.userMstSeq && l.lineStatus === "PENDING",
  );

  const isMyCurrentTurn = (() => {
    if (!doc?.lines || !myPendingLine) return false;
    const myStep = Number(myPendingLine.stepOrder);
    return !doc.lines.some(
      (l) => Number(l.stepOrder) < myStep && l.lineStatus !== "APPROVED",
    );
  })();

  const handleApprove = () => {
    if (!doc?.docSeq || !myPendingLine?.lineSeq) return;
    setSignOpen(true);
  };

  const handleSignedApprove = ({ signatureImage }: SignResult) => {
    if (!doc?.docSeq || !myPendingLine?.lineSeq) return;
    processApprovalMut.mutate(
      {
        docSeq: doc.docSeq!,
        lineSeq: myPendingLine.lineSeq!,
        payload: { action: "APPROVED", signatureImage } as any,
      },
      {
        onSuccess: () => {
          setSignOpen(false);
          openAlert({ message: "승인되었습니다." });
          onRefresh?.();
          onClose();
        },
      },
    );
  };

  const handleReject = () => {
    if (!doc?.docSeq || !myPendingLine?.lineSeq) return;
    processApprovalMut.mutate(
      { docSeq: doc.docSeq!, lineSeq: myPendingLine.lineSeq!, payload: { action: "REJECTED", comment: actionComment } },
      { onSuccess: () => { openAlert({ message: "반려되었습니다." }); setRejectOpen(false); onRefresh?.(); onClose(); } },
    );
  };

  const handleWithdraw = () => {
    if (!doc?.docSeq) return;
    openAlert({
      message: "상신을 취소(회수)하시겠습니까?",
      type: "confirm",
      onConfirm: () => {
        withdrawMut.mutate(
          doc.docSeq!,
          { onSuccess: () => { openAlert({ message: "회수되었습니다." }); onRefresh?.(); onClose(); } },
        );
      },
    });
  };

  const handleDelete = () => {
    if (!doc?.docSeq) return;
    openAlert({
      message: "기안 문서를 삭제하시겠습니까?",
      type: "confirm",
      onConfirm: () => {
        deleteMut.mutate(
          doc.docSeq!,
          { onSuccess: () => { openAlert({ message: "삭제되었습니다." }); onRefresh?.(); onClose(); } },
        );
      },
    });
  };

  const statusInfo = doc ? (DOC_STATUS_BADGE[doc.docStatus || ""] || { label: doc.docStatus, cls: "" }) : null;
  const isDrafter = doc?.drafterSeq === user?.userMstSeq;
  const previewLines = doc?.lines ? toPreviewLines(doc.lines) : [];
  const canApprove = mode === "pending" && isMyCurrentTurn && myPendingLine;
  const canWithdraw = isDrafter && doc?.docStatus === "PENDING";
  const canEdit = isDrafter && (doc?.docStatus === "DRAFT" || doc?.docStatus === "WITHDRAWN");

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="flex max-h-[90vh] w-[90vw] !max-w-[1150px] flex-col gap-0 p-0">
          {/* 헤더 */}
          <DialogHeader className="shrink-0 border-b px-6 py-4">
            <DialogTitle className="flex items-center gap-2">
              {doc ? doc.docTitle : "문서 조회"}
              {statusInfo && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.cls}`}>
                  {statusInfo.label}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* 본문 (단일 스크롤) */}
          <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
            {getDocMut.isPending ? (
              <div className="flex h-40 items-center justify-center">
                <Icons.Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : doc ? (
              <div className="flex gap-4">
                {/* ─── 좌측: A4 페이퍼 ───────────────────────────────── */}
                <div
                  className="min-w-0 flex-1"
                  style={{ minWidth: 0, flexBasis: 0, flexGrow: 1 }}
                >
                  {/* A4 페이퍼 (210mm @96dpi = 794px, 표준 여백 25mm) */}
                  <article className="mx-auto max-w-[794px] rounded-sm bg-card text-card-foreground shadow-md ring-1 ring-border">
                    <div className="px-[90px] py-[70px]">
                      {/* 문서 헤더 (공문서 비율) */}
                      <header className="mb-6">
                        {/* 상단 라인: 서식명 좌 / 문서번호 우 */}
                        <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{doc.formTemplateName ?? ""}</span>
                          <span className="font-mono">{doc.docNo ?? ""}</span>
                        </div>
                        {/* 문서 제목 */}
                        <h1
                          style={{ fontSize: 24, lineHeight: 1.4 }}
                          className="truncate py-2 text-center font-bold tracking-[0.12em]"
                        >
                          {doc.docTitle}
                        </h1>
                        {/* 더블 라인 (공문서 패턴) */}
                        <div className="border-b-2 border-foreground/70" />
                        <div className="mt-[3px] border-b border-foreground/40" />
                      </header>

                      {/* 메타 정보 테이블 */}
                      <section className="mb-6">
                        <table className="w-full border-collapse text-sm">
                          <colgroup>
                            <col className="w-[100px]" />
                            <col />
                            <col className="w-[100px]" />
                            <col />
                          </colgroup>
                          <tbody>
                            <tr className="border-y border-border">
                              <th className="border-r border-border bg-muted/40 px-3 py-2 text-left text-xs font-medium">
                                기안자
                              </th>
                              <td className="border-r border-border px-3 py-2 text-sm">
                                {doc.drafterName ?? "-"}
                                {doc.draftDeptName && (
                                  <span className="ml-1 text-xs text-muted-foreground">
                                    {doc.draftDeptName}
                                  </span>
                                )}
                              </td>
                              <th className="border-r border-border bg-muted/40 px-3 py-2 text-left text-xs font-medium">
                                상신일
                              </th>
                              <td className="px-3 py-2 text-sm">
                                {doc.submitAt ? formatDate(doc.submitAt) : "-"}
                              </td>
                            </tr>
                            {doc.completeAt && (
                              <tr className="border-b border-border">
                                <th className="border-r border-border bg-muted/40 px-3 py-2 text-left text-xs font-medium">
                                  완료일
                                </th>
                                <td className="px-3 py-2 text-sm" colSpan={3}>
                                  {formatDate(doc.completeAt)}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </section>

                      {/* 본문 */}
                      <section>
                        <FormRenderer
                          templateData={doc.templateData || ""}
                          values={(() => { try { return JSON.parse(doc.docContent || "{}"); } catch { return {}; } })()}
                          readOnly
                        />
                      </section>
                    </div>
                  </article>
                </div>

                {/* ─── 우측 사이드 패널 (sticky) ─────────────────────── */}
                <aside className="sticky top-0 h-fit w-64 shrink-0 space-y-3">
                  {previewLines.length > 0 && (
                    <PanelCard title="결재선" icon={<Icons.ListChecks className="size-3.5 text-muted-foreground" />}>
                      <ApprLinePreview lines={previewLines} showStatus />
                    </PanelCard>
                  )}

                  {doc.targets && doc.targets.length > 0 && (
                    <PanelCard title="수신/공유/참조" icon={<Icons.Users className="size-3.5 text-muted-foreground" />}>
                      <div className="space-y-1.5">
                        {doc.targets.map((t) => {
                          const style = TARGET_STYLE[t.targetRole] ?? TARGET_STYLE.SHARE;
                          return (
                            <div key={t.targetSeq} className="flex items-center justify-between text-xs">
                              <span className="text-foreground">{t.refName || t.refSeq}</span>
                              <span className={`rounded px-1.5 py-0.5 text-[10px] ${style.cls}`}>
                                {style.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </PanelCard>
                  )}
                </aside>
              </div>
            ) : null}
          </div>

          {/* 하단 액션 바 */}
          {doc && (
            <>
              <Separator className="shrink-0" />
              <FlexBox className="shrink-0 justify-between px-6 py-3">
                <FlexBox className="gap-2">
                  {canApprove && (
                    <>
                      <Button size="h28" variant="blue" onClick={handleApprove} disabled={processApprovalMut.isPending}>
                        <Icons.Check className="size-3.5" /> 승인
                      </Button>
                      <Button size="h28" variant="destructive" onClick={() => setRejectOpen(true)} disabled={processApprovalMut.isPending}>
                        <Icons.X className="size-3.5" /> 반려
                      </Button>
                    </>
                  )}
                  {canWithdraw && (
                    <Button size="h28" variant="outline" onClick={handleWithdraw} disabled={withdrawMut.isPending}>
                      <Icons.RotateCcw className="size-3.5" /> 회수
                    </Button>
                  )}
                  {canEdit && (
                    <>
                      <Button
                        size="h28"
                        variant="blue"
                        onClick={() => { onClose(); navigate(`/approval/draft/write?docSeq=${doc.docSeq}`); }}
                      >
                        <Icons.Pencil className="size-3.5" /> 수정/상신
                      </Button>
                      <Button size="h28" variant="destructive" onClick={handleDelete} disabled={deleteMut.isPending}>
                        <Icons.Trash2 className="size-3.5" /> 삭제
                      </Button>
                    </>
                  )}
                </FlexBox>
                <Button size="h28" variant="outline" onClick={onClose}>
                  닫기
                </Button>
              </FlexBox>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 결재 서명 다이얼로그 */}
      <ApprovalSignModal
        open={signOpen}
        onOpenChange={setSignOpen}
        onConfirm={handleSignedApprove}
        isPending={processApprovalMut.isPending}
      />

      {/* 반려 사유 입력 다이얼로그 */}
      <FormDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="반려 사유"
        submitText="반려"
        cancelText="취소"
        submitLoading={processApprovalMut.isPending}
        onSubmit={handleReject}
        className="max-w-sm"
      >
        <textarea
          className="h-24 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="반려 사유를 입력해주세요 (선택)"
          value={actionComment}
          onChange={(e) => setActionComment(e.target.value)}
        />
      </FormDialog>
    </>
  );
};

export default ApprDocDetailModal;
