import { z } from "zod";
import { RIGHT_TYPE } from "@shared/enum/domesticType.ts";
import { applyValidationRules, applyPairValidationRules, zAmount, zDate, zNumeric, zNumericMax, zNumericReq, zNumericReqMax, zAppNo, zRegNo, zPubNo } from "@shared/schema/utilSchema.ts";

const s = z.preprocess((v) => (v == null ? "" : v), z.string().optional());
const n = z.coerce.number().optional();
const d = zDate;

const codeObj = z
  .object({
    code: s,
    codeName: s,
  });

const userObj = z
  .object({
    userSeq: s,
    userName: s,
  });

const counterPartyObj = z
  .object({
    counterPartySeq: s,
    counterPartyName: s.refine((v) => !v || v.length <= 100, "최대 100자까지 입력 가능합니다"),
  });


// 1. 공통 Validation FILED
const commonRules = [
  // { field: ["appSeq"], message: "마스터키 선택입니다" },
  { field: ["appCaseMng", "category", "code"], message: "구분 필수 선택입니다" },
  { field: ["appCaseMng", "rightType", "code"], message: "권리 필수 선택입니다" },
  { field: ["appCaseMng", "appType", "code"], message: "출원종류 필수 선택입니다" },
  { field: ["appCaseMng", "appCategory", "code"], message: "출원구분 필수 선택입니다" },
  {
    field: ["appCaseMng", "receiptDate"],
    message: "접수일 필수 선택입니다",
  },
  { field: ["appCaseMng", "yourRef"], message: "YourRef 필수 선택입니다" },
  { field: ["appCaseMng", "ourRef"], message: "OurRef는 필수 입력입니다." },
  { field: ["appCaseMng", "clientRef"], message: "출원인관리번호 필수 선택입니다" },
  {
    field: ["appCaseMng", "draftDeadline"],
    message: "초안마감일 필수 선택입니다",
  },
  {
    field: ["appCaseMng", "draftSendDate"],
    message: "초안발송일 필수 선택입니다",
  },
  {
    field: ["appBaseInfo", "appOrderDate"],
    message: "출원지시일 필수 선택입니다",
  },
  {
    field: ["appBaseInfo", "appDeadline"],
    message: "출원마감일 필수 선택입니다",
  },
  {
    field: ["appBaseInfo", "appDate"],
    message: "출원일 필수 선택입니다",
  },
  { field: ["appBaseInfo", "appNo"], message: "출원번호를 입력해주세요" },
  { field: ["appManagerInfo", "deptCode"], message: "부서명 필수 선택입니다" },
  {
    field: ["appManagerInfo", "adminMgrInfo", "userName"],
    message: "관리담당자 필수 선택입니다",
  },
  {
    field: ["appManagerInfo", "caseMgrInfo", "userName"],
    message: "사건담당자 필수 선택입니다",
  },
  {
    field: ["appManagerInfo", "attorneyInfo", "userName"],
    message: "담당변리사 필수 선택입니다",
  },
  // {
  //   field: ["appCounterPartyInfo", "clientInfo", "userName"],
  //   message: "의뢰인 필수 선택입니다",
  // },
  {
    field: ["appCounterPartyInfo", "clientContactInfo", "userName"],
    message: "의뢰인담당자 필수 선택입니다",
  },
  // {
  //   field: ["appCounterPartyInfo", "regMgrInfo", "userName"],
  //   message: "등록권리자 필수 선택입니다",
  // },
  {
    field: ["appNameInfo", "titleKo"],
    message: "국문명칭을 입력해주세요",
  },
  {
    field: ["appNameInfo", "titleEn"],
    message: "영문 필수 선택입니다",
  },
  {
    field: ["appStrategy", "isForeignApp"],
    message: "해외출원 여부 필수 선택입니다",
  },
  {
    field: ["appStrategy", "foreignAppTiming", "code"],
    message: "해외출원 동시추후 필수 선택입니다",
  },
  {
    field: ["appStrategy", "foreign6mDeadline"],
    message: "6월마감 필수 선택입니다",
  },
  {
    field: ["appManagement", "isPoaSubmitted"],
    message: "위임장제출여부 는 필수 선택입니다",
  },
  {
    field: ["appManagement", "priorExamReqDate"],
    message: "우선심사청구일 는 필수 선택입니다",
  },
  {
    field: ["appManagement", "priorExamDecDate"],
    message: "우선심사결정일 는 필수 선택입니다",
  },
  // {
  //   field: ["appManagement", "abandonOrderDate"],
  //   message: "포기 지시일는 필수 선택입니다",
  // },
  // {
  //   field: ["appManagement", "abandonDate"],
  //   message: "포기일자는 필수 선택입니다",
  // },
  // {
  //   field: ["appManagement", "abandonNote"],
  //   message: "포기내용는 필수 선택입니다",
  // },

  {
    field: ["appMaintenance", "regDecisionDate"],
    message: "등록결정일는 필수 선택입니다",
  },
  {
    field: ["appMaintenance", "regReceiptDate"],
    message: "접수일은 필수 선택입니다",
  },
  {
    field: ["appMaintenance", "regNormalDeadline"],
    message: "정상마감는 필수 선택입니다",
  },
  {
    field: ["appMaintenance", "regDate"],
    message: "등록일는 필수 선택입니다",
  },
  {
    field: ["appMaintenance", "regNo"],
    message: "등록번호는 필수 선택입니다",
  },
  {
    field: ["appMaintenance", "regAnnounceDate"],
    message: "등록공고 일자는 필수 선택입니다",
  },
  {
    field: ["appMaintenance", "regAnnounceNo"],
    message: "등록공고번호는 필수 선택입니다",
  },
  {
    field: ["appMaintenance", "annuityOrderDate"],
    message: "위임일자는 필수 선택입니다",
  },
  {
    field: ["appMaintenance", "annuityAgency"],
    message: "위임업체는 필수 선택입니다",
  },
];

