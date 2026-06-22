import { Button, CustomTooltip, Icons, RHF, GN, Separator } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext, useWatch } from "react-hook-form";
import type { DomesticFormInput } from "@shared/schema/domestic/domesticSchema.ts";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import { useEffect, useState } from "react";

interface CodeListType {
  rightCodeList: CodeSelectOption[];
  appCodeList: CodeSelectOption[];
  cateCodeList: CodeSelectOption[];
  appKindCodeList: CodeSelectOption[];
}

//출원인, 관리번호, 출원/등록 번호, 명칭, 현재 상태
const options = [
  {
    optCode: "draft_deadline",
    label: "출원인",
    formName: "appCounterPartyInfo.applicantInfo.userName",
    type: "input_find",
  },
  {
    optCode: "app_deadline",
    label: "관리번호",
    formName: "appCaseMng.clientRef",
    type: "input",
  },
  {
    optCode: "app_deadlines",
    label: "관리번호",
    formName: "appCaseMng.clientRef",
    type: "textarea",
  },
];

const Summary = () => {
  const { control } = useFormContext<DomesticFormInput>();
  const [option, setOption] = useState([]);

  const rightType = useWatch({
    control,
    name: "appCaseMng.rightType.code",
  });

  useEffect(() => {
    console.log("선택된 권리구분 value:", rightType);
  }, [rightType]);

  const chHandler = (c: boolean | string, v: string) => {
    const optItem = options.find((item) => {
      return item.optCode === v;
    });

    const values = option.find((item) => {
      return item.optCode === v;
    });
    if (!values) {
      setOption((prev) => {
        localStorage.setItem("setting", JSON.stringify([...prev, optItem]));
        return [...prev, optItem];
      });

      return;
    }

    setOption((prev) => {
      const restItem = prev.filter((item) => item.optCode !== v);
      localStorage.setItem("setting", JSON.stringify(restItem));
      return restItem;
    });
    console.log("값을 표기", c, v, values, optItem);
  };

  useEffect(() => {
    const settings = localStorage.getItem("setting");
    console.log("settings", settings);
    if (settings) {
      setOption(JSON.parse(settings));
    }
  }, []);

  //   useEffect(() => {
  //     localStorage.setItem("setting", JSON.stringify(option));
  //   }, [option]);

  console.log("localStorage.getItem", localStorage.getItem("setting"));

  return (
    <>
      <div className="border-p-color-4 w-full overflow-hidden rounded-md border-2">
        <div className="flex gap-3 p-4">
          <h2 className="text-[13px] font-semibold">요약정보</h2>
          <div className="flex gap-2">
            {options.map((item, index) => {
              return (
                <GN.CheckBox
                  value={item.optCode}
                  name={item.label}
                  label={item.label}
                  size="sm"
                  onCheckedChange={chHandler}
                  checked={
                    !!option.filter((v) => {
                      console.log("++++++++++++", v.optCode === item.optCode);
                      return v.optCode === item.optCode;
                    }).length
                  }
                />
              );
            })}
          </div>
        </div>
        <div className="space-y-2 p-4 pt-0">
          <div className="flex gap-2">
            {option.length !== 0
              ? option.map((item) => {
                  switch (item.type) {
                    case "input_find":
                      return (
                        <RHF.Input
                          control={control}
                          name={item.formName}
                          label={item.label}
                          inputDisabled
                        />
                      );

                    case "input":
                      return (
                        <RHF.Input control={control} name={item.formName} label={item.label} />
                      );
                  }
                })
              : null}
          </div>
          <div className="flex gap-2">
            {option.length !== 0
              ? option.map((item) => {
                  switch (item.type) {
                    case "textarea":
                      return (
                        <RHF.FormTextarea
                          control={control}
                          name={item.formName}
                          label={item.label}
                          className="w-full"
                        />
                      );
                  }
                })
              : null}
          </div>
        </div>
      </div>
      <Separator className="my-2 border-t" />
    </>
  );
};

export default Summary;
