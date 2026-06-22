import { Button, cn, FlexBox, Icons } from "@repo/ui";

type Props = {
  label: string;
  onDel?: () => void;
  className?: string;
  isDel?: boolean;
  condition?: string;
};

const conditionLabel: Record<string, string> = {
  and: "AND",
  exclusion: "제외",
};

const ChoiceItemWithDel = ({ label, onDel, className, isDel = true, condition }: Props) => {
  return (
    <FlexBox
      className={cn(
        "border-p-color-1/30 flex-none items-center gap-0.5 rounded-full border bg-white dark:bg-slate-900 py-0.5 pr-0.5 pl-2 text-[11px] leading-none",
        className,
      )}
    >
      <span className="text-p-color-1">{label}</span>
      {condition && (
        <span className={cn(
          "rounded-full px-1 py-0.5 text-[9px] font-medium leading-none",
          condition === "exclusion" ? "bg-red-50 dark:bg-red-900/30 text-red-500" : "bg-blue-50 dark:bg-blue-900/30 text-blue-500"
        )}>
          {conditionLabel[condition] || condition}
        </span>
      )}
      {isDel && (
        <button type="button" className="text-muted-foreground hover:text-red-400 flex items-center p-0.5 transition-colors" onClick={onDel}>
          <Icons.X className="size-2.5" />
        </button>
      )}
    </FlexBox>
  );
};

export default ChoiceItemWithDel;
