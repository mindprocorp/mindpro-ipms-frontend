import { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, FlexBox, Icons, Checkbox } from "@repo/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boardConfigQueries } from "@shared/query/board/boardConfigQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore";
import type { BoardConfig, BoardConfigReq, BoardPermissionTarget } from "@shared/api/board/boardConfigApi.ts";
import type { BoardListResponse } from "@shared/api/board/boardApi.ts";
import type { ApiResponse } from "@shared/commonType.ts";
import TargetTable from "@pages/settings/form/detail/_common/TargetTable";
import { employeeApi } from "@shared/api/organization/employeeApi";
import { orgApi } from "@shared/api/organization/orgApi";
import { apiClient } from "@shared/api/client";

interface BoardConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: BoardConfig | null;
  existingItems?: BoardConfig[];
}

export const BoardConfigModal = ({ open, onOpenChange, data, existingItems }: BoardConfigModalProps) => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlertStore();
  const [formData, setFormData] = useState<BoardConfig>({
    boardName: "",
    description: "",
    shareScope: "ALL",
    adminWriteOnlyYn: "N",
    newPostAlertYn: "Y",
    boardType: "BOARD",
    parentSeq: null,
  });

  // const [tagInput, setTagInput] = useState("");
  // const [tags, setTags] = useState<string[]>([]);

  const [writeAuthMode, setWriteAuthMode] = useState<"N" | "Y">("N");
  const [readAuthMode, setReadAuthMode] = useState<"N" | "Y">("N");
  const [permissions, setPermissions] = useState<BoardPermissionTarget[]>([]);

  const { data: treeRes } = useQuery(boardConfigQueries.getList({ pageSize: 200 }));
  const categories: BoardConfig[] = (treeRes?.data?.list || []).filter(
    (item: BoardConfig) => item.boardType === "CATEGORY"
  );

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const createMutation = useMutation(boardConfigQueries.createConfig());
  const updateMutation = useMutation(boardConfigQueries.updateConfig());

  const isEdit = !!data?.configSeq;

  useEffect(() => {
    if (!open) return;
    setIsCategoryOpen(false);

    if (data?.configSeq) {
      setFormData({ ...data });
      const rawPerms = data.permissions ?? [];
      setWriteAuthMode(rawPerms.some((p) => p.targetRole === "WRITE_AUTH") ? "Y" : "N");
      setReadAuthMode(rawPerms.some((p) => p.targetRole === "READ_AUTH") ? "Y" : "N");
      setPermissions(rawPerms);

      // 백엔드가 refName/refDept를 반환하지 않는 경우 직원·부서 API로 보완
      const needsEnrichment = rawPerms.some((p) => p.refSeq && !p.refName);
      if (needsEnrichment) {
        (async () => {
          const enriched: BoardPermissionTarget[] = rawPerms.map((p) => ({ ...p }));

          if (rawPerms.some((p) => p.targetType === "EMPLOYEE")) {
            const employees = await employeeApi(apiClient).getList({ userNameKo: "" }).catch(() => []);
            const empMap = new Map<string, typeof employees[number]>();
            employees.forEach((e) => {
              if (e.userInfoSeq) empMap.set(e.userInfoSeq, e);
              if (e.userMstSeq) empMap.set(e.userMstSeq, e);
            });
            enriched.forEach((p, i) => {
              if (p.targetType === "EMPLOYEE" && !p.refName && p.refSeq) {
                const emp = empMap.get(p.refSeq);
                if (emp) enriched[i] = {
                  ...p,
                  refName: emp.userNameKo,
                  refDept: emp.officeEmployeeDept || emp.deptName || "",
                  refPosition: emp.officeEmployeePosition || emp.userPosition || "",
                };
              }
            });
          }

          if (rawPerms.some((p) => p.targetType === "DEPT")) {
            const depts = await orgApi(apiClient).getDeptTree().catch(() => []);
            const deptMap = new Map(depts.map((d) => [d.deptSeq, d]));
            enriched.forEach((p, i) => {
              if (p.targetType === "DEPT" && !p.refDept && p.refSeq) {
                const dept = deptMap.get(p.refSeq);
                if (dept) enriched[i] = { ...p, refName: dept.deptName, refDept: dept.deptName };
              }
            });
          }

          setPermissions(enriched);
        })();
      }
    } else {
      setFormData({
        boardName: "",
        description: "",
        shareScope: "ALL",
        adminWriteOnlyYn: "N",
        newPostAlertYn: "Y",
        boardType: "BOARD",
        parentSeq: data?.parentSeq || null,
      });
      setWriteAuthMode("N");
      setReadAuthMode("N");
      setPermissions([]);
    }
  }, [open, data]);

  const handleSave = () => {
    if (!formData.boardName?.trim()) {
      openAlert({ message: "게시판명을 입력해주세요.", showCancel: false });
      return;
    }

    const isDuplicate = existingItems?.some(
      (item) => item.boardType !== "CATEGORY" && item.boardName === formData.boardName?.trim() && item.configSeq !== formData.configSeq
    );
    if (isDuplicate) {
      openAlert({ message: "이미 사용 중인 게시판명입니다.", showCancel: false });
      return;
    }

    const payload: BoardConfigReq = {
      boardConfig: {
        ...formData,
        // prefixTags: tags.join(","),
      },
      masters: [],
      permissions: [
        ...(writeAuthMode === "Y" ? permissions.filter((p) => p.targetRole === "WRITE_AUTH") : []),
        ...(readAuthMode === "Y" ? permissions.filter((p) => p.targetRole === "READ_AUTH") : []),
      ],
    };

    const mutation = isEdit ? updateMutation : createMutation;

    mutation.mutate(payload, {
      onSuccess: () => {
        openAlert({
          message: isEdit ? "게시판 정보가 수정되었습니다." : "게시판이 생성되었습니다.",
          confirmText: "확인",
          showCancel: false,
        });
        queryClient.invalidateQueries({ queryKey: ["boardConfig"] });
        queryClient.invalidateQueries({ queryKey: ["board", "main"] });
        if (isEdit && formData.configSeq && formData.boardName) {
          const newName = formData.boardName;
          const configSeq = formData.configSeq;
          const updateBoardName = (old: ApiResponse<BoardListResponse> | undefined) => {
            if (!old?.data?.list) return old;
            const list = old.data.list.map((p) =>
              p.category?.code === configSeq ? { ...p, category: { ...p.category, codeName: newName } } : p
            );
            return { ...old, data: { ...old.data, list } };
          };
          queryClient.setQueriesData({ queryKey: ["board", "list"] }, updateBoardName);
          queryClient.setQueriesData({ queryKey: ["board", "recent"] }, updateBoardName);
          queryClient.invalidateQueries({ queryKey: ["board", "list"] });
          queryClient.invalidateQueries({ queryKey: ["board", "recent"] });
        }
        onOpenChange(false);
      },
      onError: () => openAlert({ message: "저장에 실패했습니다.", confirmText: "확인", showCancel: false })
    });
  };

  // const handleAddTag = () => {
  //   if (tagInput.trim() && !tags.includes(tagInput.trim())) {
  //     setTags([...tags, tagInput.trim()]);
  //     setTagInput("");
  //   }
  // };

  // const removeTag = (tag: string) => {
  //   setTags(tags.filter(t => t !== tag));
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{isEdit ? "게시판 수정" : "게시판 추가"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 p-6">
          <div className="grid grid-cols-[140px_1fr] items-center">
            <span className="text-sm font-semibold text-foreground">소속 카테고리</span>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2 font-normal"
                onClick={() => setIsCategoryOpen((v) => !v)}
              >
                {formData.parentSeq
                  ? <Icons.Folder className="size-4 text-amber-400 shrink-0" />
                  : <Icons.ClipboardList className="size-4 text-muted-foreground shrink-0" />}
                <span className="flex-1 text-left">
                  {formData.parentSeq
                    ? (categories.find((c) => c.configSeq === formData.parentSeq)?.boardName ?? "폴더 선택")
                    : "최상위 (폴더 없음)"}
                </span>
                <Icons.ChevronDown className="size-4 text-muted-foreground shrink-0" />
              </Button>
              {isCategoryOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md text-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start gap-2 font-normal"
                    onClick={() => { setFormData({ ...formData, parentSeq: null }); setIsCategoryOpen(false); }}
                  >
                    <Icons.ClipboardList className="size-4 text-slate-400" />
                    최상위 (폴더 없음)
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat.configSeq}
                      type="button"
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                      onClick={() => { setFormData({ ...formData, parentSeq: cat.configSeq }); setIsCategoryOpen(false); }}
                    >
                      <Icons.Folder className="size-4 text-amber-400" />
                      {cat.boardName}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-start">
            <label className="text-sm font-semibold mt-2 text-foreground">게시판 명</label>
            <div>
              <Input
                value={formData.boardName}
                onChange={(e) => setFormData({ ...formData, boardName: e.target.value.substring(0, 60) })}
                placeholder="게시판 명을 입력해 주세요."
                className="h-10 border-input"
              />
              <div className="text-right text-xs text-muted-foreground mt-1">{formData.boardName?.length || 0}/60</div>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-start">
            <label className="text-sm font-semibold mt-2 text-foreground">게시판 설명</label>
            <div>
              <textarea
                className="flex min-h-[80px] w-full resize-none rounded-[4px] border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background placeholder:text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value.substring(0, 300) })}
                placeholder="게시판 설명을 입력해 주세요."
              />
              <div className="text-right text-xs text-muted-foreground mt-1">{formData.description?.length || 0}/300</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-border pb-6">
            <label className="text-sm font-semibold mt-2 text-foreground">작성 권한</label>
            <div className="flex flex-col gap-3">
              <FlexBox className="gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="write"
                    checked={writeAuthMode === "N"}
                    onChange={() => {
                      setWriteAuthMode("N");
                      setPermissions((p) => p.filter((t) => t.targetRole !== "WRITE_AUTH"));
                    }}
                  /> 모두 허용
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="write"
                    checked={writeAuthMode === "Y"}
                    onChange={() => setWriteAuthMode("Y")}
                  /> 대상 지정
                </label>
              </FlexBox>
              {writeAuthMode === "Y" && (
                <div className="w-full min-w-0 overflow-x-auto">
                  <TargetTable
                    targets={permissions as any}
                    onTargetsChange={(t) => setPermissions(t as BoardPermissionTarget[])}
                    role="WRITE_AUTH"
                    label="작성 대상"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-border pb-6">
            <label className="text-sm font-semibold mt-2 text-foreground">열람 권한</label>
            <div className="flex flex-col gap-3">
              <FlexBox className="gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="read"
                    checked={readAuthMode === "N"}
                    onChange={() => {
                      setReadAuthMode("N");
                      setPermissions((p) => p.filter((t) => t.targetRole !== "READ_AUTH"));
                    }}
                  /> 모두 허용
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="read"
                    checked={readAuthMode === "Y"}
                    onChange={() => setReadAuthMode("Y")}
                  /> 대상 지정
                </label>
              </FlexBox>
              {readAuthMode === "Y" && (
                <div className="w-full min-w-0 overflow-x-auto">
                  <TargetTable
                    targets={permissions as any}
                    onTargetsChange={(t) => setPermissions(t as BoardPermissionTarget[])}
                    role="READ_AUTH"
                    label="열람 대상"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 새글 알림 설정 (미구현)
          <div className="grid grid-cols-[140px_1fr] items-start pb-2">
            <label className="text-sm font-semibold mt-1 text-slate-700">새글 알림 설정</label>
            <div className="flex flex-col gap-2">
              <Checkbox
                checked={formData.newPostAlertYn === "Y"}
                onCheckedChange={(val) => setFormData({...formData, newPostAlertYn: val ? "Y" : "N"})}
              />
              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                · 새 게시글이 있을 때 구성원이 알림을 받을지 여부를 설정합니다.
              </p>
            </div>
          </div>
          */}

          {/* 말머리 (미구현)
          <div className="grid grid-cols-[140px_1fr] items-start pb-6">
            <label className="text-sm font-semibold mt-2 text-foreground">말머리</label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  placeholder="말머리 입력 (예: 안내, 필독)"
                  className="flex-1"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                    }
                  }}
                />
                <Button variant="outline" size="h32" onClick={handleAddTag}>추가</Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-slate-50 rounded-md border border-input">
                {tags.length === 0 && <span className="text-xs text-slate-400">등록된 말머리가 없습니다.</span>}
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-white border rounded text-xs text-slate-700 font-medium shadow-sm">
                    {tag}
                    <Icons.X className="size-3 cursor-pointer text-slate-400 hover:text-rose-500" onClick={() => removeTag(tag)} />
                  </span>
                ))}
              </div>
            </div>
          </div>
          */}
        </div>

        <div className="flex justify-end gap-2 border-t border-border p-6 bg-muted/30">
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
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
