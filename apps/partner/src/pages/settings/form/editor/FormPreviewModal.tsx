import { useState } from "react";
import { Button, Icons } from "@repo/ui";
import { useMutation } from "@tanstack/react-query";
import { formTemplateQueries } from "@shared/query/organization/queries";
import FormRenderer from "@pages/approval/_common/FormRenderer";

interface Props {
  open: boolean;
  onClose: () => void;
  /** TipTap JSON 문자열 직접 전달 */
  templateData?: string;
  /** 또는 seq로 API에서 조회 */
  formTemplateSeq?: string;
  title?: string;
  /** 서식 하단 설명 */
  footerContent?: string;
}

/**
 * 서식 미리보기 모달.
 *
 * 실제 결재 조회 화면(`ApprDocDetailModal`)과 동일한 A4 페이퍼 레이아웃 사용:
 * - 헤더 (서식명·문서번호 / 제목 / 더블 라인)
 * - 메타 테이블 (기안자·상신일 placeholder)
 * - 본문 (FormRenderer)
 *
 * 사용자가 양식을 만들 때 실제 결재된 화면이 어떻게 보일지 확인 가능.
 */
const FormPreviewModal = ({ open, onClose, templateData, formTemplateSeq, title, footerContent }: Props) => {
  const getDetail = useMutation(formTemplateQueries.getDetail());
  const [loaded, setLoaded] = useState<{ title: string; data: string; footer: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // seq로 조회하는 경우
  const loadFromSeq = async () => {
    if (!formTemplateSeq || loaded) return;
    setLoading(true);
    try {
      const detail = await getDetail.mutateAsync(formTemplateSeq);
      setLoaded({ title: detail.templateName || "", data: detail.templateData || "", footer: detail.footerContent || "" });
    } catch {
      setLoaded({ title: "", data: "", footer: "" });
    }
    setLoading(false);
  };

  if (open && formTemplateSeq && !loaded && !loading) {
    loadFromSeq();
  }

  if (!open) return null;

  const displayTitle = title || loaded?.title || "미리 보기";
  const displayData = templateData || loaded?.data || "";
  const displayFooter = footerContent || loaded?.footer || "";

  const handleClose = () => {
    setLoaded(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex max-h-[90vh] w-[90vw] max-w-[900px] flex-col rounded-lg bg-background shadow-xl">
        {/* 헤더 */}
        <div className="flex shrink-0 items-center justify-between border-b px-6 py-3">
          <h3 className="text-sm font-semibold">{displayTitle} 미리 보기</h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icons.X className="size-5" />
          </button>
        </div>

        {/* 본문 (스크롤) */}
        <div className="min-h-0 flex-1 overflow-auto bg-muted/20 px-6 py-6">
          {loading ? (
            <p className="text-muted-foreground py-8 text-center text-sm">불러오는 중...</p>
          ) : (
            <article className="mx-auto max-w-[794px] rounded-sm bg-card text-card-foreground shadow-md ring-1 ring-border">
              <div className="px-[90px] py-[70px]">
                {/* 문서 헤더 (실제 결재 조회와 동일) */}
                <header className="mb-6">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{displayTitle}</span>
                    <span className="font-mono">DOC-XXXX-XXXXXX</span>
                  </div>
                  <h1
                    style={{ fontSize: 24, lineHeight: 1.4 }}
                    className="truncate py-2 text-center font-bold tracking-[0.12em]"
                  >
                    {displayTitle}
                  </h1>
                  <div className="border-b-2 border-foreground/70" />
                  <div className="mt-[3px] border-b border-foreground/40" />
                </header>

                {/* 메타 테이블 (placeholder) */}
                <section className="mb-6">
                  <table className="w-full border-collapse text-sm">
                    <colgroup>
                      <col className="w-[100px]" />
                      <col />
                      <col className="w-[100px]" />
                      <col />
                    </colgroup>
                    <tbody>
                      <tr className="border-y border-border">
                        <th className="border-r border-border bg-muted/40 px-3 py-2 text-left text-xs font-medium">
                          기안자
                        </th>
                        <td className="border-r border-border px-3 py-2 text-sm text-muted-foreground">
                          (기안자명)
                        </td>
                        <th className="border-r border-border bg-muted/40 px-3 py-2 text-left text-xs font-medium">
                          상신일
                        </th>
                        <td className="px-3 py-2 text-sm text-muted-foreground">YYYY-MM-DD</td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                {/* 본문 (FormRenderer 사용 — 결재 조회와 동일 렌더링) */}
                <section>
                  <FormRenderer templateData={displayData} readOnly={false} />
                </section>

                {/* 서식 하단 설명 */}
                {displayFooter && (
                  <>
                    <hr className="my-6 border-border" />
                    <div className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                      {displayFooter}
                    </div>
                  </>
                )}
              </div>
            </article>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex shrink-0 justify-end border-t px-6 py-3">
          <Button size="h28" variant="outline" onClick={handleClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormPreviewModal;
