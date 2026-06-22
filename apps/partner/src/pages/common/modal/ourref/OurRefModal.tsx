import { type TestFormInput, TestSchema } from "../../../pub/schema.ts";
import { CustomScrollArea, FormDialog, DataTable } from "@repo/ui";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemberSearchBox } from "./name-tag/OurRefTag.tsx";
import { useOurRefs } from "@pages/common/modal/ourref/model/useOurRefs.ts";
import { columnsData } from "@pages/common/modal/ourref/columns/columnsData.tsx";
import { type SearchAppItem } from "@shared/api/common/commApi.ts";

export type InputKeyInfoType = {
  inputKey: string;
  inputName: string;
};

export type SuccessOurRefData = {
  input: InputKeyInfoType;
  ourRefInfo: SearchAppItem[];
};

type UserModalProps = {
  input: InputKeyInfoType;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: SuccessOurRefData) => void;
};

export const OurRefModal = ({ title, open, onOpenChange, onSuccess, input }: UserModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });

  const { ourRef, check, setCheck, memFind, clearCheck, isLoading } = useOurRefs();

  /**
   * 항목 선택 핸들러
   * DataTable의 onRowClick: (row: Row<TData>, rowData: TData) => void 규격에 맞춤
   */
  const handleSelect = (_row: any, rowData: SearchAppItem) => {
    const rtnData: SuccessOurRefData = {
      ourRefInfo: [rowData], // 클릭한 행의 전체 데이터 객체 전달
      input,
    };

    onSuccess?.(rtnData); // 부모 컴포넌트(DefaultInfo)의 매핑 로직 실행
    onOpenChange(false);   // 모달 닫기
    clearCheck();          // 상태 초기화
  };

  const onSubmit = () => {
    // 선택된 데이터가 check 상태에 배열 형태로 저장되어 있으므로 이를 활용합니다.
    if (check && check.length > 0) {
      const rtnData: SuccessOurRefData = {
        ourRefInfo: check, // 선택된 행의 전체 데이터 객체들 전달
        input,
      };
      onSuccess?.(rtnData);
    }

    onOpenChange(false); // 모달 닫기
    clearCheck();        // 상태 초기화
  };

  function onChangeModal(isOpen: boolean) {
    if (!isOpen) clearCheck();
    onOpenChange(isOpen);
  }

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="확인"
        open={open}
        onOpenChange={onChangeModal}
        className="max-w-[1200px]!" // 컬럼 너비(min 200px)를 고려하여 충분히 확장
        bodyFull
      >
        <div className="flex flex-col h-[650px]">
          {/* 검색 바 영역 */}
          <div className="border-border-100 bg-bg-50 dark:border-input dark:bg-background-color flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-4 w-full">
              <MemberSearchBox memFind={memFind} />
              {isLoading && (
                <div className="flex items-center gap-2 text-blue-500 text-sm animate-pulse">
                  <span>데이터를 불러오는 중입니다...</span>
                </div>
              )}
            </div>
          </div>

          {/* 테이블 데이터 영역 */}
          <div className="flex-1 overflow-hidden">
            <CustomScrollArea className="h-full">
              <DataTable
                columns={columnsData}
                data={ourRef}
                isLoading={isLoading}
                onRowClick={handleSelect} // 행 클릭 시 즉시 선택 로직 실행
                getSelectedRow={(selectedItems) => setCheck(selectedItems)} // 체크박스 선택 연동
                getRowId={(row) => String(row.appSeq || row.appNo || '')} // row 선택 식별자 추가
                size="sm"
                height={550} // 내부 스크롤을 위한 높이 설정
              />

              {!isLoading && ourRef.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <p>검색 결과가 없습니다.</p>
                  <p className="text-xs mt-1">OurRef 또는 사건번호로 검색해 주세요.</p>
                </div>
              )}
            </CustomScrollArea>
          </div>
        </div>
      </FormDialog>
    </FormProvider>
  );
};


// import { type TestFormInput, TestSchema } from "../../../pub/schema.ts";
// import { CustomScrollArea, FormDialog } from "@repo/ui";
// import React from "react";
// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { MemberSearchBox, OurRefTag } from "./name-tag/OurRefTag.tsx";
// import {
//   type NameTagTypes,
//   type RtnOurRefDataType,
//   useOurRefs,
// } from "@pages/common/modal/ourref/model/useOurRefs.ts";

// export type InputKeyInfoType = {
//   inputKey: string;
//   inputName: string;
// };
// export type SuccessOurRefData = {
//   input: InputKeyInfoType;
//   ourRefInfo: any[]; // API 응답 전체 데이터를 넘기기 위해 any[]로 확장
// };

// type UserModalProps = {
//   input: InputKeyInfoType;
//   title?: string;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSuccess?: (rtnData: SuccessOurRefData) => void;
// };

// export const OurRefModal = ({ title, open, onOpenChange, onSuccess, input }: UserModalProps) => {
//   const form = useForm<TestFormInput>({
//     resolver: zodResolver(TestSchema),
//     defaultValues: TestSchema.parse({}),
//   });

//   const { ourRef, memFind, clearCheck } = useOurRefs();

//   // [수정] 항목 선택 시 즉시 호출되는 함수
//   const handleSelect = (item: any) => {
//     const rtnData: SuccessOurRefData = {
//       ourRefInfo: [item], // 선택한 아이템 한 개를 배열에 담음
//       input,
//     };

//     onSuccess?.(rtnData); // 부모(DefaultInfo)의 onSuccess 실행 (값 채우기)
//     onOpenChange(false);   // 모달 닫기
//     clearCheck();          // 선택 상태 초기화
//   };

