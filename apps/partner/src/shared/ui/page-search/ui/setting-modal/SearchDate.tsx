import { Button, Icons, RHF } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { type CodeSelectOption } from "@shared/api/common/commApi";
import { type SearchItem, type SearchSettingInput } from "../../schema";
import { useSearchRows } from "../../model/useSearchRows";
import ConditionToggle from "./ConditionToggle";
import SearchRow from "./SearchRow";
import SearchSectionHeader from "./SearchSectionHeader";
import { format, subDays, subMonths } from "date-fns";

type SearchField = Partial<SearchItem> & { id: string };

interface SearchDateProps {
  focusedItemId: string | null;
  setFocusedItemId: (id: string | null) => void;
  dateItems?: CodeSelectOption[];
}

const SearchDate = ({ focusedItemId, setFocusedItemId, dateItems = [] }: SearchDateProps) => {
  const { control, setValue } = useFormContext<SearchSettingInput>();

  const { fields, watched, addItem, delItem, handleRowClick } = useSearchRows({
    type: "date",
    requireValue: false,
    focusedItemId,
    setFocusedItemId,
  });

  return (
    <div>
      <SearchSectionHeader title="일자검색" onAdd={addItem} />
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
                name={`dateSearch.${index}.cate`}
                items={dateItems}
                className="w-40 flex-none"
                placeholder="검색항목"
              />
              <div className="flex gap-1 flex-1">
                <RHF.FormDateFromToPicker
                  control={control}
                  name={[`dateSearch.${index}.fromValue`, `dateSearch.${index}.toValue`]}
                />
                <div className="flex gap-0.5 ml-1">
                  <Button size="h28" variant="outline" className="text-[11px] px-1.5" type="button" onClick={() => {
                    const today = format(new Date(), "yyyy-MM-dd");
                    setValue(`dateSearch.${index}.fromValue`, today);
                    setValue(`dateSearch.${index}.toValue`, today);
                  }}>오늘</Button>
                  <Button size="h28" variant="outline" className="text-[11px] px-1.5" type="button" onClick={() => {
                    const past = format(subDays(new Date(), 7), "yyyy-MM-dd");
                    const today = format(new Date(), "yyyy-MM-dd");
                    setValue(`dateSearch.${index}.fromValue`, past);
                    setValue(`dateSearch.${index}.toValue`, today);
                  }}>1주</Button>
                  <Button size="h28" variant="outline" className="text-[11px] px-1.5" type="button" onClick={() => {
                    const past = format(subMonths(new Date(), 1), "yyyy-MM-dd");
                    const today = format(new Date(), "yyyy-MM-dd");
                    setValue(`dateSearch.${index}.fromValue`, past);
                    setValue(`dateSearch.${index}.toValue`, today);
                  }}>1개월</Button>
                </div>
              </div>
              <ConditionToggle
                value={w?.condition}
                onChange={(v) => setValue(`dateSearch.${index}.condition`, v)}
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

export default SearchDate;
