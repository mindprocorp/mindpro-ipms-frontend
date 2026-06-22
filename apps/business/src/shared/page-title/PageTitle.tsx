import { Button, Icons } from "@repo/ui";
import BreadcrumbNavi from "@shared/bread-crumb-navi/BreadcrumbNavi";

type TitleProps = {
  title: string;
};

export const PageTitle = ({ title }: TitleProps) => {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <BreadcrumbNavi />
    </div>
  );
};

export const DetailPageTitle = ({ title }: TitleProps) => {
  return (
    <div className="mb-3 flex items-end justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="h36" className="w-9">
          <Icons.ArrowLeft className="size-5" />
        </Button>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      <BreadcrumbNavi />
    </div>
  );
};
