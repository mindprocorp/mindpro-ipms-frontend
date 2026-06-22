import React, { useState } from "react";
import { Button, FlexBox, Input, Label, AlertModal, Icons } from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import { boardConfigQueries } from "@shared/query/board/boardConfigQueries.ts";
import { BoardSelectModal } from "../modal/BoardSelectModal";
import type { BoardConfig } from "@shared/api/board/boardConfigApi.ts";

export const BoardCleanupTab = () => {
  const { data: treeRes } = useQuery(boardConfigQueries.getList({ pageSize: 200 }));
  const { openAlert } = useAlertStore();
  
  const [dateThreshold, setDateThreshold] = useState("365"); // days
  const [selectedBoard, setSelectedBoard] = useState<BoardConfig | "ALL">("ALL");
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [targetCount, setTargetCount] = useState<number | null>(null);

  // 스캔 Mutation
  const scanMutation = useMutation({
    ...boardConfigQueries.getCleanupCount(),
    onSuccess: (res) => {
      setTargetCount(res.data);
      if (res.data === 0) {
        openAlert({ message: "정리 대상 게시글이 없습니다.", confirmText: "확인", showCancel: false });
      } else {
        openAlert({
          message: `스캔 완료: 총 ${res.data.toLocaleString()} 건의 정리 대상을 찾았습니다.`,
          confirmText: "확인",
          showCancel: false,
        });
      }
    },
    onError: () => {
      openAlert({ message: "정리 대상 스캔 중 오류가 발생했습니다.", confirmText: "확인", showCancel: false });
    }
  });

  // 실행 Mutation
  const executeMutation = useMutation({
    ...boardConfigQueries.executeCleanup(),
    onSuccess: (res) => {
      openAlert({
        message: `${res.data.toLocaleString()}개의 게시글이 성공적으로 휴지통으로 이동되었습니다.`,
        confirmText: "확인",
        showCancel: false,
      });
      setIsConfirmModalOpen(false);
      setTargetCount(null); // 작업 완료 후 초기화
    },
    onError: () => {
      openAlert({ message: "정리 작업 중 오류가 발생했습니다.", confirmText: "확인", showCancel: false });
    }
  });

  const handleSearch = () => {
    scanMutation.mutate({
      configSeq: selectedBoard === "ALL" ? "ALL" : (selectedBoard.configSeq || "ALL"),
      days: parseInt(dateThreshold) || 365
    });
  };

  const handleCleanupSubmit = () => {
    executeMutation.mutate({
      configSeq: selectedBoard === "ALL" ? "ALL" : (selectedBoard.configSeq || "ALL"),
      days: parseInt(dateThreshold) || 365
    });
  };

  return (
    <div className="flex h-full flex-col p-2 max-w-4xl">
      <div className="space-y-6 flex-1 overflow-auto">
        
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800 text-sm mb-6">
          <FlexBox className="gap-2 items-center mb-2">
            <Icons.AlertTriangle className="h-5 w-5" />
            <span className="font-bold">게시글 정리 마법사 도움말</span>
          </FlexBox>
          <p className="ml-7 opacity-90">
            오래되어 더 이상 참조하지 않는 게시판의 데이터를 일괄 정리하여 스토리지 용량을 확보할 수 있습니다. <br/>
            여기서 정리된 게시글은 <strong>[휴지통]</strong>으로 이동되며, 휴지통 보관 기간 설정에 따라 최종 영구 삭제됩니다.
          </p>
        </div>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-foreground">정리 조건 (필터)</h3>
          <div className="grid gap-6 rounded-md border border-border bg-card p-6 shadow-sm">
            
            <FlexBox className="gap-6 items-center">
              <div className="w-[150px]">
                <Label className="text-sm text-muted-foreground">대상 게시판</Label>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-[350px] justify-start gap-2 font-normal"
                onClick={() => setIsSelectModalOpen(true)}
              >
                <Icons.Search className="size-4 text-muted-foreground" />
                <span className="flex-1 text-left">
                  {selectedBoard === "ALL" ? "모든 일반 게시판" : selectedBoard.boardName}
                </span>
                <Icons.ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </FlexBox>

            <FlexBox className="gap-6 items-center">
              <div className="w-[150px]">
                <Label className="text-sm text-muted-foreground">작성일 기준</Label>
              </div>
              <FlexBox className="items-center gap-3">
                <Input 
                  value={dateThreshold} 
                  onChange={(e) => setDateThreshold(e.target.value)} 
                  type="number" 
                  className="w-24 text-right"
                />
                <span className="text-sm text-foreground">일 이상 경과한 게시글</span>
              </FlexBox>
            </FlexBox>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSearch} disabled={scanMutation.isPending}>
                {scanMutation.isPending ? "계산 중..." : "정리 대상 스캔(조회)"}
              </Button>
            </div>

          </div>
        </section>

        {/* 결과 섹션 */}
        {targetCount !== null && targetCount > 0 && !scanMutation.isPending && (
          <section className="animate-in fade-in slide-in-from-bottom-2">
            <h3 className="mb-4 text-lg font-semibold text-foreground">스캔 결과</h3>
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">설정된 조건으로 정리될 게시물 총합:</p>
                <p className="text-2xl font-bold text-destructive">{targetCount.toLocaleString()} 건</p>
              </div>
              <Button 
                variant="destructive" 
                size="lg" 
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={executeMutation.isPending}
              >
                {executeMutation.isPending ? "정리 중..." : "일괄 정리 (휴지통 이동)"}
              </Button>
            </div>
          </section>
        )}

        {targetCount === 0 && !scanMutation.isPending && (
          <section className="animate-in fade-in slide-in-from-bottom-2">
            <div className="rounded-md border border-border bg-muted/30 p-8 text-center">
              <p className="text-muted-foreground">정리 대상 게시글이 없습니다.</p>
            </div>
          </section>
        )}

      </div>

      {/* 모달 (사내 표준 AlertModal 활용) */}
      <AlertModal 
        open={isConfirmModalOpen} 
        onOpenChange={setIsConfirmModalOpen}
        title="게시글 일괄 정리 확인"
        message={
          <div className="p-4 space-y-4">
            <div className="bg-muted p-4 rounded-md text-sm text-center">
              총 <strong className="text-destructive text-lg">{targetCount}</strong> 건의 게시글이 휴지통으로 이동합니다.
            </div>
            <p className="text-sm text-muted-foreground">
              휴지통으로 이동된 게시글들은 각 게시판의 마스터 또는 휴지통 관리 메뉴에서 복구할 수 있으나, 휴지통 보관 기한이 지나면 영구 삭제되어 복구가 불가능해집니다. <br/><br/>
              계속 진행하시겠습니까?
            </p>
          </div>
        }
        confirmText="이동 실행"
        cancelText="취소"
        onConfirm={handleCleanupSubmit}
        disabled={executeMutation.isPending}
      />

      <BoardSelectModal 
        open={isSelectModalOpen} 
        onOpenChange={setIsSelectModalOpen} 
        onSelect={(board) => setSelectedBoard(board)}
        selectedValue={selectedBoard === "ALL" ? "ALL" : selectedBoard.configSeq}
      />

    </div>
  );
};
