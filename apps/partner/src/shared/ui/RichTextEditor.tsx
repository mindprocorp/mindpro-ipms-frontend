import { useEditor, EditorContent, Editor, useEditorState } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { Image } from "@tiptap/extension-image";
import { Icons } from "@repo/ui";
import { useEffect, useRef } from "react";
import { useAlertStore } from "@shared/store/useAlertStore";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  header?: React.ReactNode; // 상단에 첨부파일 리스트 등을 넣을 수 있는 공간
  onFilesDrop?: (files: FileList) => void; // 파일 드롭 핸들러
}

/**
 * 툴바 컴포넌트
 */
const EditorToolbar = ({ editor }: { editor: Editor }) => {
  const { openAlert } = useAlertStore();
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      bold: ctx.editor.isActive("bold"),
      italic: ctx.editor.isActive("italic"),
      underline: ctx.editor.isActive("underline"),
      strike: ctx.editor.isActive("strike"),
      alignLeft: ctx.editor.isActive({ textAlign: "left" }),
      alignCenter: ctx.editor.isActive({ textAlign: "center" }),
      alignRight: ctx.editor.isActive({ textAlign: "right" }),
      bulletList: ctx.editor.isActive("bulletList"),
      orderedList: ctx.editor.isActive("orderedList"),
    }),
  });

  const ToolBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      className={`flex size-8 items-center justify-center rounded transition-colors ${
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="mx-1 h-5 w-px bg-border" />;

  return (
    <div className="flex shrink-0 flex-col border-b border-border bg-card rounded-t-lg">
      {/* 주 툴바 */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border">
        <ToolBtn active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Icons.Bold className="size-4" />
        </ToolBtn>
        <ToolBtn active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Icons.Italic className="size-4" />
        </ToolBtn>
        <ToolBtn active={state.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <Icons.Underline className="size-4" />
        </ToolBtn>
        <ToolBtn active={state.strike} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Icons.Strikethrough className="size-4" />
        </ToolBtn>

        <Divider />

        <ToolBtn active={state.alignLeft} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <Icons.AlignLeft className="size-4" />
        </ToolBtn>
        <ToolBtn active={state.alignCenter} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <Icons.AlignCenter className="size-4" />
        </ToolBtn>
        <ToolBtn active={state.alignRight} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <Icons.AlignRight className="size-4" />
        </ToolBtn>

        <Divider />

        <ToolBtn active={state.bulletList} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <Icons.List className="size-4" />
        </ToolBtn>
        <ToolBtn active={state.orderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <Icons.ListOrdered className="size-4" />
        </ToolBtn>

      </div>

      {/* 보조 툴바 (이미지 반영) */}
      <div className="flex items-center gap-4 px-4 py-2 text-[13px] text-muted-foreground bg-muted/30">
        <button type="button" className="flex items-center gap-1.5 hover:text-foreground" onClick={() => (document.getElementById('fileUpload') as HTMLInputElement)?.click()}>
          <Icons.Paperclip className="size-3.5" />
          파일첨부
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 hover:text-foreground"
          onClick={() => (document.getElementById('imageUpload') as HTMLInputElement)?.click()}
        >
          <Icons.Image className="size-3.5" />
          이미지
        </button>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (!file.type.startsWith("image/")) {
                openAlert({ message: "이미지 파일만 업로드 할 수 있습니다.", showCancel: false });
              } else {
                insertImageFromFile(editor, file);
              }
            }
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
};

const insertImageFromFile = (editor: Editor, file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target?.result as string;
    editor.chain().focus().setImage({ src }).run();
  };
  reader.readAsDataURL(file);
};

/**
 * 범용 리치 텍스트 에디터 (위지윅)
 */
export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "내용을 입력하세요...",
  minHeight = "400px",
  header, // 상단 첨부파일 영역
  onFilesDrop
}: Props) => {
  const editorRef = useRef<Editor | null>(null);
  const editor = useEditor({
    editorProps: {
      attributes: {
        style: "font-synthesis: style",
      },
    },
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline.configure({ HTMLAttributes: {} }),
      Image.configure({ allowBase64: true, HTMLAttributes: { style: "max-width: 100%; height: auto;" } }),
    ],
    content: value,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  // 외부(상위)에서 value 값이 주입/변경되었을 때 동기화 (초기 진입 시 주로 사용)
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // 붙여넣기: 이미지는 본문 삽입, 나머지는 기본 처리
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const ed = editorRef.current;
      if (!ed) return;
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageItem = items.find((item) => item.type.startsWith("image/"));
      if (!imageItem) return;
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) insertImageFromFile(ed, file);
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  if (!editor) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const otherFiles = files.filter((f) => !f.type.startsWith("image/"));
    imageFiles.forEach((f) => insertImageFromFile(editor, f));
    if (otherFiles.length && onFilesDrop) {
      const dt = new DataTransfer();
      otherFiles.forEach((f) => dt.items.add(f));
      onFilesDrop(dt.files);
    }
  };

  return (
    <div
      className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <EditorToolbar editor={editor} />

      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-4" style={{ minHeight }}>
        {/* 상단 파일 영역 (이미지 스타일 박스) */}
        {header && (
          <div className="mb-6">
            {header}
          </div>
        )}

        <div
          className="flex-1 w-full max-w-none prose prose-sm prose-slate dark:prose-invert prose-img:rounded-md focus:outline-none cursor-text"
          onClick={() => editor.commands.focus()}
        >
          <EditorContent editor={editor} className="[&_.ProseMirror]:outline-none min-h-full" />
        </div>
      </div>
    </div>
  );
};
