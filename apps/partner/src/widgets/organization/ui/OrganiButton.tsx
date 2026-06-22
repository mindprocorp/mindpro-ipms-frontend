import { Button, cn, Icons } from "@repo/ui";
import { UserModal } from "@pages/common/modal/user/UserModal";
import React from "react";

type ButtonProps = {
  className?: React.CSSProperties;
};

const OrganiButton = ({ className }: ButtonProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button
        variant="ghost"
        className="relative h-auto min-w-auto p-1 hover:bg-white/20"
        onClick={() => setOpen(true)}
      >
        <Icons.Network className={cn("size-5 text-white", className)} />
      </Button>
      <UserModal title="조직도" open={open} onOpenChange={setOpen} />
    </>
  );
};

export default OrganiButton;
