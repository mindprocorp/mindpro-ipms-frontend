import { useState, useEffect } from "react";
import { DataTable } from "@repo/ui";
import { useMutation } from "@tanstack/react-query";
import PageTitleArea from "@shared/ui/PageTitleArea";
import ListResultHeader from "@shared/ui/ListResultHeader";
import DataMenuButton from "@shared/ui/DataMenuButton";
import { SettingsBar, BarSearch, BarLabel } from "@pages/settings/_components/common/SettingsBar";
import type { ApprDocVO } from "@shared/api/approval/approvalApi";
import { approvalQueries } from "@shared/query/organization/queries";
import ApprDocDetailModal from "../_common/ApprDocDetailModal";
import { buildDocColumns } from "../_common/ApprovalDocTable";

const TABS = [
  { key: "all",       label: "전체",     status: undefined },
  { key: "PENDING",   label: "결재중",   status: "PENDING" },
  { key: "APPROVED",  label: "승인",     status: "APPROVED" },
  { key: "REJECTED",  label: "반려",     status: "REJECTED" },
  { key: "DRAFT",     label: "임시저장", status: "DRAFT" },
  { key: "WITHDRAWN", label: "회수",     status: "WITHDRAWN" },
] as const;

const DraftList = () => {
  const [tab, setTab] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<ApprDocVO[]>([]);
  const [selectedDocSeq, setSelectedDocSeq] = useState<string | null>(null);

  const listMut = useMutation(approvalQueries.getMyDraftList());

  const load = (status?: string, keyword?: string) => {
    listMut.mutate({ docStatus: status, keyword }, {
      onSuccess: setData,
      onError: () => setData([]),
    });
  };

  useEffect(() => { load(); }, []);

  const handleTabChange = (key: string) => {
    setTab(key);
    const found = TABS.find((t) => t.key === key);
    load(found?.status, searchText);
  };

  const columns = buildDocColumns((doc) => setSelectedDocSeq(doc.docSeq || null));

  const tabCls = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs font-medium cursor-pointer ${
      active ? "bg-p-color-1 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
    }`;

  return (
    <>
      <PageTitleArea className="pb-2" title="기안 조회">
        <DataMenuButton data={data} fileName="기안조회" columns={columns} />
      </PageTitleArea>

      <SettingsBar
        onSearch={() => {
          const found = TABS.find((t) => t.key === tab);
          load(found?.status, searchText);
        }}
        onReset={() => { setSearchText(""); load(TABS.find((t) => t.key === tab)?.status); }}
      >
        <BarLabel>검색</BarLabel>
        <BarSearch
          value={searchText}
          onChange={setSearchText}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const found = TABS.find((t) => t.key === tab);
              load(found?.status, searchText);
            }
          }}
        />
      </SettingsBar>

      <ListResultHeader totalCount={data.length}>
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button key={t.key} type="button" onClick={() => handleTabChange(t.key)}
              className={tabCls(tab === t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </ListResultHeader>

      <DataTable isColumnVisible={true} data={data} columns={columns} className="overflow-auto" isLoading={listMut.isPending} />

      <ApprDocDetailModal
        docSeq={selectedDocSeq}
        open={!!selectedDocSeq}
        onClose={() => setSelectedDocSeq(null)}
        onRefresh={() => {
          const found = TABS.find((t) => t.key === tab);
          load(found?.status, searchText);
        }}
      />
    </>
  );
};

export default DraftList;
