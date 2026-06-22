import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Gnb from "@shared/ui/gnb/Gnb";
import PageBody from "@shared/ui/PageBody";
import { useAlertStore } from "@shared/store/useAlertStore";

const OnlyTop = () => {
  const location = useLocation();
  const close = useAlertStore((state) => state.close);

  useEffect(() => { close(); }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Gnb />
      <PageBody>
        <Outlet />
      </PageBody>
    </>
  );
};

export default OnlyTop;
