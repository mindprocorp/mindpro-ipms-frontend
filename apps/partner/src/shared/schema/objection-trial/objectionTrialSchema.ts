import { z } from "zod";
import { zDateReq, zReq } from "@shared/schema/utilSchema.ts";

// null/undefined 모두 "" 로 변환 (백엔드 null 응답 대응)
const zs = z.string().nullish().transform(v => v ?? "");

const codeObject    = z.object({ code: zs, codeName: zs });
const userObject    = z.object({ userSeq: zs, userName: zs });
const reqCodeObject = (msg: string) => z.object({ code: zReq(msg), codeName: zs });
const reqUserObject = (msg: string) => z.object({ userSeq: zs, userName: zReq(msg) });

export const ObjectionTrialSchema = z.object({

  cftCaseMng: z.object({  /* 사건관리 */
    courtCategory:     reqCodeObject("계류법정을 선택해주세요"),   // 계류법정
    agentCategory:     reqCodeObject("대리인구분을 선택해주세요"), // 대리인구분
    appClassification: reqCodeObject("구분을 선택해주세요"),       // 구분
    rightType:         codeObject,                                // 권리 (선택)
    caseType:          reqCodeObject("사건종류를 선택해주세요"),   // 사건종류
    receiptDate: zDateReq("접수일을 입력해주세요"),               // 접수일
    ourRef:    zs.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    yourRef:   zReq("YourRef를 입력해주세요").max(30, "최대 30자까지 입력 가능합니다"),
    clientRef: zReq("출원인관리번호를 입력해주세요").max(30, "최대 30자까지 입력 가능합니다"),
  }),

  appBaseInfo: z.object({  /* 출원 기본정보 */
    countryCode: z.object({
      code:     z.string().nullish(),  // 국가코드
      codeName: z.string().nullish(),  // 국가명
    }),
    appDate:          z.string().nullish(), // 출원일
    appNo:            z.string().nullish(), // 출원번호
    announcementDate: z.string().nullish(), // 출원/등록공고일
    regDate:          z.string().nullish(), // 등록일
    intlRegDate:      z.string().nullish(), // 국제 등록일
    regNo:            z.string().nullish(), // 등록번호
    dueLimitDate:     z.string().nullish(), // 청구마감일
    claimDate:        z.string().nullish(), // 청구일
    domesticRegDecisionDate: z.string().nullish(), // 국내 등록결정일 (표시용)
    domesticRegDate:         z.string().nullish(), // 국내 등록일 (표시용)
    domesticRegNo:           z.string().nullish(), // 국내 등록번호 (표시용)
    caseNo:           zReq("사건번호를 입력해주세요").max(30, "최대 30자까지 입력 가능합니다"), // 사건번호
    appSeq:           zs,                           // 출원키
  }),

  cftManagerInfo: z.object({  /* 담당 정보 */
    deptName: zReq("부서를 입력해주세요").max(30, "최대 30자까지 입력 가능합니다"),         // 부서
    adminMgr: reqUserObject("관리담당자를 입력해주세요"), // 관리담당자
    caseMgr:  reqUserObject("사건담당자를 입력해주세요"), // 사건담당자
    attorney: reqUserObject("담당변리사를 입력해주세요"), // 담당변리사
  }),

  appPartyInfo: z.object({  /* 출원 당사자 정보 */
    foreignAgent: userObject, // 해외대리인 (선택 입력으로 변경)
    client:       reqUserObject("의뢰인을 입력해주세요"),   // 의뢰인
    applicant:    reqUserObject("출원인을 입력해주세요"),   // 출원인
  }),

  appTitleInfo: z.object({  /* 출원 명칭 정보 */
    titleKo: zs.refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"), // 국문명칭 (필수 해제)
    titleEn: zs.refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"), // 영문명칭
  }),

  appGoodsInfo: z.object({  /* 출원 물품류 정보 */
    goodsClass: zs, // 물품류
  }),

  cftLitigantInfo: z.object({  /* 청구인/피청구인 정보 */
    introducer:     zReq("소개자를 입력해주세요").max(255, "최대 255자까지 입력 가능합니다"),                       // 소개자
    petitionerType: zReq("청구인 원고/피고를 선택해주세요"),             // 청구인 원고/피고
    petitioner:     reqUserObject("청구인명을 입력해주세요"),            // 청구인
    petitionerMemo: zReq("청구인 메모를 입력해주세요").max(500, "최대 500자까지 입력 가능합니다"),                  // 청구인 메모
    respondentType: zReq("피청구인 원고/피고를 선택해주세요"),           // 피청구인 원고/피고
    respondent:     zReq("피청구인명을 입력해주세요").max(255, "최대 255자까지 입력 가능합니다"),                   // 피청구인명
    respondentMemo: zReq("피청구인 메모를 입력해주세요").max(500, "최대 500자까지 입력 가능합니다"),                // 피청구인 메모
  }),

  cftNoteInfo: z.object({  /* 비고 정보 */
    note: zReq("비고를 입력해주세요"), // 비고
  }),

  cftJudgmentInfo: z.object({  /* 판결 정보 */
    preExamDate:         zDateReq("심사전치일을 입력해주세요"),          // 심사전치일
    preExamResult:       zReq("심사전치결과를 입력해주세요").max(100, "최대 100자까지 입력 가능합니다"),            // 심사전치결과
    finalResult:         zReq("최종결과를 입력해주세요").max(100, "최대 100자까지 입력 가능합니다"),                // 최종결과
    amendLimitDate:      zDateReq("보정서 마감일을 입력해주세요"),       // 보정서 마감일
    amendSubmitDate:     zDateReq("보정서 제출일을 입력해주세요"),       // 보정서 제출일
    judgmentServedDate:  zDateReq("판결 송달일을 입력해주세요"),         // 판결 송달일
    judgmentDate:        zDateReq("판결 결정일을 입력해주세요"),         // 판결 결정일
    decisionContent:     zReq("결정내용을 입력해주세요").max(500, "최대 500자까지 입력 가능합니다"),               // 결정내용
    appealLimitDate:     zDateReq("불복제기 마감일을 입력해주세요"),     // 불복제기 마감일
    appealDate:          zDateReq("불복제기 청구일을 입력해주세요"),     // 불복제기 청구일
    appealContent:       zReq("제기내용을 입력해주세요").max(500, "최대 500자까지 입력 가능합니다"),               // 제기내용
    isAbandoned:         zs,                                             // 포기여부
    abandonInstructDate: zDateReq("포기 지시일을 입력해주세요"),         // 포기 지시일
    abandonDate:         zDateReq("포기 일자를 입력해주세요"),           // 포기 일자
    abandonContent:      zReq("포기 내용을 입력해주세요").max(500, "최대 500자까지 입력 가능합니다"),              // 포기 내용
  }),

  cftResultList: z.object({  /* 원심하급심 결과 목록 */
    conflictResultList: z.array(z.object({
      judgmentCaseNo:     zs, // 판결사건번호
      judgmentContent:    zs, // 판결내용
      judgmentSearchUrl:  zs, // 판결문 경로
      judgmentCategory:   codeObject, // 판결구분
      resultDecisionDate: zs, // 판결일
      note:               zs, // 비고
    })).default([]),
  }).default({ conflictResultList: [] }),

  conflictSeq: zs, // 이의심판 키 (수정 시)
});

export type ObjectionTrialFormInput  = z.input<typeof ObjectionTrialSchema>;
export type ObjectionTrialFormOutput = z.output<typeof ObjectionTrialSchema>;
