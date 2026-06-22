import React, { useRef, useState } from "react";
import { employeeApi } from "@shared/api/organization/employeeApi";
import { apiClient } from "@shared/api/client";

export type NameTagTypes = {
  id: string;            // 기본은 userInfoSeq (관계자/발명자 등록 등 기존 호환)
  userMstSeq?: string;   // user_mst_seq (권한 매핑 등 user 식별자가 필요한 경우)
  name: string;
  team: string;
  position: string;
  head: string;
  image?: string;
  email?: string;
  mobile?: string;
  deptCode?: string;
  roleName?: string;     // 현재 역할 이름 (권한 이동 시 확인용)
  roleType?: string;     // 현재 역할 타입 (SYSTEM_ADMIN 등)
  children?: React.ReactNode;
};

export type RtnDataType = {
  id: string;            // 기본은 userInfoSeq
  userMstSeq?: string;   // user_mst_seq (필요한 호출자만 사용)
  name: string;
  team?: string;
  position?: string;
  image?: string;
  email?: string;
  mobile?: string;
  deptCode?: string;
  roleName?: string;
  roleType?: string;
};

export type ActionsType = {
  onSelect: () => void;
  checked: boolean;
};

export const useMembers = () => {
  const [member, setMember] = useState<NameTagTypes[]>([]);
  const [check, setCheck] = useState<RtnDataType[]>([]);
  const memberRef = useRef<NameTagTypes[]>([]);
  const api = employeeApi(apiClient);

  const fetchMembers = async (keyword?: string) => {
    try {
      const data = await api.getList({ userNameKo: keyword || "" });
      const mapped: NameTagTypes[] = data.map((e) => ({
        id:  e.userInfoSeq || e.userMstSeq || "",
        userMstSeq: e.userMstSeq || "",
        name: e.userNameKo,
        team: e.officeEmployeeDept || e.deptName || "",
        position: e.officeEmployeePosition || e.userPosition || "",
        head: "",
        image: e.profileImageUrl || "",
        email: e.userEmail || "",
        mobile: e.userMobileNo || "",
        deptCode: e.deptCode || e.officeEmployeeDept || e.deptName || "",
        roleName: e.role?.name || "",
      }));
      setMember(mapped);
      memberRef.current = mapped;
    } catch {
      setMember([]);
      memberRef.current = [];
    }
  };

  const memFind = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMember(
      memberRef.current.filter((mem) => mem.name.includes(value)),
    );
  };

  const toRtnData = (u: NameTagTypes): RtnDataType => ({
    id: u.id, userMstSeq: u.userMstSeq, name: u.name, team: u.team, position: u.position,
    image: u.image, email: u.email, mobile: u.mobile, deptCode: u.deptCode,
    roleName: u.roleName, roleType: u.roleType,
  });

  const selectHandle = (userInfo: NameTagTypes) => {
    if (check.some((item) => item.id === userInfo.id)) {
      setCheck((prev) => prev.filter((item) => item.id !== userInfo.id));
      return;
    }
    setCheck((prev) => [...prev, toRtnData(userInfo)]);
  };

  const singleSelectHandle = (userInfo: NameTagTypes) => {
    if (check.some((item) => item.id === userInfo.id)) {
      setCheck((prev) => prev.filter((item) => item.id !== userInfo.id));
      return;
    }
    setCheck([toRtnData(userInfo)]);
  };

  const clearCheck = () => {
    setCheck([]);
  };

  return {
    member,
    setMember,
    check,
    setCheck,
    clearCheck,
    selectHandle,
    memFind,
    singleSelectHandle,
    fetchMembers,
  };
};
