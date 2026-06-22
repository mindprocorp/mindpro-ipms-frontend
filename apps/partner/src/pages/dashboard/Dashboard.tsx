import {
  FlexBox,
  Icons,
  RHF,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  DataTable,
  ResponsiveContainer,
  CustomTooltip,
  Button,
} from "@repo/ui";
import { Link } from "react-router-dom";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { dashboardQueries } from "@shared/query/dashboard/dashboardQueries";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import {
  DashboardSearchSchema,
  type DashboardSearchInput,
} from "@shared/schema/dashboard/dashboardSchema";
// import { columnsData } from "./columns/columnsData";
import { DashCard, DashSectionTitle, DashSummaryItem } from "./_components/DashCard";
import { getName, getCode } from "@shared/enum/domesticType";
import { format } from "date-fns";

const statusChartConfig: ChartConfig = {
  출원완료: { label: "출원완료", color: "#6B9BF2" },
  진행중: { label: "진행중", color: "#F5C542" },
  "취하/포기": { label: "취하/포기", color: "#F28B82" },
  진행: { label: "진행", color: "#F5C542" },
  완료: { label: "완료", color: "#6B9BF2" },
  신규: { label: "신규", color: "#4285F4" },
  취소: { label: "취소", color: "#F28B82" },
  포기: { label: "포기", color: "#94A3B8" },
  기타: { label: "기타", color: "#E2E8F0" },
};

const monthlyChartConfig: ChartConfig = {
  newRequest: { label: "신규요청", color: "#4285F4" },
  domesticAccept: { label: "국내접수", color: "#34A853" },
  overseasAccept: { label: "해외접수", color: "#FBBC05" },
  searchRequest: { label: "조사의뢰", color: "#EA4335" },
};

const countryColors = { 국내: "#34A853", 해외: "#EA4335" } as const;

const STATE_ORDER = ["진행", "완료", "취소", "포기"];
const sortByState = <T extends { name: string }>(arr: T[]) =>
  [...arr].sort((a, b) => {
    const orderOf = (n: string) => {
      const i = STATE_ORDER.findIndex((o) => n.includes(o));
      return i === -1 ? 99 : i;
    };
    return orderOf(a.name) - orderOf(b.name);
  });

// 코드값 매핑 유틸 (차트 데이터 등 명칭이 직접 오지 않는 경우 대비)
const mapStatusCodeToName = (name: string) => {
  const maps: Record<string, string> = {
    "10": "신규",
    "20": "진행",
    "30": "완료",
    "40": "취하",
    "50": "포기",
    "99": "기타",
  };
  return maps[name] || name || "기타";
};

