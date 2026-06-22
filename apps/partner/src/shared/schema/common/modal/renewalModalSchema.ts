import { z } from "zod";
import { zDateReq, zAmountReq, zAppNoReq } from "@shared/schema/utilSchema.ts";


export const renewalModalSchema = z.object({
  appSeq: z.string().min(1, "시퀀스 필수 선택입니다"), // 시퀀스
  remittanceCount: z.preprocess(
    (v) => (v == null ? "" : String(v)),
    z.string().min(1, "차수 필수 선택입니다"),
  ), // 차수 (API가 number로 내려올 수 있어 preprocessing)
  paymentDiv: z.string().min(1, "납부구분 코드 필수 선택입니다"), // 납부구분코드
  requestDate: zDateReq("출원일/신청일 필수 선택입니다"), // 출원일/신청일
  appNo: zAppNoReq("출원번호 필수 선택입니다"), // 출원번호
  krwAmount: zAmountReq("납부금액 필수 선택입니다", 99_999_999, "납부금액은 1억 미만으로 입력해주세요."), // 납부금액
  costRemittanceDate: zDateReq("등록일/납부일 필수 선택입니다"), // 등록일/납부일
  note: z.string().min(1, "비고 필수 선택입니다"), // 비고
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

export const renewalModalDefaultValues = createDefaultValues(renewalModalSchema, {
  "remittanceCount": "1",
});

export type RenewalModalFormInput = z.input<typeof renewalModalSchema>;
export type RenewalModalFormOutput = z.output<typeof renewalModalSchema>;
