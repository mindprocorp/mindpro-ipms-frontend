import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  Icons,
  cn,
} from "@repo/ui";
import { useTranslation, i18n } from "@repo/i18n";
import { useEffect, useState } from "react";
import { resources } from "@shared/locales/resources";

const LangChoice = ({ className }: { className?: string }) => {
  const langs = Object.keys(resources).map((lang) => ({
    label: lang,
    value: lang,
  }));
  const [langStorage, setLangStorage] = useState(localStorage.getItem("lang") || "KO");
  const { t } = useTranslation();
  const langChangeHandle = (lang: string) => {
    localStorage.setItem("lang", lang);
    setLangStorage(lang);
  };

  useEffect(() => {
    i18n.changeLanguage(langStorage);
  }, [langStorage]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn(className)}>
          <Icons.Earth className="size-3.5" /> {langStorage.toLocaleUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-14">
        {langs.map((lang) => {
          return (
            <DropdownMenuCheckboxItem
              key={lang.value}
              className="pl-2 text-xs [&>span]:right-1 [&>span]:left-auto [&>span_svg]:size-3"
              checked={lang.label === langStorage}
              onCheckedChange={(checked) => langChangeHandle(lang.label)}
            >
              {lang.label.toLocaleUpperCase()}
              {t("common.langTest")}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LangChoice;
