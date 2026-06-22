import React, { useMemo, useState, useCallback } from "react";
import {
  Icons,
  DataTable,
  cn,
  Badge,
} from "@repo/ui";
import { type DueDateItem } from "@shared/api/duedate/duedateApi";
import { getColumns } from "./columns/MyWorkColumns";
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { ko } from "date-fns/locale";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { duedateQueries } from "@shared/query/duedate/queries";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { useNavigate } from "react-router-dom";
import { getName } from "@shared/enum/domesticType";

// 컴포넌트 외부 상수 - 렌더마다 새 배열 생성 방지 (query key 안정성)
const DUE_TYPE_SEARCH_CONDITION = [
  'appDeadline', 'transDeadline', 'draftDeadline', 'domesticPriorDeadline',
  'npe20Deadline', 'npe30Deadline', 'examRequestDeadline', 'amendDeadline',
  'responseDeadline', 'ipeDeadline', 'submitDeadline', 'regNormalDeadline',
  'regGraceDeadline', 'standardDeadline', 'penaltyDeadline', 'renewalDeadline',
  'recoveryDeadline', 'dueLimitDate', 'appealLimitDate', 'reviewOpinionLimitDate',
  'idsDeadline', 'instructionLimitDate',
].map(code => ({ codeName: "dueTypeCode", codeValue: code, andOrNOT: "OR" }));

