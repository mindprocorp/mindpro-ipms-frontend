import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarProvider,
} from '@repo/ui'
import { data } from '../dumyData'
import Tree from '@/widgets/lnb/ui/Lnb-type'
import Medal from '@/assets/fill/business/medal-fill.svg?react'
import Auction from '@/assets/fill/finance/auction-fill.svg?react'
import Paper from '@/assets/fill/document/newspaper-fill.svg?react'
import Chart from '@/assets/fill/business/bar-chart-box-fill.svg?react'
import Wellet from '@/assets/fill/finance/wallet-3-fill.svg?react'
import Inbox from '@/assets/fill/business/inbox-fill.svg?react'
import Article from '@/assets/fill/document/article-fill.svg?react'
import Setting from '@/assets/fill/system/settings-3-fill.svg?react'

const icons = [
  <Medal />,
  <Auction />,
  <Paper />,
  <Chart />,
  <Wellet />,
  <Inbox />,
  <Article />,
  <Setting />,
]

const Lnb = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <SidebarProvider className="h-full min-h-full">
      <Sidebar {...props} className="border-r-border-200 inset-auto">
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
  )
}

export default Lnb
