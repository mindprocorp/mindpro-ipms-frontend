import { Button, Checkbox, Icons, Input, Label, Separator } from "@repo/ui";
import { useState } from "react";

interface FormBlockAttrs {
  blockType: string;
  blockLabel: string;
  name: string;
  description: string;
  required: boolean;
  // 상세 설정
  placeholder?: string;
  maxLength?: number;
  options?: string[];        // select, checkbox, radio
  columns?: string[];        // table
  columnTypes?: string[];    // table 컬럼 타입
  rowCount?: number;         // table 초기 행 수
  addRowEnabled?: boolean;   // table 행 추가 허용
  dateFormat?: string;       // date
  timeFormat?: string;       // time
  fileTypes?: string;        // file 허용 확장자
  fileMaxSize?: number;      // file 최대 크기(MB)
  noticeText?: string;       // notice 안내 문구
  labelText?: string;        // label 텍스트
  calcFormula?: string;      // calcTable 계산식
}

interface Props {
  selected: FormBlockAttrs | null;
  onUpdate: (attrs: Partial<FormBlockAttrs>) => void;
}

/** 속성 입력 행 */
const PropRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="mb-1 block text-xs font-medium">{label}</label>
    {children}
  </div>
);

const EditorProperties = ({ selected, onUpdate }: Props) => {
  if (!selected) {
    return (
      <div className="w-[280px] shrink-0 overflow-auto border-l bg-background">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Icons.MousePointerClick className="text-muted-foreground mb-3 size-8 opacity-30" />
          <p className="text-muted-foreground text-sm">컴포넌트를 선택하면</p>
          <p className="text-muted-foreground text-sm">설정이 표시됩니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[280px] shrink-0 overflow-auto border-l bg-background">
      {/* 공통 설정 */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold">공통 설정 ({selected.blockLabel})</span>
      </div>
      <div className="space-y-3 p-4">
        <PropRow label="이름">
          <Input className="h-8 text-sm" value={selected.name || ""} onChange={(e) => onUpdate({ name: e.target.value })} />
        </PropRow>
        <PropRow label="설명">
          <Input className="h-8 text-sm" value={selected.description || ""} onChange={(e) => onUpdate({ description: e.target.value })} />
        </PropRow>
        <div className="flex items-center gap-2">
          <Checkbox id="prop-required" checked={selected.required} onCheckedChange={(v) => onUpdate({ required: !!v })} />
          <Label htmlFor="prop-required" className="text-sm font-normal">필수 항목으로 표시</Label>
        </div>
      </div>

      {/* 상세 설정 */}
      <Separator />
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold">상세 설정</span>
      </div>
      <div className="space-y-3 p-4">
        <DetailSettings selected={selected} onUpdate={onUpdate} />
      </div>
    </div>
  );
};

/** 컴포넌트 타입별 상세 설정 */
const DetailSettings = ({ selected, onUpdate }: { selected: FormBlockAttrs; onUpdate: (attrs: Partial<FormBlockAttrs>) => void }) => {
  switch (selected.blockType) {
    case "text":
      return <TextSettings selected={selected} onUpdate={onUpdate} />;
    case "multiText":
      return <MultiTextSettings selected={selected} onUpdate={onUpdate} />;
    case "select":
    case "multiSelect":
      return <SelectSettings selected={selected} onUpdate={onUpdate} />;
    case "checkbox":
    case "radio":
      return <OptionSettings selected={selected} onUpdate={onUpdate} />;
    case "table":
    case "calcTable":
      return <TableSettings selected={selected} onUpdate={onUpdate} />;
    case "date":
    case "dateRange":
      return <DateSettings selected={selected} onUpdate={onUpdate} />;
    case "time":
    case "timeRange":
      return <TimeSettings selected={selected} onUpdate={onUpdate} />;
    case "file":
      return <FileSettings selected={selected} onUpdate={onUpdate} />;
    case "notice":
      return <NoticeSettings selected={selected} onUpdate={onUpdate} />;
    case "label":
      return <LabelSettings selected={selected} onUpdate={onUpdate} />;
    default:
      return <p className="text-muted-foreground text-xs">이 컴포넌트에 대한 상세 설정이 없습니다.</p>;
  }
};

/** 텍스트 */
const TextSettings = ({ selected, onUpdate }: { selected: FormBlockAttrs; onUpdate: (a: Partial<FormBlockAttrs>) => void }) => (
  <>
    <PropRow label="플레이스홀더">
      <Input className="h-8 text-sm" value={selected.placeholder || ""} onChange={(e) => onUpdate({ placeholder: e.target.value })} placeholder="입력 안내 문구" />
    </PropRow>
    <PropRow label="최대 글자수">
      <Input className="h-8 text-sm" type="number" value={selected.maxLength || ""} onChange={(e) => onUpdate({ maxLength: Number(e.target.value) || undefined })} placeholder="제한 없음" />
    </PropRow>
  </>
);

/** 멀티 텍스트 */
const MultiTextSettings = ({ selected, onUpdate }: { selected: FormBlockAttrs; onUpdate: (a: Partial<FormBlockAttrs>) => void }) => (
  <>
    <PropRow label="플레이스홀더">
      <Input className="h-8 text-sm" value={selected.placeholder || ""} onChange={(e) => onUpdate({ placeholder: e.target.value })} placeholder="입력 안내 문구" />
    </PropRow>
    <PropRow label="최대 글자수">
      <Input className="h-8 text-sm" type="number" value={selected.maxLength || ""} onChange={(e) => onUpdate({ maxLength: Number(e.target.value) || undefined })} placeholder="제한 없음" />
    </PropRow>
  </>
);

/** 셀렉트 박스 */
const SelectSettings = ({ selected, onUpdate }: { selected: FormBlockAttrs; onUpdate: (a: Partial<FormBlockAttrs>) => void }) => {
  const options = selected.options || [];
  const [newOpt, setNewOpt] = useState("");

  const addOption = () => {
    if (!newOpt.trim()) return;
    onUpdate({ options: [...options, newOpt.trim()] });
    setNewOpt("");
  };

  const removeOption = (idx: number) => {
    onUpdate({ options: options.filter((_, i) => i !== idx) });
  };

  return (
    <>
      <PropRow label="플레이스홀더">
        <Input className="h-8 text-sm" value={selected.placeholder || ""} onChange={(e) => onUpdate({ placeholder: e.target.value })} placeholder="선택해주세요" />
      </PropRow>
      <PropRow label="선택 항목">
        <div className="space-y-1.5">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="flex-1 truncate rounded border px-2 py-1 text-xs">{opt}</span>
              <button type="button" className="text-muted-foreground hover:text-red-500" onClick={() => removeOption(i)}>
                <Icons.X className="size-3.5" />
              </button>
            </div>
          ))}
          <div className="flex gap-1">
            <Input className="h-7 flex-1 text-xs" value={newOpt} onChange={(e) => setNewOpt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addOption()} placeholder="항목 입력 후 Enter" />
            <Button size="icon-xs" variant="ghost" onClick={addOption}><Icons.Plus className="size-3.5" /></Button>
          </div>
        </div>
      </PropRow>
    </>
  );
};

