import { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, FlexBox, Icons, RHF } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useAlertStore } from "@shared/store/useAlertStore";
import { FormProvider, useForm } from "react-hook-form";
import { FormDialog, DataTable } from "@repo/ui";
import { systemApi, systemPlansApi, type OfficeVO, type PlanUserVO, type PlanVO } from "@shared/api/system/systemApi";
import type { ColumnDef } from "@tanstack/react-table";
import { buildMenuTree, collectDescendantSeqs, flattenMenuTree, type MenuTreeNode } from "@shared/util/menuTree";
import { BoxTab } from "@shared/ui/tab/ui/Tabs";
import { OfficeSelectModal } from "@pages/settings/system/modal/OfficeSelectModal";

// ─── 상수 ────────────────────────────────────────────────

type DispTabType = "GNB" | "ICON_SIDEBAR";
const DISP_TABS: { value: DispTabType; label: string }[] = [
  { value: "GNB", label: "GNB 메뉴" },
  { value: "ICON_SIDEBAR", label: "아이콘 메뉴" },
];

// ─── 컬럼 정의 ──────────────────────────────────────────

const PLAN_COLUMNS: ColumnDef<PlanVO>[] = [
  { accessorKey: "planNm", header: "플랜명", size: 110 },
  { accessorKey: "planCd", header: "코드", size: 90 },
  {
    accessorKey: "officeCount", header: "사무소", size: 50,
    cell: ({ getValue }) => <div className="text-right pr-2">{(getValue() as number) ?? 0}</div>,
  },
  {
    accessorKey: "userCount", header: "사용자", size: 50,
    cell: ({ getValue }) => <div className="text-right pr-2">{(getValue() as number) ?? 0}</div>,
  },
  {
    accessorKey: "menuCount", header: "메뉴", size: 50,
    cell: ({ getValue }) => <div className="text-right pr-2">{(getValue() as number) ?? 0}</div>,
  },
];

const OFFICE_COLUMNS: ColumnDef<OfficeVO>[] = [
  { accessorKey: "officeShortName", header: "사무소명", size: 220 },
  {
    accessorKey: "officeAuthYn", header: "사업자 인증", size: 90,
    cell: ({ getValue }) => {
      const v = getValue() as string;
      return <div className={`text-center ${v === "Y" ? "text-p-color-1" : "text-text-200"}`}>{v ?? "N"}</div>;
    },
  },
];

const USER_COLUMNS: ColumnDef<PlanUserVO>[] = [
  { accessorKey: "officeShortName", header: "소속 회사", size: 140 },
  { accessorKey: "userNameKo", header: "이름", size: 90 },
  {
    accessorKey: "roleName", header: "권한", size: 110,
    cell: ({ getValue }) => {
      const v = getValue() as string;
      return <div className="text-text-200 text-center">{v ?? "-"}</div>;
    },
  },
  { accessorKey: "userEmail", header: "이메일", size: 180 },
];

// ─── 스타일 ──────────────────────────────────────────────

const TAB_BASE = "border-b-2 px-3 py-1 text-xs font-medium -mb-px";
const TAB_ACTIVE = `${TAB_BASE} border-p-color-1 text-p-color-1`;
const TAB_INACTIVE = `${TAB_BASE} border-transparent text-muted-foreground hover:text-foreground`;
const GRID_H = "h-[calc(100vh-440px)] overflow-auto";
const TREE_H = "h-[calc(100vh-470px)] overflow-auto";
const UNIT_PINK = "[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5 inset-shadow-none";

// ─── 메뉴 사용 트리 컴포넌트 (단일 체크박스 — 사용/미사용) ────

interface PlanMenuRowProps {
  node: MenuTreeNode;
  depth: number;
  enabled: Set<string>;
  collapsed: Record<string, boolean>;
  onToggleCollapse: (menuSeq: string) => void;
  onToggleNode: (menuSeq: string) => void;
}

