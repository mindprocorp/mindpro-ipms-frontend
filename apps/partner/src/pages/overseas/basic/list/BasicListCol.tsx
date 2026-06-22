import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";

export type BasicListColType = {
  abandonDate: string;
  abandonNote: string;
  adminMgr: any;
  caseMgr: any;
  appExtSeq: string;
  rightType: {
    code: string;
    codeName: string;
  };
  status: {
    code: string;
    codeName: string;
  };
  ourRef: string;
  receiptDate: string;
  appType: {
    code: string;
    codeName: string;
  };
  clientNm: string;
  applicantNm: string;
  appNameInfo: {
    titleKo: string;
    titleEn: string;
  };
  designatedPctCnt: number;
  designatedEpCnt: number;
  designatedIndividualCnt: number;
  designatedMadridCnt: number;
  designatedIntlDesignCnt: number;
  note: string;
};

/**
 * 마감경과 테이블 컬럼
 */
export const getBasicListColumns = (editMode: Boolean): ColumnDef<BasicListColType>[] => [
  {
    id: "rightType.codeName",
    accessorFn: (row) => row.rightType?.codeName,
    header: "권리",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.rightType.codeName = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    id: "status.codeName",
    accessorFn: (row) => row.status?.codeName,
    header: "현재상태",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.status.code = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "ourRef",
    header: "OurRef",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.ourRef = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "receiptDate",
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
              row.original.receiptDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    id: "appType.codeName",
    accessorFn: (row) => row.appType?.codeName,
    header: "출원종류",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.appType.codeName = e.target.value;
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
    accessorKey: "clientNm",
    header: "의뢰인",
    size: 130,
    cell: ({ getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "applicantNm",
    header: "출원인",
    size: 130,
    cell: ({ getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    id: "appNameInfo.titleKo",
    accessorFn: (row) => row.appNameInfo?.titleKo,
    header: "국문명칭",
    size: 1000,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.appNameInfo.titleKo = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    id: "appNameInfo.titleEn",
    accessorFn: (row) => row.appNameInfo?.titleEn,
    header: "영문명칭",
    size: 1000,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.appNameInfo.titleEn = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "designatedIndividualCnt",
    header: "개국수",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as number}
            onChange={(e) => {
              row.original.designatedIndividualCnt = Number(e.target.value);
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as number}</div>;
    },
  },
  {
    accessorKey: "designatedPctCnt",
    header: "PCT수",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as number}
            onChange={(e) => {
              row.original.designatedPctCnt = Number(e.target.value);
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as number}</div>;
    },
  },
  {
    accessorKey: "designatedEpCnt",
    header: "EP수",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as number}
            onChange={(e) => {
              row.original.designatedEpCnt = Number(e.target.value);
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "designatedMadridCnt",
    header: "마드리드수",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.designatedMadridCnt = Number(e.target.value);
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "designatedIntlDesignCnt",
    header: "국제디자인수",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.designatedIntlDesignCnt = Number(e.target.value);
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "abandonDate",
    header: "포기취하일",
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
              row.original.abandonDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "abandonNote",
    header: "포기내용",
    size: 200,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => { row.original.abandonNote = e.target.value; }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="truncate" title={getValue() as string}>{getValue() as string || "-"}</div>;
    },
  },
  {
    id: "adminMgrInfo.userName",
    accessorFn: (row) => row.adminMgr?.userName,
    header: "관리담당자",
    size: 120,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => { row.original.adminMgr.userName = e.target.value; }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{getValue() as string || "-"}</div>;
    },
  },
  {
    id: "caseMgrInfo.userName",
    accessorFn: (row) => row.caseMgr?.userName,
    header: "사건담당자",
    size: 120,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => { row.original.caseMgr.userName = e.target.value; }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{getValue() as string || "-"}</div>;
    },
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 120,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => { row.original.note = e.target.value; }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{getValue() as string || "-"}</div>;
    },
  },
];
