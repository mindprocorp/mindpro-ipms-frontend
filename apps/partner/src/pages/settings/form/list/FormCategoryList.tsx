import { useState, useEffect, useRef } from "react";
import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import SettingsListPanel from "../../_components/common/SettingsListPanel";
import { orgQueries, formTemplateQueries } from "@shared/query/organization/queries";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useMutation } from "@tanstack/react-query";
import type { OfficeCodeVO } from "@shared/api/organization/orgApi";
import type { FormTemplateVO } from "@shared/api/organization/formTemplateApi";
import { CODE_CLASS } from "@shared/enum/organizationType";
import DragListInput from "../../_components/common/DragListInput";
import DragTree, { type DragTreeNode } from "../../_components/common/DragTree";
import { useSystemReorder } from "@shared/api/system/systemApi";
import FormPreviewModal from "../editor/FormPreviewModal";

const FormCategoryList = () => {
  const { openAlert } = useAlertStore();
  const user = useAuthStore((s) => s.user);
  const getCodeListMutation = useMutation(orgQueries.getOfficeCodeList());
  const createCodeMutation = useMutation(orgQueries.getOrCreateCode());
  const updateCodeMutation = useMutation(orgQueries.updateCode());
  const deleteCodeMutation = useMutation(orgQueries.deleteCode());
  const getFormListMutation = useMutation(formTemplateQueries.getList());
  const saveMutation = useMutation(formTemplateQueries.save());
  const deleteMutation = useMutation(formTemplateQueries.delete());

  const [categories, setCategories] = useState<OfficeCodeVO[]>([]);
  const [templates, setTemplates] = useState<FormTemplateVO[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedCat, setSelectedCat] = useState<OfficeCodeVO | null>(null);

  // 카테고리
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editCatVal, setEditCatVal] = useState("");

  // 서식 추가 (트리 내 하위)
  const [addingTmplCat, setAddingTmplCat] = useState<string | null>(null);
  const [newTmplName, setNewTmplName] = useState("");
  const [editTmplId, setEditTmplId] = useState<string | null>(null);
  const [editTmplVal, setEditTmplVal] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [previewSeq, setPreviewSeq] = useState<string | null>(null);
  const reorderCodeMut = useSystemReorder("OFFICE_CODE");

  const isProcessingRef = useRef(false);

  const fetchData = async () => {
    const [cats, tmpls] = await Promise.all([
      getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.FORM_CATEGORY }),
      getFormListMutation.mutateAsync({}),
    ]);
    setCategories(cats);
    setTemplates(tmpls);
    setExpanded(new Set(cats.map((c) => c.officeCodeSeq)));
  };

  useEffect(() => { fetchData(); }, []);

  const toggle = (id: string) =>
    setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const displayItems = (showAll ? templates : selectedCat ? templates.filter((t) => t.categoryCode === selectedCat.officeCode) : [])
    .map((tmpl) => ({
      id: tmpl.formTemplateSeq || "",
      title: tmpl.templateName,
      subtitle: categories.find((c) => c.officeCode === tmpl.categoryCode)?.codeName || "",
    }));

  // 카테고리 CRUD
  const handleAddCat = async () => {
    if (isProcessingRef.current) return;
    if (!newCatName.trim()) return;
    isProcessingRef.current = true;
    try {
      await createCodeMutation.mutateAsync({ codeClass: CODE_CLASS.FORM_CATEGORY, codeName: newCatName.trim() });
      setAddingCat(false);
      setNewCatName("");
      await fetchData();
    } catch {
      openAlert({ message: "카테고리 등록에 실패했습니다." });
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleEditCat = async () => {
    if (isProcessingRef.current) return;
    if (!editCatId || !editCatVal.trim()) return;
    const cat = categories.find((c) => c.officeCodeSeq === editCatId);
    if (!cat) return;
    isProcessingRef.current = true;
    try {
      await updateCodeMutation.mutateAsync({ ...cat, codeName: editCatVal.trim() });
      setEditCatId(null);
      await fetchData();
    } catch {
      openAlert({ message: "카테고리명 수정에 실패했습니다." });
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleDeleteCat = (cat: OfficeCodeVO) => {
    const count = templates.filter((t) => t.categoryCode === cat.officeCode).length;
    if (count > 0) {
      openAlert({ message: `하위 서식이 ${count}개 있어 삭제할 수 없습니다.` });
      return;
    }
    openAlert({
      title: "카테고리 삭제",
      message: <p className="text-sm">"{cat.codeName}" 카테고리를 삭제하시겠습니까?</p>,
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        await deleteCodeMutation.mutateAsync(cat.officeCodeSeq);
        if (selectedCat?.officeCodeSeq === cat.officeCodeSeq) setSelectedCat(null);
        fetchData();
      },
    });
  };

  // 서식 CRUD
  const handleAddTmpl = async () => {
    if (isProcessingRef.current) return;
    if (!newTmplName.trim()) return;
    const cat = categories.find(c => c.officeCodeSeq === addingTmplCat) || selectedCat;
    if (!cat) return;
    isProcessingRef.current = true;
    try {
      await saveMutation.mutateAsync({
        categoryCode: cat.officeCode,
        templateName: newTmplName.trim(),
        useYn: "Y",
      });
      setAddingTmplCat(null);
      setNewTmplName("");
      await fetchData();
    } catch {
      openAlert({ message: "서식 등록에 실패했습니다." });
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleEditTmpl = async () => {
    if (isProcessingRef.current) return;
    if (!editTmplId || !editTmplVal.trim()) return;
    const tmpl = templates.find((t) => t.formTemplateSeq === editTmplId);
    if (!tmpl) return;
    isProcessingRef.current = true;
    try {
      await saveMutation.mutateAsync({ ...tmpl, templateName: editTmplVal.trim() });
      setEditTmplId(null);
      await fetchData();
    } catch {
      openAlert({ message: "서식명 수정에 실패했습니다." });
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleDeleteTmpl = (tmpl: FormTemplateVO) => {
    openAlert({
      title: "서식 삭제",
      message: <p className="text-sm">"{tmpl.templateName}" 서식을 삭제하시겠습니까?</p>,
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => { await deleteMutation.mutateAsync(tmpl.formTemplateSeq!); fetchData(); },
    });
  };

  // 트리 노드
  const treeNodes: DragTreeNode[] = [...categories]
    .sort((a, b) => Number(a.sortOrd) - Number(b.sortOrd))
    .map((cat) => {
    const count = templates.filter((t) => t.categoryCode === cat.officeCode).length;
    return {
      id: cat.officeCodeSeq,
      label: `${cat.codeName} (${count})`,
      onAdd: () => { setAddingTmplCat(cat.officeCodeSeq); setNewTmplName(""); if (!expanded.has(cat.officeCodeSeq)) toggle(cat.officeCodeSeq); },
      actions: [
        { label: "수정", onClick: () => { setEditCatId(cat.officeCodeSeq); setEditCatVal(cat.codeName); } },
        { label: "삭제", variant: "destructive" as const, onClick: () => handleDeleteCat(cat) },
      ],
      children: templates.filter((t) => t.categoryCode === cat.officeCode).sort((a, b) => Number(a.sortOrd) - Number(b.sortOrd)).map((tmpl) => ({
        id: tmpl.formTemplateSeq || "",
        label: tmpl.templateName,
        noDrag: true,
        actions: [
          { label: "수정", onClick: () => { setEditTmplId(tmpl.formTemplateSeq!); setEditTmplVal(tmpl.templateName); } },
          { label: "삭제", variant: "destructive" as const, onClick: () => handleDeleteTmpl(tmpl) },
        ],
      })),
    };
  });

  const allExpanded = expanded.size > 0;

  return (
    <>
      <PageTitleArea className="pb-2" title="카테고리 관리" />
      <FlexBox className="items-stretch gap-4">
        {/* 좌측: 카테고리 트리 */}
        <section className="flex flex-1 flex-col">
          <FormUnitBox
            title="카테고리"
            className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5 inset-shadow-none flex-1"
            vertical
          >
            <FlexBox className="justify-end pb-2">
              <FlexBox className="gap-1">
                <Button size="h28" onClick={() => { setAddingCat(true); setNewCatName(""); }}>
                  <Icons.Plus className="size-3.5" /> 카테고리 추가
                </Button>
                <Button size="h28" onClick={allExpanded ? () => setExpanded(new Set()) : () => setExpanded(new Set(categories.map((c) => c.officeCodeSeq)))}>
                  <Icons.ListFilter className="size-3.5" /> {allExpanded ? "모두 접기" : "모두 펼치기"}
                </Button>
              </FlexBox>
            </FlexBox>

            <div className="h-[calc(100vh-265px)] overflow-auto">
              {addingCat && (
                <div className="mb-2">
                  <DragListInput minimal value={newCatName} onChange={setNewCatName} onConfirm={handleAddCat} onCancel={() => setAddingCat(false)} placeholder="카테고리명 입력" />
                </div>
              )}
              <DragTree
                nodes={treeNodes}
                expanded={expanded}
                onToggle={toggle}
                addingId={addingTmplCat}
                addValue={newTmplName}
                onAddChange={setNewTmplName}
                onAddConfirm={handleAddTmpl}
                onAddCancel={() => setAddingTmplCat(null)}
                addPlaceholder="서식이름"
                editingId={editCatId || editTmplId}
                editValue={editCatId ? editCatVal : editTmplVal}
                onEditChange={editCatId ? setEditCatVal : setEditTmplVal}
                onEditConfirm={editCatId ? handleEditCat : handleEditTmpl}
                onEditCancel={() => { setEditCatId(null); setEditTmplId(null); }}
                onNodeClick={(id) => {
                  const cat = categories.find((c) => c.officeCodeSeq === id);
                  if (cat) { setSelectedCat(cat); setShowAll(false); return; }
                  const tmpl = templates.find((t) => t.formTemplateSeq === id);
                  if (tmpl) { setPreviewSeq(tmpl.formTemplateSeq!); }
                }}
                selectedId={selectedCat?.officeCodeSeq}
                onReorder={(parentId, orderedIds) => {
                  if (parentId === null) {
                    reorderCodeMut.mutate(orderedIds, { onSuccess: () => fetchData() });
                  }
                }}
              />
            </div>
          </FormUnitBox>
        </section>

        {/* 우측: 서식 목록 */}
        <section className="flex min-w-0 flex-1 flex-col">
          <SettingsListPanel
            label="서식 목록"
            filterLabel={selectedCat?.codeName}
            items={displayItems}
            showAll={showAll}
            onShowAll={() => { setShowAll(true); setSelectedCat(null); }}
            searchPlaceholder="서식명 검색"
            emptyMessage="등록된 서식이 없습니다."
            onItemClick={(item) => setPreviewSeq(item.id)}
          />
        </section>
      </FlexBox>

      <FormPreviewModal
        open={!!previewSeq}
        onClose={() => setPreviewSeq(null)}
        formTemplateSeq={previewSeq || undefined}
      />
    </>
  );
};

export default FormCategoryList;
