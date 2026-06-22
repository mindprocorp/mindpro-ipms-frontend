import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, FlexBox, Input, Label, RadioGroup, RadioGroupItem, Switch } from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore";
import { boardConfigApi } from "@shared/api/board/boardConfigApi.ts";
import { apiClient } from "@shared/api/client.ts";

export const BoardGeneralTab = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlertStore();
  const api = boardConfigApi(apiClient);

  const [formData, setFormData] = useState({
    maxFileSize: 500,
    maxBodySize: 50,
    trashRetentionDays: "30",
    allowMasterChangeYn: "Y" as "Y" | "N",
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
        maxFileSize: configData.maxFileSize,
        maxBodySize: configData.maxBodySize,
        trashRetentionDays: configData.trashRetentionDays,
        allowMasterChangeYn: configData.allowMasterChangeYn,
      });
    }
  }, [configData]);

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => api.saveSystemConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", "systemConfig"] });
      openAlert({ message: "게시판 일반 설정이 정상적으로 저장되었습니다.", confirmText: "확인", showCancel: false });
    },
    onError: () => {
      openAlert({ message: "저장 중 오류가 발생했습니다.", confirmText: "확인", showCancel: false });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));
  };

  const handleSave = () => {
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="p-10 text-center text-muted-foreground">설정 로딩 중...</div>;

  return (
    <div className="flex h-full flex-col p-2 max-w-4xl">
      <div className="space-y-10 flex-1 overflow-auto">
        
        {/* 공통 용량 설정 */}
        <section>
          <h3 className="mb-4 text-lg font-semibold tabular-nums text-foreground">용량 설정</h3>
          <div className="grid gap-6 rounded-md border border-border bg-card p-6 shadow-sm">
            <FlexBox className="gap-6 items-start">
              <div className="w-[180px]">
                <Label className="text-sm text-muted-foreground">첨부파일 최대 용량</Label>
              </div>
              <FlexBox className="items-center gap-2">
                <Input 
                  name="maxFileSize" 
                  value={formData.maxFileSize} 
                  onChange={handleChange} 
                  type="number" 
                  className="w-24 text-right"
                />
                <span className="text-sm text-foreground">MB</span>
                <span className="text-xs text-muted-foreground ml-2">(최대 2000MB)</span>
              </FlexBox>
            </FlexBox>

            <FlexBox className="gap-6 items-start">
              <div className="w-[180px]">
                <Label className="text-sm text-muted-foreground">게시글 본문 최대 용량</Label>
              </div>
              <FlexBox className="items-center gap-2">
                <Input 
                  name="maxBodySize" 
                  value={formData.maxBodySize} 
                  onChange={handleChange} 
                  type="number" 
                  className="w-24 text-right"
                />
                <span className="text-sm text-foreground">MB</span>
              </FlexBox>
            </FlexBox>
          </div>
        </section>

        {/* 휴지통 설정 */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-foreground">휴지통 보관 설정</h3>
          <div className="rounded-md border border-border bg-card p-6 shadow-sm">
            <FlexBox className="gap-6 items-start">
              <div className="w-[180px]">
                <Label className="text-sm text-muted-foreground">자동 영구 삭제 기한</Label>
              </div>
              <div>
                <RadioGroup 
                  value={formData.trashRetentionDays} 
                  onValueChange={(v) => setFormData(p => ({...p, trashRetentionDays: v}))}
                  className="flex flex-col gap-4"
                >
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="15" />
                    <span className="text-sm font-medium">15일 후 영구 삭제</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="30" />
                    <span className="text-sm font-medium">30일 후 영구 삭제 (보통)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="60" />
                    <span className="text-sm font-medium">60일 후 영구 삭제</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="INF" />
                    <span className="text-sm font-medium">자동 삭제 안 함 (영구 보관)</span>
                  </label>
                </RadioGroup>
                <div className="mt-3 text-xs text-muted-foreground bg-muted p-2 rounded-sm border border-border/50">
                  휴지통에 버려진 게시글이 지정된 기간을 초과하면 디스크에서 영구적으로 파기됩니다.
                </div>
              </div>
            </FlexBox>
          </div>
        </section>

        {/* 일반 권한 */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-foreground">권한 위임</h3>
          <div className="rounded-md border border-border bg-card p-6 shadow-sm">
            <FlexBox className="gap-6 items-start">
              <div className="w-[180px]">
                <Label className="text-sm text-muted-foreground">게시판 마스터의 용량/기간 변경 권한</Label>
              </div>
              <FlexBox className="items-center gap-3">
                <Switch 
                  checked={formData.allowMasterChangeYn === "Y"} 
                  onCheckedChange={(c) => setFormData(p => ({...p, allowMasterChangeYn: c ? "Y" : "N"}))} 
                />
                <span className="text-sm text-muted-foreground">
                  {formData.allowMasterChangeYn === "Y" ? "허용함 (마스터가 스스로 설정 변경 가능)" : "허용 안함 (최고 관리자만 변경 가능)"}
                </span>
              </FlexBox>
            </FlexBox>
          </div>
        </section>

      </div>

      <div className="mt-8 flex justify-end gap-3 border-t border-border pt-4">
        <Button variant="outline" onClick={() => window.location.reload()}>취소</Button>
        <Button variant="blue" onClick={handleSave} disabled={mutation.isPending}>
          {mutation.isPending ? "저장 중..." : "저장하기"}
        </Button>
      </div>
    </div>
  );
};
