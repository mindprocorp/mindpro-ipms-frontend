import { useState, useEffect, useMemo, useRef } from "react";
import { Button, FlexBox, Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { orgQueries, employeeQueries } from "@shared/query/organization/queries";
import { useAlertStore } from "@shared/store/useAlertStore";

import { useMutation } from "@tanstack/react-query";
import type { DeptVO } from "@shared/api/organization/orgApi";
import type { EmployeeVO } from "@shared/api/organization/employeeApi";
import DragTree, { type DragTreeNode } from "../_components/common/DragTree";
import { useSystemReorder } from "@shared/api/system/systemApi";
import SettingsListPanel from "../_components/common/SettingsListPanel";
import UserImg from "@repo/assets/images/user.png";

const DeptTreeList = () => {
  const { openAlert } = useAlertStore();
  const getDeptTreeMutation = useMutation(orgQueries.getDeptTree());
  const createDeptMutation = useMutation(orgQueries.createDept());
  const deleteDeptMutation = useMutation(orgQueries.deleteDept());
  const updateDeptMutation = useMutation(orgQueries.updateDept());
  const getAllEmployeesMutation = useMutation(employeeQueries.getList());
  const reorderMut = useSystemReorder("DEPT");

  const isProcessingRef = useRef(false);

  const [deptList, setDeptList] = useState<DeptVO[]>([]);
  const [employees, setEmployees] = useState<EmployeeVO[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [editingSeq, setEditingSeq] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [selectedDept, setSelectedDept] = useState<DeptVO | null>(null);
  const [showAllEmp, setShowAllEmp] = useState(true);

  /** 부서코드 자동 생성 — 기존 DEPT_NNN 패턴의 최대값 + 1 */
  const generateNextDeptCode = () => {
    const nums = deptList
      .map((d) => d.deptCode?.match(/^DEPT_(\d+)$/)?.[1])
      .filter((s): s is string => !!s)
      .map(Number)
      .filter((n) => !isNaN(n));
    const next = (nums.length > 0 ? Math.max(...nums) : 0) + 1;
    return `DEPT_${String(next).padStart(3, "0")}`;
  };

  const fetchTree = async () => {
    const data = await getDeptTreeMutation.mutateAsync(undefined);
    setDeptList(data);
    setExpanded(new Set(data.map((d) => d.deptSeq)));
  };

  const fetchEmployees = async () => {
    setEmployees(await getAllEmployeesMutation.mutateAsync({}));
  };

  useEffect(() => {
    fetchTree();
    fetchEmployees();
  }, []);

  const toggle = (id: string) =>
    setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const sortedDeptList = useMemo(
    () => [...deptList].sort((a, b) => Number(a.sortOrd) - Number(b.sortOrd)),
    [deptList]
  );

  const getChildren = (seq: string) => sortedDeptList.filter((d) => d.parentDeptSeq === seq);

  const handleAdd = async (parentSeq: string | null) => {
    if (isProcessingRef.current) return;
    if (!newName.trim()) return;
    const siblings = sortedDeptList.filter((d) => (d.parentDeptSeq ?? null) === parentSeq);
    if (siblings.some((d) => d.deptName === newName.trim())) {
      openAlert({ message: "중복된 값이 존재합니다.", showCancel: false });
      return;
    }
    isProcessingRef.current = true;
    try {
      await createDeptMutation.mutateAsync({
        parentDeptSeq: parentSeq || undefined,
        deptCode: generateNextDeptCode(),
        deptName: newName.trim(),
        sortOrd: String(getChildren(parentSeq || "").length + 1),
      });
      setAdding(null);
      setNewName("");
      await fetchTree();
    } catch {
      openAlert({ message: "부서 등록에 실패했습니다." });
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleDelete = (dept: DeptVO) => {
    if (getChildren(dept.deptSeq).length > 0) {
      openAlert({ message: "하위 부서가 있어 삭제할 수 없습니다." });
      return;
    }
    openAlert({
      title: "조직 삭제",
      message: <p className="text-sm">"{dept.deptName}"을(를) 삭제하시겠습니까?</p>,
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        await deleteDeptMutation.mutateAsync(dept.deptSeq);
        if (selectedDept?.deptSeq === dept.deptSeq) setSelectedDept(null);
        fetchTree();
      },
    });
  };

  const handleRename = async () => {
    if (isProcessingRef.current) return;
    if (!editingSeq || !editName.trim()) return;
    const dept = sortedDeptList.find((d) => d.deptSeq === editingSeq);
    if (!dept) return;
    const siblings = sortedDeptList.filter(
      (d) => (d.parentDeptSeq ?? null) === (dept.parentDeptSeq ?? null) && d.deptSeq !== editingSeq
    );
    if (siblings.some((d) => d.deptName === editName.trim())) {
      openAlert({ message: "중복된 값이 존재합니다.", showCancel: false });
      return;
    }
    isProcessingRef.current = true;
    try {
      await updateDeptMutation.mutateAsync({
        deptSeq: dept.deptSeq,
        parentDeptSeq: dept.parentDeptSeq || undefined,
        deptCode: dept.deptCode,
        deptName: editName.trim(),
        sortOrd: dept.sortOrd,
      });
      setEditingSeq(null);
      await fetchTree();
    } catch {
      openAlert({ message: "조직명 수정에 실패했습니다." });
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleHide = async (dept: DeptVO) => {
    await updateDeptMutation.mutateAsync({
      deptSeq: dept.deptSeq,
      parentDeptSeq: dept.parentDeptSeq || undefined,
      deptCode: dept.deptCode,
      deptName: dept.deptName,
      sortOrd: dept.sortOrd,
      useYn: dept.useYn === "N" ? "Y" : "N",
    });
    fetchTree();
  };

  const toTreeNodes = (depts: DeptVO[]): DragTreeNode[] =>
    depts.map((d) => ({
      id: d.deptSeq,
      label: d.deptName,
      dimmed: d.useYn === "N",
      children: toTreeNodes(getChildren(d.deptSeq)),
      onAdd: () => { setAdding(d.deptSeq); setNewName(""); if (!expanded.has(d.deptSeq)) toggle(d.deptSeq); },
      actions: [
        { label: "조직명 수정", onClick: () => { setEditingSeq(d.deptSeq); setEditName(d.deptName); } },
        { label: d.useYn === "N" ? "조직보이기" : "조직숨기기", onClick: () => handleHide(d) },
        { label: "조직삭제", variant: "destructive" as const, onClick: () => handleDelete(d) },
      ],
    }));

  const roots = sortedDeptList.filter((d) => !d.parentDeptSeq);
  const allExpanded = expanded.size > 0;

  // 부서명으로 부서 경로(상위 > 하위) 구하기
  const getDeptPath = (deptName: string) => {
    const dept = deptList.find((d) => d.deptName === deptName);
    if (!dept?.deptPath) return deptName || "";
    const seqs = dept.deptPath.split("/").filter(Boolean);
    return seqs.map((seq) => deptList.find((d) => d.deptSeq === seq)?.deptName).filter(Boolean).join(" > ");
  };

  const empItems = (() => {
    let list = showAllEmp
      ? employees
      : selectedDept
        ? employees.filter((e) => e.officeEmployeeDept === selectedDept.deptName)
        : [];
    // 트리 구조 순서로 정렬
    if (showAllEmp && deptList.length > 0) {
      list = [...list].sort((a, b) => {
        const dA = deptList.find((d) => d.deptName === (a.officeEmployeeDept || a.deptName));
        const dB = deptList.find((d) => d.deptName === (b.officeEmployeeDept || b.deptName));
        return (dA?.deptPath || "").localeCompare(dB?.deptPath || "");
      });
    }
    return list.map((emp) => ({
      id: emp.userMstSeq || emp.userInfoSeq || "",
      title: emp.userNameKo,
      subtitle: `${getDeptPath(emp.officeEmployeeDept || emp.deptName || "")} / ${emp.officeEmployeePosition || emp.userPosition || ""}`,
      extra: emp.userEmail,
      image: emp.profileImageUrl || undefined,
    }));
  })();

  return (
    <>
      <PageTitleArea className="pb-2" title="조직도 관리" />
      <FlexBox className="items-stretch gap-4">
        {/* 좌측: 조직 트리 */}
        <section className="flex flex-1 flex-col">
          <FormUnitBox
            title="조직도"
            className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5 inset-shadow-none flex-1"
            vertical
          >
            <FlexBox className="justify-end pb-2">
              <FlexBox className="gap-1">
                <Button size="h28" onClick={() => { setAdding("ROOT"); setNewName(""); }}>
                  <Icons.Plus className="size-3.5" /> 조직추가
                </Button>
                <Button size="h28" onClick={allExpanded ? () => setExpanded(new Set()) : () => setExpanded(new Set(deptList.map((d) => d.deptSeq)))}>
                  <Icons.ListFilter className="size-3.5" /> {allExpanded ? "모두 접기" : "모두 펼치기"}
                </Button>
              </FlexBox>
            </FlexBox>

            <div className="h-[calc(100vh-265px)] overflow-auto">
              <DragTree
                nodes={toTreeNodes(roots)}
                expanded={expanded}
                onToggle={toggle}
                addingId={adding}
                addValue={newName}
                onAddChange={setNewName}
                onAddConfirm={() => adding && !createDeptMutation.isPending && handleAdd(adding === "ROOT" ? null : adding)}
                onAddCancel={() => setAdding(null)}
                addPlaceholder="조직이름 입력"
                editingId={editingSeq}
                editValue={editName}
                onEditChange={setEditName}
                onEditConfirm={() => !updateDeptMutation.isPending && handleRename()}
                onEditCancel={() => setEditingSeq(null)}
                onNodeClick={(id) => {
                  const dept = deptList.find((d) => d.deptSeq === id);
                  if (!dept) return;
                  setSelectedDept(dept);
                  setShowAllEmp(false);
                  // 다른 노드 클릭 시 진행 중이던 추가/수정 인풋 자동 닫기
                  if (adding) { setAdding(null); setNewName(""); }
                  if (editingSeq && editingSeq !== id) {
                    setEditingSeq(null); setEditName("");
                  }
                }}
                selectedId={selectedDept?.deptSeq}
                onReorder={(_parentId, orderedIds) => {
                  reorderMut.mutate(orderedIds, { onSuccess: () => fetchTree() });
                }}
              />
            </div>
          </FormUnitBox>
        </section>

        {/* 우측: 소속 직원 */}
        <section className="flex min-w-0 flex-1 flex-col">
          <SettingsListPanel
            label="직원 목록"
            filterLabel={selectedDept ? selectedDept.deptName : undefined}
            filterButtons={selectedDept && (() => {
              const dept = deptList.find((d) => d.deptSeq === selectedDept.deptSeq);
              if (!dept?.deptPath) return null;
              const seqs = dept.deptPath.split("/").filter(Boolean);
              return seqs.map((seq) => {
                const d = deptList.find((x) => x.deptSeq === seq);
                if (!d) return null;
                const isActive = !showAllEmp && selectedDept.deptSeq === d.deptSeq;
                return (
                  <Button
                    key={d.deptSeq}
                    size="h28"
                    variant={isActive ? "blue" : "outline"}
                    onClick={() => { setSelectedDept(d); setShowAllEmp(false); }}
                  >
                    {d.deptName}
                  </Button>
                );
              });
            })()}
            items={empItems}
            showAll={showAllEmp}
            onShowAll={() => { setShowAllEmp(true); setSelectedDept(null); }}
            searchPlaceholder="이름/이메일 검색"
            emptyMessage="직원이 없습니다."
            showImage
            defaultImage={UserImg}
          />
        </section>
      </FlexBox>
    </>
  );
};

export default DeptTreeList;