// 2. 검증 규칙 객체화
const validationRules = {
  patent: [
    ...commonRules,
    { field: ["appCaseMng", "inventionReportDate"], message: "발명일은 필수 선택입니다" },
    { field: ["appBaseInfo", "appLanguage", "code"], message: "출원언어는 필수 선택입니다" },
    {
      field: ["appBaseInfo", "accessCode"],
      message: "접근코드 필수 선택입니다",
    },
    {
      field: ["appBaseInfo", "transDeadline"],
      message: "번역문마감일은 필수 선택입니다",
    },
    {
      field: ["appBaseInfo", "transSubmitDate"],
      message: "번역문제출일 필수 선택입니다",
    },
    { field: ["appSpecificElement", "grade", "code"], message: "등급 필수 선택입니다" },
    { field: ["appSpecificElement", "independentClaims"], message: "독립항 필수 선택입니다" },
    { field: ["appSpecificElement", "dependentClaims"], message: "종속항 필수 선택입니다" },
    { field: ["appSpecificElement", "specPage"], message: "명세서 필수 선택입니다" },
    { field: ["appSpecificElement", "figureCount"], message: "도수 필수 선택입니다" },
    { field: ["appSpecificElement", "drawingCount"], message: "도면수 필수 선택입니다" },
    {
      field: ["appManagement", "ipcClassification"],
      message: "IPC 분류 는 필수 선택입니다",
    },
    {
      field: ["appManagement", "hasDomesticPriority"],
      message: "국내우선권여부 는 필수 선택입니다",
    },
    {
      field: ["appManagement", "domesticPriorDeadline"],
      message: "국내우선권마감일 는 필수 선택입니다",
    },
    {
      field: ["appManagement", "domesticPriorDate"],
      message: "국내우선권주장일 는 필수 선택입니다",
    },
    {
      field: ["appManagement", "examRequestDeadline"],
      message: "심사청구마감일 는 필수 선택입니다",
    },
    {
      field: ["appManagement", "examRequestDate"],
      message: "심사청구청구일 는 필수 선택입니다",
    },
    {
      field: ["appManagement", "announcementDate"],
      message: "출원공고 일자는 필수 선택입니다",
    },
    {
      field: ["appManagement", "announcementNo"],
      message: "출원공고 번호는 필수 선택입니다",
    },
    {
      field: ["appStrategy", "claimsDeadline"],
      message: "청구범위 마감일 필수 선택입니다",
    },
    {
      field: ["appStrategy", "claimsSubmitDate"],
      message: "청구범위 출원일 필수 선택입니다",
    },
    {
      field: ["appStrategy", "claimsNoticeDate"],
      message: "청구범위 통지일 필수 선택입니다",
    },
    {
      field: ["appStrategy", "foreignAppDate"],
      message: "출원일 필수 선택입니다",
    },
    {
      field: ["appStrategy", "foreign1yDeadline"],
      message: "1년마감 필수 선택입니다",
    },
    // {
    //   field: ["appCounterPartyInfo", "clientInfo", "userName"],
    //   message: "의뢰인 필수 선택입니다",
    // },
    // {
    //   field: ["appCounterPartyInfo", "applicantInfo", "counterPartyName"],
    //   message: "출원인 필수 선택입니다",
    // },
    {
      field: ["appCounterPartyInfo", "inventorInfo", "userName"],
      message: "발명자 필수 선택입니다",
    },
    {
      field: ["appNameInfo", "proposal"],
      message: "제안 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "penaltyDeadline"],
      message: "과태는 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "standardDeadline"],
      message: "정상은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "recoveryDeadline"],
      message: "관리회복은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "annuityReducRate", "code"],
      message: "감면율은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "kipoDelayDays"],
      message: "특허청지연일(PAT) 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "regReductionRate", "code"],
      message: "등록 감면율은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "rightPeriod"],
      message: "권리종속기간 필수 선택입니다",
    },
    {
      field: ["appManagement", "earlyPubRequestDate"],
      message: "조기공개신청일 필수 선택입니다",
    },
    {
      field: ["appManagement", "pubDate"],
      message: "출원공개일자 필수 선택입니다",
    },
    {
      field: ["appManagement", "pubNo"],
      message: "출원공개번호 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "regGraceDeadline"],
      message: "등록 과태마감 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "isAnnuityManaged"],
      message: "연차관리 여부는 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "finalClaimsCount"],
      message: "최종항수(독립/종속)는 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "annuityYear"],
      message: "차수를 입력해주세요",
    },
  ],
  practice: [
    ...commonRules,
    {
      field: ["appCaseMng", "inventionReportDate"],
      message: "고안일은 필수 선택입니다",
    },
    { field: ["appBaseInfo", "accessCode"], message: "접근코드 필수 선택입니다" },
    { field: ["appSpecificElement", "grade", "code"], message: "등급 필수 선택입니다" },
    { field: ["appSpecificElement", "independentClaims"], message: "독립항 필수 선택입니다" },
    { field: ["appSpecificElement", "dependentClaims"], message: "종속항 필수 선택입니다" },
    { field: ["appSpecificElement", "specPage"], message: "명세서 필수 선택입니다" },
    { field: ["appSpecificElement", "figureCount"], message: "도수 필수 선택입니다" },
    { field: ["appSpecificElement", "drawingCount"], message: "도면수 필수 선택입니다" },
    // {
    //   field: ["appCounterPartyInfo", "clientInfo", "userName"],
    //   message: "의뢰인 필수 선택입니다",
    // },
    // {
    //   field: ["appCounterPartyInfo", "applicantInfo", "counterPartyName"],
    //   message: "출원인 필수 선택입니다",
    // },
    {
      field: ["appCounterPartyInfo", "inventorInfo", "userName"],
      message: "발명자 필수 선택입니다",
    },
    {
      field: ["appNameInfo", "proposal"],
      message: "제안 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "penaltyDeadline"],
      message: "과태는 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "standardDeadline"],
      message: "정상은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "recoveryDeadline"],
      message: "관리회복 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "annuityReducRate", "code"],
      message: "감면율은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "kipoDelayDays"],
      message: "특허청지연일(PAT) 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "regReductionRate", "code"],
      message: "등록 감면율은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "rightPeriod"],
      message: "권리종속기간 필수 선택입니다",
    },
    {
      field: ["appManagement", "earlyPubRequestDate"],
      message: "조기공개신청일 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "finalClaimsCount"],
      message: "최종항수(독립/종속)는 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "annuityYear"],
      message: "차수를 입력해주세요",
    },
    {
      field: ["appManagement", "pubDate"],
      message: "출원공개일자 필수 선택입니다",
    },
    {
      field: ["appManagement", "pubNo"],
      message: "출원공개번호 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "regGraceDeadline"],
      message: "등록 과태마감 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "isAnnuityManaged"],
      message: "연차관리 여부는 필수 선택입니다",
    },
  ],
  design: [
    ...commonRules,
    { field: ["appNameInfo", "etcTitle"], message: "기타표시는 필수입니다" },
    {
      field: ["appStrategy", "foreignAppDate"],
      message: "출원일 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "multiDesign"],
      message: "다의장 물품수는 필수 선택입니다",
    },
    {
      field: ["goodsClass", "goodsClass"],
      message: "물품류는 필수 선택입니다",
    },
    {
      field: ["appManagement", "isPartialDesign"],
      message: "부분디자인여부 필수 선택입니다",
    },
    {
      field: ["appBaseInfo", "accessCode"],
      message: "접근코드 필수 선택입니다",
    },
    // {
    //   field: ["appCounterPartyInfo", "clientInfo", "userName"],
    //   message: "의뢰인 필수 선택입니다",
    // },
    // {
    //   field: ["appCounterPartyInfo", "applicantInfo", "counterPartyName"],
    //   message: "출원인 필수 선택입니다",
    // },
    {
      field: ["appCounterPartyInfo", "inventorInfo", "userName"],
      message: "발명자 필수 선택입니다",
    },
    {
      field: ["appNameInfo", "proposal"],
      message: "제안 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "penaltyDeadline"],
      message: "과태는 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "standardDeadline"],
      message: "정상은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "recoveryDeadline"],
      message: "관리회복 선택입니다",
    },
    {
      field: ["appMaintenance", "annuityReducRate", "code"],
      message: "감면율은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "kipoDelayDays"],
      message: "특허청지연일(PAT) 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "regReductionRate", "code"],
      message: "등록 감면율은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "rightPeriod"],
      message: "권리종속기간 필수 선택입니다",
    },
    {
      field: ["appManagement", "earlyPubRequestDate"],
      message: "조기공개신청일 필수 선택입니다",
    },
    {
      field: ["appManagement", "pubDate"],
      message: "출원공개일자 필수 선택입니다",
    },
    {
      field: ["appManagement", "pubNo"],
      message: "출원공개번호 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "regGraceDeadline"],
      message: "등록 과태마감 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "isAnnuityManaged"],
      message: "연차관리 여부는 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "annuityYear"],
      message: "차수를 입력해주세요",
    },
  ],
  trade: [
    ...commonRules,
    { field: ["goodsClass", "goodsClass"], message: "물품류는 필수 선택입니다" },
    { field: ["appStrategy", "classificAppNo"], message: "출원분류번호 필수 선택입니다" },
    {
      field: ["appStrategy", "foreignAppDate"],
      message: "출원일 필수 선택입니다",
    },
    {
      field: ["appManagement", "isTrademarkResearch"],
      message: "상표조사 여부 필수 선택입니다",
    },
    {
      field: ["appManagement", "announcementDate"],
      message: "출원공고 일자는 필수 선택입니다",
    },
    {
      field: ["appManagement", "announcementNo"],
      message: "출원공고 번호는 필수 선택입니다",
    },
    {
      field: ["appManagement", "announcementDecisionDate"],
      message: "출원공고 결정일은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "isRenewalManaged"],
      message: "갱신관리여부은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "priorityDate"],
      message: "기연일은 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "nextPaymentInstallment"],
      message: "차기납부차수 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "trademarkRenewalFee"],
      message: "갱신등록료 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "renewalLateFee"],
      message: "갱신과태료 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "standardDeadline"],
      message: "정상마감일 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "penaltyDeadline"],
      message: "과태마감일 필수 선택입니다",
    },
    // ... 더 추가
  ],
};

