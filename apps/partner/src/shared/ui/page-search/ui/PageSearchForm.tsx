import SearchParamGroup from "@shared/ui/page-search/ui/SearchParamGroup";
import SearchFooter from "@shared/ui/page-search/ui/SearchFooter";
import SearchHeader from "@shared/ui/page-search/ui/SearchHeader";
import { FormProvider, useFieldArray } from "react-hook-form";
import { useQuickSearchForm } from "@shared/ui/page-search/model/form";
import { type QuickSearchSchemaType } from "@shared/ui/page-search/schema";
import { useEffect, useMemo, useRef, useState } from "react";
import SettingModal from "./setting-modal/SettingModal";
import SaveModal from "./save-modal/SaveModal";
import ImportModal from "@shared/ui/page-search/ui/import-modal/ImportModal";
import SearchCaseClass from "./SearchCaseClass";
import SearchScope from "./SearchScope";
import { useSearchCodeItems } from "@shared/ui/page-search/model/useSearchCodeItems";
import type { SearchParm } from "../types";

export interface SearchCodeGroups {
  base?: string;
  date?: string;
  str?: string;
  num?: string;
}

export const buildSearchCodeGroups = (searchKey: string): SearchCodeGroups => {
  const base = `${searchKey}_BASE`;
  const date = `${searchKey}_DATE`;
  let str = `${searchKey}_STR`;
  if (searchKey === "SEARCH_ETC_EVENT") {
    str = "SEARCH_ETC_PRGRS_STR";
  }
  const num = `${searchKey}_NUM`;
  return { base, date, str, num };
};

interface PageSearchFormProps {
  showCaseClass?: boolean;
  showScope?: boolean;
  onSearch?: (values: QuickSearchSchemaType) => void;
  searchKey?: string;
  autoSearch?: boolean;
}

const PageSearchForm = ({
  showCaseClass = false,
  showScope = false,
  onSearch,
  searchKey,
  autoSearch = true,
}: PageSearchFormProps) => {
  const searchCodeGroups = useMemo(
    () => (searchKey ? buildSearchCodeGroups(searchKey) : undefined),
    [searchKey]
  );
  const { codeItems, baseRefMap, subCodeMap, setSubCodeMap, loadSubCode } = useSearchCodeItems(searchCodeGroups);
  const form = useQuickSearchForm();
  const { fields: parmsFields, remove: removeParm, replace: replaceParms } = useFieldArray({
    name: "parms",
    control: form.control,
  });

  const [setting, setSetting] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storageKey = searchKey ? `search-parms-${searchKey}` : `search-parms-${window.location.pathname}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          replaceParms(parsed);
        }
      } catch (e) {
        // ignore
      }
    }
    setIsLoaded(true);
  }, [searchKey, replaceParms]);

  useEffect(() => {
    if (!isLoaded) return;
    const storageKey = searchKey ? `search-parms-${searchKey}` : `search-parms-${window.location.pathname}`;
    localStorage.setItem(storageKey, JSON.stringify(parmsFields));
  }, [parmsFields, searchKey, isLoaded]);

  const onSubmit = (value: QuickSearchSchemaType) => onSearch?.(value);

  // [수정] 무한 루프 방지를 위해 onSearch를 ref로 관리하고, parmsFields의 변경을 감지하여 자동 조회
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (!isLoaded || !autoSearch) return;
    onSearchRef.current?.(form.getValues());
  }, [JSON.stringify(parmsFields), isLoaded, form, autoSearch]);

  const resolveCateLabel = (cateCode: string, type: string): string => {
    const pool = type === "date" ? codeItems.date : type === "string" ? codeItems.str : codeItems.base;
    return pool.find((c) => c.value === cateCode)?.label ?? cateCode;
  };

  const resolveValueLabel = (cateCode: string, valueCode: string | undefined, type: string): string => {
    if (type === "default" && valueCode && subCodeMap[cateCode]) {
      return subCodeMap[cateCode].find((c) => c.value === valueCode)?.label ?? valueCode;
    }
    return valueCode ?? "";
  };

  const handleSettingSave = (searchSelected: any[]) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const newParms = searchSelected.map((item) => ({
      ...item,
      label: item.cateLabel || item.cate || "조건",
      value: item.valueLabel || item.value || "",
      id: item.itemId || crypto.randomUUID(),
      cateCode: item.cate,
      valueCode: item.value,
    })) as SearchParm[];
    replaceParms(newParms);
    onSearch?.({ ...form.getValues(), parms: newParms });
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="border-slate-200 dark:border-input rounded-md border overflow-hidden">
            <SearchHeader setSetting={() => setSetting((p) => !p)} />
            {showCaseClass && <SearchCaseClass />}
            {showScope && <SearchScope />}
            <SearchParamGroup fields={parmsFields} onRemove={removeParm} />
            <SearchFooter setShowSave={setShowSave} setImport={setImportOpen} onReset={() => replaceParms([])} />
          </div>
        </form>
      </FormProvider>

      <SettingModal
        open={setting}
        onOpenChange={setSetting}
        onSave={handleSettingSave}
        codeItems={codeItems}
        baseRefMap={baseRefMap}
        subCodeMap={subCodeMap}
        onSubCodeMapChange={setSubCodeMap}
        searchKey={searchKey}
      />
      <SaveModal
        open={showSave}
        onOpenChange={setShowSave}
        menuCode={searchKey}
        parms={parmsFields as SearchParm[]}
      />
      <ImportModal
        open={importOpen}
        onOpenChange={setImportOpen}
        menuCode={searchKey}
        codeItems={codeItems}
        subCodeMap={subCodeMap}
        baseRefMap={baseRefMap}
        loadSubCode={loadSubCode}
        onLoad={(parms: SearchParm[]) => {
          const loadedParms = parms.map((p) => ({
            ...p,
            label: resolveCateLabel(p.cateCode, p.type),
            value: p.type === "date"
              ? p.value
              : resolveValueLabel(p.cateCode, p.valueCode, p.type),
          })) as SearchParm[];
          replaceParms(loadedParms);
          onSearch?.({ ...form.getValues(), parms: loadedParms });
        }}
      />
    </>
  );
};

export default PageSearchForm;
