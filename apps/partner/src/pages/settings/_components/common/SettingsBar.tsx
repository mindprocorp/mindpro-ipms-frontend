import { Button, Icons, Input } from "@repo/ui";

/** 세팅 검색 바 */
const SettingsBar = ({
  children,
  onSearch,
  onReset,
}: {
  children: React.ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
}) => (
  <div className="mb-4 flex items-center gap-3 rounded-md border px-4 py-2.5">
    {children}
    <div className="flex-1" />
    {onReset && (
      <Button size="h28" variant="outline" onClick={() => onReset()}>
        <Icons.RotateCcw className="size-3.5" />
        초기화
      </Button>
    )}
    {onSearch && (
      <Button size="h28" variant="blue" onClick={() => onSearch()}>
        <Icons.Search className="size-3.5" />
        검색
      </Button>
    )}
  </div>
);

/** 검색 인풋 */
const BarSearch = ({
  value,
  onChange,
  onKeyDown,
  placeholder = "검색어 입력",
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
}) => (
  <Input
    className="h-7 w-48 bg-white dark:bg-transparent text-xs"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
  />
);

/** 필터 라벨 */
const BarLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-input-label shrink-0 text-xs font-medium">{children}</span>
);

export { SettingsBar, BarSearch, BarLabel };
