import { type CSSProperties, useState } from "react";
import { Button, Icons } from "@repo/ui";

interface TreeMenuNode {
  title: string;
  code: string;
  items?: TreeMenuNode[];
}

const TeamTree = ({
  group,
  space = 0,
  setCode,
  activeCode,
}: {
  group: TreeMenuNode;
  space?: number;
  activeCode: string;
  setCode: (code: string) => void;
}) => {
  const [open, setOpen] = useState(true);
  const style = { "--space": space } as CSSProperties;
  const hasChildren = group.items && group.items.length > 0;

  if (!hasChildren) {
    return (
      <Button
        style={style}
        variant="ghost"
        className="data-[selected=true]:bg-p-color-1/10 data-[selected=true]:[&>span]:text-p-color-1 block w-full text-left text-xs [&_span]:pl-[calc(var(--space)*16px)]"
        data-selected={group.code === activeCode}
        onClick={() => setCode(group.code)}
      >
        <span className="flex items-center gap-1">
          <Icons.Dot className="size-4" />
          {group.title}
        </span>
      </Button>
    );
  }

  return (
    <div className="text-xs">
      <div
        style={style}
        className="data-[selected=true]:bg-p-color-1/10 flex items-center [&_span]:pl-[calc(var(--space)*16px)]"
        data-selected={group.code === activeCode}
      >
        <Button
          variant="ghost"
          className="data-[selected=true]:[&>span]:text-p-color-1 flex-1 justify-start gap-1"
          data-selected={group.code === activeCode}
          onClick={() => setCode(group.code)}
        >
          <span className="flex items-center gap-1">
            <Icons.Users className="size-4" />
            {group.title}
          </span>
        </Button>
        <button
          type="button"
          className="shrink-0 cursor-pointer p-1"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Icons.ChevronDown className={`text-muted-foreground size-3.5 transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
      </div>
      {open && (
        <div style={style} className="[&_span]:pl-[calc(var(--space)*16px)]">
          {group.items.map((item: TreeMenuNode, index: number) => (
            <TeamTree
              key={group.code + "_" + index}
              group={item}
              space={space + 1}
              setCode={setCode}
              activeCode={activeCode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamTree;
