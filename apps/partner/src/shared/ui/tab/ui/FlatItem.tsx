import { Button } from "@repo/ui";
import type { LabelAndValueProps } from "@shared/schema";

type Props = LabelAndValueProps & {
  active?: string;
}&React.ComponentProps<'button'>;

const Item = ({ label, value, active, ...props }: Props) => {
  const activeValue = active === value || active === label;
  return (
    <Button
      data-active={activeValue}
      variant="default"
      size="h40"
      className={`text-slate-500 data-[active=true]:text-blue-600 relative bg-transparent! px-0 text-[13px]! font-medium`}
      {...props}
    >
      {label}
      {activeValue && (
        <span className="bg-blue-500 absolute bottom-0 left-0 block h-0.5 w-full rounded-full"></span>
      )}
    </Button>
  );
};

export default Item;
