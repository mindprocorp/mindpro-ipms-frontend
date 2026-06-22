import {
  FormDialog,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Icons,
  CustomScrollArea,
} from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { MemberSearchBox, NameTag, NameTagCheck } from "./name-tag/NameTag.tsx";
import { useMembers } from "./model/useMembers.ts";
import TeamTree from "./TeamTree.tsx";
import { useState } from "react";

const menus = [
  {
    title: "서비스 사업부",
    url: "#",
    code: "111",
    items: [
      {
        title: "기획팀",
        url: "#",
        code: "a",
      },
      {
        title: "보안팀",
        url: "#",
        code: "b",
      },
      {
        title: "개발팀",
        url: "#",
        code: "c",
      },
    ],
  },
  {
    title: "UI/UX 사업부",
    url: "#",
    code: "222",
    items: [],
  },
  {
    title: "웹개발팀",
    url: "#",
    code: "333",
    items: [
      {
        title: "본부",
        url: "#",
        code: "aa",
        items: [
          {
            title: "본부111",
            url: "#",
            code: "aaa",
            items: [
              {
                title: "본부111",
                url: "#",
                code: "aaaa",
              },
              {
                title: "연구소111",
                url: "#",
                code: "bb",
                items: [
                  {
                    title: "본부111",
                    url: "#",
                    code: "bb1",
                  },
                  {
                    title: "연구소111",
                    url: "#",
                    code: "bb2",
                  },
                  {
                    title: "운영1111",
                    url: "#",
                    code: "bb3",
                  },
                ],
              },
              {
                title: "운영1111",
                url: "#",
                code: "bbbb",
              },
            ],
          },
          {
            title: "연구소111",
            url: "#",
            code: "bbcc",
          },
          {
            title: "운영1111",
            url: "#",
            code: "cccc",
          },
        ],
      },
      {
        title: "연구소",
        url: "#",
        code: "444",
      },
      {
        title: "운영",
        url: "#",
        code: "555",
      },
    ],
  },
];

export const OrganizationPopup = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const { check, member, selectHandle, memFind } = useMembers();
  const [code, setCode] = useState("");
  return (
    <FormDialog
      title={title}
      onSubmit={() => {}}
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-180!"
      bodyFull
    >
      <div className="border-border-100 flex border-y">
        <CustomScrollArea className="border-border-100 h-100 border-r">
          <div className="w-50 p-2">
            {menus.map((item, index) => {
              return (
                <TeamTree
                  key={item.code + "_" + index}
                  group={item}
                  setCode={setCode}
                  activeCode={code}
                />
              );
            })}
          </div>
        </CustomScrollArea>

        <CustomScrollArea className="h-100 w-full">
          <div className="flex-1">
            <div className="border-border-100 bg-bg-100 flex justify-between border-b p-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">UI/UX 사업부</h2>
                <span className="text-text-200 text-xs">총 10명</span>
              </div>

              <MemberSearchBox memFind={memFind} className="w-50" />
            </div>
            <div className="p-2">
              {member.map((item, index) => {
                return (
                  <div className="flex gap-2" key={crypto.randomUUID()}>
                    <NameTagCheck
                      name={item.name}
                      position={item.position}
                      team={item.team}
                      head={item.head}
                      onSelect={() => selectHandle(item.name)}
                      checked={check.includes(item.name)}
                    >
                      <span className="text-text-200 flex-1 text-xs">010-1234-5678</span>
                      <span className="text-text-200 flex-1 text-xs">hong@gmail.com</span>
                    </NameTagCheck>
                  </div>
                );
              })}
            </div>
          </div>
        </CustomScrollArea>
      </div>
    </FormDialog>
  );
};
