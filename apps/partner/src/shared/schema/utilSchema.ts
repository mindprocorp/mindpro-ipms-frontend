import { z } from "zod";

// 날짜 유효성 검사 (YYYYMMDD 또는 YYYY-MM-DD → 실제 존재하는 날짜인지)
const isValidDate = (v: string) => {
  const digits = v.replace(/-/g, "");
  if (!/^\d{8}$/.test(digits)) return false;
  const y = parseInt(digits.slice(0, 4));
  const m = parseInt(digits.slice(4, 6));
  const d = parseInt(digits.slice(6, 8));
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

// 날짜 — 입력했으면 유효한 날짜여야 함
export const zDate = z.preprocess(
  (v) => (v == null ? "" : v),
  z.string()
    .optional()
    .refine((v) => !v || isValidDate(v), "유효하지 않은 날짜입니다")
);

// 정수 — 입력했으면 숫자만 (선택)
export const zNumeric = z.preprocess(
  (v) => (v == null ? "" : typeof v === "number" ? String(v) : v),
  z.string()
    .optional()
    .refine((v) => !v || /^[0-9.,]+$/.test(v), "숫자만 입력 가능합니다")
    .transform((v) => {
      const val = v?.replace(/,/g, "") || "0";
      return val.replace(/^0+(?!$)/, "") || "0";
    })
);

// 정수(varchar 길이 제한) — DB varchar(n) 컬럼 대응
// z.preprocess로 null/number 타입 처리 (API 응답값이 number로 올 때 대비)
export const zNumericMax = (max: number) =>
  z.preprocess(
    (v) => (v == null ? "" : typeof v === "number" ? String(Math.round(v)) : v),
    z.string()
      .optional()
      .refine((v) => !v || /^[0-9,]+$/.test(v), "숫자만 입력 가능합니다")
      .refine((v) => !v || v.replace(/,/g, "").length <= max, `최대 ${max}자리까지 입력 가능합니다`),
  );

// 금액 — 콤마 포함 허용, 음수(-) 허용. 백엔드 전송 전 콤마 제거.
export const zAmount = z.preprocess(
  (v) => (v == null ? "" : typeof v === "number" ? String(v) : v),
  z.string()
    .optional()
    .refine((v) => !v || /^-?[0-9,.]+$/.test(v), "숫자만 입력 가능합니다")
    .transform((v) => {
      if (!v) return "0";
      const isNeg = v.startsWith("-");
      const body = (isNeg ? v.slice(1) : v).replace(/,/g, "");
      const cleaned = body.replace(/^0+(?!$)/, "") || "0";
      return cleaned === "0" ? "0" : (isNeg ? `-${cleaned}` : cleaned);
    })
);

// 소수 — 환율·외화금액 등 소수점 포함, 음수 허용
export const zDecimal = z.preprocess(
  (v) => (v == null ? "" : typeof v === "number" ? String(v) : v),
  z.string()
    .optional()
    .refine((v) => !v || /^-?[0-9.,]+$/.test(v), "숫자만 입력 가능합니다")
    .transform((v) => {
      if (!v) return "0";
      const isNeg = v.startsWith("-");
      const body = (isNeg ? v.slice(1) : v).replace(/,/g, "");
      const cleaned = body.replace(/^0+(?!\.)(?!$)/, "") || "0";
      return cleaned === "0" ? "0" : (isNeg ? `-${cleaned}` : cleaned);
    })
);

// 퍼센트 — 0~100, 소수점 2자리까지 허용 (선택)
export const zPercent = z.preprocess(
  (v) => (v == null ? "" : typeof v === "number" ? String(v) : v),
  z.string()
    .optional()
    .refine((v) => {
      if (!v) return true;
      const val = v.replace(/[%,]/g, "");
      return /^[0-9]+(\.[0-9]{1,2})?$/.test(val);
    }, "숫자만 입력 가능합니다 (소수점 2자리)")
    .refine((v) => {
      if (!v) return true;
      const val = v.replace(/[%,]/g, "");
      return parseFloat(val) <= 100;
    }, "100 이하로 입력해 주세요")
    .transform((v) => {
      if (!v) return 0;
      return parseFloat(v.replace(/[%,]/g, ""));
    })
);

// 퍼센트 — 필수
export const zPercentReq = (msg: string) =>
  z.preprocess(
    (v) => (v == null ? "" : typeof v === "number" ? String(v) : v),
    z.string().min(1, msg)
      .refine((v) => {
        const val = v.replace(/[%,]/g, "");
        return /^[0-9]+(\.[0-9]{1,2})?$/.test(val);
      }, "숫자만 입력 가능합니다 (소수점 2자리)")
      .refine((v) => {
        const val = v.replace(/[%,]/g, "");
        return parseFloat(val) <= 100;
      }, "100 이하로 입력해 주세요")
      .transform((v) => parseFloat(v.replace(/[%,]/g, "")))
  );

// 필수 입력 필드 (메시지는 호출부에서 전달)
// invalid_type_error: undefined/null 시에도 한국어 메시지 표시
export const zReq = (msg: string) =>
  z.string({ required_error: msg, invalid_type_error: msg }).min(1, msg);

export const zDateReq = (msg: string) =>
  z.string({ required_error: msg, invalid_type_error: msg })
    .min(1, msg)
    .refine((v) => isValidDate(v), "유효하지 않은 날짜입니다");

// 필수 정수
export const zNumericReq = (msg: string) =>
  z.preprocess(
    (v) => (v == null ? "" : typeof v === "number" ? String(v) : v),
    z.string().min(1, msg).regex(/^[0-9,.]+$/, "숫자만 입력 가능합니다")
      .transform((v) => {
        const val = v.replace(/,/g, "");
        return val.replace(/^0+(?!$)/, "") || "0";
      })
  );

// 필수 정수(varchar 길이 제한)
export const zNumericReqMax = (msg: string, max: number) =>
  z.string().min(1, msg)
    .regex(/^[0-9,]+$/, "숫자만 입력 가능합니다")
    .refine((v) => v.replace(/,/g, "").length <= max, `최대 ${max}자리까지 입력 가능합니다`);

export const zDecimalReq = (msg: string) =>
  z.preprocess(
    (v) => (v == null ? "" : typeof v === "number" ? String(v) : v),
    z.string().min(1, msg).regex(/^[0-9.,]+$/, "숫자만 입력 가능합니다")
      .transform((v) => {
        const val = v.replace(/,/g, "");
        return val.replace(/^0+(?!\.)(?!$)/, "") || "0";
      })
  );

// 필수 금액 — 콤마 포함 허용, transform으로 콤마 제거 후 백엔드 전송
// maxValue: 최대 허용 금액 (예: 99_999_999 = 억 미만)
export const zAmountReq = (msg: string, maxValue?: number, maxMsg?: string) =>
  z.preprocess(
    (v) => (v == null ? "" : typeof v === "number" ? String(v) : v),
    z.string().min(1, msg).regex(/^[0-9,.]+$/, "숫자만 입력 가능합니다")
      .refine(
        (v) => maxValue == null || Number(v.replace(/,/g, "")) <= maxValue,
        maxMsg ?? `${maxValue?.toLocaleString()}원 이하로 입력해주세요.`,
      )
      .transform((v) => {
        const val = v.replace(/,/g, "");
        return val.replace(/^0+(?!$)/, "") || "0";
      })
  );

// --- IP 번호 관련 패턴 (출원, 등록, 공고, 우선권) ---

// 공통 하이픈 제거 트랜스폼
const stripHyphen = (v: string | undefined) => v?.replace(/-/g, "") ?? "";

// 출원번호 / 공고번호 / 우선권번호 (보통 13자리 2-4-7 패턴)
export const zAppNo = z.preprocess(
  (v) => (v == null ? "" : v),
  z.string()
    .optional()
    .refine((v) => !v || /^[0-9-]+$/.test(v as string), "숫자와 하이픈만 입력 가능합니다")
    .refine((v) => !v || (v as string).replace(/-/g, "").length <= 30, "최대 30자까지 입력 가능합니다")
    .transform((v) => (v as string)?.replace(/-/g, "") ?? "")
);

export const zAppNoReq = (msg: string) =>
  z.string().min(1, msg)
    .refine((v) => /^[0-9-]+$/.test(v), "숫자와 하이픈만 입력 가능합니다")
    .transform(stripHyphen);

// 등록번호 (보통 9자리 2-7 패턴 혹은 13자리)
export const zRegNo = z.preprocess(
  (v) => (v == null ? "" : v),
  z.string()
    .optional()
    .refine((v) => !v || /^[0-9-]+$/.test(v as string), "숫자와 하이픈만 입력 가능합니다")
    .refine((v) => !v || (v as string).replace(/-/g, "").length <= 30, "최대 30자까지 입력 가능합니다")
    .transform((v) => (v as string)?.replace(/-/g, "") ?? "")
);

export const zRegNoReq = (msg: string) =>
  z.string().min(1, msg)
    .refine((v) => /^[0-9-]+$/.test(v), "숫자와 하이픈만 입력 가능합니다")
    .transform(stripHyphen);

// 공고번호
export const zPubNo = zAppNo;
export const zPubNoReq = zAppNoReq;

// 우선권번호
export const zPrioNo = zAppNo;
export const zPrioNoReq = zAppNoReq;


// domestic/directApp 스키마 전용
// .catch()로 감싼 중첩 객체 안의 필드는 zDate를 쓰면 에러가 삼켜지므로
// 필드는 plain string으로 두고 여기서 dateFormat: true 로 포맷 체크

type ValidationRule = {
  field: string[];
  message: string;
  dateFormat?: boolean; // 값이 있을 때 YYYYMMDD 형식 체크
};

// 날짜+번호 쌍 검증 — 둘 다 있거나, 둘 다 없어야 함 (하나만 입력 시 나머지 필수)
type PairRule = {
  dateField: string[];
  noField: string[];
  dateMessage: string;
  noMessage: string;
  dateFormat?: boolean;
};

export const applyPairValidationRules = (rules: PairRule[], data: any, ctx: any) => {
  rules.forEach((rule) => {
    const dateVal = rule.dateField.reduce((obj: any, key: string) => obj?.[key], data);
    const noVal = rule.noField.reduce((obj: any, key: string) => obj?.[key], data);
    if (!dateVal && !noVal) return; // 둘 다 없으면 OK
    if (dateVal && !noVal) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: rule.noField, message: rule.noMessage });
    } else if (!dateVal && noVal) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: rule.dateField, message: rule.dateMessage });
    } else if (dateVal && noVal && rule.dateFormat && !isValidDate(dateVal)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: rule.dateField, message: "유효하지 않은 날짜입니다" });
    }
  });
};

