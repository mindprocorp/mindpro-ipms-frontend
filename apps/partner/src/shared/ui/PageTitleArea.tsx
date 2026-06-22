import { cn, FlexBox } from "@repo/ui";
import React from "react";

type Props = {
  title: string;
  desc?: string;
  className?: string;
  progress?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

const PageTitleArea = ({ title, desc, className, actions, children, progress }: Props) => {
  return (
    <FlexBox className={cn("flex items-center justify-between", className)}>
      <FlexBox className="flex-col items-start gap-1">
        <FlexBox className="items-center gap-2">
          <h2 className="min-h-7 text-base font-bold tracking-tighter">{title}</h2>
          {progress && (
            <span className="bg-p-color-1 rounded-full px-2 py-1 text-xs text-white">{progress}</span>
          )}
        </FlexBox>
        {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
      </FlexBox>

      <FlexBox className="flex-0 gap-1">
        {actions && (
          <ul className="flex items-center gap-1">
            <li>{actions}</li>
          </ul>
        )}
        {children}
      </FlexBox>
    </FlexBox>
  );
};

export default PageTitleArea;
