import { Button, cn, FlexBox, Icons } from "@repo/ui";
import ChoiceItemWithDel from "@shared/ui/ChoiceItemWithDel/ChoiceItemWithDel";
import type { SearchItem, SearchSettingInput } from "@shared/ui/page-search/schema";
import { useFieldArray, useFormContext } from "react-hook-form";
import { type CodeSelectOption } from "@shared/api/common/commApi";
import { makeEmptyRow } from "../../model/useSearchRows";

interface CodeItems {
  base: CodeSelectOption[];
  date: CodeSelectOption[];
  str: CodeSelectOption[];
  num?: CodeSelectOption[];
}

interface SearchSelectedLabelProps {
  focusedItemId: string | null;
  setFocusedItemId: (id: string | null) => void;
  codeItems?: CodeItems;
  subCodeMap?: Record<string, CodeSelectOption[]>;
}

type SearchField = Partial<SearchItem> & { id: string };

const SearchSelectedLabel = ({
  focusedItemId,
  setFocusedItemId,
  codeItems,
  subCodeMap = {},
}: SearchSelectedLabelProps) => {
  const { control, setValue, getValues } = useFormContext<SearchSettingInput>();
  const { fields, remove } = useFieldArray({ name: "searchSelected", control });

  const getCateLabel = (item: Partial<SearchItem>): string => {
    if (!item.cate || !codeItems) return item.cate ?? "조건";
    const pool =
      item.type === "date" ? codeItems.date
      : item.type === "string" ? codeItems.str
      : (item.type as string) === "number" ? (codeItems.num ?? [])
      : codeItems.base;
    return pool.find((c) => c.value === item.cate)?.label ?? item.cate;
  };

  const getValueLabel = (item: Partial<SearchItem>): string => {
    if (item.type === "date") return `${item.fromValue ?? ""} ~ ${item.toValue ?? ""}`;
    if (!item.value) return "";
    if (item.type === "default" && item.cate && subCodeMap[item.cate]) {
      return subCodeMap[item.cate].find((c) => c.value === item.value)?.label ?? item.value;
    }
    return item.value;
  };

  const getItemLabel = (item: Partial<SearchItem>): string => {
    const cate = getCateLabel(item);
    const val = getValueLabel(item);
    return val ? `${cate}: ${val}` : cate;
  };

  const handleDelete = (index: number, item: Partial<SearchItem>) => {
    remove(index);
    const fieldName =
      item.type === "default" ? "defaultSearch"
      : item.type === "date" ? "dateSearch"
      : "stringSearch";
    const list = (getValues(fieldName) ?? []) as Partial<SearchItem>[];
    setValue(fieldName, list.filter((i) => i.itemId !== item.itemId) as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    if (focusedItemId === item.itemId) setFocusedItemId(null);
  };

  const handleReset = () => {
    setValue("searchSelected", []);
    setValue("defaultSearch", [makeEmptyRow("default")] as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    setValue("dateSearch", [makeEmptyRow("date")] as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    setValue("stringSearch", [makeEmptyRow("string")] as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    setFocusedItemId(null);
  };

  return (
    <div className="px-3 py-3">
      <FlexBox className="bg-slate-50 dark:bg-slate-800 sticky top-0 items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700 mb-2">
        <h2 className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 tracking-wide">
          선택된 조건{" "}
          <span className="text-blue-500">({fields.length})</span>
        </h2>
        <Button size="h24" variant="ghost" type="button" onClick={handleReset}>
          <Icons.RotateCcw />
          초기화
        </Button>
      </FlexBox>

      {fields.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">선택된 조건이 없습니다.</p>
      ) : (
        <FlexBox className="flex-wrap gap-1 pt-2">
          {(fields as SearchField[]).map((item, index) => (
            <div
              key={item.id}
              onClick={() => setFocusedItemId(focusedItemId === item.itemId ? null : item.itemId ?? null)}
              className="cursor-pointer"
            >
              <ChoiceItemWithDel
                label={getItemLabel(item)}
                condition={item.condition}
                onDel={() => handleDelete(index, item)}
                className={focusedItemId === item.itemId ? "bg-p-color-1/10" : undefined}
              />
            </div>
          ))}
        </FlexBox>
      )}
    </div>
  );
};

export default SearchSelectedLabel;
