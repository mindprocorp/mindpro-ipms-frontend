import { cn, CustomScrollArea, Icons } from "@repo/ui";
import { useState } from "react";

export type NotiCategory = "전체" | "기일" | "접수" | "발송" | "결재" | "시스템";

export type NotiItem = {
  seq: number;
  category: NotiCategory;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
};

const categories: NotiCategory[] = ["전체", "기일", "접수", "발송", "결재", "시스템"];

const NotiPanel = () => {
  const [activeCategory, setActiveCategory] = useState<NotiCategory>("전체");
  const [notifications, setNotifications] = useState<NotiItem[]>([]);

  const newNotifications = notifications.filter((n) => !n.isRead);
  const oldNotifications = notifications.filter((n) => n.isRead);

  const filtered = (list: NotiItem[]) =>
    activeCategory === "전체"
      ? list
      : list.filter((n) => n.category === activeCategory);

  const getCategoryIcon = (category: NotiCategory) => {
    switch (category) {
      case "기일":
        return <Icons.Calendar className="size-4 text-blue-500" />;
      case "접수":
        return <Icons.FileInput className="size-4 text-green-500" />;
      case "발송":
        return <Icons.Send className="size-4 text-orange-500" />;
      case "결재":
        return <Icons.FileCheck className="size-4 text-purple-500" />;
      case "시스템":
        return <Icons.Monitor className="size-4 text-gray-500" />;
      default:
        return <Icons.Bell className="size-4 text-gray-500" />;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-bold">알림</h2>
        <button type="button" className="text-text-200 hover:text-foreground">
          <Icons.Settings className="size-4" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 px-4 py-3">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              activeCategory === cat
                ? "border-p-color-1 bg-p-color-1 text-white"
                : "border-border-100 text-text-200 hover:bg-bg-100",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <CustomScrollArea className="h-100">
        <div className="px-4 pb-4">
          {/* 새 알림 */}
          {filtered(newNotifications).length > 0 && (
            <>
              <h3 className="text-text-200 mb-2 text-xs font-bold">새 알림</h3>
              <div className="space-y-2">
                {filtered(newNotifications).map((noti) => (
                  <NotiCard key={noti.seq} noti={noti} getCategoryIcon={getCategoryIcon} />
                ))}
              </div>
            </>
          )}

          {/* 이전 알림 */}
          {filtered(oldNotifications).length > 0 && (
            <>
              <h3 className="text-text-200 mt-4 mb-2 text-xs font-bold">이전 알림</h3>
              <div className="space-y-2">
                {filtered(oldNotifications).map((noti) => (
                  <NotiCard key={noti.seq} noti={noti} getCategoryIcon={getCategoryIcon} />
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {filtered(notifications).length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Icons.BellOff className="text-text-200 mb-2 size-8" />
              <p className="text-text-200 text-sm">알림이 없습니다.</p>
            </div>
          )}
        </div>
      </CustomScrollArea>
    </>
  );
};

const NotiCard = ({
  noti,
  getCategoryIcon,
}: {
  noti: NotiItem;
  getCategoryIcon: (category: NotiCategory) => React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-colors",
        noti.isRead
          ? "border-border-100 bg-bg-100"
          : "border-border-100 bg-background",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {getCategoryIcon(noti.category)}
          <span className="text-text-200 text-xs">{noti.category}</span>
        </div>
        <span className="text-text-200 text-xs">{noti.date}</span>
      </div>
      <p className="mt-1 text-sm font-medium">{noti.title}</p>
      <p className="text-text-200 mt-0.5 truncate text-xs">{noti.content}</p>
    </div>
  );
};

export default NotiPanel;
