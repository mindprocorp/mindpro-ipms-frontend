import { z } from "zod";
import { zDateReq, zReq } from "@shared/schema/utilSchema.ts";

// null/undefined 모두 "" 로 변환 (백엔드 null 응답 대응)
const zs = z.string().nullish().transform(v => v ?? "");

const codeObject    = z.object({ code: zs, codeName: zs });
const userObject    = z.object({ userSeq: zs, userName: zs });
const reqCodeObject = (msg: string) => z.object({ code: zReq(msg), codeName: zs });
const reqUserObject = (msg: string) => z.object({ userSeq: zs, userName: zReq(msg) });

export const EtcCaseSchema = z.object({

  cftCaseMng: z.object({  /* 사건관리 */
    appClassification: reqCodeObject("구분을 선택해주세요"),       // 구분
    rightType:         codeObject,                                // 권리 (선택)
    caseType:          reqCodeObject("사건종류를 선택해주세요"),   // 사건종류
    receiptDate: zDateReq("접수일을 입력해주세요"),               // 접수일
    ourRef:    zs,                                                // OurRef
    yourRef:   zReq("YourRef를 입력해주세요"),                    // YourRef
    clientRef: zReq("출원인관리번호를 입력해주세요"),             // 출원인관리번호
    appSeq:    zs,                                                // 출원키
  }),

  appBaseInfo: z.object({  /* 출원 기본정보 */
    countryCode: z.object({
      code:     z.string().nullish(), // 국가코드
      codeName: z.string().nullish(), // 국가명
    }),
    appDate:    z.string().nullish(), // 출원일
    appNo:      z.string().nullish(), // 출원번호
    pubDate:    z.string().nullish(), // 출원/등록공고일
    regDate:    z.string().nullish(), // 등록일
    regNo:      z.string().nullish(), // 등록번호
    dueLimitDate:            z.string().nullish(), // 처리마감일
    processDate:             z.string().nullish(), // 처리일
    domesticRegDecisionDate: z.string().nullish(), // 국내 등록결정일 (표시용)
    domesticRegDate:         z.string().nullish(), // 국내 등록일 (표시용)
    domesticRegNo:           z.string().nullish(), // 국내 등록번호 (표시용)
  }),

  cftManagerInfo: z.object({  /* 담당 정보 */
    deptName: zReq("부서를 입력해주세요"),                        // 부서
    adminMgr: reqUserObject("관리담당자를 입력해주세요"),         // 관리담당자
    caseMgr:  reqUserObject("사건담당자를 입력해주세요"),         // 사건담당자
    attorney: reqUserObject("담당변리사를 입력해주세요"),         // 담당변리사
  }),

  appPartyInfo: z.object({  /* 당사자 정보 */
    foreignAgent: userObject,                                     // 해외대리인 (선택 입력)
    client:       userObject,
    applicant:    reqUserObject("출원인을 입력해주세요"),         // 출원인
  }),

  appTitleInfo: z.object({  /* 출원 명칭 정보 */
    titleKo: zs.refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"), // 국문명칭 (필수 해제)
    titleEn: zs, // 영문명칭
  }),

  appGoodsInfo: z.object({  /* 출원 물품류 정보 */
    goodsClass: zs, // 물품류
  }),

  cftLitigantInfo: z.object({  /* 청구인/피청구인 정보 */
    caseTitleKo:    zs.refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"), // 사건명 (필수 해제)
    introducer:     zReq("소개자를 입력해주세요"),               // 소개자
    petitionerType: zReq("의뢰인 원고/피고를 선택해주세요"),     // 의뢰인 원고/피고
    petitioner:     reqUserObject("의뢰인명을 입력해주세요"),    // 의뢰인
    petitionerMemo: zReq("의뢰인 메모를 입력해주세요"),          // 의뢰인 메모
    respondentType: zReq("상대방 원고/피고를 선택해주세요"),     // 상대방 원고/피고
    respondent:     zReq("상대방명을 입력해주세요"),             // 상대방명
    respondentMemo: zReq("상대방 메모를 입력해주세요"),          // 상대방 메모
  }),

  cftNoteInfo: z.object({  /* 비고 정보 */
    note: zReq("비고를 입력해주세요"), // 비고
  }),

  cftJudgmentInfo: z.object({  /* 판결 정보 */
    preExamDate:         zDateReq("심사전치일을 입력해주세요"),    // 심사전치일
    preExamResult:       zReq("심사전치결과를 입력해주세요"),      // 심사전치결과
    finalResult:         zReq("최종결과를 입력해주세요"),          // 최종결과
    amendLimitDate:      zDateReq("보정서 마감일을 입력해주세요"), // 보정서 마감일
    amendSubmitDate:     zDateReq("보정서 제출일을 입력해주세요"), // 보정서 제출일
    judgmentServedDate:  zDateReq("판결 송달일을 입력해주세요"),   // 판결 송달일
    judgmentDate:        zDateReq("판결 결정일을 입력해주세요"),   // 판결 결정일
    decisionContent:     zReq("결정내용을 입력해주세요"),         // 결정내용
    appealContent:       zReq("제기내용을 입력해주세요"),         // 제기내용
    appealLimitDate:     zDateReq("불복제기 마감일을 입력해주세요"), // 불복제기 마감일
    appealDate:          zDateReq("불복제기 청구일을 입력해주세요"), // 불복제기 청구일
    isAbandoned:         zs,                                       // 포기여부
    abandonInstructDate: zDateReq("포기 지시일을 입력해주세요"),   // 포기 지시일
    abandonDate:         zDateReq("포기 일자를 입력해주세요"),     // 포기 일자
    abandonContent:      zReq("포기 내용을 입력해주세요"),        // 포기 내용
  }),

  conflictSeq: zs, // 기타사건 키 (수정 시)
});

export type EtcCaseFormInput  = z.input<typeof EtcCaseSchema>;
export type EtcCaseFormOutput = z.output<typeof EtcCaseSchema>;
