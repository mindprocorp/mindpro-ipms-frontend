import type { ApprTemplateLineVO } from "@shared/api/organization/apprTemplateApi";

/** 결재 상세 조회 시 lineStatus + signatureImage 가 추가된 확장 타입 */
type LineWithStatus = ApprTemplateLineVO & {
  lineStatus?: string;
  actionComment?: string;
  signatureImage?: string;
};

type StepGroup = { stepOrder: string; stepName: string; stepType: string; approvers: LineWithStatus[] };

const groupByStep = (lines: ApprTemplateLineVO[]): StepGroup[] => {
  const map = new Map<string, StepGroup>();
  lines.forEach((l) => {
    const key = l.stepOrder;
    if (!map.has(key)) map.set(key, { stepOrder: key, stepName: l.stepName, stepType: l.stepType, approvers: [] });
    map.get(key)!.approvers.push(l);
  });
  return [...map.values()].sort((a, b) => Number(a.stepOrder) - Number(b.stepOrder));
};

interface Props {
  lines: LineWithStatus[];
  userName?: string;
  showStatus?: boolean;
}

/**
 * 결재선 미리보기 (공통)
 * - 기안 작성 우측 패널
 * - 결재선 선택 다이얼로그 미리보기
 * - 결재 상세 조회
 */
const ApprLinePreview = ({ lines, userName = "본인", showStatus = false }: Props) => {
  const steps = groupByStep(lines);

  if (!steps.length) {
    return <p className="py-2 text-center text-xs text-muted-foreground">결재선이 설정되지 않았습니다.</p>;
  }

  return (
    <div className="space-y-3">
      {steps.map((step, si) => (
        <div key={step.stepOrder}>
          <div className="mb-1 flex items-center gap-1.5">
            <div className="flex size-5 items-center justify-center rounded-full bg-p-color-1 text-[9px] font-bold text-white">{si + 1}</div>
            <span className="text-[10px] font-medium text-muted-foreground">{step.stepName || step.stepType}</span>
            {step.approvers.length > 1 && (
              <span className="text-[9px] text-muted-foreground">(병렬 {step.approvers.length}명)</span>
            )}
          </div>
          <div className="ml-2.5 space-y-1 border-l-2 border-muted pl-3">
            {step.approvers.map((a, ai) => {
              const displayName = a.approverType === "SELF" ? userName : a.approverName || "미지정";
              const isApproved = a.lineStatus === "APPROVED";
              return (
                <div key={a.templateLineSeq || ai} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs">{displayName}</p>
                    {/* 승인 완료 단계: 서명 이미지 있으면 표시, 없으면 (서명) 텍스트 */}
                    {showStatus && isApproved && (
                      a.signatureImage ? (
                        <img
                          src={a.signatureImage}
                          alt={`${displayName} 서명`}
                          className="h-6 max-w-[60px] object-contain"
                        />
                      ) : (
                        <span className="text-[9px] text-muted-foreground">(서명)</span>
                      )
                    )}
                  </div>
                  {showStatus && (() => {
                    const s = a.lineStatus;
                    const cfg =
                      s === "APPROVED" ? { label: "승인", cls: "bg-green-50 text-green-600" } :
                      s === "REJECTED" ? { label: "반려", cls: "bg-red-50 text-destructive" } :
                      { label: "대기", cls: "bg-muted text-muted-foreground" };
                    return <span className={`rounded px-1.5 py-0.5 text-[9px] ${cfg.cls}`}>{cfg.label}</span>;
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApprLinePreview;
