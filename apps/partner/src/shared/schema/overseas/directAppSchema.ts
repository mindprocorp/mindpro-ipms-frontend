import { z } from "zod";
import { RIGHT_TYPE } from "@shared/enum/domesticType.ts";
import { applyValidationRules, zNumeric, zNumericMax } from "@shared/schema/utilSchema.ts";

// 헬퍼 선언
const s = z.string().nullable().optional();
const n = z.coerce.number().nullable().optional();

const codeObj = z
  .object({
    code: z.string().nullable().optional(),
    codeName: z.string().nullable().optional(),
  })
  .optional();

const requiredCodeObj = (message: string) =>
  z.object({
    code: z.string().min(1, message),
    codeName: z.string().nullable().optional(),
  });

const userObj = z
  .object({
    userSeq: z.string().nullable().optional(),
    userName: z.string().nullable().optional(),
  })
  .optional();

const requiredUserObj = (message: string) =>
  z.object({
    userSeq: z.string().nullable().optional(),
    userName: z.string().min(1, message),
  });

const counterPartyObj = z
  .object({
    counterPartySeq: z.string().nullable().optional(),
    counterPartyName: z.string().nullable().optional().refine((v) => !v || v.length <= 100, "최대 100자까지 입력 가능합니다"),
  })
  .optional();



// 1. 공통 Validation FILED
const commonRules = [
  {
    field: ["appCaseMng", "receiptDate"],
    message: "접수일 필수 선택입니다",
    dateFormat: true,
  },
];

