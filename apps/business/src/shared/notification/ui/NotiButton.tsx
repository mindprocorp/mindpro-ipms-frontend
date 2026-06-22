import { Button, cn, Icons } from "@repo/ui";

type ButtonProps = {
  className?: React.CSSProperties;
};

const NotiButton = ({ className }: ButtonProps) => {
  return (
    <Button variant="ghost" className="relative h-auto min-w-auto p-1 hover:bg-white/20">
      {/* <Notification className={cn('text-text size-6', className)} /> */}
      <Icons.Bell className={cn("size-5", className)} />
      <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
    </Button>
  );
};

export default NotiButton;
