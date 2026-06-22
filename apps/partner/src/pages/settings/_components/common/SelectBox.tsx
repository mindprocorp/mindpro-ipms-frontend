import { useState } from "react";
import {
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Icons,
} from "@repo/ui";

interface SelectBoxProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  search?: boolean;
}

const SelectBox = ({
  value,
  onChange,
  options,
  placeholder = "선택해주세요",
  className,
  search = false,
}: SelectBoxProps) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "h-7 w-full justify-between bg-white px-2 text-xs font-normal",
            className,
          )}
        >
          <span className="truncate">{selectedLabel || placeholder}</span>
          <Icons.ChevronsUpDown className="text-foreground shrink-0 size-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-[120px] p-0">
        <Command>
          {search && (
            <CommandInput placeholder="검색어를 입력해주세요" className="h-9 text-xs" />
          )}
          <CommandList>
            <CommandEmpty className="text-text-100 text-xs">검색결과가 없습니다.</CommandEmpty>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className="hover:bg-bg-100 cursor-pointer text-xs"
                  data-item-selected={item.value === value}
                >
                  {item.label}
                  <Icons.Check
                    className={cn(
                      "ml-auto",
                      value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectBox;
