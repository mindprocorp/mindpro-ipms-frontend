import { Button, FlexBox, Icons } from "@repo/ui";

interface SearchSectionHeaderProps {
  title: string;
  onAdd: () => void;
}

const SearchSectionHeader = ({ title, onAdd }: SearchSectionHeaderProps) => (
  <FlexBox className="items-center justify-between pb-2">
    <h2 className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 tracking-wide">{title}</h2>
    <Button size="h24" variant="outline-green" type="button" onClick={onAdd}>
      <Icons.Plus />
      추가
    </Button>
  </FlexBox>
);

export default SearchSectionHeader;
