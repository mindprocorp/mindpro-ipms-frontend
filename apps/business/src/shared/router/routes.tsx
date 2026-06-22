import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAlertStore } from "@shared/store/useAlertStore";
import Default from "./layout/Default";
import Pub from "pub";
import { BoardList, BoardListNested } from "pub/BoardList";
import { PageTitle } from "@shared/page-title/PageTitle";

import { SearchBox } from "pub/SearchBox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import OnlyTop from "./layout/OnlyTop";
import OnlyContent from "./layout/OnlyContent";

import Page01 from "pub/pages/Page01";
import Page02 from "pub/pages/Page02";
import Page03 from "pub/pages/Page03";
import Page04 from "pub/pages/Page04";
import Page05 from "pub/pages/Page05";
import Page06 from "pub/pages/Page06";

const SearchSchema = z.object({
  val1: z.string().default(""),
  val2: z.string().default(""),
  val3: z.string().default(""),
});

type SearchInput = z.input<typeof SearchSchema>;

const defaultValues = {
  val1: "",
  val2: "",
  val3: "",
};

export function AppRoutes() {
  const location = useLocation();
  const close = useAlertStore((state) => state.close);
  useEffect(() => {
    close();
  }, [location.pathname]);

  const form = useForm<SearchInput>({
    resolver: zodResolver(SearchSchema),
    defaultValues,
  });

  return (
    <Routes>
      <Route path="/pub" element={<Pub />} />

      <Route path="/layoutDefault" element={<Default />} />
      <Route path="/onlyTop" element={<OnlyTop />} />
      <Route path="/onlyContent" element={<OnlyContent />} />

      <Route element={<Default />}>
        <Route path="/page01" element={<Page01 />} />
        <Route path="/page02" element={<Page02 />} />
        <Route path="/page03" element={<Page03 />} />

        <Route path="/page04" element={<Page04 />} />
        <Route path="/page05" element={<Page05 />} />
        <Route path="/page06" element={<Page06 />} />
      </Route>
      <Route path="/list" element={<BoardList />} />
      <Route path="/listNested" element={<BoardListNested />} />
      <Route path="/pageTitle" element={<PageTitle title="페이지 타이틀" />} />
      <Route path="/searchBox" element={<SearchBox form={form} />} />
    </Routes>
  );
}
