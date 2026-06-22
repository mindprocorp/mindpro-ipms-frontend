import { InfiniteDataTable, FlexBox, DataTable, FormDialog, Button, InfoBox } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { useCallback, useEffect, useRef, useState } from "react";
import { masterColumns, classColumns } from "./columns/columnsData";
import { niceProductApi, type ClassResponse, type NiceProductResponse } from "./api/niceProductApi";
import { apiClient } from "@shared/api/client";
import { useMutation, useQuery } from "@tanstack/react-query";

type ApiResponse = {
  data: NiceProductResponse[];
  meta: {
    totalRowCount: number;
  };
};

export const Modal21 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
      goodsItemsRef.current = data.data;
    },
  });

  const rowSize = 10;

  const goodsItemsRef = useRef<ClassResponse[] | null>(null);

  // 현재 선택한 중분류 key
  const [masterKey, setMasterKey] = useState<string | null>(null);

  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    onSuccess?.(undefined);
  };

  const subHandler = useCallback((value?: ClassResponse[]) => {
    console.log("++++++++++++++++++++++++++++++++++", value);
  }, []);

  useEffect(() => {
    if (open) {
      setMasterKey(masterData?.data[0].classNo ?? "");
      return;
    }
    setMasterKey("");
  }, [open]);

  useEffect(() => {
    if (masterKey) {
      classListMutation.mutateAsync({ classNo: masterKey });
    }
  }, [masterKey]);

  const wipoPage = () => {
    window.open("http://www.wipo.int/classifications/nivilo/", "_blank", "noopener,noreferrer");
  };

  return (
    <FormDialog
      title={title}
      onSubmit={onSubmit}
      submitText="확인"
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-7/10!"
    >
      <div>
        <InfoBox>
          <li>
            선택된 지정상품에 대한 영문지정상품명은 편의를 위해 제공되는 것으로, 외국어 출원하고자
            할 경우에 그대로 인정되는 명칭이 아님을 알려드립니다.
          </li>
          <li>구체적인 사항은 WIPO의 다음 주소를 참조하시기 바랍니다.</li>
          <Button variant="blue" onClick={wipoPage} className="absolute top-2 right-2">
            세계지식재산기구(WIPO) 국제분류
          </Button>
        </InfoBox>
        <FlexBox className="mt-3">
          <div className="flex-1">
            <h2 className="mb-2 text-sm font-bold">Class 선택</h2>
            <InfiniteDataTable
              data={masterData?.data ?? []}
              columns={masterColumns}
              className="h-100 min-w-0 flex-1 [&>div]:h-100!"
              size="sm"
              enableMultiRowSelection={false}
              getRowId={(row) => String(row.classNo)}
              setLastSelectedRowId={setMasterKey}
              isLoading={isPending}
              getSelectedRow={subHandler}
              columnPinning={{ left: ["classNo"] }}
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
            <InfiniteDataTable
              data={goodsItemsRef.current ?? []}
              columns={classColumns}
              className="h-100 min-w-0 flex-1"
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
