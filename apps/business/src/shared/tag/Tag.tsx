import { Button, cn, FlexBox, Icons } from "@repo/ui";

type Props = {
  label: string;
  onDel?: () => void;
  className?: string;
  condition?: string;
};

export const Tag = ({ label, onDel, className, condition }: Props) => {
  const onDelHandler = () => {};
  return (
    <div
      className={cn(
        "border-text-100/30 flex min-h-6 w-fit flex-none items-center justify-between gap-1 rounded-full border bg-white pr-1 pl-3 text-xs hover:border-[#999]",
        className,
      )}
    >
      <span className="text-xs">{label}</span>
      {onDel && (
        <Button variant="ghost" size="h24" className="h-4 p-0 px-1" onClick={onDel}>
          <Icons.X className="size-3" />
        </Button>
      )}
      <Button variant="ghost" size="h24" className="h-4 p-0 px-1" onClick={onDel}>
        <Icons.X className="size-3" />
      </Button>
    </div>
  );
};
