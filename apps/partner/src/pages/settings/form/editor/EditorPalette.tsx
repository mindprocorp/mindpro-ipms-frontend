import { Icons } from "@repo/ui";
import type { Editor } from "@tiptap/react";

const COMPONENTS = [
  { type: "text", label: "텍스트", icon: Icons.Type },
  { type: "multiText", label: "멀티 텍스트", icon: Icons.AlignLeft },
  { type: "select", label: "셀렉트 박스", icon: Icons.ChevronDown },
  { type: "multiSelect", label: "멀티 셀렉트", icon: Icons.ListChecks },
  { type: "table", label: "테이블", icon: Icons.Table },
  { type: "calcTable", label: "수식 테이블", icon: Icons.Calculator },
  { type: "checkbox", label: "체크 박스", icon: Icons.CheckSquare },
  { type: "radio", label: "라디오 버튼", icon: Icons.Circle },
  { type: "time", label: "시간(단일)", icon: Icons.Clock },
  { type: "timeRange", label: "시간(범위)", icon: Icons.Timer },
  { type: "date", label: "날짜(단일)", icon: Icons.Calendar },
  { type: "dateRange", label: "날짜(범위)", icon: Icons.CalendarRange },
  { type: "file", label: "파일 첨부", icon: Icons.Paperclip },
  { type: "notice", label: "안내 문구", icon: Icons.MessageSquare },
  { type: "image", label: "이미지", icon: Icons.Image },
  { type: "label", label: "레이블", icon: Icons.Tag },
  { type: "signature", label: "서명", icon: Icons.PenTool },
  { type: "stamp", label: "직인", icon: Icons.Stamp },
] as const;

interface Props {
  editor: Editor | null;
}

const EditorPalette = ({ editor }: Props) => {
  const handleInsert = (type: string, label: string) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "formBlock",
        attrs: { blockType: type, blockLabel: label, name: label },
      })
      .run();
  };

  return (
    <div className="w-[240px] shrink-0 overflow-auto border-r bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold">기본 컴포넌트</span>
      </div>
      <div className="p-3">
        <p className="text-muted-foreground mb-3 text-[11px]">클릭하면 에디터에 추가됩니다.</p>
        <div className="grid grid-cols-2 gap-1.5">
          {COMPONENTS.map((comp) => {
            const Icon = comp.icon;
            return (
              <button
                key={comp.type}
                type="button"
                className="hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/15 dark:hover:border-blue-400/50 flex flex-col items-center gap-1 rounded-md border border-border px-2 py-2.5 text-center transition-all hover:shadow-sm active:scale-95"
                onClick={() => handleInsert(comp.type, comp.label)}
              >
                <Icon className="size-4 text-muted-foreground" />
                <span className="text-[10px] leading-tight text-gray-600">{comp.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditorPalette;
