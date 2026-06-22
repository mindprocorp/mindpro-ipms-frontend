import { getColumnsData } from "./columns/columnsData";
import { Button, cn, InfiniteDataTable, Icons } from "@repo/ui";
import DataMenuButton from "@shared/ui/DataMenuButton";
import ListResultHeader from "@shared/ui/ListResultHeader";
import PageTitleArea from "@shared/ui/PageTitleArea";
import PageSearchForm from "@shared/ui/page-search/ui/PageSearchForm";
import { FlatTab } from "@shared/ui/tab/ui/Tabs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getName } from "@shared/enum/domesticType";
import { buildSearchParams } from "@shared/util/searchParamsBuilder";
import { SEARCH_KEY } from "@shared/enum/comCodeType";
import { useMutation } from "@tanstack/react-query";
import { duedateQueries } from "@shared/query/duedate/queries";
import { type DueDateItem } from "@shared/api/duedate/duedateApi";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, endOfWeek, addWeeks, addMonths, addYears, subDays } from "date-fns";
import { ko } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { ko };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type TEvent = {
  id: string | number;
  start: Date;
  end: Date;
  title?: string;
  allDay?: boolean;
  resource?: DueDateItem; // 상세 페이지 이동을 위해 원본 데이터 보관
};

const tabs = [
  { label: "리스트", value: "LIST" },
  { label: "주간달력", value: "WEEK" },
  { label: "월간달력", value: "MONTH" },
];

