import { Node, mergeAttributes } from "@tiptap/react";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { Button, Icons } from "@repo/ui";

/** 배열 속성 헬퍼 */
const jsonArrayAttr = (defaultVal: string[] = []) => ({
  default: defaultVal,
  parseHTML: (el: HTMLElement) => {
    const raw = el.getAttribute("data-json");
    try { return JSON.parse(raw || "[]"); } catch { return defaultVal; }
  },
  renderHTML: () => ({}),
});

/** 폼 블록 TipTap 커스텀 노드 */
const FormBlockNode = Node.create({
  name: "formBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      blockType: { default: "text" },
      blockLabel: { default: "텍스트" },
      name: { default: "" },
      description: { default: "" },
      required: { default: false },
      placeholder: { default: "" },
      maxLength: { default: null },
      options: jsonArrayAttr([]),
      columns: jsonArrayAttr([]),
      columnTypes: jsonArrayAttr([]),
      rowCount: { default: 1 },
      addRowEnabled: { default: true },
      dateFormat: { default: "YYYY-MM-DD" },
      timeFormat: { default: "HH:mm" },
      fileTypes: { default: "" },
      fileMaxSize: { default: null },
      noticeText: { default: "" },
      labelText: { default: "" },
      calcFormula: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="form-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-type": "form-block" }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FormBlockView);
  },
});

/** 안전하게 배열로 변환 */
const toArray = (val: any): string[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") try { return JSON.parse(val); } catch { return []; }
  return [];
};

