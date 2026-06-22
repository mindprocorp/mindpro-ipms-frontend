import { z } from "zod";
import { Button, RHF, Icons, FlexBox, BaseLabel, Separator, FormField } from "@repo/ui";
import { DetailPageTitle } from "@shared/page-title/PageTitle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Tag } from "@shared/tag/Tag";
import { Table01 } from "pub/form-use-table-block/Table01";
import { Table02 } from "pub/form-use-table-block/Table02";
import { Table03 } from "pub/form-use-table-block/Table03";
import { Table04 } from "pub/form-use-table-block/Table04";
import { Table05 } from "pub/form-use-table-block/Table05";
import { Table06 } from "pub/form-use-table-block/Table06";
import { Table07 } from "pub/form-use-table-block/Table07";
import { Table08 } from "pub/form-use-table-block/Table08";
import { Table12 } from "pub/form-use-table-block/Table12";
import { Table13 } from "pub/form-use-table-block/Table13";
import { Table14 } from "pub/form-use-table-block/Table14";
import { Table15 } from "pub/form-use-table-block/Table15";
import { Table16 } from "pub/form-use-table-block/Table16";

const SearchSchema = z.object({
  val1: z.string().default(""),
  val2: z.string().default(""),
  val3: z.string().default(""),
  selId: z.string().default(""),
  tableArray: z.array(z.any()),
});

type SearchInput = z.input<typeof SearchSchema>;
type SearchOutput = z.input<typeof SearchSchema>;

