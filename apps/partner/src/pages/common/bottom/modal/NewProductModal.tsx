import { Button, DataTable, FlexBox, FormDialog, Input } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { useCallback, useEffect, useMemo, useState } from "react";
import { masterColumns, classColumns, classColumnsGoodsNoHeaderSelectAll } from "../../../pub/modal20/columns/columnsData";
import { niceProductApi, type ClassResponse } from "../../../pub/modal20/api/niceProductApi";
import { apiClient } from "@shared/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { Search } from "lucide-react";

// 2026 04 21 shchoi

export const NewProductModal = ({ title, open, onOpenChange, onSuccess, propData, rowData }: ModalProps & { propData?: any, rowData?: any }) => {
  const queryClient = useQueryClient();

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
      setGoodsItems(data.data);
    },
  });

  // 현재 선택한 중분류 key
  const [masterKey, setMasterKey] = useState<string | null>(null);

  const [masterRowSelected, setMasterRowSelected] = useState<Record<string, boolean>>({});
  const [goodsRowSelected, setGoodsRowSelected] = useState<Record<string, boolean>>({});

  //소분류 데이터
  const [goodsItems, setGoodsItems] = useState<ClassResponse[]>([]);

  // 선택한 자동 입력 데이터
  const [selectedItems, setSelectedItems] = useState<ClassResponse[]>([]);

  // 결과리스트에 노출 데이터
  const [resultItems, setResultItems] = useState<ClassResponse[]>([]);
  const [resultSelected, setResultSelected] = useState<Record<string, boolean>>({});

  // last 선택 row
  const [lastSelectedRowId, setLastSelectedRowId] = useState<string>("");
  const [allCheck, setAllCheck] = useState<boolean>(false);

  // 지정상품 검색어
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 검색어 기반 지정상품 필터링
  const filteredGoodsItems = useMemo(() => {
    if (!searchTerm.trim()) return goodsItems;
    const lower = searchTerm.toLowerCase();
    return goodsItems.filter(
      (item) =>
        item.productNmKo?.toLowerCase().includes(lower) ||
        item.productNmEn?.toLowerCase().includes(lower),
    );
  }, [goodsItems, searchTerm]);

  const isEditMode = !!rowData?.productGroupId;

  const { openAlert } = useAlertStore();

  const createProductMutation = useMutation({
    mutationFn: async (payload: any) => await apiClient.axios.post("/api/product/tab/register", payload),
    onSuccess: (response) => {
      console.log("[성공]", response);

      // 저장 성공 후 기존 상세 데이터 캐시 초기화
      queryClient.invalidateQueries({ queryKey: ["productDetail"] });

      onOpenChange(false);
      onSuccess?.({
        callbackData: "PRODUCT",
      });
      setTimeout(() => {
        openAlert({
          className: "w-[400px]",
          message: isEditMode ? "수정 완료하였습니다" : "저장 완료하였습니다",
          confirmText: "확인",
        });
      }, 300);
    },
  });

  const onSubmit = () => {
    if (selectedItems.length === 0) {
      openAlert({
        className: "w-[400px]",
        message: "지정상품을 선택해주세요",
        confirmText: "확인",
      });
      return;
    }

    openAlert({
      className: "w-[400px]",
      message: isEditMode ? "수정하시겠습니까?" : "저장하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        try {
          const payload = {
            prodList: selectedItems.map((item) => ({
              appSeq: propData,
              productId: String(item.productId),
              niceVersion: item.niceVersion,
              ProductClass: item.classNo,
              productCount: selectedItems.length,
              productNameKo: item.productNmKo,
              productNameEn: item.productNmEn,
              note: item.note ?? "",
            })),
            productGroupId: rowData?.productGroupId ?? "",
          };

          createProductMutation.mutate(payload);
        } catch (error) {
          console.error(error);
          openAlert({
            title: "에러 발생",
            message: "저장 중 오류가 발생했습니다.",
            confirmText: "확인",
          });
        }
      },
    });
  };

  const subHandler = useCallback((value?: ClassResponse[]) => {
    setSelectedItems((prev) => {
      const exists = prev.some((item) => String(item.productId) === lastSelectedRowId);
      if (!exists) {
        return [
          ...prev,
          ...filteredGoodsItems.filter((item) => String(item.productId) === lastSelectedRowId),
        ];
      }
      return prev.filter((item) => String(item.productId) !== lastSelectedRowId);
    });

    const isAllCheck = value?.length === filteredGoodsItems.length && filteredGoodsItems.length > 0;
    setAllCheck(isAllCheck);
  }, [filteredGoodsItems, lastSelectedRowId]);

  const resultHandler = (value: ClassResponse[], table: any) => {
    const keys = Array.from(new Set(value.map((item) => item.productId)));
    const deleteItems = selectedItems.filter((item) => !keys.some((v) => v === item.productId));
    setResultItems(value);
  };

  const allDeleteHandler = () => {
    setSelectedItems([]);
    setResultItems([]);
    setResultSelected({});
  };

  const selectedDeleteHandler = () => {
    const keys = Array.from(new Set(resultItems.map((item) => item.productId)));
    const deleteItems = selectedItems.filter((item) => !keys.some((v) => v === item.productId));
    setSelectedItems(deleteItems);
    setResultItems([]);
    setResultSelected({});
  };

  useEffect(() => {
    const keys = Array.from(new Set(selectedItems.map((item) => item.productId)));
    const uniqueKeys = keys.filter((v) => v != null);
    const checked = uniqueKeys.reduce<Record<string, boolean>>((acc, curr) => {
      acc[String(curr)] = true;
      return acc;
    }, {});
    setGoodsRowSelected(checked);
  }, [selectedItems]);

  useEffect(() => {
    const keys = new Set(filteredGoodsItems.map((item) => item.productId));
    if (allCheck && lastSelectedRowId === "0") {
      setSelectedItems((prev) => [
        ...new Map([...prev, ...filteredGoodsItems].map((item) => [item.productId, item])).values(),
      ]);
      return;
    }

    if (!allCheck && lastSelectedRowId === "0") {
      setSelectedItems((prev) => prev.filter((item) => !keys.has(item.productId)));
    }
  }, [allCheck, filteredGoodsItems, lastSelectedRowId]);

  const detailQuery = useQuery({
    queryKey: ["productDetail", propData, rowData?.productGroupId],
    queryFn: async () => {
      const res = await apiClient.axios.get(`/api/product/tab/${propData}/${rowData.productGroupId}`);
      return res.data.data;
    },
    enabled: !!open && !!rowData?.productGroupId,
    gcTime: 0,
    staleTime: 0,
  });

  const handleLeftTableClick = (key: string) => {
    if (key !== masterKey) {
      setMasterKey(key);
      // 수동으로 Class가 변경되면 기존 지정상품 선택내역 초기화
      setSelectedItems([]);
      setResultItems([]);
      setResultSelected({});
      setAllCheck(false);
      setLastSelectedRowId("");
      setSearchTerm("");
    }
  };

  useEffect(() => {
    if (open) {
      if (rowData?.productGroupId) {
        // 수정 모드: detailQuery 완료 후 세팅됨
      } else if (masterData?.data && masterData.data.length > 0) {
        // 등록 모드: 첫 번째 Class로 기본 세팅
        setMasterKey(masterData.data[0].classNo);
      }
    } else {
      setMasterKey("");
      setGoodsItems([]);
      setSelectedItems([]);
      setResultItems([]);
      setResultSelected({});
      setAllCheck(false);
      setLastSelectedRowId("");
      setSearchTerm("");
    }
  }, [open, masterData, rowData]);

  useEffect(() => {
    if (open && rowData?.productGroupId && detailQuery.data) {
      const detail = detailQuery.data;
      setMasterKey(detail.productClass);

      const mappedItems = detail.prodList.map((item: any) => ({
        ...item,
        classNo: detail.productClass,
        productNmKo: item.productSummaryKo,
        productNmEn: item.productSummaryEn,
      }));

      setSelectedItems(mappedItems);
    }
  }, [open, rowData, detailQuery.data]);

  useEffect(() => {
    if (masterKey) {
      classListMutation.mutateAsync({ classNo: masterKey });
      setMasterRowSelected({ [masterKey]: true });
    }
  }, [masterKey]);

  const TABLE_CLS =
    "max-h-[min(400px,35vh)] overflow-x-auto! overflow-y-auto! [&>[data-slot=table-container]]:h-auto! [&>[data-slot=table-container]]:min-w-[600px]!";

  const MASTER_TABLE_CLS =
    "max-h-[min(400px,35vh)] overflow-x-auto! overflow-y-auto! [&>[data-slot=table-container]]:h-auto! [&>[data-slot=table-container]]:min-w-[260px]!";

  return (
    <FormDialog
      title={title}
      onSubmit={onSubmit}
      submitText={isEditMode ? "수정" : "확인"}
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-[min(1100px,92vw)]!"
    >
      <div>
        <FlexBox className="gap-4 items-start">
          <div className="flex-1 min-w-0">
            <h2 className="mb-2 text-sm font-bold">Class 선택</h2>
            <DataTable
              id="Class 선택"
              data={masterData?.data ?? []}
              columns={masterColumns}
              className={MASTER_TABLE_CLS}
              size="sm"
              enableMultiRowSelection={false}
              rowSelection={masterRowSelected}
              onRowSelectionChange={(selection) => {
                setMasterRowSelected(selection);
                const selectedKey = Object.keys(selection).find(key => selection[key]);
                if (selectedKey) handleLeftTableClick(selectedKey);
              }}
              getRowId={(row) => String(row.classNo)}
              isLoading={isPending}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-sm font-bold shrink-0">
                지정상품{" "}
                <span className="text-p-color-1 font-medium">
                  {searchTerm
                    ? `(${filteredGoodsItems.length}/${goodsItems.length})`
                    : `(${goodsItems?.length ?? 0})`}
                </span>
              </h2>
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  className="h-6 pl-6 text-xs"
                  placeholder="국문 / 영문 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <DataTable
              data={filteredGoodsItems}
              columns={classColumnsGoodsNoHeaderSelectAll}
              className={TABLE_CLS}
              size="sm"
              getSelectedRow={subHandler}
              onRowSelectionChange={setGoodsRowSelected}
              rowSelection={goodsRowSelected}
              getRowId={(row) => String(row.productId)}
              setLastSelectedRowId={setLastSelectedRowId}
              isLoading={classListMutation.isPending}
            />
          </div>
        </FlexBox>
        <div className="mt-4">
          <div className="mb-2 flex justify-between">
            <h2 className="text-p-color-1 pb-2 text-[14px]">
              추가할 지정상품을 선택해 주세요.
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
            columns={classColumns}
            className={TABLE_CLS}
            size="sm"
            getSelectedRow={resultHandler}
            rowSelection={resultSelected}
            onRowSelectionChange={setResultSelected}
            getRowId={(row) => String(row.productId)}
          />
        </div>
      </div>
    </FormDialog>
  );
};
