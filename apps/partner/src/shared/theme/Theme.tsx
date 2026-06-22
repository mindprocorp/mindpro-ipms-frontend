import { Button, CustomTooltip, Icons, useTheme, cn } from "@repo/ui";

const Theme = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();
  return (
    <CustomTooltip message="모드변경">
      <Button
        className={cn(
          "hover:bg-bg-200 border-none bg-transparent p-1 shadow-none dark:bg-transparent dark:hover:bg-white/20",
          className,
        )}
        onClick={() => {
          if (theme === "light") {
            setTheme("dark");
          } else {
            setTheme("light");
          }
        }}
      >
        {theme === "light" ? (
          <Icons.Sun className="text-text size-5 dark:text-white" />
        ) : (
          <Icons.MoonStar className="text-text size-5 dark:text-white" />
        )}
      </Button>
    </CustomTooltip>
  );
};

export default Theme;