// 2. 검증 규칙 객체화
const validationRules = {
  ////////// 특허
  patent: [
    ...commonRules,
    {
      field: ["appBaseInfo", "appOrderDate"],
      message: "출원지시일 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appCounterPartyInfo", "inventorInfo", "userName"],
      message: "발명자/고안자 필수 선택입니다",
    },
    { field: ["appSpecificElement", "grade", "code"], message: "등급 필수 선택입니다" },
    { field: ["appSpecificElement", "independentClaims"], message: "독립항 필수 선택입니다" },
    { field: ["appSpecificElement", "dependentClaims"], message: "종속항 필수 선택입니다" },
    { field: ["appSpecificElement", "overseaSpecPage"], message: "명세서 필수 선택입니다" },
    { field: ["appSpecificElement", "drawingCount"], message: "도면 필수 선택입니다" },
    { field: ["appSpecificElement", "specPage"], message: "국내명세서 필수 선택입니다" },
    // {
    //   field: ["appStrategy", "firstAppInfo", "firstAppDate"],
    //   message: "최초출원일 필수 선택입니다",
    //   dateFormat: true,
    // },
    // {
    //   field: ["appStrategy", "firstAppInfo", "firstAppNo"],
    //   message: "최초출원번호 필수 선택입니다",
    // },

    // {
    //   field: ["appStrategy", "globalAppInfo", "globalAppDate"],
    //   message: "국제출원일 필수 선택입니다",
    //   dateFormat: true,
    // },
    // {
    //   field: ["appStrategy", "globalAppInfo", "globalAppNo"],
    //   message: "국제출원번호 필수 선택입니다",
    // },
    // {
    //   field: ["appStrategy", "provisionalAppInfo", "provisionalAppDate"],
    //   message: "가출원일 필수 선택입니다",
    //   dateFormat: true,
    // },
    // {
    //   field: ["appStrategy", "provisionalAppInfo", "provisionalAppNo"],
    //   message: "가출원번호 필수 선택입니다",
    // },

    {
      field: ["appManagement", "ipcClassification"],
      message: "IPC 분류 는 필수 선택입니다",
    },
    {
      field: ["appManagement", "parentRegAppDate"],
      message: "모등록일 는 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appManagement", "examRequestDeadline"],
      message: "심사청구마감일 는 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appManagement", "examRequestOrderDate"],
      message: "심사청구지시일 는 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appManagement", "examRequestDate"],
      message: "심사청구청구일 는 필수 선택입니다",
      dateFormat: true,
    },

    {
      field: ["appManagement", "pubDate"],
      message: "출원공개 일자는 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appManagement", "pubNo"],
      message: "출원공개 번호는 필수 선택입니다",
    },

    {
      field: ["appManagement", "announcementDate"],
      message: "출원공고 일자는 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appManagement", "announcementNo"],
      message: "출원공고 번호는 필수 선택입니다",
    },

    {
      field: ["appMaintenance", "finalClaimCount"],
      message: "최종항수(독립/종속) 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "kipoDelayDays"],
      message: "특허청지연일(PAT) 필수 입력입니다",
    },
    {
      field: ["appMaintenance", "rightPeriod"],
      message: "권리존속기간은 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appMaintenance", "isAnnuityManaged"],
      message: "연차관리여부 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "regReceiptDate"],
      message: "접수일 필수 선택입니다",
      dateFormat: true,
    },
  ],
  practice: [
    ...commonRules,
    {
      field: ["appBaseInfo", "appOrderDate"],
      message: "출원지시일 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appCounterPartyInfo", "inventorInfo", "userName"],
      message: "발명자/고안자 필수 선택입니다",
    },
    { field: ["appSpecificElement", "grade", "code"], message: "등급 필수 선택입니다" },
    { field: ["appSpecificElement", "independentClaims"], message: "독립항 필수 선택입니다" },
    { field: ["appSpecificElement", "dependentClaims"], message: "종속항 필수 선택입니다" },
    { field: ["appSpecificElement", "overseaSpecPage"], message: "명세서 필수 선택입니다" },
    { field: ["appSpecificElement", "drawingCount"], message: "도면 필수 선택입니다" },
    { field: ["appSpecificElement", "specPage"], message: "국내명세서 필수 선택입니다" },
    // {
    //   field: ["appStrategy", "firstAppInfo", "firstAppDate"],
    //   message: "최초출원일 필수 선택입니다",
    //   dateFormat: true,
    // },
    // {
    //   field: ["appStrategy", "firstAppInfo", "firstAppNo"],
    //   message: "최초출원번호 필수 선택입니다",
    // },

    // {
    //   field: ["appStrategy", "globalAppInfo", "globalAppDate"],
    //   message: "국제출원일 필수 선택입니다",
    //   dateFormat: true,
    // },
    // {
    //   field: ["appStrategy", "globalAppInfo", "globalAppNo"],
    //   message: "국제출원번호 필수 선택입니다",
    // },
    // {
    //   field: ["appStrategy", "provisionalAppInfo", "provisionalAppDate"],
    //   message: "가출원일 필수 선택입니다",
    //   dateFormat: true,
    // },
    // {
    //   field: ["appStrategy", "provisionalAppInfo", "provisionalAppNo"],
    //   message: "가출원번호 필수 선택입니다",
    // },

    {
      field: ["appManagement", "ipcClassification"],
      message: "IPC 분류 는 필수 선택입니다",
    },
    {
      field: ["appManagement", "parentRegAppDate"],
      message: "모등록일 는 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appManagement", "examRequestDeadline"],
      message: "심사청구마감일 는 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appManagement", "examRequestOrderDate"],
      message: "심사청구지시일 는 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appManagement", "examRequestDate"],
      message: "심사청구청구일 는 필수 선택입니다",
      dateFormat: true,
    },

    {
      field: ["appManagement", "pubDate"],
      message: "출원공개 일자는 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appManagement", "pubNo"],
      message: "출원공개 번호는 필수 선택입니다",
    },

    {
      field: ["appManagement", "announcementDate"],
      message: "출원공고 일자는 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appManagement", "announcementNo"],
      message: "출원공고 번호는 필수 선택입니다",
    },

    {
      field: ["appMaintenance", "finalClaimCount"],
      message: "최종항수(독립/종속) 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "kipoDelayDays"],
      message: "특허청지연일(PAT) 필수 입력입니다",
    },
    {
      field: ["appMaintenance", "rightPeriod"],
      message: "권리존속기간은 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appMaintenance", "isAnnuityManaged"],
      message: "연차관리여부 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "regReceiptDate"],
      message: "접수일 필수 선택입니다",
      dateFormat: true,
    },

    // ... 더 추가
  ],
  design: [
    ...commonRules,
    // {
    //   field: ["appCounterPartyInfo", "appMgrInfo", "userName"],
    //   message: "출원담당자 필수 선택입니다",
    // },
    {
      field: ["appBaseInfo", "noticeExceptionApply"],
      message: "공지예외적용 필수 선택입니다."
    },
    {
      field: ["appCounterPartyInfo", "inventorInfo", "userName"],
      message: "발명자/고안자 필수 선택입니다",
    },
    // {
    //   field: ["appStrategy", "parentRegAppDate"],
    //   message: "모등록일 필수 선택입니다",
    //   dateFormat: true,
    // },
    // {
    //   field: ["appStrategy", "firstAppInfo", "firstAppDate"],
    //   message: "최초출원일자 필수 선택입니다",
    //   dateFormat: true,
    // },
    // {
    //   field: ["appStrategy", "firstAppInfo", "firstAppNo"],
    //   message: "최초출원번호 필수 선택입니다",
    // },

    // {
    //   field: ["appStrategy", "originalRegInfo", "originalRegDate"],
    //   message: "원등록일자 필수 선택입니다",
    //   dateFormat: true,
    // },
    // {
    //   field: ["appStrategy", "originalRegInfo", "originalRegNo"],
    //   message: "원등록번호 필수 선택입니다",
    // },
    {
      field: ["appManagement", "pubDate"],
      message: "출원공개일자 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appManagement", "pubNo"],
      message: "출원공개번호 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "goodsClass", "goodsClass"],
      message: "물품분류 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "kipoDelayDays"],
      message: "특허청지연일(PAT) 필수 선택입니다",
    },
    {
      field: ["appMaintenance", "rightPeriod"],
      message: "권리존속기간 필수 선택입니다",
      dateFormat: true,
    },
    {
      field: ["appMaintenance", "isAnnuityManaged"],
      message: "연차관리여부 필수 선택입니다",
    },
  ],
  trade: [
    ...commonRules,

    { field: ["goodsClass", "goodsClass"], message: "물품류는 필수 선택입니다" },
    {
      field: ["appCounterPartyInfo", "inventorInfo", "userName"],
      message: "발명자/고안자 필수 선택입니다",
    },

    // ... 더 추가
  ],
};

