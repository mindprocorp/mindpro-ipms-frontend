import { useMemo, useState } from "react";
import { systemApi, useSystemReorder, type MenuVO } from "@shared/api/system/systemApi";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, FlexBox, Icons, Input, RHF } from "@repo/ui";
import * as LucideIcons from "lucide-react";
import { resolveIcon } from "@shared/ui/layout/menuUtils";
import type React from "react";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import DragTree, { type DragTreeNode } from "../../_components/common/DragTree";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useRefreshMenus } from "@shared/hooks/useRefreshMenus";
import { useForm, FormProvider, useController } from "react-hook-form";

type TabType = "GNB" | "ICON_SIDEBAR";

const TAB_LABELS: Record<TabType, string> = {
  GNB: "GNB 메뉴",
  ICON_SIDEBAR: "아이콘 메뉴",
};

// ─── 아이콘 피커 ────────────────────────────────
const ALL_LUCIDE_NAMES = Object.keys(LucideIcons).filter(
  (n) => /^[A-Z]/.test(n) && !n.endsWith("Icon") && !["LucideIcon", "LucideProps", "Icon", "createLucideIcon"].includes(n),
);

const IconPickerField = ({ control, name }: { control: any; name: string }) => {
  const { field } = useController({ control, name });
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const list = q.trim() ? ALL_LUCIDE_NAMES.filter((n) => n.toLowerCase().includes(q.toLowerCase())) : ALL_LUCIDE_NAMES;
    return list.slice(0, 200);
  }, [q]);
  const Current = field.value ? resolveIcon(field.value) : null;

  return (
    <>
      {/* FormSelect와 동일한 레이아웃: label + outline Button 트리거 + ChevronsUpDown */}
      <div className="relative flex w-full flex-col gap-1">
        <label className="text-xs text-muted-foreground">아이콘</label>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          onClick={() => setOpen(true)}
          className={`w-full justify-between p-1.5 ${!field.value ? "text-placeholder" : ""}`}
        >
          <span className="flex items-center gap-2 truncate">
            {Current && <Current className="size-4" />}
            <span className="truncate">{field.value || "아이콘 선택"}</span>
          </span>
          <Icons.ChevronsUpDown className="text-foreground size-3.5" />
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>아이콘 선택</DialogTitle></DialogHeader>
          <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="검색..." className="mb-3" />
          <div className="grid max-h-[400px] grid-cols-8 gap-1 overflow-y-auto">
            {filtered.map((n) => {
              const Icon = resolveIcon(n);
              if (!Icon) return null;
              return (
                <button
                  key={n}
                  type="button"
                  title={n}
                  onClick={() => { field.onChange(n); setOpen(false); }}
                  className={`flex size-12 cursor-pointer items-center justify-center rounded-md border hover:bg-accent ${
                    field.value === n ? "border-p-color-1 bg-p-color-1/10" : ""
                  }`}
                >
                  <Icon className="size-4" />
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ─── 메인 ──────────────────────────────────────
export default function MenuMngList() {
  const { openAlert } = useAlertStore();
  // 메뉴 관리 화면 — super_admin_only 메뉴까지 전부 노출 (이 페이지 자체가 슈퍼어드민 관리 페이지)
  const { data: list = [] } = systemApi.menus.useList({ all: true });
  const saveMut = systemApi.menus.useSave();
  const deleteMut = systemApi.menus.useDelete();
  const reorderMut = useSystemReorder("MENU", systemApi.menus.queryKey);
  const refreshMenus = useRefreshMenus();

  const form = useForm<MenuVO>();
  const watchedType = form.watch("menuType");
  const watchedDisp = form.watch("dispType");

  const [tab, setTab] = useState<TabType>("GNB");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<MenuVO | null>(null);
  const [isNew, setIsNew] = useState(false);

  const tabList = list.filter((m) => m.dispType === tab);
  const roots = tabList.filter((m) => !m.parentMenuSeq).sort((a, b) => a.dispOrd - b.dispOrd);
  const childrenOf = (id: string) => tabList.filter((m) => m.parentMenuSeq === id).sort((a, b) => a.dispOrd - b.dispOrd);

  const toggle = (id: string) => setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // 신규 생성 모드 — 아이콘 메뉴의 루트는 무조건 FOLDER(그룹 헤더 역할)
  //   dispOrd는 형제 중 최댓값 + 10 → 항상 가장 밑에 배치
  const startCreate = (parent: MenuVO | null) => {
    const siblings = parent ? childrenOf(parent.menuSeq) : roots;
    const maxOrd = siblings.reduce((acc, s) => Math.max(acc, s.dispOrd ?? 0), 0);
    const isIconRoot = !parent && tab === "ICON_SIDEBAR";
    const draft = {
      menuSeq: "", menuNm: "", menuCd: "", menuUrl: "", menuIcon: "",
      parentMenuSeq: parent?.menuSeq ?? null,
      dispOrd: maxOrd + 10, dispType: tab,
      menuType: isIconRoot ? "FOLDER" : "PAGE",
      useYn: "Y", sidebarYn: tab === "ICON_SIDEBAR" ? "Y" : "N",
    } as MenuVO;
    setSelected(draft);
    setIsNew(true);
    form.reset(draft);
    if (parent && !expanded.has(parent.menuSeq)) toggle(parent.menuSeq);
  };

  const cancelEdit = () => { setSelected(null); setIsNew(false); };

  // 저장
  const handleSave = async (data: MenuVO) => {
    const menuNm = data.menuNm?.trim();
    // 신규일 때만 prefix 합치기 (수정 시 전체 편집 자유)
    const parent = data.parentMenuSeq ? list.find((m) => m.menuSeq === data.parentMenuSeq) : null;
    const prefix = isNew && parent?.menuCd ? `${parent.menuCd}.` : "";
    const rawCd = data.menuCd?.trim() ?? "";
    const menuCd = prefix && !rawCd.startsWith(prefix) ? prefix + rawCd : rawCd;

    if (!menuNm) return openAlert({ message: "메뉴명은 필수입니다.", showCancel: false });
    if (!menuCd) return openAlert({ message: "메뉴 코드는 필수입니다.", showCancel: false });
    if (data.menuType !== "FOLDER" && !data.menuUrl?.trim()) {
      return openAlert({ message: "경로 URL은 필수입니다.", showCancel: false });
    }
    if (list.some((m) => m.menuCd === menuCd && m.menuSeq !== data.menuSeq)) {
      return openAlert({ message: "이미 사용 중인 메뉴 코드입니다.", showCancel: false });
    }

    // 부모가 PAGE면 FOLDER로 자동 승격 (무결성)
    if (!data.menuSeq && data.parentMenuSeq) {
      const parent = list.find((m) => m.menuSeq === data.parentMenuSeq);
      if (parent?.menuType === "PAGE") {
        await saveMut.mutateAsync({ ...parent, menuType: "FOLDER", menuUrl: "" });
      }
    }

    const payload: MenuVO = {
      ...data,
      menuNm,
      menuCd,
      menuUrl: data.menuType === "FOLDER" ? "" : data.menuUrl,
    };

    try {
      await saveMut.mutateAsync(payload);
      refreshMenus();
      openAlert({ message: "저장되었습니다.", showCancel: false });
      setIsNew(false);
    } catch {
      openAlert({ message: "저장에 실패했습니다.", showCancel: false });
    }
  };

  // 삭제
  const handleDelete = (vo: MenuVO) => {
    if (list.some((m) => m.parentMenuSeq === vo.menuSeq)) {
      return openAlert({ message: "하위 메뉴가 있어 삭제할 수 없습니다." });
    }
    openAlert({
      title: "메뉴 삭제",
      message: `"${vo.menuNm}" 메뉴를 삭제하시겠습니까?`,
      confirmText: "삭제",
      onConfirm: async () => {
        await deleteMut.mutateAsync(vo.menuSeq);
        if (selected?.menuSeq === vo.menuSeq) cancelEdit();
        refreshMenus();
      },
    });
  };

  // 트리 노드 빌드
  const menuIcon = (m: MenuVO): React.ReactNode =>
    m.menuType === "FOLDER"
      ? <Icons.Folder className="size-3.5 text-amber-500" />
      : <Icons.FileText className="size-3.5 text-blue-400" />;

  // 신규 생성 중이면 트리에 placeholder 노드를 표시 (어디에 생길지 시각화)
  const draftNm = form.watch("menuNm");
  const draftNode: DragTreeNode = {
    id: "__DRAFT__",
    label: draftNm?.trim() || "(새 메뉴)",
    icon: <Icons.Plus className="size-3.5 text-p-color-1" />,
    dimmed: true,
    noDrag: true,
  };

  const buildNodes = (items: MenuVO[]): DragTreeNode[] =>
    items.map((m) => {
      const kids = childrenOf(m.menuSeq);
      const childNodes = kids.length ? buildNodes(kids) : [];
      // 이 노드의 하위로 생성 중이면 placeholder 추가
      if (isNew && selected?.parentMenuSeq === m.menuSeq) {
        childNodes.push(draftNode);
      }
      return {
        id: m.menuSeq,
        label: m.menuNm,
        icon: menuIcon(m),
        dimmed: m.useYn === "N",
        onAdd: () => startCreate(m),
        actions: [{ label: "삭제", variant: "destructive" as const, onClick: () => handleDelete(m) }],
        children: childNodes.length ? childNodes : undefined,
      };
    });

  const treeNodes = buildNodes(roots);
  // 최상위 신규 추가 placeholder
  if (isNew && !selected?.parentMenuSeq) treeNodes.push(draftNode);
  const allExpandable = tabList.filter((m) => tabList.some((c) => c.parentMenuSeq === m.menuSeq)).map((m) => m.menuSeq);
  const allExpanded = allExpandable.length > 0 && allExpandable.every((s) => expanded.has(s));

  const handleTabChange = (t: TabType) => { setTab(t); cancelEdit(); setExpanded(new Set()); };

  return (
    <>
      <PageTitleArea className="pb-2" title="메뉴 관리" />

      <div className="mb-3 flex gap-1 border-b">
        {(["GNB", "ICON_SIDEBAR"] as TabType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTabChange(t)}
            className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
              tab === t ? "border-b-2 border-p-color-1 text-p-color-1" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <FlexBox className="items-stretch gap-4">
        {/* 좌측: 트리 */}
        <section className="flex flex-1 flex-col">
          <FormUnitBox
            title={TAB_LABELS[tab]}
            className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5 inset-shadow-none flex-1"
            vertical
          >
            <FlexBox className="justify-start gap-1 pb-2">
              <Button size="h28" onClick={() => startCreate(null)}>
                <Icons.Plus className="size-3.5" /> 신규 메뉴 추가
              </Button>
              <Button
                size="h28"
                onClick={() => setExpanded(allExpanded ? new Set() : new Set(allExpandable))}
              >
                <Icons.ListFilter className="size-3.5" /> {allExpanded ? "모두 접기" : "모두 펼치기"}
              </Button>
            </FlexBox>
            <div className="h-[calc(100vh-300px)] overflow-auto">
              <DragTree
                nodes={treeNodes}
                expanded={expanded}
                onToggle={toggle}
                onNodeClick={(id) => {
                  const node = list.find((m) => m.menuSeq === id);
                  if (node) { setSelected(node); setIsNew(false); form.reset(node); }
                }}
                selectedId={selected?.menuSeq || undefined}
                onReorder={(_p, ids) => reorderMut.mutate(ids)}
              />
            </div>
          </FormUnitBox>
        </section>

        {/* 우측: 상세 폼 */}
        <section className="flex min-w-0 flex-1 flex-col">
          <FormUnitBox
            title={isNew ? "메뉴 추가" : "메뉴 상세"}
            className="inset-shadow-none flex-1"
            vertical
          >
            {!selected ? (
              <div className="text-muted-foreground flex min-h-[calc(100vh-300px)] flex-1 flex-col items-center justify-center gap-2 text-center">
                <Icons.LayoutList className="size-8 opacity-20" />
                <p className="text-sm">메뉴를 선택하거나 추가하세요.</p>
              </div>
            ) : (
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleSave)} className="flex h-full flex-col gap-3">
                  <RHF.Input
                    control={form.control}
                    name="menuNm"
                    label="메뉴명"
                    rules={{ required: "메뉴명은 필수입니다." }}
                    noSpace={false}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <RHF.Input
                      control={form.control}
                      name="menuCd"
                      label="메뉴 코드"
                      disabled={!isNew}
                      rules={{ required: "메뉴 코드는 필수입니다." }}
                      prefix={
                        selected?.parentMenuSeq
                          ? (list.find((m) => m.menuSeq === selected.parentMenuSeq)?.menuCd ?? "") + "."
                          : undefined
                      }
                    />
                    <IconPickerField control={form.control} name="menuIcon" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <RHF.FormSelect
                      control={form.control}
                      name="menuType"
                      label="메뉴 타입"
                      disabled={isNew && !selected?.parentMenuSeq && watchedDisp === "ICON_SIDEBAR"}
                      items={[
                        { label: "페이지", value: "PAGE" },
                        { label: "폴더", value: "FOLDER" },
                      ]}
                    />
                    <RHF.FormSelect
                      control={form.control}
                      name="dispType"
                      label="표시 타입"
                      disabled
                      items={[
                        { label: "GNB", value: "GNB" },
                        { label: "아이콘 메뉴", value: "ICON_SIDEBAR" },
                        { label: "숨김", value: "HIDDEN" },
                      ]}
                    />
                  </div>
                  {watchedType !== "FOLDER" && (
                    <RHF.Input
                      control={form.control}
                      name="menuUrl"
                      label="경로 URL"
                      rules={{ required: "경로 URL은 필수입니다." }}
                    />
                  )}
                  <RHF.FormCheckbox
                    control={form.control}
                    name="useYn"
                    label="사용"
                    outputFormat={["Y", "N"]}
                  />
                  {watchedDisp === "ICON_SIDEBAR" && !selected?.parentMenuSeq && (
                    <RHF.FormCheckbox
                      control={form.control}
                      name="sidebarYn"
                      label="사이드바 표시"
                      outputFormat={["Y", "N"]}
                    />
                  )}
                  {/* 슈퍼어드민 전용 메뉴 체크 — 루트에만 체크하면 자식도 자동 전파(백엔드) */}
                  {!selected?.parentMenuSeq && (
                    <RHF.FormCheckbox
                      control={form.control}
                      name="superAdminOnly"
                      label="슈퍼어드민 전용 (자식 자동 전파)"
                      outputFormat={["Y", "N"]}
                    />
                  )}

                  <div className="mt-auto flex gap-2 pt-1">
                    <Button type="button" variant="outline" onClick={cancelEdit} className="flex-1">
                      취소
                    </Button>
                    <Button type="submit" className="flex-1">
                      {isNew ? "등록" : "저장"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            )}
          </FormUnitBox>
        </section>
      </FlexBox>
    </>
  );
}
