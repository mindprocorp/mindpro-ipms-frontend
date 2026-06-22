import { useEffect } from "react";
import { systemApi, type RoleVO, type MenuVO, type RoleMenuMapVO } from "@shared/api/system/systemApi";
import { FormDialog, Button, DataTable } from "@repo/ui";
import { useForm, FormProvider, Controller, useFieldArray } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useRefreshMenus } from "@shared/hooks/useRefreshMenus";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleVO | null;
}

export default function RoleMenuMappingModal({ open, onOpenChange, role }: Props) {
  const { openAlert } = useAlertStore();
  const { data: allMenus = [] } = systemApi.menus.useList();
  const { data: roleMenus = [] } = systemApi.roles.useRoleMenus(role?.roleSeq || "");
  const saveMut = systemApi.roles.useSaveRoleMenus();

  const form = useForm<{ maps: RoleMenuMapVO[] }>({
    defaultValues: { maps: [] },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "maps",
  });

  useEffect(() => {
    if (open && role && allMenus.length > 0) {
      const maps: RoleMenuMapVO[] = allMenus.map((menu) => {
        const existing = roleMenus.find((rm) => rm.menuSeq === menu.menuSeq);
        return {
          menuSeq: menu.menuSeq,
          roleSeq: role.roleSeq,
          canRead: existing?.canRead || "N",
          canWrite: existing?.canWrite || "N",
          canDelete: existing?.canDelete || "N",
          canExcel: existing?.canExcel || "N",
        };
      });
      replace(maps);
    }
  }, [open, role, allMenus, roleMenus, replace]);

  const refreshMenus = useRefreshMenus();

  const handleSubmit = async (data: { maps: RoleMenuMapVO[] }) => {
    if (!role) return;
    try {
      await saveMut.mutateAsync({ roleSeq: role.roleSeq, menus: data.maps });
      refreshMenus();
      onOpenChange(false);
      setTimeout(() => {
        openAlert({ message: "권한이 저장되었습니다." });
      }, 300);
    } catch {
      openAlert({ message: "권한 저장에 실패했습니다." });
    }
  };

  const SwitchControl = ({ index, name }: { index: number; name: "canRead" | "canWrite" | "canDelete" | "canExcel" }) => (
    <Controller
      control={form.control}
      name={`maps.${index}.${name}`}
      render={({ field }) => (
        <input
          type="checkbox"
          style={{ width: "1rem", height: "1rem" }}
          checked={field.value === "Y"}
          onChange={(e) => field.onChange(e.target.checked ? "Y" : "N")}
        />
      )}
    />
  );

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "menuSeq",
      header: "메뉴명",
      cell: ({ row }) => {
        const menu = allMenus.find((m) => m.menuSeq === row.original.menuSeq);
        const parent = allMenus.find((m) => m.menuSeq === menu?.parentMenuSeq);
        return parent ? `${parent.menuNm} > ${menu?.menuNm}` : menu?.menuNm;
      },
    },
    { id: "canRead", header: "조회", cell: ({ row }) => <div className="flex justify-center"><SwitchControl index={row.index} name="canRead" /></div> },
    { id: "canWrite", header: "등록/수정", cell: ({ row }) => <div className="flex justify-center"><SwitchControl index={row.index} name="canWrite" /></div> },
    { id: "canDelete", header: "삭제", cell: ({ row }) => <div className="flex justify-center"><SwitchControl index={row.index} name="canDelete" /></div> },
    { id: "canExcel", header: "엑셀다운", cell: ({ row }) => <div className="flex justify-center"><SwitchControl index={row.index} name="canExcel" /></div> },
  ];

  return (
    <FormProvider {...form}>
      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        title={`권한 맵핑: ${role?.roleNm || ""}`}
        onSubmit={() => form.handleSubmit(handleSubmit)()}
        className="sm:max-w-[800px]"
      >
        <div className="py-4 max-h-[60vh] overflow-auto">
          <DataTable columns={columns} data={fields} />
        </div>
      </FormDialog>
    </FormProvider>
  );
}
