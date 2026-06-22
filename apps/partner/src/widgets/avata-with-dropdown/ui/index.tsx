import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  AvatarWrap,
} from "@repo/ui";

import { logoutWithConfirm } from "@shared/util/logout.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { useAuthStore } from "@shared/store/useUserInfoStore.ts";
import { useNavigate } from "react-router-dom";
import User from "@repo/assets/images/user.png";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ProfileEditModal from "./ProfileEditModal";

import { usersApi } from "@shared/api/auth/users";
import { apiClient } from "@shared/api/client";

export const UserDropDown = () => {
  const userNm = localStorage.getItem("userNm");
  const user = useAuthStore((s) => s.user);
  const navigation = useNavigate();
  const queryClient = useQueryClient();
  const [profileOpen, setProfileOpen] = useState(false);

  function logout() {
    useAlertStore.getState().openAlert({
      message: "정말 로그아웃 하시겠습니까?",
      confirmText: "로그아웃",
      onConfirm: async () => {
        try {
          // 로그아웃 이력 저장 요청 (실패하더라도 클라이언트 로그아웃은 진행)
          await usersApi(apiClient).logoutHistory();
        } catch (error) {
          console.error("Logout history log failed:", error);
        } finally {
          useAuthStore.getState().clearUser();
          queryClient.clear();   // 다음 로그인 유저에게 캐시 누수 방지
          navigation("/");
        }
      },
    });
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-white/20">
            <AvatarWrap img={user?.profileImageUrl || User} />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setProfileOpen(true)}>정보수정</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="text-p-color-2!" onSelect={logout}>
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileEditModal open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
};
