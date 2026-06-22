import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries";
import { type CodeRequestTypeNew, type CodeSelectOption } from "@shared/api/common/commApi";
import { getCodeList } from "@shared/util/codeUtils";
import { mapToOptionNew } from "@shared/util/stringUtil";
import type { SearchCodeGroups } from "../ui/PageSearchForm";

export interface CodeItemSets {
  base: CodeSelectOption[];
  date: CodeSelectOption[];
  str: CodeSelectOption[];
  num: CodeSelectOption[];
}

export function useSearchCodeItems(searchCodeGroups?: SearchCodeGroups) {
  const [codeItems, setCodeItems] = useState<CodeItemSets>({ base: [], date: [], str: [], num: [] });
  const [baseRefMap, setBaseRefMap] = useState<Record<string, string>>({});
  const [subCodeMap, setSubCodeMap] = useState<Record<string, CodeSelectOption[]>>({});

  const { mutate: fetchCodes } = useMutation(commonQueries.getCommonCodeNew());
  const { mutate: fetchSubCode } = useMutation(commonQueries.getCommonCodeNew());
  const loadedKeyRef = useRef<string | null>(null);
  const loadingSubRef = useRef<Set<string>>(new Set());

  const subCodeMapRef = useRef(subCodeMap);
  subCodeMapRef.current = subCodeMap;

  useEffect(() => {
    if (!searchCodeGroups) return;
    const key = [searchCodeGroups.base, searchCodeGroups.date, searchCodeGroups.str, searchCodeGroups.num].join("|");
    if (loadedKeyRef.current === key) return;

    const grpCdList = [searchCodeGroups.base, searchCodeGroups.date, searchCodeGroups.str, searchCodeGroups.num]
      .filter((g): g is string => !!g);
    if (grpCdList.length === 0) return;

    const req: CodeRequestTypeNew = { grpCdList };
    fetchCodes(req, {
      onSuccess: (res) => {
        const data = res.data;
        const refMap: Record<string, string> = {};

        const toOptions = (key?: string) => {
          if (!key) return [];
          const list = getCodeList(key, data);
          if (!list) return [];
          list.forEach((item) => {
            if (item.refVal1) {
              refMap[item.dtlCd] = item.refVal1;
            }
          });
          return mapToOptionNew(list);
        };

        setCodeItems({
          base: toOptions(searchCodeGroups.base),
          date: toOptions(searchCodeGroups.date),
          str: toOptions(searchCodeGroups.str),
          num: toOptions(searchCodeGroups.num),
        });
        setBaseRefMap(refMap);
        loadedKeyRef.current = key;
      },
    });
  }, [searchCodeGroups]); // eslint-disable-line react-hooks/exhaustive-deps

  /** 하위코드 온디맨드 로드 (SearchDefault 및 import 시 사용) */
  const loadSubCode = (cateCode: string, grpCd: string) => {
    const isDeptField = /dept/i.test(cateCode);
    if ((!grpCd && !isDeptField) || subCodeMapRef.current[cateCode] || loadingSubRef.current.has(cateCode)) return;
    loadingSubRef.current.add(cateCode);

    // [부서 목록] 그룹 코드가 OFFICE_DEPT_LIST거나 상세 코드가 부서 관련인 경우
    if (grpCd === "OFFICE_DEPT_LIST" || isDeptField) {
      import("@shared/api/organization/orgApi").then(({ orgApi }) => {
        import("@shared/api/client").then(({ apiClient }) => {
          orgApi(apiClient).getDeptTree().then((res) => {
            const list = res.filter(d => d.useYn !== "N").map((d) => ({ label: d.deptName, value: d.deptName }));
            setSubCodeMap((prev) => ({ ...prev, [cateCode]: list }));
            loadingSubRef.current.delete(cateCode);
          }).catch(() => loadingSubRef.current.delete(cateCode));
        });
      });
      return;
    }

    fetchSubCode(
      { grpCdList: [grpCd] },
      {
        onSuccess: (res) => {
          const list = getCodeList(grpCd, res.data);
          setSubCodeMap((prev) => ({ ...prev, [cateCode]: list ? mapToOptionNew(list) : [] }));
          loadingSubRef.current.delete(cateCode);
        },
        onError: () => loadingSubRef.current.delete(cateCode),
      }
    );
  };

  return { codeItems, baseRefMap, subCodeMap, setSubCodeMap, loadSubCode };
}
