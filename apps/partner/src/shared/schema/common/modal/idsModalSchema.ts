import { z } from "zod";
import { zDateReq } from "@shared/schema/utilSchema.ts";

export const idsModalSchema = z.object({
  officeSeq: z.string().optional().nullish(),
  appSeq: z.string().min(1, "appSeq 필수 선택입니다"),
  idsSeq: z.string().optional(),
  occurCountryCode: z.string().min(1, "발생국가코드 필수 선택입니다"), //
  occurCountryName: z.string().optional(), //
  occurNo: z.string().min(1, "발생번호 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"), // 필독
  familyNoEn: z.string().min(1, "영문패밀리번호 필수 선택입니다").max(30, "최대 30자까지 입력 가능합니다"), //메모
  //isIdsSubmitted: z.string().min(1, "IDS 기제출 여부 필수 선택입니다"), //메모
  occurDate: zDateReq("발생일 필수 선택입니다"),
  idsPubDate: zDateReq("공개일 필수 선택입니다"), //메모
  idsReceiptDate: zDateReq("접수일 필수 선택입니다"), //메모
  idsSendDate: zDateReq("IDS 발송일 필수 선택입니다"), //메모
  idsDeadline: z.string().min(1, "IDS 제출마감일 필수 선택입니다"), //메모
  isIdsSubmitted: z.string().min(1, "IDS 기제출건 필수 선택입니다"), //메모
  idsSubmitDate: zDateReq("IDS 제출일 필수 선택입니다"), //메모
  idsSubmitMng: z.string().min(1, "제출담당자 필수 선택입니다"), //메모
  idsSubmitMngNm: z.string().min(1, "제출담당자 필수 선택입니다"), //메모
  note: z.string().min(1, "비고 필수 선택입니다"), //메모
});

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

export const idsModalDefaultValues = createDefaultValues(idsModalSchema, {
  mustReadYn: "Y",
});

export type IdsModalFormInput = z.input<typeof idsModalSchema>;
export type IdsModalFormOutput = z.output<typeof idsModalSchema>;