const Dashboard = () => {
  const navigate = useNavigate();
  // UserResponseType 의 키는 `officeId` (서버 응답 컬럼명). queryKey 분리용으로만 사용 — 백엔드는 JWT의 office_seq 사용.
  const officeSeq = useAuthStore((s) => s.user?.officeId);
  const now = new Date();
  const defaultValues: DashboardSearchInput = {
    startDate: format(new Date(now.getFullYear(), now.getMonth(), 1), "yyyy-MM-dd"),
    endDate: format(now, "yyyy-MM-dd"),
    year: now.getFullYear(),
  };

  const form = useForm<DashboardSearchInput>({
    resolver: zodResolver(DashboardSearchSchema),
    defaultValues,
  });

  const searchValues = form.watch();

  const { data: apiResponse, isLoading } = useQuery({
    ...dashboardQueries.getOverview(officeSeq, searchValues.startDate, searchValues.endDate, searchValues.year),
  });

  const overview = apiResponse?.data;
  const summary = overview?.summaryData;
  const recentList = overview?.recentList || [];

  // 컬럼 정의를 컴포넌트 내부로 이동 (Link/Navigate 연동 및 매핑 확실히 하기 위해)
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "createDate",
      header: "접수일",
      size: 100,
    },
    {
      accessorKey: "rightCategory",
      header: "권리구분",
      size: 100,
    },
    {
      accessorKey: "appNo",
      header: "출원번호",
      size: 150,
    },
    {
      accessorKey: "titleKo",
      header: "사건명(한글)",
      size: 300,
      className: "text-left",
    },
    {
      accessorKey: "appState",
      header: "출원상태",
      size: 120,
      cell: ({ row }) => {
        const name = row.original.appStateName;
        return <span className="font-bold text-blue-600">{name || "-"}</span>;
      },
    },
    {
      accessorKey: "state",
      header: "현재상태",
      size: 120,
      cell: ({ row }) => {
        const name = row.original.stateName;
        return <span>{name || "-"}</span>;
      },
    },
  ];

  const summaryItems = [
    { label: "신규요청", value: summary?.newRequest || 0, Icon: Icons.Monitor,       iconColor: "text-[#4285F4]" },
    { label: "수정변경", value: summary?.modifiedRequest || 0, Icon: Icons.FileText,  iconColor: "text-[#9C27B0]" },
    { label: "국내접수", value: summary?.domesticAccept || 0,  Icon: Icons.Layers,    iconColor: "text-[#34A853]" },
    { label: "해외접수", value: summary?.overseasAccept || 0,  Icon: Icons.Globe,     iconColor: "text-[#FBBC05]" },
    { label: "진행중",   value: summary?.inProgress || 0,      Icon: Icons.RefreshCw, iconColor: "text-[#F5C542]" },
    { label: "완료",     value: summary?.completed || 0,       Icon: Icons.CalendarCheck, iconColor: "text-[#6B9BF2]" },
  ];

  const filteredStatus = sortByState(
    (overview?.statusData || [])
      .filter((it) => it.name !== "없음")
      .map((it) => ({
        ...it,
        name: mapStatusCodeToName(it.name),
      })),
  );

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen">
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <PageTitleArea title="대시보드" className="mb-2">
            <FlexBox className="items-center gap-3">
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-5 py-1.5 rounded-xl border shadow-sm min-w-[380px]">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight whitespace-nowrap border-r pr-4 mr-1">기간설정</span>
                <RHF.FormDatePicker control={form.control} name="startDate" />
                <span className="text-slate-300 dark:text-slate-600 font-bold">~</span>
                <RHF.FormDatePicker control={form.control} name="endDate" />
              </div>
            </FlexBox>
          </PageTitleArea>
        </form>
      </FormProvider>

      {/* 상단 요약 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm flex flex-col justify-center">
          <span className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-1">Total</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-[#4285F4]">{(summary?.total || 0).toLocaleString()}</span>
            <span className="text-sm font-bold text-slate-400">건</span>
          </div>
        </div>
        <div className="lg:col-span-10 grid grid-cols-3 md:grid-cols-6 gap-4">
          {summaryItems.map((item) => (
            <DashSummaryItem key={item.label} {...item} />
          ))}
        </div>
      </div>

      {/* 중단 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 상태별 현황 */}
        <DashCard>
          <DashSectionTitle>상태별 현황</DashSectionTitle>
          <div className="h-[240px] mb-8">
            <ChartContainer config={statusChartConfig} className="h-full w-full">
              <PieChart>
                <Pie
                  data={filteredStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={2}
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {filteredStatus.map((entry, i) => {
                    const configColor = statusChartConfig[entry.name as keyof typeof statusChartConfig]?.color;
                    const fillColor = entry.fill && entry.fill !== "#000000" ? entry.fill : (configColor || "#E2E8F0");
                    return (
                      <Cell key={`cell-${i}`} fill={fillColor} className="hover:opacity-80 transition-opacity" />
                    );
                  })}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t pt-6">
            {filteredStatus.map((item) => {
              const configColor = statusChartConfig[item.name as keyof typeof statusChartConfig]?.color;
              const fillColor = item.fill && item.fill !== "#000000" ? item.fill : (configColor || "#E2E8F0");
              return (
                <div key={item.name} className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full shadow-sm" style={{ backgroundColor: fillColor }} />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.name}</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                    {item.value}<span className="text-[10px] ml-0.5 text-slate-400 dark:text-slate-500 font-bold">건</span>
                  </span>
                </div>
              );
            })}
          </div>
        </DashCard>

        {/* 출원국가 현황 */}
        <DashCard>
          <DashSectionTitle>출원국가 현황</DashSectionTitle>
          <div className="flex justify-around items-center h-[200px] mt-10">
            {(["국내", "해외"] as const).map((country) => {
              const item = (overview?.countryData || []).find((d) => d.name === country) || { value: 0 };
              const color = countryColors[country];
              return (
                <div key={country} className="flex flex-col items-center relative gap-4">
                  <div className="size-36 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[{ value: item.value }, { value: 100 - item.value }]}
                          dataKey="value"
                          startAngle={180}
                          endAngle={-180}
                          innerRadius={45}
                          outerRadius={65}
                          stroke="none"
                        >
                          <Cell fill={color} />
                          <Cell fill="#F1F3F4" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black text-slate-800 dark:text-slate-100 leading-none">{item.value}</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 pt-2">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm font-black text-slate-600 dark:text-slate-300">{country}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </DashCard>

        {/* 권리구분 현황 */}
        <DashCard>
          <DashSectionTitle>권리구분 현황</DashSectionTitle>
          <div className="flex flex-col gap-5 pt-2">
            {(overview?.rightData || []).map((item) => {
              const maxValue = Math.max(...(overview?.rightData || []).map((d) => d.value), 1);
              const percent = (item.value / maxValue) * 100;
              return (
                <div key={item.name} className="space-y-1.5 group">
                  <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>{item.name}</span>
                  </div>
                  <CustomTooltip message={`${item.value}건`}>
                    <div className="h-4 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700 cursor-pointer">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                        style={{ width: `${percent}%`, backgroundColor: item.fill }}
                      />
                    </div>
                  </CustomTooltip>
                </div>
              );
            })}
          </div>
        </DashCard>
      </div>

      {/* 하단 기간별 현황 */}
      <DashCard>
        <DashSectionTitle
          right={
            <div className="flex gap-6">
              {Object.entries(monthlyChartConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: config.color }} />
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">{config.label}</span>
                </div>
              ))}
            </div>
          }
        >
          기간별 현황
          <div className="w-28">
            <FormProvider {...form}>
              <RHF.FormSelect
                control={form.control}
                name="year"
                items={[
                  { label: "2024년", value: 2024 },
                  { label: "2025년", value: 2025 },
                  { label: "2026년", value: 2026 },
                ]}
              />
            </FormProvider>
          </div>
        </DashSectionTitle>
        <div className="h-[400px] w-full">
          <ChartContainer config={monthlyChartConfig} className="h-full w-full">
            <LineChart data={overview?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F4" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }} dx={-15} />
              <ChartTooltip content={<ChartTooltipContent className="rounded-2xl border-none shadow-2xl bg-white/95" />} />
              <Line type="monotone" dataKey="newRequest" stroke="#4285F4" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "#4285F4" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="domesticAccept" stroke="#34A853" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "#34A853" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="overseasAccept" stroke="#FBBC05" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "#FBBC05" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="modifiedRequest" stroke="#9C27B0" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "#9C27B0" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="searchRequest" stroke="#EA4335" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "#EA4335" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ChartContainer>
        </div>
      </DashCard>

      {/* 최근 사건 리스트 */}
      <DashCard>
        <DashSectionTitle>
          최근 사건 리스트 (TOP 10)
        </DashSectionTitle>
        <div className="overflow-auto custom-scrollbar">
          <DataTable
            data={recentList}
            columns={columns}
            isLoading={isLoading}
            onRowClick={(_, rowData) => {
              const type = getName(getCode(rowData.rightCategory)).toLowerCase();
              navigate(`/domestic/detail/${rowData.appSeq}?type=${type}`);
            }}
            className="border-none shadow-none [&_th]:bg-[#F8F9FA] dark:[&_th]:bg-slate-800 [&_th]:text-[11px] [&_th]:font-bold [&_th]:text-slate-500 dark:[&_th]:text-slate-400 [&_td]:py-4"
          />
        </div>
      </DashCard>
    </div>
  );
};

export default Dashboard;
