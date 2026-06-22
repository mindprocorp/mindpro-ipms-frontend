import { Button, CustomScrollArea, DataTable, FlexBox, FormDialog, Icons } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { useCallback, useEffect, useRef, useState } from "react";
import { masterColumns, classColumns } from "./columns/columnsData";
import { niceProductApi, type NiceProductResponse, type ClassResponse } from "./api/niceProductApi";
import { apiClient } from "@shared/api/client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const Modal20 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  //class
  const {
    data: masterData,
    isFetching,
    isPending,
  } = useQuery({
    queryKey: ["masterList"],
    queryFn: async () => await niceProductApi(apiClient).getMasterList(),
  });

  //지정상품
  const classListMutation = useMutation({
    mutationFn: async ({ classNo }: { classNo: string }) =>
      await niceProductApi(apiClient).getClassList(classNo),
    onSuccess: (data) => {
      // setGoodsItems(data.data);
      goodsItemsRef.current = data.data;
    },
  });

  const goodsItemsRef = useRef<ClassResponse[] | null>(null);

  // 현재 선택한 중분류 key
  const [masterKey, setMasterKey] = useState<string | null>(null);

  const [masterRowSelected, setMasterRowSelected] = useState<Record<string, boolean>>({});

  const [goodsRowSelected, setGoodsRowSelected] = useState<Record<string, boolean>>({});

  //중분류 데이터
  const [masterItems, setMasterItems] = useState<NiceProductResponse[]>([]);

  //소분류 데이터
  const [goodsItems, setGoodsItems] = useState<ClassResponse[]>([]);

  // 선택한 자동 입력 데이터
  const [selectedItems, setSelectedItems] = useState<ClassResponse[]>([]);

  // last 선택 row
  const [lastSelectedRowId, setLastSelectedRowId] = useState<string>("");
  const [allCheck, setAllCheck] = useState<boolean>(false);

  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    onSuccess?.(undefined);
  };

  // const mediumHandler = (value: NiceProductResponse[]) => {
  //   const { classNo } = value[0];
  //   setMasterKey(classNo);
  // };

  const subHandler = useCallback((value?: ClassResponse[]) => {
    console.log(value);
    // setSelectedItems((prev) => {
    //   const exists = prev.some((item) => String(item.classNo) === lastSelectedRowId);
    //   if (!exists) {
    //     return [
    //       ...prev,
    //       ...goodsItems.filter((item) => String(item.classNo) === lastSelectedRowId),
    //     ];
    //   }
    //   return prev.filter((item) => String(item.classNo) !== lastSelectedRowId);
    // });

    // const isAllCheck = value?.length === goodsItems.length;
    // setAllCheck(isAllCheck);
  }, []);

  // const subClassRowSelectedHandler = (value: Record<string, boolean>) => {
  //   setMasterRowSelected(value);
  // };

  // useEffect(() => {
  //   const keys = Array.from(new Set(selectedItems.map((item) => item.goodsSeq)));
  //   const uniqueKeys = keys.filter((v) => v != null);
  //   const checked = uniqueKeys.reduce<Record<string, boolean>>((acc, curr) => {
  //     acc[String(curr)] = true;
  //     return acc;
  //   }, {});
  //   setGoodsRowSelected(checked);
  // }, [selectedItems]);

  // useEffect(() => {
  //   const keys = new Set(goodsItems.map((item) => item.goodsSeq));
  //   if (allCheck && lastSelectedRowId === "0") {
  //     const unique = [
  //       ...new Map([...selectedItems, ...goodsItems].map((item) => [item.goodsSeq, item])).values(),
  //     ];
  //     setSelectedItems((prev) => {
  //       return unique;
  //     });
  //     return;
  //   }

  //   if (!allCheck && lastSelectedRowId === "0") {
  //     setSelectedItems((prev) => prev.filter((item) => !keys.has(item.goodsSeq)));
  //   }
  // }, [allCheck]);

  // console.log("@@@@", masterData, isFetching, isPending);

  useEffect(() => {
    if (open) {
      setMasterKey(masterData?.data[0].classNo ?? "");
      return;
    }
    setMasterKey("");
    setGoodsItems([]);
  }, [open]);

  useEffect(() => {
    if (masterKey) {
      classListMutation.mutateAsync({ classNo: masterKey });
    }
  }, [masterKey]);

  console.log("렌더링~~~");

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
            <h2 className="mb-2 text-sm font-bold">Class 선택</h2>
            <DataTable
              id="Class 선택"
              data={masterData?.data ?? []}
              columns={masterColumns}
              className="h-100 min-w-0 flex-1 [&>div]:h-100!"
              size="sm"
              enableMultiRowSelection={false}
              getRowId={(row) => String(row.classNo)}
              setLastSelectedRowId={setMasterKey}
              isLoading={isPending}
              // columnPinning={{ left: ["classNo"] }}
            />
          </div>
          <div className="flex-1">
            <h2 className="mb-2 text-sm font-bold">
              지정상품{" "}
              <span className="text-p-color-1 font-medium">
                {" "}
                {`(${goodsItemsRef.current?.length})`}
              </span>
            </h2>
            <DataTable
              data={goodsItemsRef.current ?? []}
              columns={classColumns}
              className="h-100 min-w-0 flex-1 [&>div]:h-100!"
              size="sm"
              getSelectedRow={subHandler}
              getRowId={(row) => String(row.productId)}
              isLoading={classListMutation.isPending}
            />
          </div>
        </FlexBox>
      </div>
    </FormDialog>
  );
};
