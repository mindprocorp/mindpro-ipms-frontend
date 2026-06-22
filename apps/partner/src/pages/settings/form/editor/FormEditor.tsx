import { useState, useCallback } from "react";
import { Button, Icons } from "@repo/ui";
import { useEditor, EditorContent } from "@tiptap/react";
import type { NodeSelection } from "@tiptap/pm/state";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
// Underline은 StarterKit에 미포함이므로 별도 추가
import { Underline } from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import FormBlockNode from "./FormBlockExtension";
import EditorPalette from "./EditorPalette";
import EditorProperties, { type FormBlockAttrs } from "./EditorProperties";
import FormPreviewModal from "./FormPreviewModal";
import "./editor.css";

interface Props {
  initialContent?: string;
  initialTitle?: string;
  onSave: (data: { title: string; content: string }) => void;
  onCancel: () => void;
}

const FormEditor = ({ initialContent, initialTitle = "", onSave, onCancel }: Props) => {
  const [title, setTitle] = useState(initialTitle);
  const [selectedBlock, setSelectedBlock] = useState<FormBlockAttrs | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const parseContent = () => {
    if (!initialContent) return undefined;
    try {
      const parsed = JSON.parse(initialContent);
      // TipTap JSON은 { type: "doc", content: [...] } 형태여야 함
      // 배열이나 빈 값이면 무시
      if (!parsed || Array.isArray(parsed) || !parsed.type) return undefined;
      return parsed;
    } catch {
      return undefined;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder: "좌측 컴포넌트를 클릭하여 서식을 구성하세요." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline.configure({ HTMLAttributes: {} }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      FormBlockNode,
    ],
    content: parseContent(),
    onSelectionUpdate: ({ editor: e }) => {
      const sel = e.state.selection as NodeSelection;
      if (sel.node?.type.name === "formBlock") {
        const attrs = { ...sel.node.attrs } as FormBlockAttrs;
        // 배열이 문자열로 변환된 경우 복원
        if (typeof attrs.options === "string") try { attrs.options = JSON.parse(attrs.options); } catch { attrs.options = []; }
        if (typeof attrs.columns === "string") try { attrs.columns = JSON.parse(attrs.columns); } catch { attrs.columns = []; }
        if (typeof attrs.columnTypes === "string") try { attrs.columnTypes = JSON.parse(attrs.columnTypes); } catch { attrs.columnTypes = []; }
        setSelectedBlock(attrs);
      } else {
        setSelectedBlock(null);
      }
    },
  });

  const handleUpdateBlockAttrs = useCallback(
    (attrs: Partial<FormBlockAttrs>) => {
      if (!editor) return;
      const sel = editor.state.selection as any;
      if (sel.node?.type.name === "formBlock") {
        editor.commands.updateAttributes("formBlock", attrs);
        setSelectedBlock((prev) => (prev ? { ...prev, ...attrs } : null));
      }
    },
    [editor],
  );

  const handleSave = () => {
    if (!editor) return;
    onSave({ title, content: JSON.stringify(editor.getJSON()) });
  };

  return (
    <div className="fixed top-[50px] right-0 bottom-0 left-0 z-40 flex flex-col bg-background">
      {/* 헤더 */}
      <header className="flex shrink-0 items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Button size="icon-xs" variant="ghost" onClick={onCancel}>
            <Icons.ChevronLeft className="size-5" />
          </Button>
          <h2 className="text-lg font-bold">서식 편집기</h2>
        </div>
        <Button
          size="h28"
          variant="outline"
          onClick={() => {
            if (!editor) return;
            editor.commands.clearContent();
            setTitle("");
            setSelectedBlock(null);
          }}
        >
          <Icons.RotateCcw className="size-3.5" />
          초기화
        </Button>
      </header>

      {/* 3패널 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측 팔레트 */}
        <EditorPalette editor={editor} />

        {/* 중앙 에디터 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {editor && <EditorToolbar editor={editor} />}
          <div className="flex-1 overflow-auto bg-muted/40 px-6 py-6">
            {/* A4 페이퍼 (결재 조회/기안 작성과 동일 디자인 — 표준 여백 25mm) */}
            <article className="mx-auto max-w-[794px] rounded-sm bg-card text-card-foreground shadow-md ring-1 ring-border">
              <div className="px-[90px] py-[70px]">
                {/* 문서 헤더 */}
                <header className="mb-6">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{title || "서식명"}</span>
                    <span className="font-mono">DOC-XXXX-XXXXXX</span>
                  </div>
                  <h1
                    style={{ fontSize: 24, lineHeight: 1.4 }}
                    className="truncate py-2 text-center font-bold tracking-[0.12em]"
                  >
                    {title || "문서 제목"}
                  </h1>
                  <div className="border-b-2 border-foreground/70" />
                  <div className="mt-[3px] border-b border-foreground/40" />
                </header>

                {/* 메타 테이블 (placeholder) */}
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
                        <td className="border-r border-border px-3 py-2 text-sm text-muted-foreground">
                          (기안자명)
                        </td>
                        <th className="border-r border-border bg-muted/40 px-3 py-2 text-left text-xs font-medium">
                          상신일
                        </th>
                        <td className="px-3 py-2 text-sm text-muted-foreground">YYYY-MM-DD</td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                {/* 본문 (편집 가능한 TipTap 영역) */}
                <section>
                  <EditorContent editor={editor} className="tiptap-editor" />
                </section>
              </div>
            </article>
          </div>
        </div>

        {/* 우측 속성 */}
        <EditorProperties selected={selectedBlock} onUpdate={handleUpdateBlockAttrs} />
      </div>

      {/* 하단 */}
      <footer className="flex shrink-0 items-center justify-end gap-2 border-t bg-background px-6 py-3">
        <Button size="h28" variant="outline" onClick={() => setPreviewOpen(true)}>미리 보기</Button>
        <Button size="h28" variant="outline" onClick={onCancel}>취소</Button>
        <Button size="h28" variant="blue" onClick={handleSave}>서식 저장</Button>
      </footer>

      <FormPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        templateData={editor ? JSON.stringify(editor.getJSON()) : undefined}
        title={title}
      />
    </div>
  );
};

