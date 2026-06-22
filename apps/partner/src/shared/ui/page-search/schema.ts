import { today } from "@repo/ui";
import { z } from "zod";
export const YN_CONDITIONS = ["Y", "N"] as const;
const dateFields = z
  .object({
    cate: z.string().optional(),
    fromValue: z.string().optional(),
    toValue: z.string().optional(),
  })
  .transform((v) => ({
    cate: v.cate ?? "",
    fromValue: v.fromValue || today(),
    toValue: v.toValue || today(),
  }));

// 검색 조건 아이템 스키마
const SearchItemSchema = z.object({
  itemId: z.string(),
  cate: z.string().default(""),
  value: z.string().default(""),
  fromValue: z.string().default(""),
  toValue: z.string().default(""),
  condition: z.enum(["and", "exclusion"]).default("and"),
  type: z.enum(["default", "date", "string"]),
});

export type SearchItem = z.infer<typeof SearchItemSchema>;

export const QuickSearchSchema = z.object({
  searchNum: z.string(),
  searchName: z.string(),
  tabConditions: z.array(z.string()),
  condiCount: z.enum(YN_CONDITIONS),
  condiInSearch: z.boolean(),
  condiImage: z.string(),
  parms: z.array(z.object({
    label: z.string(),
    value: z.string(),
    id: z.string(),
    cateCode: z.string().optional(),
    valueCode: z.string().optional(),
    type: z.string().optional(),
    condition: z.string().optional(),
    fromValue: z.string().optional(),
    toValue: z.string().optional(),
  })).optional(),
  testparms: z.string(),
});

export type QuickSearchSchemaType = z.infer<typeof QuickSearchSchema>;

// 검색조건 설정 팝업
export const SearchSettingSchema = z.object({
  searchNum: z.string().default(""),
  defaultSearch: z.array(SearchItemSchema.partial()).default([]),
  dateSearch: z.array(SearchItemSchema.partial()).default([]),
  stringSearch: z.array(SearchItemSchema.partial()).default([]),
  searchSelected: z.array(SearchItemSchema.partial()).default([]),
});

export type SearchSettingInput = z.input<typeof SearchSettingSchema>;
export type SearchSettingOutput = z.output<typeof SearchSettingSchema>;
