import React from "react";
import {StatisticsIndicatorClass} from "../../../models/classes/StatisticsIndicatorClass";
import {EntityAttrValTypesEnum} from "../../../constants/EntityAttrValTypes";
import {FormFieldProps} from "../../../models/types/FormFieldProps";
import {RefViewTypes} from "../../../constants/RefViewTypes";
import StatisticsFormField from "../StatisticsFormField/StatisticsFormField";

type StatisticsFormFieldConfigProps = FormFieldProps & {
  id?: string
  code?: string
  valueTypeId?: EntityAttrValTypesEnum
  isSection: boolean
  multivalued: boolean
  entityAttr?: boolean
  config: StatisticsIndicatorClass['config']
}

/**
 * Обертка показателя на форме сбора без запроса данных (конфиг передается в компонент как свойство)
 */
const StatisticsFormFieldConfig: React.FC<StatisticsFormFieldConfigProps> = (props) => {
  const {
    label, name, tooltip, disabled, isSection, style, currentElement, config, form
  } = props

  const {
    required, multivalued, viewType = RefViewTypes.GRID, viewTypeForm = undefined,
    typeId, valueTypeId, entityCode, entityFormConfigComponents
  } = config || {}

  return (
    <StatisticsFormField label={label} name={name}
                         required={required} multivalued={multivalued} viewType={viewType}
                         viewTypeForm={viewTypeForm}
                         typeId={typeId} valueTypeId={valueTypeId}
                         code={entityCode} components={entityFormConfigComponents}
                         entityLoading={false} indicatorLoading={false}
                         tooltip={tooltip} disabled={disabled} isSection={isSection} style={style}
                         currentElement={currentElement} form={form}/>
  )
}

export default StatisticsFormFieldConfig
