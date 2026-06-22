import Lnb from "@shared/lnb/Lnb";
import Top from "@shared/top/Top";
import { Outlet } from "react-router-dom";

const Default = () => {
  return (
    <>
      <Top />
      <div className="flex">
        <Lnb />
        <div className="min-w-0 flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Default;