const Page05 = () => {
  const form = useForm<SearchInput>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      selId: "123-456",
      tableArray: [
        {
          id: "1234-568-987",
          ckey01: "Y",
          ckey02: "123-456",
          ckey03: "홍길동aa",
          ckey04: "hong gil dong",
          ckey05: "",
          ckey06: "법무팀",
          ckey07: "",
          ckey08: "10",
          ckey09: "내부",
          ckey10: "ken99@example.com",
          ckey11: "ken99@example.com",
          ckey12: "ken99@example.com",
          ckey13: "ken99@example.com",
          ckey14: "ken99@example.com",
          ckey15: "ken99@example.com",
        },
      ],
    },
  });

  return (
    <div>
      <DetailPageTitle title="국내출원 마스터 작성" />
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
            label="담당자"
            ess
          />

          <RHF.FormDatePicker control={form.control} name="val1" label="접수일" />
        </FlexBox>

        <FlexBox className="gap-5">
          <RHF.Input control={form.control} name="val1" label="PLM No." disabled />
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
            label="권리구분"
            ess
          />
        </FlexBox>

        <FlexBox className="items-end justify-start [&>div]:w-80!">
          <RHF.Input control={form.control} name="val1" label="프로젝트" disabled />
          <Button>상세내역</Button>
        </FlexBox>

        <RHF.MultiFiles
          label="프로젝트 근거 첨부파일"
          className="[&_[data-slot=file-area]]:flex-row [&_[data-slot=file-area]]:text-xs"
          simple
        />

        <FlexBox className="gap-5 [&>div]:w-full">
          <FormField label="현재상태/일자" vertical>
            <FlexBox>
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
                ess
              />
              <RHF.FormDatePicker control={form.control} name="val1" className="w-60" ess />
            </FlexBox>
          </FormField>

          <FormField label="심사청구 유무/일자" vertical>
            <FlexBox>
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
                ess
              />
              <RHF.FormDatePicker control={form.control} name="val1" className="w-60" ess />
            </FlexBox>
          </FormField>
        </FlexBox>

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
          label="상태구분"
        />

        <RHF.Input control={form.control} name="val1" label="발명의 명칭(한글)" />

        <RHF.Input control={form.control} name="val1" label="발명의 명칭(영문)" />

        <FlexBox className="gap-5 [&>div]:w-full">
          <FormField label="특허사무소/발송일" vertical>
            <FlexBox>
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
                ess
              />
              <RHF.FormDatePicker control={form.control} name="val1" className="w-60" ess />
            </FlexBox>
          </FormField>

          <RHF.Input control={form.control} name="val1" label="IPC 분류코드" />
        </FlexBox>

        <FlexBox className="gap-5">
          <RHF.Input control={form.control} name="val1" label="사무소 REF" />
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
            label="사무소 담당자"
          />
        </FlexBox>

        <FlexBox className="gap-5 [&>div]:w-full">
          <FormField label="출원번호/출원일" vertical>
            <FlexBox>
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
                ess
              />
              <RHF.FormDatePicker control={form.control} name="val1" className="w-60" ess />
            </FlexBox>
          </FormField>

          <FormField label="공개번호/공개일" vertical>
            <FlexBox>
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
                ess
              />
              <RHF.FormDatePicker control={form.control} name="val1" className="w-60" ess />
            </FlexBox>
          </FormField>
        </FlexBox>

        <FlexBox className="gap-5 [&>div]:w-full">
          <FormField label="공고번호/공고일" vertical>
            <FlexBox>
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
                ess
              />
              <RHF.FormDatePicker control={form.control} name="val1" className="w-60" ess />
            </FlexBox>
          </FormField>

          <FormField label="등록번호/등록일" vertical>
            <FlexBox>
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
                ess
              />
              <RHF.FormDatePicker control={form.control} name="val1" className="w-60" ess />
            </FlexBox>
          </FormField>
        </FlexBox>

        {/* 발명자 */}
        <Table12 form={form} />

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
            label="공동출원여부"
            ess
          />

          <RHF.Input
            control={form.control}
            name="val1"
            label="키워드"
            labelDesc={
              <p className="text-p-color-4 ml-auto text-xs">
                자동차, 특허(키워드 사이의 구분자는 “,”로 해주세요
              </p>
            }
          />
        </FlexBox>

        {/* 귀속권리 */}
        <Table14 form={form} />

        <RHF.MultiFiles
          label="계약서"
          className="[&_[data-slot=file-area]]:flex-row [&_[data-slot=file-area]]:text-xs"
          simple
        />

        {/* 선행조사 */}
        <Table16 />

        {/* 자사특허 */}
        <Table03 />

        {/* 자사 관련특허 */}
        <Table04 />

        {/* 경쟁사 특허 */}
        <Table05 />

        {/* 경쟁사 관련특허 */}
        <Table06 />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <BaseLabel label="출원국가" />
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
          <div className="border-border-100 bg-bg-100 flex flex-wrap gap-2 rounded-[4px] border p-3">
            <Tag label="Republic of Korea / KR" />
            <Tag label="Republic of Korea / KR" />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <BaseLabel label="출원국가" />
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
          <div className="border-border-100 bg-bg-100 flex flex-wrap gap-2 rounded-[4px] border p-3">
            <Tag label="Republic of Korea / KR" />
            <Tag label="Republic of Korea / KR" />
          </div>
        </div>

        <FlexBox className="gap-5 [&>div]:w-full">
          <FormField label="우선권 출원번호/출원일" vertical>
            <FlexBox>
              <RHF.Input control={form.control} name="val1" />
              <RHF.Input control={form.control} name="val1" className="w-60" />
            </FlexBox>
          </FormField>

          <RHF.Input control={form.control} name="val1" label="우선권 REF-NO" />
        </FlexBox>

        <FlexBox className="gap-5 [&>div]:w-full">
          <RHF.Input control={form.control} name="val1" label="병합출원" />

          <RHF.Input control={form.control} name="val1" label="모출원" />
        </FlexBox>

        <FlexBox className="gap-5 [&>div]:w-full">
          <FormField label="독립성/종속항" vertical>
            <FlexBox>
              <RHF.Input control={form.control} name="val1" />
              <RHF.Input control={form.control} name="val1" className="w-full" />
            </FlexBox>
          </FormField>

          <FormField label="면수/도면수" vertical>
            <FlexBox>
              <RHF.Input control={form.control} name="val1" />
              <RHF.Input control={form.control} name="val1" className="w-full" />
            </FlexBox>
          </FormField>
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
            label="발명평가등급"
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
            label="실적집계대상 여부"
          />
        </FlexBox>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <BaseLabel label="기술분류코드" />
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
          <div className="border-border-100 bg-bg-100 flex flex-wrap gap-2 rounded-[4px] border p-3">
            <Tag label="Republic of Korea / KR" />
            <Tag label="Republic of Korea / KR" />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <BaseLabel label="관련제품군" />
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
          <div className="border-border-100 bg-bg-100 flex flex-wrap gap-2 rounded-[4px] border p-3">
            <Tag label="Republic of Korea / KR" />
            <Tag label="Republic of Korea / KR" />
          </div>
        </div>

        {/* 국내 우선권번호 */}
        <Table15 />

        <div>
          <div className="mb-2 flex items-center gap-4">
            <BaseLabel label="벤치마킹 여부" ess />
            <div className="flex gap-1">
              <RHF.FormRadio
                name="val1"
                control={form.control}
                items={[
                  {
                    value: "Y",
                    label: "예",
                  },
                  {
                    value: "N",
                    label: "아니오",
                  },
                ]}
                defaultValue="N"
                size="sm"
                className="h-auto"
              />
            </div>
          </div>
          <RHF.Input control={form.control} name="val1" />
        </div>

        <FlexBox className="gap-5">
          <RHF.Input
            control={form.control}
            name="val1"
            label="예상 경쟁사(타사 사용 가능성 여부)"
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
            label="예상 양산 시점"
            ess
          />
        </FlexBox>

        <div>
          <div className="mb-2 flex items-center gap-4">
            <BaseLabel label="본 발명을 새내 외 타사에게 공개 또는 공개 예정 여부" ess />
            <div className="flex gap-1">
              <RHF.FormRadio
                name="val1"
                control={form.control}
                items={[
                  {
                    value: "Y",
                    label: "예",
                  },
                  {
                    value: "N",
                    label: "아니오",
                  },
                ]}
                defaultValue="N"
                size="sm"
                className="h-auto"
              />
            </div>
          </div>
          <RHF.Input control={form.control} name="val1" />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-4">
            <BaseLabel label="본 발명을 타사가 무단으로 사용하는 경우 확인 가능 여부" ess />
            <div className="flex gap-1">
              <RHF.FormRadio
                name="val1"
                control={form.control}
                items={[
                  {
                    value: "Y",
                    label: "예",
                  },
                  {
                    value: "N",
                    label: "아니오",
                  },
                ]}
                defaultValue="N"
                size="sm"
                className="h-auto"
              />
            </div>
          </div>
          <RHF.Input control={form.control} name="val1" />
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
            label="출원구분"
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
            label="이원화 가능성 존재 여부"
          />
        </FlexBox>

        <div>
          <div className="mb-2 flex items-center gap-4">
            <BaseLabel label="해외출원 필요성" />
            <div className="flex gap-1">
              <RHF.FormRadio
                name="val1"
                control={form.control}
                items={[
                  {
                    value: "Y",
                    label: "예",
                  },
                  {
                    value: "N",
                    label: "아니오",
                  },
                ]}
                defaultValue="N"
                size="sm"
                className="h-auto"
              />
            </div>
          </div>
          <RHF.Input control={form.control} name="val1" />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-4">
            <BaseLabel label="매입 가능성" ess />
            <div className="flex gap-1">
              <RHF.FormRadio
                name="val1"
                control={form.control}
                items={[
                  {
                    value: "Y",
                    label: "예",
                  },
                  {
                    value: "N",
                    label: "아니오",
                  },
                ]}
                defaultValue="N"
                size="sm"
                className="h-auto"
              />
            </div>
          </div>
          <RHF.Input control={form.control} name="val1" />
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
            label="강한 IP여부"
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
            label="분쟁특허 여부"
          />
        </FlexBox>

        <RHF.MultiFiles
          label="출원서 파일"
          className="[&_[data-slot=file-area]]:flex-row [&_[data-slot=file-area]]:text-xs"
          simple
        />

        <RHF.FormTextarea
          control={form.control}
          name="val1"
          label="출원서 펌부파일 요약"
          suffix={
            <div className="ml-auto text-[11px]">
              <span className="text-p-color-3">0</span> / 4000
            </div>
          }
        />

        <RHF.MultiFiles
          label="대표 도면 파일"
          className="[&_[data-slot=file-area]]:flex-row [&_[data-slot=file-area]]:text-xs"
          simple
        />

        <RHF.FormTextarea
          control={form.control}
          name="val1"
          label="비고"
          suffix={
            <div className="ml-auto text-[11px]">
              <span className="text-p-color-3">0</span> / 4000
            </div>
          }
        />

        <RHF.FormTextarea
          control={form.control}
          name="val1"
          label="청구범위"
          suffix={
            <div className="ml-auto text-[11px]">
              <span className="text-p-color-3">0</span> / 4000
            </div>
          }
        />

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
            label="출원 보상금 지급 대상 여부"
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
            label="등록 보상금 지급 대상 여부"
          />
        </FlexBox>
      </div>
      <div data-slot="footer" className="mt-4 flex justify-between">
        <div className="ml-auto flex min-w-0 gap-2">
          <Button className="w-20">목록</Button>

          <Button variant="blue" className="w-20">
            저장
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page05;
