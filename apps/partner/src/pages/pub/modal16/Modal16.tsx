import { TestSchema, type TestFormInput } from "../schema";
import { Button, CustomScrollArea, FormDialog, Icons } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMembers } from "./model/useMembers";
import { MemberSearchBox, NameTag, NameTagCheck } from "./name-tag/NameTag";
import { useEffect, useState } from "react";

export const Modal16 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    onSuccess?.(undefined);
  };

  const receiveAndRefObject = {
    receive: [],
    reference: [],
    hiddenRef: [],
  };

  const { check, member, selectHandle, memFind, singleSelectHandle, clearCheck } = useMembers();
  const [addVariables, setAddVariables] = useState<any>({ ...receiveAndRefObject });
  const [clearVariables, setClearVariables] = useState<string[]>([]);
  const [allReceive, setAllReceive] = useState<string[]>([]);

  const addData = member.filter((mem) => check.some((item) => mem.name === item));
  const HandleAddVariable = (mappingKey: string) => {
    setAddVariables((prev) => ({ ...prev, [mappingKey]: [...prev[mappingKey], ...addData] }));
  };

  const HandleClearAdd = (e: React.MouseEvent<HTMLDivElement>, name: string) => {
    setClearVariables((prev) => {
      if (prev.includes(name)) {
        return prev.filter((item) => item !== name);
      }
      return [...prev, name];
    });
    e.preventDefault();
    e.stopPropagation();
  };

  const HandleClearItems = (
    e: React.MouseEvent<HTMLButtonElement>,
    mappingKey: string,
    name?: string,
  ) => {
    const clearItems = typeof name === "string" ? [name] : clearVariables;
    setClearVariables((prev) => {
      return prev.filter((v) => !clearItems.some((s) => v === s));
    });

    setAddVariables((prev) => ({
      ...prev,
      [mappingKey]: prev[mappingKey].filter((v) => !clearItems.some((s) => v.name === s)),
    }));
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const names = Object.values(addVariables)
      .filter(Array.isArray)
      .flat()
      .map((item) => item.name);
    setAllReceive(names);
    clearCheck();
  }, [addVariables]);

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="확인"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-250!"
        bodyFull
      >
        <div className="border-border-100 dark:border-input flex border-y">
          <CustomScrollArea className="h-100 w-70 shrink-0">
            <div className="flex-1">
              <div className="border-border-100 dark:border-input flex justify-between border-b p-2">
                <MemberSearchBox memFind={memFind} />
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
                        checked={allReceive.includes(item.name) || check.includes(item.name)}
                        disabled={allReceive.includes(item.name)}
                      ></NameTagCheck>
                    </div>
                  );
                })}
              </div>
            </div>
          </CustomScrollArea>

          <div className="border-border-100 dark:border-input w-full border-l">
            <GroupBlock
              title="수신인"
              items={addVariables["receive"]}
              mappingKey="receive"
              clearItems={clearVariables}
              HandleAddVariable={HandleAddVariable}
              HandleClearItems={HandleClearItems}
              HandleClearAdd={HandleClearAdd}
            />

            <GroupBlock
              title="참조인"
              items={addVariables["reference"]}
              mappingKey="reference"
              clearItems={clearVariables}
              HandleAddVariable={HandleAddVariable}
              HandleClearItems={HandleClearItems}
              HandleClearAdd={HandleClearAdd}
            />

            <GroupBlock
              title="숨은 참조인 "
              items={addVariables["hiddenRef"]}
              mappingKey="hiddenRef"
              clearItems={clearVariables}
              HandleAddVariable={HandleAddVariable}
              HandleClearItems={HandleClearItems}
              HandleClearAdd={HandleClearAdd}
            />
          </div>
        </div>
      </FormDialog>
    </FormProvider>
  );
};

type Props = {
  title: string;
  mappingKey: string;
  items: any[];
  clearItems: any[];
  HandleAddVariable: (mappingKey: string) => void;
  HandleClearItems: (
    e: React.MouseEvent<HTMLButtonElement>,
    mappingKey: string,
    name?: string,
  ) => void;
  HandleClearAdd: (e: React.MouseEvent<HTMLDivElement>, name: string) => void;
};
const GroupBlock = ({
  title,
  items,
  mappingKey,
  clearItems,
  HandleAddVariable,
  HandleClearItems,
  HandleClearAdd,
}: Props) => {
  const isExclude = items.filter((item) => clearItems.some((v) => item.name === v)).length;
  return (
    <div className="group/block">
      <h2 className="bg-bg-100 border-border-100 dark:bg-background-color dark:border-input border-b p-2 text-xs font-semibold">
        {title}
      </h2>
      <div className="flex gap-1 p-3">
        <div className="flex flex-col gap-1 p-2">
          <Button size="h24" variant="outline-blue" onClick={() => HandleAddVariable(mappingKey)}>
            추가
            <Icons.ChevronRight />
          </Button>
          <Button size="h24" onClick={(e) => HandleClearItems(e, mappingKey)} disabled={!isExclude}>
            <Icons.ChevronLeft />
            제외
          </Button>
        </div>
        <CustomScrollArea className="h-20 w-full">
          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              return (
                <div
                  data-selected={clearItems.includes(item.name)}
                  onClick={(e) => HandleClearAdd(e, item.name)}
                  className="data-[selected=true]:border-p-color-1 border-border-100 rounded-[4px] border pl-2 text-xs"
                >
                  {item.name}
                  {item.mail}
                  <Button
                    size="h24"
                    variant="ghost"
                    onClick={(e) => HandleClearItems(e, mappingKey, item.name)}
                  >
                    <Icons.X />
                  </Button>
                </div>
              );
            })}
          </div>
        </CustomScrollArea>
      </div>
    </div>
  );
};
