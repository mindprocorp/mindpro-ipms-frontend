import { useState, useEffect, useRef } from "react";
import { FlexBox, Icons, InfoBox } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { orgQueries } from "@shared/query/organization/queries";
import { useAlertStore } from "@shared/store/useAlertStore";

import { useMutation } from "@tanstack/react-query";
import type { OfficeCodeVO } from "@shared/api/organization/orgApi";
import { CODE_CLASS } from "@shared/enum/organizationType";
import DragCodeColumn, { type CodeItem } from "../_components/common/DragCodeColumn";
import { useSystemReorder } from "@shared/api/system/systemApi";

type ColConfig = { codeClass: string; label: string; placeholder: string; required: boolean };

const COLS: ColConfig[] = [
  { codeClass: CODE_CLASS.JOB_POSITION, label: "직위", placeholder: "직위입력", required: true },
  { codeClass: CODE_CLASS.POSITION, label: "직책", placeholder: "직책입력", required: true },
  { codeClass: CODE_CLASS.WORK_TYPE, label: "직무", placeholder: "직무입력", required: true },
  { codeClass: CODE_CLASS.JOB_GRADE, label: "직급", placeholder: "직급입력", required: false },
];

const OrgStructureList = () => {
  const { openAlert } = useAlertStore();
  const getCodeListMutation = useMutation(orgQueries.getOfficeCodeList());
  const createCodeMutation = useMutation(orgQueries.getOrCreateCode());
  const updateCodeMutation = useMutation(orgQueries.updateCode());
  const deleteCodeMutation = useMutation(orgQueries.deleteCode());

  const [codeMap, setCodeMap] = useState<Record<string, OfficeCodeVO[]>>({});
  const [addingCol, setAddingCol] = useState<string | null>(null);
  const [newVal, setNewVal] = useState("");
  const [editSeq, setEditSeq] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");
  const reorderMut = useSystemReorder("OFFICE_CODE");

  const isProcessingRef = useRef(false);

  const fetchAll = async () => {
    const r: Record<string, OfficeCodeVO[]> = {};
    for (const c of COLS)
      r[c.codeClass] = await getCodeListMutation.mutateAsync({ codeClass: c.codeClass });
    setCodeMap(r);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAdd = async (codeClass: string) => {
    if (isProcessingRef.current) return;
    if (!newVal.trim()) return;
    if ((codeMap[codeClass] || []).some((c) => c.codeName === newVal.trim())) {
      openAlert({ message: "중복된 값이 존재합니다.", showCancel: false });
      return;
    }
    isProcessingRef.current = true;
    try {
      await createCodeMutation.mutateAsync({ codeClass, codeName: newVal.trim() });
      setAddingCol(null);
      setNewVal("");
      await fetchAll();
    } catch {
      openAlert({ message: "등록에 실패했습니다." });
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleEdit = async () => {
    if (isProcessingRef.current) return;
    if (!editSeq || !editVal.trim()) return;
    const original = Object.values(codeMap).flat().find((c) => c.officeCodeSeq === editSeq);
    if (!original) return;
    const sameClass = (codeMap[original.codeClass] || []);
    if (sameClass.some((c) => c.officeCodeSeq !== editSeq && c.codeName === editVal.trim())) {
      openAlert({ message: "중복된 값이 존재합니다.", showCancel: false });
      return;
    }
    isProcessingRef.current = true;
    try {
      await updateCodeMutation.mutateAsync({ ...original, codeName: editVal.trim() });
      setEditSeq(null);
      await fetchAll();
    } catch {
      openAlert({ message: "수정에 실패했습니다." });
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleDelete = (code: OfficeCodeVO, label: string, codeClass: string) => {
    const col = COLS.find((c) => c.codeClass === codeClass);
    if (col?.required && (codeMap[codeClass] || []).length <= 1) {
      openAlert({ message: `${label}은(는) 최소 1개 이상 필요합니다.` });
      return;
    }
    openAlert({
      title: `${label} 삭제`,
      message: <p className="text-sm">"{code.codeName}"을(를) 삭제하시겠습니까?</p>,
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          await deleteCodeMutation.mutateAsync(code.officeCodeSeq);
          await fetchAll();
        } catch {
          openAlert({ message: "삭제에 실패했습니다." });
        }
      },
    });
  };

  const toCodeItems = (codes: OfficeCodeVO[], col: ColConfig): CodeItem[] =>
    codes.map((code) => ({
      id: code.officeCodeSeq,
      label: code.codeName,
      actions: [
        { label: "수정", onClick: () => { setEditSeq(code.officeCodeSeq); setEditVal(code.codeName); } },
        { label: "삭제", variant: "destructive" as const, onClick: () => handleDelete(code, col.label, col.codeClass) },
      ],
    }));

  return (
    <>
      <PageTitleArea className="pb-2" title="조직 체계 관리" />

      <InfoBox title="설정안내" icon={Icons.Info}>
        <li>직위/직책/직무는 직원 정보 관리에서 직원 배치 시 사용됩니다.</li>
        <li>직급은 선택사항이며, 등록하지 않아도 시스템 사용에 지장이 없습니다.</li>
      </InfoBox>

      <div className="mt-3 grid grid-cols-4 gap-4">
        {COLS.map((col) => (
          <FormUnitBox
            key={col.codeClass}
            title={`${col.label}${col.required ? " (필수)" : ""}`}
            className={`inset-shadow-none ${col.required ? "[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5" : ""}`}
            vertical
          >
            <DragCodeColumn
              title={col.label}
              items={toCodeItems(codeMap[col.codeClass] || [], col)}
              onAdd={() => { setAddingCol(col.codeClass); setNewVal(""); }}
              isAdding={addingCol === col.codeClass}
              addValue={newVal}
              onAddChange={setNewVal}
              onAddConfirm={() => !createCodeMutation.isPending && handleAdd(col.codeClass)}
              onAddCancel={() => setAddingCol(null)}
              addPlaceholder={col.placeholder}
              editingId={editSeq}
              editValue={editVal}
              onEditChange={setEditVal}
              onEditConfirm={handleEdit}
              onEditCancel={() => setEditSeq(null)}
              emptyMessage={`등록된 ${col.label} 정보가 없습니다.`}
              emptySubMessage={!col.required ? `선택사항이므로 등록하지 않아도\n시스템 사용에 지장이 없습니다.` : undefined}
              onReorder={(orderedIds) => {
                reorderMut.mutate(orderedIds, { onSuccess: () => fetchAll() });
              }}
            />
          </FormUnitBox>
        ))}
      </div>
    </>
  );
};

export default OrgStructureList;
