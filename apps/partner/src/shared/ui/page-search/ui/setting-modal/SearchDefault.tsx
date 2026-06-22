import { Button, Icons, RHF } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries";
import { getCodeList } from "@shared/util/codeUtils";
import { mapToOptionNew } from "@shared/util/stringUtil";
import { type CodeSelectOption } from "@shared/api/common/commApi";
import { type SearchItem, type SearchSettingInput } from "../../schema";
import { useSearchRows } from "../../model/useSearchRows";
import ConditionToggle from "./ConditionToggle";
import SearchRow from "./SearchRow";
import SearchSectionHeader from "./SearchSectionHeader";
import { orgApi } from "@shared/api/organization/orgApi";
import { apiClient } from "@shared/api/client";

type SearchField = Partial<SearchItem> & { id: string };

interface SearchDefaultProps {
  focusedItemId: string | null;
  setFocusedItemId: (id: string | null) => void;
  masterItems?: CodeSelectOption[];
  refValMap?: Record<string, string>;
  subCodeMap?: Record<string, CodeSelectOption[]>;
  onSubCodeMapChange?: (map: Record<string, CodeSelectOption[]>) => void;
}

const SearchDefault = ({
  focusedItemId,
  setFocusedItemId,
  masterItems = [],
  refValMap = {},
  subCodeMap = {},
  onSubCodeMapChange,
}: SearchDefaultProps) => {
  const { control, setValue } = useFormContext<SearchSettingInput>();

  const loadingRef = useRef<Set<string>>(new Set());
  const subCodeMapRef = useRef(subCodeMap);
  subCodeMapRef.current = subCodeMap;

  const { mutate: fetchSubCode } = useMutation(commonQueries.getCommonCodeNew());

  const loadSubCodes = useCallback(
    (cate: string) => {
      let grpCd = refValMap[cate];
      if (!grpCd) {
        if (cate === "dossierCategory") grpCd = "JOB_DIV_CD";
        else if (cate === "attachDocDiv") grpCd = "DOC_TYPE_CD";
      }

      const isDeptField = /dept/i.test(cate);
      if ((!grpCd && !isDeptField) || subCodeMapRef.current[cate] || loadingRef.current.has(cate)) return;

      loadingRef.current.add(cate);

      // [부서 목록] 그룹 코드가 OFFICE_DEPT_LIST거나 상세 코드가 deptName인 경우 (기능마다 상세 코드가 달라도 ref_val1로 통제 가능)
      if (grpCd === "OFFICE_DEPT_LIST" || isDeptField) {
        orgApi(apiClient).getDeptTree()
          .then((res) => {
            const list = res.filter((d) => d.useYn !== "N").map((d) => ({ label: d.deptName, value: d.deptName }));
            onSubCodeMapChange?.({ ...subCodeMapRef.current, [cate]: list });
          })
          .catch((err) => console.error("Dept API Error:", err))
          .finally(() => loadingRef.current.delete(cate));
        return;
      }

      fetchSubCode(
        { grpCdList: [grpCd] },
        {
          onSuccess: (res) => {
            const list = getCodeList(grpCd, res.data);
            onSubCodeMapChange?.({ ...subCodeMapRef.current, [cate]: list ? mapToOptionNew(list) : [] });
            loadingRef.current.delete(cate);
          },
          onError: () => loadingRef.current.delete(cate),
        }
      );
    },
    [refValMap, fetchSubCode, onSubCodeMapChange]
  );

  const { fields, watched, addItem, delItem, handleRowClick } = useSearchRows({
    type: "default",
    requireValue: true,
    focusedItemId,
    setFocusedItemId,
    onCateChange: ({ cate }) => loadSubCodes(cate),
  });

  return (
    <div>
      <SearchSectionHeader title="기본검색" onAdd={addItem} />
      <div className="flex flex-col gap-0.5">
        {(fields as SearchField[]).map((item, index) => {
          const w = watched?.[index];
          const currentCate = w?.cate ?? "";
          const isDeptField = /dept/i.test(currentCate) || refValMap[currentCate] === "OFFICE_DEPT_LIST";
          const hasSubCodes = !!refValMap[currentCate] || isDeptField || ["dossierCategory", "attachDocDiv"].includes(currentCate);
          const masterLabel = masterItems.find((m) => m.value === currentCate)?.label;

          return (
            <SearchRow
              key={item.id}
              isFocused={focusedItemId === item.itemId}
              onClick={() => handleRowClick(item.itemId!)}
            >
              <RHF.FormSelect
                control={control}
                name={`defaultSearch.${index}.cate`}
                items={masterItems}
                className="w-40 flex-none"
                placeholder="검색항목"
              />
              <RHF.FormSelect
                control={control}
                name={`defaultSearch.${index}.value`}
                items={hasSubCodes ? (subCodeMap[currentCate] ?? []) : []}
                className="flex-1"
                placeholder={masterLabel ? `${masterLabel}을(를) 선택하세요` : "검색항목을 먼저 선택하세요"}
                disabled={!currentCate || currentCate === "none" || !hasSubCodes}
              />
              <ConditionToggle
                value={w?.condition}
                onChange={(v) => setValue(`defaultSearch.${index}.condition`, v)}
              />
              {index < fields.length - 1 && (
                <Button
                  size="h28"
                  className="w-8 flex-none"
                  type="button"
                  onClick={(e) => { e.stopPropagation(); delItem(index, item.itemId!); }}
                >
                  <Icons.Minus />
                </Button>
              )}
            </SearchRow>
          );
        })}
      </div>
    </div>
  );
};

export default SearchDefault;