// 3. 베이스 스키마 정의
export const DomesticBaseSchema = z.object({
  appSeq: s,
  /** 상세 조회 시 API가 내려주는 출원상태(code/codeName). 저장 요청에서는 제외 */
  appStatus: codeObj.optional(),
  // 출원사건관리
  appCaseMng: z.object({
    category: codeObj,
    rightType: z.object({
      code: z.string(),
      codeName: z.string(),
    }),
    appType: codeObj,

    appCategory: codeObj,
    // z.discriminatedUnion("rightType", [
    //   RightTypePatentSchema,
    //   RightTypePracticeSchema,
    // ]);
    //inventionReportDate: z.string().min(1, "접수일 필수 선택입니다"),
    inventionReportDate: d,
    receiptDate: d,
    ourRef: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    yourRef: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    clientRef: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    draftDeadline: d,
    draftSendDate: d,
  }),
  // 출원기본정보
  appBaseInfo: z.object({
    appOrderDate: d,
    appDeadline: d,
    appDate: d,
    appNo: zAppNo,
    accessCode: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    appLanguage: codeObj.optional().catch({ code: "", codeName: "" }),
    transDeadline: d,
    transSubmitDate: d,
  }),
  // 담당정보
  appManagerInfo: z.object({
    deptCode: s.catch("").refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    // deptName: z.string().min(1, "부서명 필수 선택입니다"),
    adminMgrInfo: userObj,
    caseMgrInfo: userObj,
    attorneyInfo: userObj,
  }),
  // 당사자정보
  appCounterPartyInfo: z.object({
    clientInfo: z.array(counterPartyObj).catch([]),
    clientContactInfo: userObj,
    applicantInfo: z.array(counterPartyObj).catch([]),
    inventorInfo: userObj.optional().catch({ userSeq: "", userName: "" }),
    regMgrInfo: z.array(counterPartyObj).catch([]),
  }),
  // 명칭정보
  appNameInfo: z.object({
    proposal: s.refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"),
    titleKo: s.refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"),
    titleEn: s.refine((v) => !v || v.length <= 255, "최대 255자까지 입력 가능합니다"),
    etcTitle: s.refine((v) => !v || v.length <= 100, "최대 100자까지 입력 가능합니다"),
  }),
  // 명세서구성요소 — DB varchar(5) 대응 max 5자리
  appSpecificElement: z
    .object({
      grade: codeObj,
      independentClaims: zNumericMax(5),
      dependentClaims:   zNumericMax(5),
      specPage:          zNumericMax(5),
      figureCount:       zNumericMax(5),
      drawingCount:      zNumericMax(5),
    })
    .optional()
    .catch({
      grade: { code: "", codeName: "" },
      independentClaims: "",
      dependentClaims: "",
      specPage: "",
      figureCount: "",
      drawingCount: "",
    }),
  // 출원전략설정
  appStrategy: z.object({
    classificAppNo: zAppNo,
    firstAppInfo: z
      .object({
        firstAppDate: s,
        firstAppNo: zAppNo,
      })
      .optional(),
    originalAppInfo: z
      .object({
        originalAppDate: s,
        originalAppNo: zAppNo,
      })
      .optional(),
    reAppInfo: z
      .object({
        reAppDate: s,
        reAppNo: zAppNo,
      })
      .optional(),
    dualAppInfo: z
      .object({
        dualAppDate: s,
        dualAppNo: zAppNo,
      })
      .optional(),
    globalAppInfo: z
      .object({
        globalAppDate: s,
        globalAppNo: zAppNo,
      })
      .optional(),
    originalRegInfo: z
      .object({
        originalRegDate: s,
        originalRegNo: zRegNo,
      })
      .optional(),
    madridAppInfo: z
      .object({
        madridAppDate: s,
        madridAppNo: zAppNo,
      })
      .optional(),
    isForeignApp: s,
    foreignAppTiming: codeObj.optional().catch({ code: "", codeName: "" }),

    foreign6mDeadline: d,
    foreign1yDeadline: d,
    foreignAppDate: d,
    claimsNoticeDate: d,
    claimsDeadline: d,
    claimsSubmitDate: d,
  }),
  // 출원 행정관리
  appManagement: z.object({
    isPartialDesign: s,
    isPoaSubmitted: s,
    ipcClassification: s.catch("").refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    isTrademarkResearch: s,
    earlyPubRequestDate: d,
    hasDomesticPriority: s,
    domesticPriorDeadline: d,
    domesticPriorDate: d,
    examRequestDeadline: d,
    examRequestDate: d,
    priorExamReqDate: d,
    priorExamDecDate: d,
    announcementDecisionDate: d,
    pubDate: d,
    pubNo: zPubNo,
    announcementDate: d,
    announcementNo: zPubNo,
    abandonOrderDate: d,
    abandonDate: d,
    abandonNote: s.refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
  }),
  // 등록 권리유지관리 — DB varchar(5) 대응 카운트 필드 max 5자리
  appMaintenance: z.object({
    finalClaimsCount: zNumericMax(5),
    multiDesign:      s,
    kipoDelayDays:    zNumericMax(5),
    rightPeriod: d,
    isAnnuityManaged: s,
    isRenewalManaged: s,
    regDecisionDate: d,
    regReceiptDate: d,
    priorityDate: d,
    regNormalDeadline: d,
    regGraceDeadline: d,
    regReductionRate: codeObj.optional().catch({ code: "", codeName: "" }),
    regDate: d,
    regNo: zRegNo,
    regAnnounceDate: d,
    regAnnounceNo: zPubNo,
    standardDeadline: d,
    penaltyDeadline: d,
    annuityReducRate: codeObj.optional().catch({ code: "", codeName: "" }),
    nextPaymentInstallment: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    annuityYear:         zNumericMax(5),
    recoveryDeadline:    d,
    trademarkRenewalFee: zAmount,
    renewalLateFee:      zAmount,
    annuityOrderDate: d,
    annuityAgency: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
  }),

  // 요약/청구 (특허·실용신안)
  claimSummaryInfo: z
    .object({
      summary: z.string().nullable().optional(),
      claimScope: z.string().nullable().optional(),
    })
    .optional(),

  // 설명/요점 (디자인)
  designDescriptionInfo: z
    .object({
      designDescription: z.string().nullable().optional(),
      designSummary: z.string().nullable().optional(),
    })
    .optional(),

  // 비고
  appNote: z
    .object({
      note: s,
    }),
  // 비고
  goodsClass: z
    .object({
      goodsClass: s,
    })
    .optional(),

  // 대표이미지
  multiViewDrawingFile: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "10MB 이하여야 합니다")
    .refine(
      (file) => ["image/gif", "image/jpeg", "image/png"].includes(file.type),
      "gif, jpeg, png만 가능합니다",
    )
    .optional(),
  // appImageFile: z
  //   .object({
  //     fileSeq: s,
  //     originalFilename: s,
  //     fileName: s,
  //     fileUrl: s,
  //     size: s,
  //     lastModified: s,
  //   }).optional()
  //   ,
  fileInfo: z.array(
    z.object({
      fileSeq: s.optional(),
      fileName: s,
      fileSize: s,
      fileUrl: s,
      docSeq: s.optional(),
    }),
  ).optional().catch([]),
});

