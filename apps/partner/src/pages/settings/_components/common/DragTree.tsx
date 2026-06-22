import { useState, useCallback, createContext, useContext } from "react";
import type React from "react";
import { Icons } from "@repo/ui";
import DragListItem, { type DragListAction } from "./DragListItem";
import DragListInput from "./DragListInput";

const INDENT = 32;
const LAST_MARKER = "__LAST__";

// ─── Types ───────────────────────────────────────────────

export interface DragTreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  dimmed?: boolean;
  children?: DragTreeNode[];
  actions?: DragListAction[];
  onAdd?: () => void;
  noDrag?: boolean;
}

export interface DragTreeProps {
  nodes: DragTreeNode[];
  expanded: Set<string>;
  onToggle: (id: string) => void;
  /** 인라인 추가 */
  addingId?: string | null;
  addValue?: string;
  onAddChange?: (v: string) => void;
  addCodeValue?: string;
  onAddCodeChange?: (v: string) => void;
  onAddConfirm?: () => void;
  onAddCancel?: () => void;
  addPlaceholder?: string;
  /** 인라인 수정 */
  editingId?: string | null;
  editValue?: string;
  onEditChange?: (v: string) => void;
  editCodeValue?: string;
  onEditCodeChange?: (v: string) => void;
  onEditConfirm?: () => void;
  onEditCancel?: () => void;
  /** 선택 */
  onNodeClick?: (id: string) => void;
  selectedId?: string;
  /** 드래그 순서 변경 완료 콜백 */
  onReorder?: (parentId: string | null, orderedIds: string[]) => void;
}

type DragState = {
  draggingId: string | null;
  parentId: string | null;
  liveOrder: Map<string | null, string[]>;
};

const EMPTY_DRAG: DragState = { draggingId: null, parentId: null, liveOrder: new Map() };

// ─── Context (prop drilling 제거) ────────────────────────

type TreeCtx = Omit<DragTreeProps, "nodes" | "onReorder"> & {
  dragState: DragState;
  onDragStart: (id: string, parentId: string | null) => void;
  onDragOver: (id: string, parentId: string | null) => void;
  onDragEnd: () => void;
};

const TreeContext = createContext<TreeCtx | null>(null);
const useTree = () => useContext(TreeContext)!;

// ─── Helpers ─────────────────────────────────────────────

const reorderIds = (ids: string[], from: string, to: string): string[] => {
  if (from === to) return ids;
  const result = ids.filter((id) => id !== from);
  const toIdx = result.indexOf(to);
  if (toIdx === -1) return ids;
  result.splice(toIdx, 0, from);
  return result;
};

const findSiblings = (nodes: DragTreeNode[], parentId: string | null): DragTreeNode[] => {
  if (parentId === null) return nodes;
  for (const n of nodes) {
    if (n.id === parentId) return n.children || [];
    if (n.children) {
      const found = findSiblings(n.children, parentId);
      if (found.length) return found;
    }
  }
  return [];
};

// ─── TreeNodeList ────────────────────────────────────────

