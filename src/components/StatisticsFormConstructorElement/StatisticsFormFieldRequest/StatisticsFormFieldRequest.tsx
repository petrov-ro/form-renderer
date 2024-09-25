import React from "react";
import {EntityAttrValTypesEnum} from "../../../constants/EntityAttrValTypes";
import {FormFieldProps} from "../../../models/types/FormFieldProps";
import useIndicator from "../../../hooks/useIndicator";
import useEntity from "../../../hooks/useEntity";
import {RefViewTypes} from "../../../constants/RefViewTypes";
import StatisticsFormField from "../StatisticsFormField/StatisticsFormField";

type StatisticsFormFieldProps = FormFieldProps & {
    id?: string
    code?: string
    valueTypeId?: EntityAttrValTypesEnum
    isSection: boolean
    multivalued: boolean
    entityAttr?: boolean
}

/**
 * Обертка показателя на форме сбора с предварительным запросом данных
 */
const StatisticsFormFieldRequest: React.FC<StatisticsFormFieldProps> = (props) => {
    const {
        id, label, name, tooltip, disabled, entityAttr, isSection, style, currentElement
    } = props

    // получение показателя по идентификатору
    const {indicator, loading: indicatorLoading} = useIndicator(id, entityAttr)

    const {
        config: {
            data: {
                required = false, multivalued = false, viewType = RefViewTypes.GRID, viewTypeForm = undefined
            } = {}
        } = {}
    } = currentElement || {}

    const {entity: entityId, typeId, valueTypeId} = indicator || {}

    // получение показателя по идентификатору
    const {entity, loading: entityLoading} = useEntity(undefined, undefined, undefined, entityId)

    // конфиг сущности на которую ссылается объект
    const {
        code,
        config: {
            formConfig: {
                components = []
            } = {}
        } = {}
    } = entity || {}

    return (
        <StatisticsFormField label={label} name={name}
                             required={required} multivalued={multivalued} viewType={viewType}
                             viewTypeForm={viewTypeForm}
                             typeId={typeId} valueTypeId={valueTypeId} code={code} components={components}
                             entityLoading={entityLoading} indicatorLoading={indicatorLoading}
                             tooltip={tooltip} disabled={disabled} isSection={isSection} style={style}
                             currentElement={currentElement}/>
    )
}

export default StatisticsFormFieldRequest
