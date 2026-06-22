import type React from "react";

type ListResultHeaderProps = {
  totalCount: number;
  children?: React.ReactNode;
};

const ListResultHeader = ({ totalCount, children }: ListResultHeaderProps) => {
  return (
    <div className="mt-2 mb-1.5 flex w-full items-center justify-between">
      <p className="text-xs text-slate-500">
        총 <span className="text-blue-500 font-semibold">{totalCount}</span>건의 결과가 있습니다.
      </p>
      {children && (
        <div className="flex flex-none items-center gap-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default ListResultHeader;