const TreeNodeList = ({ nodes, depth, parentId }: { nodes: DragTreeNode[]; depth: number; parentId: string | null }) => {
  const ctx = useTree();
  const { expanded, onToggle, addingId, addValue, onAddChange, addCodeValue, onAddCodeChange, onAddConfirm, onAddCancel, addPlaceholder,
    editingId, editValue, onEditChange, editCodeValue, onEditCodeChange, onEditConfirm, onEditCancel, onNodeClick, selectedId,
    dragState, onDragStart, onDragOver, onDragEnd } = ctx;

  const liveIds = dragState.liveOrder.get(parentId);
  const ordered = liveIds
    ? liveIds.map((id) => nodes.find((n) => n.id === id)).filter(Boolean) as DragTreeNode[]
    : nodes;

  return (
    <>
      {ordered.map((node, idx) => {
        const hasChildren = !!node.children?.length;
        const isOpen = expanded.has(node.id);
        const isEditing = editingId === node.id;
        const isDragging = dragState.draggingId === node.id;
        const isLast = idx === ordered.length - 1;
        const showDropZone = isLast && dragState.draggingId && dragState.draggingId !== node.id && dragState.parentId === parentId;

        return (
          <div key={node.id}>
            {/* ── 노드 아이템 ── */}
            <div
              style={{ paddingLeft: depth * INDENT }}
              className={["py-[3px] transition-all duration-200 ease-in-out", isDragging && "opacity-40 scale-[0.98]"].filter(Boolean).join(" ")}
              draggable={!isEditing && !node.noDrag}
              onDragStart={(e) => { if (node.noDrag) return; e.stopPropagation(); e.dataTransfer.effectAllowed = "move"; onDragStart(node.id, parentId); }}
              onDragOver={(e) => { if (node.noDrag) return; e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = "move"; onDragOver(node.id, parentId); }}
              onDrop={(e) => { if (node.noDrag) return; e.preventDefault(); e.stopPropagation(); onDragEnd(); }}
              onDragEnd={onDragEnd}
            >
              {isEditing ? (
                <DragListInput minimal value={editValue || ""} onChange={onEditChange || (() => {})} secondValue={editCodeValue} onSecondChange={onEditCodeChange} secondPlaceholder="부서코드" onConfirm={onEditConfirm || (() => {})} onCancel={onEditCancel || (() => {})} placeholder="이름 입력" />
              ) : (
                <DragListItem
                  bordered
                  label={node.label}
                  dimmed={node.dimmed}
                  selected={selectedId === node.id}
                  noDrag={node.noDrag}
                  onClick={onNodeClick ? () => onNodeClick(node.id) : undefined}
                  prefix={
                    <span className="flex items-center gap-0.5">
                      {hasChildren && (
                        <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(node.id); }} className="mr-0.5">
                          <Icons.ChevronDown className={`size-4 transition-transform ${!isOpen ? "-rotate-90" : ""}`} />
                        </button>
                      )}
                      {node.icon}
                    </span>
                  }
                  suffix={node.suffix}
                  onAdd={node.onAdd}
                  actions={node.actions}
                />
              )}
            </div>

            {/* ── 인라인 추가 ── */}
            {addingId === node.id && (
              <div style={{ paddingLeft: (depth + 1) * INDENT }} className="py-[3px]">
                <DragListInput minimal value={addValue || ""} onChange={onAddChange || (() => {})} secondValue={addCodeValue} onSecondChange={onAddCodeChange} secondPlaceholder="부서코드" onConfirm={onAddConfirm || (() => {})} onCancel={onAddCancel || (() => {})} placeholder={addPlaceholder} />
              </div>
            )}

            {/* ── 자식 노드 ── */}
            {isOpen && node.children && (
              <TreeNodeList nodes={node.children} depth={depth + 1} parentId={node.id} />
            )}

            {/* ── 마지막 드롭존 ── */}
            {showDropZone && (
              <div
                style={{ paddingLeft: depth * INDENT }}
                className="h-8"
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = "move"; onDragOver(LAST_MARKER, parentId); }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onDragEnd(); }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

// ─── DragTree (메인) ─────────────────────────────────────

const DragTree = ({ nodes, onReorder, ...rest }: DragTreeProps) => {
  const isAddingRoot = rest.addingId === "ROOT";
  const [dragState, setDragState] = useState<DragState>(EMPTY_DRAG);

  const handleDragStart = useCallback((id: string, parentId: string | null) => {
    const siblings = findSiblings(nodes, parentId);
    const liveOrder = new Map<string | null, string[]>();
    liveOrder.set(parentId, siblings.map((n) => n.id));
    setDragState({ draggingId: id, parentId, liveOrder });
  }, [nodes]);

  const handleDragOver = useCallback((overId: string, overParentId: string | null) => {
    setDragState((prev) => {
      if (!prev.draggingId || prev.parentId !== overParentId) return prev;
      const current = prev.liveOrder.get(overParentId);
      if (!current) return prev;

      const next = overId === LAST_MARKER
        ? [...current.filter((id) => id !== prev.draggingId), prev.draggingId]
        : prev.draggingId === overId ? current : reorderIds(current, prev.draggingId, overId);

      if (next.every((id, i) => current[i] === id)) return prev;

      const newLive = new Map(prev.liveOrder);
      newLive.set(overParentId, next);
      return { ...prev, liveOrder: newLive };
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    const { draggingId, parentId, liveOrder } = dragState;
    if (draggingId && liveOrder.has(parentId)) {
      onReorder?.(parentId, liveOrder.get(parentId)!);
    }
    setDragState(EMPTY_DRAG);
  }, [dragState, onReorder]);

  const ctx: TreeCtx = { ...rest, dragState, onDragStart: handleDragStart, onDragOver: handleDragOver, onDragEnd: handleDragEnd };

  return (
    <TreeContext.Provider value={ctx}>
      <div className="space-y-0.5">
        {isAddingRoot && (
          <div className="mb-2">
            <DragListInput minimal value={rest.addValue || ""} onChange={rest.onAddChange || (() => {})} secondValue={rest.addCodeValue} onSecondChange={rest.onAddCodeChange} secondPlaceholder="부서코드" onConfirm={rest.onAddConfirm || (() => {})} onCancel={rest.onAddCancel || (() => {})} placeholder={rest.addPlaceholder} />
          </div>
        )}

        {nodes.length === 0 && !isAddingRoot ? (
          <p className="text-muted-foreground flex h-40 items-center justify-center text-sm">등록된 항목이 없습니다.</p>
        ) : (
          <TreeNodeList nodes={nodes} depth={0} parentId={null} />
        )}
      </div>
    </TreeContext.Provider>
  );
};

export default DragTree;
