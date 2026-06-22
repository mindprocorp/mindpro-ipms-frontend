import { useEffect, useMemo, useState } from "react";
import { Button, FlexBox, Icons, RHF } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useAlertStore } from "@shared/store/useAlertStore";
import { FormProvider, useForm } from "react-hook-form";
import { Checkbox, FormDialog, DataTable } from "@repo/ui";
import { systemApi, type RoleVO, type RoleMenuMapVO, type RoleUserVO } from "@shared/api/system/systemApi";
import { useRefreshMenus } from "@shared/hooks/useRefreshMenus";
import { UserModal, type SuccessData } from "@pages/common/modal/user/UserModal";
import type { ColumnDef } from "@tanstack/react-table";
import { selectColumn } from "@shared/util/selectColumn";
import { buildMenuTree, collectDescendantSeqs, flattenMenuTree, type MenuTreeNode } from "@shared/util/menuTree";
import { BoxTab } from "@shared/ui/tab/ui/Tabs";

// ─── 상수 ────────────────────────────────────────────────

// 단순화 — 메뉴 사용/미사용만 토글. 내부 저장 시 4-CRUD(canRead/canWrite/canDelete/canExcel) 모두 같은 값.

type DispTabType = "GNB" | "ICON_SIDEBAR";
const DISP_TABS: { value: DispTabType; label: string }[] = [
  { value: "GNB", label: "GNB 메뉴" },
  { value: "ICON_SIDEBAR", label: "아이콘 메뉴" },
];

// ─── 컬럼 정의 ──────────────────────────────────────────

const ROLE_COLUMNS: ColumnDef<RoleVO>[] = [
  { accessorKey: "roleNm", header: "역할명", size: 150 },
  {
    accessorKey: "useYn", header: "사용", size: 50,
    cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>,
  },
];

const USER_COLUMNS: ColumnDef<RoleUserVO>[] = [
  selectColumn<RoleVO>(36),

  { accessorKey: "userNameKo", header: "이름", size: 80 },
  { accessorKey: "officeEmployeeDept", header: "부서", size: 100 },
  { accessorKey: "officeEmployeePosition", header: "직책", size: 80 },
  { accessorKey: "userEmail", header: "이메일", size: 150 },
];

// ─── 스타일 ──────────────────────────────────────────────

const TAB_BASE = "border-b-2 px-4 py-1.5 text-sm font-medium -mb-px";
const TAB_ACTIVE = `${TAB_BASE} border-p-color-1 text-p-color-1`;
const TAB_INACTIVE = `${TAB_BASE} border-transparent text-muted-foreground hover:text-foreground`;
const GRID_H = "h-[calc(100vh-485px)] overflow-auto";
const TREE_H = "h-[calc(100vh-518px)] overflow-auto";
const UNIT_PINK = "[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5 inset-shadow-none";

// 트리 유틸은 @shared/util/menuTree 공통 모듈 사용

// ─── 메뉴 권한 트리 컴포넌트 (N-level 재귀) ─────────────

interface MenuPermRowProps {
  node: MenuTreeNode;
  depth: number;
  permsMap: Map<string, RoleMenuMapVO>;
  collapsed: Record<string, boolean>;
  onToggleCollapse: (menuSeq: string) => void;
  onToggleNode: (menuSeq: string) => void;
}

