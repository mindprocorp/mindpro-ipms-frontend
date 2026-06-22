import { z } from "zod";
import {
  Button,
  RHF,
  Icons,
  DataTable,
  Checkbox,
  FlexBox,
  BaseLabel,
  Separator,
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@repo/ui";
import { DetailPageTitle } from "@shared/page-title/PageTitle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SearchSelect from "@shared/search-select/ui/SearchSelect";

import { Tag } from "@shared/tag/Tag";
import { Table01 } from "pub/form-use-table-block/Table01";
import { Table02 } from "pub/form-use-table-block/Table02";
import { Table03 } from "pub/form-use-table-block/Table03";
import { Table04 } from "pub/form-use-table-block/Table04";
import { Table05 } from "pub/form-use-table-block/Table05";
import { Table06 } from "pub/form-use-table-block/Table06";
import React from "react";

const SearchSchema = z.object({
  val1: z.string().default(""),
  val2: z.string().default(""),
  val3: z.string().default(""),
});

type SearchInput = z.input<typeof SearchSchema>;
type SearchOutput = z.input<typeof SearchSchema>;

const Page02 = () => {
  const form = useForm<SearchInput>({
    resolver: zodResolver(SearchSchema),
  });

  const [open, setOpen] = React.useState(false);
  const openHandler = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <div>
      <DetailPageTitle title="조사분석의뢰 작성" />
      <div className="space-y-4">
        <FlexBox className="gap-5">
          <RHF.Input control={form.control} name="val1" label="작성자" inputDisabled />
          <RHF.Input control={form.control} name="val1" label="작성일" inputDisabled />
        </FlexBox>

        <FlexBox className="gap-5">
          <RHF.Input control={form.control} name="val1" label="조사의뢰번호" disabled />
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
            label="조사구분"
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
            label="비용집행근거"
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
            label="코스트센터"
            ess
          />
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
            label="권리구분"
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
            label="조사중요도"
            ess
          />
        </FlexBox>

        <RHF.Input control={form.control} name="val1" label="조사제목" ess />

        <RHF.Input control={form.control} name="val1" label="조사목적" />

        <RHF.Input
          control={form.control}
          name="val1"
          label="키워드"
          tooltip="자동차, 특허(키워드 사이의 구분자는 “,”로 해주세요"
        />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <BaseLabel label="조사국가(한/미/일/EP/PCT)" ess />
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

        {/* 연관선행기술조사 및 문헌 */}
        <Table01 />

        {/* 선행기술문헌 */}
        <Table02 />

        {/* 자사특허 */}
        <Table03 />

        {/* 자사 관련특허 */}
        <Table04 />

        {/* 경쟁사 특허 */}
        <Table05 />

        {/* 경쟁사 관련특허 */}
        <Table06 />

        <RHF.Input control={form.control} name="val1" label="검색식" tooltip="검색식에 대한 설명" />

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
          label="검색DB"
        />

        <RHF.MultiFiles
          label="의뢰서 관련 첨부파일"
          className="[&_[data-slot=file-area]]:flex-row [&_[data-slot=file-area]]:text-xs"
          simple
        />

        <RHF.FormTextarea
          control={form.control}
          name="val1"
          label="조사의뢰 내역"
          tooltip="검색식에 대한 설명"
          suffix={
            <div className="ml-auto text-[11px]">
              <span className="text-p-color-3">0</span> / 4000
            </div>
          }
        />
      </div>
      <div data-slot="footer" className="mt-4 flex justify-between">
        <div className="flex min-w-0 gap-2">
          <Button variant="outline-green">
            <Icons.FileText />
            결재상신
          </Button>
        </div>
        <div className="ml-auto flex min-w-0 gap-2">
          <Button className="w-20">목록</Button>
          <Button variant="blue" className="w-20">
            저장
          </Button>
          <Button variant="blue">산출물(특허/신용신안)</Button>
        </div>
      </div>

      <Separator className="mt-6 border-t" />

      {/* 담당자 지정 */}
      <div className="border-border-100 rounded-[4px] border">
        <div className="border-border-100 bg-bg-50 border-b p-3 py-2">
          <h2 className="text-sm font-semibold">담당자 지정</h2>
        </div>
        <div className="space-y-4 p-3">
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
              label="사무소"
              orientation="horizontal"
              className="justify-start! [&>button]:w-50"
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
              label="특허팀"
              orientation="horizontal"
              className="justify-start! [&>button]:w-50"
            />
          </FlexBox>
        </div>
      </div>

      {/* 특허팀 입력사항 */}
      <div className="border-border-100 mt-3 rounded-[4px] border">
        <div className="border-border-100 bg-bg-50 border-b p-3 py-2">
          <h2 className="text-sm font-semibold">특허팀 입력사항</h2>
        </div>
        <div className="space-y-4 p-3">
          <div className="[&_h2]:text-text-200 flex items-center gap-4 text-xs [&_h2]:pr-4">
            <div className="flex">
              <h2>특허담당자</h2>
              <p>김도형/특허팀/과장</p>
            </div>
            <Separator className="border-border-200 h-3! border-r" orientation="vertical" />
            <div className="flex">
              <h2>의뢰일</h2>
              <p>2025-11-20</p>
            </div>
            <Separator className="border-border-200 h-3! border-r" orientation="vertical" />
            <div className="flex">
              <h2>사무소</h2>
              <p>지혜안</p>
            </div>
            <Separator className="border-border-200 h-3! border-r" orientation="vertical" />
            <div className="flex">
              <h2>사무소 담당자</h2>
              <p>관리부</p>
            </div>
          </div>

          <Separator className="border-border-200 border-t" />
          <div className="text-xs">전달내용이 들어갑니다.</div>

          <div className="border-border-100 bg-background rounded-[4px] border text-xs">
            {/* <div className="p-4">전달내용이 들어갑니다.</div> */}
            <div className="bg-bg-50 flex gap-3 p-4">
              <h3 className="w-15 shrink-0 pb-1">첨부파일</h3>
              <ul className="flex flex-wrap gap-4">
                {Array.from({ length: 20 }).map((_, index) => {
                  return (
                    <li className="flex items-center gap-1">
                      <Button variant="link" className="h-auto p-0 text-xs">
                        <Icons.Paperclip className="size-3" />
                        필테-가격.png
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 견적내용 */}
      <div className="border-border-100 mt-3 rounded-[4px] border">
        <div className="border-border-100 bg-bg-50 border-b p-3 py-2">
          <h2 className="text-sm font-semibold">견적내용</h2>
        </div>
        <div className="space-y-4 p-3">
          <div className="[&_h2]:text-text-200 flex items-center gap-4 text-xs [&_h2]:pr-4">
            <div className="flex">
              <h2>화폐단위</h2>
              <p>KRW(대한민국)</p>
            </div>
            <Separator className="border-border-200 h-3! border-r" orientation="vertical" />
            <div className="flex">
              <h2>견적금액</h2>
              <p>100</p>
            </div>
          </div>

          <div className="border-border-100 bg-background rounded-[4px] border text-xs">
            {/* <div className="p-4">전달내용이 들어갑니다.</div> */}
            <div className="bg-bg-50 flex gap-3 p-4">
              <h3 className="w-15 shrink-0 pb-1">첨부파일</h3>
              <ul className="flex flex-wrap gap-4">
                {Array.from({ length: 20 }).map((_, index) => {
                  return (
                    <li className="flex items-center gap-1">
                      <Button variant="link" className="h-auto p-0 text-xs">
                        <Icons.Paperclip className="size-3" />
                        필테-가격.png
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 발명자  추가 입력사항 */}
      <div className="border-border-100 mt-3 rounded-[4px] border">
        <div className="border-border-100 bg-bg-50 border-b p-3 py-2">
          <h2 className="text-sm font-semibold">발명자 추가 입력사항</h2>
        </div>
        <div className="space-y-4 p-3">
          <div className="[&_h2]:text-text-200 flex items-center gap-4 text-xs [&_h2]:pr-4">
            <div className="flex">
              <h2>조사의뢰 여부</h2>
              <p>조사의뢰</p>
            </div>
            <Separator className="border-border-200 h-3! border-r" orientation="vertical" />
            <div className="flex">
              <h2>조사의뢰 요청기한</h2>
              <p>2025-11-20</p>
            </div>
          </div>

          <Separator className="border-border-200 border-t" />
          <div className="text-xs">전달내용이 들어갑니다.</div>
        </div>
      </div>

      {/* 특허팀  추가 입력사항 */}
      <div className="border-border-100 mt-3 rounded-[4px] border">
        <div className="border-border-100 bg-bg-50 border-b p-3 py-2">
          <h2 className="text-sm font-semibold">특허팀 추가 입력사항</h2>
        </div>
        <div className="space-y-4 p-3">
          <div className="[&_h2]:text-text-200 flex items-center gap-4 text-xs [&_h2]:pr-4">
            <div className="flex">
              <h2>조사의뢰 여부</h2>
              <p>조사의뢰</p>
            </div>
            <Separator className="border-border-200 h-3! border-r" orientation="vertical" />
            <div className="flex">
              <h2>조사의뢰 요청기한</h2>
              <p>2025-11-20</p>
            </div>
          </div>

          <Separator className="border-border-200 border-t" />
          <div className="text-xs">전달내용이 들어갑니다.</div>
        </div>
      </div>

      {/* 사무소 입력사항 */}
      <div className="border-border-100 mt-3 rounded-[4px] border">
        <div className="border-border-100 bg-bg-50 border-b p-3 py-2">
          <h2 className="text-sm font-semibold">사무소 입력사항</h2>
        </div>
        <div className="space-y-4 p-3">
          <div className="[&_h2]:text-text-200 flex items-center gap-4 text-xs [&_h2]:pr-4">
            <div className="flex">
              <h2>결과통보일</h2>
              <p>2025-11-20</p>
            </div>
            <Separator className="border-border-200 h-3! border-r" orientation="vertical" />
            <div className="flex">
              <h2>관련인용문</h2>
              {/* <p>2건 버튼</p> */}
              <Popover open={open} onOpenChange={openHandler}>
                <div>
                  <PopoverTrigger asChild>
                    <Button variant="link-blue" className="h-auto p-0 text-xs">
                      2건
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="max-h-50 overflow-auto">
                    <ul className="flex flex-col gap-2">
                      {Array.from({ length: 20 }).map((_, index) => {
                        return <li className="flex items-center gap-1 text-xs">관련인용문</li>;
                      })}
                    </ul>
                  </PopoverContent>
                </div>
              </Popover>
            </div>
            <Separator className="border-border-200 h-3! border-r" orientation="vertical" />
            <div className="flex">
              <h2>기술평가</h2>
              <p>
                <Button variant="link-blue" className="h-auto p-0 text-xs">
                  <Icons.NotepadText /> 평가결과
                </Button>
              </p>
            </div>
          </div>

          <Separator className="border-border-200 border-t" />
          <div className="text-xs">전달내용이 들어갑니다.</div>

          <div className="border-border-100 bg-background rounded-[4px] border text-xs">
            <div className="bg-bg-50 flex gap-3 p-4">
              <h3 className="w-15 shrink-0 pb-1">첨부파일</h3>
              <ul className="flex flex-wrap gap-4">
                {Array.from({ length: 1 }).map((_, index) => {
                  return (
                    <li className="flex items-center gap-1">
                      <Button variant="link" className="h-auto p-0 text-xs">
                        <Icons.Paperclip className="size-3" />
                        필테-가격.png
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 특허팀 종합검토결과 */}
      <div className="border-border-100 mt-3 rounded-[4px] border">
        <div className="border-border-100 bg-bg-50 border-b p-3 py-2">
          <h2 className="text-sm font-semibold">특허팀 종합검토결과</h2>
        </div>
        <div className="space-y-4 p-3">
          <div className="[&_h2]:text-text-200 flex items-center gap-4 text-xs [&_h2]:pr-4">
            <div className="flex">
              <h2>종합검토결과</h2>
              <p>2025-11-20</p>
            </div>
            <Separator className="border-border-200 h-3! border-r" orientation="vertical" />
          </div>

          <Separator className="border-border-200 border-t" />
          <div className="text-xs">전달내용이 들어갑니다.</div>

          <div className="border-border-100 bg-background rounded-[4px] border text-xs">
            <div className="bg-bg-50 flex gap-3 p-4">
              <h3 className="w-15 shrink-0 pb-1">첨부파일</h3>
              <ul className="flex flex-wrap gap-4">
                {Array.from({ length: 20 }).map((_, index) => {
                  return (
                    <li className="flex items-center gap-1">
                      <Button variant="link" className="h-auto p-0 text-xs">
                        <Icons.Paperclip className="size-3" />
                        필테-가격.png
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page02;
