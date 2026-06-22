import { z } from "zod";
import { zDateReq, zAmountReq, zPercentReq } from "@shared/schema/utilSchema.ts";

export const rndModalSchema = z
  .object({
    appSeq: z.string().min(1, "시퀀스 필수 선택입니다"),
    rndSeq: z.string().optional(),
    projectNo: z.string().min(1, "과제번호 필수 선택입니다"),
    ministryName: z.string().min(1, "국가부처명 필수 선택입니다"),
    agencyName: z.string().min(1, "과제관리(전문기관명) 필수 선택입니다"), // 과제관리(전문기관명)
    researchNo: z.string().min(1, "연구과제 고유번호 필수 선택입니다"), // 연구과제 고유번호
    bizName: z.string().min(1, "연구사업명 필수 선택입니다"), // 연구사업명
    rndName: z.string().min(1, "연구과제명 필수 선택입니다"), // 연구과제명
    shareRatio: zPercentReq("기여율 필수 선택입니다"), // 기여율 (0~100, 소수점 2자리)
    mainLab: z.string().min(1, "과제수행기관명(대표연구소) 필수 선택입니다"), // 과제수행기관명(대표연구소)
    performingLab: z.string().min(1, "참여기관(수행연구소) 필수 선택입니다"), // 참여기관(수행연구소)
    rndStartDate: zDateReq("연구과제 시작일자 필수 선택입니다"), // 연구과제 시작일자
    rndClosingDate: zDateReq("연구과제 종료일자 필수 선택입니다"), // 연구과제 종료일자
    totalRndCost: zAmountReq("연구비총액 필수 선택입니다"), // 연구비총액
  })
  .refine(
    (data) => {
      // 두 필드 모두 형식이 맞을 때만 비교 (regex 통과 전제)
      if (data.rndStartDate.length !== 8 || data.rndClosingDate.length !== 8) return true;
      return data.rndClosingDate >= data.rndStartDate;
    },
    {
      message: "연구과제 종료일자는 시작일자보다 같거나 이후여야 합니다",
      path: ["rndClosingDate"], // 에러를 종료일자 필드에 표시
    },
  );

function createDefaultValues(
  schema: z.ZodTypeAny,
  overrides: Record<string, any> = {},
  path: string = "",
): any {
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

export const rndModalDefaultValues = createDefaultValues(rndModalSchema, {
  mustReadYn: "Y",
});

export type RndModalFormInput = z.input<typeof rndModalSchema>;
export type RndModalFormOutput = z.output<typeof rndModalSchema>;
