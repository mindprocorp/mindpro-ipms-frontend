import { z } from "zod";
import { RIGHT_TYPE } from "@shared/enum/domesticType.ts";
import { zDateReq, zNumericReq, zNumericReqMax } from "@shared/schema/utilSchema.ts";


const counterPartyObj = z
  .object({
    counterPartySeq: z.string().optional(),
    counterPartyName: z.string().optional().refine((v) => !v || v.length <= 100, "최대 100자까지 입력 가능합니다"),
  });


export const BasicSchema = z.object({
  appExtSeq: z.string().optional(),
  // 출원사건관리
  appCaseMng: z.object({
    rightType: z.object({
      code: z.string().min(1, "권리 필수 선택입니다"),
      codeName: z.string(),
    }),
    appType: z.object({
      code: z.string().min(1, "출원종류 필수 선택입니다"),
      codeName: z.string(),
    }),
    receiptDate: zDateReq("접수일 필수 선택입니다"),
    ourRef: z.string().min(1, "OurRef를 입력해주세요").max(30, "OurRef는 30자를 초과할 수 없습니다"),
    appCompleteDate: zDateReq("출원완료일 필수 선택입니다"),
    appManagerInfo: z.object({
      userSeq: z.string(),
      userName: z.string().min(1, "출원담당자 필수 선택입니다"),
    }),
    caseNo: z.string().min(1, "사건번호를 입력해주세요").max(30, "최대 30자까지 입력 가능합니다"),
  }),

  // 담당정보
  appManagerInfo: z.object({
    deptCode: z.string().min(1, "부서명 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
    // deptName: z.string().min(1, "부서명 필수 선택입니다"),
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
    clientInfo: z.array(counterPartyObj),
    clientContactInfo: z.object({
      userSeq: z.string(),
      userName: z.string().min(1, "의뢰인담당자 필수 선택입니다"),
    }),
    applicantInfo: z.array(counterPartyObj),
    inventorInfo: z.object({
      userSeq: z.string(),
      userName: z.string().min(1, "발명자 필수 선택입니다"),
    }),
    regMgrInfo: z.array(counterPartyObj),
  }),
  // 명칭정보
  appNameInfo: z.object({
    titleKo: z.string().min(1, "국문명칭을 입력해주세요").max(255, "최대 255자까지 입력 가능합니다"),
    titleEn: z.string().min(1, "영문명칭을 입력해주세요").max(255, "최대 255자까지 입력 가능합니다"),
  }),
  // 명세서구성요소
  appSpecificElement: z.object({
    grade: z.object({
      code: z.string().min(1, "등급 필수 선택입니다"),
      codeName: z.string(),
    }),
    independentClaims: zNumericReqMax("독립항 필수 선택입니다", 5),
    dependentClaims:   zNumericReqMax("종속항 필수 선택입니다", 5),
    overseaSpecPage:   zNumericReqMax("명세서 필수 선택입니다", 5),
    drawingCount:      zNumericReqMax("도면 필수 선택입니다", 5),
  }),
  // 출원전략설정
  // appStrategy: z.object({
  //   globalAppInfo: z.object({
  //     globalAppDate: z.string().min(1, "국제출원정보 날짜 는 필수 선택입니다"),
  //     globalAppNo: z.string().min(1, "국제출원정보 번호 는 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"),
  //   }),
  // }),
  // 지정국가 정보
  designatedStateInfo: z.object({
    designatedIndividual: z.array(z.string()),
    designatedPct: z.array(z.string()),
    designatedEp: z.array(z.string()),
    designatedMadrid: z.array(z.string()),
    designatedIntlDesign: z.array(z.string()),
    // abandonDate: z.string().min(1, "일자는 필수 선택입니다"),
    // abandonContent: z.string().min(1, "내용은 필수 선택입니다"),
  }),
  // 비고
  appNote: z.object({
    note: z.string().min(1, "비고는 필수 선택입니다"),
  }),
  // 물품류
  goodsClass: z.object({
    goodsClass: z.string().min(1, "물품류는 필수 선택입니다"),
  }),
  // 대표이미지
  mainImageFile: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "10MB 이하여야 합니다")
    .refine(
      (file) => ["image/gif", "image/jpeg", "image/png"].includes(file.type),
      "gif, jpeg, png만 가능합니다",
    )
    .optional(),
  // 이미지 정보 조회
  fileInfo: z.array(
    z.object({
      fileSeq: z.string(),
      fileName: z.string(),
      fileUrl: z.string(),
      fileSize: z.string(),
      // lastModified: z.string(),
      docSeq: z.string(),
      docNm: z.string(),
    }),
  ),
}).superRefine((data, ctx) => {
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
      message: "등록권리자는 최소 1명 이상 지정해야 합니다",
      path: ["appCounterPartyInfo", "regMgrInfo", 0, "counterPartyName"],
    });
  }
});



function createDefaultValues(
  schema: z.ZodTypeAny,
  overrides: Record<string, any> = {},
  path: string = "",
): any {
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

export const overseasBasicDefaultValues = createDefaultValues(BasicSchema, {
  "appCaseMng.rightType.code": "10",
  "designatedStateInfo.designatedIndividual": [""],
  "designatedStateInfo.designatedPct": [""],
  "designatedStateInfo.designatedEp": [""],
  "designatedStateInfo.designatedMadrid": [""],
  "designatedStateInfo.designatedIntlDesign": [""],
});



export type OverseasBasicFormInput = z.input<typeof BasicSchema>;
export type OverseasBasicFormOutput = z.output<typeof BasicSchema>;