const DirectAppSchema = z
  .object({
    appExtSeq: s,
    appSeq: s,
    /** 상세 조회 전용 — 저장 시 제외 */
    appStatus: z
      .object({
        code: z.string().nullable().optional(),
        codeName: z.string().nullable().optional(),
      })
      .optional(),
    appCaseMng: z.object({
      appRoute: requiredCodeObj("출원루트 필수 선택입니다"),
      rightType: requiredCodeObj("권리 필수 선택입니다"),
      appCategory: requiredCodeObj("출원구분 필수 선택입니다"),
      appCountryInfo: requiredCodeObj("출원국코드 필수 선택입니다"),
      appCountry: s,
      ourRef: z.string().min(1, "OurRef 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
      yourRef: z.string().min(1, "YourRef 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
      clientRef: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
      receiptDate: z.string().min(1, "접수일 필수 선택입니다"),
    }),

    appBaseInfo: z.object({
      appOrderDate: s,
      appDeadline: z.string().min(1, "출원마감일 필수 선택입니다"),
      noticeExceptionApply: codeObj.nullable().optional(),
      oaDeliveryDate: z.string().min(1, "오더발송일 필수 선택입니다"),
      appDate: z.string().min(1, "출원일 필수 선택입니다"),
      appNo: z.string().min(1, "출원번호 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
    }),

    appManagerInfo: z.object({
      deptCode: z.string().min(1, "부서명 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
      adminMgrInfo: requiredUserObj("관리담당자 필수 선택입니다"),
      caseMgrInfo: requiredUserObj("사건담당자 필수 선택입니다"),
      attorneyInfo: requiredUserObj("담당변리사 필수 선택입니다"),
    }),

    appCounterPartyInfo: z.object({
      foreignAgentInfo: z.array(counterPartyObj), // 배열
      clientInfo: z.array(counterPartyObj), // 배열
      applicantInfo: z.array(counterPartyObj), // 배열
      appMgrInfo: userObj, // 단일 유지
      inventorInfo: userObj, // 단일 유지
      regMgrInfo: z.array(counterPartyObj), // 배열
    }),

    appNameInfo: z.object({
      titleKo: z.string().min(1, "국문명칭을 입력해주세요").max(255, "최대 255자까지 입력 가능합니다"),
      titleEn: z.string().min(1, "영문명칭을 입력해주세요").max(255, "최대 255자까지 입력 가능합니다"),
    }),

    appSpecificElement: z.object({
      grade: codeObj,
      independentClaims: n,
      dependentClaims: n,
      specPage: n,
      drawingCount: n,
      overseaSpecPage: n,
    }).optional(),

    appStrategy: z.object({
      parentRegAppDate: s,
      parentRegAppNo: s,
      provisionalAppInfo: z
        .object({
          provisionalAppDate: s,
          provisionalAppNo: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
        })
        .optional(),
      firstAppInfo: z
        .object({
          firstAppDate: s,
          firstAppNo: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
        })
        .optional(),
      originalAppInfo: z
        .object({
          originalAppDate: s,
          originalAppNo: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
        })
        .optional(),
      originalRegInfo: z
        .object({
          originalRegDate: s,
          originalRegNo: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
        })
        .optional(),
      reAppInfo: z
        .object({
          reAppDate: s,
          reAppNo: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
        })
        .optional(),
      globalAppInfo: z
        .object({
          globalAppDate: s,
          globalAppNo: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
        })
        .optional(),
    }),

    appManagement: z.object({
      parentRegAppDate: s,
      ipcClassification: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
      examRequestDeadline: s,
      examRequestOrderDate: s,
      examRequestDate: s,
      pubDate: s,
      pubNo: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
      announcementDate: s,
      announcementNo: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
      abandonOrderDate: s,
      abandonDate: s,
      abandonNote: s,
      announcementDecisionDate: s,
    }),

    appMaintenance: z.object({
      finalClaimCount: zNumericMax(5),
      kipoDelayDays:    zNumericMax(5),
      rightPeriod: s,
      isAnnuityManaged: s,
      isRenewalManaged: s,
      regDecisionDate: s,
      regReceiptDate: s,
      regNormalDeadline: s,
      regGraceDeadline: s,
      regDate: s,
      regNo: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
      regAnnounceDate: s,
      regAnnounceNo: s.refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
      nextPaymentInstallment: s,
      annuityOrderDate: s,
      annuityAgency: s,
      standardDeadline: s,
      penaltyDeadline: s,
      regOrderDate: s,
      regPaymentDate: s,
      renewalDeadline: s,
      goodsClass: z
        .object({
          goodsClass: s,
        })
        .optional(),
    }),

    goodsClass: z
      .object({
        goodsClass: s,
      })
      .optional(),

    mainImageFile: z
      .any()
      .optional()
      .refine((v) => !v || v === "" || v instanceof File, "파일 형식이어야 합니다")
      .refine(
        (v) => !v || v === "" || (v instanceof File && v.size <= 10 * 1024 * 1024),
        "10MB 이하여야 합니다",
      )
      .refine(
        (v) =>
          !v ||
          v === "" ||
          (v instanceof File && ["image/jpeg", "image/png", "image/gif"].includes(v.type)),
        "jpg, png, gif만 가능합니다",
      ),

    appNote: z
      .object({
        note: s,
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // 배열 필드 필수 검증 추가
    const hasForeignAgent = data.appCounterPartyInfo.foreignAgentInfo?.some((c: any) => !!c.counterPartyName);
    if (!hasForeignAgent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "해외대리인은 최소 1명 이상 지정해야 합니다",
        path: ["appCounterPartyInfo", "foreignAgentInfo", 0, "counterPartyName"],
      });
    }

    const hasClient = data.appCounterPartyInfo.clientInfo?.some((c: any) => !!c.counterPartyName);
    if (!hasClient) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "의뢰인은 최소 1명 이상 지정해야 합니다",
        path: ["appCounterPartyInfo", "clientInfo", 0, "counterPartyName"],
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

    const hasRegMgr = data.appCounterPartyInfo.regMgrInfo?.some((c: any) => !!c.counterPartyName);
    if (!hasRegMgr) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "등록관리자(권리자)는 최소 1명 이상 지정해야 합니다",
        path: ["appCounterPartyInfo", "regMgrInfo", 0, "counterPartyName"],
      });
    }

    const rightTypeCode = data.appCaseMng?.rightType?.code;

    if (!rightTypeCode) return;

    console.log("superRefine rightType:", rightTypeCode);

    switch (rightTypeCode) {
      case RIGHT_TYPE.PATENT.code:
        applyValidationRules(validationRules.patent, data, ctx);
        break;
      case RIGHT_TYPE.PRACTICE.code:
        applyValidationRules(validationRules.practice, data, ctx);
        break;
      case RIGHT_TYPE.DESIGN.code:
        applyValidationRules(validationRules.design, data, ctx);
        break;
      case RIGHT_TYPE.TRADE.code:
        applyValidationRules(validationRules.trade, data, ctx);
        break;
      default:
        applyValidationRules(validationRules.patent, data, ctx);
        break;
    }
  });
export default DirectAppSchema;

function createDefaultValues(
  schema: z.ZodTypeAny,
  overrides: Record<string, any> = {},
  path: string = "",
): any {
  // ZodCatch 내부 스키마로 재귀
  if (schema instanceof z.ZodCatch) {
    // @ts-ignore
    return createDefaultValues(schema._def.innerType, overrides, path);
  }

  // ZodOptional 내부 스키마로 재귀
  if (schema instanceof z.ZodOptional) {
    // @ts-ignore
    return createDefaultValues(schema._def.innerType, overrides, path);
  }

  // ZodNullable 내부 스키마로 재귀
  if (schema instanceof z.ZodNullable) {
    // @ts-ignore
    return createDefaultValues(schema._def.innerType, overrides, path);
  }

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    return Object.fromEntries(
      Object.entries(shape).map(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (currentPath in overrides) {
          return [key, overrides[currentPath]];
        }
        return [key, createDefaultValues(value, overrides, currentPath)];
      }),
    );
  }

  if (schema instanceof z.ZodArray) return [];
  if (schema instanceof z.ZodBoolean) return false;
  if (schema instanceof z.ZodNumber) return 0;
  if (schema instanceof z.ZodDate) return null;

  return "";
}
export const overseasDirectAppDefaultValues = createDefaultValues(DirectAppSchema, {
  appStatus: { code: "", codeName: "" },
  "appCaseMng.appRoute.code": "20",
  "appCaseMng.rightType.code": "10",
  "appCounterPartyInfo.foreignAgentInfo": [{ counterPartySeq: "", counterPartyName: "" }],
  "appCounterPartyInfo.clientInfo": [{ counterPartySeq: "", counterPartyName: "" }],
  "appCounterPartyInfo.applicantInfo": [{ counterPartySeq: "", counterPartyName: "" }],
  "appCounterPartyInfo.regMgrInfo": [{ counterPartySeq: "", counterPartyName: "" }],
  "appStrategy.isForeignApp": "N",
  "appManagement.isPoaSubmitted": "N",
  "appManagement.isTrademarkResearch": "N",
  "appManagement.hasDomesticPriority": "N",
  "appManagement.isPartialDesign": "N",
  "appMaintenance.isRenewalManaged": "N",
  "appMaintenance.isAnnuityManaged": "N",
});

export type OverseasDirectAppFormInput = z.input<typeof DirectAppSchema>;
export type OverseasDirectAppFormOutput = z.output<typeof DirectAppSchema>;
