import { useState } from "react";
import { Icons } from "@repo/ui";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { loadSignature, type SignatureKind } from "./signatureStorage";

/**
 * 날짜 마스크 인풋 — native <input type="date"> 가 Chrome 에서 연도 6자리까지 받는
 * 문제를 회피. 사용자는 raw 숫자만 입력, 화면엔 YYYY-MM-DD 로 자동 포맷, form 값은
 * YYYY-MM-DD 문자열로 제출.
 */
const formatMaskedDate = (raw: string): string => {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
};

const MaskedDateInput = ({
  name,
  defaultValue,
  disabled,
  className,
}: {
  name: string;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
}) => {
  const [value, setValue] = useState(formatMaskedDate(String(defaultValue ?? "")));
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={(e) => setValue(formatMaskedDate(e.target.value))}
      disabled={disabled}
      placeholder="YYYY-MM-DD"
      maxLength={10}
      inputMode="numeric"
      autoComplete="off"
      className={className}
    />
  );
};

/**
 * 서식 템플릿 렌더러 (공통)
 *
 * 한국 표준 결재 문서 양식을 모사:
 * - 연속된 formBlock 들은 단일 라벨/값 테이블로 묶어서 표시 (왼쪽 라벨, 오른쪽 입력)
 * - heading / paragraph / table 등은 본문 콘텐츠로 별도 렌더
 * - 인쇄 / 출력 친화적인 보더드 셀 디자인
 */
interface Props {
  templateData: string;
  readOnly?: boolean;
  /** 저장된 입력값 {"fieldName": "value"} - 조회 시 각 필드에 defaultValue로 표시 */
  values?: Record<string, string>;
}

const toArr = (v: any): string[] => {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") try { return JSON.parse(v); } catch { return []; }
  return [];
};

// ─── 연속된 formBlock 그룹화 ────────────────────────────────────────────────
type Group =
  | { kind: "fields"; items: any[] }
  | { kind: "other"; item: any };

const groupNodes = (nodes: any[]): Group[] => {
  const groups: Group[] = [];
  for (const node of nodes) {
    if (node.type === "formBlock") {
      const last = groups[groups.length - 1];
      if (last && last.kind === "fields") last.items.push(node);
      else groups.push({ kind: "fields", items: [node] });
    } else {
      groups.push({ kind: "other", item: node });
    }
  }
  return groups;
};

// 트레일링(맨 마지막에 모여있는) 서명/직인 블록을 분리 → 공문서 풋터로 별도 렌더
const isSignatureBlock = (n: any) =>
  n?.type === "formBlock" && (n?.attrs?.blockType === "signature" || n?.attrs?.blockType === "stamp");

const splitTrailingSignatures = (nodes: any[]) => {
  const sigs: any[] = [];
  let i = nodes.length - 1;
  while (i >= 0 && isSignatureBlock(nodes[i])) {
    sigs.unshift(nodes[i]);
    i--;
  }
  return { body: nodes.slice(0, i + 1), signatures: sigs };
};

const FormRenderer = ({ templateData, readOnly = false, values }: Props) => {
  if (!templateData) {
    return <p className="text-muted-foreground py-8 text-center text-sm">내용이 없습니다.</p>;
  }

  let json: any;
  try { json = JSON.parse(templateData); } catch {
    return <p className="text-muted-foreground py-8 text-center text-sm">내용이 없습니다.</p>;
  }

  const nodes = json?.content || [];
  if (!nodes.length) {
    return <p className="text-muted-foreground py-8 text-center text-sm">내용이 없습니다.</p>;
  }

  const { body, signatures } = splitTrailingSignatures(nodes);
  const groups = groupNodes(body);

  return (
    <>
      <div className="space-y-4">
        {groups.map((g, gi) =>
          g.kind === "fields" ? (
            <FieldTable key={gi} nodes={g.items} readOnly={readOnly} values={values} />
          ) : (
            <RenderNode key={gi} node={g.item} readOnly={readOnly} values={values} />
          ),
        )}
      </div>
      {signatures.length > 0 && (
        <SignatureFooter blocks={signatures} readOnly={readOnly} values={values} />
      )}
    </>
  );
};

