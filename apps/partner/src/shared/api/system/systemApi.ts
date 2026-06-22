import { apiClient } from "@shared/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface MenuVO {
  menuSeq: string;
  menuCd: string;
  menuNm: string;
  parentMenuSeq: string | null;
  menuUrl: string;
  menuIcon: string;
  dispOrd: number;
  useYn?: string;
  dispType?: "GNB" | "ICON_SIDEBAR" | "HIDDEN";
  menuType?: "FOLDER" | "PAGE";
  sidebarYn?: string;
  superAdminOnly?: "Y" | "N";
}

export interface RoleVO {
  roleSeq: string;
  roleCd: string;
  roleNm: string;
  note: string;
  officeSeq?: string;
  delYn: "Y" | "N";
  useYn: "Y" | "N";
  roleType: "SUPER_ADMIN" | "SYSTEM_ADMIN" | "SYSTEM_USER" | "CUSTOM";
}

export interface RoleUserVO {
  userMstSeq: string;
  userNameKo: string;
  userEmail: string;
  userMobileNo: string;
  officeEmployeeDept: string;
  officeEmployeePosition: string;
}

export interface RoleMenuMapVO {
  mapSeq?: string;
  roleSeq: string;
  menuSeq: string;
  canRead: "Y" | "N";
  canWrite: "Y" | "N";
  canDelete: "Y" | "N";
  canExcel: "Y" | "N";
}

/** 공통 순서 변경 훅 (target: MENU, OFFICE_CODE, DEPT) */
export const useSystemReorder = (target: string, invalidateKey?: string[]) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderedSeqs: string[]) => {
      await apiClient.axios.post("/api/system/reorder", { target, orderedSeqs });
    },
    onSuccess: () => {
      if (invalidateKey) queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
  });
};

