import { Button, Icons } from "@repo/ui";
import ModalsPage from "./modal";
import { useState } from "react";

const pageList: any = [
  {
    name: "레이아웃",
    path: "layout",
    children: [
      {
        name: "디폴트 레이아웃",
        path: "layoutDefault",
      },
      {
        name: "상단만 있는 레이아웃",
        path: "onlyTop",
      },
      {
        name: "아무것도 없는 레이아웃",
        path: "onlyContent",
      },
    ],
  },
  {
    name: "Pages",
    path: "page",
    children: [
      {
        name: "기한관리현황 리스트",
        path: "page01",
      },
      {
        name: "조사분석의뢰 작성/상세",
        path: "page02",
      },
      {
        name: "직무발명신고서 작성/상세",
        path: "page03",
      },
      {
        name: "국내출원품의 작성/상세",
        path: "page04",
      },
      {
        name: "국내출원 마스터 작성/상세",
        path: "page05",
      },
      {
        name: "국내출원 마스터 상세",
        path: "page06",
      },
    ],
  },
  {
    name: "구성요소",
    path: "ele",
    children: [
      {
        name: "페이지 타이틀 + 현재위치 확인 Location",
        path: "pageTitle",
      },
      {
        name: "데이터 테이블",
        path: "list",
      },
      {
        name: "데이터 테이블 header 중첩",
        path: "listNested ",
      },
      {
        name: "페이지 검색 영역",
        path: "searchBox",
      },
    ],
  },
  {
    name: "MODAL",
    path: "MODAL",
    type: "modal",
    children: [
      {
        name: "목표수정",
        path: "modal01",
      },
      {
        name: "선행조사검색",
        path: "modal02",
      },
      {
        name: "선행기술 문헌 검색",
        path: "modal03",
      },
      {
        name: "REF-NO검색",
        path: "modal04",
      },
      {
        name: "경쟁사 검색",
        path: "modal05",
      },
      {
        name: "발명자 검색",
        path: "modal06",
      },
      {
        name: "선행기술문헌 작성",
        path: "modal07",
      },
      {
        name: "고객사별 예상매출 추가",
        path: "modal08",
      },
      {
        name: "인용정보 등록",
        path: "modal09",
      },
      {
        name: "고객사별 예상매출 추가",
        path: "modal10",
      },
      {
        name: "프로젝트 등록/상세",
        path: "modal11",
      },
      {
        name: "발명평가표",
        path: "modal12",
      },
      {
        name: "테스트 모달",
        path: "modal13",
      },
    ],
  },
];

const Pub = () => {
  const openNewWindow = (url: string) => {
    window.open("/" + url, "_blank", "noopener,noreferrer");
  };
  const [name, setName] = useState("");
  const modals = pageList.filter((item: any) => item.name === "MODAL");

  return (
    <>
      <div className="flex flex-col items-start justify-start p-5">
        {pageList.map((item: any, index: number) => {
          if (!item?.children?.length) {
            return (
              <Button
                key={item.path + "_" + index}
                variant="link"
                size="h28"
                onClick={() => openNewWindow(item.path)}
              >
                {item.name}
                <Icons.SquareArrowOutUpRight className="size-3" />
              </Button>
            );
          }
          return (
            <div
              key={item.path + "_" + index}
              className="mb-5 flex flex-col items-start justify-start"
            >
              <h2 className="text-text-200 text-[11px]">{item.name}</h2>
              {item.children.map((child: any) => {
                return (
                  <Button
                    key={child.path}
                    variant="link"
                    size="h28"
                    onClick={() =>
                      item?.type !== "modal" ? openNewWindow(child.path) : setName(child?.path)
                    }
                  >
                    {child.name}
                    <Icons.SquareArrowOutUpRight className="size-3" />
                  </Button>
                );
              })}
            </div>
          );
        })}
      </div>
      <ModalsPage openName={name} setName={setName} />
    </>
  );
};

export default Pub;
