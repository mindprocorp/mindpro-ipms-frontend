/**
 * 날짜 문자열 포맷팅 (YYYYMMDD -> YYYY-MM-DD)
 * @param dateStr 날짜 문자열 (주로 YYYYMMDD 8자리)
 * @returns 포맷팅된 날짜 문자열 또는 원래 문자열
 */
export const formatDate = (dateStr: any): string => {
  const str = String(dateStr || "");
  // 8자리 숫자인 경우 YYYY-MM-DD 형식으로 변환
  if (/^\d{8}$/.test(str)) {
    return str.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  }
  if (/^\d{14}$/.test(str)) {
    return str.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
  }

  // ISO 형식이나 하이픈이 포함된 날짜에서 시간 부분 제거
  if (str.includes("-") || str.includes("T")) {
    return str.split(/[ T]/)[0];
  }

  if (!str) return "-";
  return str;
};

/**
 * 날짜 문자열 언포맷팅 (하이픈 제거)
 * @param dateStr 포맷팅된 날짜 문자열
 * @returns 숫자만 포함된 문자열
 */
export const unformatDate = (dateStr: any): string => {
  return String(dateStr || "").replace(/[^\d]/g, "");
};

/**
 * 객체 내의 날짜 필드들을 재귀적으로 포맷팅 (YYYYMMDD -> YYYY-MM-DD)
 * 키가 'Date', 'Deadline', '일'로 끝나고 값이 8자리 숫자인 경우 변환
 * @param obj 포맷팅할 객체
 * @returns 포맷팅된 새 객체
 */
export const formatObjectDates = (obj: any): any => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => formatObjectDates(item));
  }

  const newObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // 키가 날짜 관련 패턴이고 값이 8자리 숫자인 경우 포맷팅
      if (
        typeof value === "string" &&
        (key.toLowerCase().endsWith("date") ||
          key.toLowerCase().endsWith("deadline") ||
          key.endsWith("일")) &&
        /^\d{8}$/.test(value)
      ) {
        newObj[key] = formatDate(value);
      } else if (typeof value === "object" && value !== null) {
        // 재귀적으로 처리
        newObj[key] = formatObjectDates(value);
      } else {
        newObj[key] = value;
      }
    }
  }
  return newObj;
};

/**
 * 객체 내의 날짜 필드들을 재귀적으로 언포맷팅 (하이픈 제거)
 * @param obj 언포맷팅할 객체
 * @returns 언포맷팅된 새 객체
 */
export const stripObjectDates = (obj: any): any => {
  if (!obj || typeof obj !== "object" || obj instanceof File) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => stripObjectDates(item));
  }

  const newObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (
        typeof value === "string" &&
        (key.toLowerCase().endsWith("date") ||
          key.toLowerCase().endsWith("deadline") ||
          key.endsWith("일")) &&
        /^\d{4}-\d{2}-\d{2}$/.test(value)
      ) {
        newObj[key] = unformatDate(value);
      } else if (typeof value === "object" && value !== null) {
        newObj[key] = stripObjectDates(value);
      } else {
        newObj[key] = value;
      }
    }
  }
  return newObj;
};
/**
 * 금액 문자열 언포맷팅 (콤마 제거, 소수점 유지)
 * @param priceStr 포맷팅된 금액 문자열
 * @returns 숫자와 소수점만 포함된 문자열
 */
export const unformatPrice = (priceStr: any): string => {
  return String(priceStr || "").replace(/[^0-9.]/g, "");
};

/**
 * 전화번호/팩스번호 언포맷팅 (하이픈 제거)
 * @param telStr 포맷팅된 전화번호
 * @returns 숫자만 포함된 문자열
 */
export const unformatTel = (telStr: any): string => {
  return String(telStr || "").replace(/[^\d]/g, "");
};

/**
 * 출원/등록/공고번호 언포맷팅 (하이픈 제거)
 * @param patentNoStr 포맷팅된 번호
 * @returns 숫자만 포함된 문자열
 */
export const unformatPatentNo = (patentNoStr: any): string => {
  return String(patentNoStr || "").replace(/[^\d]/g, "");
};

/**
 * 객체 내의 금액 필드들을 재귀적으로 언포맷팅 (콤마 제거)
 * @param obj 언포맷팅할 객체
 * @returns 언포맷팅된 새 객체
 */
