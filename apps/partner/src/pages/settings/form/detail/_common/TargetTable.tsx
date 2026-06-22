import { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, CustomScrollArea, DataTable, FormDialog, Icons, Input } from "@repo/ui";
import { UserModal, type SuccessData } from "@pages/common/modal/user/UserModal";
import TeamTree from "@pages/common/modal/user/TeamTree";
import type { ColumnDef } from "@tanstack/react-table";
import type { FormTemplateTargetVO } from "@shared/api/organization/formTemplateApi";
import { orgApi, type DeptVO } from "@shared/api/organization/orgApi";
import { apiClient } from "@shared/api/client";

type IndexedTarget = FormTemplateTargetVO & { _i: number };

type TreeMenu = { title: string; code: string; url: string; items?: TreeMenu[] };

const deptToMenu = (depts: DeptVO[]): TreeMenu[] => {
  const sorted = [...depts].sort((a, b) => Number(a.sortOrd) - Number(b.sortOrd));
  const roots = sorted.filter((d) => !d.parentDeptSeq && d.useYn !== "N");
  const getChildren = (parentSeq: string): TreeMenu[] =>
    sorted
      .filter((d) => d.parentDeptSeq === parentSeq && d.useYn !== "N")
      .map((d) => ({ title: d.deptName, code: d.deptSeq, url: "#", items: getChildren(d.deptSeq) }));
  return roots.map((d) => ({ title: d.deptName, code: d.deptSeq, url: "#", items: getChildren(d.deptSeq) }));
};

interface Props {
  targets: FormTemplateTargetVO[];
  onTargetsChange: (t: FormTemplateTargetVO[]) => void;
  role: string;
  label: string;
}

/**
 * 대상 추가/삭제 테이블 (수신/공유/참조/작성권한/열람권한 공통)
 * - 직원(EMPLOYEE) / 부서(DEPT) 두 가지 타입을 추가할 수 있음
 */
