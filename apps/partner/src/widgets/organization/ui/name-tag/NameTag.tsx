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
import { type NameTagTypes, type ActionsType } from "../../model/useMembers";

export const NameTag = ({
  name,
  team,
  position,
  head,
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
      <AvatarWrap img={User} />
      <div className="flex flex-1 justify-between gap-2">
        <div className="text-left text-xs">
          <p className="font-semibold">{name}</p>
          <p className="text-text-200 text-[10px]">{`${team}/${position}`}</p>
        </div>
        <div className="flex items-center gap-4">
          {head && <Badge className="text-[11px]">{head}</Badge>}
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
  name,
  team,
  position,
  head,
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
          <p className="font-semibold">{name}</p>
          <p className="text-text-200 text-[10px]">{`${team}/${position}`}</p>
        </div>
        <div className="flex items-center gap-4">
          {head && <Badge className="text-[11px]">{head}</Badge>}
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
      <InputGroupInput onChange={(e) => memFind(e)} placeholder="조직원 검색" />
      <InputGroupAddon>
        <Icons.Search />
      </InputGroupAddon>
    </InputGroup>
  );
};
