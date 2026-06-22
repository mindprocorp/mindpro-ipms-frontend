import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shadcn-components/ui/collapsible'
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/shadcn-components/ui/sidebar'
import { Plus, Minus } from 'lucide-react'

type TreeItem = string | TreeItem[]
type TreeItem2 = {
  item: TreeItem
  space?: number
  Icon?: React.ReactElement
}

const Tree = ({ item, space = 0, Icon }: TreeItem2) => {
  const [name, ...items] = Array.isArray(item) ? item : [item]
  const style = { '--space': space } as React.CSSProperties
  const defaultButtonClass =
    'group data-[active=true]:bg-transparent h-[40px] py-0 pl-[calc(var(--space)*16px)] [&>svg]:size-5 [&>svg]:text-text-200 font-medium text-text'
  const firstButtonClass =
    'data-[active=true]:bg-bg-300! data-[active=true]:[&_svg]:text-text pl-3 text-text!'
  const lastButtonClass =
    'data-[active=true]:text-p-color-1! data-[active=true]:[&>span]:border-l-p-color-1'
  const lastDepth = () => {
    return Array.isArray(item) && [item].flatMap((v) => v).length === 1
      ? 'border-s border-l-border-100 pl-2 data-[active=true]:bg-red-500'
      : ''
  }

  if (!items.length) {
    return (
      <SidebarMenuButton
        isActive={name === 'button.tsx'}
        style={style}
        className={`${defaultButtonClass} ${lastButtonClass} h-[32px] text-xs text-text-200`}
      >
        <span className={`h-full flex items-center ${lastDepth()}`}>{name}</span>
      </SidebarMenuButton>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible"
        defaultOpen={name === '출원관리' || name === 'ui' || name === '결재함'}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            style={style}
            isActive={name === '출원관리'}
            className={`
              ${defaultButtonClass} 
              // [&[data-state=open]]:text-text
              [&[data-state=open]>svg.icon-plus]:hidden 
              [&[data-state=closed]>svg.icon-minus]:hidden 
              [&[data-state=open]>svg.icon-minus]:text-text! 
              ${space !== 0 ? 'text-xs h-[32px] gap-1 text-text-200' : ''} 
              ${space === 0 ? firstButtonClass : ''} 
          `}
          >
            {/* <ChevronRight className="transition-transform" /> */}
            {Icon ? (
              Icon
            ) : (
              <>
                <Plus className="icon-plus size-3!" />
                <Minus className="icon-minus size-3!" />
              </>
            )}
            {name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub
            className={`mx-0 px-0 border-0 gap-0 ${items.flatMap((item) => item).length === 2 ? '[&>button>span]:border-s [&>button>span]:border-l-border-100 [&>button>span]:pl-2' : ''}`}
          >
            {items.map((subItem, index) => {
              return <Tree key={index} item={subItem} space={space + 1} />
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

export default Tree