const TargetTable = ({ targets, onTargetsChange, role, label }: Props) => {
  const [userOpen, setUserOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [depts, setDepts] = useState<DeptVO[]>([]);
  const [selectedDeptSeqs, setSelectedDeptSeqs] = useState<Set<string>>(new Set());
  const [navCode, setNavCode] = useState("");
  const [deptSearch, setDeptSearch] = useState("");

  const filtered = useMemo(
    () => targets.map((t, i) => ({ ...t, _i: i })).filter((t) => t.targetRole === role),
    [targets, role],
  );

  const removeTarget = (idx: number) => onTargetsChange(targets.filter((_, i) => i !== idx));

  const columns: ColumnDef<IndexedTarget>[] = useMemo(() => [
    {
      id: "type", header: "구분", size: 50,
      cell: ({ row }) => (
        <span className={`rounded px-1.5 py-0.5 text-[10px] ${row.original.targetType === "DEPT" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300" : "bg-muted text-muted-foreground"}`}>
          {row.original.targetType === "DEPT" ? "부서" : "직원"}
        </span>
      ),
    },
    { id: "name", header: "이름", size: 70, cell: ({ row }) => row.original.targetType === "DEPT" ? "-" : (row.original.refName || row.original.refSeq || "-") },
    { id: "dept", header: "부서", size: 90, cell: ({ row }) => row.original.refDept || "-" },
    { id: "position", header: "직책", size: 60, cell: ({ row }) => (row.original as any).refPosition || "-" },
    {
      id: "delete", header: "", size: 50,
      cell: ({ row }) => (
        <Button size="icon-xs" variant="ghost" onClick={() => removeTarget(row.original._i)}>
          <Icons.Trash2 className="size-3.5 text-muted-foreground" />
        </Button>
      ),
    },
  ], [removeTarget]);

  // 부서 트리 조회 (부서 모달 오픈 시)
  useEffect(() => {
    if (!deptOpen || depts.length) return;
    orgApi(apiClient).getDeptTree().then(setDepts).catch(() => setDepts([]));
  }, [deptOpen]);

  const handleUserSuccess = (rtnData: SuccessData) => {
    if (rtnData.userInfo?.length) {
      const existing = new Set(targets.filter((t) => t.targetRole === role && t.targetType === "EMPLOYEE").map((t) => t.refSeq));
      const newTargets = rtnData.userInfo
        .filter((s) => !existing.has(s.id))
        .map((s) => ({
          targetRole: role,
          targetType: "EMPLOYEE" as const,
          refSeq: s.id,
          refName: s.name,
          refDept: s.team || "",
          refPosition: s.position || "",
          refEmail: s.email || "",
          refMobile: s.mobile || "",
        } as any));
      onTargetsChange([...targets, ...newTargets]);
    }
    setUserOpen(false);
  };

  const handleDeptConfirm = () => {
    const existing = new Set(targets.filter((t) => t.targetRole === role && t.targetType === "DEPT").map((t) => t.refSeq));
    const newTargets = depts
      .filter((d) => selectedDeptSeqs.has(d.deptSeq) && !existing.has(d.deptSeq))
      .map((d) => ({
        targetRole: role,
        targetType: "DEPT" as const,
        refSeq: d.deptSeq,
        refName: d.deptName,
        refDept: d.deptName,
      } as any));
    onTargetsChange([...targets, ...newTargets]);
    setSelectedDeptSeqs(new Set());
    setDeptOpen(false);
  };

  const getAllDescendantSeqs = (parentSeq: string): string[] => {
    const active = depts.filter((d) => d.useYn !== "N");
    const children = active.filter((d) => d.parentDeptSeq === parentSeq);
    return [...children.map((c) => c.deptSeq), ...children.flatMap((c) => getAllDescendantSeqs(c.deptSeq))];
  };

  const syncParents = (seqSet: Set<string>): Set<string> => {
    const active = depts.filter((d) => d.useYn !== "N");
    const result = new Set(seqSet);
    let changed = true;
    while (changed) {
      changed = false;
      for (const parent of active) {
        const children = active.filter((d) => d.parentDeptSeq === parent.deptSeq);
        if (children.length === 0) continue;
        const allChecked = children.every((c) => result.has(c.deptSeq));
        if (allChecked && !result.has(parent.deptSeq)) {
          result.add(parent.deptSeq);
          changed = true;
        } else if (!allChecked && result.has(parent.deptSeq)) {
          result.delete(parent.deptSeq);
          changed = true;
        }
      }
    }
    return result;
  };

  const toggleDept = (seq: string) => {
    setSelectedDeptSeqs((prev) => {
      const next = new Set(prev);
      const descendants = getAllDescendantSeqs(seq);
      if (next.has(seq)) {
        next.delete(seq);
        descendants.forEach((s) => next.delete(s));
      } else {
        next.add(seq);
        descendants.forEach((s) => next.add(s));
      }
      return syncParents(next);
    });
  };

  const menus = useMemo(() => deptToMenu(depts), [depts]);

  const displayDepts = useMemo(() => {
    const active = [...depts].filter((d) => d.useYn !== "N").sort((a, b) => Number(a.sortOrd) - Number(b.sortOrd));
    const rootSeq = navCode || null;
    const withDepth = (parentSeq: string | null, depth: number): { dept: DeptVO; depth: number }[] =>
      active
        .filter((d) => (d.parentDeptSeq || null) === parentSeq)
        .flatMap((d) => [{ dept: d, depth }, ...withDepth(d.deptSeq, depth + 1)]);
    if (!navCode) return withDepth(null, 0);
    const root = active.find((d) => d.deptSeq === rootSeq);
    return root ? [{ dept: root, depth: 0 }, ...withDepth(rootSeq, 1)] : withDepth(null, 0);
  }, [depts, navCode]);

  const navDeptName = useMemo(
    () => (navCode ? depts.find((d) => d.deptSeq === navCode)?.deptName ?? "전체" : "전체"),
    [navCode, depts],
  );

  const filteredDepts = useMemo(() => {
    if (!deptSearch.trim()) return displayDepts;
    const q = deptSearch.trim().toLowerCase();
    return depts
      .filter((d) => d.useYn !== "N" && d.deptName.toLowerCase().includes(q))
      .map((d) => ({ dept: d, depth: 0 }));
  }, [displayDepts, deptSearch, depts]);

  const closeDeptModal = () => {
    setDeptOpen(false);
    setSelectedDeptSeqs(new Set());
    setNavCode("");
    setDeptSearch("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button size="h28" variant="outline" onClick={() => setUserOpen(true)}>
          <Icons.User className="size-3.5" /> 직원 추가
        </Button>
        <Button size="h28" variant="outline" onClick={() => setDeptOpen(true)}>
          <Icons.Building2 className="size-3.5" /> 부서 추가
        </Button>
      </div>
      {filtered.length > 0 && <DataTable height="auto" data={filtered} columns={columns} />}

      <UserModal
        title={`${label} 직원 선택`}
        open={userOpen}
        onOpenChange={setUserOpen}
        multi
        onSuccess={handleUserSuccess}
      />

      <FormDialog
        title={`${label} 부서 선택`}
        onSubmit={handleDeptConfirm}
        submitText="선택"
        open={deptOpen}
        onOpenChange={(v) => { if (!v) closeDeptModal(); }}
        className="max-w-180!"
        bodyFull
      >
        <div className="border-border-100 dark:border-input flex border-y">
          <CustomScrollArea className="border-border-100 dark:border-input h-100 border-r">
            <div className="w-50 p-2">
              <Button
                variant="ghost"
                className="data-[selected=true]:bg-p-color-1/10 data-[selected=true]:text-p-color-1 mb-1 w-full justify-start text-xs"
                data-selected={navCode === ""}
                onClick={() => setNavCode("")}
              >
                <Icons.Users className="size-4" />
                전체
              </Button>
              {menus.map((item, index) => (
                <TeamTree
                  key={item.code + "_" + index}
                  group={item}
                  setCode={setNavCode}
                  activeCode={navCode}
                />
              ))}
              {menus.length === 0 && (
                <p className="text-muted-foreground py-8 text-center text-xs">등록된 조직이 없습니다.</p>
              )}
            </div>
          </CustomScrollArea>

          <CustomScrollArea className="h-100 w-full">
            <div className="flex-1">
              <div className="border-border-100 bg-bg-100 dark:border-input dark:bg-background-color flex items-center justify-between border-b px-4 py-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold">{navDeptName}</h2>
                  <span className="text-text-200 text-xs">총 {filteredDepts.length}개</span>
                </div>
                <div className="relative">
                  <Icons.Search className="text-muted-foreground absolute left-2 top-1/2 size-3.5 -translate-y-1/2" />
                  <Input
                    className="h-7 w-40 pl-7 text-xs"
                    placeholder="부서 검색"
                    value={deptSearch}
                    onChange={(e) => setDeptSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-2">
                {filteredDepts.map(({ dept, depth }) => {
                  const isChecked = selectedDeptSeqs.has(dept.deptSeq);
                  return (
                    <div
                      key={dept.deptSeq}
                      className={`flex cursor-pointer items-center gap-2 rounded-md py-2 pr-3 transition-colors hover:bg-muted ${isChecked ? "bg-blue-50 dark:bg-blue-500/10" : ""}`}
                      style={{ paddingLeft: `${depth * 16 + 12}px` }}
                      onClick={() => toggleDept(dept.deptSeq)}
                    >
                      <Checkbox
                        checked={isChecked}
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={() => toggleDept(dept.deptSeq)}
                      />
                      {depth === 0
                        ? <Icons.Building2 className="size-3.5 shrink-0 text-slate-400" />
                        : <Icons.CornerDownRight className="size-3 shrink-0 text-slate-300" />
                      }
                      <span className={`text-sm ${isChecked ? "font-medium text-blue-700 dark:text-blue-300" : "text-foreground"}`}>
                        {dept.deptName}
                      </span>
                    </div>
                  );
                })}
                {filteredDepts.length === 0 && (
                  <p className="text-muted-foreground py-8 text-center text-xs">
                    {depts.length === 0 ? "부서를 불러오는 중..." : "부서가 없습니다."}
                  </p>
                )}
              </div>
            </div>
          </CustomScrollArea>
        </div>
      </FormDialog>
    </div>
  );
};

export default TargetTable;