const PlanMenuRow = ({
  node, depth, enabled, collapsed, onToggleCollapse, onToggleNode,
}: PlanMenuRowProps) => {
  const checked = enabled.has(node.menu.menuSeq);
  const hasChildren = node.children.length > 0;
  const isCollapsed = collapsed[node.menu.menuSeq];
  const indentPx = 12 + depth * 20;
  const isRoot = depth === 0;

  return (
    <>
      <div
        className={`group flex items-center border-b border-border-200 transition-colors py-1 hover:bg-p-color-1/5 ${
          isRoot ? "bg-bg-100/40 dark:bg-background-color/30 font-medium text-text" : "text-muted-foreground"
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5" style={{ paddingLeft: indentPx }}>
          {hasChildren ? (
            <button
              type="button"
              onClick={() => onToggleCollapse(node.menu.menuSeq)}
              aria-label={isCollapsed ? "펼치기" : "접기"}
              className="flex size-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-p-color-1/10"
            >
              <Icons.ChevronRight
                className={`size-3.5 transition-transform duration-150 ${isCollapsed ? "" : "rotate-90"}`}
              />
            </button>
          ) : (
            <span className="size-5 shrink-0" />
          )}
          <span className="truncate text-sm">{node.menu.menuNm}</span>
        </div>
        <div className="flex w-24 shrink-0 justify-center">
          <Checkbox
            checked={checked}
            onCheckedChange={() => onToggleNode(node.menu.menuSeq)}
            size="sm"
          />
        </div>
      </div>

      {!isCollapsed && hasChildren && node.children.map((child) => (
        <PlanMenuRow
          key={child.menu.menuSeq}
          node={child}
          depth={depth + 1}
          enabled={enabled}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          onToggleNode={onToggleNode}
        />
      ))}
    </>
  );
};

const PlanMenuTree = ({
  tree, enabled, onToggle, onToggleAll,
}: {
  tree: MenuTreeNode[];
  enabled: Set<string>;
  onToggle: (menuSeq: string) => void;
  onToggleAll: () => void;
}) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCollapsed((prev) => {
      const next = { ...prev };
      tree.forEach((root) => {
        if (next[root.menu.menuSeq] === undefined) next[root.menu.menuSeq] = true;
      });
      return next;
    });
  }, [tree]);

  const toggleCollapse = (seq: string) =>
    setCollapsed((prev) => ({ ...prev, [seq]: !prev[seq] }));

  const allExpanded = tree.every((t) => !collapsed[t.menu.menuSeq]);
  const toggleAllExpand = () => {
    const val = allExpanded;
    setCollapsed((prev) => {
      const next = { ...prev };
      tree.forEach((t) => { next[t.menu.menuSeq] = val; });
      return next;
    });
  };

  const allMenusInTab = useMemo(() => flattenMenuTree(tree), [tree]);
  const allChecked = allMenusInTab.length > 0 && allMenusInTab.every((m) => enabled.has(m.menuSeq));

  return (
    <div className="overflow-hidden rounded-md border border-border-200 dark:border-input">
      {/* 헤더 */}
      <div className="flex items-center border-b border-border-200 bg-bg-100 dark:border-input dark:bg-background-color/40 py-1.5 text-xs font-semibold text-text-100">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 pl-3">
          <button
            type="button"
            onClick={toggleAllExpand}
            aria-label={allExpanded ? "모두 접기" : "모두 펼치기"}
            className="flex size-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-p-color-1/10"
          >
            <Icons.ChevronRight
              className={`size-3.5 transition-transform duration-150 ${allExpanded ? "rotate-90" : ""}`}
            />
          </button>
          <span>메뉴명</span>
        </div>
        <div className="flex w-24 shrink-0 items-center justify-center gap-1.5">
          <span>사용</span>
          <Checkbox checked={allChecked} onCheckedChange={onToggleAll} size="sm" />
        </div>
      </div>

      {/* 재귀 트리 */}
      <div className={`${TREE_H} bg-white dark:bg-transparent`}>
        {tree.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">표시할 메뉴가 없습니다.</p>
        ) : (
          tree.map((root) => (
            <PlanMenuRow
              key={root.menu.menuSeq}
              node={root}
              depth={0}
              enabled={enabled}
              collapsed={collapsed}
              onToggleCollapse={toggleCollapse}
              onToggleNode={onToggle}
            />
          ))
        )}
      </div>
    </div>
  );
};

// ─── 메인 컴포넌트 ───────────────────────────────────────

const PlanMngList = () => {
  const { openAlert } = useAlertStore();
  const form = useForm({ defaultValues: { searchKeyword: "", planCd: "", planNm: "", useYn: "Y", note: "" } });
  const planForm = useForm<PlanVO>();

  // ── API ────────────────────────────────────────────────

  const { data: plans = [] } = systemPlansApi.useList();
  // 플랜 관리 — 어떤 메뉴를 어떤 플랜에 묶을지 정해야 하므로 super_admin_only 포함 전체 메뉴 필요
  const { data: allMenus = [] } = systemApi.menus.useList({ all: true });
  const saveMut = systemPlansApi.useSave();
  const deleteMut = systemPlansApi.useDelete();
  const saveMenusMut = systemPlansApi.useSaveMenus();
  const assignOfficeMut = systemPlansApi.useAssignOffice();

  // ── 상태 ───────────────────────────────────────────────

  const [selected, setSelected] = useState<PlanVO | null>(null);
  const [tab, setTab] = useState<"menu" | "office" | "user">("menu");
  const [dispTab, setDispTab] = useState<DispTabType>("GNB");
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [officeModalOpen, setOfficeModalOpen] = useState(false);
  const [enabled, setEnabled] = useState<Set<string>>(new Set());

  const { data: allowedSeqs } = systemPlansApi.useAllowedMenus(selected?.planSeq || "");
  const { data: planOffices = [] } = systemPlansApi.usePlanOffices(selected?.planSeq || "");
  const { data: planUsersRaw = [] } = systemPlansApi.usePlanUsers(selected?.planSeq || "");
  // 그리드 정렬: 소속회사 → 이름 → 권한 (가나다순, 미배정은 뒤로)
  const planUsers = useMemo(() => {
    const col = new Intl.Collator("ko-KR");
    const cmp = (a?: string, b?: string) => {
      const av = a ?? ""; const bv = b ?? "";
      if (!av && !bv) return 0;
      if (!av) return 1;
      if (!bv) return -1;
      return col.compare(av, bv);
    };
    return [...planUsersRaw].sort((a, b) =>
      cmp(a.officeShortName, b.officeShortName) ||
      cmp(a.userNameKo,      b.userNameKo) ||
      cmp(a.roleName,        b.roleName),
    );
  }, [planUsersRaw]);

  // ── 트리 ───────────────────────────────────────────────
  // 플랜은 일반 사무소용이므로 슈퍼어드민 전용 메뉴(super_admin_only='Y')는 제외
  const menuTree = useMemo(
    () => buildMenuTree(
      allMenus.filter((m) => m.superAdminOnly !== "Y"),
      { dispType: dispTab, excludeDisabled: true },
    ),
    [allMenus, dispTab],
  );

  // ── 플랜 선택 ──────────────────────────────────────────

  const selectPlan = (plan: PlanVO | null) => {
    setSelected(plan);
    if (plan) {
      form.setValue("planCd", plan.planCd);
      form.setValue("planNm", plan.planNm);
      form.setValue("useYn", plan.useYn || "Y");
      form.setValue("note", plan.note || "");
    } else {
      form.reset({ searchKeyword: form.getValues("searchKeyword"), planCd: "", planNm: "", useYn: "Y", note: "" });
      setEnabled(new Set());
    }
  };

  // ── 초기 선택 + 메뉴 권한 동기화 ──────────────────────

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (plans.length > 0 && !selected) selectPlan(plans[0]);
  }, [plans]);

  useEffect(() => {
    if (allowedSeqs) setEnabled(new Set(allowedSeqs));
  }, [allowedSeqs]);

  // ── 메뉴 토글 ────────────────────────────────────────
  // 노드 클릭 → 자기 + 모든 자손까지 N-level 캐스케이드
  const togglePerm = (menuSeq: string) => {
    const findNode = (nodes: MenuTreeNode[]): MenuTreeNode | null => {
      for (const n of nodes) {
        if (n.menu.menuSeq === menuSeq) return n;
        const found = findNode(n.children);
        if (found) return found;
      }
      return null;
    };
    const node = findNode(menuTree);
    const targets = new Set<string>([menuSeq, ...(node ? collectDescendantSeqs(node) : [])]);
    setEnabled((prev) => {
      const next = new Set(prev);
      const willEnable = !prev.has(menuSeq);
      targets.forEach((s) => { willEnable ? next.add(s) : next.delete(s); });
      return next;
    });
  };

  // 헤더 select-all → 현재 탭 전체 토글
  const toggleAll = () => {
    const tabSeqs = flattenMenuTree(menuTree).map((m) => m.menuSeq);
    const allOn = tabSeqs.every((s) => enabled.has(s));
    setEnabled((prev) => {
      const next = new Set(prev);
      tabSeqs.forEach((s) => { allOn ? next.delete(s) : next.add(s); });
      return next;
    });
  };

  // ── 핸들러 ────────────────────────────────────────────

  const handleSavePlan = () => {
    if (!selected) return;
    const { planCd, planNm, useYn, note } = form.getValues();
    if (!planCd || !planNm) return openAlert({ message: "플랜 코드와 플랜명을 입력해주세요." });

    const payload: PlanVO = { ...selected, planCd, planNm, note, useYn: useYn as "Y" | "N" };
    saveMut.mutate(payload, {
      onSuccess: () => { setSelected(payload); openAlert({ message: "저장되었습니다." }); },
      onError: () => openAlert({ message: "저장에 실패했습니다." }),
    });
  };

  const handleDeletePlan = () => {
    if (!selected) return;
    openAlert({
      message: `"${selected.planNm}" 플랜을 삭제하시겠습니까?`, type: "confirm",
      onConfirm: () => deleteMut.mutate(selected.planSeq, {
        onSuccess: () => { selectPlan(null); openAlert({ message: "삭제되었습니다." }); },
        onError: (e: any) => openAlert({ message: getErrMsg(e, "삭제에 실패했습니다.") }),
      }),
    });
  };

  const handleSaveMenus = () => {
    if (!selected) return;
    saveMenusMut.mutate({ planSeq: selected.planSeq, menuSeqs: Array.from(enabled) }, {
      onSuccess: () => openAlert({ message: `저장되었습니다. (${enabled.size}개 메뉴 허용)` }),
      onError: () => openAlert({ message: "저장에 실패했습니다." }),
    });
  };

  const getErrMsg = (e: any, fallback: string) => {
    const msg = e?.message || e?.response?.data?.message;
    return msg && typeof msg === "string" && msg !== "Request failed with status code 500" ? msg : fallback;
  };

  const handleCreatePlan = async (data: PlanVO) => {
    await saveMut.mutateAsync(data);
    setPlanModalOpen(false);
  };

  const handleAssignOffices = async (officeSeqs: string[]) => {
    if (!selected || officeSeqs.length === 0) return;
    // 일부 실패해도 나머지는 진행 (Promise.allSettled)
    const results = await Promise.allSettled(
      officeSeqs.map((officeSeq) =>
        assignOfficeMut.mutateAsync({ officeSeq, planSeq: selected.planSeq }),
      ),
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const fail = results.length - ok;
    if (fail === 0) {
      openAlert({ message: `${ok}개 사무소가 추가되었습니다.` });
    } else if (ok === 0) {
      openAlert({ message: `사무소 추가에 실패했습니다. (실패 ${fail}건)` });
    } else {
      openAlert({ message: `완료: ${ok}건 / 실패: ${fail}건` });
    }
  };

  // ── 검색 ──────────────────────────────────────────────

  const keyword = form.watch("searchKeyword");
  const filteredPlans = keyword
    ? plans.filter((p) =>
        p.planNm.toLowerCase().includes(keyword.toLowerCase()) ||
        p.planCd.toLowerCase().includes(keyword.toLowerCase()),
      )
    : plans;

  // ── 렌더링 ────────────────────────────────────────────

  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <PageTitleArea className="pb-2" title="플랜 관리" />

        <FlexBox className="gap-4">
          {/* 좌측: 플랜 목록 */}
          <section className="w-[30%]">
            <FormUnitBox title="플랜 목록" className={UNIT_PINK} vertical>
              <FlexBox className="justify-between pb-2">
                <RHF.Input control={form.control} name="searchKeyword" placeholder="플랜명/코드 검색" orientation="horizontal" className="w-40" />
                <Button size="h28" variant="outline-pink" onClick={() => { planForm.reset({} as PlanVO); setPlanModalOpen(true); }}>
                  <Icons.Plus className="size-3.5" /> 신규 플랜
                </Button>
              </FlexBox>
              <DataTable
                data={filteredPlans}
                columns={PLAN_COLUMNS}
                className="h-[calc(100vh-265px)] overflow-auto"
                onRowClick={(_row, item) => selectPlan(item)}
                getRowId={(row) => row.planSeq}
                enableRowSelection={false}
                rowSelection={selected ? { [selected.planSeq]: true } : {}}
              />
            </FormUnitBox>
          </section>

          {/* 우측 */}
          <section className="flex min-w-0 flex-1 flex-col gap-4">
            {/* 플랜 정보 */}
            <FormUnitBox title="플랜 정보" className="inset-shadow-none" vertical>
              {selected ? (
                <>
                  <FlexBox className="items-end gap-2">
                    <RHF.Input control={form.control} name="planCd" label="플랜 코드" disabled className="w-48" />
                    <RHF.Input control={form.control} name="planNm" label="플랜명" noSpace={false} />
                    <RHF.FormSelect control={form.control} name="useYn" items={[{ label: "Y", value: "Y" }, { label: "N", value: "N" }]} label="사용여부" disabled />
                    <Button size="h28" variant="blue" onClick={handleSavePlan} className="shrink-0">
                      <Icons.CloudUpload className="size-3.5" /> 저장
                    </Button>
                    <Button size="h28" variant="outline-pink" onClick={handleDeletePlan} className="shrink-0">
                      <Icons.Trash2 className="size-3.5" /> 삭제
                    </Button>
                  </FlexBox>
                  <RHF.FormTextarea control={form.control} name="note" label="비고" className="min-h-[60px]" />
                </>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">좌측에서 플랜을 선택해주세요.</p>
              )}
            </FormUnitBox>

            {/* 플랜 설정 (탭) */}
            <FormUnitBox title="플랜 설정" className="inset-shadow-none" vertical>
              <div className="flex items-center justify-between pb-2">
                <div className="flex gap-0 border-b">
                  <button type="button" onClick={() => setTab("menu")} className={tab === "menu" ? TAB_ACTIVE : TAB_INACTIVE}>메뉴 권한</button>
                  <button type="button" onClick={() => setTab("office")} className={tab === "office" ? TAB_ACTIVE : TAB_INACTIVE}>사무소 ({planOffices.length})</button>
                  <button type="button" onClick={() => setTab("user")} className={tab === "user" ? TAB_ACTIVE : TAB_INACTIVE}>사용자 ({planUsers.length})</button>
                </div>

                <div className="flex gap-1">
                  {tab === "menu" && selected && (
                    <Button size="h28" variant="blue" onClick={handleSaveMenus} disabled={saveMenusMut.isPending}>
                      <Icons.CloudUpload className="size-3.5" /> 저장
                    </Button>
                  )}
                  {tab === "office" && selected && (
                    <Button size="h28" variant="blue" onClick={() => setOfficeModalOpen(true)}>
                      <Icons.Plus className="size-3.5" /> 사무소 추가
                    </Button>
                  )}
                </div>
              </div>

              {!selected ? (
                <p className={`flex ${GRID_H} items-center justify-center text-sm text-muted-foreground`}>좌측에서 플랜을 선택해주세요.</p>
              ) : tab === "menu" ? (
                <>
                  <BoxTab
                    items={DISP_TABS}
                    active={dispTab}
                    onClick={(v) => setDispTab(v as DispTabType)}
                    className="mb-2"
                  />
                  <PlanMenuTree
                    tree={menuTree}
                    enabled={enabled}
                    onToggle={togglePerm}
                    onToggleAll={toggleAll}
                  />
                </>
              ) : tab === "office" ? (
                <DataTable
                  data={planOffices} columns={OFFICE_COLUMNS} className={GRID_H}
                  getRowId={(row) => row.officeSeq}
                  enableRowSelection={false}
                />
              ) : (
                <DataTable
                  data={planUsers} columns={USER_COLUMNS} className={GRID_H}
                  getRowId={(row) => row.userMstSeq}
                  enableRowSelection={false}
                />
              )}
            </FormUnitBox>
          </section>
        </FlexBox>
      </form>

      {/* 신규 플랜 모달 */}
      <FormProvider {...planForm}>
        <FormDialog open={planModalOpen} onOpenChange={setPlanModalOpen} title="플랜 등록" onSubmit={() => planForm.handleSubmit(handleCreatePlan)()}>
          <div className="grid gap-4 py-4">
            <RHF.Input control={planForm.control} name="planCd" label="플랜 코드" rules={{ required: "플랜 코드는 필수입니다." }} />
            <RHF.Input control={planForm.control} name="planNm" label="플랜명" noSpace={false} rules={{ required: "플랜명은 필수입니다." }} />
            <RHF.Input control={planForm.control} name="note" label="비고" />
          </div>
        </FormDialog>
      </FormProvider>

      {/* 사무소 선택 모달 — 모든 사무소 + 현재 플랜 표시 (재배정 가능) */}
      <OfficeSelectModal
        title="플랜에 추가/이동할 사무소 선택"
        open={officeModalOpen}
        onOpenChange={setOfficeModalOpen}
        onConfirm={handleAssignOffices}
        currentPlanSeq={selected?.planSeq}
      />
    </FormProvider>
  );
};

export default PlanMngList;