export const applyValidationRules = (rules: ValidationRule[], data: any, ctx: any) => {
  rules.forEach((rule) => {
    const value = rule.field.reduce((obj: any, key: string) => obj?.[key], data);
    if (!value) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: rule.field, message: rule.message });
      return;
    }
    if (rule.dateFormat && !isValidDate(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: rule.field, message: "유효하지 않은 날짜입니다" });
    }
  });
};
// 전화번호/팩스 — 입력했으면 하이픈 포함 형식 체크
export const zTel = z.preprocess(
  (v) => (v == null ? "" : v),
  z.string()
    .optional()
    .refine((v) => !v || /^[0-9-]+$/.test(v as string), "숫자와 하이픈만 입력 가능합니다")
);

// 이메일 — 입력했으면 형식 체크
export const zEmail = z.preprocess(
  (v) => (v == null ? "" : v),
  z.string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string), "이메일 형식이 올바르지 않습니다")
);

// 홈페이지 — 입력했으면 URL 형식 체크
export const zUrl = z.preprocess(
  (v) => (v == null ? "" : v),
  z.string()
    .optional()
    .refine((v) => !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(v as string), "URL 형식이 올바르지 않습니다")
);

// 사업자등록번호 — 10자리 (3-2-5 형식)
export const zBizNo = z.preprocess(
  (v) => (v == null ? "" : v),
  z.string()
    .optional()
    .refine((v) => !v || /^[0-9-]{10,12}$/.test(v as string), "사업자등록번호 형식이 올바르지 않습니다")
    .transform((v) => (v as string)?.replace(/-/g, "") ?? "")
);

// 종사업장번호 — 4자리
export const zSubBizNo = z.preprocess(
  (v) => (v == null ? "" : v),
  z.string()
    .optional()
    .refine((v) => !v || /^\d{0,4}$/.test(v as string), "4자리 숫자만 입력 가능합니다")
);
