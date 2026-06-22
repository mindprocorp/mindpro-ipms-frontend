import { useEffect, useMemo, useState } from "react";
import { Button, DataTable, FlexBox, Icons, Input, RHF } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import ListResultHeader from "@shared/ui/ListResultHeader";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useAlertStore } from "@shared/store/useAlertStore";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";

import { commonQueries } from "@shared/query/common/queries";
import { groupFormSchema, type GroupFormInput } from "../schema/commonCodeSchema";
import {
  type CodeMasterItem,
  type CodeDetail,
  type CodeDtlSaveVO,
} from "@shared/api/common/commApi";
import { masterColumnsData } from "./columns/columnsData";
import SelectBox from "../../_components/common/SelectBox";

/**
 * 공통코드 관리 — utb_code_mst(그룹) + utb_code_dtl(상세) 단일 테이블 세트.
 * 행 단위 인라인 편집 + 즉시 저장(단건 호출). rowStatus는 백엔드 호환을 위해 페이로드에서만 사용.
 */
const CommonCodeList = () => {
  const { openAlert } = useAlertStore();

  const form = useForm<GroupFormInput>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: { searchKeyword: "", grpCd: "", cdNm: "", useYn: "Y", delYn: "N", note: "" },
  });

  const [masterList, setMasterList] = useState<CodeMasterItem[]>([]);
  const [detailList, setDetailList] = useState<CodeDetail[]>([]);
  const [selectedItem, setSelectedItem] = useState<CodeMasterItem | null>(null);

  const selectedGrpCd = selectedItem?.grpCd ?? "";

  const masterMutation = useMutation(commonQueries.getCodeMaster());
  const detailMutation = useMutation(commonQueries.getCodeDetail());
  const saveGroupMutation = useMutation(commonQueries.saveCodeGroup());
  const saveDetailMutation = useMutation(commonQueries.saveCodeDetail());
  const deleteGroupMutation = useMutation(commonQueries.deleteCodeGroup());

  const fetchMasterList = (syncGrpCd?: string) => {
    masterMutation.mutate(undefined, {
      onSuccess: (data) => {
        if (!Array.isArray(data)) return;
        setMasterList(data);
        if (syncGrpCd) {
          const match = data.find((m) => m.grpCd === syncGrpCd);
          if (match) {
            setSelectedItem(match);
            form.reset({
              searchKeyword: form.getValues("searchKeyword"),
              grpCd: match.grpCd,
              cdNm: match.cdNm,
              useYn: match.useYn || "Y",
              delYn: match.delYn || "N",
              note: match.note || "",
            });
            fetchDetailList(match.grpCd);
          }
        }
      },
    });
  };

  const fetchDetailList = (grpCd: string) => {
    detailMutation.mutate(grpCd, {
      onSuccess: (data) => Array.isArray(data) && setDetailList(data),
    });
  };

  useEffect(() => { fetchMasterList(); }, []);

  // ── 그룹 ─────────────────────────────────────────

  const handleRowClick = (_row: unknown, item: CodeMasterItem) => {
    setSelectedItem(item);
    form.reset({
      searchKeyword: form.getValues("searchKeyword"),
      grpCd: item.grpCd,
      cdNm: item.cdNm,
      useYn: item.useYn || "Y",
      delYn: item.delYn || "N",
      note: item.note || "",
    });
    fetchDetailList(item.grpCd);
  };

  const handleNewGroup = () => {
    setSelectedItem(null);
    form.reset({
      searchKeyword: form.getValues("searchKeyword"),
      grpCd: "",
      cdNm: "",
      useYn: "Y",
      delYn: "N",
      note: "",
    });
    setDetailList([]);
  };

  const handleDeleteGroup = () => {
    if (!selectedItem?.codeSeq) return;
    openAlert({
      message: `[${selectedItem.cdNm}] 코드 분류를 삭제하시겠습니까?\n하위 상세 코드도 모두 함께 삭제됩니다.`,
      type: "confirm",
      onConfirm: () => {
        deleteGroupMutation.mutate(selectedItem.codeSeq, {
          onSuccess: () => {
            openAlert({ message: "삭제되었습니다." });
            setSelectedItem(null);
            setDetailList([]);
            form.reset({ searchKeyword: form.getValues("searchKeyword"), grpCd: "", cdNm: "", useYn: "Y", delYn: "N", note: "" });
            fetchMasterList();
          },
          onError: () => openAlert({ message: "삭제에 실패했습니다." }),
        });
      },
    });
  };

  const handleSaveGroup = () => {
    const { grpCd, cdNm, useYn, note } = form.getValues();
    if (!grpCd?.trim() || !cdNm?.trim()) {
      openAlert({ message: "분류코드와 코드명을 입력해주세요." });
      return;
    }
    // codeSeq 문자열을 그대로 활용. 신규는 null → INSERT, 기존은 값 → UPDATE
    const groupSeq = selectedItem
      ? Number(selectedItem.codeSeq.replace(/\D/g, "")) || null
      : null;
    // delYn은 순수 삭제 마커이므로 항상 'N'으로 저장. 사용여부는 useYn으로 분리.
    saveGroupMutation.mutate(
      { groupSeq, groupCode: grpCd, groupName: cdNm, useYn: useYn || "Y", delYn: "N", note },
      {
        onSuccess: () => {
          openAlert({ message: "저장되었습니다." });
          fetchMasterList(grpCd);
        },
        onError: () => openAlert({ message: "저장에 실패했습니다." }),
      },
    );
  };

  // ── 디테일 (행 단위 즉시 CRUD) ─────────────────────

  /** 단건 페이로드를 [1건] 배열로 보냄 — 백엔드 일괄 API 그대로 사용 */
  const callDetailMut = (vo: CodeDtlSaveVO, successMsg: string, onDone?: () => void) => {
    saveDetailMutation.mutate([vo], {
      onSuccess: () => {
        openAlert({ message: successMsg });
        fetchDetailList(selectedGrpCd);
        onDone?.();
      },
      onError: () => openAlert({ message: "저장에 실패했습니다." }),
    });
  };

  // 백엔드 OffsetDateTime 파싱 호환성을 위해 createAt/updateAt 등 timestamp 필드는 보내지 않음.
  // (백엔드가 CURRENT_TIMESTAMP / JWT 사용자로 자동 세팅)
  const buildPayload = (row: CodeDetail, rowStatus: "I" | "U" | "D"): CodeDtlSaveVO => ({
    codeSeq: row.codeSeq,
    grpCd: row.grpCd,
    dtlCd: row.dtlCd,
    cdNm: row.cdNm,
    kipoCd: row.kipoCd,
    refVal1: row.refVal1,
    refVal2: row.refVal2,
    dispOrd: row.dispOrd,
    useYn: row.useYn || "Y",
    delYn: "N",  // del_yn은 순수 삭제 마커. 삭제는 rowStatus="D"로만 처리.
    note: row.note,
    rowStatus,
  } as CodeDtlSaveVO);

  const [draft, setDraft] = useState<CodeDetail | null>(null);

  const handleAddNewDraft = () => {
    if (!selectedGrpCd) {
      openAlert({ message: "좌측에서 코드분류를 선택해주세요." });
      return;
    }
    setDraft({
      codeSeq: "", grpCd: selectedGrpCd, dtlCd: "", cdNm: "", kipoCd: "",
      refVal1: null, refVal2: null,
      dispOrd: detailList.length + 1, useYn: "Y", note: "",
      createUser: null, createAt: null, updateUser: null, updateAt: null,
    });
  };

  /** 전체 저장 — 그리드의 모든 행 UPDATE + draft가 있으면 INSERT 한 번에 전송 */
  const handleSaveAll = () => {
    if (!selectedGrpCd) {
      openAlert({ message: "좌측에서 코드분류를 선택해주세요." });
      return;
    }
    const payload: CodeDtlSaveVO[] = [];

    // 기존 행 UPDATE
    for (const row of detailList) {
      if (!row.dtlCd?.trim() || !row.cdNm?.trim()) {
        openAlert({ message: "상세코드/코드명이 비어있는 행이 있습니다." });
        return;
      }
      payload.push(buildPayload(row, "U"));
    }
    // 신규 draft INSERT
    if (draft) {
      if (!draft.dtlCd?.trim() || !draft.cdNm?.trim()) {
        openAlert({ message: "신규 행의 상세코드와 코드명을 입력해주세요." });
        return;
      }
      payload.push(buildPayload(draft, "I"));
    }

    if (payload.length === 0) {
      openAlert({ message: "저장할 변경 내역이 없습니다." });
      return;
    }

    saveDetailMutation.mutate(payload, {
      onSuccess: () => {
        openAlert({ message: "저장되었습니다." });
        setDraft(null);
        fetchDetailList(selectedGrpCd);
      },
      onError: () => openAlert({ message: "저장에 실패했습니다." }),
    });
  };

  const handleDeleteRow = (row: CodeDetail) => {
    openAlert({
      message: `[${row.dtlCd}] 항목을 삭제하시겠습니까?`,
      type: "confirm",
      onConfirm: () => callDetailMut(buildPayload(row, "D"), "삭제되었습니다."),
    });
  };

  const updateDraftField = (field: keyof CodeDetail, value: any) =>
    setDraft((prev) => prev ? { ...prev, [field]: value } : prev);

  const updateRowField = (rowIdx: number, field: keyof CodeDetail, value: any) =>
    setDetailList((prev) => prev.map((r, i) => (i === rowIdx ? { ...r, [field]: value } : r)));

  // ── 컬럼 정의 — 인라인 편집 + 행 액션 (수정/삭제) ────

  const detailColumns: ColumnDef<CodeDetail>[] = useMemo(() => [
    { accessorKey: "dtlCd", header: "상세코드", size: 100, cell: ({ row }) => (
      <Input value={row.original.dtlCd} onChange={(e) => updateRowField(row.index, "dtlCd", e.target.value)} />
    )},
    { accessorKey: "cdNm", header: "코드명", size: 150, cell: ({ row }) => (
      <Input value={row.original.cdNm} onChange={(e) => updateRowField(row.index, "cdNm", e.target.value)} />
    )},
    { accessorKey: "kipoCd", header: "KIPO코드", size: 100, cell: ({ row }) => (
      <Input value={row.original.kipoCd} onChange={(e) => updateRowField(row.index, "kipoCd", e.target.value)} />
    )},
    { accessorKey: "refVal1", header: "참조값1", size: 100, cell: ({ row }) => (
      <Input value={row.original.refVal1 || ""} onChange={(e) => updateRowField(row.index, "refVal1", e.target.value)} />
    )},
    { accessorKey: "refVal2", header: "참조값2", size: 100, cell: ({ row }) => (
      <Input value={row.original.refVal2 || ""} onChange={(e) => updateRowField(row.index, "refVal2", e.target.value)} />
    )},
    { accessorKey: "dispOrd", header: "정렬", size: 70, cell: ({ row }) => (
      <Input type="number" value={row.original.dispOrd}
        onChange={(e) => updateRowField(row.index, "dispOrd", Number(e.target.value) || 0)} />
    )},
    { accessorKey: "useYn", header: "사용", size: 70, cell: ({ row }) => (
      <SelectBox value={row.original.useYn || "Y"}
        onChange={(v) => updateRowField(row.index, "useYn", v)}
        options={[{ label: "Y", value: "Y" }, { label: "N", value: "N" }]}
        className="h-7 w-full text-xs" />
    )},
    { accessorKey: "note", header: "비고", size: 150, cell: ({ row }) => (
      <Input value={row.original.note || ""} onChange={(e) => updateRowField(row.index, "note", e.target.value)} />
    )},
    {
      id: "actions", header: "", size: 60,
      cell: ({ row }) => (
        <FlexBox className="gap-1 justify-center">
          <Button size="icon-xs" variant="outline-pink" onClick={() => handleDeleteRow(row.original)}>
            <Icons.Trash2 className="size-3.5" />
          </Button>
        </FlexBox>
      ),
    },
  ], [detailList]);

  const searchKeyword = form.watch("searchKeyword");
  const filteredMasterList = searchKeyword
    ? masterList.filter((i) =>
        i.grpCd.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        i.cdNm.toLowerCase().includes(searchKeyword.toLowerCase()))
    : masterList;

  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <PageTitleArea className="pb-2" title="공통코드 관리" />
        <FlexBox className="gap-4">
          {/* 좌측: 그룹 그리드 */}
          <section className="w-[35%]">
            <FormUnitBox
              title="코드분류 내역"
              className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5 inset-shadow-none"
              vertical
            >
              <FlexBox className="justify-between pb-2">
                <RHF.Input control={form.control} name="searchKeyword"
                  placeholder="코드분류/명" orientation="horizontal" className="w-50" />
                <Button size="h28" variant="outline-pink" onClick={handleNewGroup}>
                  <Icons.Plus className="size-3.5" /> 신규분류
                </Button>
              </FlexBox>
              <DataTable
                data={filteredMasterList}
                columns={masterColumnsData}
                className="h-[calc(100vh-265px)] overflow-auto"
                onRowClick={handleRowClick}
                getRowId={(row) => row.codeSeq}
                rowSelection={selectedItem ? { [selectedItem.codeSeq]: true } : {}}
              />
            </FormUnitBox>
          </section>

          {/* 우측: 그룹 폼 + 디테일 그리드 */}
          <section className="flex min-w-0 flex-1 flex-col gap-4">
            <FormUnitBox title="코드분류" className="inset-shadow-none" vertical>
              <div className="mb-2 flex items-center gap-2">
                {selectedItem ? (
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                    <Icons.Pencil className="mr-1 inline size-3" /> 수정 — {selectedItem.grpCd}
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                    <Icons.Plus className="mr-1 inline size-3" /> 신규 등록
                  </span>
                )}
              </div>
              <FlexBox className="items-end gap-2">
                <RHF.Input control={form.control} name="grpCd" label="분류코드" disabled={!!selectedItem} />
                <RHF.Input control={form.control} name="cdNm" label="코드명" />
                <RHF.FormSelect control={form.control} name="useYn"
                  items={[{ label: "사용", value: "Y" }, { label: "미사용", value: "N" }]}
                  label="사용여부" />
                <Button size="h28" variant="blue" onClick={handleSaveGroup}
                  disabled={saveGroupMutation.isPending} className="shrink-0">
                  <Icons.CloudUpload className="size-3.5" />
                  {selectedItem ? "수정" : "저장"}
                </Button>
                {selectedItem && (
                  <Button size="h28" variant="outline-pink" onClick={handleDeleteGroup}
                    disabled={deleteGroupMutation.isPending} className="shrink-0">
                    <Icons.Trash2 className="size-3.5" /> 삭제
                  </Button>
                )}
              </FlexBox>
              <RHF.FormTextarea control={form.control} name="note" label="비고" className="min-h-[80px]" />
            </FormUnitBox>

            <FormUnitBox title="코드관리 목록" className="inset-shadow-none" vertical>
              <FlexBox className="justify-between pb-2">
                <ListResultHeader totalCount={detailList.length} />
                <FlexBox className="gap-1">
                  <Button size="h28" variant="blue" onClick={handleSaveAll}
                    disabled={!selectedGrpCd || saveDetailMutation.isPending}>
                    <Icons.CloudUpload className="size-3.5" /> 저장
                  </Button>
                  <Button size="h28" onClick={handleAddNewDraft} disabled={!selectedGrpCd || !!draft}>
                    <Icons.Plus className="size-3.5" /> 행추가
                  </Button>
                </FlexBox>
              </FlexBox>

              {/* 신규 입력 행 (단일) */}
              {draft && (
                <div className="border bg-amber-50/50 dark:bg-amber-500/10 p-2 mb-2 rounded-md">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                      <Icons.Plus className="mr-0.5 inline size-2.5" /> 신규 등록
                    </span>
                    <span className="text-[10px] text-muted-foreground">입력 후 상단 [저장] 버튼을 눌러주세요.</span>
                  </div>
                  <FlexBox className="gap-1 items-center">
                    <Input placeholder="상세코드*" value={draft.dtlCd}
                      onChange={(e) => updateDraftField("dtlCd", e.target.value)} className="w-24" />
                    <Input placeholder="코드명*" value={draft.cdNm}
                      onChange={(e) => updateDraftField("cdNm", e.target.value)} className="w-32" />
                    <Input placeholder="KIPO" value={draft.kipoCd}
                      onChange={(e) => updateDraftField("kipoCd", e.target.value)} className="w-20" />
                    <Input placeholder="참조1" value={draft.refVal1 || ""}
                      onChange={(e) => updateDraftField("refVal1", e.target.value)} className="w-20" />
                    <Input placeholder="참조2" value={draft.refVal2 || ""}
                      onChange={(e) => updateDraftField("refVal2", e.target.value)} className="w-20" />
                    <Input type="number" placeholder="순서" value={draft.dispOrd}
                      onChange={(e) => updateDraftField("dispOrd", Number(e.target.value) || 0)} className="w-16" />
                    <SelectBox value={draft.useYn || "Y"}
                      onChange={(v) => updateDraftField("useYn", v)}
                      options={[{ label: "Y", value: "Y" }, { label: "N", value: "N" }]}
                      className="h-7 w-16 text-xs" />
                    <Input placeholder="비고" value={draft.note || ""}
                      onChange={(e) => updateDraftField("note", e.target.value)} className="flex-1" />
                    <Button size="icon-xs" variant="outline" onClick={() => setDraft(null)} title="신규 행 취소">
                      <Icons.X className="size-3.5" />
                    </Button>
                  </FlexBox>
                </div>
              )}

              <DataTable
                data={detailList}
                columns={detailColumns}
                className="h-[calc(100vh-510px)] overflow-auto"
                getRowId={(row) => row.codeSeq}
              />
            </FormUnitBox>
          </section>
        </FlexBox>
      </form>
    </FormProvider>
  );
};

export default CommonCodeList;
