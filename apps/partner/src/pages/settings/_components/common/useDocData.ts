import { useState } from "react";
import { CATEGORIES } from "./DocCategoryTab";

/**
 * 카테고리별 데이터 관리 + 검색 + 선택 상태 공통 훅
 */
export const useDocData = <T extends { name: string }>(createEmpty: (cat: string) => T) => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [dataMap, setDataMap] = useState<Record<string, T[]>>(
    () => Object.fromEntries(CATEGORIES.map((c) => [c, []])),
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const data = dataMap[activeCategory] ?? [];
  const filteredData = searchKeyword
    ? data.filter((item) => item.name.includes(searchKeyword))
    : data;

  const setData = (updater: (prev: T[]) => T[]) =>
    setDataMap((prev) => ({ ...prev, [activeCategory]: updater(prev[activeCategory] ?? []) }));

  const changeCategory = (cat: string) => {
    setActiveCategory(cat);
    setSearchKeyword("");
    setSelectedIndex(null);
  };

  const selectRow = (rowData: T) => {
    setSelectedIndex(data.indexOf(rowData));
    return { ...rowData };
  };

  const addRow = (item: T) => {
    setData((prev) => [...prev, item]);
    setSelectedIndex(data.length);
  };

  const updateRow = (item: T) => {
    if (selectedIndex === null) return false;
    setData((prev) => prev.map((r, i) => (i === selectedIndex ? item : r)));
    return true;
  };

  const deleteRow = () => {
    if (selectedIndex === null) return false;
    setData((prev) => prev.filter((_, i) => i !== selectedIndex));
    setSelectedIndex(null);
    return true;
  };

  return {
    activeCategory,
    changeCategory,
    data,
    filteredData,
    selectedIndex,
    searchKeyword,
    setSearchKeyword,
    selectRow,
    addRow,
    updateRow,
    deleteRow,
  };
};
