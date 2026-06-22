import Logo from "@shared/assets/IPMS.svg?react";
import { cn } from "@repo/ui";
import LangChoice from "@shared/locales/LangChoice";
import Theme from "@shared/theme/Theme";

type Props = {
  children: React.ReactNode;
  className?: React.CSSProperties | string;
};

const OnlyForm = ({ children, className }: Props) => {
  return (
    <div className={cn("flex min-h-screen justify-center py-10", className)}>
      <div className="border-border-100 bg-bg-50 dark:bg-background dark:border-input fixed top-0 left-0 z-5 flex w-full! items-center gap-4 border-b p-2 px-4">
        <Logo className="text-text size-12 h-8 dark:text-white" />
        <p className="text-text-200 text-xs">당신의 지적재산을 위한 ALL CARE 서비스를 만나보세요</p>
        <div className="ml-auto flex items-center">
          <Theme />
          <LangChoice />
        </div>
      </div>
      <div className="mt-10 w-[490px]">
        {/* <Outlet /> */}
        {children}
      </div>
    </div>
  );
};

export default OnlyForm;
