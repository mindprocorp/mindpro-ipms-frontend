import { FlexBox, RHF, Separator } from "@repo/ui";
import type { Control } from "react-hook-form";
import type { OfficeCodeVO, DeptVO } from "@shared/api/organization/orgApi";
import type { CodeDetail } from "@shared/api/common/commApi";
import type { RoleVO } from "@shared/api/system/systemApi";
import type { EmployeeFormInput } from "../../schema/employeeSchema";

export interface EmployeeFormFieldsProps {
  control: Control<EmployeeFormInput>;
  depts: DeptVO[];
  positions: OfficeCodeVO[];
  jobPositions: OfficeCodeVO[];
  jobGrades: OfficeCodeVO[];
  workTypes: OfficeCodeVO[];
  userTypes: CodeDetail[];
  workStatuses: CodeDetail[];
  employStatuses: CodeDetail[];
  acctStatuses: CodeDetail[];
  roles: RoleVO[];
  /** 계정 상태 select 노출 여부 (등록/승인 시점엔 자동으로 ACTIVE 처리되므로 숨김) */
  showAcctStatus?: boolean;
}

const SELECT_PLACEHOLDER = { label: "선택해주세요", value: "" };

const toCodeItems = (arr: OfficeCodeVO[]) =>
  arr.map((c) => ({ label: c.codeName, value: c.codeName }));
const toSysCodeItems = (arr: CodeDetail[]) =>
  arr.map((c) => ({ label: c.cdNm, value: c.dtlCd }));

/**
 * 직원 공통 필드 — 조직 정보 / 상태 관리 / 역할.
 * EmployeeModal(수정) / ApproveEmployeeModal(승인) / AddEmployeeModal(직접 등록)에서 공유.
 */
const EmployeeFormFields = ({
  control,
  depts, positions, jobPositions, jobGrades, workTypes,
  userTypes, workStatuses, employStatuses, acctStatuses,
  roles,
  showAcctStatus = true,
}: EmployeeFormFieldsProps) => {
  const deptItems = depts
    .filter((d) => d.useYn !== "N")
    .map((d) => ({ label: d.deptName, value: d.deptName }));

  // 역할 select는 CUSTOM 만 — 시스템관리자(SYSTEM_ADMIN) 부여는 별도 admin_auth 토글이 진실의 원천
  const roleItems = roles
    .filter((r) => r.roleType === "CUSTOM")
    .map((r) => ({ label: r.roleNm, value: r.roleSeq }));

  return (
    <>
      {/* ── 조직 정보 ───────────────────────────── */}
      <p className="mb-2 text-sm font-semibold">조직 정보</p>
      <FlexBox vertical className="gap-3">
        <FlexBox>
          <RHF.FormSelect control={control} name="deptName" items={[SELECT_PLACEHOLDER, ...deptItems]} label="부서" />
          <RHF.FormSelect control={control} name="userPosition" items={[SELECT_PLACEHOLDER, ...toCodeItems(positions)]} label="직책" />
        </FlexBox>
        <FlexBox>
          <RHF.FormSelect control={control} name="positionCode" items={[SELECT_PLACEHOLDER, ...toCodeItems(jobPositions)]} label="직위" />
          <RHF.FormSelect control={control} name="jobGradeCode" items={[SELECT_PLACEHOLDER, ...toCodeItems(jobGrades)]} label="직급" />
        </FlexBox>
        <FlexBox>
          <RHF.FormSelect control={control} name="workCode" items={[SELECT_PLACEHOLDER, ...toCodeItems(workTypes)]} label="직무" />
          <div className="flex-1" />
        </FlexBox>
      </FlexBox>

      <Separator className="my-4" />

      {/* ── 상태 관리 ───────────────────────────── */}
      <p className="mb-2 text-sm font-semibold">상태 관리</p>
      <FlexBox vertical className="gap-3">
        <FlexBox>
          <RHF.FormSelect control={control} name="userTypeCode" items={[SELECT_PLACEHOLDER, ...toSysCodeItems(userTypes)]} label="사용자 유형" />
          <RHF.FormSelect control={control} name="employStatusCode" items={[SELECT_PLACEHOLDER, ...toSysCodeItems(employStatuses)]} label="재직 상태" />
        </FlexBox>
        <FlexBox>
          <RHF.FormSelect control={control} name="workStatusCode" items={[SELECT_PLACEHOLDER, ...toSysCodeItems(workStatuses)]} label="근무 상태" />
          {showAcctStatus ? (
            <RHF.FormSelect
              control={control}
              name="acctStatusCode"
              items={[SELECT_PLACEHOLDER, ...toSysCodeItems(acctStatuses.filter((c) => !c.cdNm?.includes("대기")))]}
              label="계정 상태"
            />
          ) : (
            <div className="flex-1" />
          )}
        </FlexBox>
      </FlexBox>

      <Separator className="my-4" />

      {/* ── 역할 ───────────────────────────────── */}
      <p className="mb-2 text-sm font-semibold">역할</p>
      <FlexBox>
        <RHF.FormSelect
          control={control}
          name="roleSeq"
          items={[SELECT_PLACEHOLDER, ...roleItems]}
          label="역할"
        />
        <div className="flex-1" />
      </FlexBox>
    </>
  );
};

export default EmployeeFormFields;
