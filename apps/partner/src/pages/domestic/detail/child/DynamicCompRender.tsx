import React from "react";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import DesignStrategy from "@pages/domestic/detail/_components/design/DesignStrategy.tsx";
import Strategy from "@pages/domestic/detail/_components/common/Strategy.tsx";
import Statement from "@pages/domestic/detail/_components/common/Statement.tsx";
import DesignProducts from "@pages/domestic/detail/_components/design/DesignProducts.tsx";
import Sasido from "@pages/domestic/detail/_components/common/Sasido.tsx";
import Management from "@pages/domestic/detail/_components/common/Management.tsx";
import DesignManagement from "@pages/domestic/detail/_components/design/DesignManagement.tsx";
import DesignBasicInfo from "@pages/domestic/detail/_components/design/DesignBasicInfo.tsx";
import BasicInfo from "@pages/domestic/detail/_components/common/BasicInfo.tsx";
import PatentDefaultInfo from "@pages/domestic/detail/_components/patent/PatentDefaultInfo.tsx";
import PracticeDefaultInfo from "@pages/domestic/detail/_components/practice/PracticeDefaultInfo.tsx";
import DesignDefaultInfo from "@pages/domestic/detail/_components/design/DesignDefaultInfo.tsx";
import TradeMarkBasicInfo from "@pages/domestic/detail/_components/trade-mark/TradeMarkBasicInfo.tsx";
import TrandMarkStrategy from "@pages/domestic/detail/_components/trade-mark/TradeMarkStrategy.tsx";
import TradeMarkManagement from "@pages/domestic/detail/_components/trade-mark/TradeMarkManagement.tsx";
import Maintenance from "@pages/domestic/detail/_components/common/Maintenance.tsx";
import DesignMaintenance from "@pages/domestic/detail/_components/design/DesignMaintenance.tsx";
import TradeMarkMaintenance from "@pages/domestic/detail/_components/trade-mark/TradeMarkMaintenance.tsx";
import Note from "@pages/domestic/detail/_components/common/Note.tsx";
import Appellation from "@pages/domestic/detail/_components/common/Appellation.tsx";
import DesignAppellation from "@pages/domestic/detail/_components/design/DesignAppellation.tsx";
import { RIGHT_TYPE } from "@shared/enum/domesticType.ts";
import DirectlyInvolved from "@pages/domestic/detail/_components/common/DirectlyInvolved.tsx";
import TradeMarkDirectlyInvolved from "@pages/domestic/detail/_components/trade-mark/TradeMarkDirectlyInvolved.tsx";
import TradeMarkAppellation from "@pages/domestic/detail/_components/trade-mark/TradeMarkAppellation.tsx";
import HardSummary from "@pages/domestic/detail/_components/common/HardSummary.tsx";
import DesignSummary from "@pages/domestic/detail/_components/design/DesignSummary.tsx";

export type RightType = string;

type DefaultInfoCodeListProps = {
  rightCodeList: CodeSelectOption[];
  appCodeList: CodeSelectOption[];
  designAppCodeList: CodeSelectOption[];
  tradeMarkAppCodeList: CodeSelectOption[];
  cateCodeList: CodeSelectOption[];
  appKindCodeList: CodeSelectOption[];
};

type StrategyCodeListProps = {
  foreignAppTiming: CodeSelectOption[];
};
type StatementCodeListProps = {
  gradeCodeList: CodeSelectOption[];
};
type BasicInfoCodeListProps = {
  appLangCodeList: CodeSelectOption[];
};
type MaintenanceCodeListProps = {
  discountRatioCodeList: CodeSelectOption[];
  yearDiscountRatioCodeList: CodeSelectOption[];
};



