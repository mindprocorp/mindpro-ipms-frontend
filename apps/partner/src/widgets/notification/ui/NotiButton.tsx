import { Button, cn, Icons, Popover, PopoverContent, PopoverTrigger } from "@repo/ui";
import NotiPanel from "./NotiPanel";

type ButtonProps = {
  className?: React.CSSProperties;
};

const NotiButton = ({ className }: ButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-auto min-w-auto p-1 hover:bg-white/20">
          <Icons.Bell className={cn("size-5 text-white", className)} />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-96 p-0">
        <NotiPanel />
      </PopoverContent>
    </Popover>
  );
};

export default NotiButton;
