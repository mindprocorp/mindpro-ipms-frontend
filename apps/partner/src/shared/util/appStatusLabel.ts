/** AppStatusUtil / CM APP_STATE 와 동일한 기본 라벨 — codeName 누락 시 폴백 */
const APP_STATE_FALLBACK: Record<string, string> = {
  "10": "출원 신청 진행 중",
  "20": "출원 중",
  "70": "등록 완료",
  "80": "포기",
};

/** 출원 상태 배지 라벨 (codeName 우선, 없으면 공통코드 그룹 폴백, 그다음 code) */
export type AppStatusFields = {
  code?: string | null;
  codeName?: string | null;
};

export function appStatusProgressLabel(
  status: AppStatusFields | undefined | null,
): string | undefined {
  const namePart =
    typeof status?.codeName === "string" ? status.codeName.trim() : "";
  if (namePart) return namePart;

  const codeRaw = typeof status?.code === "string" ? status.code.trim() : "";
  if (!codeRaw) return undefined;

  const fromMap = APP_STATE_FALLBACK[codeRaw];
  return fromMap ?? codeRaw;
}
