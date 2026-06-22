/**
 * 출원사건관리
 */
export const DOMESTIC_APP_MNG = {
  RIGHT_CATE: "PAT_TYPE", // 권리
  APP_CATE: "APP_DIV_TYPE", // 특허/실용신안 출원구분
  DESIGN_APP_CATE: "DSG_APP_TYPE", // 디자인 출원구분
  TRADE_APP_CATE: "TMK_APP_TYPE", // 상표 출원구분
  CATE: "JOB_DIV_CD", // 구분
  APP_KIND_CODE: "APP_TYPE_CD", // 출원종류
  IP_PROC_TYPE: "IP_PROC_TYPE", // 출원루트
};

/**
 * 명세서
 */
export const DOMESTIC_APP_SPECIFICELEMENT = {
  GRADE: "IP_GRADE_CD", // 등급
};

/**
 * 출원기본정보
 */
export const DOMESTIC_APP_BASE_INFO = {
  APP_LANG: "APP_LANG_DIV", // 언어
};

/**
 * 출원기본정보
 */
export const DOMESTIC_APP_MANAGERMENT_INFO = {
  FOREIGN_APP_TIMING: "APP_SUBMIT_DIV", // 해외출원시점분류
};

/**
 * 등록/권리 유지 관리
 */
export const DOMESTIC_APP_MAINTENANCE = {
  DIS_COUNT_RATIO: "REDUC_RATE_CD", //등록 감면율
  YEAR_DISCOUNT_RATIO: "REDUC_RATE_CD", //연차 감면율
};

/**
 * 등록/권리 유지 관리
 */
export const PCT_APP_MAINTENANCE = {
  DIS_COUNT_RATIO: "REDUC_RATE_CD", //등록 감면율
  YEAR_DISCOUNT_RATIO: "REDUC_RATE_CD", //연차 감면율
};


/////////////////// 공통 하단 탭 ////////////////////
/**
 *  공지예외
 */
export const GRACE_PERIOD = {
  GRACE_PRD_CONT: "GRACE_PRD_CONT", //공지예외주장내용
};

/**
 *  전자포대
 */
export const FILE_LIST = {
  DOC_TYPE_CD: "DOC_TYPE_CD", //서류구분
};

/**
 *  갱신관리
 */
export const RENEWAL = {
  PAYMENT_DIV: "PAYMENT_DIV", // 납부구분
};

/**
 *  진행사항
 */
export const PROGRESS = {
  TARGET_TYPE: "TARGET_TYPE", // 대상
};

/**
 *  실적분배
 */
export const DISTRIBUTE = {
  PERFORMANCE_TYPE: "PERFORMANCE_TYPE", //실적구분
};
/////////////////// 공통 하단 탭 ////////////////////


////////////////// 청구서 /////////////////

/**
 *  청구서
 */
export const BILL = {
  COST_TYPE: "COST_TYPE", // 비용구분
  COUNT_UNIT_TYPE: "COUNT_UNIT_TYPE", // 수량구분단위
};


////////////////// 청구서 /////////////////


/**
 * 이의심판 사건관리
 */
export const OBJECTION_TRIAL_CASE_MNG = {
  PENDING_COURT: "COURT_TYPE", // 계류법정
  AGENT_CATEGORY: "AGENT_TYPE", // 대리인구분
  CASE_CATEGORY: "JOB_DIV_CD", // 구분
  RIGHT_TYPE: "PAT_TYPE", // 권리
  CASE_TYPE: "CASE_TYPE_TRIAL", // 사건종류
  DEPT: "DEPT_CD", // 부서
  JUDGMENT_CATEGORY: "JUDG_CAT", // 판결구분 (원심하급심)
};

/**
 * 기타사건 사건관리
 */
export const ETC_CASE_MNG = {
  CASE_CATEGORY: "JOB_DIV_CD", // 구분
  RIGHT_TYPE: "PAT_TYPE", // 권리
  CASE_TYPE: "CASE_TYPE_TRIAL", // 사건종류
};

/**
 * 검색조건 설정 - 페이지별 검색 키
 * PageSearchForm의 searchKey prop에 전달하면 자동으로 _BASE/_DATE/_STR 조합
 */
export const SEARCH_KEY = {
  CONFLICT: "SEARCH_CONFLICT",             // 이의심판
  CONFLICT_PRGRS: "SEARCH_CONFLICT_PRGRS", // 이의심판 진행
  DOMESTIC: "SEARCH_DOMESTIC",             // 국내출원
  DOMESTIC_PRGRS: "SEARCH_DOMESTIC_PRGRS", // 국내출원 진행
  OVERSEAS: "SEARCH_OVERSEAS",             // 해외출원
  OVERSEAS_BASIC: "SEARCH_OVERSEAS_BASIC", // 해외기본
  ETC_EVENT: "SEARCH_ETC_EVENT",           // 기타사건
  ETC_PRGRS: "SEARCH_ETC_PRGRS",          // 기타사건 진행
  BILL: "SEARCH_BILL",                     // 내국청구서
  CUSTOMER: "SEARCH_CUSTOMER",             // 고객관리
  CUST_MNG: "SEARCH_CUST_MNG",            // 고객담당자
  DUEDATE: "SEARCH_DUEDATE",              // 기일관리
  DOC_IO: "SEARCH_DOC_IO",                // 문서수발
  DOSSIER: "SEARCH_DOSSIER",              // 포대관리
  HISTORY: "SEARCH_HISTORY",              // 히스토리조회
  BOARD: "SEARCH_BOARD",                  // 게시판
  SENDRECEIVE: "SEARCH_SENDRECEIVE",      // 접발송내역
};

/**
 * 내국청구서
 */
export const BILL_DOMESTIC = {
  BILL_DIV_CD: "BILL_DIV_CD", // 청구구분
  BILL_EVENT_DIV: "BILL_EVENT_DIV", // 청구분류
  BILL_TYPE_CD: "BILL_TYPE_CD", // 청구종류
  TAX_STMT_DIV: "TAX_STMT_DIV", // 계산서구분
  TAXBILL_TYPE: "TAXBILL_TYPE", // 발행구분
};

