import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button, CustomTooltip, Dialog, DialogContent, DialogHeader, DialogTitle, Icons, Input, Separator } from "@repo/ui";
import { CODE_CLASS } from "@shared/enum/organizationType";
import { formTemplateQueries, apprTemplateQueries, orgQueries, approvalQueries } from "@shared/query/organization/queries";
import type { FormTemplateVO, FormTemplateTargetVO } from "@shared/api/organization/formTemplateApi";
import type { ApprTemplateVO } from "@shared/api/organization/apprTemplateApi";
import type { OfficeCodeVO } from "@shared/api/organization/orgApi";
import type { ApprDocLineVO, ApprDocTargetVO } from "@shared/api/approval/approvalApi";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useAlertStore } from "@shared/store/useAlertStore";
import { UserModal, type SuccessData } from "@pages/common/modal/user/UserModal";
import FormPreviewModal from "@pages/settings/form/editor/FormPreviewModal";
import ApprLinePreview from "../_common/ApprLinePreview";
import FormRenderer from "../_common/FormRenderer";

type Person = { id: string; name: string; team?: string; position?: string; targetType?: string };

// ─── 사람 뱃지 ──────────────────────────────────────────

const PersonBadge = ({ person, removable, onRemove, color = "bg-p-color-1/10 text-p-color-1" }: {
  person: Person; removable: boolean; onRemove: () => void; color?: string;
}) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${color}`}
    title={[person.team, person.position].filter(Boolean).join(" / ")}>
    {person.name}
    {removable && (
      <button type="button" onClick={onRemove} className="hover:text-destructive">
        <Icons.X className="size-3" />
      </button>
    )}
  </span>
);

// ─── 서식 선택 그리드 (Pattern A: 권한 잠금) ────────────

const FormSelectGrid = ({ forms, categories, onSelect }: {
  forms: FormTemplateVO[];
  categories: Map<string, string>;
  onSelect: (f: FormTemplateVO) => void;
}) => {
  const active = forms.filter((f) => f.useYn !== "N");
  const grouped = new Map<string, FormTemplateVO[]>();
  active.forEach((f) => {
    const cat = categories.get(f.categoryCode || "") || f.categoryCode || "일반";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(f);
  });

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">서식을 선택하여 기안을 작성합니다.</p>
      {active.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          등록된 서식이 없습니다. 환경설정 &gt; 서식 관리에서 서식을 먼저 등록해주세요.
        </p>
      )}
      {[...grouped.entries()].map(([cat, items]) => (
        <div key={cat} className="mb-6">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">{cat}</p>
          <div className="grid grid-cols-3 gap-3">
            {items.map((form) => {
              const noWrite = form.hasWriteAuth === false;
              const noRead = form.hasReadAuth === false;
              const locked = noWrite || noRead;
              const tip = noRead ? "열람권한이 없습니다" : "작성권한이 없습니다";

              const card = (
                <button
                  key={form.formTemplateSeq}
                  type="button"
                  disabled={locked}
                  onClick={() => !locked && onSelect(form)}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                    locked
                      ? "cursor-not-allowed opacity-40 bg-muted/30"
                      : "hover:border-p-color-1 hover:bg-p-color-1/5"
                  }`}
                >
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                    locked ? "bg-muted" : "bg-p-color-1/10"
                  }`}>
                    {locked
                      ? <Icons.Lock className="size-5 text-muted-foreground" />
                      : <Icons.FileText className="size-5 text-p-color-1" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{form.templateName}</p>
                    {locked && <p className="text-[10px] text-muted-foreground">{tip}</p>}
                  </div>
                </button>
              );

              return locked ? (
                <CustomTooltip key={form.formTemplateSeq} message={tip}>
                  <div>{card}</div>
                </CustomTooltip>
              ) : card;
            })}
          </div>
        </div>
      ))}
    </>
  );
};

// ─── 메인 ────────────────────────────────────────────────

const DraftWrite = () => {
  const user = useAuthStore((s) => s.user);
  const { openAlert } = useAlertStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editDocSeq = searchParams.get("docSeq");
  const formBodyRef = useRef<HTMLDivElement>(null);

  const [forms, setForms] = useState<FormTemplateVO[]>([]);
  const [categories, setCategories] = useState<Map<string, string>>(new Map());
  const [selectedForm, setSelectedForm] = useState<FormTemplateVO | null>(null);
  const [apprTemplate, setApprTemplate] = useState<ApprTemplateVO | null>(null);
  const [apprTemplates, setApprTemplates] = useState<ApprTemplateVO[]>([]);
  const [docTitle, setDocTitle] = useState("");
  const [savedValues, setSavedValues] = useState<Record<string, string> | undefined>(undefined);
  const [receivers, setReceivers] = useState<Person[]>([]);
  const [refs, setRefs] = useState<Person[]>([]);
  const [references, setReferences] = useState<Person[]>([]);
  const [receiverModal, setReceiverModal] = useState(false);
  const [refModal, setRefModal] = useState(false);
  const [referenceModal, setReferenceModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [apprChangeOpen, setApprChangeOpen] = useState(false);
  const [previewApprLine, setPreviewApprLine] = useState<ApprTemplateVO | null>(null);

  const getListMut = useMutation(formTemplateQueries.getList());
  const getDetailMut = useMutation(formTemplateQueries.getDetail());
  const getApprDetailMut = useMutation(apprTemplateQueries.getDetail());
  const getApprListMut = useMutation(apprTemplateQueries.getList());
  const getCategoryMut = useMutation(orgQueries.getOfficeCodeList());
  const saveDocMut = useMutation(approvalQueries.saveDoc());
  const getDocMut = useMutation(approvalQueries.getDoc());

  // 서식 목록 + 카테고리 로드
  useEffect(() => {
    Promise.all([
      getListMut.mutateAsync({ categoryCode: undefined, templateName: undefined }),
      getCategoryMut.mutateAsync({ codeClass: CODE_CLASS.FORM_CATEGORY }),
    ]).then(([list, cats]) => {
      setForms(list);
      setCategories(new Map(cats.map((c: OfficeCodeVO) => [c.officeCode, c.codeName])));
    }).catch(() => {});
  }, []);

  // 편집 모드: 임시저장/회수 문서 로드
  useEffect(() => {
    if (!editDocSeq) return;
    let cancelled = false;
    (async () => {
      try {
        const doc = await getDocMut.mutateAsync(editDocSeq);
        if (cancelled) return;
        if (!doc.formTemplateSeq) {
          openAlert({ message: "서식 정보가 없는 문서입니다.", onConfirm: () => navigate("/approval/draft/list") });
          return;
        }
        if (doc.docStatus !== "DRAFT" && doc.docStatus !== "WITHDRAWN") {
          openAlert({ message: "임시저장/회수 상태에서만 수정할 수 있습니다.", onConfirm: () => navigate("/approval/draft/list") });
          return;
        }
        const formDetail = await getDetailMut.mutateAsync(doc.formTemplateSeq);
        if (cancelled) return;
        setSelectedForm(formDetail);
        setDocTitle(doc.docTitle || formDetail.templateName || "");
        try { setSavedValues(JSON.parse(doc.docContent || "{}")); } catch { setSavedValues({}); }

        if (formDetail.apprTemplateSeq) {
          const appr = await getApprDetailMut.mutateAsync(formDetail.apprTemplateSeq);
          if (!cancelled) setApprTemplate(appr);
        } else {
          setApprTemplate(null);
        }

        const docTargets = doc.targets || [];
        const toPerson = (t: any): Person => ({ id: t.refSeq || "", name: t.refName || t.refSeq || "", team: t.refDept || "", position: "", targetType: t.targetType || "EMPLOYEE" });
        setReceivers(docTargets.filter((t) => t.targetRole === "RECEIVE").map(toPerson));
        setRefs(docTargets.filter((t) => t.targetRole === "SHARE").map(toPerson));
        setReferences(docTargets.filter((t) => t.targetRole === "REFERENCE").map(toPerson));
      } catch {
        if (!cancelled) openAlert({ message: "기안 문서를 불러오는데 실패했습니다.", onConfirm: () => navigate("/approval/draft/list") });
      }
    })();
    return () => { cancelled = true; };
  }, [editDocSeq]);

  // 서식 선택
  const handleSelectForm = async (form: FormTemplateVO) => {
    try {
      const detail = await getDetailMut.mutateAsync(form.formTemplateSeq!);
      setSelectedForm(detail);
      setDocTitle(detail.docNumFormat || detail.templateName || "");

      if (detail.apprTemplateSeq) {
        const appr = await getApprDetailMut.mutateAsync(detail.apprTemplateSeq);
        setApprTemplate(appr);
      } else {
        setApprTemplate(null);
      }

      const defaultReceivers = (detail.targets || [])
        .filter((t: FormTemplateTargetVO) => t.targetRole === "RECEIVE")
        .map((t: FormTemplateTargetVO) => ({ id: t.refSeq || "", name: t.refName || t.refSeq || "", team: t.refDept || "", position: "", targetType: t.targetType || "EMPLOYEE" }));
      setReceivers(defaultReceivers);

      if (detail.shareScope === "ALL") {
        setRefs([{ id: "__ALL__", name: "전체 구성원" }]);
      } else {
        const defaultRefs = (detail.targets || [])
          .filter((t: FormTemplateTargetVO) => t.targetRole === "SHARE_GROUP")
          .map((t: FormTemplateTargetVO) => ({ id: t.refSeq || "", name: t.refName || t.refSeq || "", team: t.refDept || "", position: "", targetType: t.targetType || "EMPLOYEE" }));
        setRefs(defaultRefs);
      }

      const defaultReferences = (detail.targets || [])
        .filter((t: FormTemplateTargetVO) => t.targetRole === "REFERENCE")
        .map((t: FormTemplateTargetVO) => ({ id: t.refSeq || "", name: t.refName || t.refSeq || "", team: t.refDept || "", position: "", targetType: t.targetType || "EMPLOYEE" }));
      setReferences(defaultReferences);
    } catch {
      openAlert({ message: "서식을 불러오는데 실패했습니다." });
    }
  };

  const handleBack = () => {
    openAlert({
      message: "작성 중인 내용이 사라집니다. 돌아가시겠습니까?",
      type: "confirm",
      onConfirm: () => {
        if (editDocSeq) {
          navigate("/approval/draft/list");
        } else {
          setSelectedForm(null); setApprTemplate(null);
          setReceivers([]); setRefs([]); setReferences([]); setDocTitle("");
          setSavedValues(undefined);
        }
      },
    });
  };

  // 결재선 변경
  const handleChangeApprLine = async () => {
    if (!apprTemplates.length) {
      const list = await getApprListMut.mutateAsync({ templateName: "" });
      setApprTemplates(list);
    }
    setPreviewApprLine(apprTemplate);
    setApprChangeOpen(true);
  };

  const handleSelectApprTemplate = async (seq: string) => {
    const appr = await getApprDetailMut.mutateAsync(seq);
    setPreviewApprLine(appr);
  };

  // 수신/공유/참조
  const removeReceiver = (id: string) => setReceivers((prev) => prev.filter((r) => r.id !== id));
  const removeRef = (id: string) => setRefs((prev) => prev.filter((r) => r.id !== id));
  const removeReference = (id: string) => setReferences((prev) => prev.filter((r) => r.id !== id));
  const isAllRef = refs.some((r) => r.id === "__ALL__");
  const canChangeShare = selectedForm?.shareChangeYn === "Y";
  const canChangeReceive = selectedForm?.receiveChangeYn === "Y";
  const canChangeReference = selectedForm?.referenceChangeYn === "Y";
  const showReceive = selectedForm?.receiveYn === "Y";
  const showReference = selectedForm?.referenceYn === "Y";
  const canEditTitle = selectedForm?.docModifyYn !== "Y";

  const addPersons = (setter: React.Dispatch<React.SetStateAction<Person[]>>, existing: Person[]) =>
    (data: SuccessData) => {
      const newItems = data.userInfo
        .filter((u) => !existing.some((r) => r.id === u.id))
        .map((u) => ({ id: u.id, name: u.name, team: u.team, position: u.position }));
      setter((prev) => [...prev, ...newItems]);
    };

  // 서식 본문 데이터 수집 (form 내 input/select/textarea 값)
  const collectFormData = (): string => {
    if (!formBodyRef.current) return "";
    const fields: Record<string, string> = {};
    formBodyRef.current.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea"
    ).forEach((el) => {
      if (el.name) {
        if (el instanceof HTMLInputElement && el.type === "checkbox") {
          if (el.checked) fields[el.name] = (fields[el.name] ? fields[el.name] + "," : "") + el.value;
        } else if (el instanceof HTMLInputElement && el.type === "radio") {
          if (el.checked) fields[el.name] = el.value;
        } else {
          fields[el.name] = el.value;
        }
      }
    });
    return JSON.stringify(fields);
  };

  // 결재선 → ApprDocLineVO 변환
  const buildLines = (): ApprDocLineVO[] => {
    if (!apprTemplate?.lines) return [];
    return apprTemplate.lines.map((l) => ({
      stepOrder: l.stepOrder || "1",
      stepName: l.stepName,
      stepType: l.stepType,
      approverSeq: l.approverRefSeq,   // approverRefSeq가 실제 결재자 seq
      approverName: l.approverName,
      approverType: l.approverType,
    }));
  };

  // 수신/공유 → ApprDocTargetVO 변환
  const buildTargets = (): ApprDocTargetVO[] => {
    const result: ApprDocTargetVO[] = [];
    receivers.forEach((r) => result.push({ targetRole: "RECEIVE", targetType: r.targetType || "EMPLOYEE", refSeq: r.id }));
    if (!isAllRef) {
      refs.forEach((r) => result.push({ targetRole: "SHARE", targetType: r.targetType || "EMPLOYEE", refSeq: r.id }));
    }
    references.forEach((r) => result.push({ targetRole: "REFERENCE", targetType: r.targetType || "EMPLOYEE", refSeq: r.id }));
    return result;
  };

  const doSave = (status: "DRAFT" | "PENDING") => {
    if (!docTitle.trim()) return openAlert({ message: "문서 제목을 입력해주세요." });
    if (status === "PENDING" && selectedForm?.apprRequiredYn === "Y" && !apprTemplate?.lines?.length)
      return openAlert({ message: "결재선이 필요한 서식입니다. 결재선을 확인해주세요." });

    saveDocMut.mutate(
      { ...(editDocSeq ? { docSeq: editDocSeq } : {}), officeSeq: user?.officeId, formTemplateSeq: selectedForm?.formTemplateSeq, docTitle, docContent: collectFormData(), docStatus: status, lines: buildLines(), targets: buildTargets() },
      {
        onSuccess: () => {
          openAlert({
            message: status === "DRAFT" ? "임시저장되었습니다." : "상신이 완료되었습니다.",
            onConfirm: () => {
              if (editDocSeq) {
                navigate("/approval/draft/list");
              } else if (status === "PENDING") {
                setSelectedForm(null); setApprTemplate(null);
                setReceivers([]); setRefs([]); setReferences([]); setDocTitle("");
              }
            },
          });
        },
        onError: () => openAlert({ message: "저장에 실패했습니다." }),
      },
    );
  };

  // ── 서식 미선택 ───────────────────────────────────────

  if (!selectedForm) {
    if (editDocSeq) {
      return (
        <div className="flex h-60 items-center justify-center">
          <Icons.Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    return (
      <div>
        <div className="flex items-center gap-2 pb-4">
          <h2 className="text-lg font-bold">기안 작성</h2>
        </div>
        <FormSelectGrid forms={forms} categories={categories} onSelect={handleSelectForm} />
      </div>
    );
  }

  const lines = apprTemplate?.lines || [];

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Button size="icon-xs" variant="ghost" onClick={handleBack}>
            <Icons.ChevronLeft className="size-5" />
          </Button>
          <h2 className="text-lg font-bold">{selectedForm.templateName}</h2>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {categories.get(selectedForm.categoryCode || "") || "일반"}
          </span>
          {editDocSeq && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              수정 중
            </span>
          )}
        </div>
        <Button size="h28" variant="outline" onClick={() => setPreviewOpen(true)}>
          <Icons.Eye className="size-3.5" /> 미리보기
        </Button>
      </div>

      <Separator className="mb-4" />

      {/* 문서 제목 (입력) */}
      {canEditTitle && (
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">문서 제목</label>
          <Input value={docTitle} onChange={(e) => setDocTitle(e.target.value)}
            placeholder="문서 제목을 입력하세요" className="text-base font-medium" />
        </div>
      )}

      {/* 좌/우 레이아웃 */}
      <div className="flex gap-4">
        {/* 좌측: A4 페이퍼 (결재 조회와 동일 디자인) */}
        <div className="min-w-0 flex-1">
          <article
            ref={formBodyRef}
            className="mx-auto max-w-[794px] rounded-sm bg-card text-card-foreground shadow-md ring-1 ring-border"
          >
            <div className="px-[90px] py-[70px]">
              {/* 문서 헤더 */}
              <header className="mb-6">
                <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{selectedForm.templateName}</span>
                  <span className="font-mono">DOC-XXXX-XXXXXX</span>
                </div>
                <h1
                  style={{ fontSize: 24, lineHeight: 1.4 }}
                  className="truncate py-2 text-center font-bold tracking-[0.12em]"
                >
                  {docTitle || selectedForm.templateName}
                </h1>
                <div className="border-b-2 border-foreground/70" />
                <div className="mt-[3px] border-b border-foreground/40" />
              </header>

              {/* 메타 테이블 (기안자 / 상신일) */}
              <section className="mb-6">
                <table className="w-full border-collapse text-sm">
                  <colgroup>
                    <col className="w-[100px]" />
                    <col />
                    <col className="w-[100px]" />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr className="border-y border-border">
                      <th className="border-r border-border bg-muted/40 px-3 py-2 text-left text-xs font-medium">
                        기안자
                      </th>
                      <td className="border-r border-border px-3 py-2 text-sm">
                        {user?.userNameKo ?? "-"}
                        {(user?.deptName || user?.userPosition) && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            {[user?.deptName, user?.userPosition].filter(Boolean).join(" / ")}
                          </span>
                        )}
                      </td>
                      <th className="border-r border-border bg-muted/40 px-3 py-2 text-left text-xs font-medium">
                        상신일
                      </th>
                      <td className="px-3 py-2 text-sm">
                        {new Date().toLocaleDateString("ko-KR")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* 본문 (서식) */}
              <section>
                <FormRenderer templateData={selectedForm.templateData || ""} values={savedValues} />
              </section>

              {/* 서식 하단 안내 */}
              {selectedForm.footerYn === "Y" && selectedForm.footerContent && (
                <>
                  <hr className="my-6 border-border" />
                  <div className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                    {selectedForm.footerContent}
                  </div>
                </>
              )}
            </div>
          </article>
        </div>

        {/* 우측 패널 */}
        <div className="w-96 shrink-0 space-y-3">
          {/* 결재선 */}
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold">결재선</p>
              {selectedForm.apprRequiredYn === "Y" && !lines.length && (
                <span className="text-[10px] text-destructive">필수</span>
              )}
            </div>
            <ApprLinePreview lines={lines} userName={user?.userNameKo} showStatus />
            {selectedForm.apprChangeAllowYn === "Y" && (
              <Button size="h28" variant="outline" className="mt-3 w-full text-xs"
                onClick={handleChangeApprLine}>
                <Icons.Edit className="size-3" /> 결재선 변경
              </Button>
            )}
          </div>

          {/* 수신 */}
          {showReceive && (
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold">수신 ({receivers.length})</p>
                {canChangeReceive && (
                  <button type="button" onClick={() => setReceiverModal(true)}
                    className="text-muted-foreground hover:text-foreground">
                    <Icons.Plus className="size-3.5" />
                  </button>
                )}
              </div>
              <div className="flex min-h-8 flex-wrap gap-1">
                {receivers.length ? receivers.map((r) => (
                  <PersonBadge key={r.id} person={r} removable={canChangeReceive}
                    onRemove={() => removeReceiver(r.id)} />
                )) : <span className="py-0.5 text-xs text-muted-foreground">수신자 없음</span>}
              </div>
            </div>
          )}

          {/* 공유 */}
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold">공유 {isAllRef ? "(전체)" : `(${refs.length})`}</p>
              {!isAllRef && canChangeShare && (
                <button type="button" onClick={() => setRefModal(true)}
                  className="text-muted-foreground hover:text-foreground">
                  <Icons.Plus className="size-3.5" />
                </button>
              )}
            </div>
            <div className="flex min-h-8 flex-wrap gap-1">
              {isAllRef ? (
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                  전체 구성원에게 공유됩니다
                </span>
              ) : refs.length ? refs.map((r) => (
                <PersonBadge key={r.id} person={r} removable={canChangeShare}
                  onRemove={() => removeRef(r.id)} color="bg-muted" />
              )) : <span className="py-0.5 text-xs text-muted-foreground">공유 대상 없음</span>}
            </div>
          </div>

          {/* 참조 (열람) */}
          {showReference && (
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold">참조 ({references.length})</p>
                {canChangeReference && (
                  <button type="button" onClick={() => setReferenceModal(true)}
                    className="text-muted-foreground hover:text-foreground">
                    <Icons.Plus className="size-3.5" />
                  </button>
                )}
              </div>
              <div className="flex min-h-8 flex-wrap gap-1">
                {references.length ? references.map((r) => (
                  <PersonBadge key={r.id} person={r} removable={canChangeReference}
                    onRemove={() => removeReference(r.id)} color="bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" />
                )) : <span className="py-0.5 text-xs text-muted-foreground">참조자 없음</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <Separator className="mt-6" />
      <div className="flex justify-end gap-2 py-4">
        <Button size="h28" variant="outline" onClick={() => doSave("DRAFT")} disabled={saveDocMut.isPending}>
          <Icons.Save className="size-3.5" /> 임시저장
        </Button>
        <Button size="h28" variant="blue" onClick={() => doSave("PENDING")} disabled={saveDocMut.isPending}>
          <Icons.Send className="size-3.5" /> 상신
        </Button>
      </div>

      {/* 모달 */}
      <UserModal title="수신자 선택" open={receiverModal} onOpenChange={setReceiverModal}
        onSuccess={(data) => { addPersons(setReceivers, receivers)(data); setReceiverModal(false); }} multi />
      <UserModal title="공유 대상 선택" open={refModal} onOpenChange={setRefModal}
        onSuccess={(data) => { addPersons(setRefs, refs)(data); setRefModal(false); }} multi />
      <UserModal title="참조자 선택" open={referenceModal} onOpenChange={setReferenceModal}
        onSuccess={(data) => { addPersons(setReferences, references)(data); setReferenceModal(false); }} multi />
      <FormPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)}
        templateData={selectedForm.templateData} title={docTitle || selectedForm.templateName}
        footerContent={selectedForm.footerContent} />

      {/* 결재선 변경 모달 */}
      <Dialog open={apprChangeOpen} onOpenChange={(v) => { setApprChangeOpen(v); if (!v) setPreviewApprLine(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>결재선 변경</DialogTitle></DialogHeader>
          <div className="flex gap-4">
            <div className="max-h-72 w-1/2 space-y-1 overflow-auto border-r pr-4">
              {apprTemplates.map((t) => (
                <button key={t.apprTemplateSeq} type="button"
                  onClick={() => handleSelectApprTemplate(t.apprTemplateSeq!)}
                  className={`flex w-full items-center justify-between rounded px-3 py-2.5 text-left text-sm hover:bg-muted ${
                    previewApprLine?.apprTemplateSeq === t.apprTemplateSeq
                      ? "bg-p-color-1/5 font-medium text-p-color-1" : ""
                  }`}
                >
                  <span>{t.templateName}</span>
                  {previewApprLine?.apprTemplateSeq === t.apprTemplateSeq &&
                    <Icons.Check className="size-4 text-p-color-1" />}
                </button>
              ))}
              {!apprTemplates.length && <p className="py-4 text-center text-sm text-muted-foreground">등록된 결재선 템플릿이 없습니다.</p>}
            </div>
            <div className="w-1/2">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">결재 단계</p>
              <ApprLinePreview lines={previewApprLine?.lines || []} userName={user?.userNameKo} />
              {previewApprLine && (
                <Button size="h28" variant="blue" className="mt-4 w-full"
                  onClick={() => { setApprTemplate(previewApprLine); setApprChangeOpen(false); setPreviewApprLine(null); }}>
                  선택
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DraftWrite;
