import Bar from "@/assets/line/system/side-bar-line.svg?react";
import Ipms from "@/assets/IPMS.png";
import logo from "@/assets/logo_1.png";
import { Button } from "@repo/ui";
import { UserDropDown } from "@widgets/avataWithDropdown/ui/UserDropDown";
import OrganiButton from "@widgets/organization/ui/OrganiButton";
import NotiButton from "@widgets/notification/ui/NotiButton";

const Header = () => {
  return (
    <div className="border-b-border-200 relative z-30 flex h-16 items-center justify-between border-b px-4 shadow-md/5">
      <div className="flex items-center gap-2">
        <Button variant="ghost">
          <Bar className="text-text-200 size-6" />
        </Button>
        <div className="flex items-center gap-3">
          <img src={Ipms} className="" alt="Ipms" />
          <img src={logo} className="" alt="logo" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <NotiButton />
        <OrganiButton />
        <UserDropDown />
      </div>
    </div>
  );
};

export default Header;
