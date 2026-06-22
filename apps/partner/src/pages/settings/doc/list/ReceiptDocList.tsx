import { useMemo, useState } from "react";
import { DataTable } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { useAlertStore } from "@shared/store/useAlertStore";

import DocCategoryTab from "../../_components/common/DocCategoryTab";
import DocEditRow from "../../_components/common/DocEditRow";
import DocEditActions from "../../_components/common/DocEditActions";
import { useDocData } from "../../_components/common/useDocData";
import { SettingsBar, BarSearch } from "../../_components/common/SettingsBar";
import {
  getReceiptColumns,
  getReceiptEditColumns,
  HAS_RIGHT_TYPE,
  type ReceiptDocItem,
} from "./columns/receiptColumnsData";

const createEmpty = (cat: string): ReceiptDocItem => ({
  seq: "",
  category: cat,
  rightType: "",
  name: "",
  auto: false,
  receiptType: "",
  deadline: "",
  deadlineUnit: "",
  extension: "",
  sort: "",
});

const ReceiptDocList = () => {
  const { openAlert } = useAlertStore();
  const doc = useDocData(createEmpty);
  const [edit, setEdit] = useState<ReceiptDocItem>(createEmpty("국내"));

  const showRight = HAS_RIGHT_TYPE.has(doc.activeCategory);

  const set = (f: keyof ReceiptDocItem, v: string | boolean) => setEdit((p) => ({ ...p, [f]: v }));

  const resetEdit = () => setEdit(createEmpty(doc.activeCategory));

  const buildItem = (): ReceiptDocItem => ({
    ...edit,
    category: doc.activeCategory,
  });

  const validate = () => {
    if (!edit.name.trim()) {
      openAlert({ desc: "접수서류명을 입력해주세요." });
      return false;
    }
    return true;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    doc.selectedIndex !== null ? handleUpdate() : handleAdd();
  };

  const handleRowClick = (_r: unknown, rd: ReceiptDocItem) => {
    doc.selectRow(rd);
    setEdit({ ...rd });
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

  const columns = useMemo(() => getReceiptColumns(showRight), [doc.activeCategory]);

  return (
    <>
      <PageTitleArea className="pb-2" title="접수서류 관리" />

      <DocCategoryTab
        active={doc.activeCategory}
        onChange={(cat) => {
          doc.changeCategory(cat);
          setEdit(createEmpty(cat));
        }}
      />

      <SettingsBar onReset={() => doc.setSearchKeyword("")}>
        <BarSearch
          value={doc.searchKeyword}
          onChange={doc.setSearchKeyword}
        />
      </SettingsBar>

      <DocEditRow
        columns={getReceiptEditColumns({
          category: doc.activeCategory,
          showRight,
          edit,
          set,
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
        columns={columns}
        className="overflow-auto"
        onRowClick={handleRowClick}
      />
    </>
  );
};

export default ReceiptDocList;
