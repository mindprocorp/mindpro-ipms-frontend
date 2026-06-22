import { Button, Icons } from "@repo/ui";

interface Props {
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  disableEdit: boolean;
  totalCount?: number;
}

const DocEditActions = ({ onAdd, onUpdate, onDelete, disableEdit, totalCount }: Props) => (
  <div className="flex items-center justify-between pb-2">
    {totalCount !== undefined ? (
      <p className="text-text-200 text-sm">
        총 <span className="text-p-color-1 font-bold">{totalCount}</span>건의 결과가 있습니다.
      </p>
    ) : (
      <span />
    )}
    <div className="flex items-center gap-2">
      <p className="text-muted-foreground text-xs">추가 하시려면 자료수정 후, 추가버튼을 누르세요.</p>
      <Button size="h28" onClick={onAdd}>
        <Icons.Plus className="size-3.5" />
        추가
      </Button>
      <Button size="h28" onClick={onUpdate} disabled={disableEdit}>
        <Icons.RefreshCcw className="size-3.5" />
        수정
      </Button>
      <Button size="h28" variant="outline-pink" onClick={onDelete} disabled={disableEdit}>
        <Icons.Trash2 className="size-3.5" />
        삭제
      </Button>
    </div>
  </div>
);

export default DocEditActions;
