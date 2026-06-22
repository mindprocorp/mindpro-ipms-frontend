import { UserDropDown } from "@shared/avataWithDropdown/ui";
import LangChoice from "@shared/locales/LangChoice";
import NotiButton from "@shared/notification/ui/NotiButton";
import OrganiButton from "@shared/organization/ui/OrganiButton";
import Theme from "@shared/theme/Theme";
import Logo from "@repo/assets/images/IPMS.svg?react";

const Top = () => {
  return (
    <div className="border-border-200 dark:border-input bg-background sticky top-0 z-50 flex items-center justify-between border-b px-4 dark:bg-[#171717]">
      <div>
        <Logo className="size-14" />
      </div>
      <div className="flex items-center gap-2">
        <OrganiButton />
        <NotiButton />
        <Theme className="border-none" />
        <LangChoice />
        <UserDropDown />
      </div>
    </div>
  );
};

export default Top;