/** 체크박스 / 라디오 */
const OptionSettings = ({ selected, onUpdate }: { selected: FormBlockAttrs; onUpdate: (a: Partial<FormBlockAttrs>) => void }) => {
  const options = selected.options || [];
  const [newOpt, setNewOpt] = useState("");

  const addOption = () => {
    if (!newOpt.trim()) return;
    onUpdate({ options: [...options, newOpt.trim()] });
    setNewOpt("");
  };

  const removeOption = (idx: number) => {
    onUpdate({ options: options.filter((_, i) => i !== idx) });
  };

  return (
    <PropRow label="선택 항목">
      <div className="space-y-1.5">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-1">
            {selected.blockType === "radio" ? (
              <Icons.Circle className="size-3 shrink-0 text-muted-foreground" />
            ) : (
              <Icons.Square className="size-3 shrink-0 text-muted-foreground" />
            )}
            <span className="flex-1 truncate text-xs">{opt}</span>
            <button type="button" className="text-muted-foreground hover:text-red-500" onClick={() => removeOption(i)}>
              <Icons.X className="size-3.5" />
            </button>
          </div>
        ))}
        <div className="flex gap-1">
          <Input className="h-7 flex-1 text-xs" value={newOpt} onChange={(e) => setNewOpt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addOption()} placeholder="항목 입력 후 Enter" />
          <Button size="icon-xs" variant="ghost" onClick={addOption}><Icons.Plus className="size-3.5" /></Button>
        </div>
      </div>
    </PropRow>
  );
};

