/**
 * 권리
 */
export const RIGHT_TYPE = {
  PATENT: { code: "10", label: "특허", name: "PATENT" },
  PRACTICE: { code: "20", label: "실용신안", name: "PRACTICE" },
  DESIGN: { code: "30", label: "디자인", name: "DESIGN" },
  TRADE: { code: "40", label: "상표", name: "TRADEMARK" },
} as const;

// getLabel 함수 추가
export const getLabel = (code: string): string => {
  const entry = Object.values(RIGHT_TYPE).find((item) => item.code === code);
  return entry?.label || "";
};

// getName
export const getName = (code: string): string => {
  const entry = Object.values(RIGHT_TYPE).find((item) => item.code === code);
  return entry?.name || "";
};

// getCode 함수
export const getCode = (label: string): string => {
  const entry = Object.values(RIGHT_TYPE).find((item) => item.label === label);
  return entry?.code || "";
};



