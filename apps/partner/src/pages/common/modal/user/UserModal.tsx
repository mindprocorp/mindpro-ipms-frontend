import { Button, CustomScrollArea, FormDialog, Icons } from "@repo/ui";
import { useState, useEffect, useMemo } from "react";
import { MemberSearchBox, NameTag, NameTagCheck } from "./name-tag/NameTag";
import TeamTree from "./TeamTree";
import { type NameTagTypes, type RtnDataType, useMembers } from "./model/useMembers";
import { orgApi } from "@shared/api/organization/orgApi";
import { apiClient } from "@shared/api/client";

import type { DeptVO } from "@shared/api/organization/orgApi";
import { CODE_CLASS } from "@shared/enum/organizationType";

export type InputKeyInfoType = {
  inputKey: string;
  inputName: string;
};

export type SuccessData = {
  input: InputKeyInfoType;
  userInfo: RtnDataType[];
};

type UserModalProps = {
  input?: InputKeyInfoType;
  title?: string;
  open: boolean;
  multi?: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: SuccessData) => void;
};

type TreeMenu = {
  title: string;
  code: string;
  url: string;
  items?: TreeMenu[];
};

const deptToMenu = (depts: DeptVO[]): TreeMenu[] => {
  const sorted = [...depts].sort((a, b) => Number(a.sortOrd) - Number(b.sortOrd));
  const roots = sorted.filter((d) => !d.parentDeptSeq && d.useYn !== "N");
  const getChildren = (parentSeq: string): TreeMenu[] =>
    sorted
      .filter((d) => d.parentDeptSeq === parentSeq && d.useYn !== "N")
      .map((d) => ({ title: d.deptName, code: d.deptSeq, url: "#", items: getChildren(d.deptSeq) }));
  return roots.map((d) => ({ title: d.deptName, code: d.deptSeq, url: "#", items: getChildren(d.deptSeq) }));
};

export const UserModal = ({ title, open, onOpenChange, onSuccess, input, multi = false }: UserModalProps) => {
  const { check, member, selectHandle, memFind, singleSelectHandle, clearCheck, fetchMembers } = useMembers();
  const [code, setCode] = useState("");
  const [menus, setMenus] = useState<TreeMenu[]>([]);
  const [depts, setDepts] = useState<DeptVO[]>([]);
  const [selectedDeptName, setSelectedDeptName] = useState("");
  const [positionOrder, setPositionOrder] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (!open) return;
    const api = orgApi(apiClient);
    Promise.all([
      api.getDeptTree(),
      api.getOfficeCodeList(CODE_CLASS.POSITION),
    ]).then(([d, positions]) => {
      setDepts(d);
      setMenus(deptToMenu(d));
      setPositionOrder(new Map(positions.map((p, i) => [p.codeName, i])));
      fetchMembers();
    });
  }, [open]);

  const getDeptPath = (deptName: string) => {
    const dept = depts.find((d) => d.deptName === deptName);
    if (!dept?.deptPath) return deptName || "";
    const seqs = dept.deptPath.split("/").filter(Boolean);
    return seqs.map((seq) => depts.find((d) => d.deptSeq === seq)?.deptName).filter(Boolean).join(" > ");
  };

  useEffect(() => {
    if (!code) return;
    fetchMembers().then(() => {
      const findDept = (items: TreeMenu[]): string => {
        for (const item of items) {
          if (item.code === code) return item.title;
          if (item.items?.length) { const r = findDept(item.items); if (r) return r; }
        }
        return "";
      };
      setSelectedDeptName(findDept(menus));
    });
  }, [code]);

  const handleSubmit = () => {
    onOpenChange(false);
    onSuccess?.({ userInfo: check, input: input || { inputKey: "", inputName: "" } });
    clearCheck();
  };

  const handleOpenChange = (isOpen: boolean) => {
    clearCheck();
    onOpenChange(isOpen);
  };

  const isCheck = (item: NameTagTypes) => check.some((i) => i.id === item.id);

  const displayMembers = useMemo(() => {
    const filtered = code && selectedDeptName
      ? member.filter((m) => m.team === selectedDeptName)
      : member;
    if (positionOrder.size === 0) return filtered;
    const maxOrder = positionOrder.size;
    return [...filtered].sort((a, b) => {
      const orderA = positionOrder.get(a.position) ?? maxOrder;
      const orderB = positionOrder.get(b.position) ?? maxOrder;
      return orderA - orderB;
    });
  }, [member, code, selectedDeptName, positionOrder]);

  return (
    <FormDialog
      title={title}
      onSubmit={handleSubmit}
      submitText="확인"
      open={open}
      onOpenChange={handleOpenChange}
      className="max-w-180!"
      bodyFull
    >
      <div className="border-border-100 dark:border-input flex border-y">
        <CustomScrollArea className="border-border-100 dark:border-input h-100 border-r">
          <div className="w-50 p-2">
            <Button
              variant="ghost"
              className="data-[selected=true]:bg-p-color-1/10 data-[selected=true]:text-p-color-1 mb-1 w-full justify-start text-xs"
              data-selected={code === ""}
              onClick={() => { setCode(""); setSelectedDeptName(""); }}
            >
              <Icons.Users className="size-4" />
              전체
            </Button>
            {menus.map((item, index) => (
              <TeamTree
                key={item.code + "_" + index}
                group={item}
                setCode={setCode}
                activeCode={code}
              />
            ))}
            {menus.length === 0 && (
              <p className="text-muted-foreground py-8 text-center text-xs">등록된 조직이 없습니다.</p>
            )}
          </div>
        </CustomScrollArea>

        <CustomScrollArea className="h-100 w-full">
          <div className="flex-1">
            <div className="border-border-100 bg-bg-100 dark:border-input dark:bg-background-color flex items-center justify-between border-b px-4 py-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">{selectedDeptName || "전체"}</h2>
                <span className="text-text-200 text-xs">총 {displayMembers.length}명</span>
              </div>
              <MemberSearchBox memFind={memFind} className="w-48" />
            </div>
            <div className="p-2">
              {displayMembers.map((item) => (
                <div className="flex gap-2" key={item.id}>
                  {multi ? (
                    <NameTagCheck
                      id={item.id}
                      name={item.name}
                      position={item.position}
                      team={getDeptPath(item.team)}
                      head={item.head}
                      image={item.image}
                      onSelect={() => selectHandle(item)}
                      checked={isCheck(item)}
                    />
                  ) : (
                    <NameTag
                      id={item.id}
                      name={item.name}
                      position={item.position}
                      team={getDeptPath(item.team)}
                      head={item.head}
                      image={item.image}
                      onSelect={() => singleSelectHandle(item)}
                      checked={isCheck(item)}
                    />
                  )}
                </div>
              ))}
              {displayMembers.length === 0 && (
                <p className="text-muted-foreground py-8 text-center text-xs">직원이 없습니다.</p>
              )}
            </div>
          </div>
        </CustomScrollArea>
      </div>
    </FormDialog>
  );
};
