import { Button, Icons } from "@repo/ui";
import React from "react";
import { useState } from "react";

const TeamTree = ({
  group,
  space = 0,
  setCode,
  activeCode,
}: {
  group?: any;
  space?: number;
  activeCode: string;
  setCode: (code: string) => void;
}) => {
  const [active, setActive] = useState(false);
  const style = { "--space": space } as React.CSSProperties;

  const handleActive = (code: string) => {
    setCode(code);
    setActive(!active);
  };

  if (!group.items || !group.items.length) {
    return (
      <Button
        style={style}
        variant="ghost"
        className="data-[selected=true]:bg-p-color-1/10 data-[selected=true]:[&>span]:text-p-color-1 dark:data-[selected=true]:bg-p-color-1 block w-full text-left text-xs [&_span]:pl-[calc(var(--space)*16px)] dark:data-[selected=true]:[&>span]:text-white"
        data-active={active}
        data-selected={group.code === activeCode}
        onClick={() => handleActive(group.code)}
      >
        <span className="flex items-center gap-1">
          <Icons.Dot className="size-4" />
          {group.title}
          {group.code}
        </span>
      </Button>
    );
  }

  return (
    <div className="text-xs">
      <Button
        variant="ghost"
        style={style}
        // className="data-[active=true]:bg-p-color-1 w-full justify-start gap-1 [&_span]:pl-[calc(var(--space)*16px)] [&+div]:hidden data-[active=true]:[&+div]:block data-[active=true]:[&>span]:text-white"
        className="data-[selected=true]:bg-p-color-1/10 data-[selected=true]:[&>span]:text-p-color-1 dark:data-[selected=true]:bg-p-color-1 w-full justify-start gap-1 [&_span]:pl-[calc(var(--space)*16px)] [&+div]:hidden data-[active=true]:[&+div]:block dark:data-[selected=true]:[&>span]:text-white"
        data-active={active}
        data-selected={group.code === activeCode}
        onClick={() => handleActive(group.code)}
      >
        <span className="flex items-center gap-1">
          <Icons.Users className="size-4" />
          {group.title}
          {group.code}
        </span>
      </Button>
      <div style={style} className="[&_span]:pl-[calc(var(--space)*16px)]">
        {group.items.map((item: any, index: number) => {
          return (
            <TeamTree
              key={group.code + "_" + index}
              group={item}
              space={space + 1}
              setCode={setCode}
              activeCode={activeCode}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TeamTree;
