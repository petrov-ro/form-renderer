import React, {useState} from "react";
import {Typography} from "@gp-frontend-lib/ui-kit-5";
import {StatisticsFormElementExtendedType} from "../../../models/types/StatisticsFormElementExtendedType";
import {StatisticsFormElementConfigType} from "../../../models/types/StatisticsFormElementConfigType";
//import './StatisticsText.scss'

export const StatisticsTextDefaultConfig = {
  view: {
    font: 'initial',
    fontSize: 18,
    align: 'left',
    color: 'Black',
    margin: [0, 0, 0, 0]  // отступы top, right, bottom, left
  }
}

/**
 * Текстовый элемент на форме сбора
 *
 * @param props
 * @constructor
 */
const StatisticsText: React.FC<StatisticsFormElementExtendedType> = (props): JSX.Element => {
  const {currentElement, edit, changeValue} = props
  const {id, value, config: currentConfig} = currentElement || {}

  const config = {
    ...StatisticsTextDefaultConfig,
    ...currentConfig,
  }

  const {
    view: {
      font, fontSize, align, color, margin
    } = {}
  } = config as StatisticsFormElementConfigType

  const [nameEditing, setNameEditing] = useState(false)

  const style = {
    display: 'flex',
    justifyContent: align,
    fontSize,
    textAlign: align,
    color,
    fontFamily: font,
    border: 0,
    overflow: 'hidden',
    margin
  }

  return (
    <div style={style}
         className={`statistics-text-container component-${id}`}>
      <Typography.Title
        style={{
          fontFamily: font,
          fontSize,
          margin: 0,
          width: '100%',
          textAlign: align,
          color,
          border: 0
        }}
        editable={edit && {
          onChange: changeValue,
          editing: nameEditing,
          onStart: () => setNameEditing(true),
          onEnd: () => setNameEditing(false),
          onCancel: () => setNameEditing(false),
        }}
      >
        {value}
      </Typography.Title>
    </div>
  )
}

export default StatisticsText
