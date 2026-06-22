import { useState, useEffect } from "react";
import { Icons, InfoBox } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { orgQueries } from "@shared/query/organization/queries";
import { useAlertStore } from "@shared/store/useAlertStore";

import { useMutation } from "@tanstack/react-query";
import type { OfficeCodeVO } from "@shared/api/organization/orgApi";
import { CODE_CLASS } from "@shared/enum/organizationType";
import DragCodeColumn, { type CodeItem } from "../../_components/common/DragCodeColumn";
import { useSystemReorder } from "@shared/api/system/systemApi";

const ApprTypeList = () => {
  const { openAlert } = useAlertStore();
  const getCodeListMutation = useMutation(orgQueries.getOfficeCodeList());
  const createCodeMutation = useMutation(orgQueries.getOrCreateCode());
  const updateCodeMutation = useMutation(orgQueries.updateCode());
  const deleteCodeMutation = useMutation(orgQueries.deleteCode());

  const [codes, setCodes] = useState<OfficeCodeVO[]>([]);
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const reorderMut = useSystemReorder("OFFICE_CODE");

  const fetchList = async () => {
    setCodes(await getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.APPROVAL_TYPE }));
  };

  useEffect(() => { fetchList(); }, []);

  const handleAdd = async () => {
    if (!newVal.trim()) return;
    try {
      await createCodeMutation.mutateAsync({ codeClass: CODE_CLASS.APPROVAL_TYPE, codeName: newVal.trim() });
      setAdding(false);
      setNewVal("");
      fetchList();
    } catch {
      openAlert({ message: "등록에 실패했습니다." });
    }
  };

  const handleEdit = async () => {
    if (!editingId || !editValue.trim()) return;
    const original = codes.find((c) => c.officeCodeSeq === editingId);
    if (!original) return;
    try {
      await updateCodeMutation.mutateAsync({ ...original, codeName: editValue.trim() });
      setEditingId(null);
      fetchList();
    } catch {
      openAlert({ message: "수정에 실패했습니다." });
    }
  };

  const handleDelete = (code: OfficeCodeVO) => {
    openAlert({
      title: "결재유형 삭제",
      message: <p className="text-sm">"{code.codeName}"을(를) 삭제하시겠습니까?</p>,
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          await deleteCodeMutation.mutateAsync(code.officeCodeSeq);
          fetchList();
        } catch {
          openAlert({ message: "삭제에 실패했습니다." });
        }
      },
    });
  };

  const toCodeItems = (list: OfficeCodeVO[]): CodeItem[] =>
    list.map((code) => ({
      id: code.officeCodeSeq,
      label: code.codeName,
      actions: [
        { label: "수정", onClick: () => { setEditingId(code.officeCodeSeq); setEditValue(code.codeName); } },
        { label: "삭제", variant: "destructive" as const, onClick: () => handleDelete(code) },
      ],
    }));

  return (
    <>
      <PageTitleArea className="pb-2" title="결재유형 관리" />
      <InfoBox title="설정안내" icon={Icons.Info}>
        <li>결재유형은 결재선 템플릿에서 결재 단계를 구성할 때 사용됩니다.</li>
      </InfoBox>
      <div className="mt-3 max-w-sm">
        <FormUnitBox
          title="결재유형"
          className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5 inset-shadow-none"
          vertical
        >
          <DragCodeColumn
            title="결재유형"
            items={toCodeItems(codes)}
            onAdd={() => { setAdding(true); setNewVal(""); }}
            isAdding={adding}
            addValue={newVal}
            onAddChange={setNewVal}
            onAddConfirm={handleAdd}
            onAddCancel={() => setAdding(false)}
            addPlaceholder="결재유형 입력"
            editingId={editingId}
            editValue={editValue}
            onEditChange={setEditValue}
            onEditConfirm={handleEdit}
            onEditCancel={() => setEditingId(null)}
            emptyMessage="등록된 결재유형이 없습니다."
            onReorder={(orderedIds) => {
              reorderMut.mutate(orderedIds, { onSuccess: () => fetchList() });
            }}
          />
        </FormUnitBox>
      </div>
    </>
  );
};

export default ApprTypeList;
