import React, { useEffect } from "react";
import { Button, FlexBox, RHF } from "@repo/ui";
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
  Modal11_1,
  Modal12,
  Modal13,
  Modal14,
  Modal15,
  Modal16,
  Modal17,
  Modal18,
  ProgressModal,
  UserModal,
  Modal19,
  Modal20,
  Modal21,
  Modal22,
  Modal23,
  Modal24,
  Modal25,
  Modal26,
  Modal27,
  Modal28,
  Modal29,
  Modal30,
  Modal31,
  Modal32,
  Modal33,
  Modal34,
  Modal35,
  Modal36,
  Modal37,
  Modal38,
  Modal39,
  Modal40,
  Modal41,
} from "./files";

const Publishing = () => {
  const [modal01, setModal01] = React.useState(false);
  const [modal02, setModal02] = React.useState(false);
  const [modal03, setModal03] = React.useState(false);
  const [modal04, setModal04] = React.useState(false);
  const [modal05, setModal05] = React.useState(false);
  const [modal06, setModal06] = React.useState(false);
  const [modal07, setModal07] = React.useState(false);
  const [modal08, setModal08] = React.useState(false);
  const [modal09, setModal09] = React.useState(false);
  const [modal10, setModal10] = React.useState(false);
  const [modal11, setModal11] = React.useState(false);
  const [modal11_1, setModal11_1] = React.useState(false);
  const [modal12, setModal12] = React.useState(false);
  const [modal13, setModal13] = React.useState(false);
  const [modal14, setModal14] = React.useState(false);
  const [modal15, setModal15] = React.useState(false);
  const [modal16, setModal16] = React.useState(false);
  const [modal17, setModal17] = React.useState(false);
  const [modal18, setModal18] = React.useState(false);
  const [modal19, setModal19] = React.useState(false);
  const [modal20, setModal20] = React.useState(false);
  const [modal21, setModal21] = React.useState(false);
  const [modal22, setModal22] = React.useState(false);
  const [modal23, setModal23] = React.useState(false);
  const [modal24, setModal24] = React.useState(false);
  const [modal25, setModal25] = React.useState(false);
  const [modal26, setModal26] = React.useState(false);
  const [modal27, setModal27] = React.useState(false);
  const [modal28, setModal28] = React.useState(false);
  const [modal29, setModal29] = React.useState(false);
  const [modal30, setModal30] = React.useState(false);
  const [modal31, setModal31] = React.useState(false);
  const [modal32, setModal32] = React.useState(false);
  const [modal33, setModal33] = React.useState(false);
  const [modal34, setModal34] = React.useState(false);
  const [modal35, setModal35] = React.useState(false);
  const [modal36, setModal36] = React.useState(false);
  const [modal37, setModal37] = React.useState(false);
  const [modal38, setModal38] = React.useState(false);
  const [modal39, setModal39] = React.useState(false);
  const [modal40, setModal40] = React.useState(false);
  const [modal41, setModal41] = React.useState(false);

  return (
    <div>
      <RHF.MultiFiles />
      <FlexBox className="mt-5 flex-wrap gap-4 [&>button]:w-1/5">
        <Button onClick={() => setModal01((prev) => !prev)}>하급심 입력</Button>
        <Button onClick={() => setModal02((prev) => !prev)}>이의심판 검색</Button>
        <Button onClick={() => setModal03((prev) => !prev)}>사건이력</Button>
        <Button onClick={() => setModal04((prev) => !prev)}>패밀리현황</Button>
        <Button onClick={() => setModal05((prev) => !prev)}>자료복사</Button>
        <Button onClick={() => setModal06((prev) => !prev)}>전자세금계산서(문서)관리</Button>
        <Button onClick={() => setModal07((prev) => !prev)}>매출세금계산서 보기</Button>
        <Button onClick={() => setModal08((prev) => !prev)}>전자세금계산서 조회</Button>
        <Button onClick={() => setModal09((prev) => !prev)}>출원/미수금 조회</Button>
        <Button onClick={() => setModal10((prev) => !prev)}>담당자 선택</Button>
        <Button onClick={() => setModal11((prev) => !prev)}>진행사항 등록(접수사항)</Button>
        <Button onClick={() => setModal11_1((prev) => !prev)}>진행사항 등록(제출사항)</Button>
        <Button onClick={() => setModal12((prev) => !prev)}>업무관리 등록</Button>
        <Button onClick={() => setModal13((prev) => !prev)}>담당자 추가</Button>
        <Button onClick={() => setModal14((prev) => !prev)}>코드추가</Button>
        <Button onClick={() => setModal15((prev) => !prev)}>등록권리자 정보</Button>
        <Button onClick={() => setModal16((prev) => !prev)}>수신인 검색</Button>
        <Button onClick={() => setModal17((prev) => !prev)}>개국생성 국가코드 추가</Button>
        <Button onClick={() => setModal18((prev) => !prev)}>개국 자동생성</Button>
        <Button onClick={() => setModal19((prev) => !prev)}>로카르노</Button>
        <Button onClick={() => setModal20((prev) => !prev)}>지정상품 등록</Button>
        <Button onClick={() => setModal21((prev) => !prev)}>지정상품 테이블 테스트</Button>
        <Button onClick={() => setModal22((prev) => !prev)}>청구내역등록</Button>
        <Button onClick={() => setModal23((prev) => !prev)}>해외 청구내역 추가</Button>
        <Button onClick={() => setModal24((prev) => !prev)}>해외 송금내역 추가</Button>
        <Button onClick={() => setModal25((prev) => !prev)}>청구내역 등록2</Button>
        <Button onClick={() => setModal26((prev) => !prev)}>입금내역 등록</Button>
        <Button onClick={() => setModal27((prev) => !prev)}>입금내역 추가</Button>
        <Button onClick={() => setModal28((prev) => !prev)}>선수금 조회</Button>
        <Button onClick={() => setModal29((prev) => !prev)}>결재대상 추가</Button>
        <Button onClick={() => setModal30((prev) => !prev)}>고객정보 참조</Button>
        <Button onClick={() => setModal31((prev) => !prev)}>입금내역 추가2</Button>
        <Button onClick={() => setModal32((prev) => !prev)}>
          실적분배(내부 추가버튼 시 등록 팝업)
        </Button>

        <Button onClick={() => setModal33((prev) => !prev)}>의뢰인 / 해외대리인 정보</Button>
        <Button onClick={() => setModal34((prev) => !prev)}>다중 국가선택</Button>
        <Button onClick={() => setModal35((prev) => !prev)}>출원인 정보</Button>
        <Button onClick={() => setModal36((prev) => !prev)}>등록권리자 정보</Button>
        <Button onClick={() => setModal37((prev) => !prev)}>포괄위임 등록</Button>
        <Button onClick={() => setModal38((prev) => !prev)}>담당자 등록</Button>
        <Button onClick={() => setModal39((prev) => !prev)}>관련고객 등록</Button>
        <Button onClick={() => setModal40((prev) => !prev)}>변경사항 등록</Button>
        <Button onClick={() => setModal41((prev) => !prev)}>발명자 정보</Button>
      </FlexBox>

      <Modal01 open={modal01} onOpenChange={setModal01} title="하급심 입력" />
      <Modal02 open={modal02} onOpenChange={setModal02} title="이의심판 검색" />
      <Modal03 open={modal03} onOpenChange={setModal03} title="사건이력" />
      <Modal04 open={modal04} onOpenChange={setModal04} title="패밀리현황" />
      <Modal05 open={modal05} onOpenChange={setModal05} title="자료복사" />
      <Modal06 open={modal06} onOpenChange={setModal06} title="전자세금계산서(문서)관리" />
      <Modal07 open={modal07} onOpenChange={setModal07} title="매출세금계산서 보기" />
      <Modal08 open={modal08} onOpenChange={setModal08} title="전자세금계산서 조회" />
      <Modal09 open={modal09} onOpenChange={setModal09} title="출원/미수금 조회" />
      <UserModal open={modal10} onOpenChange={setModal10} title="담당자 선택" />
      <ProgressModal open={modal11} onOpenChange={setModal11} title="진행사항 등록" />
      <Modal11_1 open={modal11_1} onOpenChange={setModal11_1} title="진행사항 등록" />
      <Modal12 open={modal12} onOpenChange={setModal12} title="업무관리 등록" />
      <Modal13 open={modal13} onOpenChange={setModal13} title="담당자 추가" />
      <Modal14 open={modal14} onOpenChange={setModal14} title="코드추가" />
      <Modal15 open={modal15} onOpenChange={setModal15} title="등록권리자 정보" />
      <Modal16 open={modal16} onOpenChange={setModal16} title="수신인 검색" />
      <Modal17 open={modal17} onOpenChange={setModal17} title="개국생성 국가코드 추가" />
      <Modal18 open={modal18} onOpenChange={setModal18} title="개국 자동생성" />
      <Modal19 open={modal19} onOpenChange={setModal19} title="로카르노" />
      <Modal20 open={modal20} onOpenChange={setModal20} title="지정상품 등록" />
      <Modal21 open={modal21} onOpenChange={setModal21} title="지정상품 테이블 테스트" />
      <Modal22 open={modal22} onOpenChange={setModal22} title="청구내역등록" />
      <Modal23 open={modal23} onOpenChange={setModal23} title="해외 청구내역 추가" />
      <Modal24 open={modal24} onOpenChange={setModal24} title="해외 송금내역 추가" />
      <Modal25 open={modal25} onOpenChange={setModal25} title="청구내역 등록2" />
      <Modal26 open={modal26} onOpenChange={setModal26} title="입금내역 등록" />
      <Modal27 open={modal27} onOpenChange={setModal27} title="입금내역 추가" />
      <Modal28 open={modal28} onOpenChange={setModal28} title="선수금 조회" />
      <Modal29 open={modal29} onOpenChange={setModal29} title="결재대상 추가" />
      <Modal30 open={modal30} onOpenChange={setModal30} title="고객정보 참조" />
      <Modal31 open={modal31} onOpenChange={setModal31} title="입금내역 추가2" />
      <Modal32
        open={modal32}
        onOpenChange={setModal32}
        title="실적분배(내부 추가버튼 시 등록 팝업)"
      />

      <Modal33 open={modal33} onOpenChange={setModal33} title="의뢰인 / 해외대리인 정보" />
      <Modal34 open={modal34} onOpenChange={setModal34} title="다중 국가선택" />
      <Modal35 open={modal35} onOpenChange={setModal35} title="출원인 정보" />
      <Modal36 open={modal36} onOpenChange={setModal36} title="등록권리자 정보" />
      <Modal37 open={modal37} onOpenChange={setModal37} title="포괄위임 등록" />
      <Modal38 open={modal38} onOpenChange={setModal38} title="담당자 등록" />
      <Modal39 open={modal39} onOpenChange={setModal39} title="관련고객 등록" />
      <Modal40 open={modal40} onOpenChange={setModal40} title="변경사항 등록" />
      <Modal41 open={modal41} onOpenChange={setModal41} title="발명자 정보" />
    </div>
  );
};

export default Publishing;
