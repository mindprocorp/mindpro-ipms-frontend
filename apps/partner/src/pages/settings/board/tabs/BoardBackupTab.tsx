import React, { useState } from "react";
import { Button, FlexBox, Label, Icons } from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardConfigQueries } from "@shared/query/board/boardConfigQueries.ts";
import { apiClient } from "@shared/api/client.ts";
import { downloadFile } from "@shared/util/fileUtil";
import { BoardSelectModal } from "../modal/BoardSelectModal";
import type { BoardConfig, BoardBackupVO } from "@shared/api/board/boardConfigApi.ts";

export const BoardBackupTab = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlertStore();
  const { data: treeRes } = useQuery(boardConfigQueries.getList({ pageSize: 200 }));
  
  // 백업 목록 조회
  const { data: backupRes, isLoading: isListLoading } = useQuery(boardConfigQueries.getBackupList());
  const backupHistory = (backupRes?.data as any)?.list || [];

  // 백업 요청 Mutation
  const requestMutation = useMutation({
    ...boardConfigQueries.requestBackup(),
    onSuccess: () => {
      openAlert({ message: "백업 파일(Zip) 생성 요청이 성공했습니다.", confirmText: "확인", showCancel: false });
      queryClient.invalidateQueries({ queryKey: ["boardConfig", "backup", "list"] });
    },
    onError: () => {
      openAlert({ message: "백업 요청 중 오류가 발생했습니다.", confirmText: "확인", showCancel: false });
    }
  });

  const [selectedBoard, setSelectedBoard] = useState<BoardConfig | "ALL">("ALL");
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  const handleRequestBackup = () => {
    const vo: BoardBackupVO = {
      configSeq: selectedBoard === "ALL" ? "ALL" : selectedBoard.configSeq,
      boardName: selectedBoard === "ALL" ? "전체 게시판" : (selectedBoard.boardName || ""),
    };
    
    requestMutation.mutate(vo);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return dateStr.substring(0, 16).replace("T", " ");
  };

  return (
    <div className="flex h-full flex-col p-2 max-w-5xl">
      <div className="space-y-6 flex-1 overflow-auto">
        
        {/* 새 백업 요청 */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-foreground">새로운 데이터 백업 요청</h3>
          <div className="rounded-md border border-border bg-card p-6 shadow-sm">
            <FlexBox className="gap-6 items-center">
              <div className="w-[150px]">
                <Label className="text-sm text-muted-foreground">백업 대상 게시판</Label>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-[350px] justify-start gap-2 font-normal"
                onClick={() => setIsSelectModalOpen(true)}
              >
                <Icons.Search className="size-4 text-muted-foreground" />
                <span className="flex-1 text-left text-sm">
                  {selectedBoard === "ALL" ? "모든 게시판 (전체 게시글 + 첨부파일 포함)" : selectedBoard.boardName}
                </span>
                <Icons.ChevronDown className="size-4 text-muted-foreground" />
              </Button>
              <Button 
                onClick={handleRequestBackup} 
                disabled={requestMutation.isPending}
                className="min-w-[120px]"
              >
                {requestMutation.isPending ? "요청 중..." : "백업 생성 시작"}
              </Button>
            </FlexBox>
            <p className="mt-4 text-xs text-muted-foreground whitespace-pre-wrap">
              * 데이터 크기에 따라 백업에 수 분 ~ 수 시간이 소요될 수 있습니다. 생성이 완료되면 아래 목록에서 다운로드 가능합니다. (보관 기한 7일)
            </p>
          </div>
        </section>

        {/* 백업 내역 테이블 */}
        <section>
          <FlexBox className="justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">백업 및 다운로드 내역</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ["boardConfig", "backup", "list"] })}
              className="gap-2"
            >
              <Icons.RefreshCw className={`size-3 ${isListLoading ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </FlexBox>
          <div className="rounded-md border border-border bg-card shadow-sm p-0 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium border-b border-border">요청 일시</th>
                  <th className="p-4 font-medium border-b border-border">대상 게시판</th>
                  <th className="p-4 font-medium border-b border-border">상태 / 크기</th>
                  <th className="p-4 font-medium border-b border-border">요청자</th>
                  <th className="p-4 font-medium border-b border-border w-32 text-center">동작</th>
                </tr>
              </thead>
              <tbody>
                {backupHistory.map((item) => (
                  <tr key={item.backupSeq} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-4">{formatDate(item.createAt)}</td>
                    <td className="p-4 font-medium">{item.boardName}</td>
                    <td className="p-4">
                      {item.status === "REQUEST" && <span className="text-slate-500 font-medium">대기 중</span>}
                      {item.status === "PROCESSING" && <span className="text-blue-500 font-medium animate-pulse">생성 중...</span>}
                      {item.status === "COMPLETED" && (
                        <div className="flex flex-col">
                          <span className="text-green-600 font-medium">생성 완료</span>
                          <span className="text-[10px] text-muted-foreground">{formatFileSize(item.fileSize)}</span>
                        </div>
                      )}
                      {item.status === "FAILED" && <span className="text-destructive font-medium">오류 발생</span>}
                    </td>
                    <td className="p-4 text-muted-foreground">{item.requestUserName}</td>
                    <td className="p-4 text-center">
                      <Button 
                        size="sm" 
                        variant={item.status === "COMPLETED" ? "default" : "outline"}
                        disabled={item.status !== "COMPLETED"}
                        onClick={() => {
                          if (!item.downloadUrl) {
                            openAlert({ message: "다운로드 URL이 없습니다.", confirmText: "확인", showCancel: false });
                            return;
                          }
                          // API 서버 주소를 포함한 전체 URL 생성
                          const baseUrl = import.meta.env.VITE_APP_API_URL || "";
                          const fullUrl = item.downloadUrl.startsWith("http") 
                              ? item.downloadUrl 
                              : `${baseUrl}${item.downloadUrl}`;

                          downloadFile(fullUrl, item.fileName || "board_backup.json");
                        }}
                      >
                        다운로드
                      </Button>
                    </td>
                  </tr>
                ))}
                {backupHistory.length === 0 && !isListLoading && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">백업 내역이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      <BoardSelectModal 
        open={isSelectModalOpen} 
        onOpenChange={setIsSelectModalOpen} 
        onSelect={(board) => setSelectedBoard(board)}
        selectedValue={selectedBoard === "ALL" ? "ALL" : selectedBoard.configSeq}
      />
    </div>
  );
};
