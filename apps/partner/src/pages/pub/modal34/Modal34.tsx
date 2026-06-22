import { data, TestSchema, type TestData, type TestFormInput } from "../schema";
import {
  Button,
  Checkbox,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Field,
  FieldLabel,
  FlexBox,
  FormDialog,
  getColumns,
  GN,
  Icons,
  InputGroup,
  InputGroupInput,
  Label,
  RHF,
  Separator,
} from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/columnsData";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddItem } from "./AddItem";

type CountryType = {
  label: string;
  code: string;
  value?: string;
};

type CountryChecked = {
  allCountry: string[];
  bookmark: string[];
  appoint: string[];
  appointAfter: string[];
};

export const Modal34 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    // onSuccess?.();
  };

  const [addItem, setAddItem] = useState(false);

  const checkOptions = Array.from({ length: 20 }).map((item, index) => {
    return { label: `국가명 ${index + 1}`, value: `v-${index + 1}`, code: `v-${index + 1}` };
  });

  // checkValue
  const [countryChecked, setCountryChecked] = useState<CountryChecked>({
    allCountry: [],
    bookmark: [],
    appoint: [],
    appointAfter: [],
  });

  // 전체국가
  const [allCountry, setAllCountry] = useState([]);

  // 즐겨찾기
  const [bookmark, setBookmark] = useState([]);

  // 지정국가
  const [appoint, setAppoint] = useState([]);

  // 사후지정국가
  const [appointAfter, setAppointAfter] = useState([]);

  // 등록국가
  const [registerCountry, setRegisterCountry] = useState([]);

  const onChangeHandle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget;
    if (countryChecked.allCountry.includes(id)) {
      setCountryChecked((prev) => {
        return {
          ...prev,
          allCountry: prev.allCountry.filter((item) => item !== id),
        };
      });
      return;
    }

    setCountryChecked((prev) => {
      return {
        ...prev,
        allCountry: [...prev.allCountry, id],
      };
    });
    console.log(e);
  };

  useEffect(() => {
    setAllCountry(checkOptions);
  }, []);

  console.log(countryChecked.allCountry);

  const addBookmark = () => {
    const addItem = allCountry.filter((item) =>
      countryChecked.allCountry.some((v) => item.code === v),
    );

    setBookmark((prev) => [...prev, ...addItem]);
    setCountryChecked([]);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-240!"
      >
        {/* <Separator className="mb-4 border-t" /> */}

        <div className="flex h-150 min-h-0 gap-3">
          <div className="flex h-full min-h-0 flex-1 flex-col gap-2">
            {/* 전체국가 */}
            <div
              data-slot="country-wrap"
              className="border-border-200 flex min-h-0 flex-1 flex-col border"
            >
              <div className="bg-bg-50 border-b p-2">
                <h2 className="text-xs font-semibold">전체국가</h2>
              </div>
              <div className="flex items-center gap-2 border-b p-2">
                <InputGroup>
                  <InputGroupInput name="keyword" placeholder="국문명" />
                </InputGroup>
                <Button>전체보기</Button>
              </div>
              <div data-slot="country-body" className="flex flex-1 flex-col overflow-auto">
                {allCountry.map((item) => {
                  const checked = countryChecked.allCountry.includes(item.code);
                  return (
                    <Label
                      data-checked={checked}
                      data-has-selected=""
                      className="hover:bg-bg-100 text-text data-[checked=true]:bg-p-color-4/5 flex items-center gap-2 p-2 text-xs data-[has-selected=true]:pointer-events-none data-[has-selected=true]:opacity-40"
                    >
                      <Checkbox
                        size="sm"
                        id={item.code}
                        onClick={onChangeHandle}
                        checked={checked}
                      />
                      <span className="w-10 text-center">{item.code}</span>
                      <span>{item.label}</span>
                    </Label>
                  );
                })}
              </div>
              <div data-slot="footer" className="bg-bg-50 flex items-center gap-2 border-t p-2">
                <Button size="h24" variant="ghost" className="" onClick={addBookmark}>
                  <Icons.Plus /> 즐겨찾기 추가
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="h24" className="ml-auto">
                      추가위치 지정
                      <Icons.ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup className="[&>div]:text-text [&>div]:text-xs">
                      <DropdownMenuItem>지정국가 추가</DropdownMenuItem>
                      <DropdownMenuItem>사후 지정국가 추가</DropdownMenuItem>
                      <DropdownMenuItem>지정/사후 국가 모두 추가</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* 즐겨찾기 */}
            <div
              data-slot="country-wrap"
              className="border-border-200 flex min-h-0 flex-1 flex-col border"
            >
              <div className="bg-bg-50 border-b p-2">
                <h2 className="text-xs font-semibold">즐겨찾기</h2>
              </div>

              <div data-slot="country-body" className="flex flex-1 flex-col overflow-auto">
                {!bookmark.length && (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2">
                    <Icons.Earth className="text-text-100" />
                    <p className="text-text-200 text-xs">선택된 국가가 없습니다.</p>
                  </div>
                )}

                {bookmark.map((item) => {
                  return (
                    <Label className="hover:bg-bg-100 text-text flex items-center gap-2 p-2 text-xs">
                      <Checkbox size="sm" /> <span className="w-10 text-center">{item.code}</span>
                      <span>{item.label}</span>
                    </Label>
                  );
                })}
              </div>
              <div data-slot="footer" className="bg-bg-50 flex items-center gap-2 border-t p-2">
                <Button size="h24" variant="outline" className="">
                  <Icons.Minus /> 삭제
                </Button>
                <Button size="h24" variant="outline" className="">
                  <Icons.Trash /> 전체삭제
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="h24" className="ml-auto">
                      추가위치 지정
                      <Icons.ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup className="[&>div]:text-text [&>div]:text-xs">
                      <DropdownMenuItem>지정국가 추가</DropdownMenuItem>
                      <DropdownMenuItem>사후 지정국가 추가</DropdownMenuItem>
                      <DropdownMenuItem>지정/사후 국가 모두 추가</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="flex h-full min-h-0 w-60 flex-col gap-2">
            {/* 지정국가 */}
            <div
              data-slot="country-wrap"
              className="border-border-200 flex min-h-0 flex-1 flex-col border"
            >
              <div className="bg-bg-50 flex border-b p-2">
                <h2 className="flex items-center gap-1 text-xs font-semibold">
                  <Icons.Pin className="size-3.5" />
                  지정국가
                </h2>
                <p className="text-p-color-1 ml-auto text-xs font-semibold">3개국</p>
              </div>

              <div data-slot="country-body" className="flex flex-1 flex-col overflow-auto">
                {!appoint.length && (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2">
                    <Icons.Earth className="text-text-100" />
                    <p className="text-text-200 text-xs">선택된 국가가 없습니다.</p>
                  </div>
                )}

                {appoint.map((item) => {
                  return (
                    <Label className="hover:bg-bg-100 text-text flex items-center gap-2 p-2 text-xs">
                      <Checkbox size="sm" /> <span className="w-10 text-center">TR</span>{" "}
                      <span>튀르키에</span>
                    </Label>
                  );
                })}
              </div>
              <div data-slot="footer" className="bg-bg-50 flex items-center gap-1 border-t p-2">
                {/* <span className="text-xs">튀르키에 외 4개 국가</span> */}
                <Button size="h24" variant="outline" className="ml-auto">
                  <Icons.Minus /> 삭제
                </Button>
                <Button size="h24" variant="outline" className="">
                  <Icons.Trash /> 전체삭제
                </Button>
              </div>
            </div>

            {/* 사후지정국가 */}
            <div
              data-slot="country-wrap"
              className="border-border-200 flex min-h-0 flex-1 flex-col border"
            >
              <div className="bg-bg-50 flex border-b p-2">
                <h2 className="flex items-center gap-1 text-xs font-semibold">
                  <Icons.Earth className="size-3.5" />
                  사후지정국가
                </h2>
                <p className="text-p-color-3 ml-auto text-xs font-semibold">3개국</p>
              </div>

              <div data-slot="country-body" className="flex flex-1 flex-col overflow-auto">
                {!appointAfter.length && (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2">
                    <Icons.Earth className="text-text-100" />
                    <p className="text-text-200 text-xs">선택된 국가가 없습니다.</p>
                  </div>
                )}

                {appointAfter.map((item) => {
                  return (
                    <Label className="hover:bg-bg-100 text-text flex items-center gap-2 p-2 text-xs">
                      <Checkbox size="sm" /> <span className="w-10 text-center">TR</span>{" "}
                      <span>튀르키에</span>
                    </Label>
                  );
                })}
              </div>
              <div data-slot="footer" className="bg-bg-50 flex items-center gap-2 border-t p-2">
                <Button size="h24" variant="outline" className="ml-auto">
                  <Icons.Minus /> 삭제
                </Button>
                <Button size="h24" variant="outline" className="">
                  <Icons.Trash /> 전체삭제
                </Button>
              </div>
            </div>
          </div>

          {/* 등록국가 */}
          <div data-slot="country-wrap" className="border-border-200 flex w-60 flex-col border">
            <div className="bg-bg-50 flex border-b p-2">
              <h2 className="text-xs font-semibold">등록국가</h2>
              <p className="text-p-color-4 ml-auto text-xs font-semibold">3개국</p>
            </div>
            {/* <div className="flex items-center gap-2 border-b p-2 text-xs font-medium">
              등록국수 : 3개국
            </div> */}
            <div data-slot="country-body" className="flex flex-1 flex-col overflow-auto">
              {!registerCountry.length && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2">
                  <Icons.Earth className="text-text-100" />
                  <p className="text-text-200 text-xs">선택된 국가가 없습니다.</p>
                </div>
              )}
              {registerCountry.map((item) => {
                return (
                  <Label className="hover:bg-bg-100 text-text flex items-center gap-2 p-2 text-xs">
                    <Checkbox size="sm" /> <span className="w-10 text-center">TR</span>{" "}
                    <span>튀르키에</span>
                  </Label>
                );
              })}
            </div>
            <div data-slot="footer" className="bg-bg-50 flex items-center gap-2 border-t p-2">
              <Button size="h24" variant="outline" className="ml-auto">
                <Icons.Minus /> 삭제
              </Button>
              <Button size="h24" variant="outline" className="">
                <Icons.Trash /> 전체삭제
              </Button>
            </div>
          </div>
        </div>
        <AddItem open={addItem} onOpenChange={setAddItem} title="실적분배 등록" />
      </FormDialog>
    </FormProvider>
  );
};
