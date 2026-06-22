import { FlexBox } from "@repo/ui";
import { FlatTab } from "@shared/ui/tab/ui/Tabs";
import FlatItem from "@shared/ui/tab/ui/FlatItem";

export const CATEGORIES = [
  "국내",
  "개국",
  "PCT",
  "EP",
  "마드리드",
  "국제디자인",
  "이심",
  "기타",
] as const;

export type Category = (typeof CATEGORIES)[number];

interface Props {
  active: string;
  onChange: (cat: string) => void;
}

const DocCategoryTab = ({ active, onChange }: Props) => (
  <div className="mb-2">
    <FlatTab className="justify-start!">
      <FlexBox className="gap-4">
        {CATEGORIES.map((cat) => (
          <FlatItem key={cat} label={cat} value={cat} active={active} onClick={() => onChange(cat)} />
        ))}
      </FlexBox>
    </FlatTab>
  </div>
);

export default DocCategoryTab;
