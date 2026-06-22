import { z } from "zod";
import { zDateReq } from "@shared/schema/utilSchema.ts";

export const EpSchema = z
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
      appCategory: z.object({
        code: z.string().min(1, "출원구분 필수 선택입니다"),
        codeName: z.string().optional(),
      }),
      category: z
        .object({
          code: z.string().optional(),
          codeName: z.string().optional(),
        })
        .optional(),
      receiptDate: zDateReq("접수일 필수 선택입니다"),
      ourRef: z.string().min(1, "ourRef 필수 입력입니다").max(30, "최대 30자까지 입력 가능합니다"),
      yourRef: z.string().min(1, "yourRef 필수 입력입니다").max(30, "최대 30자까지 입력 가능합니다"),
      clientRef: z.string().min(1, "출원인 관리번호 필수 입력입니다").max(30, "최대 30자까지 입력 가능합니다"),
    }),

    appBaseInfo: z.object({
      noticeExceptionApply: z.object({
        code: z.string().min(1, "공지예외적용 필수 선택입니다"),
        codeName: z.string().optional(),
      }),
      appDeadline: zDateReq("출원마감일 필수 선택입니다"),
      oaDeliveryDate: zDateReq("오더발송일 필수 선택입니다"),
      appDate: zDateReq("출원일 필수 선택입니다"),
      appNo: z.string().min(1, "출원번호 필수 입력입니다").max(30, "최대 30자까지 입력 가능합니다"),
      divAppInfo: z.object({
        divDeadline: zDateReq("분할출원마감일 필수 선택입니다"),
        divAppDate: zDateReq("분할 출원일 필수 선택입니다"),
        divAppNo: z.string().min(1, "분할출원번호 필수 입력입니다").max(30, "최대 30자까지 입력 가능합니다"),
      }),
    }),

    // 담당정보
    appManagerInfo: z.object({
      deptCode: z.string().min(1, "부서명 필수 입력입니다").max(30, "최대 30자까지 입력 가능합니다"),
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
      foreignAgentInfo: z.array(
        z.object({
          counterPartySeq: z.string(),
          counterPartyName: z.string().max(100, "최대 100자까지 입력 가능합니다"),
        }),
      ),

      clientInfo: z.array(
        z.object({
          counterPartySeq: z.string(),
          counterPartyName: z.string().max(100, "최대 100자까지 입력 가능합니다"),
        }),
      ),

      applicantInfo: z.array(
        z.object({
          counterPartySeq: z.string(),
          counterPartyName: z.string().max(100, "최대 100자까지 입력 가능합니다"),
        }),
      ),

      inventorInfo: z.object({
        userSeq: z.string(),
        userName: z.string().min(1, "발명자 필수 선택입니다"),
      }),
    }),
    // 명칭정보
    appNameInfo: z.object({
      titleKo: z.string().min(1, "국문 명칭 필수 입력입니다").max(255, "최대 255자까지 입력 가능합니다"),
      titleEn: z.string().min(1, "영문 명칭 필수 입력입니다").max(255, "최대 255자까지 입력 가능합니다"),
    }),
    // 물품류 (EP는 IPC분류 사용)
    appIpcClass: z.object({
      ipcClassification: z.string().min(1, "물품류(IPC분류) 필수 선택입니다"),
    }),
    // 명세서구성요소
    appSpecificElement: z.object({
      grade: z.object({
        code: z.string().min(1, "등급 필수 선택입니다"),
        codeName: z.string().optional(),
      }),
      independentClaims: z.coerce.number().min(1, "독립항 필수 입력입니다"),
      dependentClaims: z.coerce.number().min(1, "종속항 필수 입력입니다"),
      overseaSpecPage: z.coerce.number().min(1, "명세서 필수 입력입니다"),
      drawingCount: z.coerce.number().min(1, "도면 필수 입력입니다"),
    }),
    // 출원전략설정
    // appStrategy: z.object({
    //   originalAppInfo: z.object({
    //     originalAppDate: zDateReq("원출원일 필수 선택입니다"),
    //     originalAppNo: z.string().min(1, "원출원번호 필수 입력입니다").max(30, "최대 30자까지 입력 가능합니다"),
    //   }),
    //   globalAppInfo: z.object({
    //     globalAppDate: zDateReq("국제출원일 필수 선택입니다"),
    //     globalAppNo: z.string().min(1, "국제출원번호 필수 입력입니다").max(30, "최대 30자까지 입력 가능합니다"),
    //   }),
    // }),
    // 지정국가
    designatedStateInfo: z.object({
      designated: z
        .preprocess(
          (val) =>
            typeof val === "string"
              ? val
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean)
              : val,
          z
            .array(z.string())
            .min(1, "지정국가 최소 1개 이상 입력해야 합니다")
            .refine(
              (arr) => arr.every((item) => /^[A-Z]{2}$/.test(item)),
              "각 항목은 대문자 2글자 형식이어야 합니다 (예: JP, EN, US)",
            ),
        )
        .optional(),
    }),
    registeredStates: z.object({
      registeredStates: z
        .preprocess(
          (val) =>
            typeof val === "string"
              ? val
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean)
              : val,
          z
            .array(z.string())
            .min(1, "등록국가 최소 1개 이상 입력해야 합니다")
            .refine(
              (arr) => arr.every((item) => /^[A-Z]{2}$/.test(item)),
              "각 항목은 대문자 2글자 형식이어야 합니다 (예: JP, EN, US)",
            ),
        )
        .optional(),
    }),

    // 행정관리
    appManagement: z.object({
      claimAmendDate: zDateReq("청구보장일 필수 선택입니다"),
      announcementDate: zDateReq("공고일 필수 선택입니다"),
      examRequestDeadline: zDateReq("심사청구_마감일 필수 선택입니다"),
      examRequestOrderDate: zDateReq("심사청구_지시일 필수 선택입니다"),
      examRequestDate: zDateReq("심사청구_청구일 필수 선택입니다"),
      searchReceiptDate: zDateReq("접수일 필수 선택입니다"),
      searchReportDate: zDateReq("보고일 필수 선택입니다"),
      epSearchResult: z.string().min(1, "결과 필수 선택입니다"),
      pubDate: zDateReq("출원공개_일자 필수 선택입니다"),
      pubNo: z.string().min(1, "출원공개번호 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
    }),
    appNote: z.object({
      note: z.string().min(1, "비고 필수 입력입니다"),
    }),
    claimSummaryInfo: z.object({
      summary: z.string().min(1, "요약 필수 입력입니다"),
      claimScope: z.string().min(1, "청구범위 필수 입력입니다"),
    }),
    appMaintenance: z.object({
      regDecisionDate: zDateReq("결정일 필수 선택입니다"),
      regNormalDeadline: zDateReq("마감일 필수 선택입니다"),
      regGraceDeadline: zDateReq("과태일 필수 선택입니다"),
      regOrderDate: zDateReq("지시일 필수 선택입니다"),
      regPaymentDate: zDateReq("납부일 필수 선택입니다"),
      regDate: zDateReq("등록_일자 필수 선택입니다"),
      regNo: z.string().min(1, "등록_번호 필수 입력입니다").max(30, "최대 30자까지 입력 가능합니다"),
      regAnnounceDate: zDateReq("등록공고_일자 필수 선택입니다"),
      regAnnounceNo: z.string().min(1, "등록공고_번호 필수 입력입니다").max(30, "최대 30자까지 입력 가능합니다"),
      annuityOrderDate: zDateReq("관리위임_일자 필수 선택입니다"),
      annuityAgency: z.string().min(1, "관리위임_업체 필수 입력입니다"),
      // deemedWithdrawalReceiptDate: zDateReq("접수일(포기취하) 필수 선택입니다"),
      // deemedWithdrawalDate: zDateReq("포기취하일자 필수 선택입니다"),
      // deemedWithdrawalContent: z.string().min(1, "포기내용 필수 입력입니다"),
    }),
    // 대표이미지
    mainDrawingFile: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, "10MB 이하여야 합니다")
      .refine(
        (file) => ["image/gif", "image/jpeg", "image/png"].includes(file.type),
        "gif, jpeg, png만 가능합니다",
      )
      .optional(),
    fileInfo: z.array(z.any()).optional(),
  })
  .superRefine((data, ctx) => {
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

export const overseasEpDefaultValues = createDefaultValues(EpSchema, {
  appStatus: { code: "", codeName: "" },
  "appCaseMng.rightType.code": "10",
  "appCaseMng.appRoute.code": "40",
  "appCounterPartyInfo.foreignAgentInfo": [{ counterPartySeq: "", counterPartyName: "" }],
  "appCounterPartyInfo.clientInfo": [{ counterPartySeq: "", counterPartyName: "" }],
  "appCounterPartyInfo.applicantInfo": [{ counterPartySeq: "", counterPartyName: "" }],
});

export type OverseasEpFormInput = z.input<typeof EpSchema>;
export type OverseasEpFormOutput = z.output<typeof EpSchema>;
