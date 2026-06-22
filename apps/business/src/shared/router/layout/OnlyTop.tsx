import Top from "@shared/top/Top";
import { Outlet } from "react-router-dom";

const OnlyTop = () => {
  return (
    <>
      <Top />
      <div className="flex min-w-0">
        <Outlet />
      </div>
    </>
  );
};

export default OnlyTop;