// 4. 권리별 검증 함수 정의
const commonRefine = (data: any, ctx: z.RefinementCtx) => {
  const hasClient = data.appCounterPartyInfo.clientInfo?.some((c: any) => !!c.counterPartyName);
  if (!hasClient) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "의뢰인은 최소 1명 이상 지정해야 합니다",
      path: ["appCounterPartyInfo", "clientInfo", 0, "counterPartyName"],
    });
  }

  const hasRegMgr = data.appCounterPartyInfo.regMgrInfo?.some((c: any) => !!c.counterPartyName);
  if (!hasRegMgr) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "등록권리자는 최소 1명 이상 지정해야 합니다",
      path: ["appCounterPartyInfo", "regMgrInfo", 0, "counterPartyName"],
    });
  }

  const hasApplicant = data.appCounterPartyInfo.applicantInfo?.some((c: any) => !!c.counterPartyName);
  if (!hasApplicant) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "출원인은 최소 1명 이상 지정해야 합니다",
      path: ["appCounterPartyInfo", "applicantInfo", 0, "counterPartyName"],
    });
  }

  // 공통 쌍 검증 — 원출원/재출원 (둘 다 입력하거나 둘 다 비워야 함)
  applyPairValidationRules([
    {
      dateField: ["appStrategy", "originalAppInfo", "originalAppDate"],
      noField:   ["appStrategy", "originalAppInfo", "originalAppNo"],
      dateMessage: "원출원일을 입력해주세요",
      noMessage:   "원출원번호를 입력해주세요",
      dateFormat: true,
    },
    {
      dateField: ["appStrategy", "reAppInfo", "reAppDate"],
      noField:   ["appStrategy", "reAppInfo", "reAppNo"],
      dateMessage: "재출원일을 입력해주세요",
      noMessage:   "재출원번호를 입력해주세요",
      dateFormat: true,
    },
  ], data, ctx);
};

