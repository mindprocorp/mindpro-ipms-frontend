import { useState, useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  RHF,
  Popover,
  PopoverContent,
  PopoverAnchor,
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Icons,
} from "@repo/ui";
import { type RegistryItem } from "@repo/api";
import { commonApis } from "@shared/query/queries";

const { Check } = Icons;

const CompanySearchForm = () => {
  const { control, setValue } = useFormContext();
  const [open, setOpen] = useState(false);
  const [offices, setOffices] = useState<RegistryItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const companyName = useWatch({ control, name: "companyName" }) || "";
  const companyId = useWatch({ control, name: "companyId" });

  // 사무소 목록 조회
  useEffect(() => {
    commonApis.getOffices().then(setOffices);
  }, []);

  // 검색 필터링 (대소문자 구분 없음)
  const filteredCompanies = offices.filter((c) =>
    c.label.toLowerCase().includes(companyName.toLowerCase())
  );

  // 입력값 변경 시 드롭다운 열기
  useEffect(() => {
    if (companyName && filteredCompanies.length > 0 && !companyId) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [companyName, filteredCompanies.length, companyId]);

  // 회사 선택
  const handleSelect = (id: string, label: string) => {
    setValue("companyId", id);
    setValue("companyName", label);
    setOpen(false);
  };

  // 포커스 시 선택 해제
  const handleFocus = () => {
    if (companyId) setValue("companyId", "");
  };

  return (
    <RHF.FormField>
      <div ref={containerRef} className="w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverAnchor asChild>
            <div>
              <RHF.Input
                control={control}
                name="companyName"
                label="소속회사 (선택)"
                placeholder="회사명을 검색하세요"
                autoComplete="off"
                onFocus={handleFocus}
                suffix={companyId && <Check className="size-4 text-green-600" />}
              />
            </div>
          </PopoverAnchor>
          <PopoverContent
            className="p-0"
            align="start"
            style={{ width: containerRef.current?.offsetWidth }}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Command shouldFilter={false}>
              <CommandList>
                <CommandEmpty>검색 결과가 없습니다</CommandEmpty>
                <CommandGroup>
                  {filteredCompanies.map((company) => (
                    <CommandItem
                      key={company.id}
                      onSelect={() => handleSelect(company.id, company.label)}
                    >
                      {company.label}
                      {companyId === company.id && (
                        <Check className="ml-auto size-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </RHF.FormField>
  );
};

export default CompanySearchForm;