export const systemApi = {
  menus: {
    queryKey: ["systemMenus"],
    /**
     * @param opts.all true 면 super_admin_only 포함 전체 메뉴 (메뉴/플랜 관리 화면 전용).
     *                기본: 백엔드가 호출자 권한 기준으로 자동 분기.
     */
    useList: (opts?: { all?: boolean }) => {
      const all = opts?.all === true;
      return useQuery({
        queryKey: [...systemApi.menus.queryKey, { all }],
        queryFn: async () => {
          const { data } = await apiClient.axios.get<{ data: MenuVO[] }>("/api/system/menus", {
            params: all ? { all: true } : undefined,
          });
          return data.data;
        },
      });
    },
    useSave: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (payload: MenuVO) => {
          await apiClient.axios.post("/api/system/menus", payload);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: systemApi.menus.queryKey }),
      });
    },
    useDelete: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (menuSeq: string) => {
          await apiClient.axios.delete(`/api/system/menus/${menuSeq}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: systemApi.menus.queryKey }),
      });
    },
  },
  roles: {
    queryKey: ["systemRoles"],
    useList: () => {
      return useQuery({
        queryKey: systemApi.roles.queryKey,
        queryFn: async () => {
          const { data } = await apiClient.axios.get<{ data: RoleVO[] }>("/api/system/roles");
          return data.data;
        },
      });
    },
    /** 사용중인 역할만 (직원 정보 등 선택용) */
    useActiveList: () => {
      return useQuery({
        queryKey: ["activeRoles"],
        queryFn: async () => {
          const { data } = await apiClient.axios.get<{ data: RoleVO[] }>("/api/system/roles/active");
          return data.data;
        },
      });
    },
    useSave: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (payload: RoleVO) => {
          await apiClient.axios.post("/api/system/roles", payload);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: systemApi.roles.queryKey }),
      });
    },
    useDelete: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (roleSeq: string) => {
          await apiClient.axios.delete(`/api/system/roles/${roleSeq}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: systemApi.roles.queryKey }),
      });
    },
    useRoleMenus: (roleSeq: string) => {
      return useQuery({
        queryKey: ["roleMenus", roleSeq],
        queryFn: async () => {
          const { data } = await apiClient.axios.get<{ data: RoleMenuMapVO[] }>(`/api/system/roles/${roleSeq}/menus`);
          return data.data;
        },
        enabled: !!roleSeq,
      });
    },
    useSaveRoleMenus: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async ({ roleSeq, menus }: { roleSeq: string; menus: RoleMenuMapVO[] }) => {
          await apiClient.axios.post(`/api/system/roles/${roleSeq}/menus`, menus);
        },
        onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["roleMenus", variables.roleSeq] }),
      });
    },
    useRoleUsers: (roleSeq: string) => {
      return useQuery({
        queryKey: ["roleUsers", roleSeq],
        queryFn: async () => {
          const { data } = await apiClient.axios.get<{ data: RoleUserVO[] }>(`/api/system/roles/${roleSeq}/users`);
          return data.data;
        },
        enabled: !!roleSeq,
      });
    },
    useAssignUser: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async ({ roleSeq, userMstSeq }: { roleSeq: string; userMstSeq: string }) => {
          await apiClient.axios.patch(`/api/system/roles/${roleSeq}/users/${userMstSeq}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roleUsers"] }),
      });
    },
    useRemoveUser: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async ({ roleSeq, userMstSeq }: { roleSeq: string; userMstSeq: string }) => {
          await apiClient.axios.delete(`/api/system/roles/${roleSeq}/users/${userMstSeq}`);
        },
        onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["roleUsers", variables.roleSeq] }),
      });
    },
  },
};

export interface OfficeVO {
  officeSeq: string;
  officeShortName: string;
  officeAddr?: string;
  officeTel?: string;
  officeAuthYn?: string;
  officeStateCode?: string;
  officeInviteCode?: string;
  planSeq?: string;
  currentPlanNm?: string;
}

export interface PlanUserVO {
  userMstSeq: string;
  userNameKo: string;
  userEmail?: string;
  userMobileNo?: string;
  officeSeq?: string;
  officeShortName?: string;
  roleName?: string;
}

export interface PlanVO {
  planSeq: string;
  planCd: string;
  planNm: string;
  note?: string;
  sortOrd?: number;
  useYn?: "Y" | "N";
  delYn?: "Y" | "N";
  officeCount?: number;
  userCount?: number;
  menuCount?: number;
}

// 슈퍼어드민: 플랜 관리 API (독립 export)
export const systemPlansApi = {
  queryKey: ["systemPlans"],
  useList: () =>
    useQuery({
      queryKey: ["systemPlans"],
      queryFn: async () => {
        const { data } = await apiClient.axios.get<{ data: PlanVO[] }>("/api/system/plans");
        return data.data;
      },
    }),
  useSave: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (payload: PlanVO) => {
        await apiClient.axios.post("/api/system/plans", payload);
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["systemPlans"] }),
    });
  },
  useDelete: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (planSeq: string) => {
        await apiClient.axios.delete(`/api/system/plans/${planSeq}`);
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["systemPlans"] }),
    });
  },
  useAllowedMenus: (planSeq: string) =>
    useQuery({
      queryKey: ["planAllowedMenus", planSeq],
      queryFn: async () => {
        const { data } = await apiClient.axios.get<{ data: string[] }>(
          `/api/system/plans/${planSeq}/menus`,
        );
        return data.data;
      },
      enabled: !!planSeq,
    }),
  useSaveMenus: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ planSeq, menuSeqs }: { planSeq: string; menuSeqs: string[] }) => {
        await apiClient.axios.post(`/api/system/plans/${planSeq}/menus`, menuSeqs);
      },
      onSuccess: (_, v) => {
        queryClient.invalidateQueries({ queryKey: ["planAllowedMenus", v.planSeq] });
        queryClient.invalidateQueries({ queryKey: ["systemPlans"] });  // 좌측 메뉴 카운트 갱신
      },
    });
  },
  usePlanOffices: (planSeq: string) =>
    useQuery({
      queryKey: ["planOffices", planSeq],
      queryFn: async () => {
        const { data } = await apiClient.axios.get<{ data: OfficeVO[] }>(
          `/api/system/plans/${planSeq}/offices`,
        );
        return data.data;
      },
      enabled: !!planSeq,
    }),
  usePlanUsers: (planSeq: string) =>
    useQuery({
      queryKey: ["planUsers", planSeq],
      queryFn: async () => {
        const { data } = await apiClient.axios.get<{ data: PlanUserVO[] }>(
          `/api/system/plans/${planSeq}/users`,
        );
        return data.data;
      },
      enabled: !!planSeq,
    }),
  useUnassignedOffices: () =>
    useQuery({
      queryKey: ["unassignedOffices"],
      queryFn: async () => {
        const { data } = await apiClient.axios.get<{ data: OfficeVO[] }>(
          "/api/system/offices/unassigned",
        );
        return data.data;
      },
    }),
  useAllOfficesForAssign: () =>
    useQuery({
      queryKey: ["allOfficesForAssign"],
      queryFn: async () => {
        const { data } = await apiClient.axios.get<{ data: OfficeVO[] }>(
          "/api/system/offices/for-assign",
        );
        return data.data;
      },
    }),
  useAssignOffice: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ officeSeq, planSeq }: { officeSeq: string; planSeq: string }) => {
        await apiClient.axios.patch(`/api/system/offices/${officeSeq}/plan/${planSeq}`);
      },
      onSuccess: () => {
        // 영향 받는 모든 캐시 무효화 (이동 시 양쪽 플랜 모두 영향)
        queryClient.invalidateQueries({ queryKey: ["planOffices"] });
        queryClient.invalidateQueries({ queryKey: ["planUsers"] });
        queryClient.invalidateQueries({ queryKey: ["unassignedOffices"] });
        queryClient.invalidateQueries({ queryKey: ["allOfficesForAssign"] });
        queryClient.invalidateQueries({ queryKey: ["systemPlans"] });  // 사무소수/사용자수 집계
      },
    });
  },
};

