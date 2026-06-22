import { useState, useCallback } from "react";
import { Button, Icons } from "@repo/ui";
import DragListItem, { type DragListAction } from "./DragListItem";
import DragListInput from "./DragListInput";

export interface CodeItem {
  id: string;
  label: string;
  actions?: DragListAction[];
}

interface DragCodeColumnProps {
  title: string;
  items: CodeItem[];
  onAdd: () => void;
  isAdding?: boolean;
  addValue?: string;
  onAddChange?: (v: string) => void;
  onAddConfirm?: () => void;
  onAddCancel?: () => void;
  addPlaceholder?: string;
  editingId?: string | null;
  editValue?: string;
  onEditChange?: (v: string) => void;
  onEditConfirm?: () => void;
  onEditCancel?: () => void;
  emptyMessage?: string;
  emptySubMessage?: string;
  /** 드래그 순서 변경 콜백 */
  onReorder?: (orderedIds: string[]) => void;
}

const reorderIds = (ids: string[], from: string, to: string): string[] => {
  if (from === to) return ids;
  const result = ids.filter((id) => id !== from);
  const toIdx = result.indexOf(to);
  if (toIdx === -1) return ids;
  result.splice(toIdx, 0, from);
  return result;
};

const LAST = "__LAST__";

const DragCodeColumn = ({
  items,
  onAdd,
  isAdding,
  addValue,
  onAddChange,
  onAddConfirm,
  onAddCancel,
  addPlaceholder,
  editingId,
  editValue,
  onEditChange,
  onEditConfirm,
  onEditCancel,
  emptyMessage,
  emptySubMessage,
  onReorder,
}: DragCodeColumnProps) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [liveOrder, setLiveOrder] = useState<string[] | null>(null);

  const ordered = liveOrder
    ? liveOrder.map((id) => items.find((i) => i.id === id)).filter(Boolean) as CodeItem[]
    : items;

  const handleDragStart = useCallback((id: string) => {
    setDraggingId(id);
    setLiveOrder(items.map((i) => i.id));
  }, [items]);

  const handleDragOver = useCallback((overId: string) => {
    setLiveOrder((prev) => {
      if (!prev || !draggingId) return prev;
      const next = overId === LAST
        ? [...prev.filter((id) => id !== draggingId), draggingId]
        : draggingId === overId ? prev : reorderIds(prev, draggingId, overId);
      if (next.every((id, i) => prev[i] === id)) return prev;
      return next;
    });
  }, [draggingId]);

  const handleDragEnd = useCallback(() => {
    if (liveOrder && draggingId) {
      onReorder?.(liveOrder);
    }
    setDraggingId(null);
    setLiveOrder(null);
  }, [liveOrder, draggingId, onReorder]);

  return (
    <div className="space-y-2">
      {ordered.map((item, idx) => {
        const isEditing = editingId === item.id;
        const isDragging = draggingId === item.id;
        const isLast = idx === ordered.length - 1;

        return isEditing ? (
          <DragListInput
            key={item.id}
            minimal
            value={editValue || ""}
            onChange={onEditChange || (() => {})}
            onConfirm={onEditConfirm || (() => {})}
            onCancel={onEditCancel || (() => {})}
          />
        ) : (
          <div key={item.id}>
            <div
              className={["transition-all duration-200", isDragging && "opacity-40 scale-[0.98]"].filter(Boolean).join(" ")}
              draggable
              onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; handleDragStart(item.id); }}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; handleDragOver(item.id); }}
              onDrop={(e) => { e.preventDefault(); handleDragEnd(); }}
              onDragEnd={handleDragEnd}
            >
              <DragListItem bordered label={item.label} actions={item.actions} />
            </div>
            {isLast && draggingId && draggingId !== item.id && (
              <div
                className="h-6"
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; handleDragOver(LAST); }}
                onDrop={(e) => { e.preventDefault(); handleDragEnd(); }}
              />
            )}
          </div>
        );
      })}

      {isAdding && (
        <DragListInput
          minimal
          value={addValue || ""}
          onChange={onAddChange || (() => {})}
          onConfirm={onAddConfirm || (() => {})}
          onCancel={onAddCancel || (() => {})}
          placeholder={addPlaceholder}
        />
      )}

      {items.length === 0 && !isAdding && (
        <div className="flex min-h-[100px] flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-sm">{emptyMessage || "등록된 항목이 없습니다."}</p>
          {emptySubMessage && (
            <p className="text-muted-foreground/60 mt-1.5 text-xs leading-relaxed">{emptySubMessage}</p>
          )}
        </div>
      )}

      {!isAdding && (
        <Button size="h28" variant="outline" className="w-full" onClick={onAdd}>
          <Icons.Plus className="size-3.5" /> 등록
        </Button>
      )}
    </div>
  );
};

export default DragCodeColumn;
