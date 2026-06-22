/** 서식 위자드 탭 키 */
export const FORM_STEP = {
  BASIC: "1",
  SETTINGS: "2",
  PERMISSION: "3",
} as const;

export const FORM_STEPS = [
  { key: FORM_STEP.BASIC, label: "기본 설정" },
  { key: FORM_STEP.SETTINGS, label: "결재·수신" },
  { key: FORM_STEP.PERMISSION, label: "권한" },
] as const;

/** Y/N 값 */
export const YN = {
  YES: "Y",
  NO: "N",
} as const;

/** 수신/공유 시점 */
export const TIMING = {
  APPROVED: "APPROVED",
  SUBMIT: "SUBMIT",
} as const;

/** 공유 범위 */
export const SHARE_SCOPE = {
  ALL: "ALL",
  GROUP: "GROUP",
} as const;

/** 결재선 변경 허용 라디오 */
export const ALLOW_ITEMS = [
  { label: "허용", value: YN.YES },
  { label: "허용 안 함", value: YN.NO },
] as const;

/** 사용 여부 라디오 */
export const USE_ITEMS = [
  { label: "사용", value: YN.YES },
  { label: "사용 안 함", value: YN.NO },
] as const;

/** 수신 시점 라디오 */
export const TIMING_RECEIVE_ITEMS = [
  { label: "문서 작성 시점부터 수신", value: TIMING.SUBMIT },
  { label: "완료된 후 수신", value: TIMING.APPROVED },
] as const;

/** 공유 시점 라디오 */
export const TIMING_SHARE_ITEMS = [
  { label: "문서 작성 시점부터 공유", value: TIMING.SUBMIT },
  { label: "완료된 후 공유", value: TIMING.APPROVED },
] as const;

/** 참조 시점 라디오 */
export const TIMING_REFERENCE_ITEMS = [
  { label: "문서 작성 시점부터 참조", value: TIMING.SUBMIT },
  { label: "완료된 후 참조", value: TIMING.APPROVED },
] as const;

/** 공유 범위 라디오 */
export const SCOPE_ITEMS = [
  { label: "전체 공유", value: SHARE_SCOPE.ALL },
  { label: "일부 공유", value: SHARE_SCOPE.GROUP },
] as const;
