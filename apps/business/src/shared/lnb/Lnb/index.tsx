import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarProvider,
} from "@repo/ui";
import { data } from "../dumyData";
import Tree from "./LnbTree";
import Medal from "@repo/assets/images/fill/business/medal-fill.svg?react";
import Auction from "@repo/assets/images/fill/finance/auction-fill.svg?react";
import Paper from "@repo/assets/images/fill/document/newspaper-fill.svg?react";
import Chart from "@repo/assets/images/fill/business/bar-chart-box-fill.svg?react";
import Wellet from "@repo/assets/images/fill/finance/wallet-3-fill.svg?react";
import Inbox from "@repo/assets/images/fill/business/inbox-fill.svg?react";
import Article from "@repo/assets/images/fill/document/article-fill.svg?react";
import Setting from "@repo/assets/images/fill/system/settings-3-fill.svg?react";

const icons = [
  <Medal />,
  <Auction />,
  <Paper />,
  <Chart />,
  <Wellet />,
  <Inbox />,
  <Article />,
  <Setting />,
];

const Lnb = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <SidebarProvider className="h-full min-h-full w-auto">
      <Sidebar {...props} className="border-r-border-200 dark:border-input inset-auto">
        <SidebarContent>
          <SidebarGroup>
            {/* <SidebarGroupLabel>Files</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {data.tree.map((item, index) => (
                  <Tree key={index} item={item} Icon={icons[index]} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default Lnb;
