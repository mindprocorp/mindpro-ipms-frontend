import { zodResolver } from "@hookform/resolvers/zod";
import { TestSchema, type TestFormInput } from "@pages/pub/schema";
import type { ModalProps } from "@repo/schema";
import {
  Button,
  FormDialog,
  Icons,
  RHF,
  DndProvider,
  SortableList,
  SortableItem,
  DragHandle,
  Separator,
} from "@repo/ui";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

type ApproveStepType = {};

const datas = Array.from({ length: 3 }).map((item, index) => ({
  id: `m5gr84i9-${index}`,
  nameKo: `한글이름-${index}`,
  nameEn: `영문이름-${index}`,
  cusNum: `고객번호-${index}`,
  rate: `지분율-${index}`,
  note: `비고-${index}`,
  seq: index,
}));

export const AddApproveTemplate = ({ open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    // onSuccess?.();
  };

  const [data, setData] = useState(datas);

  return (
    <FormProvider {...form}>
      <FormDialog
        title="결제선  템플릿 추가"
        onSubmit={onSubmit}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-200!"
      >
        <div className="flex flex-col gap-2">
          <RHF.Input control={form.control} name="testVal" />
          <div className="flex items-center">
            <Button variant="green" size="h24" className="">
              <Icons.Plus />
              결제선 추가
            </Button>
            <RHF.FormSelect
              control={form.control}
              name="testVal"
              items={[
                {
                  value: "next.js",
                  label: "Next.js",
                },
                {
                  value: "sveltekit",
                  label: "SvelteKit",
                },
              ]}
              // label="입금방법"
              placeholder="결제선 템플릿 불러오기"
              className="ml-auto w-100"
            />
          </div>
        </div>

        <Separator className="my-4 border-t" />

        <div data-slot="drapable-wrap" className="flex flex-col gap-2">
          <DndProvider setData={setData}>
            <SortableList
              onChange={() => {}}
              items={data}
              getId={(row) => row.id}
              renderItem={(row, { id }) => {
                return (
                  <SortableItem key={id} id={id}>
                    {({ setNodeRef, attributes, listeners, style }) => (
                      <div
                        className="bg-background flex items-center gap-0"
                        id={id}
                        key={row.id}
                        ref={setNodeRef}
                        style={style}
                        {...attributes}
                      >
                        <DragHandle listeners={listeners} className="w-auto">
                          <Icons.GripVertical className="size-3" />
                        </DragHandle>
                        <div className="border-border-200 flex-1 overflow-hidden rounded-sm border">
                          <div className="bg-bg-100 border-border-100 flex gap-1 border-b p-1">
                            <RHF.FormSelect
                              control={form.control}
                              name="testVal"
                              items={[
                                {
                                  value: "next.js",
                                  label: "결재",
                                },
                                {
                                  value: "sveltekit",
                                  label: "합의",
                                },
                              ]}
                              // label="입금방법"
                              placeholder="선택"
                              size="h24"
                              className="w-40"
                            />
                            <Button size="h24" className="">
                              <Icons.UserPlus className="size-3" />
                              결재자 추가
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 p-3">
                            <div className="border-p-color-1 bg-p-color-1/5 text-p-color-1 flex items-center overflow-hidden rounded-full border pl-2 text-xs capitalize">
                              asds
                              <Button variant="ghost" className="h-4 w-4">
                                <Icons.X className="size-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </SortableItem>
                );
              }}
            />
          </DndProvider>
        </div>
      </FormDialog>
    </FormProvider>
  );
};
