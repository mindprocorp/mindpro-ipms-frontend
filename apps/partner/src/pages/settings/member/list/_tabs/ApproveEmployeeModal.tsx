import { useEffect, useState } from "react";
import { FormDialog } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { systemApi } from "@shared/api/system/systemApi";
import { officeMembershipApi } from "@shared/api/user/officeMembershipApi";
import { orgQueries } from "@shared/query/organization/queries";
import { commonQueries } from "@shared/query/common/queries";
import { useAlertStore } from "@shared/store/useAlertStore";
import { CODE_CLASS } from "@shared/enum/organizationType";
import type { OfficeCodeVO, DeptVO } from "@shared/api/organization/orgApi";
import type { CodeDetail } from "@shared/api/common/commApi";
import { employeeSchema, type EmployeeFormInput } from "../../schema/employeeSchema";
import EmployeeFormFields from "../../detail/_components/EmployeeFormFields";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userMstSeq: string;
  userName: string;
  onApproved: () => void;
}

/**
 * PENDING 직원 승인 모달.
 * EmployeeModal과 동일한 공통 필드(EmployeeFormFields)를 사용해 조직/상태/역할을 한 번에 입력.
 * 백엔드 approveEmployee 가 사용하는 항목만 실제 반영 (직책/부서/직위/직급/직무/역할).
 * 그 외(사용자유형/재직/근무)는 승인 후 EmployeeModal에서 수정.
 */
const ApproveEmployeeModal = ({ open, onOpenChange, userMstSeq, userName, onApproved }: Props) => {
  const { openAlert } = useAlertStore();
  const approveMutation = officeMembershipApi.useApproveEmployee();

  const { data: roles = [] } = systemApi.roles.useActiveList();

  const getDeptTreeMutation = useMutation(orgQueries.getDeptTree());
  const getCodeListMutation = useMutation(orgQueries.getOfficeCodeList());
  const getSysCodeMutation = useMutation(commonQueries.getCodeDetail());

  const [depts, setDepts] = useState<DeptVO[]>([]);
  const [positions, setPositions] = useState<OfficeCodeVO[]>([]);
  const [jobPositions, setJobPositions] = useState<OfficeCodeVO[]>([]);
  const [jobGrades, setJobGrades] = useState<OfficeCodeVO[]>([]);
  const [workTypes, setWorkTypes] = useState<OfficeCodeVO[]>([]);
  const [userTypes, setUserTypes] = useState<CodeDetail[]>([]);
  const [workStatuses, setWorkStatuses] = useState<CodeDetail[]>([]);
  const [employStatuses, setEmployStatuses] = useState<CodeDetail[]>([]);
  const [acctStatuses, setAcctStatuses] = useState<CodeDetail[]>([]);

  const form = useForm<EmployeeFormInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      userNameKo: "", userEmail: "", userMobileNo: "",
      deptName: "", userPosition: "", positionCode: "", jobGradeCode: "", workCode: "",
      userAddr: "", userAddrDetail: "",
      userTypeCode: "", workStatusCode: "", employStatusCode: "", acctStatusCode: "", roleSeq: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset();
    getDeptTreeMutation.mutateAsync(undefined).then(setDepts);
    getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.POSITION }).then(setPositions);
    getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.JOB_POSITION }).then(setJobPositions);
    getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.JOB_GRADE }).then(setJobGrades);
    getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.WORK_TYPE }).then(setWorkTypes);
    getSysCodeMutation.mutateAsync("USER_TYPE").then(setUserTypes);
    getSysCodeMutation.mutateAsync("WORK_STATUS").then(setWorkStatuses);
    getSysCodeMutation.mutateAsync("EMPLOY_STATUS").then(setEmployStatuses);
    getSysCodeMutation.mutateAsync("ACCT_STATUS").then(setAcctStatuses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleSubmit = form.handleSubmit((values) => {
    if (!values.roleSeq) {
      form.setError("roleSeq", { message: "역할을 선택해주세요." });
      return;
    }
    approveMutation.mutate(
      {
        userMstSeq,
        body: {
          roleSeq: values.roleSeq,
          officeEmployeePosition: values.userPosition || undefined,
          officeEmployeeDept: values.deptName || undefined,
          positionCode: values.positionCode || undefined,
          jobGradeCode: values.jobGradeCode || undefined,
          workCode: values.workCode || undefined,
          userTypeCode: values.userTypeCode || undefined,
          workStatusCode: values.workStatusCode || undefined,
          employStatusCode: values.employStatusCode || undefined,
        },
      },
      {
        onSuccess: () => {
          handleClose();
          onApproved();
          setTimeout(() => {
            openAlert({ message: `${userName} 직원을 승인했습니다.` });
          }, 300);
        },
        onError: (err: any) => {
          form.setError("roleSeq", {
            message: err?.response?.data?.message ?? "승인 처리에 실패했습니다.",
          });
        },
      },
    );
  });

  return (
    <FormProvider {...form}>
      <FormDialog
        open={open}
        onOpenChange={(o) => (!o ? handleClose() : onOpenChange(o))}
        title="직원 승인"
        onSubmit={handleSubmit}
        submitText="승인"
        className="max-w-xl"
      >
        <p className="mb-3 text-sm">
          <strong>{userName}</strong> 직원을 승인합니다. 역할은 필수이며, 조직 정보는 선택 입력입니다.
        </p>
        <EmployeeFormFields
          control={form.control}
          depts={depts}
          positions={positions}
          jobPositions={jobPositions}
          jobGrades={jobGrades}
          workTypes={workTypes}
          userTypes={userTypes}
          workStatuses={workStatuses}
          employStatuses={employStatuses}
          acctStatuses={acctStatuses}
          roles={roles}
          showAcctStatus={false}
        />
      </FormDialog>
    </FormProvider>
  );
};

export default ApproveEmployeeModal;
