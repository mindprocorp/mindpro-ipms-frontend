/** 결재 문서 상태 라벨 (목록용 - 텍스트 색상만) */
export const DOC_STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  DRAFT:     { label: "임시저장", cls: "text-muted-foreground" },
  PENDING:   { label: "결재중",   cls: "text-blue-600 dark:text-blue-300" },
  APPROVED:  { label: "승인",     cls: "text-green-600 dark:text-green-300" },
  REJECTED:  { label: "반려",     cls: "text-destructive" },
  WITHDRAWN: { label: "회수",     cls: "text-amber-600 dark:text-amber-300" },
};

/** 결재 문서 상태 라벨 (뱃지용 - 배경색 포함) */
export const DOC_STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  DRAFT:     { label: "임시저장", cls: "bg-muted text-muted-foreground" },
  PENDING:   { label: "결재중",   cls: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300" },
  APPROVED:  { label: "승인",     cls: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300" },
  REJECTED:  { label: "반려",     cls: "bg-red-50 text-destructive dark:bg-red-500/15 dark:text-red-300" },
  WITHDRAWN: { label: "회수",     cls: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300" },
};

/** 날짜 포맷 (ko-KR) */
export const formatDate = (date?: string | null): string =>
  date ? new Date(date).toLocaleDateString("ko-KR") : "-";
