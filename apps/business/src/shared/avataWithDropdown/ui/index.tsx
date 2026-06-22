import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  AvatarWrap,
} from "@repo/ui";

import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { useAuthStore } from "@shared/store/useUserInfoStore.ts";
import { useNavigate } from "react-router-dom";
import User from "@repo/assets/images/user.png";

export const UserDropDown = () => {
  const userNm = localStorage.getItem("userNm");
  const navigation = useNavigate();

  function logout() {
    useAlertStore.getState().openAlert({
      message: "정말 로그아웃 하시겠습니까?",
      confirmText: "로그아웃",
      onConfirm: () => {
        useAuthStore.getState().clearUser();
        navigation("/");
      },
    });
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-white/20">
          <AvatarWrap img={User} />
          {/* <div className="flex flex-col [&>span:first-child]:text-sm [&>span:last-child]:text-xs">
            <span>{userNm}</span>
            <span className="text-text-200">exmple@gmail.com</span>
          </div> */}
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
          <DropdownMenuItem className="text-p-color-2!" onSelect={logout}>
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
