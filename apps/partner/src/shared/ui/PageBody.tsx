import { cn } from "@repo/ui";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const PageBody = ({ children, className }: Props) => {
  return <div className={cn("mx-auto max-w-480 min-w-360 p-6 pt-16", className)}>{children}</div>;
};

export default PageBody;
