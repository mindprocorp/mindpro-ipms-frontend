import { useState, useEffect, useMemo } from "react";
import { Button, DataTable, Icons } from "@repo/ui";
import DataMenuButton from "@shared/ui/DataMenuButton";
import PageTitleArea from "@shared/ui/PageTitleArea";
import ListResultHeader from "@shared/ui/ListResultHeader";
import { orgQueries, formTemplateQueries } from "@shared/query/organization/queries";
import { useAlertStore } from "@shared/store/useAlertStore";

import { useMutation } from "@tanstack/react-query";
import type { OfficeCodeVO } from "@shared/api/organization/orgApi";
import type { FormTemplateVO } from "@shared/api/organization/formTemplateApi";
import { CODE_CLASS } from "@shared/enum/organizationType";
import { SettingsBar, BarSearch, BarLabel } from "../../_components/common/SettingsBar";
import SelectBox from "../../_components/common/SelectBox";
import { getColumnsData } from "./columns/columnsData";
import FormTemplateWizard from "../detail/FormTemplateWizard";
import FormPreviewModal from "../editor/FormPreviewModal";

const FormTemplateList = () => {
  const { openAlert } = useAlertStore();
  const getListMutation = useMutation(formTemplateQueries.getList());
  const deleteMutation = useMutation(formTemplateQueries.delete());
  const saveMutation = useMutation(formTemplateQueries.save());
  const getCodeListMutation = useMutation(orgQueries.getOfficeCodeList());

  const [list, setList] = useState<FormTemplateVO[]>([]);
  const [categories, setCategories] = useState<OfficeCodeVO[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editSeq, setEditSeq] = useState<string | undefined>();
  const [previewSeq, setPreviewSeq] = useState<string | null>(null);

  const fetchList = async () => {
    setList(await getListMutation.mutateAsync({}));
  };

  useEffect(() => {
    fetchList();
    getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.FORM_CATEGORY }).then(setCategories);
  }, []);

  const handleDelete = (item: FormTemplateVO) => {
    openAlert({
      title: "서식 삭제",
      message: <p className="text-sm">"{item.templateName}"을(를) 삭제하시겠습니까?</p>,
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => { await deleteMutation.mutateAsync(item.formTemplateSeq!); fetchList(); },
    });
  };

  const handleCellSave = async (item: FormTemplateVO, updates: Partial<FormTemplateVO>) => {
    await saveMutation.mutateAsync({ ...item, ...updates } as FormTemplateVO);
    fetchList();
  };

  const filteredList = useMemo(() => {
    let result = list;
    if (filterCat) result = result.filter((t) => t.categoryCode === filterCat);
    const kw = searchText.trim().toLowerCase();
    if (kw) result = result.filter((t) => t.templateName?.toLowerCase().includes(kw));
    return result;
  }, [list, filterCat, searchText]);

  const columns = useMemo(
    () => getColumnsData(
      filteredList.length,
      (seq) => { setEditSeq(seq); setWizardOpen(true); },
      handleDelete,
      handleCellSave,
      (seq) => setPreviewSeq(seq),
    ),
    [list],
  );

  if (wizardOpen) {
    return (
      <FormTemplateWizard
        editSeq={editSeq}
        onClose={() => { setWizardOpen(false); setEditSeq(undefined); }}
        onSaved={() => { setWizardOpen(false); setEditSeq(undefined); fetchList(); }}
      />
    );
  }

  return (
    <>
      <PageTitleArea className="pb-2" title="서식 템플릿">
        <DataMenuButton data={filteredList} fileName="서식템플릿" columns={columns} />
      </PageTitleArea>

      <SettingsBar onReset={() => { setFilterCat(""); setSearchText(""); }}>
        <BarLabel>카테고리</BarLabel>
        <SelectBox value={filterCat} onChange={setFilterCat} placeholder="전체" options={[{ label: "전체", value: "" }, ...categories.map((c) => ({ label: c.codeName, value: c.officeCode }))]} className="w-36" />
        <BarLabel>서식명</BarLabel>
        <BarSearch value={searchText} onChange={setSearchText} />
      </SettingsBar>

      <ListResultHeader totalCount={filteredList.length}>
        <Button size="h28" onClick={() => { setEditSeq(undefined); setWizardOpen(true); }}>
          <Icons.Plus className="size-3.5" /> 서식 템플릿 만들기
        </Button>
      </ListResultHeader>

      <DataTable data={filteredList} columns={columns} className="overflow-auto" />

      <FormPreviewModal
        open={!!previewSeq}
        onClose={() => setPreviewSeq(null)}
        formTemplateSeq={previewSeq || undefined}
      />
    </>
  );
};

export default FormTemplateList;