// 특허 / 실용신안 검증
const refineHardIp = (data: any, ctx: z.RefinementCtx) => {
  commonRefine(data, ctx);
  const { rightType } = data.appCaseMng;

  if (rightType.code === RIGHT_TYPE.PATENT.code) {
    applyValidationRules(validationRules.patent, data, ctx);
    applyPairValidationRules([
      {
        dateField: ["appStrategy", "firstAppInfo", "firstAppDate"],
        noField:   ["appStrategy", "firstAppInfo", "firstAppNo"],
        dateMessage: "최초출원일을 입력해주세요",
        noMessage:   "최초출원번호를 입력해주세요",
        dateFormat: true,
      },
      {
        dateField: ["appStrategy", "dualAppInfo", "dualAppDate"],
        noField:   ["appStrategy", "dualAppInfo", "dualAppNo"],
        dateMessage: "이중출원일을 입력해주세요",
        noMessage:   "이중출원번호를 입력해주세요",
        dateFormat: true,
      },
      {
        dateField: ["appStrategy", "globalAppInfo", "globalAppDate"],
        noField:   ["appStrategy", "globalAppInfo", "globalAppNo"],
        dateMessage: "국제출원일을 입력해주세요",
        noMessage:   "국제출원번호를 입력해주세요",
        dateFormat: true,
      },
    ], data, ctx);
  } else if (rightType.code === RIGHT_TYPE.PRACTICE.code) {
    applyValidationRules(validationRules.practice, data, ctx);
    applyPairValidationRules([
      {
        dateField: ["appStrategy", "firstAppInfo", "firstAppDate"],
        noField:   ["appStrategy", "firstAppInfo", "firstAppNo"],
        dateMessage: "최초출원일을 입력해주세요",
        noMessage:   "최초출원번호를 입력해주세요",
        dateFormat: true,
      },
    ], data, ctx);
  } else {
    // 기본값 (특허)
    applyValidationRules(validationRules.patent, data, ctx);
  }
};

