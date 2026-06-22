import { data, TestSchema, type TestData, type TestFormInput } from "../schema";
import {
  Button,
  Checkbox,
  DataTable,
  FlexBox,
  FormDialog,
  getColumns,
  GN,
  Icons,
  RHF,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/columnsData";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const Modal07 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    onSuccess?.(undefined);
  };

  const checkOptions = Array.from({ length: 20 }).map((item, index) => {
    return { label: `계류법정 ${index + 1}`, value: `v-${index + 1}` };
  });

  const columns = getColumns<TestData>(columnsData);

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="인쇄"
        cancelText="닫기"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-250!"
        bodyFull
        isFooter={false}
      >
        <div className="[&_h2]:text-text-200 bg-bg-50 border-border-100 dark:bg-background-color dark:border-input flex gap-10 border-y p-3 [&_h2]:text-xs [&_p]:text-xs [&_p]:font-semibold">
          <div>
            <h2>발행번호</h2>
            <p>921</p>
          </div>

          <div>
            <h2>발행일자</h2>
            <p>2025-07-25</p>
          </div>

          <div>
            <h2>담당자 이메일</h2>
            <p>test@gmail.com</p>
          </div>

          <div>
            <h2>승인번호</h2>
            <p>202507244100004500002828</p>
          </div>

          <div>
            <h2>상태</h2>
            <p className="text-p-color-2">승인, 국세청전송 완료(7/25)</p>
          </div>
          <Button variant="outline-blue" className="ml-auto dark:bg-white">
            <Icons.Printer className="size-3" />
            인쇄
          </Button>
        </div>
        {/* prettier-ignore */}
        <div className="p-5">
          <div className="border-p-color-6 [&_*]:text-p-color-6 [&_.value-text]:text-[#000] border-2 text-xs bg-white">
            {/* S: 상단 */}
            <div className="border-p-color-6 flex justify-between border-b">
              <div className="flex flex-1 items-center justify-center">
                <p className="text-3xl">전자세금계산서</p>{" "}
                <p className="pl-5 text-base">(공급받는자 보관용)</p>
              </div>
              <div className="[&_h2]:border-p-color-6 border-p-color-6 w-50  border-l-2 [&_h2]:border-r">
                <div className="border-p-color-6 flex items-center border-b">
                  <h2 className="w-16 shrink-0 p-1 text-right">일련번호</h2>
                  <p className="border-p-color-6 relative flex-1 border-r p-1">
                    <span className="value-text">value</span>
                    <span className="absolute right-1 ml-auto">권</span>
                  </p>
                  <p className="relative flex-1 p-1">
                    <span className="value-text">value</span>
                    <span className="absolute right-1 ml-auto">호</span>
                  </p>
                </div>
                <div className="flex items-center">
                  <h2 className="w-16 shrink-0 p-1 text-right">책번호</h2>
                  <p className="w-full text-center">
                    <span className="value-text">asdasd - asdasd</span>
                  </p>
                </div>
              </div>
            </div>
            {/* E: 상단 */}

            {/* S: 공급자 + 공급받는자 */}
            <div className="flex [&>div]:flex-1 border-p-color-6 border-t">
              {/* 공급자  */}
              <div className="flex border-p-color-6 border-r-2">
                <h2 className="border-p-color-6 border-r p-1 flex items-center px-2 border-b">공<br />급<br />자</h2>
                <div className={`
                  block-div-wrap flex-1 [&>.block-div_*]:h-full
                  [&>.block-div_*]:flex [&>.block-div_*]:items-center [&>.block-div_*]:p-1 [&>.block-div_h2]:shrink-0
                  [&>.block-div_*]:justify-center [&>.block-div_.left]:justify-start
                  `}>
                  <div className="block-div flex items-center border-p-color-6 border-b h-10 ">
                    <h2 className="border-p-color-6 w-12">등록 <br /> 번호</h2>
                    <p className="border-p-color-6 border-l flex-1"><span className="value-text text-base font-semibold">851-81-02176</span></p>
                    <h2 className="border-p-color-6 border-l w-12">종사업<br />장번호</h2>
                    <p className="value-text flex-1 border-p-color-6 border-l">0000</p>
                  </div>

                  <div className="block-div flex items-center border-p-color-6 border-b h-10">
                    <h2 className="border-p-color-6w-12 text-center">상호 <br /> (법인명)</h2>
                    <p className="border-p-color-6 border-l flex-1"><span className="value-text">특허법인 이노뱅크</span></p>
                    <h2 className="border-p-color-6 border-l w-12">성&nbsp;&nbsp;&nbsp;명</h2>
                    <p className="value-text flex-1 relative border-p-color-6 border-l"><span className="value-text">김현석</span><span className="absolute right-1">(인)</span></p>
                  </div>

                  <div className="block-div flex items-center border-p-color-6 border-b h-10">
                    <h2 className="border-p-color-6 w-12 text-center">사업자 <br /> 주소</h2>
                    <p className="border-p-color-6 border-l flex-1"><span className="value-text">서울특별시 송파구 송이로 19, 2층 201호 (송파동, 늘예솔빌딩)</span></p>
                  </div>

                  <div className="block-div flex items-center border-p-color-6 border-b h-10">
                    <h2 className="border-p-color-6 w-12 text-center">업&nbsp;&nbsp;&nbsp;태</h2>
                    <p className="border-p-color-6 border-l flex-1">서비스</p>
                    <h2 className="border-p-color-6 border-l w-12">종&nbsp;&nbsp;&nbsp;목</h2>
                    <p className="value-text flex-1 border-p-color-6 border-l">변리사</p>
                  </div>
                </div>
              </div>

              {/* 공급받는자 */}
              <div className="flex border-p-color-6 border-r">
                <h2 className="border-p-color-6 border-r p-1 flex items-center px-2 border-b">공<br />급<br />받<br />는<br />자</h2>
                <div className={`
                  block-div-wrap flex-1 [&>.block-div_*]:h-full
                  [&>.block-div_*]:flex [&>.block-div_*]:items-center [&>.block-div_*]:p-1 [&>.block-div_h2]:shrink-0
                  [&>.block-div_*]:justify-center [&>.block-div_.left]:justify-start
                  `}>
                  <div className="block-div flex items-center border-p-color-6 border-b h-10 ">
                    <h2 className="border-p-color-6 w-12">등록 <br /> 번호</h2>
                    <p className="border-p-color-6 border-l flex-1"><span className="value-text text-base">851-81-02176</span></p>
                    <h2 className="border-p-color-6 border-l w-12">종사업<br />장번호</h2>
                    <p className="value-text flex-1 border-p-color-6 border-l">0000</p>
                  </div>

                  <div className="block-div flex items-center border-p-color-6 border-b h-10">
                    <h2 className="border-p-color-6 w-12 text-center">상호 <br /> (법인명)</h2>
                    <p className="border-p-color-6 border-l flex-1"><span className="value-text">특허법인 이노뱅크</span></p>
                    <h2 className="border-p-color-6 border-l w-12">성&nbsp;&nbsp;&nbsp;명</h2>
                    <p className="value-text flex-1 relative border-p-color-6 border-l"><span className="value-text">김현석</span><span className="absolute right-1">(인)</span></p>
                  </div>

                  <div className="block-div flex items-center border-p-color-6 border-b h-10">
                    <h2 className="border-p-color-6 w-12 text-center">사업자 <br /> 주소</h2>
                    <p className="border-p-color-6 border-l flex-1"><span className="value-text">서울특별시 송파구 송이로 19, 2층 201호 (송파동, 늘예솔빌딩)</span></p>
                  </div>

                  <div className="block-div flex items-center border-p-color-6 border-b h-10">
                    <h2 className="border-p-color-6 w-12 text-center">업&nbsp;&nbsp;&nbsp;태</h2>
                    <p className="border-p-color-6 border-l flex-1">서비스외</p>
                    <h2 className="border-p-color-6 border-l w-12">종&nbsp;&nbsp;&nbsp;목</h2>
                    <p className="value-text flex-1 border-p-color-6 border-l">소프트웨어개발및컨설팅사업</p>
                  </div>
                </div>
              </div>
            </div>
            {/* E: 공급자 + 공급받는자 */}

            {/* S: 작성+공급가액+새액+비고 */}
            <div className="flex border-p-color-6 border-y [&_h3]:border-p-color-6 [&_h3]:border-b [&_*]:text-center [&_h2]:p-1 [&_h3]:p-1 [&_p]:p-1">
              {/* 작성 */}
              <div className="group-obj w-24">
                <h2 className="border-p-color-6 border-b">작&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;성</h2>
                <div className="mini-group flex [&>div]:flex-auto">
                  <div className="mini-unit">
                    <h3>년</h3>
                    <p><span className="value-text">2025</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>월</h3>
                    <p><span className="value-text">7</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>일</h3>
                    <p><span className="value-text">24</span></p>
                  </div>
                </div>
              </div>

              {/* 공급가액 */}
              <div className="group-obj border-p-color-6 border-l-2 flex-1">
                <h2 className="border-p-color-6 border-b">공급가액</h2>
                <div className="mini-group flex [&>div]:flex-auto">
                  <div className="mini-unit w-10">
                    <h3>공란수</h3>
                    <p><span className="value-text">4</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>백</h3>
                    <p><span className="value-text">.</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>십</h3>
                    <p><span className="value-text">.</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>억</h3>
                    <p><span className="value-text">.</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>천</h3>
                    <p><span className="value-text">.</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>백</h3>
                    <p><span className="value-text">1</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>십</h3>
                    <p><span className="value-text">5</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>만</h3>
                    <p><span className="value-text">0</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>천</h3>
                    <p><span className="value-text">0</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>백</h3>
                    <p><span className="value-text">0</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>십</h3>
                    <p><span className="value-text">0</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>일</h3>
                    <p><span className="value-text">0</span></p>
                  </div>

                </div>
              </div>

              {/* 세액 */}
              <div className="group-obj border-p-color-6 border-l-2 flex-1">
                <h2 className="border-p-color-6 border-b">세&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;액</h2>
                <div className="mini-group flex [&>div]:flex-auto">

                  <div className="mini-unit border-p-color-6">
                    <h3>십</h3>
                    <p><span className="value-text">.</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>억</h3>
                    <p><span className="value-text">.</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>천</h3>
                    <p><span className="value-text">.</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>백</h3>
                    <p><span className="value-text">1</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>십</h3>
                    <p><span className="value-text">5</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>만</h3>
                    <p><span className="value-text">0</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>천</h3>
                    <p><span className="value-text">0</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>백</h3>
                    <p><span className="value-text">0</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>십</h3>
                    <p><span className="value-text">0</span></p>
                  </div>

                  <div className="mini-unit border-p-color-6 border-l">
                    <h3>일</h3>
                    <p><span className="value-text">0</span></p>
                  </div>

                </div>
              </div>

              {/* 비고 */}
              <div className="group-obj border-p-color-6 border-l-2 w-30">
                <h2 className="border-p-color-6 border-b">비&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;고</h2>
                <div className="mini-group flex">

                  <p><span className="value-text">비고작성</span></p>

                </div>
              </div>

            </div>
            {/* E: 작성+공급가액+새액+비고 */}

            {/* S: 리스트 */}
            <div className="border-p-color-6 border-y">
              <div className="[&>h2:first-child~h2]:border-p-color-6 [&>h2:first-child~h2]:border-l [&>h2]:flex-auto [&>h2]:p-1  [&>h2]:text-center flex border-p-color-6 border-b">
                <h2 className="w-10 flex-none!">월</h2>
                <h2 className="w-10 flex-none!">일</h2>
                <h2>품&nbsp;&nbsp;&nbsp;목 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;및 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;규&nbsp;&nbsp;&nbsp;격</h2>
                <h2 className="w-26 flex-none!">수&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;량</h2>
                <h2 className="w-26 flex-none!">단&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;가</h2>
                <h2 className="w-30 flex-none!">공급가액</h2>
                <h2 className="w-30 flex-none!">세&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;액</h2>
                <h2 className="w-26 flex-none!">비&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;고</h2>
              </div>
              <div className="[&>div:first-child~div]:border-p-color-6 [&>div:first-child~div]:border-l [&>div]:flex-auto  [&>div]:py-1.5 [&>div]:text-center flex border-p-color-6 border-b">
                <div className="w-10 flex-none!"><span className="value-text">7</span></div>
                <div className="w-10 flex-none!"><span className="value-text">24</span></div>
                <div className="text-left!"><span className="value-text">10-2025-0095400 특허 출원비용</span></div>
                <div className="w-26 flex-none!"><span className="value-text">5</span></div>
                <div className="w-26 flex-none! text-right!"><span className="value-text">1,500,000</span></div>
                <div className="w-30 flex-none! text-right!"><span className="value-text">1,500,000</span></div>
                <div className="w-30 flex-none! text-right!"><span className="value-text">150,000</span></div>
                <div className="w-26 flex-none!"><span className="value-text"></span></div>
              </div>
              <div className="[&>div:first-child~div]:border-p-color-6 [&>div:first-child~div]:border-l [&>div]:flex-auto  [&>div]:py-1.5 [&>div]:text-center flex border-p-color-6 border-b">
                <div className="w-10 flex-none!"><span className="value-text">7</span></div>
                <div className="w-10 flex-none!"><span className="value-text">24</span></div>
                <div className="text-left!"><span className="value-text">10-2025-0095400 특허 출원비용</span></div>
                <div className="w-26 flex-none!"><span className="value-text">5</span></div>
                <div className="w-26 flex-none! text-right!"><span className="value-text">1,500,000</span></div>
                <div className="w-30 flex-none! text-right!"><span className="value-text">1,500,000</span></div>
                <div className="w-30 flex-none! text-right!"><span className="value-text">150,000</span></div>
                <div className="w-26 flex-none!"><span className="value-text"></span></div>
              </div>
            </div>
            {/* E: 리스트 */}

            {/* S: 합계 */}
            <div className="flex border-p-color-6 border-y [&_h3]:border-p-color-6 [&_h3]:border-b [&_*]:text-center [&_h2]:p-1 [&_h3]:p-1 [&_p]:p-1">
              <div className="flex">
                <div className="group-obj w-50">
                  <h2 className="border-p-color-6 border-b">합게금액</h2>
                  <div className="mini-group flex [&>div]:flex-auto">
                    <div className="mini-unit">
                      <p><span className="value-text">1,650,000</span></p>
                    </div>
                  </div>
                </div>

                <div className="group-obj w-28 border-p-color-6 border-l">
                  <h2 className="border-p-color-6 border-b">현&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;금</h2>
                  <div className="mini-group flex [&>div]:flex-auto">
                    <div className="mini-unit">
                      <p><span className="value-text"><Checkbox className="[&>span>svg_*]:text-white!" /></span></p>
                    </div>
                  </div>
                </div>

                <div className="group-obj w-28 border-p-color-6 border-l">
                  <h2 className="border-p-color-6 border-b">수&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;표</h2>
                  <div className="mini-group flex [&>div]:flex-auto">
                    <div className="mini-unit">
                      <p><span className="value-text"><Checkbox className="[&>span>svg_*]:text-white!" /></span></p>
                    </div>
                  </div>
                </div>

                <div className="group-obj w-28 border-p-color-6 border-l">
                  <h2 className="border-p-color-6 border-b">어&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;음</h2>
                  <div className="mini-group flex [&>div]:flex-auto">
                    <div className="mini-unit">
                      <p><span className="value-text"><Checkbox className="[&>span>svg_*]:text-white!" /></span></p>
                    </div>
                  </div>
                </div>

                <div className="group-obj w-28 border-p-color-6 border-l">
                  <h2 className="border-p-color-6 border-b">외상 미수금</h2>
                  <div className="mini-group flex [&>div]:flex-auto">
                    <div className="mini-unit">
                      <p><span className="value-text">0</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-p-color-6 border-l-2 w-full flex items-center justify-center">
                <p>이 금액을 <span className="value-text px-10 font-semibold">청&nbsp;&nbsp;구</span> 함</p>
              </div>
            </div>
            {/* E: 합계 */}
          </div>
        </div>
      </FormDialog>
    </FormProvider>
  );
};
