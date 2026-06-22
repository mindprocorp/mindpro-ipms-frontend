import type { LabelAndValueProps } from "@shared/schema";
import { Button, cn, FlexBox } from "@repo/ui";
import FlatItem from "./FlatItem";
import BoxItem from "./BoxItem";

type Props = {
  items?: LabelAndValueProps[];
  className?: string;
  active?: string;
  children?: React.ReactNode;
  onClick?: (value: string) => void;
  onChange?: (label: string) => void;
};

const FlatTab = ({ children, items, className, active, onChange }: Props) => {
  if (children) {
    return (
      <FlexBox
        className={cn(
          "border-slate-200 dark:border-slate-700 justify-between gap-0 border-b",
          className,
        )}
      >
        {children}
      </FlexBox>
    );
  }
  return (
    <FlexBox
      className={cn(
        "border-slate-200 dark:border-slate-700 justify-between gap-0 border-b",
        className,
      )}
    >
      <FlexBox className="gap-4">
        {items?.map((item) => {
          return (
            <FlatItem
              key={crypto.randomUUID()}
              label={item.label}
              value={item.value}
              active={active}
              onClick={() => onChange?.(item.value)}
            />
          );
        })}
      </FlexBox>

      {/*<div className="flex gap-1">*/}
      {/*  <Button>누적결과초기화</Button>*/}
      {/*  <Button>검색결과누적</Button>*/}
      {/*  <Button>누적결과조회</Button>*/}
      {/*</div>*/}
    </FlexBox>
  );
};

const BoxTab = ({ children, items, className, active, onClick }: Props) => {
  if (children) {
    return (
      <FlexBox
        className={cn(
          "border-p-color-4/10 bg-p-color-4/5 dark:border-border-100/10 justify-between gap-0 rounded-md border p-1",
          className,
        )}
      >
        {children}
      </FlexBox>
    );
  }

  return (
    <FlexBox
      className={cn(
        "border-p-color-4/10 bg-p-color-4/5 dark:border-border-100/10 justify-between gap-0 rounded-md border p-1",
        className,
      )}
    >
      <FlexBox className="gap-1">
        {items?.map((item) => {
          return (
            <BoxItem
              key={crypto.randomUUID()}
              label={item.label}
              value={item.value}
              active={active}
              onClick={onClick}
            />
          );
        })}
      </FlexBox>
    </FlexBox>
  );
};

export { FlatTab, BoxTab };
