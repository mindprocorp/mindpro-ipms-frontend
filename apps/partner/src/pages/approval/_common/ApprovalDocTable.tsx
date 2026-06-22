import { useState, useEffect } from "react";
import { DataTable } from "@repo/ui";
import { useMutation } from "@tanstack/react-query";
import PageTitleArea from "@shared/ui/PageTitleArea";
import ListResultHeader from "@shared/ui/ListResultHeader";
import DataMenuButton from "@shared/ui/DataMenuButton";
import { SettingsBar, BarSearch, BarLabel } from "@pages/settings/_components/common/SettingsBar";
import type { ColumnDef } from "@tanstack/react-table";
import type { ApprDocVO } from "@shared/api/approval/approvalApi";
import ApprDocDetailModal from "./ApprDocDetailModal";
import { DOC_STATUS_LABEL, formatDate } from "./constants";

export type { ApprDocVO };

export const buildDocColumns = (onRowClick: (doc: ApprDocVO) => void): ColumnDef<ApprDocVO>[] => [
  { accessorKey: "docNo", header: "문서번호", size: 140 },
  {
    accessorKey: "docTitle", header: "제목", size: 260,
    cell: ({ row, getValue }) => (
      <button type="button" onClick={() => onRowClick(row.original)}
        className="text-left text-primary font-medium hover:underline">
        {getValue() as string}
      </button>
    ),
  },
  { accessorKey: "drafterName", header: "기안자", size: 70 },
  { accessorKey: "draftDeptName", header: "기안부서", size: 90 },
  { accessorKey: "formTemplateName", header: "서식", size: 110 },
  {
    accessorKey: "docStatus", header: "상태", size: 80,
    cell: ({ getValue }) => {
      const v = getValue() as string;
      const info = DOC_STATUS_LABEL[v] || { label: v, cls: "text-muted-foreground" };
      return <span className={`text-xs font-medium ${info.cls}`}>{info.label}</span>;
    },
  },
  {
    id: "date", header: "일시", size: 100,
    cell: ({ row }) => formatDate(row.original.submitAt || row.original.completeAt || row.original.createAt),
  },
];

interface Props {
  title: string;
  description?: string;
  fetchFn: (keyword?: string) => Promise<ApprDocVO[]>;
  mode?: "view" | "pending";
}

const ApprovalDocTable = ({ title, description, fetchFn, mode = "view" }: Props) => {
  const [data, setData] = useState<ApprDocVO[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedDocSeq, setSelectedDocSeq] = useState<string | null>(null);

  const listMut = useMutation({ mutationFn: (keyword?: string) => fetchFn(keyword) });

  const load = (kw?: string) => {
    listMut.mutate(kw, {
      onSuccess: setData,
      onError: () => setData([]),
    });
  };

  useEffect(() => { load(); }, []);

  const columns = buildDocColumns((doc) => setSelectedDocSeq(doc.docSeq || null));

  return (
    <>
      <PageTitleArea className="pb-2" title={title}>
        <DataMenuButton data={data} fileName="결재문서" columns={columns} />
      </PageTitleArea>
      {description && <p className="-mt-1 mb-2 text-xs text-muted-foreground">{description}</p>}

      <SettingsBar
        onSearch={() => load(searchText)}
        onReset={() => { setSearchText(""); load(); }}
      >
        <BarLabel>검색</BarLabel>
        <BarSearch
          value={searchText}
          onChange={setSearchText}
          onKeyDown={(e) => { if (e.key === "Enter") load(searchText); }}
        />
      </SettingsBar>

      <ListResultHeader totalCount={data.length} />

      <DataTable
        data={data}
        columns={columns}
        className="overflow-auto"
        isLoading={listMut.isPending}
      />

      <ApprDocDetailModal
        docSeq={selectedDocSeq}
        open={!!selectedDocSeq}
        onClose={() => setSelectedDocSeq(null)}
        onRefresh={() => load(searchText)}
        mode={mode}
      />
    </>
  );
};

export default ApprovalDocTable;
