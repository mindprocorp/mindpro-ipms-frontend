import {
  FlexBox,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@repo/ui";
import { Fragment } from "react/jsx-runtime";
import Logo from "@repo/assets/images/IPMS.svg?react";
import OrganiButton from "@widgets/organization/ui/OrganiButton";
import NotiButton from "@widgets/notification/ui/NotiButton";
import { UserDropDown } from "@widgets/avataWithDropdown/ui/UserDropDown";

const menu = [
  {
    label: "대쉬보드",
    children: [
      { label: "1", children: [] },
      { label: "2", children: [] },
      { label: "3", children: [] },
    ],
  },
  { label: "나의 업무", children: [] },
  { label: "국내출원", children: [] },
  { label: "해외출원", children: [] },
  { label: "이의심판", children: [] },
  { label: "기타관리", children: [] },
  { label: "청구서", children: [] },
  { label: "고객관리", children: [] },
  { label: "...", children: [] },
];

const Gnb = () => {
  return (
    <FlexBox className="border-border-200 to-p-color-3 justify-between border-b bg-linear-to-r from-[#20327B] px-4">
      <FlexBox className="flex items-center gap-2">
        <Logo className="size-12 text-white" />
        <Menubar
          defaultValue="나의 업무"
          onValueChange={(value) => console.log(value)}
          className="border-0 bg-transparent shadow-none [&>button]:text-white/50 [&>button]:hover:bg-transparent [&>button]:hover:text-white"
        >
          <>
            {menu.map((item) => {
              if (item.children.length > 0) {
                return (
                  <Fragment key={crypto.randomUUID()}>
                    <MenubarMenu value={item.label}>
                      <MenubarTrigger>{item.label}</MenubarTrigger>
                      <MenubarContent>
                        {item.children.map((s) => {
                          return (
                            <Fragment key={crypto.randomUUID()}>
                              <MenubarItem>{s.label}</MenubarItem>
                            </Fragment>
                          );
                        })}
                      </MenubarContent>
                    </MenubarMenu>
                  </Fragment>
                );
              }
              return (
                <MenubarMenu value={item.label} key={crypto.randomUUID()}>
                  <MenubarTrigger>{item.label}</MenubarTrigger>
                </MenubarMenu>
              );
            })}
          </>
        </Menubar>
      </FlexBox>

      <FlexBox className="flex items-center gap-3">
        <OrganiButton />
        <NotiButton />
        <UserDropDown />
      </FlexBox>
    </FlexBox>
  );
};

export default Gnb;
