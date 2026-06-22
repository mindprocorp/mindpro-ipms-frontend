import { DataTable } from "@repo/ui";
import { columnsData, columnsDataNested, type Payment } from "./columns";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
];

export const BoardList = () => {
  return (
    <div className="">
      <div className="my-2 mt-4">
        <p className="text-text-200 text-sm">
          총 <span className="text-p-color-1 font-bold">100</span>건의 결과가 있습니다.
        </p>
      </div>
      <DataTable data={data} columns={columnsData} />
    </div>
  );
};

export const BoardListNested = () => {
  return (
    <div className="">
      <div className="my-2 mt-4">
        <p className="text-text-200 text-sm">
          총 <span className="text-p-color-1 font-bold">100</span>건의 결과가 있습니다.
        </p>
      </div>
      <DataTable data={data} columns={columnsDataNested} />
    </div>
  );
};
