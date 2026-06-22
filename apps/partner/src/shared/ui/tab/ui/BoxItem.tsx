import { Button } from "@repo/ui";
import type { LabelAndValueProps } from "@shared/schema";

type Props = LabelAndValueProps & {
  active?: string;
  onClick?: (value: string) => void;
};

const BoxItem = ({ label, value, active, onClick }: Props) => {
  const activeValue = active === value || active === label;
  return (
    <Button
      data-active={activeValue}
      variant="default"
      size="h36"
      className={`text-text-200 data-[active=true]:text-p-color-1 data-[active=true]:border-p-color-1 hover:inset-shadow-md dark:data-[active=true]:bg-p-color-1! relative bg-transparent! px-4 font-semibold hover:bg-white! data-[active=true]:border data-[active=true]:bg-white!`}
      onClick={() => onClick?.(value)}
    >
      {label}
    </Button>
  );
};

export default BoxItem;
