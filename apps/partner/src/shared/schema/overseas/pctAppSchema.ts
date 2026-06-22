import { z } from "zod";
import { zDateReq } from "@shared/schema/utilSchema.ts";

const counterPartyObj = z
  .object({
    counterPartySeq: z.string(),
    counterPartyName: z.string().max(100, "최대 100자까지 입력 가능합니다"),
  })

export const PctSchema = z
  .object({
    appExtSeq: z.string().min(1, "마스터키 필수 선택입니다"),
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
      receiptDate: zDateReq("접수일 필수 선택입니다"),
      ourRef: z.string().min(1, "ourRef 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
      clientRef: z.string().min(1, "출원인 관리번호 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
    }),

    appBaseInfo: z.object({
      noticeExceptionApply: z.object({
        code: z.string().min(1, "공지예외적용 필수 선택입니다"),
        codeName: z.string().optional(),
      }),
      appDeadline: zDateReq("출원마감일 필수 선택입니다"),
      appOrderDate: zDateReq("출원지시일 필수 선택입니다"),
      appDate: zDateReq("출원일 필수 선택입니다"),
      appNo: z.string().min(1, "출원번호 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
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
        userSeq: z.string().min(1, "담당변리사 필수 선택입니다"),
        userName: z.string().min(1, "사건담당자 필수 선택입니다"),
      }),
    }),
    // 당사자정보
    appCounterPartyInfo: z.object({
      clientInfo: z.array(counterPartyObj), // 배열
      applicantInfo: z.array(counterPartyObj), // 배열
      inventorInfo: z
        .object({
          // 단일 유지
          userSeq: z.string(),
          userName: z.string().min(1, "발명자 필수 선택입니다"),
        }),
    }),
    // 명칭정보
    appNameInfo: z.object({
      titleKo: z.string().min(1, "국문 필수 선택입니다").max(255, "최대 255자까지 입력 가능합니다"),
      titleEn: z.string().min(1, "영문 필수 선택입니다").max(255, "최대 255자까지 입력 가능합니다"),
    }),
    // 출원전략설정
    appStrategy: z.object({
      krDesignationYn: z.string().min(1, "지정국가여부 는 필수 선택입니다"),
      // 20개월 마감 - 백엔드 DTO 필드명 기준(complete20Yn, npe20Deadline, entry20CompleteDate, app20Country)
      // deadline20Info: z.object({
      //   complete20Yn: z.string().min(1, "완료여부 는 필수 선택입니다"),
      //   npe20Deadline: zDateReq("국내진입마감일 는 필수 선택입니다"),
      //   entry20CompleteDate: zDateReq("진입완료일 는 필수 선택입니다"),
      //   app20Country: z
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
      // // 30개월 마감 - 백엔드 DTO 필드명 기준(complete30Yn, npe30Deadline, entry30CompleteDate, app30Country)
      // deadline30Info: z.object({
      //   complete30Yn: z.string().min(1, "완료여부 는 필수 선택입니다"),
      //   npe30Deadline: zDateReq("국내진입마감일 는 필수 선택입니다"),
      //   entry30CompleteDate: zDateReq("진입완료일 는 필수 선택입니다"),
      //   app30Country: z
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
    }),

    // 행정관리 - abandonOrderDate(포기지시일), abandonDate(포기일자), abandonNote(포기내용)
    // 백엔드 PctAppManagement DTO 필드명 기준
    appManagement: z.object({
      pctFilingFeeInfo: z.object({
        filingFeeDeadline: zDateReq("마감일 는 필수 선택입니다"),
        filingFeePayDate: zDateReq("제출일 는 필수 선택입니다"),
      }),
      internationalSearchInfo: z.object({
        isaReceiptDate: zDateReq("접수일 는 필수 선택입니다"),
        isrReportDate: zDateReq("보고일 는 필수 선택입니다"),
        searchResult: z.string().min(1, "결과 는 필수 선택입니다"),
      }),
      // abandonOrderDate: zDateReq("포기 지시일 는 필수 선택입니다"),
      // abandonDate: zDateReq("포기 일자 는 필수 선택입니다"),
      // abandonNote: z.string().min(1, "포기 내용 는 필수 선택입니다"),
    }),
    appNote: z.object({
      note: z.string().min(1, "비고 는 필수 선택입니다"),
    }),
    claimSummaryInfo: z.object({
      summary: z.string().min(1, "요약 는 필수 선택입니다"),
      claimScope: z.string().min(1, "청구범위 는 필수 선택입니다"),
    }),
    appMaintenance: z.object({
      pctIpeInfo: z.object({
        ipeDeadline: zDateReq("마감일 는 필수 선택입니다"),
        ipeRequestDate: zDateReq("청구일 는 필수 선택입니다"),
        ipeReportDate: zDateReq("보고일 는 필수 선택입니다"),
      }),
      intlPubInfo: z.object({
        intlReceiptDate: zDateReq("접수일 는 필수 선택입니다"),
        intlPubDate: zDateReq("일자 는 필수 선택입니다"),
        intlPubNo: z.string().min(1, "번호 는 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
      }),
    }),
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

export const overseasPctDefaultValues = createDefaultValues(PctSchema, {
  appStatus: { code: "", codeName: "" },
  "appCaseMng.appRoute.code": "30",
  "appCounterPartyInfo.clientInfo": [{ counterPartySeq: "", counterPartyName: "" }],
  "appCounterPartyInfo.applicantInfo": [{ counterPartySeq: "", counterPartyName: "" }],
});

export type OverseasPctFormInput = z.input<typeof PctSchema>;
export type OverseasPctFormOutput = z.output<typeof PctSchema>;