export const stripObjectPrices = (obj: any): any => {
  if (!obj || typeof obj !== "object" || obj instanceof File) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => stripObjectPrices(item));
  }

  const newObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // 금액 관련 패턴 체크 (Amount, Fee, Cost, Vat, Price, KRW, 금액, 수수료, 비용, 부가세, 가액)
      const isPriceKey =
        key.toLowerCase().includes("amount") ||
        key.toLowerCase().includes("fee") ||
        key.toLowerCase().includes("cost") ||
        key.toLowerCase().includes("vat") ||
        key.toLowerCase().includes("price") ||
        key.toLowerCase().includes("krw") ||
        key.includes("금액") ||
        key.includes("수수료") ||
        key.includes("비용") ||
        key.includes("부가세") ||
        key.includes("가액");

      // 콤마가 포함된 금액 형식인지 확인 (소수점 포함 가능)
      if (typeof value === "string" && isPriceKey && /^-?(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/.test(value)) {
        newObj[key] = unformatPrice(value);
      } else if (typeof value === "object" && value !== null) {
        newObj[key] = stripObjectPrices(value);
      } else {
        newObj[key] = value;
      }
    }
  }
  return newObj;
};
/**
 * 객체 내의 날짜 및 금액 필드를 재귀적으로 모두 언포맷팅
 * @param obj 언포맷팅할 객체
 * @returns 모든 포맷팅이 제거된 새 객체
 */
export const stripObjectIdentityNumbers = (obj: any): any => {
  if (!obj || typeof obj !== "object" || obj instanceof File) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => stripObjectIdentityNumbers(item));
  }

  const newObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      const keyLower = key.toLowerCase();
      // 전화/팩스 관련
      const isTelKey = keyLower.includes("tel") || keyLower.includes("fax") || key.includes("전화") || key.includes("팩스");
      // 출원/등록/공고 관련
      const isPatentKey = keyLower.includes("appno") || keyLower.includes("regno") || keyLower.includes("pubno") || key.includes("출원번호") || key.includes("등록번호") || key.includes("공고번호");

      if (typeof value === "string" && (isTelKey || isPatentKey) && value.includes("-")) {
        newObj[key] = value.replace(/[^\d]/g, "");
      } else if (typeof value === "object" && value !== null) {
        newObj[key] = stripObjectIdentityNumbers(value);
      } else {
        newObj[key] = value;
      }
    }
  }
  return newObj;
};

export const stripObjectFormattedFields = (obj: any): any => {
  let cleaned = stripObjectDates(obj);
  cleaned = stripObjectPrices(cleaned);
  cleaned = stripObjectIdentityNumbers(cleaned);
  return cleaned;
};
/**
 * 금액 문자열 포맷팅 (숫자 -> 3자리 콤마)
 * @param value 금액 (숫자 또는 문자열)
 * @returns 콤마가 포함된 금액 문자열
 */
export const formatPrice = (value: any): string => {
  if (value === undefined || value === null || value === "") return "0";
  const num = Number(String(value).replace(/,/g, ""));
  if (isNaN(num)) return String(value);
  return new Intl.NumberFormat().format(num);
};
/**
 * raw input 핸들러 (금액 포맷팅용)
 * @param e React Change Event
 * @returns 포맷팅된 값
 */
export const handlePriceChange = (e: any) => {
  const value = e.target.value;
  const digits = value.replace(/[^0-9]/g, "");
  if (digits === "") {
    e.target.value = "";
  } else {
    e.target.value = new Intl.NumberFormat().format(Number(digits));
  }
  return e.target.value;
};
/**
 * 한국 출원번호/공고번호/우선권번호 포맷 (2-4-7)
 * @param raw 숫자만 포함된 문자열
 * @returns 포맷팅된 번호 (XX-YYYY-ZZZZZZZ)
 */
export const formatAppNo = (raw: any): string => {
  const d = String(raw ?? "").replace(/\D/g, "").slice(0, 13);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6)}`;
};

/**
 * 한국 등록번호 포맷 (2-7 or 2-7-4)
 * @param raw 숫자만 포함된 문자열
 * @returns 포맷팅된 번호 (XX-YYYYYYY-ZZZZ)
 */
export const formatRegNo = (raw: any): string => {
  const d = String(raw ?? "").replace(/\D/g, "").slice(0, 13);
  if (d.length <= 2) return d;
  if (d.length <= 9) return `${d.slice(0, 2)}-${d.slice(2)}`; // 9자리까지는 2-7
  return `${d.slice(0, 2)}-${d.slice(2, 9)}-${d.slice(9)}`; // 13자리는 2-7-4
};

/**
 * 공고번호 포맷 (출원번호와 동일)
 */
export const formatPubNo = formatAppNo;

/**
 * 우선권번호 포맷 (출원번호와 동일)
 */
export const formatPrioNo = formatAppNo;
