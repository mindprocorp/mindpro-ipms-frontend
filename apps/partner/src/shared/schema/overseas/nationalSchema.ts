import { z } from "zod";
import { zDateReq } from "@shared/schema/utilSchema.ts";

const counterPartyObj = z.object({
  counterPartySeq: z.string(),
  counterPartyName: z.string().max(100, "최대 100자까지 입력 가능합니다"),
});

export const NationalSchema = z
  .object({
    appExtSeq: z.string().min(1, "마스터키는 필수입니다."),
    appSeq: z.string().optional(),
    /** 상세 조회 전용 — 저장 시 제외 */
    appStatus: z
      .object({
        code: z.string().optional(),
        codeName: z.string().optional(),
      })
      .optional(),
    // 출원사건관리
    appCaseMng: z.object({
      appRoute: z.object({
        code: z.string().min(1, "출원루트 필수 선택입니다"),
        codeName: z.string().optional(),
      }),
      category: z.object({
        code: z.string().optional(),
        codeName: z.string().optional(),
      }).optional(),
      rightType: z.object({
        code: z.string().optional(),
        codeName: z.string().optional(),
      }).optional(),
      appCategory: z.object({
        code: z.string().optional(),
        codeName: z.string().optional(),
      }).optional(),
      receiptDate: z.string().min(1, "접수일 필수 선택입니다"),
      ourRef: z.string().min(1, "OurRef를 입력해주세요").max(30, "최대 30자까지 입력 가능합니다"),
      clientRef: z.string().min(1, "출원인 관리번호를 입력해주세요").max(30, "최대 30자까지 입력 가능합니다"),
    }),

    appBaseInfo: z.object({
      noticeExceptionApply: z.object({
        code: z.string().min(1, "공지예외적용 필수 선택입니다"),
        codeName: z.string().optional(),
      }),
      appDeadline: zDateReq("출원마감일 필수 선택입니다"),
      appDate: zDateReq("출원일 필수 선택입니다"),
      appNo: z.string().optional().refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
      authorityRefNo: z.string().optional().refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
      authoritySubmissionDate: z.string().optional(),
      hagueDeliveryDate: z.string().optional(),
      wipoRefNo: z.string().optional().refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
      regDate: z.string().optional(),
      regNo: z.string().optional().refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
    }),

    // 담당정보
    appManagerInfo: z.object({
      deptCode: z.string().min(1, "부서명 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
      // deptName: z.string().min(1, "부서명 필수 선택입니다"),
      applicantContactInfo: z.object({
        userSeq: z.string(),
        userName: z.string().min(1, "출원인담당 필수 선택입니다"),
      }),
      adminMgrInfo: z.object({
        userSeq: z.string(),
        userName: z.string().min(1, "관리담당자 필수 선택입니다"),
      }),
      caseMgrInfo: z.object({
        userSeq: z.string(),
        userName: z.string().min(1, "사건담당자 필수 선택입니다"),
      }),
      attorneyInfo: z.object({
        userSeq: z.string(),
        userName: z.string().min(1, "담당변리사 필수 선택입니다"),
      }),
    }),
    // 당사자정보
    appCounterPartyInfo: z.object({
      clientInfo: z.array(counterPartyObj), // 배열,
      applicantInfo: z.array(counterPartyObj), // 배열
      inventorInfo: z.object({
        userSeq: z.string(),
        userName: z.string().min(1, "창작자 필수 선택입니다"),
      }),
      regMgrInfo: z.array(counterPartyObj), // 배열
    }),
    // 명칭정보
    appNameInfo: z.object({
      titleKo: z.string().min(1, "국문명칭을 입력해주세요").max(255, "최대 255자까지 입력 가능합니다"),
      titleEn: z.string().min(1, "영문명칭을 입력해주세요").max(255, "최대 255자까지 입력 가능합니다"),
    }),

    // 출원전략설정
    // appStrategy: z.object({
    //   designated: z
    //     .preprocess(
    //       (val) =>
    //         typeof val === "string"
    //           ? val
    //               .split(",")
    //               .map((v) => v.trim())
    //               .filter(Boolean)
    //           : val,
    //       z
    //         .array(z.string())
    //         .min(1, "최소 1개 이상 입력해야 합니다")
    //         .refine(
    //           (arr) => arr.every((item) => /^[A-Z]{2}$/.test(item)),
    //           "각 항목은 대문자 2글자 형식이어야 합니다 (예: JP, EN, US)",
    //         ),
    //     )
    //     .optional(),
    //   registeredStates: z
    //     .preprocess(
    //       (val) =>
    //         typeof val === "string"
    //           ? val
    //               .split(",")
    //               .map((v) => v.trim())
    //               .filter(Boolean)
    //           : val,
    //       z
    //         .array(z.string())
    //         .min(1, "최소 1개 이상 입력해야 합니다")
    //         .refine(
    //           (arr) => arr.every((item) => /^[A-Z]{2}$/.test(item)),
    //           "각 항목은 대문자 2글자 형식이어야 합니다 (예: JP, EN, US)",
    //         ),
    //     )
    //     .optional(),
    // }),

    // 행정관리
    appManagement: z.object({
      amendNoticeDate: z.string().optional(),
      amendDeadline: z.string().optional(),
      amendSubmitDate: z.string().optional(),
      publicYn: z.string().optional(),
      defermentMonthCount: z.string().optional(),
      pubDate: z.string().optional(),
      pubNo: z.string().optional().refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
      abandonReceiptDate: z.string().optional(),
      abandonDate: z.string().optional(),
      abandonNote: z.string().optional().refine((v) => !v || v.length <= 500, "최대 500자까지 입력 가능합니다"),
    }),
    designDescription: z.object({
      designDescription: z.string().optional(),
      designSummary: z.string().optional(),
    }).optional(),

    appNote: z.object({
      note: z.string().optional(),
    }),
    appMaintenance: z.object({
      protectionStartDate: z.string().optional(),
      rightPeriod: z.string().optional(),
      paymentInstallment: z.string().optional(),
      standardDeadline: z.string().optional(),
      penaltyDeadline: z.string().optional(),
    }),
    mainImageFile: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, "10MB 이하여야 합니다")
      .refine(
        (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
        "jpg, png, gif만 가능합니다",
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
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
  });

function createDefaultValues(
  schema: z.ZodTypeAny,
  overrides: Record<string, any> = {},
  path: string = "",
): any {
  if ((schema as any)._def?.typeName === "ZodEffects") {
    return createDefaultValues((schema as any)._def.schema, overrides, path);
  }
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
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
  // 🔹 array ⭐ 핵심
  if (schema instanceof z.ZodArray) {
    return [];
  }

  if (schema instanceof z.ZodBoolean) return false;
  if (schema instanceof z.ZodNumber) return 0;
  if (schema instanceof z.ZodArray) return [];
  if (schema instanceof z.ZodDate) return null;

  return "";
}

export const overseasNationalDefaultValues = createDefaultValues(NationalSchema, {
  appStatus: { code: "", codeName: "" },
  "appCaseMng.rightType": { code: "30", codeName: "디자인" },
  "appCaseMng.category": { code: "20", codeName: "해외" },
  "appStrategy.designated": [],
  "appStrategy.subsequent": [],
  "appStrategy.registeredStates": [],
  "appCounterPartyInfo.clientInfo": [{ counterPartySeq: "", counterPartyName: "" }],
  "appCounterPartyInfo.applicantInfo": [{ counterPartySeq: "", counterPartyName: "" }],
  "appCounterPartyInfo.regMgrInfo": [{ counterPartySeq: "", counterPartyName: "" }],
});

export type OverseasNationalFormInput = z.input<typeof NationalSchema>;
export type OverseasNationalFormOutput = z.output<typeof NationalSchema>;
