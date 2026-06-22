import {
  Button,
  FlexBox,
  Icons,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@repo/ui";

export interface DragListAction {
  label: string;
  onClick: () => void;
  variant?: "destructive";
}

interface DragListItemProps {
  label: string;
  actions?: DragListAction[];
  className?: string;
  dimmed?: boolean;
  /** 라벨 앞에 들어갈 요소 (▼ 등) */
  prefix?: React.ReactNode;
  /** 카드형 (border 있는 스타일) */
  bordered?: boolean;
  /** 라벨 뒤에 들어갈 요소 (토글 등) */
  suffix?: React.ReactNode;
  /** hover 시 보이는 추가 버튼 */
  onAdd?: () => void;
  /** 선택 상태 */
  selected?: boolean;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 드래그 핸들 숨김 */
  noDrag?: boolean;
}

const DragListItem = ({
  label,
  actions,
  className,
  dimmed,
  prefix,
  suffix,
  bordered,
  onAdd,
  selected,
  onClick,
  noDrag,
}: DragListItemProps) => (
  <FlexBox
    className={`group items-center gap-2 rounded-lg px-2 py-1.5 ${
      bordered ? "max-w-[560px] border bg-blue-50/30 px-3 py-2.5" : "hover:bg-accent"
    } ${dimmed ? "border-dashed opacity-50" : ""} ${selected ? "bg-p-color-1/10 border-p-color-1/30" : ""} ${onClick ? "cursor-pointer" : ""} ${className ?? ""}`}
    onClick={onClick}
  >
    {!noDrag && <Icons.GripVertical className="text-muted-foreground size-4 shrink-0 cursor-grab" />}
    {prefix}
    <span className="flex-1 text-sm">{label}</span>
    {suffix}

    {/* hover + 버튼 */}
    {onAdd && (
      <button
        type="button"
        className="text-muted-foreground hover:text-p-color-1 opacity-0 group-hover:opacity-100"
        onClick={(e) => { e.stopPropagation(); onAdd(); }}
      >
        <Icons.Plus className="size-4" />
      </button>
    )}

    {/* ⋮ 메뉴 */}
    {actions && actions.length > 0 && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon-xs"
            variant="ghost"
            className={bordered ? "" : "opacity-0 group-hover:opacity-100"}
            onClick={(e) => e.stopPropagation()}
          >
            <Icons.MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.label}
              variant={action.variant}
              onClick={(e) => { e.stopPropagation(); action.onClick(); }}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )}
  </FlexBox>
);

export default DragListItem;
