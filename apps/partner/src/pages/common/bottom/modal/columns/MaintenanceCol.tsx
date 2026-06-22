import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export type MaintenanceColType = {
  maintenanceFeeSeq?: string;
  appSeq?: string;
  nextPaymentInstallment: string;
  maintFeeDeadline: string;
  maintFeePenaltyDeadline: string;
  maintFeeOrderDate: string;
  maintFeePaymentDate: string;
  note: string;
};

/**
 * 유지비 테이블 컬럼
 */
export const getMaintenanceColumns = (editMode: Boolean): ColumnDef<MaintenanceColType>[] => [
  selectColumn<MaintenanceColType>(28),

  {
    accessorKey: "nextPaymentInstallment",
    header: "납부차수",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.nextPaymentInstallment = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "maintFeeDeadline",
    header: "납부마감일",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            maxLength={10}
            defaultValue={formatDate(getValue())}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9-]/g, "");
              row.original.maintFeeDeadline = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "maintFeePenaltyDeadline",
    header: "과태마감일",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            maxLength={10}
            defaultValue={formatDate(getValue())}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9-]/g, "");
              row.original.maintFeePenaltyDeadline = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "maintFeeOrderDate",
    header: "납부지시일",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            maxLength={10}
            defaultValue={formatDate(getValue())}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9-]/g, "");
              row.original.maintFeeOrderDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },

  {
    accessorKey: "maintFeePaymentDate",
    header: "납부일",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            maxLength={10}
            defaultValue={formatDate(getValue())}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9-]/g, "");
              row.original.maintFeePaymentDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
];