/** 툴바 */
const EditorToolbar = ({ editor }: { editor: NonNullable<ReturnType<typeof useEditor>> }) => {
  const ToolBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      className={`flex size-8 items-center justify-center rounded transition-colors ${active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="mx-0.5 h-5 w-px bg-border" />;

  return (
    <div className="flex shrink-0 items-center gap-0.5 border-b bg-background px-3 py-1">
      <ToolBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Icons.Bold className="size-4" />
      </ToolBtn>
      <ToolBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Icons.Italic className="size-4" />
      </ToolBtn>
      <ToolBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <Icons.Underline className="size-4" />
      </ToolBtn>
      <ToolBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Icons.Strikethrough className="size-4" />
      </ToolBtn>

      <Divider />

      <ToolBtn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <Icons.AlignLeft className="size-4" />
      </ToolBtn>
      <ToolBtn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <Icons.AlignCenter className="size-4" />
      </ToolBtn>
      <ToolBtn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        <Icons.AlignRight className="size-4" />
      </ToolBtn>

      <Divider />

      <ToolBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <Icons.List className="size-4" />
      </ToolBtn>
      <ToolBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <Icons.ListOrdered className="size-4" />
      </ToolBtn>

      <Divider />

      <ToolBtn active={false} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
        <Icons.Table className="size-4" />
      </ToolBtn>
      {editor.isActive("table") && (
        <ToolBtn active={false} onClick={() => editor.chain().focus().deleteTable().run()}>
          <Icons.Trash2 className="size-4" />
        </ToolBtn>
      )}
      <ToolBtn active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Icons.Minus className="size-4" />
      </ToolBtn>
    </div>
  );
};

export default FormEditor;
