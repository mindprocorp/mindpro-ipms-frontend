import { Button, Icons } from "@repo/ui";
import type { ApprTemplateLineVO } from "@shared/api/organization/apprTemplateApi";

interface Props {
  line: ApprTemplateLineVO;
  onSelect: () => void;
}

const ApproverLabel = ({ line, onSelect }: Props) => {
  if (line.approverType === "SELF") return <span className="text-muted-foreground text-xs">본인 (자동 지정)</span>;
  if (line.approverType === "DIRECT_PERSON") {
    if (line.approverName) return <span className="rounded-md border bg-muted/40 px-2 py-0.5 text-xs">{line.approverName}</span>;
    return (
      <Button size="h24" variant="outline" className="text-xs" onClick={onSelect}>
        <Icons.UserRoundSearch className="size-3" /> 직원 선택
      </Button>
    );
  }
  return <span className="text-muted-foreground text-xs">결재자 유형을 선택하세요</span>;
};

export default ApproverLabel;
