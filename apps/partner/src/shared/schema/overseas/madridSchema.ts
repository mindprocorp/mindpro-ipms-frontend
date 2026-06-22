import { z } from "zod";
import { zDateReq } from "@shared/schema/utilSchema.ts";

const counterPartyObj = z.object({
  counterPartySeq: z.string(),
  counterPartyName: z.string().max(100, "최대 100자까지 입력 가능합니다"),
});

export const MadridSchema = z
  .object({
    appExtSeq: z.string().min(1, "마스터키는 필수 입니다"),
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
      rightType: z.object({
        code: z.string().min(1, "권리 필수 선택입니다"),
        codeName: z.string().optional(),
      }),
      receiptDate: z.string().min(1, "접수일 필수 선택입니다"),
      ourRef: z.string().min(1, "ourRef 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
      yourRef: z.string().min(1, "yourRef 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
      clientRef: z.string().min(1, "출원인 관리번호 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
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
      autoProtectionDate: z.string().optional(),
      announcementDate: z.string().optional(),
      announcementNo: z.string().optional().refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
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
      clientInfo: z.array(counterPartyObj), // 배열
      applicantInfo: z.array(counterPartyObj), // 배열
    }),
    // 명칭정보
    appNameInfo: z.object({
      titleKo: z.string().min(1, "국문 필수 선택입니다").max(255, "최대 255자까지 입력 가능합니다"),
      titleEn: z.string().min(1, "영문 필수 선택입니다").max(255, "최대 255자까지 입력 가능합니다"),
    }),
    // 물품류
    goodsClass: z.object({
      goodsClass: z.string().min(1, "물품류 필수 선택입니다"),
    }),

    // 출원전략설정
    // appStrategy: z.object({
    //   originalRegInfo: z.object({
    //     originalRegDate: z.string().min(1, "원등록일 필수 선택입니다"),
    //     originalRegNo: z.string().min(1, "원등록번호 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
    //   }),
    //   // 지정국가
    //   designated: z
    //     .preprocess(
    //       (val) =>
    //         typeof val === "string"
    //           ? val
    //               .split(",")
    //               .map((v) => v.trim())
    //               .filter(Boolean)
    //           : val,
    //       z.array(z.string()),
    //     )
    //     .optional(),
    //   subsequent: z
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
      abandonReceiptDate: z.string().optional(),
      abandonDate: z.string().optional(),
      abandonNote: z.string().optional(),
    }),
    appNote: z.object({
      note: z.string().optional(),
    }),
    appMaintenance: z.object({
      domesticRegInfo: z.object({
        domesticRegDate: z.string().optional(),
        domesticRegNo: z.string().optional().refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
      }),
      regDate: z.string().optional(),
      regNo: z.string().optional().refine((v) => !v || v.length <= 30, "최대 30자까지 입력 가능합니다"),
      paymentInstallment: z.string().optional(),
      standardDeadline: z.string().optional(),
      penaltyDeadline: z.string().optional(),
      annuityOrderDate: z.string().optional(),
      annuityAgency: z.string().optional(),
    }),
    trademarkImage: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, "10MB 이하여야 합니다")
      .refine(
        (file) => ["image/gif", "image/jpeg", "image/png"].includes(file.type),
        "gif, jpeg, png만 가능합니다",
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

export const overseasMadridDefaultValues = createDefaultValues(MadridSchema, {
  appStatus: { code: "", codeName: "" },
  "appCaseMng.rightType": { code: "40", codeName: "상표" },
  "appStrategy.designated": [],
  "appStrategy.subsequent": [],
  "appStrategy.registeredStates": [],
  "appCounterPartyInfo.clientInfo": [{ counterPartySeq: "", counterPartyName: "" }], // ✅
  "appCounterPartyInfo.applicantInfo": [{ counterPartySeq: "", counterPartyName: "" }], // ✅
});

export type OverseasMadridFormInput = z.input<typeof MadridSchema>;
export type OverseasMadridFormOutput = z.output<typeof MadridSchema>;
