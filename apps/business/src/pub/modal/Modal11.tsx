import { zodResolver } from "@hookform/resolvers/zod";
import {
  AvatarWrap,
  BaseLabel,
  Button,
  CustomTooltip,
  FlexBox,
  FormDialog,
  Icons,
  RHF,
  Separator,
} from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { Tag } from "@shared/tag/Tag";
import { Table01 } from "pub/form-use-table-block/Table01";
import { Table02 } from "pub/form-use-table-block/Table02";
import { Table03 } from "pub/form-use-table-block/Table03";
import { Table04 } from "pub/form-use-table-block/Table04";
import { Table05 } from "pub/form-use-table-block/Table05";
import { Table06 } from "pub/form-use-table-block/Table06";
import { Table07 } from "pub/form-use-table-block/Table07";
import { Table08 } from "pub/form-use-table-block/Table08";

import User from "@repo/assets/images/user.png";
import { Table09 } from "pub/form-use-table-block/Table09";
import { Table10 } from "pub/form-use-table-block/Table10";
import { Table11 } from "pub/form-use-table-block/Table11";

type ModalProps = {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: any) => void;
};

const TestSchema = z.object({
  val1: z.string().default(""),
  val2: z.string().min(1, { message: "sdf" }).default(""),
  val3: z.string().default(""),
});

type TestInput = z.input<typeof TestSchema>;
type TestOutput = z.input<typeof TestSchema>;

