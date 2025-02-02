import React from "react";
import {Collapse, Icons} from "@gp-frontend-lib/ui-kit-5";
import FormField from "../../../components/FormField/FormField";
import {EntityAttrValTypesEnum, valueTypeBasicByAttr, valueTypeByAttr} from "../../../constants/EntityAttrValTypes";
import {FormItemTypes} from "../../../constants/FormItemTypes";
import {EntityAttrClass} from "../../../models/classes/EntityAttrClass";
import {FormFieldProps} from "../../../models/types/FormFieldProps";
import {EntityAttrTypes} from "../../../constants/EntityAttrTypes";
import {RefViewTypes} from "../../../constants/RefViewTypes";
import RefDropdown from "../../RefDropdown/RefDropdown";
import RefCheckbox from "../../RefCheckbox/RefCheckbox";
import ObjectByForm from "../../../components/FormField/Fields/ObjectByForm/ObjectByForm";
import {FormConfigComponentType} from "../../../models/types/FormConfigComponentType";

const CaretRightOutlined = Icons.Dropdown

type StatisticsFormFieldRenderProps = FormFieldProps & {
    id?: string
    code?: string
    typeId?: EntityAttrTypes
    valueTypeId?: EntityAttrValTypesEnum
    isSection: boolean
    multivalued: boolean
    entityAttr?: boolean
    entityLoading?: boolean
    indicatorLoading?: boolean
    components: FormConfigComponentType[]
    viewType?: RefViewTypes
    viewTypeForm?: any
}

/**
 * Рендер показателя на форме сбора
 */
const StatisticsFormField: React.FC<StatisticsFormFieldRenderProps> = (props) => {
    const {
        label, name, required, multivalued, viewType, viewTypeForm,
        typeId, valueTypeId, code, components, entityLoading, indicatorLoading, tooltip, disabled, isSection, style,
        currentElement
    } = props

    const exclude: string[] = []  // массив системных идентификторов, которые не нужно отображать в гриде (для атрибутов типа REF)

    // для логического типа добавляется children (надпись рядом с чекбоксом)
    const children = valueTypeId === EntityAttrValTypesEnum.BOOLEAN ? 'Да' : undefined

    // получение конфига для показателя
    const {multi_line} = currentElement?.indicator?.config || {}

    return (
        <>
            {
                /* Отображение примитивных и вычисляемых атрибутов для всех значений, кроме объектов */
                valueTypeId !== EntityAttrValTypesEnum.OBJECT &&
                (typeId === EntityAttrTypes.PLAIN || typeId === EntityAttrTypes.CALC) &&
                <FormField label={label} name={name} tooltip={tooltip} disabled={disabled}
                           inputType={isSection ? FormItemTypes.statisticsGrid : valueTypeByAttr({
                               valueTypeId,
                               multivalued
                           } as EntityAttrClass, multi_line)}
                           valueTypeBasic={valueTypeBasicByAttr({valueTypeId})}
                           currentElement={currentElement}
                           style={style}
                           rules={[{required, message: `Не задан обязательный атрибут ${label}`}]}
                           children={children}
                />
            }

            {
                /* Отображение объектов */
                valueTypeId === EntityAttrValTypesEnum.OBJECT &&
                (typeId === EntityAttrTypes.PLAIN || typeId === EntityAttrTypes.CALC) &&
                <Collapse
                    bordered={false}
                    defaultActiveKey={['1']}
                    expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                    items={[
                        {
                            key: '1',
                            label,
                            children: <ObjectByForm multivalued={multivalued}
                                                    disabled={disabled}
                                                    formConfigComponents={components} code={code}
                                                    name={name}
                                                    loading={entityLoading}/>,
                        }
                    ]}
                />

            }

            {
                /* Отображение ссылочных атрибутов */
                typeId === EntityAttrTypes.REF && code &&
                <FormField label={label} name={name} key={name} tooltip={tooltip} disabled={disabled}
                           inputType={FormItemTypes.custom}
                           children={props =>
                               viewType === RefViewTypes.DROPDOWN ?
                                   <RefDropdown {...props} code={code} disabled={disabled}
                                                name={name} multivalued={multivalued}
                                                viewTypeForm={viewTypeForm}
                                                loading={indicatorLoading}
                                                exclude={exclude}/>
                                   :
                                   <RefCheckbox {...props} code={code} disabled={disabled}
                                                label={name} multivalued={multivalued}
                                                loading={indicatorLoading}
                                                exclude={exclude}/>
                           }
                           rules={[{required: required, message: `Не задан обязательный атрибут ${name}`}]}
                />
            }
        </>
    )
}

export default StatisticsFormField