const DeadLineMng = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const [listData, setListData] = useState<DueDateItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<any>(null);
  const searchMutation = useMutation(duedateQueries.searchList());

  // 검색 또는 탭/캘린더 이동 시 데이터 호출
  useEffect(() => {
    if (!searchParams) return;
    let finalParams = { ...searchParams };

    // 캘린더 탭일 경우 달력에 표시되는 날짜 구간으로 dateFilters 오버라이드
    if (activeTab === "WEEK" || activeTab === "MONTH") {
      let startDate = new Date();
      let endDate = new Date();

      if (activeTab === "MONTH") {
        startDate = startOfWeek(startOfMonth(calendarDate), { weekStartsOn: 0 });
        endDate = endOfWeek(endOfMonth(calendarDate), { weekStartsOn: 0 });
      } else if (activeTab === "WEEK") {
        startDate = startOfWeek(calendarDate, { weekStartsOn: 0 });
        endDate = endOfWeek(calendarDate, { weekStartsOn: 0 });
      }

      const calendarDateFilter = {
        dateCode: "duedate_date",
        andOrNOT: "AND",
        startDate: format(startDate, 'yyyyMMdd'),
        endDate: format(endDate, 'yyyyMMdd')
      };

      // 기존 dateFilters에 추가 (캘린더의 조회 범위가 우선)
      finalParams = {
        ...finalParams,
        dateFilters: [calendarDateFilter, ...(finalParams.dateFilters || [])]
      };
    }

    searchMutation.mutate(finalParams, {
      onSuccess: (response) => {
        if (response.data && response.data.length > 0) {
          setListData(response.data);
          setTotalCount(response.data.length);
        } else {
          setListData([]);
          setTotalCount(0);
        }
      },
      onError: (error) => {
        console.error("[기일관리 검색] API 에러:", error);
      },
    });
  }, [activeTab, calendarDate, searchParams]);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  // API 데이터를 react-big-calendar 이벤트로 변환
  const calendarEvents: TEvent[] = useMemo(() => {
    const events = listData
      .filter((item: any) => item.deadline || item.duedateDate)
      .map((item: any) => {
        const targetDate = item.deadline || item.duedateDate;
        let d = new Date();

        if (typeof targetDate === "string") {
          const cleanStr = targetDate.replace(/\D/g, "");
          if (cleanStr.length >= 8) {
            const y = parseInt(cleanStr.slice(0, 4), 10);
            const m = parseInt(cleanStr.slice(4, 6), 10) - 1;
            const day = parseInt(cleanStr.slice(6, 8), 10);
            d = new Date(y, m, day);
          } else {
            d = new Date(targetDate);
          }
        } else {
          d = new Date(targetDate);
        }

        // 캘린더에 표시할 타이틀 포맷팅
        const kindLabel = item.dueTypeName || item.dueType?.codeName || item.duedateKindCode?.codeName || "기일";
        const ourRefLabel = item.ourRef ? ` [${item.ourRef}]` : "";
        const titleText = item.titleKo || item.note || "";
        const extraText = titleText ? ` - ${titleText}` : "";

        // react-big-calendar에서 allDay 이벤트가 0초 길이일 경우 렌더링되지 않는 현상 방지를 위해 종료일을 다음날 자정으로 설정
        const endDate = new Date(d);
        endDate.setDate(endDate.getDate() + 1);

        return {
          id: item.duedateSeq || item.mappingDuedateSeq || Math.random().toString(),
          title: `[${kindLabel}]${ourRefLabel}${extraText}`,
          start: d,
          end: endDate,
          allDay: true,
          resource: item,
        };
      });

    // 유효한 날짜만 필터링
    return events.filter((e: any) => !isNaN(e.start.getTime()));
  }, [listData]);

  const columnsData = getColumnsData();
  
  // 상세 페이지 이동 핸들러 (리스트 및 캘린더 공통 사용)
  const navigateToDetail = (rowData: any) => {
    if (!rowData) return;

    let routeStr = "";
    let queryStr = "";
    if (typeof rowData.appRoute === "string") {
      routeStr = rowData.appRoute;
    } else if (typeof rowData.appRoute === "object" && rowData.appRoute !== null) {
      const code = rowData.appRoute.code;
      if (code === "10") {
        routeStr = "/domestic/detail";
        const rightTypeAny = rowData.rightType as any;
        const rtCode = typeof rightTypeAny === "object" ? rightTypeAny?.code : rightTypeAny;
        if (rtCode) {
          queryStr = `?type=${getName(rtCode).toLowerCase()}`;
        }
      }
      else if (code === "20") routeStr = "/overseas/direct/detail";
      else if (code === "30") routeStr = "/overseas/pct/detail";
      else if (code === "40") routeStr = "/overseas/ep/detail";
      else if (code === "50") routeStr = "/overseas/madrid/detail";
      else if (code === "60") routeStr = "/overseas/national/detail";
      else if (code === "70") routeStr = "/objection-trial/detail";
      else if (code === "90") routeStr = "/etc-case/detail";
      else routeStr = rowData.appRoute.codeName || String(code);
    }

    const appKey = rowData.appSeq || rowData.tblSeq;
    if (routeStr && appKey) {
      const baseUrl = routeStr.startsWith("/") ? routeStr : `/${routeStr}`;
      const url = baseUrl.endsWith("/") ? `${baseUrl}${appKey}${queryStr}` : `${baseUrl}/${appKey}${queryStr}`;
      navigate(url);
    } else {
      console.warn("[DeadLineMng] 상세 이동 실패: appRoute 또는 시퀀스 누락", rowData);
    }
  };

  const onSearch = (values: any) => {
    const params = buildSearchParams(values);

    // 프론트엔드 동적 기간 조회 (SEARCH_DUEDATE_BASE 알리아스 처리)
    if (params.searchCondition) {
      const idx = params.searchCondition.findIndex((cond: any) => cond.codeName === "SEARCH_DUEDATE_BASE");
      if (idx >= 0) {
        const val = params.searchCondition[idx].codeValue;
        params.searchCondition.splice(idx, 1); // 공통모듈에서 문자열 매칭으로 들어가지 못하게 제거

        let startDate = new Date();
        let endDate = new Date();
        let isDateSearch = true;

        if (val === "week2") endDate = addWeeks(startDate, 2);
        else if (val === "month1") endDate = addMonths(startDate, 1);
        else if (val === "month3") endDate = addMonths(startDate, 3);
        else if (val === "year1") endDate = addYears(startDate, 1);
        else if (val === "overdue") {
          startDate = new Date(1900, 0, 1);
          endDate = subDays(new Date(), 1);
        } else if (val === "all") {
          isDateSearch = false; // 전체 조회 시 날짜 필터 무시
        } else {
          isDateSearch = false; // 알 수 없는 값 무시
        }

        if (isDateSearch) {
          if (!params.dateFilters) params.dateFilters = [];
          // dueDate_date 기반의 커스텀 필터를 삽입
          params.dateFilters.push({
            dateCode: "duedate_date",
            andOrNOT: "AND",
            startDate: format(startDate, 'yyyyMMdd'),
            endDate: format(endDate, 'yyyyMMdd')
          });
        }
      }
    }

    setSearchParams(params); // state 업데이트를 통해 useEffect 트리거하여 최신 데이터 페치
  };

  // 캘린더용 네비게이션 헤더
  const CustomToolbar = (toolbarProps: any) => {
    const { label, onNavigate } = toolbarProps;
    return (
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold">{label}</h2>
        <div className="flex gap-1 items-center">
          <Button size="h32" variant="outline" onClick={() => onNavigate('PREV')}>
            <Icons.ChevronLeft className="size-4" />
          </Button>
          <Button size="h32" variant="outline" onClick={() => onNavigate('TODAY')}>
            오늘
          </Button>
          <Button size="h32" variant="outline" onClick={() => onNavigate('NEXT')}>
            <Icons.ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageTitleArea className="pb-2" title="기일관리">
        <DataMenuButton data={listData} fileName="dead_line_mng" columns={columnsData} />
      </PageTitleArea>

      <PageSearchForm onSearch={onSearch} searchKey={SEARCH_KEY.DUEDATE} />

      <FlatTab
        items={tabs}
        active={activeTab}
        onChange={handleTabChange}
        className="mt-3"
      />

      {activeTab === "LIST" && (
        <>
          <ListResultHeader totalCount={totalCount} />
          <InfiniteDataTable
            offsetTop={340}
            data={listData}
            columns={columnsData}
            getRowId={(row) => String(row.duedateSeq || row.mappingDuedateSeq)}
            onRowClick={(row, rowData) => navigateToDetail(rowData)}
          />
        </>
      )}

      {activeTab === "WEEK" && (
        <div className="mt-4 bg-white p-2 border rounded hide-time-grid">
          <style>
            {`
              .hide-time-grid .rbc-time-view {
                height: auto !important;
                border-bottom: 1px solid #ddd;
              }
              .hide-time-grid .rbc-time-content {
                display: none !important;
              }
              .hide-time-grid .rbc-time-gutter {
                display: none !important;
              }
              .hide-time-grid .rbc-allday-cell {
                min-height: 400px;
                max-height: none !important;
              }
              .hide-time-grid .rbc-time-header.rbc-overflowing {
                margin-right: 0 !important;
                border-right: none !important;
              }
            `}
          </style>
          <Calendar
            culture="ko"
            date={calendarDate}
            defaultView={Views.WEEK}
            view={Views.WEEK}
            onNavigate={(nextDate) => setCalendarDate(nextDate)}
            events={calendarEvents}
            localizer={localizer}
            toolbar={true}
            components={{ toolbar: CustomToolbar }}
            onSelectEvent={(event) => navigateToDetail(event.resource)}
            popup
          />
        </div>
      )}

      {activeTab === "MONTH" && (
        <div className="mt-4 bg-white p-2 border rounded">
          <Calendar
            culture="ko"
            date={calendarDate}
            defaultView={Views.MONTH}
            view={Views.MONTH}
            onNavigate={(nextDate) => setCalendarDate(nextDate)}
            events={calendarEvents}
            localizer={localizer}
            toolbar={true}
            components={{ toolbar: CustomToolbar }}
            onSelectEvent={(event) => navigateToDetail(event.resource)}
            popup
            style={{ height: 800 }}
          />
        </div>
      )}

      {(activeTab === "WEEK" || activeTab === "MONTH") && (
        <>
          <ListResultHeader totalCount={totalCount} />
          <InfiniteDataTable
            offsetTop={340}
            data={listData}
            columns={columnsData}
            getRowId={(row) => String(row.duedateSeq || row.mappingDuedateSeq)}
            onRowClick={(row, rowData) => navigateToDetail(rowData)}
          />
        </>
      )}
    </>
  );
};

export default DeadLineMng;
