import { useState, useEffect, useMemo, useCallback } from "react";
import { Button, DataTable, Icons } from "@repo/ui";
import DataMenuButton from "@shared/ui/DataMenuButton";
import PageTitleArea from "@shared/ui/PageTitleArea";
import ListResultHeader from "@shared/ui/ListResultHeader";
import { orgQueries, apprTemplateQueries } from "@shared/query/organization/queries";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useMutation } from "@tanstack/react-query";
import { apprTemplateApi } from "@shared/api/organization/apprTemplateApi";
import type { ApprTemplateVO } from "@shared/api/organization/apprTemplateApi";
import type { OfficeCodeVO } from "@shared/api/organization/orgApi";
import { apiClient } from "@shared/api/client";
import { CODE_CLASS } from "@shared/enum/organizationType";
import { SettingsBar, BarSearch, BarLabel } from "../../_components/common/SettingsBar";
import { getColumnsData } from "./columns/columnsData";
import ApprTemplateEdit from "../detail/ApprTemplateEdit";

const api = apprTemplateApi(apiClient);

const ApprTemplateList = () => {
  const { openAlert } = useAlertStore();
  const user = useAuthStore((s) => s.user);
  const getListMutation = useMutation(apprTemplateQueries.getList());
  const saveMutation = useMutation(apprTemplateQueries.save());
  const deleteMutation = useMutation(apprTemplateQueries.delete());
  const getCodeListMutation = useMutation(orgQueries.getOfficeCodeList());

  const [list, setList] = useState<ApprTemplateVO[]>([]);
  const [searchText, setSearchText] = useState("");
  const [editData, setEditData] = useState<ApprTemplateVO | null>(null);
  const [stepTypes, setStepTypes] = useState<OfficeCodeVO[]>([]);

  const fetchList = useCallback(async () => {
    try {
      const data = await getListMutation.mutateAsync({});
      const details = await Promise.all(
        data
          .filter((it) => it.apprTemplateSeq)
          .map((it) => api.getDetail(it.apprTemplateSeq!).catch(() => null)),
      );
      const dm: Record<string, ApprTemplateVO> = {};
      for (const d of details) {
        if (d?.apprTemplateSeq) dm[d.apprTemplateSeq] = d;
      }
      setList(data.map((item) => {
        const detail = dm[item.apprTemplateSeq || ""];
        return detail ? { ...item, lines: detail.lines } : item;
      }));
    } catch {
      openAlert({ message: "목록 조회에 실패했습니다." });
    }
  }, []);

  useEffect(() => {
    fetchList();
    getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.APPROVAL_TYPE }).then(setStepTypes);
  }, []);

  const handleEdit = useCallback(async (seq: string) => {
    try {
      setEditData(await api.getDetail(seq));
    } catch {
      openAlert({ message: "상세 조회에 실패했습니다." });
    }
  }, []);

  const handleSave = async (data: ApprTemplateVO) => {
    if (!data.templateName.trim()) {
      openAlert({ message: "결재선명을 입력해주세요." });
      return;
    }
    try {
      const userId = user?.userId || "";
      await saveMutation.mutateAsync({ ...data, createUser: userId, updateUser: userId });
      setEditData(null);
      fetchList();
    } catch {
      openAlert({ message: "저장에 실패했습니다." });
    }
  };

  const handleDelete = useCallback((t: ApprTemplateVO) => {
    openAlert({
      title: "결재선 삭제",
      message: <p className="text-sm">"{t.templateName}"을(를) 삭제하시겠습니까?</p>,
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(t.apprTemplateSeq!);
          fetchList();
        } catch {
          openAlert({ message: "삭제에 실패했습니다." });
        }
      },
    });
  }, [fetchList]);

  const handleCreate = () => {
    setEditData({
      templateName: "",
      lines: [{ stepOrder: "1", stepType: "DRAFT", stepName: "기안" }],
    });
  };

  const filteredList = useMemo(() => {
    const kw = searchText.trim().toLowerCase();
    if (!kw) return list;
    return list.filter((t) => t.templateName?.toLowerCase().includes(kw));
  }, [list, searchText]);

  const columns = useMemo(
    () => getColumnsData(handleEdit, handleDelete, filteredList.length),
    [filteredList, handleEdit, handleDelete],
  );

  if (editData) {
    return <ApprTemplateEdit data={editData} stepTypes={stepTypes} onSave={handleSave} onCancel={() => setEditData(null)} />;
  }

  return (
    <>
      <PageTitleArea className="pb-2" title="결재선 템플릿">
        <DataMenuButton data={filteredList} fileName="결재선템플릿" columns={columns} />
      </PageTitleArea>

      <SettingsBar onReset={() => setSearchText("")}>
        <BarLabel>결재선 명</BarLabel>
        <BarSearch value={searchText} onChange={setSearchText} />
      </SettingsBar>

      <ListResultHeader totalCount={filteredList.length}>
        <Button size="h28" onClick={handleCreate}>
          <Icons.Plus className="size-3.5" /> 결재선 템플릿 만들기
        </Button>
      </ListResultHeader>

      <DataTable data={filteredList} columns={columns} className="overflow-auto" />
    </>
  );
};

export default ApprTemplateList;
