import { Button, Icons, MultiFiles, Calendar, Popover, PopoverContent, PopoverTrigger, formatYYYYMMDD } from "@repo/ui";
import type { ServerFileItem, FileItem } from "@repo/ui";
import { RichTextEditor } from "@shared/ui/RichTextEditor.tsx";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boardQueries } from "@shared/query/board/boardQueries.ts";
import { boardConfigQueries } from "@shared/query/board/boardConfigQueries";
import { useAlertStore } from "@shared/store/useAlertStore";
import type { BoardDetail, BoardListItem, BoardListResponse } from "@shared/api/board/boardApi.ts";
import type { ApiResponse } from "@shared/commonType.ts";
import { BoardSelectModal } from "../BoardSelectModal";
import type { BoardConfig } from "@shared/api/board/boardConfigApi";
import BoardPreviewModal from "./BoardPreviewModal";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { downloadFile } from "@shared/util/fileUtil";

const BoardForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { boardSeq } = useParams<{ boardSeq?: string }>();
  const [searchParams] = useSearchParams();
  const { openAlert } = useAlertStore();

  const isEdit = !!boardSeq;

  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<{ configSeq: string; boardName: string } | null>(() => {
    const configSeq = searchParams.get("configSeq");
    const boardName = searchParams.get("boardName");
    if (configSeq && boardName) return { configSeq, boardName };
    return null;
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachFiles, setAttachFiles] = useState<any[]>([]); // 신규 첨부 파일 (FileItem[] 형식)
  const [existingFiles, setExistingFiles] = useState<ServerFileItem[]>([]);
  const [deleteFileSeqList, setDeleteFileSeqList] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [pinnedStartAt, setPinnedStartAt] = useState("");
  const [pinnedEndAt, setPinnedEndAt] = useState("");
  const [wideMode, setWideMode] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  const { data: configData } = useQuery(boardConfigQueries.getList());
  const getDetailMut = useMutation(boardQueries.getBoardDetail());
  const saveMut = useMutation(boardQueries.saveBoard());
  const deleteMut = useMutation(boardQueries.deleteBoard());

  const findBoardName = (nodes: BoardConfig[], configSeq: string): string => {
    for (const node of nodes) {
      if (node.configSeq === configSeq) return node.boardName ?? "";
      if (node.children?.length) {
        const found = findBoardName(node.children, configSeq);
        if (found) return found;
      }
    }
    return "";
  };

  const initialValuesRef = useRef<{
    title: string; content: string; categoryCode: string;
    isPinned: string; pinnedStartAt: string; pinnedEndAt: string;
  } | null>(null);





  useEffect(() => {
    if (!isEdit) {
      const configSeq = searchParams.get("configSeq");
      const boardName = searchParams.get("boardName");
      setSelectedBoard(configSeq && boardName ? { configSeq, boardName } : null);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isEdit && boardSeq) {
      getDetailMut.mutate(boardSeq, {
        onSuccess: (res) => {
          const d: BoardDetail = res.data;
          const vals = {
            title: d.title ?? "",
            content: d.content ?? "",
            categoryCode: d.category?.code ?? "",
            isPinned: d.isPinned ?? "N",
            pinnedStartAt: d.pinnedStartAt ?? "",
            pinnedEndAt: d.pinnedEndAt ?? "",
          };
          setTitle(vals.title);
          setContent(vals.content);
          setIsPinned(vals.isPinned === "Y");
          const toDateInput = (v: string) =>
            v?.length === 8 ? `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}` : "";
          setPinnedStartAt(toDateInput(vals.pinnedStartAt));
          setPinnedEndAt(toDateInput(vals.pinnedEndAt));
          setExistingFiles(
            (d.fileList ?? []).map((f) => ({
              fileSeq: f.fileSeq,
              fileName: f.fileName,
              fileSize: f.fileSize,
              fileUrl: f.fileUrl,
              docSeq: f.docSeq,
              docNm: f.docNm,
            }))
          );
          const configSeq = d.category?.code ?? "";
          const raw = configData?.data;
          const configList: BoardConfig[] = Array.isArray(raw) ? raw : Array.isArray(raw?.list) ? raw.list : [];
          const boardName = findBoardName(configList, configSeq) || d.category?.codeName || configSeq;
          setSelectedBoard({ configSeq, boardName });
          initialValuesRef.current = vals;
        },
        onError: () => openAlert({ message: "게시글 정보를 불러오는데 실패했습니다.", showCancel: false }),
      });
    }
  }, [boardSeq, configData]);

  const handleSave = async () => {
    if (!selectedBoard) return openAlert({ message: "게시판을 선택해주세요.", showCancel: false });
    if (!title.trim()) return openAlert({ message: "제목을 입력해주세요.", showCancel: false });
    if (isPinned && (!pinnedStartAt || !pinnedEndAt)) return openAlert({ message: "시작일과 종료일을 모두 입력해주세요.", showCancel: false });
    if (isPinned && pinnedStartAt && pinnedEndAt && pinnedStartAt > pinnedEndAt) return openAlert({ message: "종료일은 시작일보다 이후 날짜여야 합니다.", showCancel: false });

    if (isEdit && initialValuesRef.current) {
      const iv = initialValuesRef.current;
      const unchanged =
        (selectedBoard?.configSeq ?? "") === iv.categoryCode &&
        title === iv.title &&
        content === iv.content &&
        (isPinned ? "Y" : "N") === iv.isPinned &&
        (isPinned ? pinnedStartAt : "") === iv.pinnedStartAt &&
        (isPinned ? pinnedEndAt : "") === iv.pinnedEndAt &&
        attachFiles.length === 0 &&
        deleteFileSeqList.length === 0;
      if (unchanged) return openAlert({ message: "변경 내용이 없습니다.", showCancel: false });
    }

    saveMut.mutate(
      {
        data: {
          boardSeq: isEdit ? boardSeq : undefined,
          categoryCode: selectedBoard.configSeq,
          title,
          content,
          isPinned: isPinned ? "Y" : "N",
          pinnedStartAt: isPinned && pinnedStartAt ? pinnedStartAt.replace(/-/g, "") : undefined,
          pinnedEndAt: isPinned && pinnedEndAt ? pinnedEndAt.replace(/-/g, "") : undefined,
          postStatus: "PUBLISHED",
          deleteFileSeqList,
        },
        attachFiles: attachFiles.map((f: any) => new File([f.FileObj], f.name, { type: f.FileObj.type })),
      },
      {
        onSuccess: (res) => {
          const saved = res.data;
          const newItem: BoardListItem = {
            boardSeq: saved.boardSeq,
            category: saved.category,
            tags: saved.tags ?? [],
            title: saved.title,
            viewCount: saved.viewCount,
            commentCount: 0,
            isPinned: saved.isPinned,
            pinnedStartAt: saved.pinnedStartAt,
            pinnedEndAt: saved.pinnedEndAt,
            hasFile: saved.fileList?.length > 0 ? "Y" : "N",
            postStatus: saved.postStatus,
            createUser: saved.createUser,
            createAt: saved.createAt,
          };
          const updateList = (old: ApiResponse<BoardListResponse> | undefined, slice?: number) => {
            if (!old?.data?.list) return old;
            const list = isEdit
              ? old.data.list.map((p) => p.boardSeq === saved.boardSeq ? { ...p, ...newItem } : p)
              : [newItem, ...old.data.list];
            const sliced = slice ? list.slice(0, slice) : list;
            return { ...old, data: { ...old.data, list: sliced, totalCount: isEdit ? old.data.totalCount : old.data.totalCount + 1 } };
          };
          queryClient.setQueriesData({ queryKey: ["board", "list"] }, (old: ApiResponse<BoardListResponse> | undefined) => updateList(old));
          queryClient.setQueriesData({ queryKey: ["board", "recent"] }, (old: ApiResponse<BoardListResponse> | undefined) => updateList(old, 8));
          queryClient.invalidateQueries({ queryKey: ["board", "list"] });
          queryClient.invalidateQueries({ queryKey: ["board", "main"] });
          queryClient.invalidateQueries({ queryKey: ["board", "recent"] });
          if (isEdit && boardSeq) {
            queryClient.invalidateQueries({ queryKey: ["board", "detail", boardSeq] });
          }
          openAlert({
            message: isEdit ? "게시글이 수정되었습니다." : "게시글이 등록되었습니다.",
            onConfirm: () => isEdit ? navigate(-1) : navigate("/board/list"),
            showCancel: false,
          });
        },
        onError: () => openAlert({ message: "저장에 실패했습니다.", showCancel: false }),
      }
    );
  };

  const handleDraftSave = () => {
    if (!selectedBoard) return openAlert({ message: "게시판을 선택해주세요.", showCancel: false });
    if (!title.trim()) return openAlert({ message: "제목을 입력해주세요.", showCancel: false });
    if (isPinned && (!pinnedStartAt || !pinnedEndAt)) return openAlert({ message: "시작일과 종료일을 모두 입력해주세요.", showCancel: false });
    if (isPinned && pinnedStartAt && pinnedEndAt && pinnedStartAt > pinnedEndAt) return openAlert({ message: "종료일은 시작일보다 이후 날짜여야 합니다.", showCancel: false });

    saveMut.mutate(
      {
        data: {
          boardSeq: isEdit ? boardSeq : undefined,
          categoryCode: selectedBoard.configSeq,
          title,
          content,
          isPinned: isPinned ? "Y" : "N",
          pinnedStartAt: isPinned && pinnedStartAt ? pinnedStartAt.replace(/-/g, "") : undefined,
          pinnedEndAt: isPinned && pinnedEndAt ? pinnedEndAt.replace(/-/g, "") : undefined,
          postStatus: "DRAFT",
          deleteFileSeqList,
        },
        attachFiles: attachFiles.map((f: any) => new File([f.FileObj], f.name, { type: f.FileObj.type })),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["board", "list"] });
          if (isEdit && boardSeq) {
            queryClient.invalidateQueries({ queryKey: ["board", "detail", boardSeq] });
          }
          openAlert({ message: "임시저장 되었습니다.", showCancel: false });
        },
        onError: () => openAlert({ message: "임시저장에 실패했습니다.", showCancel: false }),
      }
    );
  };

  const handleDelete = () => {
    if (!boardSeq) return;
    openAlert({
      message: "게시글을 삭제하시겠습니까?",
      onConfirm: () => {
        deleteMut.mutate(boardSeq, {
          onSuccess: () => {
            const filterDeleted = (old: ApiResponse<BoardListResponse> | undefined) => {
              if (!old?.data?.list) return old;
              const list = old.data.list.filter((p) => p.boardSeq !== boardSeq);
              return { ...old, data: { ...old.data, list, totalCount: list.length } };
            };
            queryClient.setQueriesData({ queryKey: ["board", "list"] }, filterDeleted);
            queryClient.setQueriesData({ queryKey: ["board", "recent"] }, filterDeleted);
            queryClient.invalidateQueries({ queryKey: ["board", "list"] });
            queryClient.invalidateQueries({ queryKey: ["board", "main"] });
            queryClient.invalidateQueries({ queryKey: ["board", "recent"] });
            openAlert({ message: "삭제되었습니다.", onConfirm: () => navigate("/board/list"), showCancel: false });
          },
          onError: () => openAlert({ message: "삭제에 실패했습니다.", showCancel: false }),
        });
      },
    });
  };

  const handleBoardSelect = (board: BoardConfig) => {
    setSelectedBoard({ configSeq: board.configSeq!, boardName: board.boardName! });
  };

  const handleServerFileRemove = (fileSeq: string) => {
    setDeleteFileSeqList((prev) => [...prev, fileSeq]);
  };

  const MAX_TOTAL_SIZE = 10 * 1024 * 1024;

  const handleFilesChange = (files: any[]) => {
    const totalSize = files.reduce((acc: number, f: any) => acc + f.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      openAlert({ message: "첨부파일 총합이 10.0 MB를 초과할 수 없습니다.", showCancel: false });
      setAttachFiles([]);
      return;
    }
    setAttachFiles(files);
  };

  const handleFilesDrop = (droppedFiles: FileList) => {
    const newFiles: FileItem[] = Array.from(droppedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      FileObj: file,
    }));
    const totalSize = [...attachFiles, ...newFiles].reduce((acc, f) => acc + f.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      openAlert({ message: "첨부파일 총합이 10.0 MB를 초과할 수 없습니다.", showCancel: false });
      setAttachFiles([]);
      return;
    }
    setAttachFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* 상단 액션 바 */}
      <div className="flex shrink-0 items-center gap-1.5 border-b px-4 py-2.5">
        <Button
          variant="blue"
          size="h28"
          onClick={handleSave}
          disabled={saveMut.isPending}
        >
          <Icons.CloudUpload className="size-3.5" />
          {isEdit ? "수정" : "등록"}
        </Button>
        {!isEdit && (
          <Button
            variant="outline"
            size="h28"
            onClick={handleDraftSave}
          >
            <Icons.Save className="size-3.5" />
            임시저장
          </Button>
        )}
        <Button
          variant="outline"
          size="h28"
          onClick={() => setPreviewOpen(true)}
        >
          <Icons.Eye className="size-3.5" />
          미리보기
        </Button>

        <div className="ml-auto flex items-center gap-3">
          {isEdit && (
            <Button
              variant="destructive"
              size="h28"
              onClick={handleDelete}
              disabled={deleteMut.isPending}
            >
              <Icons.Trash2 className="size-3.5" />
              삭제
            </Button>
          )}
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none">
            본문 넓게 보기
            <button
              type="button"
              role="switch"
              aria-checked={wideMode}
              onClick={() => setWideMode((p) => !p)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                wideMode ? "bg-blue-600" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block size-3.5 rounded-full bg-background shadow transition-transform ${
                  wideMode ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {/* 폼 영역 */}
      <div
        className={`flex flex-1 flex-col overflow-y-auto ${
          wideMode ? "px-6" : "mx-auto w-full max-w-4xl px-6"
        }`}
      >
        {/* 게시판 행 */}
        <div className="flex items-center gap-3 border-b py-3">
          <span className="w-16 shrink-0 text-sm font-medium text-muted-foreground">게시판</span>
          <Button
            variant="outline"
            size="h28"
            onClick={() => setSelectModalOpen(true)}
          >
            게시판 선택
          </Button>
          {selectedBoard && (
            <span className="rounded-sm bg-muted px-2.5 py-1 text-sm font-medium text-foreground">
              {selectedBoard.boardName}
            </span>
          )}
        </div>

        {/* 제목 행 */}
        <div className="flex items-center gap-3 border-b py-3">
          <span className="w-16 shrink-0 text-sm font-medium text-muted-foreground">제목</span>
          <div className="relative flex flex-1 items-center">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 200))}
              placeholder="제목을 입력하세요"
              className="h-9 w-full rounded-md border border-input px-3 pr-16 text-sm focus:border-blue-400 focus:outline-none"
            />
            <span className="absolute right-3 text-xs text-muted-foreground">
              {title.length}/200
            </span>
          </div>
        </div>

        {/* 상단 고정 행 */}
        <div className="flex items-center gap-3 border-b py-3">
          <span className="w-16 shrink-0 text-sm font-medium text-muted-foreground">상단 고정</span>
          <button
            type="button"
            role="switch"
            aria-checked={isPinned}
            onClick={() => {
              setIsPinned((p) => {
                if (p) { setPinnedStartAt(""); setPinnedEndAt(""); }
                return !p;
              });
            }}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              isPinned ? "bg-blue-600" : "bg-muted-foreground/30"
            }`}
          >
            <span
              className={`inline-block size-3.5 rounded-full bg-background shadow transition-transform ${
                isPinned ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
          {isPinned && (
            <div className="flex items-center gap-2 text-sm">
              {/* 시작일 */}
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="flex h-8 items-center gap-1.5 rounded-md border border-input px-3 text-sm text-left hover:bg-muted/40 focus:outline-none">
                    <Icons.CalendarDays className="size-3.5 text-muted-foreground" />
                    {pinnedStartAt ? format(new Date(pinnedStartAt), "yyyy.MM.dd") : <span className="text-muted-foreground">시작일</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={pinnedStartAt ? new Date(pinnedStartAt) : undefined}
                    disabled={pinnedEndAt ? { after: new Date(pinnedEndAt) } : undefined}
                    onSelect={(d) => {
                      if (!d) return;
                      const v = formatYYYYMMDD(d);
                      setPinnedStartAt(v);
                      if (pinnedEndAt && v > pinnedEndAt) setPinnedEndAt("");
                    }}
                    captionLayout="dropdown"
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground">~</span>
              {/* 종료일 */}
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="flex h-8 items-center gap-1.5 rounded-md border border-input px-3 text-sm text-left hover:bg-muted/40 focus:outline-none">
                    <Icons.CalendarDays className="size-3.5 text-muted-foreground" />
                    {pinnedEndAt ? format(new Date(pinnedEndAt), "yyyy.MM.dd") : <span className="text-muted-foreground">종료일</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={pinnedEndAt ? new Date(pinnedEndAt) : undefined}
                    disabled={pinnedStartAt ? { before: new Date(pinnedStartAt) } : undefined}
                    onSelect={(d) => { if (d) setPinnedEndAt(formatYYYYMMDD(d)); }}
                    captionLayout="dropdown"
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* 본문 에디터 (첨부파일 통합) */}
        <div className="py-4">
          <RichTextEditor
            value={content}
            onChange={setContent}
            minHeight="calc(100vh - 380px)"
            onFilesDrop={handleFilesDrop}
            header={
              <div className="px-4 py-2">
                <MultiFiles
                  initialFiles={existingFiles}
                  files={attachFiles}
                  onFilesChange={handleFilesChange}
                  onServerFileRemove={handleServerFileRemove}
                  onDownload={downloadFile}
                  className="border-none py-0"
                  onError={(msg) => openAlert({ message: msg })}
                />
              </div>
            }
          />
        </div>
      </div>

      <BoardSelectModal
        open={selectModalOpen}
        onOpenChange={setSelectModalOpen}
        initialConfigSeq={selectedBoard?.configSeq}
        onConfirm={handleBoardSelect}
      />
      <BoardPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={{
          title,
          content,
          categoryName: selectedBoard?.boardName || "",
          attachFiles,
          existingFiles: existingFiles.filter(f => !deleteFileSeqList.includes(f.fileSeq)),
          userName: user?.userNameKo || "사용자",
          deptName: user?.deptName || "소속 부서 없음",
          profileUrl: user?.profileImageUrl,
          createdAt: format(new Date(), "yyyy. MM. dd."),
          isPinned,
          pinnedStartAt: isPinned ? pinnedStartAt.replace(/-/g, "") : undefined,
          pinnedEndAt: isPinned ? pinnedEndAt.replace(/-/g, "") : undefined,
        }}
      />
    </div>
  );
};

export default BoardForm;
