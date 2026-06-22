import { Button, CustomScrollArea, DataTable, FlexBox, FormDialog, Icons } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { useEffect, useRef, useState } from "react";
import { columnsResult, subClassColumns, goodsColumns } from "./columns/columnsData";
import { locarnoApi, type LocarnoResponse } from "./api/locarnoApi";
import { apiClient } from "@shared/api/client";
import { useMutation } from "@tanstack/react-query";
import React from "react";

export const Modal19 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  //물품류
  const locarnoListMutation = useMutation({
    mutationFn: async () => await locarnoApi(apiClient).getList(),
    onSuccess: (data) => {
      getClassData(data.data);
      setSubClassRowSelected({});
    },
  });

  //물폼군
  const locarnoClassListMutation = useMutation({
    mutationFn: async (classNo: string) => await locarnoApi(apiClient).getClassList(classNo),
    onSuccess: (data) => {
      setSubClassItems(data.data);
      setSubClassKey(data.data[0].subclassNo);
      setSubClassRowSelected({ [data.data[0].subclassNo as string]: true });
    },
  });

  //물품군 명칭
  const locarnoGoodListMutation = useMutation({
    mutationFn: async ({ classNo, subClassNo }: { classNo: string; subClassNo: string }) =>
      await locarnoApi(apiClient).getGoodList(classNo, subClassNo),
    onSuccess: (data) => {
      setGoodsItems(data.data);
    },
  });

  // 현재 선택한 대분류 key
  const [classKey, setClassKey] = useState("");

  // 현재 선택한 중분류 key
  const [subClassKey, setSubClassKey] = useState<string | null>(null);

  const [subClassRowSelected, setSubClassRowSelected] = useState<Record<string, boolean>>({});

  const [goodsRowSelected, setGoodsRowSelected] = useState<Record<string, boolean>>({});

  //대분류 데이터
  const classItems = useRef<LocarnoResponse[]>([]);

  //중분류 데이터
  const [subClassItems, setSubClassItems] = useState<LocarnoResponse[]>([]);

  //소분류 데이터
  const [goodsItems, setGoodsItems] = useState<LocarnoResponse[]>([]);

  // 선택한 자동 입력 데이터
  const [selectedItems, setSelectedItems] = useState<LocarnoResponse[]>([]);

  // 결과리스트에 노출 데이터
  const [resultItems, setResultItems] = useState<LocarnoResponse[]>([]);
  const [resultSelected, setResultSelected] = useState<Record<string, boolean>>({});

  // last 선택 row
  const [lastSelectedRowId, setLastSelectedRowId] = useState<string>("");
  const [allCheck, setAllCheck] = useState<boolean>(false);

  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    onSuccess?.(undefined);
  };

  const majorHandler = (value: string) => {
    setClassKey(value);
  };

  const mediumHandler = (value: LocarnoResponse[]) => {
    const { subclassNo } = value[0];
    setSubClassKey(subclassNo);
  };

  const subHandler = (value?: LocarnoResponse[]) => {
    setSelectedItems((prev) => {
      const exists = prev.some((item) => String(item.goodsSeq) === lastSelectedRowId);
      if (!exists) {
        return [
          ...prev,
          ...goodsItems.filter((item) => String(item.goodsSeq) === lastSelectedRowId),
        ];
      }
      return prev.filter((item) => String(item.goodsSeq) !== lastSelectedRowId);
    });

    const isAllCheck = value?.length === goodsItems.length;
    setAllCheck(isAllCheck);
  };

  const resultHandler = (value: LocarnoResponse[], table: any) => {
    const keys = Array.from(new Set(value.map((item) => item.goodsSeq)));
    const deleteItems = selectedItems.filter((item) => !keys.some((v) => v === item.goodsSeq));
    setResultItems(value);
  };

  const getClassData = (data: LocarnoResponse[]) => {
    if (!classKey) {
      classItems.current = data;
      setClassKey(classItems.current[0].classNo);
    }
  };

  const subClassRowSelectedHandler = (value: Record<string, boolean>) => {
    setSubClassRowSelected(value);
  };

  const allDeleteHandler = () => {
    setSelectedItems([]);
    setResultItems([]);
    setResultSelected({});
  };
  const selectedDeleteHandler = () => {
    const keys = Array.from(new Set(resultItems.map((item) => item.goodsSeq)));
    const deleteItems = selectedItems.filter((item) => !keys.some((v) => v === item.goodsSeq));
    setSelectedItems(deleteItems);
    setResultItems([]);
    setResultSelected({});
  };

  useEffect(() => {
    const keys = Array.from(new Set(selectedItems.map((item) => item.goodsSeq)));
    const uniqueKeys = keys.filter((v) => v != null);
    const checked = uniqueKeys.reduce<Record<string, boolean>>((acc, curr) => {
      acc[String(curr)] = true;
      return acc;
    }, {});
    setGoodsRowSelected(checked);
  }, [selectedItems]);

  useEffect(() => {
    const keys = new Set(goodsItems.map((item) => item.goodsSeq));
    if (allCheck && lastSelectedRowId === "0") {
      const unique = [
        ...new Map([...selectedItems, ...goodsItems].map((item) => [item.goodsSeq, item])).values(),
      ];
      setSelectedItems((prev) => {
        return unique;
      });
      return;
    }

    if (!allCheck && lastSelectedRowId === "0") {
      setSelectedItems((prev) => prev.filter((item) => !keys.has(item.goodsSeq)));
    }
  }, [allCheck]);

  useEffect(() => {
    locarnoListMutation.mutate();
  }, []);

  useEffect(() => {
    if (classKey) {
      locarnoClassListMutation.mutate(classKey);
    }
  }, [classKey]);

  useEffect(() => {
    if (subClassKey) {
      locarnoGoodListMutation.mutate({ classNo: classKey, subClassNo: subClassKey });
    }
  }, [subClassKey]);

  return (
    <FormDialog
      title={title}
      onSubmit={onSubmit}
      submitText="확인"
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-9/10!"
    >
      <div>
        <FlexBox className="">
          <div className="flex-1">
            <h2 className="mb-2 text-sm font-bold">물품류</h2>
            <div className="border-border-200 overflow-hidden rounded-md border">
              <div className="h-100 overflow-auto">
                {classItems.current?.map((item) => {
                  return (
                    <React.Fragment key={item.classNo}>
                      <div
                        data-selected={classKey === item.classNo}
                        className="hover:bg-bg-100 border-border-100 data-[selected=true]:bg-info-bg data-[selected=true]:[&>p]:text-p-color-1 relative flex-1 cursor-pointer p-3 [&+div]:border-t [&>p]:text-xs"
                        onClick={() => majorHandler(item.classNo)}
                      >
                        <p className="pb-1 text-[14px]! font-semibold">{item.classNmKo}</p>
                        <p className="">{item.classNmEn}</p>
                        {classKey === item.classNo && (
                          <Icons.Check className="absolute top-1/2 right-2 -translate-1/2" />
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="mb-2 text-sm font-bold">물폼군</h2>
            <DataTable
              data={subClassItems}
              columns={subClassColumns}
              className="h-100 min-w-0 flex-1 [&>div]:h-100!"
              size="sm"
              enableMultiRowSelection={false}
              getSelectedRow={mediumHandler}
              rowSelection={subClassRowSelected}
              onRowSelectionChange={(value) => subClassRowSelectedHandler(value)}
              getRowId={(row) => String(row.subclassNo)}
              isLoading={locarnoClassListMutation.isPending}
            />
          </div>
          <div className="flex-1">
            <h2 className="mb-2 text-sm font-bold">물품군 명칭</h2>
            <DataTable
              data={goodsItems}
              columns={goodsColumns}
              className="h-100 min-w-0 flex-1 [&>div]:h-100!"
              size="sm"
              getSelectedRow={subHandler}
              onRowSelectionChange={setGoodsRowSelected}
              rowSelection={goodsRowSelected}
              getRowId={(row) => String(row.goodsSeq)}
              setLastSelectedRowId={setLastSelectedRowId}
              setAllCheck={setAllCheck}
              isLoading={locarnoGoodListMutation.isPending}
            />
          </div>
        </FlexBox>
        <div className="mt-4">
          <div className="mb-2 flex justify-between">
            <h2 className="text-p-color-1 pb-2 text-[14px]">
              로카르노를 추가하려면 위 코드표에서 [물품군]을 선택 후, 추가할 [물품의 명칭]을
              체크하시면 됩니다.
            </h2>
            <div className="flex gap-1">
              <Button size="h24" onClick={allDeleteHandler} disabled={selectedItems.length === 0}>
                전체삭제
              </Button>
              <Button size="h24" disabled={!resultItems.length} onClick={selectedDeleteHandler}>
                선택삭제
              </Button>
            </div>
          </div>

          <DataTable
            data={selectedItems}
            columns={columnsResult}
            className="h-100 min-w-0 flex-1 [&>div]:h-100!"
            size="sm"
            getSelectedRow={resultHandler}
            rowSelection={resultSelected}
            onRowSelectionChange={setResultSelected}
            getRowId={(row) => String(row.goodsSeq)}
          />
        </div>
      </div>
    </FormDialog>
  );
};
