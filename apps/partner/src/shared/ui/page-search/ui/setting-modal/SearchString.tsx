import { Button, Icons, RHF } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { type CodeSelectOption } from "@shared/api/common/commApi";
import { type SearchItem, type SearchSettingInput } from "../../schema";
import { useSearchRows } from "../../model/useSearchRows";
import ConditionToggle from "./ConditionToggle";
import SearchRow from "./SearchRow";
import SearchSectionHeader from "./SearchSectionHeader";

type SearchField = Partial<SearchItem> & { id: string };

interface SearchStringProps {
  title?: string;
  focusedItemId: string | null;
  setFocusedItemId: (id: string | null) => void;
  strItems?: CodeSelectOption[];
}

const SearchString = ({ title = "문자검색", focusedItemId, setFocusedItemId, strItems = [] }: SearchStringProps) => {
  const { control, setValue } = useFormContext<SearchSettingInput>();

  const { fields, watched, addItem, delItem, handleRowClick } = useSearchRows({
    type: "string",
    requireValue: true,
    focusedItemId,
    setFocusedItemId,
  });

  return (
    <div>
      <SearchSectionHeader title={title} onAdd={addItem} />
      <div className="flex flex-col gap-0.5">
        {(fields as SearchField[]).map((item, index) => {
          const w = watched?.[index];

          return (
            <SearchRow
              key={item.id}
              isFocused={focusedItemId === item.itemId}
              onClick={() => handleRowClick(item.itemId!)}
            >
              <RHF.FormSelect
                control={control}
                name={`stringSearch.${index}.cate`}
                items={strItems}
                className="w-40 flex-none"
                placeholder="검색항목"
              />
              <RHF.Input
                control={control}
                name={`stringSearch.${index}.value`}
                className="flex-1"
              />
              <ConditionToggle
                value={w?.condition}
                onChange={(v) => setValue(`stringSearch.${index}.condition`, v)}
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

export default SearchString;
