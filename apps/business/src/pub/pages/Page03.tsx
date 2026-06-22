import { z } from "zod";
import { Button, RHF, Icons, FlexBox, BaseLabel, Separator } from "@repo/ui";
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

const Page03 = () => {
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
      <DetailPageTitle title="직무발명신고서 작성" />
      <div className="space-y-4">
        <FlexBox className="gap-5">
          <RHF.Input control={form.control} name="val1" label="작성자" inputDisabled />
          <RHF.Input control={form.control} name="val1" label="작성일" inputDisabled />
        </FlexBox>

        <FlexBox className="gap-5">
          <RHF.Input control={form.control} name="val1" label="PLM No." inputDisabled />
          {/* <RHF.Input control={form.control} name="val1" label="권리구분" ess /> */}
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
          <RHF.Input
            control={form.control}
            name="val1"
            label="프로젝트"
            // className="[&>div]:w-80!"
            ess
          />
          <Button>
            <Icons.Search />
            선택
          </Button>
          <Button variant="outline-pink">
            <Icons.FilePenLine />
            신규작성
          </Button>
        </FlexBox>

        <RHF.MultiFiles
          label="프로젝트 근거 첨부파일"
          className="[&_[data-slot=file-area]]:flex-row [&_[data-slot=file-area]]:text-xs"
          simple
        />

        <RHF.Input control={form.control} name="val1" label="발명의 명칭(한글)" />

        <RHF.Input control={form.control} name="val1" label="발명의 명칭(영문)" />

        {/* 발명자 */}
        <Table12 form={form} />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <BaseLabel label="기술분류" />
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

        {/* 인용 REF */}
        <Table13 />

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
          label="발명의 완성도"
          ess
        />

        {/* 국내 우선권번호 */}
        <Table15 />

        {/* 선행조사(조사분석조회) */}
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

        <RHF.MultiFiles
          label="직무발명신고서"
          className="[&_[data-slot=file-area]]:flex-row [&_[data-slot=file-area]]:text-xs"
          simple
          ess
        />

        <RHF.FormTextarea
          control={form.control}
          name="val1"
          label="직무발명신고서 요약 메모"
          suffix={
            <div className="ml-auto text-[11px]">
              <span className="text-p-color-3">0</span> / 4000
            </div>
          }
        />

        <RHF.MultiFiles
          label="선행기술자료"
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

        {/* 월 잔액 */}
        <div className="border-border-100 mt-3 rounded-[4px] border">
          <div className="border-border-100 bg-bg-50 border-b p-3 py-2">
            <h2 className="text-sm font-semibold">월 잔액</h2>
          </div>
          <div className="space-y-4 p-3">
            <div className="[&_h2]:text-text-200 flex items-center gap-4 text-xs [&_h2]:pr-4">
              <div className="flex">
                <h2>지급수수료 예산잔액</h2>
                <p>1,000</p>
              </div>
              <Separator className="border-border-200 h-3! border-r" orientation="vertical" />
              <div className="flex">
                <h2>선급금 예산잔액</h2>
                <p>1,000</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-p-color-4">
          발명진흥법 제2조, 10조, 11조, 15조, 16조 및 당사 지적재산관리규정 제4항에 의거 , 위에
          발명(고안,디자인)에 대한 등록 받을 수 있는 권리 및 실사권을 회사에 양도 합니다.
        </div>

        <RHF.FormCheckbox
          control={form.control}
          name="val2"
          label="위 양도 내용에 동의 합니다."
          outputFormat={["Y", "N"]}
          size="sm"
          height={7}
        />
      </div>
      <div data-slot="footer" className="mt-4 flex justify-between">
        <div className="ml-auto flex min-w-0 gap-2">
          <Button className="w-20">목록</Button>
          <Button variant="blue" className="w-20">
            저장
          </Button>
        </div>
      </div>

      <div data-slot="footer" className="mt-4 flex justify-between">
        <div className="flex min-w-0 gap-2">
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
          />

          <Button variant="outline-green">담당자 지정처리</Button>
        </div>
        <div className="ml-auto flex min-w-0 gap-2">
          <Button className="w-20">목록</Button>
          <Button variant="blue">발명평가표</Button>
        </div>
      </div>
    </div>
  );
};

export default Page03;