// 디자인 검증
const refineDesign = (data: any, ctx: z.RefinementCtx) => {
  commonRefine(data, ctx);
  applyValidationRules(validationRules.design, data, ctx);
  applyPairValidationRules([
    {
      dateField: ["appStrategy", "originalRegInfo", "originalRegDate"],
      noField:   ["appStrategy", "originalRegInfo", "originalRegNo"],
      dateMessage: "원등록일을 입력해주세요",
      noMessage:   "원등록번호를 입력해주세요",
      dateFormat: true,
    },
  ], data, ctx);
};

// 상표 검증
const refineTrademark = (data: any, ctx: z.RefinementCtx) => {
  commonRefine(data, ctx);
  applyValidationRules(validationRules.trade, data, ctx);
  applyPairValidationRules([
    {
      dateField: ["appStrategy", "madridAppInfo", "madridAppDate"],
      noField:   ["appStrategy", "madridAppInfo", "madridAppNo"],
      dateMessage: "마드리드 국제등록일을 입력해주세요",
      noMessage:   "마드리드 국제등록번호를 입력해주세요",
      dateFormat: true,
    },
  ], data, ctx);
};

// 5. 최종 스키마 정의
export const DomesticHardIpSchema = DomesticBaseSchema.superRefine(refineHardIp);
export const DomesticDesignSchema = DomesticBaseSchema.superRefine(refineDesign);
export const DomesticTrademarkSchema = DomesticBaseSchema.superRefine(refineTrademark);

