import { FormDialog, CustomScrollArea } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { MemberSearchBox, NameTagCheck } from "./name-tag/NameTag";
import TeamTree from "./TeamTree";
import { useState, useEffect } from "react";
import { orgApi } from "@shared/api/organization/orgApi";
import { employeeApi } from "@shared/api/organization/employeeApi";
import { apiClient } from "@shared/api/client";

import type { DeptVO } from "@shared/api/organization/orgApi";

type TreeMenu = {
  title: string;
  code: string;
  url: string;
  items?: TreeMenu[];
};

const deptToMenu = (depts: DeptVO[]): TreeMenu[] => {
  const roots = depts.filter((d) => !d.parentDeptSeq && d.useYn !== "N");
  const getChildren = (parentSeq: string): TreeMenu[] =>
    depts
      .filter((d) => d.parentDeptSeq === parentSeq && d.useYn !== "N")
      .map((d) => ({ title: d.deptName, code: d.deptSeq, url: "#", items: getChildren(d.deptSeq) }));
  return roots.map((d) => ({ title: d.deptName, code: d.deptSeq, url: "#", items: getChildren(d.deptSeq) }));
};

type MemberItem = {
  id: string;
  name: string;
  team: string;
  position: string;
  head: string;
  email: string;
  mobile: string;
};

export const OrganizationPopup = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const [menus, setMenus] = useState<TreeMenu[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [allMembers, setAllMembers] = useState<MemberItem[]>([]);
  const [check, setCheck] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [selectedDeptName, setSelectedDeptName] = useState("");

  useEffect(() => {
    if (!open) return;
    const api = employeeApi(apiClient);
    Promise.all([
      orgApi(apiClient).getDeptTree(),
      api.getList({}),
    ]).then(([depts, emps]) => {
      setMenus(deptToMenu(depts));
      const mapped = emps.map((e) => ({
        id: e.userInfoSeq || e.userMstSeq || "",
        name: e.userNameKo,
        team: e.officeEmployeeDept || e.deptName || "",
        position: e.officeEmployeePosition || e.userPosition || "",
        head: "",
        email: e.userEmail || "",
        mobile: e.userMobileNo || "",
      }));
      setMembers(mapped);
      setAllMembers(mapped);
    });
  }, [open]);

  useEffect(() => {
    if (!code) { setMembers(allMembers); setSelectedDeptName(""); return; }
    const findDept = (items: TreeMenu[]): string => {
      for (const item of items) {
        if (item.code === code) return item.title;
        if (item.items?.length) { const r = findDept(item.items); if (r) return r; }
      }
      return "";
    };
    const name = findDept(menus);
    setSelectedDeptName(name);
    setMembers(name ? allMembers.filter((m) => m.team === name) : allMembers);
  }, [code, allMembers]);

  const memFind = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const base = selectedDeptName ? allMembers.filter((m) => m.team === selectedDeptName) : allMembers;
    setMembers(value ? base.filter((m) => m.name.includes(value)) : base);
  };

  const selectHandle = (name: string) => {
    setCheck((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  };

  return (
    <FormDialog
      title={title}
      onSubmit={() => {
        const selected = allMembers.filter((m) => check.includes(m.name));
        onSuccess?.(selected);
        setCheck([]);
      }}
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-180!"
      bodyFull
    >
      <div className="border-border-100 dark:border-input flex border-y">
        <CustomScrollArea className="border-border-100 dark:border-input h-100 border-r">
          <div className="w-50 p-2">
            {menus.map((item, index) => (
              <TeamTree key={item.code + "_" + index} group={item} setCode={setCode} activeCode={code} />
            ))}
            {menus.length === 0 && (
              <p className="text-muted-foreground py-8 text-center text-xs">등록된 조직이 없습니다.</p>
            )}
          </div>
        </CustomScrollArea>

        <CustomScrollArea className="h-100 w-full">
          <div className="flex-1">
            <div className="border-border-100 bg-bg-100 dark:border-input dark:bg-background-color flex justify-between border-b p-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">{selectedDeptName || "전체"}</h2>
                <span className="text-text-200 text-xs">총 {members.length}명</span>
              </div>
              <MemberSearchBox memFind={memFind} className="w-50" />
            </div>
            <div className="p-2">
              {members.map((item) => (
                <div className="flex gap-2" key={item.id}>
                  <NameTagCheck
                    name={item.name}
                    position={item.position}
                    team={item.team}
                    head={item.head}
                    onSelect={() => selectHandle(item.name)}
                    checked={check.includes(item.name)}
                  />
                </div>
              ))}
              {members.length === 0 && (
                <p className="text-muted-foreground py-8 text-center text-xs">직원이 없습니다.</p>
              )}
            </div>
          </div>
        </CustomScrollArea>
      </div>
    </FormDialog>
  );
};