// ─── 공문서 표준 하단 (서명/직인 풋터) ──────────────────────────────────────
const SignatureFooter = ({
  blocks,
  readOnly,
  values,
}: {
  blocks: any[];
  readOnly: boolean;
  values?: Record<string, string>;
}) => {
  const user = useAuthStore((s) => s.user);
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <footer className="mt-10">
      {/* 상단 더블 라인 — 제목 하단과 동일한 공문서 패턴 */}
      <div className="border-b-2 border-foreground/70" />
      <div className="mt-[3px] border-b border-foreground/40" />

      {/* 풋터 본문 (우측 정렬) */}
      <div className="flex flex-col items-end gap-2 pt-6 text-sm">
        {/* 상신일 */}
        <div className="text-foreground">
          <span className="text-muted-foreground">상신일</span>{" "}
          <span className="font-medium">{dateStr}</span>
        </div>

        {/* 서명/직인 라인 — 이름 + 컴팩트 슬롯 */}
        {blocks.map((node, i) => {
          const attrs = node.attrs || {};
          const kind = attrs.blockType as "signature" | "stamp";
          const fieldName = attrs.name || attrs.blockLabel || "";
          const savedValue = values?.[fieldName] ?? "";
          const personName = user?.userNameKo || fieldName;
          return (
            <SignatureLine
              key={i}
              kind={kind}
              fieldName={fieldName}
              personName={personName}
              savedValue={savedValue}
              readOnly={readOnly}
            />
          );
        })}
      </div>
    </footer>
  );
};

/** 공문서 풋터의 컴팩트한 서명/직인 라인 (이름 + 슬롯) */
const SignatureLine = ({
  kind,
  fieldName,
  personName,
  savedValue,
  readOnly,
}: {
  kind: "signature" | "stamp";
  fieldName: string;
  personName: string;
  savedValue: string;
  readOnly: boolean;
}) => {
  const user = useAuthStore((s) => s.user);
  const stored = loadSignature(user?.officeId, user?.userId, kind);
  const display = savedValue || stored || "";
  const kindLabel = kind === "signature" ? "(서명)" : "(직인)";

  return (
    <div className="flex items-center gap-2">
      <span className="text-foreground">{personName}</span>
      <div className="flex h-10 min-w-[64px] items-center justify-center">
        <input type="hidden" name={fieldName} value={display} />
        {display ? (
          <img
            src={display}
            alt={kindLabel}
            className="max-h-full max-w-[80px] object-contain"
          />
        ) : (
          <span className="text-muted-foreground">{kindLabel}</span>
        )}
      </div>
    </div>
  );
};

