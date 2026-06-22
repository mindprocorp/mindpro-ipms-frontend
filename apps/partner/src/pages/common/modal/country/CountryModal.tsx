import { DataTable, FormDialog, InputGroup, InputGroupInput } from "@repo/ui";
import { columnsData } from "./columns/columnsData";
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries.ts";

export type CountryData = {
  countryCode: string;
  countryNameKo: string;
  countryNameEn: string;
};

type CountryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: CountryData[]) => void;
  multiSelect?: boolean;
};

export const CountryModal = ({
  open,
  onOpenChange,
  onSuccess,
  multiSelect = false,
}: CountryModalProps) => {
  const [search, setSearch] = useState("");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [countries, setCountries] = useState<CountryData[]>([]);

  const getCountryListMutation = useMutation(commonQueries.getCountryList());

  useEffect(() => {
    if (open && countries.length === 0) {
      getCountryListMutation.mutate(undefined, {
        onSuccess: (response) => {
          const mapped: CountryData[] = (response.data ?? []).map((item) => ({
            countryCode: item.id,
            countryNameKo: item.label,
            countryNameEn: item.attributes ?? "",
          }));
          setCountries(mapped);
        },
      });
    }
  }, [open]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return countries;
    const keyword = search.trim().toLowerCase();
    return countries.filter(
      (c) =>
        c.countryCode.toLowerCase().includes(keyword) ||
        c.countryNameKo.includes(keyword) ||
        c.countryNameEn.toLowerCase().includes(keyword),
    );
  }, [search, countries]);

  function handleSubmit() {
    const selectedItems = Object.entries(rowSelection)
      .filter(([, selected]) => selected)
      .map(([index]) => filteredData[Number(index)])
      .filter(Boolean) as CountryData[];

    if (selectedItems.length > 0) {
      onSuccess?.(selectedItems);
    }
    onOpenChange(false);
    setRowSelection({});
    setSearch("");
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setSearch("");
      setRowSelection({});
    }
    onOpenChange(isOpen);
  }

  return (
    <FormDialog
      title="국가코드 선택"
      open={open}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      submitText="확인"
      className="max-w-150!"
      bodyFull
    >
      <div className="border-border-100 dark:border-input border-t px-4 pt-3 pb-2">
        <InputGroup className="w-60">
          <InputGroupInput
            placeholder="국가코드 또는 국가명 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>
      <DataTable
        data={filteredData}
        columns={columnsData}
        className="h-80"
        size="sm"
        enableRowSelection
        enableMultiRowSelection={multiSelect}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        isLoading={getCountryListMutation.isPending}
      />
    </FormDialog>
  );
};
