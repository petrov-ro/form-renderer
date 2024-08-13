import React from "react";
import {Table} from "@gp-frontend-lib/ui-kit-5";
import {StatisticsFormElementExtendedType} from "../../../models/types/StatisticsFormElementExtendedType";
import {StatisticsFormElementConfigType} from "../../../models/types/StatisticsFormElementConfigType";
import './StatisticsIndicatorGrid.scss'

export const StatisticsIndicatorGridDefaultConfig: Partial<StatisticsFormElementConfigType> = {
  view: {
    font: 'initial',
    fontSize: 18,
    align: 'left',
    color: 'Black'
  }
}

/**
 * Таблица с показателями на форме сбора
 *
 * @param props
 * @constructor
 */
const StatisticsIndicatorGrid: React.FC<StatisticsFormElementExtendedType> = (props): JSX.Element => {
  const {currentElement, edit, changeValue} = props
  const {value, config: currentConfig} = currentElement

  const config = {
    ...StatisticsIndicatorGridDefaultConfig,
    ...currentConfig,
  }
  const {
    view: {
      font, fontSize, align, color
    } = {}
  } = config as StatisticsFormElementConfigType

  const style = {
    display: 'flex', justifyContent: align, fontSize, textAlign: align, color, fontFamily: font, border: 0,
    overflow: 'hidden'
  }

  return (
    <div style={style}
         className={`statistics-text-container component-${currentElement.id}`}>
      <Table style={{width: '100%'}}/>
    </div>
  )
}

export default StatisticsIndicatorGrid
