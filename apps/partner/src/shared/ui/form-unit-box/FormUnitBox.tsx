import { cn, FlexBox, Icons, RHF } from "@repo/ui";
import React from "react";

type Props = {
  children: React.ReactNode;
  title?: string;
  titleExtra?: React.ReactNode;
  actions?: React.ReactNode;
  vertical?: boolean;
  className?: string;
  fullsize?: boolean;
  boxfull?: boolean;
};

export const FormUnitBox = ({
  children,
  title,
  titleExtra,
  actions,
  vertical,
  className,
  fullsize = false, //textarea에서만 사용하세요
  boxfull = false, //textarea에서만 사용하세요
}: Props) => {
  return (
    <div
      data-fullsize={fullsize ? "true" : "false"}
      data-boxfull={boxfull ? "true" : "false"}
      className={cn(
        "group border-border-200 inset-shadow-md dark:border-input flex w-full flex-col items-stretch gap-0 rounded-md border",
        className,
        "data-[boxfull=true]:flex-1 data-[fullsize=true]:flex-1 data-[fullsize=true]:[&>div:last-child>div]:flex-1",
      )}
    >
      {title && (
        <div className="border-border-200 bg-bg-100 dark:border-input dark:bg-background-color/40 flex min-h-9 flex-0 items-center justify-between rounded-t-md border-b px-4">
          <div className="flex items-center gap-1.5">
            <BoxTitle title={title} className="w-auto" />
            {titleExtra}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <RHF.FormField
        vertical={!!vertical}
        className={cn("p-2 px-3 [&>div]:gap-1", "group-data-[fullsize=true]:flex-1")}
      >
        {children}
      </RHF.FormField>
    </div>
  );
};

export const BoxTitle = ({ title, className }: { title: string; className?: string }) => {
  return <h2 className={cn(`w-full text-[13px] font-semibold`, className)}>{title}</h2>;
};

export const UnitInnerBox = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "border-border-200 dark:border-input dark:bg-background-color/40 flex flex-col gap-1 rounded-md border p-3 pt-2",
        className,
      )}
    >
      {children}
    </div>
  );
};