/** 테이블 / 수식 테이블 */
const TableSettings = ({ selected, onUpdate }: { selected: FormBlockAttrs; onUpdate: (a: Partial<FormBlockAttrs>) => void }) => {
  const columns = selected.columns || [];
  const [newCol, setNewCol] = useState("");

  const addColumn = () => {
    if (!newCol.trim()) return;
    onUpdate({ columns: [...columns, newCol.trim()] });
    setNewCol("");
  };

  const removeColumn = (idx: number) => {
    onUpdate({ columns: columns.filter((_, i) => i !== idx) });
  };

  return (
    <>
      <PropRow label="열 설정">
        <div className="space-y-1.5">
          {columns.map((col, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-muted-foreground w-5 text-center text-[10px]">{i + 1}</span>
              <span className="flex-1 truncate rounded border px-2 py-1 text-xs">{col}</span>
              <button type="button" className="text-muted-foreground hover:text-red-500" onClick={() => removeColumn(i)}>
                <Icons.X className="size-3.5" />
              </button>
            </div>
          ))}
          <div className="flex gap-1">
            <Input className="h-7 flex-1 text-xs" value={newCol} onChange={(e) => setNewCol(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addColumn()} placeholder="열 이름 입력 후 Enter" />
            <Button size="icon-xs" variant="ghost" onClick={addColumn}><Icons.Plus className="size-3.5" /></Button>
          </div>
        </div>
      </PropRow>
      <PropRow label="초기 행 수">
        <Input className="h-8 text-sm" type="number" value={selected.rowCount || 1} onChange={(e) => onUpdate({ rowCount: Number(e.target.value) || 1 })} min={1} />
      </PropRow>
      <div className="flex items-center gap-2">
        <Checkbox id="prop-addrow" checked={selected.addRowEnabled ?? true} onCheckedChange={(v) => onUpdate({ addRowEnabled: !!v })} />
        <Label htmlFor="prop-addrow" className="text-sm font-normal">행 추가 허용</Label>
      </div>
      {selected.blockType === "calcTable" && (
        <PropRow label="계산식">
          <Input className="h-8 text-sm" value={selected.calcFormula || ""} onChange={(e) => onUpdate({ calcFormula: e.target.value })} placeholder="예: SUM(A)" />
        </PropRow>
      )}
    </>
  );
};

/** 날짜 */
const DateSettings = ({ selected, onUpdate }: { selected: FormBlockAttrs; onUpdate: (a: Partial<FormBlockAttrs>) => void }) => (
  <PropRow label="날짜 형식">
    <select className="h-8 w-full rounded-md border px-2 text-sm" value={selected.dateFormat || "YYYY-MM-DD"} onChange={(e) => onUpdate({ dateFormat: e.target.value })}>
      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
      <option value="YYYY/MM/DD">YYYY/MM/DD</option>
      <option value="YYYY.MM.DD">YYYY.MM.DD</option>
      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
    </select>
  </PropRow>
);

/** 시간 */
const TimeSettings = ({ selected, onUpdate }: { selected: FormBlockAttrs; onUpdate: (a: Partial<FormBlockAttrs>) => void }) => (
  <PropRow label="시간 형식">
    <select className="h-8 w-full rounded-md border px-2 text-sm" value={selected.timeFormat || "HH:mm"} onChange={(e) => onUpdate({ timeFormat: e.target.value })}>
      <option value="HH:mm">24시간 (HH:mm)</option>
      <option value="hh:mm A">12시간 (hh:mm AM/PM)</option>
    </select>
  </PropRow>
);

/** 파일 첨부 */
const FileSettings = ({ selected, onUpdate }: { selected: FormBlockAttrs; onUpdate: (a: Partial<FormBlockAttrs>) => void }) => (
  <>
    <PropRow label="허용 확장자">
      <Input className="h-8 text-sm" value={selected.fileTypes || ""} onChange={(e) => onUpdate({ fileTypes: e.target.value })} placeholder="예: pdf,jpg,png (비우면 전체)" />
    </PropRow>
    <PropRow label="최대 파일 크기 (MB)">
      <Input className="h-8 text-sm" type="number" value={selected.fileMaxSize || ""} onChange={(e) => onUpdate({ fileMaxSize: Number(e.target.value) || undefined })} placeholder="제한 없음" />
    </PropRow>
  </>
);

/** 안내 문구 */
const NoticeSettings = ({ selected, onUpdate }: { selected: FormBlockAttrs; onUpdate: (a: Partial<FormBlockAttrs>) => void }) => (
  <PropRow label="안내 문구">
    <textarea className="h-20 w-full rounded-md border px-3 py-2 text-sm" value={selected.noticeText || ""} onChange={(e) => onUpdate({ noticeText: e.target.value })} placeholder="안내 문구를 입력하세요" />
  </PropRow>
);

/** 레이블 */
const LabelSettings = ({ selected, onUpdate }: { selected: FormBlockAttrs; onUpdate: (a: Partial<FormBlockAttrs>) => void }) => (
  <PropRow label="레이블 텍스트">
    <Input className="h-8 text-sm" value={selected.labelText || ""} onChange={(e) => onUpdate({ labelText: e.target.value })} placeholder="표시할 텍스트" />
  </PropRow>
);

export default EditorProperties;
export type { FormBlockAttrs };
