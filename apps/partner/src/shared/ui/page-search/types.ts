export interface SearchParm {
  id: string;
  label: string;
  value: string;
  cateCode: string;
  valueCode?: string;
  type: "default" | "date" | "string";
  condition: "and" | "exclusion";
  fromValue?: string;
  toValue?: string;
}
