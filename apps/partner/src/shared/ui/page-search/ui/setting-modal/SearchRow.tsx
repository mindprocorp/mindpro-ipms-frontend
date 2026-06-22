import { FlexBox, cn } from "@repo/ui";
import type { ReactNode } from "react";

interface SearchRowProps {
  isFocused: boolean;
  onClick: () => void;
  children: ReactNode;
}

const SearchRow = ({ isFocused, onClick, children }: SearchRowProps) => (
  <FlexBox
    onClick={onClick}
    className={cn(
      "cursor-pointer rounded border border-transparent p-1 transition-all",
      isFocused && "border-p-color-1 bg-p-color-1/10"
    )}
  >
    {children}
  </FlexBox>
);

export default SearchRow;
