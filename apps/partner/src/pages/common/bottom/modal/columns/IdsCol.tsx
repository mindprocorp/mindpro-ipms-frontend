import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatAppNo } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export type IdsColType = {
  officeSeq: string;
  appSeq: string;
  idsSeq: string;
  occurCountryCode: string;
  occurCountryName: string;
  occurNo: string;
  familyNoEn: string;
  isIdsSubmitted: string;
  occurDate: string;
  idsPubDate: string;
  idsReceiptDate: string;
  idsSendDate: string;
  idsDeadline: string;
  idsSubmitDate: string;
  idsSubmitMng: string;
  note: string;
};

/**
 * IDS 테이블 컬럼
 */
export const getIdsColumns = (editMode: Boolean): ColumnDef<IdsColType>[] => [
  selectColumn<IdsColType>(28),

  {
    accessorKey: "occurCountryName",
    header: "발생국가",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.occurCountryName = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "occurDate",
    header: "발생일",
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
              row.original.occurDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "occurNo",
    header: "발생번호",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            maxLength={30}
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.occurNo = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatAppNo(getValue())}</div>;
    },
  },
  {
    accessorKey: "idsPubDate",
    header: "공개일",
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
              row.original.idsPubDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "familyNoEn",
    header: "영문패밀리번호",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            maxLength={30}
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.familyNoEn = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
    meta: { pin: "left" },
  },
  {
    accessorKey: "idsReceiptDate",
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
              row.original.idsReceiptDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "idsSendDate",
    header: "IDS발송일",
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
              row.original.idsSendDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "isIdsSubmitted",
    header: "IDS기제출건",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.isIdsSubmitted = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "idsDeadline",
    header: "IDS제출마감일",
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
              row.original.idsDeadline = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "idsSubmitDate",
    header: "IDS제출일",
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
              row.original.idsSubmitDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "idsSubmitMngNm",
    header: "제출담당자",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.idsSubmitMng = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
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
