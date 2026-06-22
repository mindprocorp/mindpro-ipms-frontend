import {
  AvatarWrap,
  Badge,
  Icons,
  Button,
  Checkbox,
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  cn,
} from "@repo/ui";
import User from "@repo/assets/images/user.png";
import { type NameTagTypes, type ActionsType } from "../model/useOurRefs.ts";

export const OurRefTag = ({
  id,
  ourRef,
  onSelect,
  checked,
  children,
  ...props
}: NameTagTypes & ActionsType & React.ComponentProps<"button">) => {
  return (
    <Button
      variant="ghost"
      size="h44"
      className="group data-[checked=true]:bg-p-color-1/5 relative mb-[1px] flex w-full items-center gap-2 py-2 pr-15"
      onClick={onSelect}
      data-checked={checked}
      {...props}
    >

      <div className="flex flex-1 justify-between gap-2">
        <div className="text-left text-xs">
          <p className="font-semibold">{ourRef}</p>
        </div>
        <div className="flex items-center gap-4">
          {children}
          {checked && (
            <Icons.Check className="text-p-color-4 group-disabled:text-text-100 absolute right-4" />
          )}
        </div>
      </div>
    </Button>
  );
};

export const NameTagCheck = ({
  ourRef,
  onSelect,
  checked,
  children,
  disabled,
  ...props
}: NameTagTypes & ActionsType & React.ComponentProps<"label"> & { disabled?: boolean }) => {
  return (
    <label
      className="data-[checked=true]:bg-p-color-1/5 data-[disabled=true]:[&>button]:bg-text data-[disabled=true]:[&>button]:border-text relative mb-[1px] flex w-full items-center gap-2 py-2 pr-15 data-[disabled=true]:opacity-50 data-[disabled=true]:[&>button]:opacity-50"
      onClick={onSelect}
      data-checked={checked}
      data-disabled={disabled}
      {...props}
    >
      <Checkbox
        size="sm"
        checked={checked}
        // className="data-[state=checked]:bg-text data-[state=checked]:border-text"
      />
      <AvatarWrap img={User} />
      <div className="flex flex-1 justify-between gap-2">
        <div className="text-left text-xs">
          <p className="font-semibold">{ourRef}</p>
        </div>

      </div>
      {children}
    </label>
  );
};

export const MemberSearchBox = ({
  memFind,
  className,
}: {
  memFind: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) => {
  return (
    <InputGroup className={cn("bg-bg-50", className)}>
      <InputGroupInput onChange={(e) => memFind(e)} placeholder="OurRef 검색" />
      <InputGroupAddon>
        <Icons.Search />
      </InputGroupAddon>
    </InputGroup>
  );
};