export const DomesticSchema = DomesticBaseSchema.superRefine((data, ctx) => {
  const { rightType } = data.appCaseMng;

  switch (rightType.code) {
    case RIGHT_TYPE.PATENT.code:
    case RIGHT_TYPE.PRACTICE.code:
      refineHardIp(data, ctx);
      break;
    case RIGHT_TYPE.DESIGN.code:
      refineDesign(data, ctx);
      break;
    case RIGHT_TYPE.TRADE.code:
      refineTrademark(data, ctx);
      break;
    default:
      refineHardIp(data, ctx);
      break;
  }
});

function createDefaultValues(
  schema: z.ZodTypeAny,
  overrides: Record<string, any> = {},
  path: string = "",
): any {
  const typeName = schema._def.typeName;

  if (typeName === "ZodObject") {
    const shape = (schema as z.ZodObject<any>).shape;
    return Object.fromEntries(
      Object.entries(shape).map(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;

        if (currentPath in overrides) {
          return [key, overrides[currentPath]];
        }

        return [key, createDefaultValues(value as z.ZodTypeAny, overrides, currentPath)];
      }),
    );
  }

  if (typeName === "ZodOptional" || typeName === "ZodNullable") {
    return createDefaultValues(schema._def.innerType, overrides, path);
  }

  if (typeName === "ZodEffects" || typeName === "ZodCatch") {
    const innerSchema = typeName === "ZodEffects" ? schema._def.schema : schema._def.innerType;
    return createDefaultValues(innerSchema, overrides, path);
  }

  if (typeName === "ZodBoolean") return false;
  if (typeName === "ZodNumber") return 0;
  if (typeName === "ZodArray") return [];
  if (typeName === "ZodDate") return null;

  return "";
}

export const defaultValues = createDefaultValues(DomesticSchema, {
  appStatus: { code: "", codeName: "" },
  "appCaseMng.category": { code: "10", codeName: "일반" },
  "appCaseMng.rightType": { code: "10", codeName: "특허" },
  "appStrategy.isForeignApp": "N",
  "appManagement.isPoaSubmitted": "N",
  "appManagement.isTrademarkResearch": "N",
  "appManagement.hasDomesticPriority": "N",
  "appManagement.isPartialDesign": "N",
  "appMaintenance.isAnnuityManaged": "N",
  "appMaintenance.isRenewalManaged": "N",
  "appCounterPartyInfo.clientInfo": [{ counterPartySeq: "", counterPartyName: "" }],     // 기본 1개
  "appCounterPartyInfo.applicantInfo": [{ counterPartySeq: "", counterPartyName: "" }],
  "appCounterPartyInfo.regMgrInfo": [{ counterPartySeq: "", counterPartyName: "" }],
});

export type DomesticFormInput = z.input<typeof DomesticSchema>;
export type DomesticFormOutput = z.output<typeof DomesticSchema>;
