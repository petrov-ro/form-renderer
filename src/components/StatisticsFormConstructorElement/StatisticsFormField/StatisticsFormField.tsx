import React from "react";
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
import {Collapse, Icons} from "@gp-frontend-lib/ui-kit-5";

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
    setFormData: (values: any) => void                                    // изменение значений формы
}

/**
 * Рендер показателя на форме сбора
 */
const StatisticsFormField: React.FC<StatisticsFormFieldRenderProps> = (props) => {
    const {
        label, name, required, multivalued, viewType, viewTypeForm,
        typeId, valueTypeId, code, components, entityLoading, indicatorLoading, tooltip, disabled, isSection, style,
        currentElement, setFormData
    } = props

    const exclude: string[] = []  // массив системных идентификторов, которые не нужно отображать в гриде (для атрибутов типа REF)

    // для логического типа добавляется children (надпись рядом с чекбоксом)
    const children = valueTypeId === EntityAttrValTypesEnum.BOOLEAN ? 'Да' : undefined

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
                           } as EntityAttrClass)}
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
                <FormField name={name} key={name} tooltip={tooltip} disabled={disabled}
                           inputType={FormItemTypes.custom} visibleLabelCol={false}
                           children={({value, onChange}: FormFieldProps) =>
                               <Collapse
                                   bordered={false}
                                   defaultActiveKey={['1']}
                                   expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                                   items={[
                                       {
                                           key: '1',
                                           label,
                                           children: <ObjectByForm value={value} onChange={onChange} multivalued={multivalued}
                                                                   disabled={disabled}
                                                                   formConfigComponents={components} code={code} name={name}
                                                                   loading={entityLoading} setFormData={setFormData}/>,
                                       }
                                   ]}
                               />
                           }
                           rules={[{required: required, message: `Не задан обязательный атрибут ${name}`}]}
                />
            }

            {
                /* Отображение ссылочных атрибутов */
                typeId === EntityAttrTypes.REF && code &&
                <FormField label={label} name={name} key={name} tooltip={tooltip} disabled={disabled}
                           inputType={FormItemTypes.custom}
                           children={({value, onChange}: FormFieldProps) =>
                               <>
                                   {viewType === RefViewTypes.DROPDOWN &&
                                   <RefDropdown code={code} disabled={disabled} value={value}
                                                label={name} onChange={onChange} multivalued={multivalued}
                                                viewTypeForm={viewTypeForm}
                                                loading={indicatorLoading}
                                                exclude={exclude}/>
                                   }

                                   {viewType === RefViewTypes.CHECKBOX &&
                                   <RefCheckbox code={code} disabled={disabled} value={value}
                                                label={name} onChange={onChange} multivalued={multivalued}
                                                loading={indicatorLoading}
                                                exclude={exclude}/>
                                   }
                               </>
                           }
                           rules={[{required: required, message: `Не задан обязательный атрибут ${name}`}]}
                />
            }
        </>
    )
}

export default (StatisticsFormField)
