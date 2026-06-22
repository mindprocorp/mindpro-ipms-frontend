import type React from "react";
import { useRef } from "react";
import { Button, Icons, Input } from "@repo/ui";

interface DragListInputProps {
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  placeholder?: string;
  confirmLabel?: string;
  className?: string;
  /** 버튼 숨기고 Enter/Escape만 사용 (트리 인라인 입력 등) */
  minimal?: boolean;
  /** 두 번째 입력 필드 (부서코드 등) */
  secondValue?: string;
  onSecondChange?: (value: string) => void;
  secondPlaceholder?: string;
}

const DragListInput = ({
  value,
  onChange,
  onConfirm,
  onCancel,
  placeholder = "이름 입력",
  confirmLabel = "추가",
  className,
  minimal,
  secondValue,
  onSecondChange,
  secondPlaceholder = "코드 입력",
}: DragListInputProps) => {
  const hasSecond = onSecondChange !== undefined;
  const containerRef = useRef<HTMLDivElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      onConfirm();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onCancel();
    }
  };
  // 컨테이너 외부로 포커스 이동 시에만 cancel (두 인풋 간 이동은 무시)
  // 단, alert/dialog 가 열려있으면 cancel 안 함 (중복 검증 알럿 표시 중)
  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!minimal) return;
    const next = e.relatedTarget as Node | null;
    if (next && containerRef.current?.contains(next)) return;
    // alert/dialog 가 열려있는 동안엔 cancel 보류 — 사용자가 알럿 닫고 수정 가능
    if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return;
    onCancel();
  };

  return (
    <div
      ref={containerRef}
      onBlur={handleContainerBlur}
      className={`flex w-full flex-1 items-center gap-2 ${
        minimal ? "max-w-[560px] rounded-lg border border-blue-300 bg-blue-50/40 px-3 py-2.5" : "pb-2"
      } ${className ?? ""}`}
    >
      <Icons.GripVertical className="text-muted-foreground size-4 shrink-0" />
      <Input
        className={minimal ? "flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0" : "flex-1"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      {hasSecond && (
        <>
          <span className="text-muted-foreground shrink-0 text-xs">/</span>
          <Input
            className={minimal ? "w-28 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0" : "w-28"}
            placeholder={secondPlaceholder}
            value={secondValue ?? ""}
            onChange={(e) => onSecondChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </>
      )}
      {minimal && (
        <span className="text-muted-foreground shrink-0 text-xs">Enter ↵</span>
      )}
      {!minimal && (
        <>
          <Button size="h28" onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button size="h28" variant="outline" onClick={onCancel}>
            취소
          </Button>
        </>
      )}
    </div>
  );
};

export default DragListInput;
