import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  CustomTooltip,
  Icons,
} from "@repo/ui";

const BreadcrumbNavi = () => {
  return (
    <Breadcrumb className="[&_a]:text-text-200! [&_*]:text-xs! [&_a]:hover:underline!">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Icons.House className="size-3" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">출원관리</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">우선처리업무</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>기한관리현황</BreadcrumbPage>
          <CustomTooltip message="툴팁내용">
            <Icons.Info className="size-3" />
          </CustomTooltip>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNavi;
