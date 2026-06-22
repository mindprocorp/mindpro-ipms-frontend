import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage, Button, FormDialog, Separator } from "@repo/ui";
import RejectEmployeeModal from "../../list/_tabs/RejectEmployeeModal";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmployeeVO } from "@shared/api/organization/employeeApi";
import type { OfficeCodeVO, DeptVO } from "@shared/api/organization/orgApi";
import type { CodeDetail } from "@shared/api/common/commApi";
import { systemApi } from "@shared/api/system/systemApi";
import { employeeSchema, type EmployeeFormInput } from "../../schema/employeeSchema";
import EmployeeFormFields from "./EmployeeFormFields";
import UserImg from "@repo/assets/images/user.png";

export type { EmployeeFormInput };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: EmployeeVO | null;
  depts: DeptVO[];
  positions: OfficeCodeVO[];
  jobPositions: OfficeCodeVO[];
  jobGrades: OfficeCodeVO[];
  workTypes: OfficeCodeVO[];
  userTypes: CodeDetail[];
  workStatuses: CodeDetail[];
  employStatuses: CodeDetail[];
  acctStatuses: CodeDetail[];
  onSave: (form: EmployeeFormInput) => void;
  onResigned?: () => void;
}

const EmployeeModal = ({
  open, onOpenChange, editData, depts, positions, jobPositions, jobGrades, workTypes,
  userTypes, workStatuses, employStatuses, acctStatuses, onSave, onResigned,
}: Props) => {
  const [resignOpen, setResignOpen] = useState(false);
  const { data: roles = [] } = systemApi.roles.useActiveList();
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
    if (editData) {
      form.reset({
        userNameKo: editData.userNameKo || "",
        userEmail: editData.userEmail || "",
        userMobileNo: editData.userMobileNo || "",
        deptName: editData.officeEmployeeDept || editData.deptName || "",
        userPosition: editData.officeEmployeePosition || editData.userPosition || "",
        positionCode: editData.positionCode || "",
        jobGradeCode: editData.jobGradeCode || "",
        workCode: editData.workCode || "",
        userTypeCode: editData.userType?.code || "",
        workStatusCode: editData.workStatus?.code || "",
        employStatusCode: editData.employStatus?.code || "",
        acctStatusCode: editData.acctStatus?.code || "",
        roleSeq: editData.role?.code || "",
        userAddr: editData.userAddr || "",
        userAddrDetail: editData.userAddrDetail || "",
      });
    } else {
      form.reset();
    }
  }, [open, editData]);

  const phone = editData?.userMobileNo?.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  const addr = [editData?.userAddr, editData?.userAddrDetail].filter(Boolean).join(" ");
  const dept = [editData?.officeEmployeeDept, editData?.officeEmployeePosition].filter(Boolean).join(" / ");

  return (
    <FormProvider {...form}>
      <FormDialog
        title="직원 정보 수정"
        submitText="저장"
        open={open}
        onOpenChange={(v) => { if (!v) form.reset(); onOpenChange(v); }}
        onSubmit={() => { onSave(form.getValues()); onOpenChange(false); }}
        extraFooter={
          editData?.userMstSeq && (
            <Button
              type="button"
              variant="red"
              size="h32"
              className="mr-auto"
              onClick={() => setResignOpen(true)}
            >
              퇴사 처리
            </Button>
          )
        }
      >
        {/* ── 프로필 ───────────────────────────────── */}
        <div className="flex items-center gap-4">
          <Avatar className="size-20 shrink-0 [&>img]:w-full">
            <AvatarImage src={editData?.profileImageUrl || UserImg} alt="프로필" />
            <AvatarFallback>{editData?.userNameKo?.charAt(0) ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{editData?.userNameKo ?? ""}</p>
              {editData?.role?.name && (
                <span className="rounded-full bg-p-color-1/10 px-2 py-0.5 text-[10px] font-medium text-p-color-1">{editData.role.name}</span>
              )}
            </div>
            <p className="text-text-200 text-xs">{editData?.userEmail ?? ""}</p>
            {phone && <p className="text-text-200 text-xs">{phone}</p>}
            {dept && <p className="text-text-200 text-xs">{dept}</p>}
            {addr && <p className="text-text-200 text-xs">{addr}</p>}
          </div>
        </div>

        <Separator className="my-4" />

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
        />
      </FormDialog>

      {editData?.userMstSeq && (
        <RejectEmployeeModal
          open={resignOpen}
          onOpenChange={setResignOpen}
          userMstSeq={editData.userMstSeq}
          userName={editData.userNameKo ?? ""}
          title="퇴사 처리"
          confirmText="퇴사 처리"
          onRejected={() => {
            onResigned?.();
            onOpenChange(false);
          }}
        />
      )}
    </FormProvider>
  );
};

export default EmployeeModal;
