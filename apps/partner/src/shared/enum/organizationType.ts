/** 코드 분류 */
export const CODE_CLASS = {
  JOB_POSITION: "JOB_POSITION",
  POSITION: "POSITION",
  WORK_TYPE: "WORK_TYPE",
  JOB_GRADE: "JOB_GRADE",
  APPROVAL_TYPE: "APPROVAL_TYPE",
  FORM_CATEGORY: "FORM_CATEGORY",
  BOARD_CATEGORY: "BOARD_CATEGORY",
  USER_TYPE: "USER_TYPE",
  WORK_STATUS: "WORK_STATUS",
  EMPLOY_STATUS: "EMPLOY_STATUS",
  ACCT_STATUS: "ACCT_STATUS",
} as const;

export type CodeClassType = (typeof CODE_CLASS)[keyof typeof CODE_CLASS];

/** 대상 역할 */
export const TARGET_ROLE = {
  SHARE_GROUP: "SHARE_GROUP",
  WRITE_AUTH: "WRITE_AUTH",
  READ_AUTH: "READ_AUTH",
} as const;

/** 대상 유형 */
export const TARGET_TYPE = {
  EMPLOYEE: "EMPLOYEE",
  DEPT_HEAD: "DEPT_HEAD",
  DEPT: "DEPT",
} as const;

export const TARGET_TYPE_LABEL: Record<string, string> = {
  EMPLOYEE: "사원",
  DEPT_HEAD: "부서장",
  DEPT: "부서",
};

/** 공유 범위 */
export const SHARE_SCOPE = {
  NONE: "NONE",
  ALL: "ALL",
  GROUP: "GROUP",
} as const;

/** 공유 시점 */
export const SHARE_TIMING = {
  APPROVED: "APPROVED",
  SUBMIT: "SUBMIT",
} as const;

/** Y/N 옵션 */
export const YN_OPTIONS: { label: string; value: string }[] = [
  { label: "사용함", value: "Y" },
  { label: "사용안함", value: "N" },
];
