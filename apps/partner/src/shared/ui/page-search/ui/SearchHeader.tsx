import { Button, FlexBox, Icons } from "@repo/ui";

type Props = {
  setSetting: () => void;
};

const SearchHeader = ({ setSetting }: Props) => {
  return (
    <div className="border-slate-200 dark:border-input bg-slate-100 dark:bg-slate-800 border-b px-4 py-2">
      <FlexBox>
        <h2 className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wide">검색설정</h2>
        <Button variant="ghost-pink" size="h24" onClick={setSetting}>
          <Icons.SlidersHorizontal />
          조건설정
        </Button>
      </FlexBox>
    </div>
  );
};

export default SearchHeader;
