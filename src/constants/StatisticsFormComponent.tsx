import React from "react";
import {
  AppstoreAddOutlined,
  FontColorsOutlined,
  PicCenterOutlined,
  ProductOutlined,
  TableOutlined
} from "@ant-design/icons";
import {uuid} from "../utils/common";
import {StatisticsTabsTabType} from "../components/StatisticsFormComponent/StatisticsTabs/StatisticsTab/StatisticsTab";
import {StatisticsFormComponentType} from "../models/types/StatisticsFormComponentType";
import {StatisticsGridRow} from "../models/classes/StatisticsGridRow";
import {StatisticsGridCol} from "../models/classes/StatisticsGridCol";
import StatisticsText from "../components/StatisticsFormComponent/StatisticsText/StatisticsText";
import StatisticsTabs from "../components/StatisticsFormComponent/StatisticsTabs/StatisticsTabs";
import EmbeddedObjects from "../components/StatisticsFormComponent/EmbeddedObjects/EmbeddedObjects";
import StatisticsPanel from "../components/StatisticsFormComponent/StatisticsPanel/StatisticsPanel";
import StatisticsGrid from "../components/StatisticsFormComponent/StatisticsGrid/StatisticsGrid";
import StatisticsGridConfig
  from "../components/StatisticsFormComponent/StatisticsGrid/StatisticsGridConfig/StatisticsGridConfig";

export enum StatisticsFormComponentTypeEnum {
  TEXT,
  TABS,
  EMBEDDED,
  PARAGRAPH,
  GRID
}

/**
 * Справочник настроек компонентов
 */
export const StatisticsFormComponentDict: Record<number, StatisticsFormComponentType>  = {
  [StatisticsFormComponentTypeEnum.TEXT]: {
    type: StatisticsFormComponentTypeEnum.TEXT,
    name: 'Текст',
    icon: <FontColorsOutlined/>,
    defaultValue: 'Текст',
    render: props =>
        <StatisticsText {...props}/>
  },
  [StatisticsFormComponentTypeEnum.TABS]: {
    type: StatisticsFormComponentTypeEnum.TABS,
    name: 'Вкладки',
    icon: <ProductOutlined/>,
    defaultValue: [{
      id: uuid(),
      name: 'Основные',
      ordNum: 1,
      tabElements: []
    } as StatisticsTabsTabType],
    render: props =>
        <StatisticsTabs {...props}/>
  },
  [StatisticsFormComponentTypeEnum.EMBEDDED]: {
    type: StatisticsFormComponentTypeEnum.EMBEDDED,
    name: 'Вложенные объекты',
    icon: <AppstoreAddOutlined/>,
    render: props =>
        <EmbeddedObjects {...props}/>
  },
  [StatisticsFormComponentTypeEnum.PARAGRAPH]: {
    type: StatisticsFormComponentTypeEnum.PARAGRAPH,
    name: 'Раздел',
    icon: <PicCenterOutlined/>,
    defaultValue: 'Раздел',
    render: props =>
        <StatisticsPanel {...props}/>
  },
  [StatisticsFormComponentTypeEnum.GRID]: {
    type: StatisticsFormComponentTypeEnum.GRID,
    name: 'Сетка',
    icon: <TableOutlined/>,
    defaultValue: [
      new StatisticsGridRow(uuid(), [
        new StatisticsGridCol(uuid()),
        new StatisticsGridCol(uuid())
      ])
    ],
    render: props =>
        <StatisticsGrid {...props}/>,
    configRender: props =>
        <StatisticsGridConfig {...props}/>
  },
}