export const Modal11 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });

  const onSubmit = (values: TestInput) => {
    const resultValue: TestOutput = TestSchema.parse(values);
    form.reset();
    onOpenChange(false);
    onSuccess?.(resultValue);
  };

  useEffect(() => {
    form.setValue("val1", "test1");
  }, []);

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={form.handleSubmit(onSubmit)}
        open={open}
        onOpenChange={onOpenChange}
        submitText="저장"
        className="max-w-3/6!"
        // extraFooter={
        //   <Button variant="default" className="mr-auto" size="h32">
        //     선택취소
        //   </Button>
        // }
        bodyFull
      >
        <form className="h-[calc(100vh-300px)] min-w-0 space-y-2 overflow-auto px-6 py-4">
          <div className="">
            <div className="space-y-4">
              <FlexBox className="gap-5">
                <RHF.Input
                  control={form.control}
                  name="val1"
                  label="PLM No."
                  inputDisabled
                  actions={
                    <Button>
                      <Icons.Search />
                    </Button>
                  }
                />
                <RHF.Input control={form.control} name="val1" label="개발유형" ess />
              </FlexBox>

              <FlexBox className="gap-5">
                <RHF.FormSelect
                  control={form.control}
                  name="val1"
                  items={[
                    {
                      value: "test1",
                      label: "테스트 라벨1",
                    },
                    {
                      value: "test2",
                      label: "테스트 라벨2",
                    },
                  ]}
                  label="개발난이도"
                  ess
                />

                <RHF.FormSelect
                  control={form.control}
                  name="val1"
                  items={[
                    {
                      value: "test1",
                      label: "테스트 라벨1",
                    },
                    {
                      value: "test2",
                      label: "테스트 라벨2",
                    },
                  ]}
                  label="제품개발단계"
                  ess
                />
              </FlexBox>

              <RHF.Input control={form.control} name="val1" label="타이틀" ess />

              <FlexBox className="gap-5">
                <RHF.Input
                  control={form.control}
                  name="val1"
                  label="PM정보"
                  actions={
                    <Button>
                      <Icons.Network />
                    </Button>
                  }
                />

                <RHF.FormSelect
                  control={form.control}
                  name="val1"
                  items={[
                    {
                      value: "test1",
                      label: "테스트 라벨1",
                    },
                    {
                      value: "test2",
                      label: "테스트 라벨2",
                    },
                  ]}
                  label="예상지분구조"
                  ess
                />
              </FlexBox>

              <FlexBox className="gap-5">
                <RHF.FormDateFromToPicker
                  control={form.control}
                  name={[`testVal`, `testVal`]}
                  label="계획기간/개월"
                  ess
                />

                <RHF.FormDateFromToPicker
                  control={form.control}
                  name={[`testVal`, `testVal`]}
                  label="실제기간/개월"
                />
              </FlexBox>

              {/* 지분비율 */}
              <Table07 />

              {/* 년도별 투자실적 */}
              <Table08 />

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="구성원 등록" />
                </div>
                <div className="flex flex-col gap-2">
                  {/* PM */}
                  <div className="bg-bg-100 border-border-100 gap-2 overflow-hidden rounded-[4px] border">
                    <div className="bg-background border-border-100 flex items-center justify-between border-b p-2">
                      <h2 className="text-sm font-semibold">PM</h2>
                    </div>

                    <div className="flex flex-wrap gap-1 p-3">
                      <div className="bg-background border-input relative flex items-center gap-2 rounded-[4px] border px-2 py-1">
                        <AvatarWrap img={User} />
                        <div className="flex flex-1 justify-between gap-2">
                          <div className="text-left text-xs">
                            <p className="font-semibold">홍길동</p>
                            <p className="text-text-200 text-[10px]">웹개발팀 / 대리</p>
                          </div>
                        </div>
                        <Button variant="ghost" className="h-6 w-6 p-0">
                          <Icons.CircleX />
                        </Button>
                      </div>
                      <CustomTooltip message="추가">
                        <Button
                          variant="outline-blue"
                          size="h24"
                          className="group bg-bg-50 relative h-auto w-10 border-dashed opacity-50 hover:opacity-100"
                        >
                          <Icons.Plus className="size-4 duration-300 group-hover:rotate-180" />
                        </Button>
                      </CustomTooltip>
                    </div>
                  </div>

                  {/* QA */}
                  <div className="bg-bg-100 border-border-100 gap-2 overflow-hidden rounded-[4px] border">
                    <div className="bg-background border-border-100 flex items-center justify-between border-b p-2">
                      <h2 className="text-sm font-semibold">QA</h2>
                    </div>

                    <div className="flex flex-wrap gap-1 p-3">
                      <div className="bg-background border-input relative flex items-center gap-2 rounded-[4px] border px-2 py-1">
                        <AvatarWrap img={User} />
                        <div className="flex flex-1 justify-between gap-2">
                          <div className="text-left text-xs">
                            <p className="font-semibold">홍길동</p>
                            <p className="text-text-200 text-[10px]">웹개발팀 / 대리</p>
                          </div>
                        </div>
                        <Button variant="ghost" className="h-6 w-6 p-0">
                          <Icons.CircleX />
                        </Button>
                      </div>
                      <CustomTooltip message="추가">
                        <Button
                          variant="outline-blue"
                          size="h24"
                          className="group bg-bg-50 relative h-auto w-10 border-dashed opacity-50 hover:opacity-100"
                        >
                          <Icons.Plus className="size-4 duration-300 group-hover:rotate-180" />
                        </Button>
                      </CustomTooltip>
                    </div>
                  </div>

                  {/* CM */}
                  <div className="bg-bg-100 border-border-100 gap-2 overflow-hidden rounded-[4px] border">
                    <div className="bg-background border-border-100 flex items-center justify-between border-b p-2">
                      <h2 className="text-sm font-semibold">CM</h2>
                    </div>

                    <div className="flex flex-wrap gap-1 p-3">
                      <div className="bg-background border-input relative flex items-center gap-2 rounded-[4px] border px-2 py-1">
                        <AvatarWrap img={User} />
                        <div className="flex flex-1 justify-between gap-2">
                          <div className="text-left text-xs">
                            <p className="font-semibold">홍길동</p>
                            <p className="text-text-200 text-[10px]">웹개발팀 / 대리</p>
                          </div>
                        </div>
                        <Button variant="ghost" className="h-6 w-6 p-0">
                          <Icons.CircleX />
                        </Button>
                      </div>
                      <CustomTooltip message="추가">
                        <Button
                          variant="outline-blue"
                          size="h24"
                          className="group bg-bg-50 relative h-auto w-10 border-dashed opacity-50 hover:opacity-100"
                        >
                          <Icons.Plus className="size-4 duration-300 group-hover:rotate-180" />
                        </Button>
                      </CustomTooltip>
                    </div>
                  </div>

                  {/* 나머지 구성원 */}
                  <div className="bg-bg-100 border-border-100 gap-2 overflow-hidden rounded-[4px] border">
                    <div className="bg-background border-border-100 flex items-center justify-between border-b p-2">
                      <h2 className="text-sm font-semibold">나머지 구성원</h2>
                    </div>

                    <div className="flex flex-wrap gap-1 p-3">
                      <div className="bg-background border-input relative flex items-center gap-2 rounded-[4px] border px-2 py-1">
                        <AvatarWrap img={User} />
                        <div className="flex flex-1 justify-between gap-2">
                          <div className="text-left text-xs">
                            <p className="font-semibold">홍길동</p>
                            <p className="text-text-200 text-[10px]">웹개발팀 / 대리</p>
                          </div>
                        </div>
                        <Button variant="ghost" className="h-6 w-6 p-0">
                          <Icons.CircleX />
                        </Button>
                      </div>
                      <CustomTooltip message="추가">
                        <Button
                          variant="outline-blue"
                          size="h24"
                          className="group bg-bg-50 relative h-auto w-10 border-dashed opacity-50 hover:opacity-100"
                        >
                          <Icons.Plus className="size-4 duration-300 group-hover:rotate-180" />
                        </Button>
                      </CustomTooltip>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="적용분야" ess />
                  <div className="flex gap-1">
                    <Button variant="outline-blue" size="h24" className="">
                      <Icons.Plus />
                      추가
                    </Button>

                    <Button size="h24" className="">
                      <Icons.Plus />
                      전체삭제
                    </Button>
                  </div>
                </div>
                <div className="border-border-100 bg-bg-100 flex flex-wrap gap-1 rounded-[4px] border p-3">
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="적용부품" ess />
                  <div className="flex gap-1">
                    <Button variant="outline-blue" size="h24" className="">
                      <Icons.Plus />
                      추가
                    </Button>

                    <Button size="h24" className="">
                      <Icons.Plus />
                      전체삭제
                    </Button>
                  </div>
                </div>
                <div className="border-border-100 bg-bg-100 flex flex-wrap gap-1 rounded-[4px] border p-3">
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="적용예상차종" ess />
                  <div className="flex gap-1">
                    <Button variant="outline-blue" size="h24" className="">
                      <Icons.Plus />
                      추가
                    </Button>

                    <Button size="h24" className="">
                      <Icons.Plus />
                      전체삭제
                    </Button>
                  </div>
                </div>
                <div className="border-border-100 bg-bg-100 flex flex-wrap gap-1 rounded-[4px] border p-3">
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="적용예상차종 구동연료" ess />
                  <div className="flex gap-1">
                    <Button variant="outline-blue" size="h24" className="">
                      <Icons.Plus />
                      추가
                    </Button>

                    <Button size="h24" className="">
                      <Icons.Plus />
                      전체삭제
                    </Button>
                  </div>
                </div>
                <div className="border-border-100 bg-bg-100 flex flex-wrap gap-1 rounded-[4px] border p-3">
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="주요예상 국내고객" ess />
                  <div className="flex gap-1">
                    <Button variant="outline-blue" size="h24" className="">
                      <Icons.Plus />
                      추가
                    </Button>

                    <Button size="h24" className="">
                      <Icons.Plus />
                      전체삭제
                    </Button>
                  </div>
                </div>
                <div className="border-border-100 bg-bg-100 flex flex-wrap gap-1 rounded-[4px] border p-3">
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="주요예상 해외고객" ess />
                  <div className="flex gap-1">
                    <Button variant="outline-blue" size="h24" className="">
                      <Icons.Plus />
                      추가
                    </Button>

                    <Button size="h24" className="">
                      <Icons.Plus />
                      전체삭제
                    </Button>
                  </div>
                </div>
                <div className="border-border-100 bg-bg-100 flex flex-wrap gap-1 rounded-[4px] border p-3">
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                </div>
              </div>

              <FlexBox className="gap-5">
                <RHF.FormSelect
                  control={form.control}
                  name="val1"
                  items={[
                    {
                      value: "test1",
                      label: "테스트 라벨1",
                    },
                    {
                      value: "test2",
                      label: "테스트 라벨2",
                    },
                  ]}
                  label="적용모델 국내"
                  ess
                />

                <RHF.FormSelect
                  control={form.control}
                  name="val1"
                  items={[
                    {
                      value: "test1",
                      label: "테스트 라벨1",
                    },
                    {
                      value: "test2",
                      label: "테스트 라벨2",
                    },
                  ]}
                  label="적용모델 해외"
                  ess
                />
              </FlexBox>

              {/* 고객사별 투자실적 */}
              <Table09 />

              {/* 고객사별 예상매출 */}
              <Table10 form={form} />

              {/* 연도별 예상매출 */}
              <Table11 />
            </div>
          </div>

          <Separator className="mt-4 border-t" />

          <div>
            <div className="border-border-100 mt-5 mb-5 border-b pb-3">
              <h2 className="font-semibold">경쟁사 정보</h2>
            </div>
            <div className="space-y-4">
              <FlexBox className="gap-5">
                <RHF.FormSelect
                  control={form.control}
                  name="val1"
                  items={[
                    {
                      value: "test1",
                      label: "테스트 라벨1",
                    },
                    {
                      value: "test2",
                      label: "테스트 라벨2",
                    },
                  ]}
                  label="제조회사"
                  ess
                />

                <RHF.FormSelect
                  control={form.control}
                  name="val1"
                  items={[
                    {
                      value: "test1",
                      label: "테스트 라벨1",
                    },
                    {
                      value: "test2",
                      label: "테스트 라벨2",
                    },
                  ]}
                  label="가타정보"
                  ess
                />
              </FlexBox>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="적용분야" ess />
                  <div className="flex gap-1">
                    <Button variant="outline-blue" size="h24" className="">
                      <Icons.Plus />
                      추가
                    </Button>

                    <Button size="h24" className="">
                      <Icons.Plus />
                      전체삭제
                    </Button>
                  </div>
                </div>
                <div className="border-border-100 bg-bg-100 flex flex-wrap gap-1 rounded-[4px] border p-3">
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="적용부품" ess />
                  <div className="flex gap-1">
                    <Button variant="outline-blue" size="h24" className="">
                      <Icons.Plus />
                      추가
                    </Button>

                    <Button size="h24" className="">
                      <Icons.Plus />
                      전체삭제
                    </Button>
                  </div>
                </div>
                <div className="border-border-100 bg-bg-100 flex flex-wrap gap-1 rounded-[4px] border p-3">
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="적용예상차종" ess />
                  <div className="flex gap-1">
                    <Button variant="outline-blue" size="h24" className="">
                      <Icons.Plus />
                      추가
                    </Button>

                    <Button size="h24" className="">
                      <Icons.Plus />
                      전체삭제
                    </Button>
                  </div>
                </div>
                <div className="border-border-100 bg-bg-100 flex flex-wrap gap-1 rounded-[4px] border p-3">
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="적용예상차종 구동연료" ess />
                  <div className="flex gap-1">
                    <Button variant="outline-blue" size="h24" className="">
                      <Icons.Plus />
                      추가
                    </Button>

                    <Button size="h24" className="">
                      <Icons.Plus />
                      전체삭제
                    </Button>
                  </div>
                </div>
                <div className="border-border-100 bg-bg-100 flex flex-wrap gap-1 rounded-[4px] border p-3">
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="주요예상 국내고객" ess />
                  <div className="flex gap-1">
                    <Button variant="outline-blue" size="h24" className="">
                      <Icons.Plus />
                      추가
                    </Button>

                    <Button size="h24" className="">
                      <Icons.Plus />
                      전체삭제
                    </Button>
                  </div>
                </div>
                <div className="border-border-100 bg-bg-100 flex flex-wrap gap-1 rounded-[4px] border p-3">
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <BaseLabel label="주요예상 해외고객" ess />
                  <div className="flex gap-1">
                    <Button variant="outline-blue" size="h24" className="">
                      <Icons.Plus />
                      추가
                    </Button>

                    <Button size="h24" className="">
                      <Icons.Plus />
                      전체삭제
                    </Button>
                  </div>
                </div>
                <div className="border-border-100 bg-bg-100 flex flex-wrap gap-1 rounded-[4px] border p-3">
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                  <Tag label="Republic of Korea / KR" className="rounded-[4px]" />
                </div>
              </div>

              <FlexBox className="gap-5">
                <RHF.FormSelect
                  control={form.control}
                  name="val1"
                  items={[
                    {
                      value: "test1",
                      label: "테스트 라벨1",
                    },
                    {
                      value: "test2",
                      label: "테스트 라벨2",
                    },
                  ]}
                  label="적용모델 국내"
                />

                <RHF.FormSelect
                  control={form.control}
                  name="val1"
                  items={[
                    {
                      value: "test1",
                      label: "테스트 라벨1",
                    },
                    {
                      value: "test2",
                      label: "테스트 라벨2",
                    },
                  ]}
                  label="적용모델 해외"
                />
              </FlexBox>
            </div>
          </div>
        </form>
      </FormDialog>
    </FormProvider>
  );
};