//   // 모달 하단 '확인' 버튼 클릭 시 (체크박스 선택용 유지 시)
//   const onSubmit = () => {
//     // 만약 체크된 여러 개를 한 번에 보내야 한다면 기존 로직을 쓰겠지만,
//     // 보통 OurRef는 하나만 고르므로 handleSelect와 통합하거나 닫기 용도로 씁니다.
//     onOpenChange(false);
//   };

//   function onChangeModal(isOpen: boolean) {
//     if (!isOpen) clearCheck();
//     onOpenChange(isOpen);
//   }

//   return (
//     <FormProvider {...form}>
//       <FormDialog
//         title={title}
//         onSubmit={onSubmit}
//         submitText="확인"
//         open={open}
//         onOpenChange={onChangeModal}
//         className="max-w-180!"
//         bodyFull
//         // 하단 확인 버튼이 필요 없다면 footer={null} 등을 고려할 수 있습니다.
//       >
//         <div className="border-border-100 dark:border-input flex border-y">
//           <CustomScrollArea className="h-100 w-full">
//             <div className="flex-1">
//               <div className="border-border-100 bg-bg-100 dark:border-input dark:bg-background-color flex justify-between border-b p-2">
//                 <MemberSearchBox memFind={memFind} />
//               </div>
//               <div className="p-2">
//                 {ourRef.map((item: any) => {
//                   return (
//                     <div
//                       className="flex gap-2 cursor-pointer hover:bg-bg-200 transition-colors"
//                       key={item.appSeq} // [수정] UUID 대신 고유 ID 사용
//                       onClick={() => handleSelect(item)} // [추가] 클릭 시 즉시 선택
//                       onDoubleClick={() => handleSelect(item)} // [추가] 더블 클릭 시 즉시 선택
//                     >
//                       <OurRefTag
//                         id={item.appSeq}
//                         ourRef={item.ourRef}
//                         // Tag 자체의 클릭 이벤트는 무시하거나 handleSelect 연결
//                         onSelect={() => {}}
//                         checked={false} // 즉시 닫히므로 체크 상태 의미 없음
//                       />
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </CustomScrollArea>
//         </div>
//       </FormDialog>
//     </FormProvider>
//   );
// };

// // import { type TestFormInput, TestSchema } from "../../../pub/schema.ts";
// // import { CustomScrollArea, FormDialog } from "@repo/ui";
// // import React from "react";
// // import { FormProvider, useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { MemberSearchBox, OurRefTag } from "./name-tag/OurRefTag.tsx";
// // import {
// //   type NameTagTypes,
// //   type RtnOurRefDataType,
// //   useOurRefs,
// // } from "@pages/common/modal/ourref/model/useOurRefs.ts";

// // export type InputKeyInfoType = {
// //   inputKey: string;
// //   inputName: string;
// // };
// // export type SuccessOurRefData = {
// //   input: InputKeyInfoType;
// //   ourRefInfo: RtnOurRefDataType[];
// // };



// // type UserModalProps = {
// //   input: InputKeyInfoType;
// //   title?: string;
// //   open: boolean;
// //   onOpenChange: (open: boolean) => void;
// //   onSuccess?: (rtnData: SuccessOurRefData) => void;
// // };

// // export const OurRefModal = ({ title, open, onOpenChange, onSuccess, input }: UserModalProps) => {
// //   const form = useForm<TestFormInput>({
// //     resolver: zodResolver(TestSchema),
// //     defaultValues: TestSchema.parse({}),
// //   });
// //   const onSubmit = () => {
// //     onOpenChange(false);
// //     const rtnData: SuccessOurRefData = {
// //       ourRefInfo: check,
// //       input,
// //     };
// //     clearCheck();
// //     onSuccess?.(rtnData);
// //   };

// //   const { check, ourRef, selectHandle, memFind, singleSelectHandle, clearCheck } = useOurRefs();

// //   function onChangeModal(isOpen: boolean) {
// //     clearCheck();
// //     onOpenChange(isOpen);
// //   }

// //   function isCheck(item: NameTagTypes) {
// //     const checkData = check.filter((i) => i.id === item.id);
// //     if (checkData.length > 0) {
// //       return true;
// //     } else {
// //       return false;
// //     }
// //   }

// //   return (
// //     <FormProvider {...form}>
// //       <FormDialog
// //         title={title}
// //         onSubmit={onSubmit}
// //         submitText="확인"
// //         open={open}
// //         onOpenChange={onChangeModal}
// //         className="max-w-180!"
// //         bodyFull
// //       >
// //         <div className="border-border-100 dark:border-input flex border-y">
// //           <CustomScrollArea className="h-100 w-full">
// //             <div className="flex-1">
// //               <div className="border-border-100 bg-bg-100 dark:border-input dark:bg-background-color flex justify-between border-b p-2">
// //                 <MemberSearchBox memFind={memFind} />
// //               </div>
// //               <div className="p-2">
// //                 {ourRef.map((item) => {
// //                   return (
// //                     <div className="flex gap-2" key={crypto.randomUUID()}>
// //                       <OurRefTag
// //                         id={item.id}
// //                         ourRef={item.ourRef}
// //                         onSelect={() => singleSelectHandle(item)}
// //                         checked={isCheck(item)}
// //                       >
// //                       </OurRefTag>
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             </div>
// //           </CustomScrollArea>
// //         </div>
// //       </FormDialog>
// //     </FormProvider>
// //   );
// // };
