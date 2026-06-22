import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, FlexBox, RadioGroup, RadioGroupItem, Switch } from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore";
import SelectBox from "../../_components/common/SelectBox";
import { boardConfigApi } from "@shared/api/board/boardConfigApi.ts";
import { apiClient } from "@shared/api/client.ts";

export const BoardMainTab = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlertStore();
  const api = boardConfigApi(apiClient);

  const [formData, setFormData] = useState({
    mainLayoutType: "LIST",
    recentPostCount: "5",
    newBadgeDuration: "24",
    showPinOnTop: true,
  });

  const { data: configData, isLoading } = useQuery({
    queryKey: ["board", "systemConfig"],
    queryFn: async () => {
      const res = await api.getSystemConfig();
      return res.data;
    },
  });

  useEffect(() => {
    if (configData) {
      setFormData({
        mainLayoutType: configData.mainLayoutType || "LIST",
        recentPostCount: String(configData.recentPostCount || "5"),
        newBadgeDuration: String(configData.newBadgeDuration || "24"),
        showPinOnTop: configData.showPinOnTopYn === "Y",
      });
    }
  }, [configData]);

  const mutation = useMutation({
    mutationFn: (data: any) => api.saveSystemConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", "systemConfig"] });
      openAlert({ message: "메인 화면 노출 설정이 저장되었습니다.", confirmText: "확인", showCancel: false });
    },
    onError: () => {
      openAlert({ message: "저장 중 오류가 발생했습니다.", confirmText: "확인", showCancel: false });
    },
  });

  const handleSave = () => {
    if (!configData) return;

    // 기존 데이터에 메인 탭의 설정을 덮어씌움
    const payload = {
      ...configData,
      mainLayoutType: formData.mainLayoutType,
      recentPostCount: parseInt(formData.recentPostCount),
      newBadgeDuration: parseInt(formData.newBadgeDuration),
      showPinOnTopYn: formData.showPinOnTop ? "Y" : "N",
    };

    mutation.mutate(payload);
  };

  if (isLoading) return <div className="p-10 text-center text-muted-foreground">설정 로딩 중...</div>;

  return (
    <div className="flex h-full flex-col p-2 max-w-4xl">
      <div className="space-y-10 flex-1 overflow-auto">
        
        {/* 레이아웃 스타일 */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-foreground">메인 레이아웃 형태</h3>
          <div className="rounded-md border border-border bg-card p-6 shadow-sm">
            <RadioGroup 
              value={formData.mainLayoutType} 
              onValueChange={(v) => setFormData(p => ({...p, mainLayoutType: v}))}
              className="grid gap-6 grid-cols-2"
            >
              <label className="flex flex-col gap-3 rounded-lg border-2 border-transparent p-4 hover:bg-muted cursor-pointer transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                <FlexBox className="gap-2 items-center">
                  <RadioGroupItem value="LIST" />
                  <span className="font-medium">리스트형 (기본형)</span>
                </FlexBox>
                <div className="h-32 rounded bg-background border border-border/50 flex flex-col p-3 gap-2 opacity-80">
                  <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
                  <div className="mt-auto text-xs text-muted-foreground">다수의 글을 목록으로 빽빽하게 보여줍니다.</div>
                </div>
              </label>

              <label className="flex flex-col gap-3 rounded-lg border-2 border-transparent p-4 hover:bg-muted cursor-pointer transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                <FlexBox className="gap-2 items-center">
                  <RadioGroupItem value="FEED" />
                  <span className="font-medium">피드형 (미리보기 포함)</span>
                </FlexBox>
                <div className="h-32 rounded bg-background border border-border/50 flex flex-col p-3 gap-2 opacity-80">
                  <div className="h-10 bg-muted-foreground/20 rounded w-full mb-1"></div>
                  <div className="h-4 bg-muted-foreground/10 rounded w-3/4"></div>
                  <div className="mt-auto text-xs text-muted-foreground">본문 일부와 썸네일 이미지를 포함하여 보여줍니다.</div>
                </div>
              </label>
            </RadioGroup>
          </div>
        </section>

        {/* 상세 설정 */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-foreground">노출 상세 설정</h3>
          <div className="grid gap-6 rounded-md border border-border bg-card p-6 shadow-sm">
            
            <FlexBox className="gap-6 items-center">
              <div className="w-[180px]">
                <label className="text-sm text-muted-foreground">최근 게시글 노출 개수</label>
              </div>
              <SelectBox 
                value={formData.recentPostCount} 
                onChange={(v) => setFormData(p => ({...p, recentPostCount: v}))}
                options={[
                  { label: "3개", value: "3" },
                  { label: "5개", value: "5" },
                  { label: "10개", value: "10" },
                  { label: "15개", value: "15" }
                ]}
                className="w-32"
              />
            </FlexBox>

            <FlexBox className="gap-6 items-center">
              <div className="w-[180px]">
                <label className="text-sm text-muted-foreground">새 글 아이콘(N) 노출</label>
              </div>
              <SelectBox 
                value={formData.newBadgeDuration} 
                onChange={(v) => setFormData(p => ({...p, newBadgeDuration: v}))}
                options={[
                  { label: "12시간", value: "12" },
                  { label: "24시간 (1일)", value: "24" },
                  { label: "48시간 (2일)", value: "48" },
                  { label: "72시간 (3일)", value: "72" }
                ]}
                className="w-40"
              />
            </FlexBox>

            <FlexBox className="gap-6 items-center">
              <div className="w-[180px]">
                <label className="text-sm text-muted-foreground">공지사항 최상단 고정</label>
              </div>
              <Switch 
                checked={formData.showPinOnTop} 
                onCheckedChange={(c) => setFormData(p => ({...p, showPinOnTop: c}))} 
              />
              <span className="text-sm text-muted-foreground">
                설정 시 어떤 정렬 형태든 필독/공지사항이 최상단에 고정 노출됩니다.
              </span>
            </FlexBox>

          </div>
        </section>

      </div>

      <div className="mt-8 flex justify-end gap-3 border-t border-border pt-4">
        <Button variant="outline" onClick={() => window.location.reload()}>취소</Button>
        <Button variant="blue" onClick={handleSave} disabled={mutation.isPending}>
          {mutation.isPending ? "저장 중..." : "설정 적용"}
        </Button>
      </div>
    </div>
  );
};
