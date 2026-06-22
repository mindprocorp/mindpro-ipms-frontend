import type { ReactNode } from "react";
import { cn } from "@repo/ui";

interface DashCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * 대시보드 공통 카드 컨테이너.
 * 흰 배경 + rounded-3xl + border + shadow-sm — 다크모드 자동 대응.
 */
export const DashCard = ({ children, className }: DashCardProps) => (
  <div className={cn("bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-sm", className)}>
    {children}
  </div>
);

interface DashSectionTitleProps {
  children: ReactNode;
  right?: ReactNode;
  className?: string;
}

/** h3 스타일 통일 + 우측 컨트롤(셀렉트/링크) 슬롯 */
export const DashSectionTitle = ({ children, right, className }: DashSectionTitleProps) => (
  <h3 className={cn("text-lg font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center justify-between gap-3", className)}>
    <span className="flex items-center gap-3">{children}</span>
    {right}
  </h3>
);

interface DashSummaryItemProps {
  label: string;
  value: number;
  Icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
}

/** 작은 요약 카드 (icon + label + value) */
export const DashSummaryItem = ({ label, value, Icon, iconColor }: DashSummaryItemProps) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm flex flex-col items-center justify-center group hover:border-[#4285F4] transition-all duration-300">
    <Icon className={cn("size-6 mb-3 transition-transform group-hover:scale-110", iconColor)} />
    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-tight">{label}</span>
    <span className="text-xl font-black text-slate-700 dark:text-slate-200">{value.toLocaleString()}</span>
  </div>
);
