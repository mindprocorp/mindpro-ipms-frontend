import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries";
import { useAuthStore } from "@shared/store/useUserInfoStore";

/**
 * 메뉴 권한만 서버에서 다시 가져와 GNB에 즉시 반영
 * user를 null로 만들지 않아 화면이 튕기지 않음
 */
export const useRefreshMenus = () => {
  const updateMenus = useAuthStore((s) => s.updateMenus);

  const mutation = useMutation({
    ...commonQueries.getUserInfo(),
    onSuccess: (res) => {
      updateMenus(res.data.menus);
    },
  });

  return () => mutation.mutate(undefined);
};
