import { useState } from "react";
import { DataTable } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { useAlertStore } from "@shared/store/useAlertStore";

import DocCategoryTab from "../../_components/common/DocCategoryTab";
import DocEditRow from "../../_components/common/DocEditRow";
import DocEditActions from "../../_components/common/DocEditActions";
import { useDocData } from "../../_components/common/useDocData";
import { SettingsBar, BarSearch } from "../../_components/common/SettingsBar";
import { submitColumns, getSubmitEditColumns, type DocItem } from "./columns/submitColumnsData";

const createEmpty = (cat: string): DocItem => ({
  seq: "",
  category: cat,
  name: "",
  sort: "",
});

const DocumentList = () => {
  const { openAlert } = useAlertStore();
  const doc = useDocData(createEmpty);
  const [editName, setEditName] = useState("");
  const [editSort, setEditSort] = useState("");

  const resetEdit = () => {
    setEditName("");
    setEditSort("");
  };

  const buildItem = (): DocItem => ({
    seq: "",
    category: doc.activeCategory,
    name: editName.trim(),
    sort: editSort,
  });

  const validate = () => {
    if (!editName.trim()) {
      openAlert({ desc: "제출서류명을 입력해주세요." });
      return false;
    }
    return true;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    doc.selectedIndex !== null ? handleUpdate() : handleAdd();
  };

  const handleRowClick = (_r: unknown, rd: DocItem) => {
    const s = doc.selectRow(rd);
    setEditName(s.name);
    setEditSort(s.sort ?? "");
  };

  const handleAdd = () => {
    if (!validate()) return;
    doc.addRow(buildItem());
    resetEdit();
  };

  const handleUpdate = () => {
    if (!validate()) return;
    if (!doc.updateRow(buildItem())) {
      openAlert({ desc: "수정할 항목을 선택해주세요." });
    }
  };

  const handleDelete = () => {
    if (!doc.deleteRow()) {
      openAlert({ desc: "삭제할 항목을 선택해주세요." });
      return;
    }
    resetEdit();
  };

  return (
    <>
      <PageTitleArea className="pb-2" title="제출서류 관리" />

      <DocCategoryTab
        active={doc.activeCategory}
        onChange={(cat) => {
          doc.changeCategory(cat);
          resetEdit();
        }}
      />

      <SettingsBar onReset={() => doc.setSearchKeyword("")}>
        <BarSearch
          value={doc.searchKeyword}
          onChange={doc.setSearchKeyword}
        />
      </SettingsBar>

      <DocEditRow
        columns={getSubmitEditColumns({
          category: doc.activeCategory,
          name: editName,
          sort: editSort,
          setName: setEditName,
          setSort: setEditSort,
          onKeyDown: handleKeyDown,
        })}
      />

      <DocEditActions
        totalCount={doc.filteredData.length}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        disableEdit={doc.selectedIndex === null}
      />

      <DataTable
        data={doc.filteredData}
        columns={submitColumns}
        className="overflow-auto"
        onRowClick={handleRowClick}
      />
    </>
  );
};

export default DocumentList;
