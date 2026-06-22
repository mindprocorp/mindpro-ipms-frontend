import React, { useEffect, useState } from "react";
import { RHF } from "@repo/ui";
import { cn } from "@repo/ui";

type SearchSelectType = React.ComponentProps<typeof RHF.FormSelect>;
type Items = { label: string; value: string };

const testValue = [
  {
    value: "test1",
    label: "테스트 라벨1",
  },
  {
    value: "test2",
    label: "테스트 라벨2",
  },
];

const SearchSelect = ({
  items = [],
  align = "end",
  dataKey,
  ...props
}: Omit<SearchSelectType, "items"> & {
  items?: Items[];
  align?: "start" | "center" | "end";
  dataKey?: string;
}) => {
  const [value, setValue] = useState<Items[] | []>([]);
  useEffect(() => {
    setValue(testValue);
  }, []);
  return (
    <RHF.FormSelect
      className={cn("w-auto min-w-auto! [&>button]:rounded-l-none [&>button]:border-l-0!")}
      align={align}
      items={value}
      buttonOnly
      {...props}
    />
  );
};

export default SearchSelect;