const MyWork = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [dailyDate, setDailyDate] = useState(new Date());
  const [weeklyDate, setWeeklyDate] = useState(new Date());

  const completeMutation = useMutation(duedateQueries.complete());

  // UserResponseType 실제 필드: officeEmployeeSeq (optional)
  const officeSeq = user?.officeEmployeeSeq;
  const todayStr = format(new Date(), "yyyyMMdd");
  const dailyDateStr = format(dailyDate, "yyyyMMdd");
  // 오늘 날짜인 경우 과거 미완료(Overdue) 포함을 위해 먼 과거부터 조회
  const dailyStartDate = dailyDateStr === todayStr ? "19000101" : dailyDateStr;

  const weekStart = startOfWeek(weeklyDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weeklyDate, { weekStartsOn: 1 });

  const weekStartStr = format(weekStart, "yyyyMMdd");
  const weekEndStr = format(weekEnd, "yyyyMMdd");

  // user 존재 여부로 enabled 판단 (officeSeq는 optional이므로 의존하지 않음)
  const isEnabled = !!user;

  // 날짜에 해당하는 값만 key에 포함 - 날짜 이동 시 key가 변경되어 자동 재조회
  const [dailyResult, weeklyResult] = useQueries({
    queries: [
      duedateQueries.searchQuery(
        ["daily", dailyStartDate, dailyDateStr],
        {
          officeSeq,
          pageSize: 1000,
          offSet: 0,
          searchCondition: DUE_TYPE_SEARCH_CONDITION,
          dateFilters: [{ dateCode: "deadline", andOrNOT: "AND", startDate: dailyStartDate, endDate: dailyDateStr }],
        },
        isEnabled
      ),
      duedateQueries.searchQuery(
        ["weekly", weekStartStr, weekEndStr],
        {
          officeSeq,
          pageSize: 1000,
          offSet: 0,
          searchCondition: DUE_TYPE_SEARCH_CONDITION,
          dateFilters: [{ dateCode: "deadline", andOrNOT: "AND", startDate: weekStartStr, endDate: weekEndStr }],
        },
        isEnabled
      ),
    ],
  });

  const dailyRawData: DueDateItem[] = dailyResult.data?.data ?? [];
  const weeklyRawData: DueDateItem[] = weeklyResult.data?.data ?? [];

  // 공통 사용자 필터 + 정렬
  const filterByUser = useCallback((data: DueDateItem[]) => {
    if (!user) return [];
    // UserResponseType: userNameKo / userNameEn (userName 필드 없음)
    const myName = user.userNameKo?.trim();
    const myId = user.userId;

    return data.filter((item: any) => {
      const checkMgr = (mgr: any, flatName?: string, flatId?: string) => {
        const targetName = (mgr?.userName || flatName || (typeof mgr === "string" ? mgr : "") || "").trim();
        const targetId = mgr?.userSeq || mgr?.userId || flatId;
        if (!targetName && !targetId) return false;
        const nameMatch = myName && (targetName === myName || targetName.includes(myName) || myName.includes(targetName));
        const idMatch = myId && (targetId === myId);
        return nameMatch || idMatch;
      };
      return checkMgr(item.adminMgr, item.adminMgrName, item.adminMgrSeq)
        || checkMgr(item.caseMgr, item.caseMgrName, item.caseMgrSeq)
        || checkMgr(item.attorney, item.attorneyName, item.attorneySeq);
    }).sort((a: any, b: any) => {
      const dateA = (a.deadline || a.duedateDate || "").replace(/\D/g, "");
      const dateB = (b.deadline || b.duedateDate || "").replace(/\D/g, "");
      return dateA.localeCompare(dateB);
    });
  }, [user]);

  const dailyMyData = useMemo(() => filterByUser(dailyRawData), [dailyRawData, filterByUser]);
  const weeklyMyData = useMemo(() => filterByUser(weeklyRawData), [weeklyRawData, filterByUser]);

  // 당일 업무: 선택 날짜 일치 + 오늘인 경우 과거 미완료 Overdue 포함
  const dailyTasks = useMemo(() => {
    return dailyMyData.filter((t: any) => {
      const d = (t.deadline || t.duedateDate || "").replace(/\D/g, "");
      const isComplete = t.duedateCompleteYn === "Y";
      if (d === dailyDateStr) return true;
      if (dailyDateStr === todayStr && d < todayStr && !isComplete) return true;
      return false;
    });
  }, [dailyMyData, dailyDateStr, todayStr]);

  const weeklyTasks = useMemo(() => {
    return weeklyMyData.filter((t: any) => {
      const d = (t.deadline || t.duedateDate || "").replace(/\D/g, "");
      if (d.length < 8) return false;
      const due = parseISO(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`);
      return isWithinInterval(due, { start: weekStart, end: weekEnd });
    });
  }, [weeklyMyData, weekStart, weekEnd]);

  // 요약 카드용: daily + weekly 중복 제거 합산
  const allMyData = useMemo(() => {
    const seen = new Set<string>();
    return [...dailyMyData, ...weeklyMyData].filter((item: any) => {
      const key = String(item.duedateSeq || item.mappingDuedateSeq || `${item.tblSeq}_${item.deadline}`);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [dailyMyData, weeklyMyData]);

  const getStatusSummary = (tasks: any[]) => {
    const counts: Record<string, number> = {};
    tasks.forEach(task => {
      const s = task.dueType?.codeName || task.classification || "진행";
      if (s) counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  const dailyStatusSummary = useMemo(() => getStatusSummary(dailyTasks), [dailyTasks]);
  const weeklyStatusSummary = useMemo(() => getStatusSummary(weeklyTasks), [weeklyTasks]);
  const totalStatusSummary = useMemo(() => getStatusSummary(allMyData), [allMyData]);

  const handleToggleComplete = useCallback((item: any) => {
    if (!item.duedateSeq) return;
    const newStatus = item.duedateCompleteYn === "Y" ? "N" : "Y";
    const dueTypeCategoryCode = item.dueType?.code || item.dueTypeCode || item.duedateCategoryCode || "";
    console.log("[완료처리]", { duedateSeq: item.duedateSeq, completeYn: newStatus, dueTypeCategoryCode, rawItem: item });
    completeMutation.mutate(
      { duedateSeq: item.duedateSeq, completeYn: newStatus, dueTypeCategoryCode },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["duedate", "list"] }) }
    );
  }, [completeMutation, queryClient]);

  const summaryItems = useMemo(() => {
    const sevenDaysLater = format(addDays(new Date(), 7), "yyyyMMdd");
    return [
      { label: "담당 전체", value: allMyData.length, icon: Icons.Briefcase, color: "text-blue-600", bgColor: "bg-blue-50" },
      { label: "당일 처리", value: dailyTasks.length, icon: Icons.Activity, color: "text-amber-500", bgColor: "bg-amber-50" },
      {
        label: "마감 임박",
        value: allMyData.filter((t: any) => {
          const d = (t.deadline || t.duedateDate || "").replace(/\D/g, "");
          return d >= todayStr && d <= sevenDaysLater && t.duedateCompleteYn !== "Y";
        }).length,
        icon: Icons.AlertCircle, color: "text-rose-500", bgColor: "bg-rose-50",
      },
      {
        label: "완료 업무",
        value: allMyData.filter((t: any) => t.duedateCompleteYn === "Y").length,
        icon: Icons.CheckCircle, color: "text-emerald-500", bgColor: "bg-emerald-50",
      },
    ];
  }, [allMyData, dailyTasks, todayStr]);

  const handleRowClick = (_: any, rowData: any) => {
    let routeStr = "";
    let queryStr = "";
    if (typeof rowData.appRoute === "string") routeStr = rowData.appRoute;
    else if (typeof rowData.appRoute === "object" && rowData.appRoute !== null) {
      const code = rowData.appRoute.code;
      if (code === "10") {
        routeStr = "/domestic/detail";
        const rtCode = rowData.rightType?.code || rowData.rightType;
        if (rtCode) queryStr = `?type=${getName(rtCode).toLowerCase()}`;
      }
      else if (code === "20") routeStr = "/overseas/direct/detail";
      else if (code === "30") routeStr = "/overseas/pct/detail";
      else if (code === "40") routeStr = "/overseas/ep/detail";
      else if (code === "50") routeStr = "/overseas/madrid/detail";
      else if (code === "60") routeStr = "/overseas/national/detail";
      else if (code === "70") routeStr = "/objection-trial/detail";
      else if (code === "90") routeStr = "/etc-case/detail";
    }
    const appKey = rowData.appSeq || rowData.tblSeq;
    if (routeStr && appKey) navigate(`${routeStr.startsWith("/") ? routeStr : "/" + routeStr}${routeStr.endsWith("/") ? "" : "/"}${appKey}${queryStr}`);
  };

  const dashboardColumns = useMemo(() => getColumns({ onToggleComplete: handleToggleComplete }), [handleToggleComplete]);

  return (
    <>
      <PageTitleArea className="pb-2" title="나의 업무" />

      <div className="mt-3 flex flex-col gap-4">
        {/* 요약 현황 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryItems.map((item) => (
            <div key={item.label} className="bg-white px-5 py-3 h-[75px] rounded-xl border shadow-sm flex items-center gap-4">
              <div className={cn("size-10 rounded-lg flex items-center justify-center", item.bgColor)}>
                <item.icon className={cn("size-5", item.color)} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase leading-none mb-1">{item.label}</span>
                <span className="text-xl font-black text-slate-800 leading-none">{item.value}<span className="text-xs ml-0.5 font-bold text-slate-400">건</span></span>
              </div>
            </div>
          ))}
        </div>

        {/* 상태별 현황 - 항상 고정 표시, 내용만 변경 */}
        <div className="bg-white px-6 py-2.5 rounded-xl border shadow-sm flex items-center gap-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 border-r pr-5 shrink-0">
            <Icons.Activity className="size-4 text-blue-500" />
            <span className="text-xs font-black text-slate-700">상태별 현황</span>
          </div>
          <div className="flex items-center gap-6 min-h-[20px]">
            {totalStatusSummary.length > 0 ? totalStatusSummary.map((s, idx) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">{s.name}</span>
                <span className="text-sm font-black text-blue-600">{s.count}<span className="text-[10px] ml-0.5 text-slate-400">건</span></span>
                {idx < totalStatusSummary.length - 1 && <div className="size-1 rounded-full bg-slate-200 ml-2" />}
              </div>
            )) : (
              <span className="text-xs text-slate-300">-</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 당일 업무 */}
          <div className="bg-white rounded-xl border shadow-sm flex flex-col h-[450px] overflow-hidden">
            <div className="px-5 py-3 border-b flex flex-col gap-2 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-slate-800">당일 업무</span>
                  <Badge className="bg-blue-100 text-blue-700 border-none font-bold h-5 px-1.5">{dailyTasks.length}</Badge>
                  <div className="flex items-center bg-white rounded border px-1.5 py-0.5 gap-2 ml-2">
                    <button onClick={() => setDailyDate(prev => subDays(prev, 1))} className="text-slate-400 hover:text-blue-500"><Icons.ChevronLeft className="size-3.5" /></button>
                    <span className="text-xs font-bold text-slate-600 min-w-[85px] text-center">{format(dailyDate, "M.d (eee)", { locale: ko })}</span>
                    <button onClick={() => setDailyDate(prev => addDays(prev, 1))} className="text-slate-400 hover:text-blue-500"><Icons.ChevronRight className="size-3.5" /></button>
                  </div>
                </div>
                <button onClick={() => setDailyDate(new Date())} className="text-[10px] font-bold text-blue-500 hover:underline">오늘</button>
              </div>
              {dailyStatusSummary.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                  <Icons.Activity className="size-3 text-slate-400 mr-0.5" />
                  {dailyStatusSummary.map((s, idx) => (
                    <React.Fragment key={s.name}>
                      <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                        {s.name} <span className="text-blue-600 ml-0.5">{s.count}</span>
                      </span>
                      {idx < dailyStatusSummary.length - 1 && <span className="text-[8px] text-slate-300">|</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 relative overflow-auto">
              <DataTable data={dailyTasks} columns={dashboardColumns} className="border-none h-full" onRowClick={handleRowClick} />
            </div>
          </div>

          {/* 주간 업무 */}
          <div className="bg-white rounded-xl border shadow-sm flex flex-col h-[450px] overflow-hidden">
            <div className="px-5 py-3 border-b flex flex-col gap-2 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-slate-800">주간 업무</span>
                  <Badge className="bg-amber-100 text-amber-700 border-none font-bold h-5 px-1.5">{weeklyTasks.length}</Badge>
                  <div className="flex items-center bg-white rounded border px-1.5 py-0.5 gap-2 ml-2">
                    <button onClick={() => setWeeklyDate(prev => subWeeks(prev, 1))} className="text-slate-400 hover:text-amber-500"><Icons.ChevronLeft className="size-3.5" /></button>
                    <span className="text-xs font-bold text-slate-600 min-w-[95px] text-center">{format(weekStart, "M.d")} ~ {format(weekEnd, "M.d")}</span>
                    <button onClick={() => setWeeklyDate(prev => addWeeks(prev, 1))} className="text-slate-400 hover:text-amber-500"><Icons.ChevronRight className="size-3.5" /></button>
                  </div>
                </div>
                <button onClick={() => setWeeklyDate(new Date())} className="text-[10px] font-bold text-amber-600 hover:underline">이번 주</button>
              </div>
              {weeklyStatusSummary.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                  <Icons.Activity className="size-3 text-slate-400 mr-0.5" />
                  {weeklyStatusSummary.map((s, idx) => (
                    <React.Fragment key={s.name}>
                      <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                        {s.name} <span className="text-amber-600 ml-0.5">{s.count}</span>
                      </span>
                      {idx < weeklyStatusSummary.length - 1 && <span className="text-[8px] text-slate-300">|</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 relative overflow-auto">
              <DataTable data={weeklyTasks} columns={dashboardColumns} className="border-none h-full" onRowClick={handleRowClick} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyWork;