const domesticRenderMap = {
  // 출원사건정보
  defaultInfo: (rightType: RightType, props: DefaultInfoCodeListProps) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return (
          <PatentDefaultInfo
            rightCodeList={props.rightCodeList}
            appCodeList={props.appCodeList}
            cateCodeList={props.cateCodeList}
            appKindCodeList={props.appKindCodeList}
          />
        );
      case RIGHT_TYPE.PRACTICE.code:
        return (
          <PracticeDefaultInfo
            rightCodeList={props.rightCodeList}
            appCodeList={props.appCodeList}
            cateCodeList={props.cateCodeList}
            appKindCodeList={props.appKindCodeList}
          />
        );
      case RIGHT_TYPE.DESIGN.code:
        return (
          <DesignDefaultInfo
            rightCodeList={props.rightCodeList}
            appCodeList={props.designAppCodeList}
            cateCodeList={props.cateCodeList}
            appKindCodeList={props.appKindCodeList}
          />
        );
      case RIGHT_TYPE.TRADE.code:
        return (
          <DesignDefaultInfo
            rightCodeList={props.rightCodeList}
            appCodeList={props.tradeMarkAppCodeList}
            cateCodeList={props.cateCodeList}
            appKindCodeList={props.appKindCodeList}
          />
        );
      default:
        return (
          <PatentDefaultInfo
            rightCodeList={props.rightCodeList}
            appCodeList={props.appCodeList}
            cateCodeList={props.cateCodeList}
            appKindCodeList={props.appKindCodeList}
          />
        );
    }
  },

  // 기본정보
  basicInfo: (rightType: RightType, props: BasicInfoCodeListProps) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <BasicInfo appLangCodeList={props.appLangCodeList} />;
      case RIGHT_TYPE.PRACTICE.code:
        return <BasicInfo appLangCodeList={props.appLangCodeList} />;
      case RIGHT_TYPE.DESIGN.code:
        return <DesignBasicInfo appLangCodeList={props.appLangCodeList} />;
      case RIGHT_TYPE.TRADE.code:
        return <TradeMarkBasicInfo appLangCodeList={props.appLangCodeList} />;
      default:
        return <BasicInfo appLangCodeList={props.appLangCodeList} />;
    }
  },

  // 전략설정
  strategy: (rightType: RightType, props: StrategyCodeListProps) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <Strategy foreignAppTiming={props.foreignAppTiming} />;
      case RIGHT_TYPE.PRACTICE.code:
        return <Strategy foreignAppTiming={props.foreignAppTiming} />;
      case RIGHT_TYPE.DESIGN.code:
        return <DesignStrategy foreignAppTiming={props.foreignAppTiming} />;
      case RIGHT_TYPE.TRADE.code:
        return <TrandMarkStrategy foreignAppTiming={props.foreignAppTiming} />;
      default:
        return <Strategy foreignAppTiming={props.foreignAppTiming} />;
    }
  },

  // 명세서구성요소
  statement: (rightType: RightType, props: StatementCodeListProps) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <Statement gradeCodeList={props.gradeCodeList} />;
      case RIGHT_TYPE.PRACTICE.code:
        return <Statement gradeCodeList={props.gradeCodeList} />;
      case RIGHT_TYPE.DESIGN.code:
        return null;
      case RIGHT_TYPE.TRADE.code:
        return null;
      default:
        return <Statement gradeCodeList={props.gradeCodeList} />;
    }
  },

  // 물품류
  products: (rightType: RightType) =>{
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return null;
      case RIGHT_TYPE.PRACTICE.code:
        return null;
      case RIGHT_TYPE.DESIGN.code:
        return <DesignProducts />;
      case RIGHT_TYPE.TRADE.code:
        return <DesignProducts />;
      default:
        return <DesignProducts />;
    }
  },

  // 사시도
  sasido: (rightType: RightType) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return null;
      case RIGHT_TYPE.PRACTICE.code:
        return null;
      case RIGHT_TYPE.DESIGN.code:
        return <Sasido rightType={rightType} />;
      case RIGHT_TYPE.TRADE.code:
        return <Sasido rightType={rightType} />;
      default:
        return <Sasido rightType={rightType} />;
    }
  },

  //출원행정관리
  management: (rightType: RightType) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <Management />;
      case RIGHT_TYPE.PRACTICE.code:
        return <Management />;
      case RIGHT_TYPE.DESIGN.code:
        return <DesignManagement />;
      case RIGHT_TYPE.TRADE.code:
        return <TradeMarkManagement />;
      default:
        return <Management />;
    }
  },
  //등록유지관리
  maintenance: (rightType: RightType, props: MaintenanceCodeListProps) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return (
          <Maintenance
            discountRatioCodeList={props.discountRatioCodeList}
            yearDiscountRatioCodeList={props.yearDiscountRatioCodeList}
          />
        );
      case RIGHT_TYPE.PRACTICE.code:
        return (
          <Maintenance
            discountRatioCodeList={props.discountRatioCodeList}
            yearDiscountRatioCodeList={props.yearDiscountRatioCodeList}
          />
        );
      case RIGHT_TYPE.DESIGN.code:
        return (
          <DesignMaintenance
            discountRatioCodeList={props.discountRatioCodeList}
            yearDiscountRatioCodeList={props.yearDiscountRatioCodeList}
          />
        );

      case RIGHT_TYPE.TRADE.code:
        return (
          <TradeMarkMaintenance
            discountRatioCodeList={props.discountRatioCodeList}
            yearDiscountRatioCodeList={props.yearDiscountRatioCodeList}
          />
        );
      default:
        return (
          <Maintenance
            discountRatioCodeList={props.discountRatioCodeList}
            yearDiscountRatioCodeList={props.yearDiscountRatioCodeList}
          />
        );
    }
  },
  // 노트
  note: (rightType: RightType) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <Note />;
      case RIGHT_TYPE.PRACTICE.code:
        return null;
      case RIGHT_TYPE.DESIGN.code:
        return <Note />;
      case RIGHT_TYPE.TRADE.code:
        return null;
      default:
        return <Note />;
    }
  },
  appellation(rightType: RightType) {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <Appellation />;
      case RIGHT_TYPE.PRACTICE.code:
        return <Appellation />;
      case RIGHT_TYPE.DESIGN.code:
        return <DesignAppellation />;
      case RIGHT_TYPE.TRADE.code:
        return <TradeMarkAppellation />;
      default:
        return <Appellation />;
    }
  },
  directlyInvolved(rightType : RightType) {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <DirectlyInvolved />;
      case RIGHT_TYPE.PRACTICE.code:
        return <DirectlyInvolved />;
      case RIGHT_TYPE.DESIGN.code:
        return <DirectlyInvolved />;
      case RIGHT_TYPE.TRADE.code:
        return <TradeMarkDirectlyInvolved />;
      default:
        return <DirectlyInvolved />;
    }
  },
  hardSummary(rightTYpe : RightType) {
    switch (rightTYpe) {
      case RIGHT_TYPE.PATENT.code:
        return <HardSummary />;
      case RIGHT_TYPE.PRACTICE.code:
        return <HardSummary />;
      case RIGHT_TYPE.DESIGN.code:
        return <DesignSummary />;
      case RIGHT_TYPE.TRADE.code:
        return null;
      default:
        return <HardSummary />;
    }
  },
};
export default domesticRenderMap
