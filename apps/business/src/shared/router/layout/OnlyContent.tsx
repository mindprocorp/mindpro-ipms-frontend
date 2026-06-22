import { Outlet } from "react-router-dom";

const OnlyContent = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default OnlyContent;
