import { FlexBox, Button, Icons } from "@repo/ui";

type Props = {
  setShowSave: React.Dispatch<React.SetStateAction<boolean>>;
  setImport: React.Dispatch<React.SetStateAction<boolean>>;
  onReset?: () => void;
};

const SearchFooter = ({ setShowSave, setImport, onReset }: Props) => {
  return (
    <FlexBox className="border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-input justify-between border-t p-2">
      <FlexBox className="w-auto flex-0 gap-0">
        <Button variant="default" type="button" onClick={() => setImport(true)}>
          <Icons.FolderOpenDot />
          불러오기
        </Button>
        <Button variant="default" type="button" onClick={() => setShowSave(true)}>
          <Icons.Save />
          저장
        </Button>
      </FlexBox>
      <FlexBox className="w-auto flex-none">
        <FlexBox>
          <Button variant="default" type="button" onClick={onReset}>
            <Icons.RotateCcw />
            초기화
          </Button>
          <Button type="submit" variant="blue">
            <Icons.Search />
            검색
          </Button>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

export default SearchFooter;
