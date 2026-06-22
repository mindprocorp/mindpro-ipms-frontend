import { cn } from "@repo/ui";

type Condition = "and" | "exclusion";

interface ConditionToggleProps {
  value?: Condition;
  onChange: (value: Condition) => void;
}

const ConditionToggle = ({ value = "and", onChange }: ConditionToggleProps) => (
  <div className="flex h-7 flex-none overflow-hidden rounded border text-[10px] font-semibold">
    <button
      type="button"
      onClick={() => onChange("and")}
      className={cn(
        "w-9 transition-colors",
        value === "and" ? "bg-blue-500 text-white" : "text-muted-foreground hover:bg-muted"
      )}
    >
      AND
    </button>
    <button
      type="button"
      onClick={() => onChange("exclusion")}
      className={cn(
        "w-9 border-l transition-colors",
        value === "exclusion" ? "bg-red-500 text-white" : "text-muted-foreground hover:bg-muted"
      )}
    >
      제외
    </button>
  </div>
);

export default ConditionToggle;
