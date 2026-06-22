import { Route, Routes, useLocation } from "react-router-dom";

import { PrivateLayout } from "./layout/PrivateLayout";
import OnlyTop from "./layout/page/OnlyTop";
import Dashboard from "@pages/dashboard/Dashboard";
import Login from "@pages/auth/login/Login";
import Join from "@pages/auth/join/Join";
import JoinComplete from "@pages/auth/join/Complete";
import IdFind from "@pages/auth/idFind/IdFind";
import NotFound from "@widgets/notFound/NotFound";
import PwFind from "@pages/auth/pwFind/PwFind";
import { useEffect } from "react";
import { useAlertStore } from "@shared/store/useAlertStore";
import Modify from "@pages/auth/join/Modify";

export function AppRoutes() {
  const location = useLocation();
  const close = useAlertStore((state) => state.close);
  useEffect(() => {
    close();
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route path="/complete" element={<JoinComplete />} />
      <Route path="/idFind" element={<IdFind />} />
      <Route path="/pwFind" element={<PwFind />} />
      <Route path="/memModify" element={<Modify />} />

      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<OnlyTop />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