// ─── 라벨/값 테이블 (한국 표준 결재 양식 패턴) ─────────────────────────────
const FieldTable = ({
  nodes,
  readOnly,
  values,
}: {
  nodes: any[];
  readOnly: boolean;
  values?: Record<string, string>;
}) => (
  <table className="w-full border-collapse overflow-hidden rounded-md border border-border text-sm">
    <colgroup>
      <col className="w-[160px]" />
      <col />
    </colgroup>
    <tbody>
      {nodes.map((node, i) => {
        const attrs = node.attrs || {};
        const label = attrs.name || attrs.blockLabel || "";
        return (
          <tr key={i} className="border-b border-border last:border-b-0">
            <th className="border-r border-border bg-muted/40 px-4 py-3 text-left align-top font-medium">
              <span>{label}</span>
              {attrs.required && <span className="ml-0.5 text-red-500">*</span>}
            </th>
            <td className="px-4 py-3 align-top">
              {attrs.description && (
                <p className="mb-1.5 text-xs text-muted-foreground">{attrs.description}</p>
              )}
              <RenderField attrs={attrs} readOnly={readOnly} values={values} />
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

// ─── formBlock 외 일반 컨텐츠 (heading, paragraph, list, table, hr) ────────
const RenderNode = ({
  node,
  readOnly,
  values,
}: {
  node: any;
  readOnly: boolean;
  values?: Record<string, string>;
}) => {
  if (node.type === "paragraph") {
    const text = (node.content || []).map((c: any) => c.text || "").join("");
    if (!text) return <div className="h-3" />;
    return <p className="text-sm leading-relaxed">{text}</p>;
  }

  if (node.type === "heading") {
    const text = (node.content || []).map((c: any) => c.text || "").join("");
    const level = node.attrs?.level || 2;
    if (level === 1) {
      // h1 → 문서 메인 타이틀 (절제된 공문서 비율)
      return (
        <h1 className="border-b border-border pb-2 text-center text-base font-bold tracking-wide text-foreground">
          {text}
        </h1>
      );
    }
    if (level === 2) {
      // h2 → 섹션 타이틀
      return (
        <h2 className="border-l-[3px] border-blue-500 pl-2 text-sm font-semibold text-foreground">
          {text}
        </h2>
      );
    }
    return <h3 className="text-xs font-semibold text-foreground">{text}</h3>;
  }

  if (node.type === "bulletList" || node.type === "orderedList") {
    const Tag = node.type === "bulletList" ? "ul" : "ol";
    return (
      <Tag
        className={`${
          node.type === "bulletList" ? "list-disc" : "list-decimal"
        } space-y-1 pl-5 text-sm`}
      >
        {(node.content || []).map((item: any, i: number) => (
          <li key={i}>
            {(item.content?.[0]?.content || []).map((c: any) => c.text || "").join("")}
          </li>
        ))}
      </Tag>
    );
  }

  if (node.type === "horizontalRule") return <hr className="border-border" />;

  if (node.type === "table") {
    return (
      <table className="w-full border-collapse overflow-hidden rounded-md border border-border text-sm">
        <tbody>
          {(node.content || []).map((row: any, ri: number) => (
            <tr key={ri} className={ri === 0 ? "bg-muted/40 font-medium" : ""}>
              {(row.content || []).map((cell: any, ci: number) => {
                const Tag = cell.type === "tableHeader" ? "th" : "td";
                const text = (cell.content?.[0]?.content || []).map((c: any) => c.text || "").join("");
                return (
                  <Tag key={ci} className="border border-border px-3 py-2 text-left">
                    {text}
                  </Tag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return null;
};

// ─── 입력 필드 종류별 렌더링 ───────────────────────────────────────────────
const RenderField = ({
  attrs,
  readOnly,
  values,
}: {
  attrs: any;
  readOnly: boolean;
  values?: Record<string, string>;
}) => {
  const { blockType, placeholder, options: rawOpts, columns: rawCols, noticeText, labelText, fileTypes, fileMaxSize } = attrs;
  const options = toArr(rawOpts);
  const columns = toArr(rawCols);
  const disabled = readOnly;
  const fieldName = attrs.name || attrs.blockLabel || "";
  const savedValue = values?.[fieldName] ?? "";

  const inputCls =
    "h-9 w-full rounded-md border border-border bg-background px-3 text-sm disabled:border-transparent disabled:bg-transparent disabled:px-0";

  switch (blockType) {
    case "text":
      return (
        <input
          name={fieldName}
          defaultValue={savedValue}
          className={inputCls}
          placeholder={placeholder || "입력해주세요"}
          disabled={disabled}
        />
      );
    case "multiText":
      return (
        <textarea
          name={fieldName}
          defaultValue={savedValue}
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed disabled:border-transparent disabled:bg-transparent disabled:px-0"
          placeholder={placeholder || "내용을 입력해주세요"}
          disabled={disabled}
        />
      );
    case "select":
    case "multiSelect":
      return (
        <select
          name={fieldName}
          defaultValue={savedValue}
          className={inputCls}
          disabled={disabled}
        >
          <option value="">{placeholder || "선택해주세요"}</option>
          {options.map((o, i) => (
            <option key={i} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "table":
    case "calcTable": {
      const cols = columns.length > 0 ? columns : ["열 1", "열 2", "열 3"];
      return (
        <table className="w-full border-collapse rounded-md border border-border text-sm">
          <thead>
            <tr className="bg-muted/40">
              {cols.map((c, i) => (
                <th key={i} className="border border-border px-3 py-2 text-left font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {cols.map((c, i) => {
                const colKey = `${fieldName}_${c}`;
                return (
                  <td key={i} className="border border-border px-3 py-2">
                    <input
                      name={colKey}
                      defaultValue={values?.[colKey] ?? ""}
                      className="w-full bg-transparent text-sm focus:outline-none disabled:bg-transparent"
                      disabled={disabled}
                    />
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      );
    }
    case "checkbox": {
      const items = options.length > 0 ? options : ["옵션 1", "옵션 2"];
      const savedArr = savedValue ? savedValue.split(",") : [];
      return (
        <div className="flex flex-wrap gap-4">
          {items.map((o, i) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name={fieldName}
                value={o}
                defaultChecked={savedArr.includes(o)}
                disabled={disabled}
              />{" "}
              {o}
            </label>
          ))}
        </div>
      );
    }
    case "radio": {
      const items = options.length > 0 ? options : ["옵션 1", "옵션 2"];
      return (
        <div className="flex flex-wrap gap-4">
          {items.map((o, i) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={fieldName}
                value={o}
                defaultChecked={savedValue === o}
                disabled={disabled}
              />{" "}
              {o}
            </label>
          ))}
        </div>
      );
    }
    case "date":
      return (
        <MaskedDateInput
          name={fieldName}
          defaultValue={savedValue}
          disabled={disabled}
          className="h-9 w-48 rounded-md border border-border bg-background px-3 text-sm disabled:border-transparent disabled:bg-transparent disabled:px-0"
        />
      );
    case "dateRange":
      return (
        <div className="flex items-center gap-2">
          <MaskedDateInput
            name={`${fieldName}_from`}
            defaultValue={values?.[`${fieldName}_from`] ?? ""}
            disabled={disabled}
            className="h-9 w-40 rounded-md border border-border bg-background px-3 text-sm disabled:border-transparent disabled:bg-transparent disabled:px-0"
          />
          <span className="text-sm text-muted-foreground">~</span>
          <MaskedDateInput
            name={`${fieldName}_to`}
            defaultValue={values?.[`${fieldName}_to`] ?? ""}
            disabled={disabled}
            className="h-9 w-40 rounded-md border border-border bg-background px-3 text-sm disabled:border-transparent disabled:bg-transparent disabled:px-0"
          />
        </div>
      );
    case "time":
      return (
        <input
          type="time"
          name={fieldName}
          defaultValue={savedValue}
          className="h-9 w-40 rounded-md border border-border bg-background px-3 text-sm disabled:border-transparent disabled:bg-transparent disabled:px-0"
          disabled={disabled}
        />
      );
    case "timeRange":
      return (
        <div className="flex items-center gap-2">
          <input
            type="time"
            name={`${fieldName}_from`}
            defaultValue={values?.[`${fieldName}_from`] ?? ""}
            className="h-9 w-36 rounded-md border border-border bg-background px-3 text-sm disabled:border-transparent disabled:bg-transparent disabled:px-0"
            disabled={disabled}
          />
          <span className="text-sm text-muted-foreground">~</span>
          <input
            type="time"
            name={`${fieldName}_to`}
            defaultValue={values?.[`${fieldName}_to`] ?? ""}
            className="h-9 w-36 rounded-md border border-border bg-background px-3 text-sm disabled:border-transparent disabled:bg-transparent disabled:px-0"
            disabled={disabled}
          />
        </div>
      );
    case "file":
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icons.Paperclip className="size-4" /> 파일 첨부
          {fileTypes && <span className="text-xs">({fileTypes})</span>}
          {fileMaxSize && <span className="text-xs">최대 {fileMaxSize}MB</span>}
        </div>
      );
    case "notice":
      return (
        <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
          {noticeText || "안내 문구"}
        </div>
      );
    case "image":
      return (
        <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed border-border text-muted-foreground/60">
          <Icons.Image className="size-8" />
        </div>
      );
    case "label":
      return <span className="text-sm font-medium">{labelText || "레이블"}</span>;
    case "signature":
      return <SignatureField fieldName={fieldName} kind="signature" disabled={disabled} savedValue={savedValue} />;
    case "stamp":
      return <SignatureField fieldName={fieldName} kind="stamp" disabled={disabled} savedValue={savedValue} />;
    default:
      return <div className="text-sm text-muted-foreground">{blockType}</div>;
  }
};

// ─── 서명/직인 필드 (본문 안) ────────────────────────────────────────────
const SignatureField = ({
  fieldName,
  kind,
  savedValue,
}: {
  fieldName: string;
  kind: SignatureKind;
  disabled: boolean;
  savedValue: string;
}) => {
  const user = useAuthStore((s) => s.user);
  const stored = loadSignature(user?.officeId, user?.userId, kind);
  const display = savedValue || stored || "";
  const placeholder = kind === "signature" ? "(서명)" : "(직인)";

  return (
    <div className="inline-flex h-10 items-center">
      <input type="hidden" name={fieldName} value={display} />
      {display ? (
        <img
          src={display}
          alt={placeholder}
          className="max-h-full max-w-[80px] object-contain"
        />
      ) : (
        <span className="text-sm text-muted-foreground">{placeholder}</span>
      )}
    </div>
  );
};

export default FormRenderer;
