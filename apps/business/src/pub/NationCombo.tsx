import {
  BaseLabel,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  Popover,
  Icons,
  PopoverContent,
  PopoverTrigger,
  cn,
  CommandInput,
  Error,
  RHF,
} from "@repo/ui";
import React from "react";
import { useController } from "react-hook-form";

type SearchSelectType = React.ComponentProps<typeof RHF.FormSelect>;

const NationCombo = ({
  control,
  items,
  label,
  ess = false,
  tooltip,
  size,
  className,
  buttonOnly = false,
  disabled,
  placeholder,
  align = "start",
  search = true,
  width = 100,
  orientation = "vertical",
  name,
}: SearchSelectType) => {
  const { field, fieldState } = useController({ name, control });
  const [open, setOpen] = React.useState(false);

  const openHandler = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const onChangeValue = (value: string) => {
    field.onChange(value);
  };

  return (
    <Popover open={open} onOpenChange={openHandler}>
      <div
        data-orientation={orientation}
        className={cn(
          `min-w-[${width}px] relative flex w-full flex-col gap-1`,
          "data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:justify-between",
          className,
        )}
      >
        <BaseLabel label={label} ess={ess} tooltip={tooltip} />
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size={size}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            className={cn(
              `w-full justify-between p-1.5`,
              !field.value ? "text-placeholder" : field.value,
            )}
          >
            {buttonOnly ? (
              <Icons.Search className="text-foreground" />
            ) : (
              <>
                {field.value
                  ? items.find((item) => item.value === field.value)?.label
                  : placeholder}
                <Icons.ChevronsUpDown className="text-foreground" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        {fieldState.invalid && !buttonOnly && <Error errors={[fieldState.error]} />}
        <PopoverContent align={align} className={`min-w-[${width}px] w-auto p-0`}>
          <Command>
            {search && <CommandInput placeholder="검색어를 입력해주세요" className="h-9 text-xs" />}
            <CommandList>
              <CommandEmpty className="text-text-100 text-xs">검색결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={(currentValue) => {
                      onChangeValue(item.value);
                      setOpen(false);
                    }}
                    className="hover:bg-bg-100 cursor-pointer text-xs"
                    data-item-selected={item.value === field.value || item.label === field.value}
                  >
                    <span className="text-text-link">{item.value}</span>
                    <span>{item.label}</span>
                    <Icons.Check
                      className={cn(
                        "ml-auto",
                        field.value === item.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            {/* <div>
              <Button variant="default" className="mr-auto" size="h32">
                선택취소
              </Button>
            </div> */}
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
};

export default NationCombo;
