import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Icons } from "@repo/ui";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { boardConfigQueries } from "@shared/query/board/boardConfigQueries";
import type { BoardConfig } from "@shared/api/board/boardConfigApi";
import { useAlertStore } from "@shared/store/useAlertStore";

const FAV_STORAGE_KEY = "board_favorites";

const loadFavorites = (): BoardConfig[] => {
  try {
    return JSON.parse(localStorage.getItem(FAV_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
};

function flattenBoards(nodes: BoardConfig[]): BoardConfig[] {
  return nodes.flatMap((n) =>
    n.boardType === "BOARD" ? [n] : flattenBoards(n.children ?? [])
  );
}

interface BoardSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (board: BoardConfig) => void;
  initialConfigSeq?: string;
}

export const BoardSelectModal = ({
  open,
  onOpenChange,
  onConfirm,
  initialConfigSeq,
}: BoardSelectModalProps) => {
  const [tab, setTab] = useState<"all" | "fav">("all");
  const [selected, setSelected] = useState(initialConfigSeq ?? "");
  const [treeData, setTreeData] = useState<BoardConfig[]>([]);
  const favorites = loadFavorites();
  const { openAlert } = useAlertStore();

  const getTreeMut = useMutation(boardConfigQueries.getListMut());

  useEffect(() => {
    if (!open) return;
    setSelected(initialConfigSeq ?? "");
    getTreeMut.mutate(
      {},
      {
        onSuccess: (res) => {
          const raw = res.data;
          const list: BoardConfig[] = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.list)
            ? raw.list
            : [];
          setTreeData(list);
        },
      }
    );
  }, [open]);

  const allBoards = flattenBoards(treeData);
  const displayBoards =
    tab === "fav"
      ? allBoards.filter((b) => favorites.some((f) => f.configSeq === b.configSeq))
      : allBoards;

  const handleConfirm = () => {
    const board = allBoards.find((b) => b.configSeq === selected);
    if (!board) return;
    if (board.canWrite === false) {
      openAlert({ message: "해당 게시판에 작성 권한이 없습니다.", confirmText: "확인", showCancel: false });
      return;
    }
    onConfirm(board);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>게시판 선택</DialogTitle>
        </DialogHeader>

        {/* 탭 */}
        <div className="flex border-b px-6">
          {(["all", "fav"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => { setTab(key); setSelected(""); }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {key === "all" ? "전체" : "즐겨찾는 게시판"}
            </button>
          ))}
        </div>

        {/* 게시판 목록 */}
        <div className="mx-6 my-4 max-h-[400px] overflow-y-auto rounded-md border">
          {getTreeMut.isPending ? (
            <p className="py-8 text-center text-sm text-muted-foreground">불러오는 중...</p>
          ) : displayBoards.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">게시판이 없습니다.</p>
          ) : (
            displayBoards.map((board) => (
              <label
                key={board.configSeq}
                className={`flex cursor-pointer items-center gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-muted/40 ${
                  selected === board.configSeq ? "bg-blue-500/10" : ""
                }`}
              >
                <input
                  type="radio"
                  name="boardSelect"
                  value={board.configSeq}
                  checked={selected === board.configSeq}
                  onChange={() => setSelected(board.configSeq ?? "")}
                  className="accent-blue-600"
                />
                <Icons.FileText className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">{board.boardName}</span>
              </label>
            ))
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" size="h36" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
          <Button variant="blue" size="h36" onClick={handleConfirm} disabled={!selected}>
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
