import { z } from "zod";


export const productModalSchema = z.object({
  appSeq: z.string().min(1, "시퀀스 필수 선택입니다"), // 시퀀스
  productClass: z.string().min(1, "Class 필수 입력입니다"), // Class
  productCount: z.coerce.number().min(0, "상품수 필수 입력입니다"), // 상품수
  productSummaryKo: z.string().min(1, "지정상품(국문) 필수 입력입니다"), // 지정상품(국문)
  productSummaryEn: z.string().min(1, "지정상품(영문) 필수 입력입니다"), // 지정상품(영문)
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

export const productModalDefaultValues = createDefaultValues(productModalSchema, {
  "remittanceCount": "1",
});

export type ProductModalFormInput = z.input<typeof productModalSchema>;
export type ProductModalFormOutput = z.output<typeof productModalSchema>;
