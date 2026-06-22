import { zodResolver } from "@hookform/resolvers/zod";
import { CustomScrollArea, FormDialog, Separator } from "@repo/ui";
import {
  SearchSettingSchema,
  type SearchSettingInput,
  type SearchSettingOutput,
  type SearchItem,
} from "../../schema";
import SearchDate from "./SearchDate";
import SearchDefault from "./SearchDefault";
import SearchString from "./SearchString";
import SearchSelectedLabel from "./SearchSelectedLabel";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { type CodeSelectOption } from "@shared/api/common/commApi";
import { useAlertStore } from "@shared/store/useAlertStore";
import type { CodeItemSets } from "../../model/useSearchCodeItems";
import { makeEmptyRow } from "../../model/useSearchRows";
import { SEARCH_KEY } from "@shared/enum/comCodeType";

interface LabeledSearchItem extends Partial<SearchItem> {
  cateLabel?: string;
  valueLabel?: string;
}

interface SettingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (searchSelected: LabeledSearchItem[]) => void;
  codeItems: CodeItemSets;
  baseRefMap: Record<string, string>;
  subCodeMap: Record<string, CodeSelectOption[]>;
  onSubCodeMapChange: (map: Record<string, CodeSelectOption[]>) => void;
  searchKey?: string;
}

const SettingModal = ({
  open,
  onOpenChange,
  onSave,
  codeItems,
  baseRefMap,
  subCodeMap,
  onSubCodeMapChange,
  searchKey,
}: SettingModalProps) => {
  const makeDefaultValues = () => ({
    searchNum: "",
    defaultSearch: [makeEmptyRow("default")],
    dateSearch: [makeEmptyRow("date")],
    stringSearch: [makeEmptyRow("string")],
    searchSelected: [],
  });

  const form = useForm<SearchSettingInput>({
    resolver: zodResolver(SearchSettingSchema),
    defaultValues: makeDefaultValues(),
  });

  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const { openAlert } = useAlertStore();

  useEffect(() => {
    if (open) {
      form.reset(makeDefaultValues());
      setFocusedItemId(null);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCateLabel = (item: Partial<SearchItem>): string => {
    const pool =
      item.type === "date" ? codeItems.date
      : item.type === "string" ? codeItems.str
      : codeItems.base;
    return pool.find((c) => c.value === item.cate)?.label ?? item.cate ?? "";
  };

  const getValueLabel = (item: Partial<SearchItem>): string => {
    if (!item.value) return "";
    if (item.type === "default" && item.cate && subCodeMap[item.cate]) {
      return subCodeMap[item.cate].find((c) => c.value === item.value)?.label ?? item.value;
    }
    return item.value;
  };

  const hasDuplicate = (selected: Partial<SearchItem>[]): boolean => {
    const seen = new Set<string>();
    for (const item of selected) {
      const key =
        item.type === "date"
          ? `date:${item.cate}`
          : `${item.type}:${item.cate}:${item.value}`;
      if (seen.has(key)) return true;
      seen.add(key);
    }
    return false;
  };

  const onSubmit: SubmitHandler<SearchSettingInput> = (values) => {
    const parsed: SearchSettingOutput = SearchSettingSchema.parse(values);
    const selected = parsed.searchSelected ?? [];

    if (hasDuplicate(selected)) {
      openAlert({ message: "동일한 검색 조건이 존재합니다. 중복된 조건을 수정하거나 삭제해주세요." });
      return;
    }

    onSave?.(
      selected.map((item) => ({
        ...item,
        cateLabel: getCateLabel(item),
        valueLabel:
          item.type === "date"
            ? `${item.fromValue ?? ""} ~ ${item.toValue ?? ""}`
            : getValueLabel(item),
      }))
    );
    onOpenChange(false);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title="검색조건 설정"
        onSubmit={form.handleSubmit(onSubmit)}
        open={open}
        onOpenChange={onOpenChange}
        className="sm:max-w-[900px]"
      >
        <div className="flex gap-3">
          <CustomScrollArea className="max-h-140 w-full">
            <div className="flex flex-col gap-4">
              {codeItems.base?.length > 0 && (
                <>
                  <SearchDefault
                    focusedItemId={focusedItemId}
                    setFocusedItemId={setFocusedItemId}
                    masterItems={codeItems.base}
                    refValMap={baseRefMap}
                    subCodeMap={subCodeMap}
                    onSubCodeMapChange={onSubCodeMapChange}
                  />
                  <Separator />
                </>
              )}
              {codeItems.date?.length > 0 && (
                <>
                  <SearchDate
                    focusedItemId={focusedItemId}
                    setFocusedItemId={setFocusedItemId}
                    dateItems={codeItems.date}
                  />
                  <Separator />
                </>
              )}
              {codeItems.str?.length > 0 && (
                <SearchString
                  focusedItemId={focusedItemId}
                  setFocusedItemId={setFocusedItemId}
                  strItems={codeItems.str}
                />
              )}
              {codeItems.num.length > 0 && searchKey !== SEARCH_KEY.BILL && (
                <>
                  <Separator />
                  <SearchString
                    title="숫자검색"
                    focusedItemId={focusedItemId}
                    setFocusedItemId={setFocusedItemId}
                    strItems={codeItems.num}
                  />
                </>
              )}
            </div>
          </CustomScrollArea>

          <CustomScrollArea className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 relative max-h-140 border">
            <div className="w-70">
              <SearchSelectedLabel
                focusedItemId={focusedItemId}
                setFocusedItemId={setFocusedItemId}
                codeItems={codeItems}
                subCodeMap={subCodeMap}
              />
            </div>
          </CustomScrollArea>
        </div>
      </FormDialog>
    </FormProvider>
  );
};

export default SettingModal;
