import React from "react";
import FormField from "../../../components/FormField/FormField";
import {EntityAttrValTypesEnum, valueTypeBasicByAttr, valueTypeByAttr} from "../../../constants/EntityAttrValTypes";
import {FormItemTypes} from "../../../constants/FormItemTypes";
import {EntityAttrClass} from "../../../models/classes/EntityAttrClass";
import {FormFieldProps} from "../../../models/types/FormFieldProps";
import useIndicator from "../../../hooks/useIndicator";
import {EntityAttrTypes} from "../../../constants/EntityAttrTypes";
import useEntity from "../../../hooks/useEntity";
import {RefViewTypes} from "../../../constants/RefViewTypes";
import RefDropdown from "../../RefDropdown/RefDropdown";
import RefCheckbox from "../../RefCheckbox/RefCheckbox";
import ObjectByForm from "../../../components/FormField/Fields/ObjectByForm/ObjectByForm";

type StatisticsFormFieldProps = FormFieldProps & {
    id?: string
    code?: string
    valueTypeId?: EntityAttrValTypesEnum
    isSection: boolean
    multivalued: boolean
    entityAttr?: boolean
}

/**
 * Обертка показателя на форме сбора
 */
const StatisticsFormField: React.FC<StatisticsFormFieldProps> = (props) => {
    const {
        id, label, name, entityAttr, tooltip, disabled, isSection, style, currentElement
    } = props

    // получение показателя по идентификатору
    const {indicator, loading: indicatorLoading} = useIndicator(id, entityAttr)

    const {
        config: {
            data: {
                required = false, multivalued = false, viewType = RefViewTypes.DROPDOWN, viewTypeForm = undefined
            } = {}
        } = {}
    } = currentElement || {}
    const {entity: entityId, typeId, valueTypeId} = indicator || {}
    const exclude: string[] = []  // массив системных идентификторов, которые не нужно отображать в гриде (для атрибутов типа REF)

    // получение показателя по идентификатору
    const {entity, loading: entityLoading} = useEntity(undefined, undefined, undefined, entityId)

    // для логического типа добавляется children (надпись рядом с чекбоксом)
    const children = valueTypeId === EntityAttrValTypesEnum.BOOLEAN ? 'Да' : undefined

    return (
        <>
            {
                /* Отображение примитивных и вычисляемых атрибутов для всех значений, кроме объектов */
                valueTypeId !== EntityAttrValTypesEnum.OBJECT &&
                (typeId === EntityAttrTypes.PLAIN || typeId === EntityAttrTypes.CALC) &&
                <>
                    <FormField label={label} name={name} tooltip={tooltip} disabled={disabled}
                               inputType={isSection ? FormItemTypes.statisticsGrid : valueTypeByAttr({
                                   valueTypeId,
                                   multivalued
                               } as EntityAttrClass)}
                               valueTypeBasic={valueTypeBasicByAttr({valueTypeId})}
                               currentElement={currentElement}
                               style={style}
                               rules={[{required, message: `Не задан обязательный атрибут ${label}`}]}
                               children={children}
                    />
                </>
            }

            {
                /* Отображение объектов */
                valueTypeId === EntityAttrValTypesEnum.OBJECT &&
                (typeId === EntityAttrTypes.PLAIN || typeId === EntityAttrTypes.CALC) &&
                <FormField label={label} name={name} key={name} tooltip={tooltip} disabled={disabled}
                           inputType={FormItemTypes.custom}
                           children={(({value, onChange}: FormFieldProps) =>
                                   <ObjectByForm value={value} onChange={onChange} multivalued={multivalued}
                                                 entity={entity}
                                                 disabled={disabled} code={entity?.code} loading={entityLoading}/>
                           ) as any
                           }
                           rules={[{required: required, message: `Не задан обязательный атрибут ${name}`}]}
                />
            }

            {
                /* Отображение ссылочных атрибутов */
                typeId === EntityAttrTypes.REF && entity &&
                <FormField label={label} name={name} key={name} tooltip={tooltip} disabled={disabled}
                           inputType={FormItemTypes.custom}
                           children={(({value, onChange}: FormFieldProps) =>
                               <>
                                   {viewType === RefViewTypes.DROPDOWN &&
                                   <RefDropdown code={entity.code} disabled={disabled} value={value}
                                                label={name} onChange={onChange} multivalued={multivalued}
                                                viewTypeForm={viewTypeForm}
                                                loading={indicatorLoading || entityLoading}
                                                exclude={exclude}/>
                                   }

                                   {viewType === RefViewTypes.CHECKBOX &&
                                   <RefCheckbox code={entity.code} disabled={disabled} value={value}
                                                label={name} onChange={onChange} multivalued={multivalued}
                                                loading={indicatorLoading || entityLoading}
                                                exclude={exclude}/>
                                   }
                               </>) as any
                           }
                           rules={[{required: required, message: `Не задан обязательный атрибут ${name}`}]}
                />
            }
        </>
    )
}

export default StatisticsFormField
