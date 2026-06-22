import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icons,
  Input,
  cn,
} from "@repo/ui";
import { officeMembershipApi } from "@shared/api/user/officeMembershipApi";
import JoinOfficeModal from "./JoinOfficeModal";
import { useAlertStore } from "@shared/store/useAlertStore";

/**
 * 헤더 상단 사무소 전환 드롭다운.
 * - 1개만 있으면 단순 라벨(전환 불가)
 * - 2개 이상이면 드롭다운 + 전환 + 초대코드 합류 메뉴
 * - PENDING 사무소는 회색, 클릭 불가
 */
const OfficeSwitcher = () => {
  const { data: offices = [], isLoading } = officeMembershipApi.useMyOffices();
  const switchMutation = officeMembershipApi.useSwitchOffice();
  const [joinOpen, setJoinOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { openAlert } = useAlertStore();

  const current = useMemo(() => offices.find((o) => o.isCurrent), [offices]);
  const switchable = offices.filter((o) => !o.isCurrent && o.acctStatusCode === "ACTIVE");
  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return offices;
    return offices.filter((o) => (o.officeShortName ?? "").toLowerCase().includes(k));
  }, [offices, keyword]);
  const showSearch = offices.length >= 6;

  if (isLoading) return null;
  if (offices.length === 0) return null;

  const handleSwitch = (officeSeq: string) => {
    switchMutation.mutate(officeSeq, {
      onError: (err: any) => {
        openAlert({ title: "전환 실패", message: err?.response?.data?.message ?? "사무소 전환에 실패했습니다." });
      },
    });
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex max-w-[180px] cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            title={current?.officeShortName ?? "사무소"}
          >
            {current?.officeAuthYn === "Y" ? (
              <Icons.Building2 className="size-3.5 shrink-0" />
            ) : (
              <Icons.User className="size-3.5 shrink-0" />
            )}
            <span className="truncate">{current?.officeShortName ?? "사무소"}</span>
            <Icons.ChevronDown className="size-3 shrink-0" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel className="text-text-200 text-xs">사무소 선택</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {showSearch && (
            <div className="px-2 pb-1">
              <div className="relative">
                <Icons.Search className="text-muted-foreground absolute left-2 top-1/2 size-3.5 -translate-y-1/2" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="회사명 검색"
                  className="h-7 pl-7 text-xs"
                />
              </div>
            </div>
          )}

          <div className="max-h-72 overflow-auto">
          {filtered.length === 0 && (
            <div className="text-text-200 px-3 py-4 text-center text-xs">검색 결과 없음</div>
          )}
          {filtered.map((o) => {
            const isPending = o.acctStatusCode === "PENDING";
            return (
              <DropdownMenuItem
                key={o.officeSeq}
                disabled={o.isCurrent || isPending}
                onSelect={() => !o.isCurrent && !isPending && handleSwitch(o.officeSeq)}
                className={cn(
                  "flex items-center gap-2",
                  o.isCurrent && "bg-p-color-1/10 font-semibold",
                  isPending && "text-text-200",
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span>{o.officeShortName}</span>
                    {o.officeAuthYn === "Y" ? (
                      <span className="text-p-color-1 text-[10px]">[사업자]</span>
                    ) : (
                      <span className="text-text-200 text-[10px]">[개인]</span>
                    )}
                  </div>
                  {(o.roleNm || isPending) && (
                    <div className="text-text-200 text-[11px]">
                      {o.roleNm}
                      {o.roleNm && isPending && " · "}
                      {isPending && "승인 대기"}
                    </div>
                  )}
                </div>
                {o.isCurrent && <Icons.Check className="size-3.5" />}
              </DropdownMenuItem>
            );
          })}
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setJoinOpen(true)} className="gap-2">
            <Icons.Plus className="size-3.5" />
            <span>초대코드로 합류</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <JoinOfficeModal open={joinOpen} onOpenChange={setJoinOpen} />
    </>
  );
};

export default OfficeSwitcher;
