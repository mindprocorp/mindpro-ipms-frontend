import {
  Modal01,
  Modal02,
  Modal03,
  Modal04,
  Modal05,
  Modal06,
  Modal07,
  Modal08,
  Modal09,
  Modal10,
  Modal11,
  Modal12,
  Modal13,
} from "./files";

const ModalsPage = ({ openName, setName }: { openName: string; setName: any }) => {
  const openHandler = (open: boolean) => {
    setName("");
  };

  return (
    <>
      <Modal01 open={openName === "modal01"} onOpenChange={openHandler} title="목표수정" />
      <Modal02 open={openName === "modal02"} onOpenChange={openHandler} title="선행조사검색" />
      <Modal03
        open={openName === "modal03"}
        onOpenChange={openHandler}
        title="선행기술 문헌 검색"
      />
      <Modal04 open={openName === "modal04"} onOpenChange={openHandler} title="REF-NO검색" />
      <Modal05 open={openName === "modal05"} onOpenChange={openHandler} title="경쟁사 검색" />
      <Modal06 open={openName === "modal06"} onOpenChange={openHandler} title="발명자 검색" />
      <Modal07 open={openName === "modal07"} onOpenChange={openHandler} title="선행기술문헌 작성" />
      <Modal08
        open={openName === "modal08"}
        onOpenChange={openHandler}
        title="고객사별 예상매출 추가"
      />
      <Modal09 open={openName === "modal09"} onOpenChange={openHandler} title="인용정보 등록" />
      <Modal10
        open={openName === "modal10"}
        onOpenChange={openHandler}
        title="데이터 셀렉트 박스"
      />
      <Modal11 open={openName === "modal11"} onOpenChange={openHandler} title="프로젝트 등록" />
      <Modal12 open={openName === "modal12"} onOpenChange={openHandler} title="발명평가표" />
      <Modal13 open={openName === "modal13"} onOpenChange={openHandler} title="테스트 모달" />
    </>
  );
};

export default ModalsPage;