/** 블록 타입별 실제 입력 필드 미리보기 (FormRenderer 와 동일 스타일) */
const BlockPreview = ({ attrs }: { attrs: any }) => {
  const { blockType, placeholder, options: rawOpts, columns: rawCols, noticeText, labelText,
    fileTypes, fileMaxSize } = attrs;
  const options = toArray(rawOpts);
  const columns = toArray(rawCols);

  const inputCls = "h-9 w-full rounded-md border border-border bg-background px-3 text-sm";

  switch (blockType) {
    case "text":
      return <input className={inputCls} placeholder={placeholder || "입력해주세요"} disabled />;
    case "multiText":
      return <textarea rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed" placeholder={placeholder || "내용을 입력해주세요"} disabled />;
    case "select":
    case "multiSelect":
      return (
        <select className={inputCls} disabled>
          <option>{placeholder || "선택해주세요"}</option>
          {options.map((o, i) => <option key={i}>{o}</option>)}
        </select>
      );
    case "table":
    case "calcTable": {
      const cols = columns.length > 0 ? columns : ["열 1", "열 2", "열 3"];
      return (
        <table className="w-full border-collapse rounded-md border border-border text-sm">
          <thead>
            <tr className="bg-muted/40">
              {cols.map((c, i) => (
                <th key={i} className="border border-border px-3 py-2 text-left font-medium">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {cols.map((_, i) => (
                <td key={i} className="border border-border px-3 py-2">
                  <input className="w-full bg-transparent text-sm" disabled />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      );
    }
    case "checkbox": {
      const items = options.length > 0 ? options : ["옵션 1", "옵션 2"];
      return (
        <div className="flex flex-wrap gap-4">
          {items.map((o, i) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <input type="checkbox" disabled /> {o}
            </label>
          ))}
        </div>
      );
    }
    case "radio": {
      const items = options.length > 0 ? options : ["옵션 1", "옵션 2"];
      return (
        <div className="flex flex-wrap gap-4">
          {items.map((o, i) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <input type="radio" disabled /> {o}
            </label>
          ))}
        </div>
      );
    }
    case "date":
      return (
        <input type="text" placeholder="YYYY-MM-DD" disabled className="h-9 w-48 rounded-md border border-border bg-background px-3 text-sm" />
      );
    case "dateRange":
      return (
        <div className="flex items-center gap-2">
          <input type="text" placeholder="YYYY-MM-DD" disabled className="h-9 w-40 rounded-md border border-border bg-background px-3 text-sm" />
          <span className="text-sm text-muted-foreground">~</span>
          <input type="text" placeholder="YYYY-MM-DD" disabled className="h-9 w-40 rounded-md border border-border bg-background px-3 text-sm" />
        </div>
      );
    case "time":
      return <input type="text" placeholder="HH:mm" disabled className="h-9 w-40 rounded-md border border-border bg-background px-3 text-sm" />;
    case "timeRange":
      return (
        <div className="flex items-center gap-2">
          <input type="text" placeholder="HH:mm" disabled className="h-9 w-36 rounded-md border border-border bg-background px-3 text-sm" />
          <span className="text-sm text-muted-foreground">~</span>
          <input type="text" placeholder="HH:mm" disabled className="h-9 w-36 rounded-md border border-border bg-background px-3 text-sm" />
        </div>
      );
    case "file":
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icons.Paperclip className="size-4" /> 파일 첨부
          {fileTypes && <span className="text-xs">({fileTypes})</span>}
          {fileMaxSize && <span className="text-xs">최대 {fileMaxSize}MB</span>}
        </div>
      );
    case "notice":
      return (
        <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
          {noticeText || "안내 문구"}
        </div>
      );
    case "image":
      return (
        <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed border-border text-muted-foreground/60">
          <Icons.Image className="size-8" />
        </div>
      );
    case "label":
      return <span className="text-sm font-medium">{labelText || "레이블"}</span>;
    case "signature":
      return <span className="text-sm text-muted-foreground">(서명)</span>;
    case "stamp":
      return <span className="text-sm text-muted-foreground">(직인)</span>;
    default:
      return null;
  }
};

/**
 * 폼 블록 (편집 모드 — 라벨/값 row 디자인, FormRenderer 와 동일 룩)
 *
 * 인접 블록끼리 보더가 자연스럽게 이어지도록 `-mt-px` + `last:rounded-b-md first:rounded-t-md`
 */
const FormBlockView = ({ node, selected, deleteNode }: { node: any; selected: boolean; deleteNode: () => void }) => {
  const attrs = node.attrs;
  const { blockType, blockLabel, name, description, required } = attrs;
  const displayName = name || blockLabel || "";
  const isFooterBlock = blockType === "signature" || blockType === "stamp";

  const handles = (
    <>
      <div className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="cursor-grab rounded p-0.5 hover:bg-muted" data-drag-handle>
          <Icons.GripVertical className="size-4 text-muted-foreground" />
        </div>
      </div>
      <div className="absolute -right-2 -top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
        <Button size="icon-xs" variant="ghost-red" className="size-5 rounded-full bg-background shadow-sm" onClick={deleteNode}>
          <Icons.X className="size-3" />
        </Button>
      </div>
    </>
  );

  // 서명/직인 블록은 공문서 풋터 스타일 (우측 정렬, 보더 없음)
  if (isFooterBlock) {
    return (
      <NodeViewWrapper>
        <div
          className={`group relative my-1 rounded transition-colors ${
            selected ? "ring-2 ring-blue-400" : "hover:bg-muted/20"
          }`}
        >
          {handles}
          <div className="flex items-center justify-end gap-2 px-4 py-2 text-sm">
            <span className="text-foreground">{displayName || "(이름)"}</span>
            {required && <span className="text-red-500">*</span>}
            <BlockPreview attrs={attrs} />
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  // 일반 블록은 라벨/값 row
  return (
    <NodeViewWrapper>
      <div
        className={`group relative -mt-px overflow-hidden border border-border transition-colors first:rounded-t-md first:mt-0 last:rounded-b-md ${
          selected ? "ring-2 ring-blue-400 z-10" : "hover:ring-1 hover:ring-border"
        }`}
      >
        {handles}
        <div className="flex">
          <div className="w-[160px] shrink-0 border-r border-border bg-muted/40 px-4 py-3">
            <span className="text-sm font-medium">{displayName || "(이름 미입력)"}</span>
            {required && <span className="ml-0.5 text-red-500">*</span>}
          </div>
          <div className="flex-1 px-4 py-3">
            {description && (
              <p className="mb-1.5 text-xs text-muted-foreground">{description}</p>
            )}
            <BlockPreview attrs={attrs} />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default FormBlockNode;
