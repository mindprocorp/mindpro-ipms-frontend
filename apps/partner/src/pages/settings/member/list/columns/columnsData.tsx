import type { ColumnDef } from "@tanstack/react-table";
import type { EmployeeVO } from "@shared/api/organization/employeeApi";

export const getColumnsData = (total: number): ColumnDef<EmployeeVO>[] => [
  { id: "no", header: "번호", size: 30, cell: ({ row }) => total - row.index },
  { accessorKey: "officeEmployeeSeq", header: "사원번호", size: 100, cell: ({ getValue }) => <span className="block truncate">{getValue() as string}</span> },
  { accessorKey: "userNameKo", header: "이름", size: 60, cell: ({ getValue }) => <span className="block truncate">{getValue() as string}</span> },
  { accessorKey: "officeEmployeeDept", header: "부서", size: 80, cell: ({ getValue }) => <span className="block truncate">{getValue() as string}</span> },
  { accessorKey: "officeEmployeePosition", header: "직책", size: 50, cell: ({ getValue }) => <span className="block truncate">{getValue() as string}</span> },
  { accessorKey: "positionCode", header: "직위", size: 50, cell: ({ getValue }) => <span className="block truncate">{getValue() as string}</span> },
  { accessorKey: "jobGradeCode", header: "직급", size: 50, cell: ({ getValue }) => <span className="block truncate">{getValue() as string}</span> },
  { accessorKey: "workCode", header: "직무", size: 50, cell: ({ getValue }) => <span className="block truncate">{getValue() as string}</span> },
  { id: "userType", header: "유형", size: 50, cell: ({ row }) => <span className="block truncate">{row.original.userType?.name || "-"}</span> },
  { id: "employStatus", header: "재직", size: 50, cell: ({ row }) => <span className="block truncate">{row.original.employStatus?.name || "-"}</span> },
  { id: "workStatus", header: "근무", size: 50, cell: ({ row }) => <span className="block truncate">{row.original.workStatus?.name || "-"}</span> },
  { id: "acctStatus", header: "계정", size: 50, cell: ({ row }) => <span className="block truncate">{row.original.acctStatus?.name || "-"}</span> },
  { id: "role", header: "권한", size: 70, cell: ({ row }) => <span className="block truncate">{row.original.role?.name || "-"}</span> },
  { accessorKey: "userEmail", header: "이메일", size: 140, cell: ({ getValue }) => <span className="block truncate">{getValue() as string}</span> },
  { accessorKey: "userMobileNo", header: "휴대폰", size: 100, cell: ({ getValue }) => <span className="block truncate">{getValue() as string}</span> },
];
