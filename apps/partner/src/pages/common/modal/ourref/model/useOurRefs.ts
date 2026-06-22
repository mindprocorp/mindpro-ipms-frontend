import { useState, useCallback, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries.ts";
import type { SearchAppItem, SearchAppListRequest } from "@shared/api/common/commApi.ts";

export const useOurRefs = () => {
  const [ourRefList, setOurRefList] = useState<SearchAppItem[]>([]);
  const [check, setCheck] = useState<SearchAppItem[]>([]);
  const searchMutation = useMutation(commonQueries.getSearchAppList());

  // [핵심] API 호출 로직을 별도 함수로 분리 (재사용성)
  const fetchOurRefs = useCallback((searchValue: string = "") => {
    const payload: SearchAppListRequest = {
      searchCondition: [{ codeName: "appNo", codeValue: searchValue }],
      page: 1,
      pageSize: 20
    };

    searchMutation.mutate(payload, {
      onSuccess: (response) => {
        setOurRefList(response.data.list || []);
      }
    });
  }, [searchMutation.mutate]);

  // [추가] 컴포넌트 마운트 시 최초 1회 빈 검색어로 조회
  useEffect(() => {
    fetchOurRefs("");
  }, []); // 의존성 배열을 비워두면 최초 로드 시 1회만 실행됩니다.

  const memFind = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length >= 1) {
      fetchOurRefs(value); // 분리한 함수 호출
    } else {
      setOurRefList([]);
    }
  }, [fetchOurRefs]);
  // [유지] 단일 선택 핸들러
  const singleSelectHandle = (item: SearchAppItem) => {
    setCheck([item]);
  };

  const clearCheck = () => {
    setCheck([]);
  };

  return {
    ourRef: ourRefList, // 검색된 결과 리스트
    check,             // 현재 선택된 아이템
    setCheck,          // DataTable에서 선택된 항목을 업데이트할 때 사용
    memFind,           // 검색 input onChange에 연결
    singleSelectHandle, // 아이템 클릭 시 연결
    clearCheck,
    isLoading: searchMutation.isPending
  };
};
// import React, { useEffect, useRef, useState } from "react";

// export type NameTagTypes = {
//   id: string;
//   ourRef: string;
//   children?: React.ReactNode;
// };

// export type RtnOurRefDataType = {
//   id: string;
//   ourRef: string;
// };

// export type ActionsType = {
//   onSelect: () => void;
//   checked: boolean;
// };

// const dummy = [
//   {
//     id: "USERIF20260000002",
//     ourRef: "REF-2026-001",
//   },
// ];

// export const useOurRefs = () => {
//   const [team, setTeam] = useState<string>("");
//   const [ourRef, setOurRef] = useState<NameTagTypes[]>([]);
//   const [check, setCheck] = useState<RtnOurRefDataType[]>([]);
//   const memberRef = useRef<NameTagTypes[]>([]);

//   const memFind = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setOurRef(
//       memberRef?.current.filter((mem) => {
//         return mem.ourRef.includes(value);
//       }),
//     );
//   };

//   const selectHandle = (ourRefInfo: NameTagTypes) => {

//     const isInCludes = check.filter((item) => item.id === ourRefInfo.id);
//     if (isInCludes.length > 0) {
//       setCheck((prev) => prev.filter((item) => item.id !== ourRefInfo.id));
//       return;
//     }

//     const checkData: RtnOurRefDataType = {
//       id: ourRefInfo.id,
//       ourRef: ourRefInfo.ourRef,
//     };
//     setCheck((prev) => [...prev, checkData]);
//   };

//   const singleSelectHandle = (userInfo: NameTagTypes) => {
//     const isInCludes = check.filter((item) => item.id === userInfo.id);
//     if (isInCludes.length > 0) {
//       setCheck((prev) => prev.filter((item) => item.id !== userInfo.id));
//       return;
//     }
//     setCheck([userInfo]);
//   };

//   const clearCheck = () => {
//     setCheck([]);
//   };

//   useEffect(() => {
//     setOurRef(dummy);
//     memberRef.current = dummy;
//   }, []);

//   return {
//     ourRef,
//     setOurRef,
//     check,
//     setCheck,
//     clearCheck,
//     selectHandle,
//     memFind,
//     singleSelectHandle,
//   };
// };
