import { useState, useEffect, useMemo } from "react";
import { Button, DataTable, Icons, FormDialog, Input } from "@repo/ui";
import DataMenuButton from "@shared/ui/DataMenuButton";
import ListResultHeader from "@shared/ui/ListResultHeader";
import { orgQueries, employeeQueries } from "@shared/query/organization/queries";
import { commonQueries } from "@shared/query/common/queries";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@shared/api/client";
import type { EmployeeVO } from "@shared/api/organization/employeeApi";
import type { OfficeCodeVO, DeptVO } from "@shared/api/organization/orgApi";
import type { CodeDetail } from "@shared/api/common/commApi";
import { CODE_CLASS } from "@shared/enum/organizationType";
import { systemApi } from "@shared/api/system/systemApi";
import { SettingsBar, BarSearch, BarLabel } from "../../../_components/common/SettingsBar";
import SelectBox from "../../../_components/common/SelectBox";
import { getColumnsData } from "../columns/columnsData";
import EmployeeModal, { type EmployeeFormInput } from "../../detail/_components/EmployeeModal";
import AddEmployeeModal from "../../detail/_components/AddEmployeeModal";

const EmployeeListTab = () => {
  const { openAlert } = useAlertStore();
  const user = useAuthStore((s) => s.user);

  const getListMutation = useMutation(employeeQueries.getList());
  const updateMutation = useMutation(employeeQueries.update());
  const assignRoleMutation = systemApi.roles.useAssignUser();
  const getCodeListMutation = useMutation(orgQueries.getOfficeCodeList());
  const getSysCodeMutation = useMutation(commonQueries.getCodeDetail());
  const getDeptTreeMutation = useMutation(orgQueries.getDeptTree());

  const [list, setList] = useState<EmployeeVO[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchEmpNo, setSearchEmpNo] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<EmployeeVO | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [depts, setDepts] = useState<DeptVO[]>([]);
  const [positions, setPositions] = useState<OfficeCodeVO[]>([]);
  const [jobPositions, setJobPositions] = useState<OfficeCodeVO[]>([]);
  const [jobGrades, setJobGrades] = useState<OfficeCodeVO[]>([]);
  const [workTypes, setWorkTypes] = useState<OfficeCodeVO[]>([]);
  const [userTypes, setUserTypes] = useState<CodeDetail[]>([]);
  const [workStatuses, setWorkStatuses] = useState<CodeDetail[]>([]);
  const [employStatuses, setEmployStatuses] = useState<CodeDetail[]>([]);
  const [acctStatuses, setAcctStatuses] = useState<CodeDetail[]>([]);

  const fetchList = async () => {
    const data = await getListMutation.mutateAsync({});
    setList(data);
  };

  const fetchInviteCode = async () => {
    try {
      const { data } = await apiClient.axios.get("/api/organization/invite-code");
      setInviteCode(data.data || "");
    } catch { /* 초대코드 미발급 상태 */ }
  };

  const handleRegenCode = async () => {
    try {
      const { data } = await apiClient.axios.put("/api/organization/invite-code");
      setInviteCode(data.data || "");
    } catch {
      openAlert({ message: "재발급에 실패했습니다." });
    }
  };

  const handleReset = async () => {
    setSearchEmpNo("");
    setFilterDept("");
    setFilterGrade("");
    setSearchName("");
    setList(await getListMutation.mutateAsync({}));
  };

  useEffect(() => {
    fetchList();
    fetchInviteCode();
    getDeptTreeMutation.mutateAsync(undefined).then(setDepts);
    getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.POSITION }).then(setPositions);
    getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.JOB_POSITION }).then(setJobPositions);
    getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.JOB_GRADE }).then(setJobGrades);
    getCodeListMutation.mutateAsync({ codeClass: CODE_CLASS.WORK_TYPE }).then(setWorkTypes);
    getSysCodeMutation.mutateAsync("USER_TYPE").then(setUserTypes);
    getSysCodeMutation.mutateAsync("WORK_STATUS").then(setWorkStatuses);
    getSysCodeMutation.mutateAsync("EMPLOY_STATUS").then(setEmployStatuses);
    getSysCodeMutation.mutateAsync("ACCT_STATUS").then(setAcctStatuses);
  }, []);

  const handleSave = async (form: EmployeeFormInput) => {
    if (!editData?.userMstSeq) return;
    try {
      await updateMutation.mutateAsync({
        userMstSeq: editData.userMstSeq,
        ...form,
        updateUser: user?.userId || "SYSTEM",
      });
      // 역할이 바뀐 경우만 별도 호출 (oe.role_seq 가 진실의 원천 — updateUserInfo는 더 이상 role 안 건드림)
      const prevRole = editData.role?.code || "";
      const nextRole = form.roleSeq || "";
      if (nextRole && nextRole !== prevRole) {
        await assignRoleMutation.mutateAsync({
          roleSeq: nextRole,
          userMstSeq: editData.userMstSeq,
        });
      }
      fetchList();
    } catch (e: any) {
      openAlert({ message: e?.message || "저장에 실패했습니다." });
    }
  };

  // 대기 상태 유저 제외는 employeeApi.getList()에서 자동 처리됨 (모든 사용처 공통)
  const filteredList = useMemo(() => {
    let result = list;
    const emp = searchEmpNo.trim();
    if (emp) result = result.filter((e) => e.officeEmployeeSeq?.toLowerCase().includes(emp.toLowerCase()));
    if (filterDept) result = result.filter((e) => e.officeEmployeeDept === filterDept);
    if (filterGrade) {
      // 신규 데이터는 codeName 으로 저장되지만 레거시는 officeCode/officeCodeSeq 일 수 있어
      // SelectBox 값(=codeName)에 대응하는 모든 식별자 후보로 매칭
      const norm = (s?: string) => (s ?? "").trim();
      const target = jobGrades.find((c) => norm(c.codeName) === norm(filterGrade));
      const candidates = new Set(
        [filterGrade, target?.codeName, target?.officeCode, target?.officeCodeSeq]
          .map(norm)
          .filter(Boolean),
      );
      // 임시 디버그 — 매칭 안 될 때 데이터 형태 확인용
      if (typeof window !== "undefined" && (window as any).__DEBUG_GRADE_FILTER) {
        console.log("[직급필터] filterGrade=", filterGrade, "candidates=", [...candidates], "samples=", result.slice(0, 5).map((e) => e.jobGradeCode));
      }
      result = result.filter((e) => candidates.has(norm(e.jobGradeCode)));
    }
    const name = searchName.trim().toLowerCase();
    if (name) result = result.filter((e) => e.userNameKo?.toLowerCase().includes(name));
    return result;
  }, [list, searchEmpNo, filterDept, filterGrade, searchName, jobGrades]);

  const columns = useMemo(() => getColumnsData(filteredList.length), [filteredList.length]);

  const handleRowClick = (row: any) => {
    const emp = row?.original as EmployeeVO | undefined;
    if (!emp) return;
    setEditData(emp);
    setModalOpen(true);
  };

  return (
    <>
      <SettingsBar onReset={handleReset}>
        <BarLabel>부서</BarLabel>
        <SelectBox value={filterDept} onChange={setFilterDept} placeholder="전체" options={[{ label: "전체", value: "" }, ...depts.filter((d) => d.useYn !== "N").map((d) => ({ label: d.deptName, value: d.deptName }))]} className="w-32" />
        <BarLabel>직급</BarLabel>
        <SelectBox value={filterGrade} onChange={setFilterGrade} placeholder="전체" options={[{ label: "전체", value: "" }, ...jobGrades.map((c) => ({ label: c.codeName, value: c.codeName }))]} className="w-28" />
        <BarLabel>사원번호</BarLabel>
        <BarSearch value={searchEmpNo} onChange={setSearchEmpNo} />
        <BarLabel>이름</BarLabel>
        <BarSearch value={searchName} onChange={setSearchName} />
      </SettingsBar>

      <ListResultHeader totalCount={filteredList.length}>
        <DataMenuButton data={filteredList} fileName="직원정보" columns={columns} />
        <Button size="h28" variant="outline" onClick={() => setCodeModalOpen(true)}>
          <Icons.Key className="size-3.5" /> 초대코드
        </Button>
        <Button size="h28" variant="blue" onClick={() => setAddModalOpen(true)}>
          <Icons.Plus className="size-3.5" /> 직원 등록
        </Button>
      </ListResultHeader>

      <DataTable data={filteredList} columns={columns} className="overflow-auto" onRowClick={handleRowClick} />

      <EmployeeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editData={editData}
        depts={depts}
        positions={positions}
        jobPositions={jobPositions}
        jobGrades={jobGrades}
        workTypes={workTypes}
        userTypes={userTypes}
        workStatuses={workStatuses}
        employStatuses={employStatuses}
        acctStatuses={acctStatuses}
        onSave={handleSave}
        onResigned={fetchList}
      />

      <AddEmployeeModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        inviteCode={inviteCode}
        onSuccess={fetchList}
      />

      <FormDialog
        title="회사 초대코드"
        open={codeModalOpen}
        onOpenChange={setCodeModalOpen}
        onSubmit={handleRegenCode}
        submitText="재발급"
        cancelText="닫기"
      >
        <div className="space-y-2 py-2">
          <p className="text-muted-foreground text-sm">직원이 개인 가입 시 아래 코드를 입력하면 자동으로 소속됩니다.</p>
          <p className="flex items-center gap-2 text-sm">
            초대코드 : <span className="font-bold">{inviteCode}</span>
            <Button type="button" variant="ghost" size="icon" className="size-6" onClick={() => { navigator.clipboard.writeText(inviteCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
              {copied ? <Icons.Check className="text-p-color-3 size-3.5" /> : <Icons.Copy className="size-3.5" />}
            </Button>
          </p>
        </div>
      </FormDialog>
    </>
  );
};

export default EmployeeListTab;
