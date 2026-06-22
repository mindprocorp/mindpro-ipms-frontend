import { useEffect, useMemo, useState } from "react";
import { CustomScrollArea, FormDialog, Icons } from "@repo/ui";
import { customerApi, type CustomerMasterItem } from "@shared/api/customer/customerApi";
import { apiClient } from "@shared/api/client";
import { NameTag, MemberSearchBox } from "@pages/common/modal/user/name-tag/NameTag";

/**
 * 단일 고객/담당자 선택 모달.
 *
 * [디자인] UserModal(담당자 선택)의 우측 디자인 그대로. 좌측 부서 트리만 제거.
 * [원칙]
 *   - 등록은 customer-mng 페이지에서. 본 모달은 검색·선택만.
 *   - 의뢰인/출원인/등록관리자/해외대리인/발명자 — 동일 모달, category prop 만 다름.
 *   - 발명자만 백엔드에서 utb_user_info 분기 (Service 단에서 처리, 프론트 동일 endpoint).
 *
 * [흐름]
 *   1. 모달 열림 → GET /api/customer/master?categoryCode=... 호출
 *   2. 검색 input → keyword 로 LIKE 재조회
 *   3. NameTag 카드 클릭 → onSelect 호출 + 모달 닫기
 */

/**
 * CLIENT_DIV 코드에 정의된 4개 카테고리만 본 모달 사용.
 * 등록관리자(regMgr) 는 CLIENT_DIV 에 없으므로 기존 조직도(UserModal) 사용.
 */
export type CustomerCategory = "client" | "applicant" | "foreignAgent" | "inventor";

const CATEGORY_LABEL: Record<CustomerCategory, string> = {
  client: "의뢰인",
  applicant: "출원인",
  foreignAgent: "해외대리인",
  inventor: "발명자",
};

export type CustomerSelected = {
  customerSeq: string;
  customerName: string;
  raw: CustomerMasterItem;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CustomerCategory;
  onSelect?: (item: CustomerSelected) => void;
  title?: string;
}

export const CustomerSelectModal = ({ open, onOpenChange, category, onSelect, title }: Props) => {
  const labelKo = CATEGORY_LABEL[category];

  const [list, setList] = useState<CustomerMasterItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<CustomerMasterItem | null>(null);

  useEffect(() => {
    if (!open) return;
    setKeyword("");
    setSelected(null);
    fetchList("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category]);

  const fetchList = async (kw: string) => {
    setLoading(true);
    try {
      const res = await customerApi(apiClient).searchMaster({
        categoryCode: category,
        keyword: kw || undefined,
        pageSize: 100,
      });
      setList(res?.data ?? []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  // 검색 input 입력 시 즉시 클라이언트 필터 (UserModal 패턴) — 모달이 열릴 때 받은 list 안에서 LIKE
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return list;
    return list.filter((it) =>
      [it.clientNameKo, it.clientNameEn, it.companyName].some((v) => v?.toLowerCase().includes(kw)),
    );
  }, [list, keyword]);

  const handleClick = (item: CustomerMasterItem) => {
    setSelected((prev) => (prev?.customerSeq === item.customerSeq ? null : item));
  };

  const handleSubmit = () => {
    if (!selected) {
      onOpenChange(false);
      return;
    }
    onSelect?.({
      customerSeq: selected.customerSeq,
      customerName: selected.clientNameKo || selected.companyName || "",
      raw: selected,
    });
    onOpenChange(false);
  };

  return (
    <FormDialog
      title={title ?? `${labelKo} 선택`}
      onSubmit={handleSubmit}
      submitText="확인"
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-180!"
      bodyFull
    >
      <div className="border-border-100 dark:border-input flex border-y">
        {/* 좌측 트리 제거 — 본문만 */}
        <CustomScrollArea className="h-100 w-full">
          <div className="flex-1">
            {/* 헤더 (UserModal 우측 헤더 그대로) */}
            <div className="border-border-100 bg-bg-100 dark:border-input dark:bg-background-color flex items-center justify-between border-b px-4 py-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">{labelKo}</h2>
                <span className="text-text-200 text-xs">총 {filtered.length}명</span>
              </div>
              <MemberSearchBox memFind={(e) => setKeyword(e.target.value)} className="w-48" />
            </div>

            {/* 안내 — 등록은 customer-mng */}
            <div className="border-b border-border-100 bg-blue-50/40 dark:border-input dark:bg-blue-950/20 px-4 py-2 text-[11px] text-blue-700 dark:text-blue-300 flex items-start gap-1.5">
              <Icons.Info className="size-3 shrink-0 mt-0.5" />
              <span>
                <b>고객 관리</b> 페이지에 <b>{labelKo}</b>로 등록된 고객만 표시됩니다.
                (등록 시 "고객구분" 항목에서 선택)
              </span>
            </div>

            {/* 카드 리스트 */}
            <div className="p-2">
              {loading ? (
                <p className="text-muted-foreground py-8 text-center text-xs">불러오는 중...</p>
              ) : filtered.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center text-xs">
                  등록된 {labelKo}이(가) 없습니다.
                </p>
              ) : (
                filtered.map((item) => (
                  <div className="flex gap-2" key={item.customerSeq}>
                    <NameTag
                      id={item.customerSeq}
                      name={item.clientNameKo || item.companyName || "(이름 없음)"}
                      position={item.kipoClientNo || ""}
                      team={item.companyName || item.clientNameEn || ""}
                      head={item.countryCode}
                      image=""
                      onSelect={() => handleClick(item)}
                      checked={selected?.customerSeq === item.customerSeq}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </CustomScrollArea>
      </div>
    </FormDialog>
  );
};
