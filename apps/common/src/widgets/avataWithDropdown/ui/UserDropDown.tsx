import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui'

import AvataWrap from './Avata'

export const UserDropDown = () => {
  const userNm = localStorage.getItem('userNm')


  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-colors">
          <AvataWrap />
          <div className="flex flex-col [&>span:first-child]:text-sm [&>span:last-child]:text-xs">
            <span>{userNm}</span>
            <span className="text-text-200">exmple@gmail.com</span>
          </div>
          {/* <ArrowUp /> */}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="end">
        {/* <DropdownMenuLabel className="text-xs text-text-200">File Actions</DropdownMenuLabel> */}
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => null}>정보수정</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-p-color-2!" onSelect={()=> alert()}>
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
