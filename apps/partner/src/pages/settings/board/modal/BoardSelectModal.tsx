import React, { useState, useMemo } from "react";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Icons, FlexBox } from "@repo/ui";
import { useQuery } from "@tanstack/react-query";
import { boardConfigQueries } from "@shared/query/board/boardConfigQueries.ts";
import type { BoardConfig } from "@shared/api/board/boardConfigApi.ts";

interface BoardSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (board: BoardConfig | "ALL") => void;
  selectedValue?: string;
  title?: string;
}

export const BoardSelectModal = ({
  open,
  onOpenChange,
  onSelect,
  selectedValue,
  title = "게시판 선택"
}: BoardSelectModalProps) => {
  const { data: treeRes, isLoading } = useQuery(boardConfigQueries.getList({ pageSize: 200 }));
  const treeData = treeRes?.data?.list || [];

  const [localSelected, setLocalSelected] = useState<string | "ALL">(selectedValue || "ALL");
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const toggleFolder = (configSeq: string) => {
    setExpandedFolders(prev =>
      prev.includes(configSeq) ? prev.filter(s => s !== configSeq) : [...prev, configSeq]
    );
  };

  const handleConfirm = () => {
    if (localSelected === "ALL") {
      onSelect("ALL");
    } else {
      // Find selected board object
      let selectedObj: BoardConfig | undefined;
      const findInTree = (items: BoardConfig[]) => {
        for (const item of items) {
          if (item.configSeq === localSelected) {
            selectedObj = item;
            return;
          }
          if (item.children) findInTree(item.children);
        }
      };
      findInTree(treeData);
      if (selectedObj) onSelect(selectedObj);
    }
    onOpenChange(false);
  };

  const renderTreeItem = (item: BoardConfig, depth: number = 0) => {
    const isFolder = item.boardType === "CATEGORY";
    const isExpanded = expandedFolders.includes(item.configSeq!);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.configSeq} className="flex flex-col">
        <div
          className={`flex items-center gap-2 p-2 hover:bg-muted/50 cursor-pointer rounded-sm group ${localSelected === item.configSeq ? 'bg-blue-500/10' : ''}`}
          onClick={() => {
            if (isFolder) {
              toggleFolder(item.configSeq!);
            } else {
              setLocalSelected(item.configSeq!);
            }
          }}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
        >
          <div className="flex items-center gap-2 flex-1">
            {isFolder ? (
              <>
                <Icons.ChevronRight className={`size-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                <Icons.Folder className="size-4 text-amber-500 fill-amber-500/20" />
              </>
            ) : (
              <div className="flex items-center gap-3 w-full">
                <input
                  type="radio"
                  name="board-selection"
                  checked={localSelected === item.configSeq}
                  readOnly
                  className="size-3.5 accent-blue-600"
                />
                <Icons.FileText className="size-4 text-muted-foreground" />
              </div>
            )}
            <span className={`text-sm ${isFolder ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>
              {item.boardName}
            </span>
          </div>
        </div>

        {isFolder && isExpanded && item.children && (
          <div className="flex flex-col">
            {item.children.map(child => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {/* 전체 선택 옵션 (일반적으로 상단에 위치) */}
          <div
            className={`flex items-center gap-3 p-2 hover:bg-muted/50 cursor-pointer rounded-sm mb-2 ${localSelected === "ALL" ? 'bg-blue-500/10' : ''}`}
            onClick={() => setLocalSelected("ALL")}
          >
            <input
              type="radio"
              name="board-selection"
              checked={localSelected === "ALL"}
              readOnly
              className="size-3.5 accent-blue-600"
            />
            <Icons.LayoutGrid className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">전체 게시판</span>
          </div>

          <div className="h-px bg-border my-2" />

          {isLoading ? (
            <div className="flex justify-center p-8">
              <Icons.Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-1">
              {treeData.map(item => renderTreeItem(item))}
            </div>
          )}
        </div>

        <DialogFooter className="p-4 bg-muted/30 border-t gap-2 sm:flex-row">
          <Button variant="outline" className="w-full sm:w-24" onClick={() => onOpenChange(false)}>닫기</Button>
          <Button variant="blue" className="w-full sm:w-24" onClick={handleConfirm}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
