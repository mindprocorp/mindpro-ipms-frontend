import { Button, cn, Icons } from "@repo/ui";
import { OrganizationPopup } from "./Popup";
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
        <Icons.Network className={cn("size-5", className)} />
        {/* <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span> */}
      </Button>
      <OrganizationPopup title="조직도" open={open} onOpenChange={setOpen} />
    </>
  );
};

export default OrganiButton;
