import { FlexBox } from "@repo/ui";
import ChoiceItemWithDel from "@shared/ui/ChoiceItemWithDel/ChoiceItemWithDel";
import type { FieldArrayWithId } from "react-hook-form";

interface ParamField {
  id: string;
  label?: string;
  cate?: string;
  value?: string;
  condition?: string;
  [key: string]: unknown;
}

interface SearchParamGroupProps {
  fields: FieldArrayWithId<any, any, "id">[];
  onRemove: (index: number) => void;
}

const SearchParamGroup = ({ fields, onRemove }: SearchParamGroupProps) => {
  const getDisplayLabel = (item: ParamField) => {
    const cate = item.label ?? item.cate ?? "조건";
    return item.value ? `${cate}: ${item.value}` : cate;
  };

  if (fields.length === 0) return null;

  return (
    <FlexBox className="flex-wrap gap-1 px-4 py-2">
      {fields.map((item, index) => (
        <ChoiceItemWithDel
          key={item.id}
          label={getDisplayLabel(item as ParamField)}
          condition={(item as ParamField).condition as string | undefined}
          onDel={() => onRemove(index)}
          className="w-auto"
        />
      ))}
    </FlexBox>
  );
};

export default SearchParamGroup;
