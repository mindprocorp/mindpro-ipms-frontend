import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatPrioNo } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export type PreferenceColType = {
  priorCountryCode: string;
  preferenceAssertDate: string;
  preferenceNo: string;
  wipoCategoryCode: string;
  preferenceSearch?: string;
  submitDeadLineDate: string;
  submitClosingDate: string;
  preferenceRegDate: string;
  note: string;
};

/**
 * 우선권 테이블 컬럼
 */
export const getPreferenceColumns = (editMode: Boolean): ColumnDef<PreferenceColType>[] => [
  selectColumn<PreferenceColType>(28),

  {
    accessorKey: "priorCountryCode",
    header: "우선국",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.priorCountryCode = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "preferenceAssertDate",
    header: "우선주장일",
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
              row.original.preferenceAssertDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "preferenceNo",
    header: "우선권번호",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.preferenceNo = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatPrioNo(getValue())}</div>;
    },
  },
  {
    accessorKey: "wipoCategoryCode",
    header: "WIPO접근코드",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.wipoCategoryCode = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },

  // {
  //   accessorKey: "fullContentUrl",
  //   header: "전문",
  //   size: 130,
  //   cell: ({ row, getValue }) => {
  //     if (editMode) {
  //       return (
  //         <input
  //           type="text"
  //           defaultValue={getValue() as string}
  //           onChange={(e) => {
  //             row.original.fullContentUrl = e.target.value;
  //           }}
  //           className="w-full rounded border border-black px-2 py-1"
  //         />
  //       );
  //     }
  //     return <div className="capitalize">{getValue() as string}</div>;
  //   },
  // },
  {
    accessorKey: "preferenceRegDate",
    header: "접수일",
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
              row.original.preferenceRegDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "submitDeadLineDate",
    header: "제출마감일",
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
              row.original.submitDeadLineDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "submitClosingDate",
    header: "제출일",
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
              row.original.submitClosingDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.note = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
];
