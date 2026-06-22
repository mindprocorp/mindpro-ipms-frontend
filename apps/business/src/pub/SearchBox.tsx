import { Button, Icons, RHF } from "@repo/ui";
import SearchSelect from "@shared/search-select/ui/SearchSelect";
import type { UseFormReturn } from "react-hook-form";

type SizeProps = "default" | "h48" | "h44" | "h40" | "h36" | "h32" | "h28" | "h24" | undefined;

type SearchForm = {
  form: UseFormReturn;
  size?: SizeProps;
};

export const SearchBox = ({ form, ...props }: SearchForm) => {
  return (
    <div
      data-slot="search-box"
      className="border-border-100 bg-bg-100 relative flex flex-wrap gap-2 rounded-[6px] border p-4 pr-28 [&>div]:mr-4"
    >
      <RHF.FormSelect
        control={form.control}
        name="val1"
        items={[
          {
            value: "test1",
            label: "테스트 라벨1",
          },
          {
            value: "test2",
            label: "테스트 라벨2",
          },
        ]}
        label="선택형"
        orientation="horizontal"
        className="w-fit [&>button]:w-40!"
        {...props}
      />

      <RHF.Input
        control={form.control}
        name="val1"
        label="일반입력"
        orientation="horizontal"
        className="w-fit [&>div]:w-40!"
        {...props}
      />

      <RHF.Input
        control={form.control}
        name="val1"
        label="검색필드"
        orientation="horizontal"
        prefix={<Icons.Search />}
        className="w-fit [&>div]:w-40!"
        {...props}
      />

      <RHF.FormDatePicker
        control={form.control}
        name="val1"
        label="날짜"
        orientation="horizontal"
        className="w-fit [&>div]:w-40!"
        {...props}
      />

      <RHF.FormDateFromToPicker
        control={form.control}
        name={["val", "val"]}
        label="from-to"
        className="w-90 flex-none"
        orientation="horizontal"
        {...props}
      />

      <RHF.Input
        control={form.control}
        name="val1"
        label="검색 셀렉트"
        orientation="horizontal"
        className="w-fit [&>div]:w-40!"
        actions={
          <>
            <SearchSelect control={form.control} name="testVal" {...props} />
          </>
        }
        {...props}
      />

      <RHF.FormField name="val1" label="복합 폼 요소" className="[&>div]:gap-1">
        <RHF.FormSelect
          control={form.control}
          name="val1"
          items={[
            {
              value: "test1",
              label: "테스트 라벨1",
            },
            {
              value: "test2",
              label: "테스트 라벨2",
            },
          ]}
          orientation="horizontal"
          className="w-fit [&>button]:w-40!"
          {...props}
        />

        <RHF.Input
          control={form.control}
          name="val1"
          orientation="horizontal"
          className="w-fit [&>div]:w-40!"
          actions={
            <>
              <SearchSelect control={form.control} name="testVal" {...props} />
            </>
          }
          {...props}
        />
      </RHF.FormField>

      <Button variant="blue" className="absolute right-5 bottom-4" {...props}>
        <Icons.Search />
        검색
      </Button>
    </div>
  );
};