const MenuPermRow = ({
  node, depth, permsMap, collapsed, onToggleCollapse, onToggleNode,
}: MenuPermRowProps) => {
  const perm = permsMap.get(node.menu.menuSeq);
  const hasChildren = node.children.length > 0;
  const isCollapsed = collapsed[node.menu.menuSeq];
  // depth별 들여쓰기 (depth=0 base 12px, 단계당 +20px)
  const indentPx = 12 + depth * 20;
  const isRoot = depth === 0;

  return (
    <>
      <div
        className={`group flex items-center border-b border-border-200 transition-colors py-2 hover:bg-p-color-1/5 ${
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
            checked={perm?.canRead === "Y"}
            onCheckedChange={() => onToggleNode(node.menu.menuSeq)}
            size="sm"
          />
        </div>
      </div>

      {/* 자식 노드 재귀 렌더 */}
      {!isCollapsed && hasChildren && node.children.map((child) => (
        <MenuPermRow
          key={child.menu.menuSeq}
          node={child}
          depth={depth + 1}
          permsMap={permsMap}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          onToggleNode={onToggleNode}
        />
      ))}
    </>
  );
};

const MenuPermTree = ({
  tree, permsMap, onToggle, onToggleAll, disabled = false,
}: {
  tree: MenuTreeNode[];
  permsMap: Map<string, RoleMenuMapVO>;
  onToggle: (menuSeq: string) => void;
  onToggleAll: () => void;
  disabled?: boolean;
}) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // 트리 변경 시 루트만 기본 접힘 처리 (기존 사용자 펼침 상태 보존)
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
  const toggleAll = () => {
    const val = allExpanded;
    setCollapsed((prev) => {
      const next = { ...prev };
      tree.forEach((t) => { next[t.menu.menuSeq] = val; });
      return next;
    });
  };

  // 현재 탭의 모든 메뉴(자손 포함) — select-all 체크 상태 계산용
  const allMenusInTab = useMemo(() => flattenMenuTree(tree), [tree]);

  return (
    <div
      className={`overflow-hidden rounded-md border border-border-200 dark:border-input ${
        disabled ? "pointer-events-none opacity-60" : ""
      }`}
    >
      {/* 헤더 */}
      <div className="flex items-center border-b border-border-200 bg-bg-100 dark:border-input dark:bg-background-color/40 py-2 text-xs font-semibold text-text-100">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 pl-3">
          <button
            type="button"
            onClick={toggleAll}
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
          <Checkbox
            checked={
              allMenusInTab.length > 0
              && allMenusInTab.every((m) => permsMap.get(m.menuSeq)?.canRead === "Y")
            }
            onCheckedChange={() => onToggleAll()}
            size="sm"
          />
        </div>
      </div>

      {/* 재귀 트리 */}
      <div className={`${TREE_H} bg-white dark:bg-transparent`}>
        {tree.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">표시할 메뉴가 없습니다.</p>
        ) : (
          tree.map((root) => (
            <MenuPermRow
              key={root.menu.menuSeq}
              node={root}
              depth={0}
              permsMap={permsMap}
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

const RoleMngList = () => {
  const { openAlert } = useAlertStore();
  const refreshMenus = useRefreshMenus();
  const form = useForm({ defaultValues: { searchKeyword: "", roleCd: "", roleNm: "", useYn: "Y", note: "" } });
  const roleForm = useForm<RoleVO>();

  // ── API ────────────────────────────────────────────────

  const { data: roles = [] } = systemApi.roles.useList();
  const { data: allMenus = [] } = systemApi.menus.useList();
  const saveMut = systemApi.roles.useSave();
  const deleteMut = systemApi.roles.useDelete();
  const saveMenusMut = systemApi.roles.useSaveRoleMenus();
  const assignMut = systemApi.roles.useAssignUser();
  const removeMut = systemApi.roles.useRemoveUser();

  // ── 상태 ───────────────────────────────────────────────

  const [selected, setSelected] = useState<RoleVO | null>(null);
  const [tab, setTab] = useState<"menu" | "user">("menu");
  const [dispTab, setDispTab] = useState<DispTabType>("GNB");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [checkedUsers, setCheckedUsers] = useState<Record<string, boolean>>({});
  const [menuPerms, setMenuPerms] = useState<RoleMenuMapVO[]>([]);

  const { data: roleMenus = [] } = systemApi.roles.useRoleMenus(selected?.roleSeq || "");
  const { data: roleUsers = [] } = systemApi.roles.useRoleUsers(selected?.roleSeq || "");

  const isSystem = selected?.roleType !== "CUSTOM";

  // ── 트리 / 맵 ─────────────────────────────────────────
  // 슈퍼어드민 전용 메뉴는 일반 역할 화면에서 노출/매핑 금지 (백엔드 saveRoleMenus도 동일 방어)
  const allowedMenus = useMemo(
    () => allMenus.filter((m) => m.superAdminOnly !== "Y"),
    [allMenus],
  );

  // 전체 활성 메뉴 (탭 무관, menuPerms 동기화 베이스)
  const activeMenus = useMemo(
    () => allowedMenus.filter((m) => m.useYn !== "N"),
    [allowedMenus],
  );

  // 현재 탭의 트리 (dispType 분리, dispOrd 정렬, N-level)
  const menuTree = useMemo(
    () => buildMenuTree(allowedMenus, { dispType: dispTab, excludeDisabled: true }),
    [allowedMenus, dispTab],
  );

  const permsMap = useMemo(
    () => new Map(menuPerms.map((p) => [p.menuSeq, p])),
    [menuPerms],
  );

  // ── 역할 선택 ──────────────────────────────────────────

  const selectRole = (role: RoleVO | null) => {
    setSelected(role);
    setCheckedUsers({});
    if (role) {
      form.setValue("roleCd", role.roleCd);
      form.setValue("roleNm", role.roleNm);
      form.setValue("useYn", role.useYn || "Y");
      form.setValue("note", role.note || "");
    } else {
      form.reset({ searchKeyword: form.getValues("searchKeyword"), roleCd: "", roleNm: "", useYn: "Y", note: "" });
      setMenuPerms([]);
    }
  };

  // ── 초기 선택 + 메뉴 권한 동기화 ──────────────────────

  // 역할 목록 로드 후 첫 진입 시에만 첫 역할 자동 선택. selectRole은 closure로 안정적.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (roles.length > 0 && !selected) selectRole(roles[0]);
  }, [roles]);

  // 선택된 역할이 바뀌거나 메뉴/권한 데이터가 바뀌면 menuPerms 재구성.
  // activeMenus는 allMenus 파생이므로 allMenus만 deps에 포함하면 충분.
  useEffect(() => {
    if (!selected || !activeMenus.length) return;
    setMenuPerms(
      activeMenus.map((menu) => {
        const e = roleMenus.find((rm) => rm.menuSeq === menu.menuSeq);
        return {
          menuSeq: menu.menuSeq, roleSeq: selected.roleSeq,
          canRead: e?.canRead || "N", canWrite: e?.canWrite || "N",
          canDelete: e?.canDelete || "N", canExcel: e?.canExcel || "N",
        };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.roleSeq, allMenus, roleMenus]);

  // ── 메뉴 사용 토글 ────────────────────────────────────
  // 단순 사용/미사용 모델 — 4-CRUD 모두 같은 값으로 일괄 설정.
  // 노드 클릭 → 자기 + 모든 자손까지 N-level 캐스케이드.
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
    const current = permsMap.get(menuSeq);
    const newVal: "Y" | "N" = current?.canRead === "Y" ? "N" : "Y";
    setMenuPerms((prev) =>
      prev.map((m) =>
        targets.has(m.menuSeq)
          ? { ...m, canRead: newVal, canWrite: newVal, canDelete: newVal, canExcel: newVal }
          : m,
      ),
    );
  };

  // 헤더 select-all → 현재 탭의 모든 메뉴만 토글 (다른 탭 권한 보존)
  const toggleAll = () => {
    const tabSeqs = new Set(flattenMenuTree(menuTree).map((m) => m.menuSeq));
    const allY = Array.from(tabSeqs).every((seq) => permsMap.get(seq)?.canRead === "Y");
    const newVal: "Y" | "N" = allY ? "N" : "Y";
    setMenuPerms((prev) =>
      prev.map((m) =>
        tabSeqs.has(m.menuSeq)
          ? { ...m, canRead: newVal, canWrite: newVal, canDelete: newVal, canExcel: newVal }
          : m,
      ),
    );
  };

  // ── 핸들러 ────────────────────────────────────────────

  const handleSaveRole = () => {
    if (!selected) return;
    const { roleNm, useYn, note } = form.getValues();
    if (!roleNm) return openAlert({ message: "역할명을 입력해주세요." });

    const payload = { ...selected, roleNm, note, useYn: useYn as "Y" | "N" };
    saveMut.mutate(payload, {
      onSuccess: () => { setSelected(payload); openAlert({ message: "저장되었습니다." }); },
      onError: () => openAlert({ message: "저장에 실패했습니다." }),
    });
  };

  const handleDeleteRole = () => {
    if (!selected) return;
    openAlert({
      message: `"${selected.roleNm}" 역할을 삭제하시겠습니까?`, type: "confirm",
      onConfirm: () => deleteMut.mutate(selected.roleSeq, {
        onSuccess: () => { selectRole(null); openAlert({ message: "삭제되었습니다." }); },
        onError: (e: any) => openAlert({ message: getErrMsg(e, "삭제에 실패했습니다.") }),
      }),
    });
  };

  const handleSaveMenus = () => {
    if (!selected) return;
    saveMenusMut.mutate({ roleSeq: selected.roleSeq, menus: menuPerms }, {
      onSuccess: () => { refreshMenus(); openAlert({ message: "메뉴 권한이 저장되었습니다." }); },
      onError: () => openAlert({ message: "권한 저장에 실패했습니다." }),
    });
  };

  const getErrMsg = (e: any, fallback: string) => {
    const msg = e?.message || e?.response?.data?.message;
    return msg && typeof msg === "string" && msg !== "Request failed with status code 500" ? msg : fallback;
  };

  const handleAssignUsers = async (data: SuccessData) => {
    if (!selected) return;
    setUserModalOpen(false);

    // 같은 역할에 이미 속한 사용자는 무시 (중복 작업 방지)
    const candidates = data.userInfo.filter((u) => u.roleName !== selected.roleNm);
    if (candidates.length === 0) return;

    // 다른 역할에 이미 속한 사용자 식별 → 이동 확인 프롬프트
    const movers = candidates.filter((u) => u.roleName && u.roleName.length > 0);

    const runAssign = async () => {
      const blocked: string[] = [];
      for (const u of candidates) {
        const targetSeq = u.userMstSeq || u.id;
        try {
          await assignMut.mutateAsync({ roleSeq: selected.roleSeq, userMstSeq: targetSeq });
        } catch (e: any) {
          const msg = getErrMsg(e, "");
          if (msg.includes("시스템관리자는 최소 1명")) {
            blocked.push(`· ${u.name}`);
          } else {
            openAlert({ message: getErrMsg(e, "구성원 추가에 실패했습니다.") });
            return;
          }
        }
      }
      if (blocked.length > 0) {
        openAlert({
          className: "w-[420px]",
          message: `다음 구성원은 단독 시스템관리자라 이동할 수 없습니다.\n\n${blocked.join("\n")}`,
        });
      }
    };

    if (movers.length > 0) {
      const lines = movers.map((u) => `· ${u.name} (현재: ${u.roleName})`).join("\n");
      openAlert({
        className: "w-[420px]",
        type: "confirm",
        message: `다음 구성원이 이미 다른 역할에 속해 있습니다.\n\n${lines}\n\n"${selected.roleNm}"(으)로 이동하시겠습니까?`,
        onConfirm: runAssign,
      });
    } else {
      runAssign();
    }
  };

  const handleRemoveUsers = () => {
    if (!selected) return;
    const seqs = Object.keys(checkedUsers).filter((k) => checkedUsers[k]);
    if (!seqs.length) return openAlert({ message: "제거할 구성원을 선택해주세요." });

    openAlert({
      message: `${seqs.length}명의 구성원을 제거하시겠습니까?`, type: "confirm",
      onConfirm: async () => {
        try {
          for (const id of seqs) {
            await removeMut.mutateAsync({ roleSeq: selected.roleSeq, userMstSeq: id });
          }
          setCheckedUsers({});
        } catch (e: any) {
          openAlert({ message: getErrMsg(e, "제거에 실패했습니다.") });
        }
      },
    });
  };

  const handleCreateRole = async (data: RoleVO) => {
    await saveMut.mutateAsync(data);
    setRoleModalOpen(false);
  };

  // ── 검색 ──────────────────────────────────────────────

  const keyword = form.watch("searchKeyword");
  // 슈퍼어드민 역할은 권한관리 화면에 노출하지 않음 (본사 전용 역할)
  const visibleRoles = roles.filter((r) => r.roleType !== "SUPER_ADMIN");
  const filteredRoles = keyword
    ? visibleRoles.filter((r) => r.roleNm.toLowerCase().includes(keyword.toLowerCase()))
    : visibleRoles;

  // ── 렌더링 ────────────────────────────────────────────

  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <PageTitleArea className="pb-2" title="권한 설정" />

        <FlexBox className="gap-4">
          {/* 좌측: 역할 목록 */}
          <section className="w-[30%]">
            <FormUnitBox title="역할 목록" className={UNIT_PINK} vertical>
              <FlexBox className="justify-between pb-2">
                <RHF.Input control={form.control} name="searchKeyword" placeholder="역할명 검색" orientation="horizontal" className="w-40" />
                <Button size="h28" variant="outline-pink" onClick={() => { roleForm.reset({} as RoleVO); setRoleModalOpen(true); }}>
                  <Icons.Plus className="size-3.5" /> 신규역할
                </Button>
              </FlexBox>
              <DataTable
                data={filteredRoles}
                columns={ROLE_COLUMNS}
                className="h-[calc(100vh-265px)] overflow-auto"
                onRowClick={(_row, item) => selectRole(item)}
                getRowId={(row) => row.roleSeq}
                enableRowSelection={false}
                rowSelection={selected ? { [selected.roleSeq]: true } : {}}
              />
            </FormUnitBox>
          </section>

          {/* 우측 */}
          <section className="flex min-w-0 flex-1 flex-col gap-4">
            {/* 역할 정보 */}
            <FormUnitBox title="역할 정보" className="inset-shadow-none" vertical>
              {selected ? (
                <>
                  <FlexBox className="items-end gap-2">
                    <RHF.Input control={form.control} name="roleCd" label="역할코드" disabled className="w-48" />
                    <RHF.Input control={form.control} name="roleNm" label="역할명" disabled={isSystem} />
                    <RHF.FormSelect control={form.control} name="useYn" items={[{ label: "Y", value: "Y" }, { label: "N", value: "N" }]} label="사용여부" disabled={isSystem} />
                    {!isSystem && (
                      <>
                        <Button size="h28" variant="blue" onClick={handleSaveRole} className="shrink-0">
                          <Icons.CloudUpload className="size-3.5" /> 저장
                        </Button>
                        <Button size="h28" variant="outline-pink" onClick={handleDeleteRole} className="shrink-0">
                          <Icons.Trash2 className="size-3.5" /> 삭제
                        </Button>
                      </>
                    )}
                  </FlexBox>
                  <RHF.FormTextarea control={form.control} name="note" label="비고" className="min-h-[60px]" disabled={isSystem} />
                </>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">좌측에서 역할을 선택해주세요.</p>
              )}
            </FormUnitBox>

            {/* 권한 설정 (탭) */}
            <FormUnitBox title="권한 설정" className="inset-shadow-none" vertical>
              <div className="flex items-center justify-between pb-2">
                <div className="flex gap-0 border-b">
                  <button type="button" onClick={() => setTab("menu")} className={tab === "menu" ? TAB_ACTIVE : TAB_INACTIVE}>메뉴 권한</button>
                  <button type="button" onClick={() => setTab("user")} className={tab === "user" ? TAB_ACTIVE : TAB_INACTIVE}>구성원 ({roleUsers.length})</button>
                </div>

                <div className="flex gap-1">
                  {tab === "menu" && selected && (
                    <Button size="h28" variant="blue" onClick={handleSaveMenus} disabled={isSystem}>
                      <Icons.CloudUpload className="size-3.5" /> 저장
                    </Button>
                  )}
                  {tab === "user" && selected && (
                    <>
                      <Button size="h28" variant="blue" onClick={() => setUserModalOpen(true)}>
                        <Icons.Plus className="size-3.5" /> 구성원 추가
                      </Button>
                      <Button size="h28" variant="outline-pink" onClick={handleRemoveUsers}>
                        <Icons.Trash2 className="size-3.5" /> 제거
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {!selected ? (
                <p className={`flex ${GRID_H} items-center justify-center text-sm text-muted-foreground`}>좌측에서 역할을 선택해주세요.</p>
              ) : tab === "menu" ? (
                <>
                  {/* dispType 서브 탭 (버튼 박스 형식, 공통 BoxTab) */}
                  <BoxTab
                    items={DISP_TABS}
                    active={dispTab}
                    onClick={(v) => setDispTab(v as DispTabType)}
                    className="mb-2"
                  />
                  <MenuPermTree
                    tree={menuTree}
                    permsMap={permsMap}
                    onToggle={togglePerm}
                    onToggleAll={toggleAll}
                    disabled={isSystem}
                  />
                </>
              ) : (
                <DataTable
                  data={roleUsers} columns={USER_COLUMNS} className={GRID_H}
                  enableRowSelection rowSelection={checkedUsers}
                  onRowSelectionChange={setCheckedUsers} getRowId={(row) => row.userMstSeq}
                />
              )}
            </FormUnitBox>
          </section>
        </FlexBox>
      </form>

      {/* 신규 역할 모달 */}
      <FormProvider {...roleForm}>
        <FormDialog open={roleModalOpen} onOpenChange={setRoleModalOpen} title="역할 등록" onSubmit={() => roleForm.handleSubmit(handleCreateRole)()}>
          <div className="grid gap-4 py-4">
            <RHF.Input control={roleForm.control} name="roleNm" label="역할명" />
            <RHF.Input control={roleForm.control} name="note" label="비고" />
          </div>
        </FormDialog>
      </FormProvider>

      {/* 구성원 추가 모달 */}
      <UserModal title="구성원 추가" open={userModalOpen} onOpenChange={setUserModalOpen} onSuccess={handleAssignUsers} multi />
    </FormProvider>
  );
};

export default RoleMngList;
