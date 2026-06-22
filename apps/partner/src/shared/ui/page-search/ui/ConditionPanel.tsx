import { FlexBox } from "@repo/ui";
import ChoiceItemWithDel from "@shared/ui/ChoiceItemWithDel/ChoiceItemWithDel";

export interface ConditionPanelItem {
  id: string;
  label: string;
  condition?: string;
}

interface ConditionPanelProps {
  items: ConditionPanelItem[];
  emptyText?: string;
}

const ConditionPanel = ({ items, emptyText = "조건이 없습니다." }: ConditionPanelProps) => (
  <div className="flex h-full flex-col px-4 py-3">
    <h3 className="mb-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 tracking-wide">
      조건 목록 <span className="text-blue-500">({items.length})</span>
    </h3>
    {items.length === 0 ? (
      <p className="py-6 text-center text-xs text-muted-foreground">{emptyText}</p>
    ) : (
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <ChoiceItemWithDel key={item.id} label={item.label} condition={item.condition} isDel={false} />
        ))}
      </div>
    )}
  </div>
);

export default ConditionPanel;
