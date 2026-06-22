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
import DirectAppDefaultInfo from "@pages/overseas/etc/direct-app/_components/patent/DirectAppDefaultInfo.tsx";
import DirectAppBasicInfo from "@pages/overseas/etc/direct-app/_components/patent/DirectAppBasicInfo.tsx";
import DirectDesignBasicInfo from "@pages/overseas/etc/direct-app/_components/design/DirectDesignBasicInfo.tsx";
import DirectAppStatement from "@pages/overseas/etc/direct-app/_components/patent/DirectAppStatement.tsx";
import DirectAppStrategy from "@pages/overseas/etc/direct-app/_components/patent/DirectAppStrategy.tsx";
import DirectDesignStrategy from "@pages/overseas/etc/direct-app/_components/design/DirectDesignStrategy.tsx";
import DirectAppManagement from "@pages/overseas/etc/direct-app/_components/patent/DirectAppManagement.tsx";
import DirectDesignManagement from "@pages/overseas/etc/direct-app/_components/design/DirectDesignManagement.tsx";
import DirectAppMaintenance from "@pages/overseas/etc/direct-app/_components/patent/DirectAppMaintenance.tsx";
import DirectAppDirectlyInvolved from "@pages/overseas/etc/direct-app/_components/patent/DirectAppDirectlyInvolved.tsx";
import DirectTradeStrategy from "@pages/overseas/etc/direct-app/_components/trade/DirectTradeStrategy.tsx";
import DirectTradeManagement from "@pages/overseas/etc/direct-app/_components/trade/DirectTradeManagement.tsx";
import DirectTradeMaintenance from "@pages/overseas/etc/direct-app/_components/trade/DirectTradeMaintenance.tsx";
import DirectDesignSasido from "@pages/overseas/etc/direct-app/_components/design/DirectDesignSasido.tsx";
import DirectDesignDirectlyInvolved
  from "@pages/overseas/etc/direct-app/_components/design/DirectDesignDirectlyInvolved.tsx";
import DirectDesignMaintenance from "@pages/overseas/etc/direct-app/_components/design/DirectDesignMaintenance.tsx";
import DirectTradeBasicInfo from "@pages/overseas/etc/direct-app/_components/trade/DirectTradeBasicInfo.tsx";
import DirectTradeSasido from "@pages/overseas/etc/direct-app/_components/trade/DirectTradeSasido.tsx";
import DirectTradeProducts from "@pages/overseas/etc/direct-app/_components/trade/DirectTradeProducts.tsx";

export type RightType = string;

type DefaultInfoCodeListProps = {
  rightCodeList: CodeSelectOption[];
  appCodeList: CodeSelectOption[];
  cateCodeList: CodeSelectOption[];
  appKindCodeList: CodeSelectOption[];
  ipProcCodeList: CodeSelectOption[];
  appSeq?: string;
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




const overseasDirectRenderMap = {
  // 출원사건정보
  defaultInfo: (rightType: RightType, props: DefaultInfoCodeListProps) => {
    return (
      <DirectAppDefaultInfo
        rightCodeList={props.rightCodeList}
        appCodeList={props.appCodeList}
        cateCodeList={props.cateCodeList}
        appKindCodeList={props.appKindCodeList}
        ipProcCodeList={props.ipProcCodeList}
        appSeq={props.appSeq}
      />
    );
  },

  // 기본정보
  basicInfo: (rightType: RightType) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <DirectAppBasicInfo />;
      case RIGHT_TYPE.PRACTICE.code:
        return <DirectAppBasicInfo />;
      case RIGHT_TYPE.DESIGN.code:
        return <DirectDesignBasicInfo />;
      case RIGHT_TYPE.TRADE.code:
        return <DirectTradeBasicInfo />;
      default:
        return <DirectAppBasicInfo />;
    }
  },

  // 전략설정
  strategy: (rightType: RightType) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <DirectAppStrategy />;
      case RIGHT_TYPE.PRACTICE.code:
        return <DirectAppStrategy />;
      case RIGHT_TYPE.DESIGN.code:
        return <DirectDesignStrategy />;
      case RIGHT_TYPE.TRADE.code:
        return <DirectTradeStrategy />;
      default:
        return <DirectAppStrategy />;
    }
  },

  // 명세서구성요소
  statement: (rightType: RightType, props: StatementCodeListProps) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <DirectAppStatement gradeCodeList={props.gradeCodeList} />;
      case RIGHT_TYPE.PRACTICE.code:
        return <DirectAppStatement gradeCodeList={props.gradeCodeList} />;
      case RIGHT_TYPE.DESIGN.code:
        return null;
      case RIGHT_TYPE.TRADE.code:
        return null;
      default:
        return <DirectAppStatement gradeCodeList={props.gradeCodeList} />;
    }
  },

  // 물품류
  products: (rightType: RightType) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return null;
      case RIGHT_TYPE.PRACTICE.code:
        return null;
      case RIGHT_TYPE.DESIGN.code:
        return null;
      case RIGHT_TYPE.TRADE.code:
        return <DirectTradeProducts />;
      default:
        return <DirectTradeProducts />;
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
        return <DirectDesignSasido />;
      case RIGHT_TYPE.TRADE.code:
        return <DirectTradeSasido />;
      default:
        return <DirectDesignSasido />;
    }
  },

  //출원행정관리
  management: (rightType: RightType) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <DirectAppManagement />;
      case RIGHT_TYPE.PRACTICE.code:
        return <DirectAppManagement />;
      case RIGHT_TYPE.DESIGN.code:
        return <DirectDesignManagement />;
      case RIGHT_TYPE.TRADE.code:
        return <DirectTradeManagement />;
      default:
        return <DirectAppManagement />;
    }
  },
  //등록유지관리
  maintenance: (rightType: RightType) => {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <DirectAppMaintenance />;
      case RIGHT_TYPE.PRACTICE.code:
        return <DirectAppMaintenance />;
      case RIGHT_TYPE.DESIGN.code:
        return <DirectDesignMaintenance />;
      case RIGHT_TYPE.TRADE.code:
        return <DirectTradeMaintenance />;
      default:
        return <DirectAppMaintenance />;
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
        return null;
      case RIGHT_TYPE.TRADE.code:
        return null;
      default:
        return <Note />;
    }
  },
  //명칭정보
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
  //당사자정보
  directlyInvolved(rightType: RightType) {
    switch (rightType) {
      case RIGHT_TYPE.PATENT.code:
        return <DirectAppDirectlyInvolved />;
      case RIGHT_TYPE.PRACTICE.code:
        return <DirectAppDirectlyInvolved />;
      case RIGHT_TYPE.DESIGN.code:
        return <DirectDesignDirectlyInvolved />;
      case RIGHT_TYPE.TRADE.code:
        return <DirectAppDirectlyInvolved />;
      default:
        return <DirectAppDirectlyInvolved />;
    }
  },
};
export default overseasDirectRenderMap;