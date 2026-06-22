import { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from "@repo/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardConfigQueries } from "@shared/query/board/boardConfigQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore";
import type { BoardConfig } from "@shared/api/board/boardConfigApi.ts";

interface CategoryConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: BoardConfig | null;
  existingItems?: BoardConfig[];
}

export const CategoryConfigModal = ({ open, onOpenChange, data, existingItems }: CategoryConfigModalProps) => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlertStore();
  const [boardName, setBoardName] = useState("");
  
  const createMutation = useMutation(boardConfigQueries.createConfig());
  const updateMutation = useMutation(boardConfigQueries.updateConfig());

  const isEdit = !!data?.configSeq;

  useEffect(() => {
    if (open) {
      setBoardName(data?.boardName || "");
    }
  }, [open, data]);

  const handleSave = () => {
    if (!boardName.trim()) {
      openAlert({ message: "카테고리명을 입력해주세요.", showCancel: false });
      return;
    }

    const isDuplicate = existingItems?.some(
      (item) => item.boardType === "CATEGORY" && item.boardName === boardName.trim() && item.configSeq !== data?.configSeq
    );
    if (isDuplicate) {
      openAlert({ message: "이미 사용 중인 폴더명입니다.", showCancel: false });
      return;
    }

    const payload = {
      boardConfig: {
        ...data,
        boardType: "CATEGORY" as const,
        boardName: boardName,
      },
      masters: [] // TODO: 마스터 연동 시 추가
    };

    const mutation = isEdit ? updateMutation : createMutation;

    mutation.mutate(payload, {
      onSuccess: () => {
        openAlert({
          message: isEdit ? "카테고리가 수정되었습니다." : "카테고리가 생성되었습니다.",
          confirmText: "확인",
          showCancel: false,
        });
        queryClient.invalidateQueries({ queryKey: ["boardConfig"] });
        queryClient.invalidateQueries({ queryKey: ["board", "main"] });
        onOpenChange(false);
      },
      onError: () => openAlert({ message: "저장에 실패했습니다.", confirmText: "확인", showCancel: false })
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-background">
        <DialogHeader>
          <DialogTitle>{isEdit ? "카테고리 수정" : "카테고리 추가"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">
              <span className="text-blue-500 mr-1">•</span>카테고리명 <span className="text-xs text-muted-foreground ml-auto float-right">{boardName.length}/60</span>
            </label>
            <Input
              value={boardName}
              onChange={(e) => setBoardName(e.target.value.substring(0, 60))}
              placeholder="카테고리명을 입력해 주세요."
            />
            <p className="text-xs text-muted-foreground mt-1">
              · 게시판을 하나의 카테고리로 묶을 때 사용합니다.<br />
              · '카테고리' 하위에 있는 게시판은 카테고리 단위로 접고 펼치기 기능을 제공합니다.
            </p>
          </div>

          {/* 카테고리 마스터 (미구현)
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">카테고리 마스터</label>
            <div className="flex gap-2">
              <Input placeholder="이름 또는 ID 검색" className="flex-1" />
              <Button variant="outline">주소록</Button>
            </div>
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">
                이 카테고리를 관리할 카테고리 마스터를 추가해 주세요.
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              · 카테고리 마스터는 카테고리 정보를 수정하거나 삭제할 수 있습니다.<br />
              · <span className="text-blue-500">관리자</span>는 모든 카테고리에 마스터 권한을 가집니다.
            </p>
          </div>
          */}
        </div>
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            variant="blue"
            onClick={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
