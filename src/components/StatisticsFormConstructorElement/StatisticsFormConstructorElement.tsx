import React, {Dispatch, SetStateAction} from "react";
import cn from 'classnames'
import {isArray} from "../../utils/arrayUtils";
import {FormProps} from "../../models/types/FormPropsType";
import {DraggableElements} from "../../constants/DraggableElements";
import {StatisticsFormElementClass} from "../../models/classes/StatisticsFormElementClass";
import {StatisticsIndicatorClass} from "../../models/classes/StatisticsIndicatorClass";
import {StatisticsFormComponentTypeEnum} from "../../constants/StatisticsFormComponent";
import StatisticsFormFieldRequest from "./StatisticsFormFieldRequest/StatisticsFormFieldRequest";
import StatisticsFormFieldConfig from "./StatisticsFormFieldConfig/StatisticsFormFieldConfig";

type StatisticsFormConstructorElementProps = FormProps & {
    elements: StatisticsFormElementClass[]                               // элементы размещенные на форме
    setElements?: (e: StatisticsFormElementClass[]) => void              // изменение элементов на форме
    currentElement: StatisticsFormElementClass                           // текущий элемент, который нужно отрисовать
    edit: boolean                                                        // режим редактирования формы внутри режима конструктора
    reportMode?: boolean                                                 // режим ввода данных отчета
    editComponent?: string                                               // идентификатор редактируемого компонента
    setEditComponent?: Dispatch<SetStateAction<string | undefined>>      // установка редактируемого компонента
    setFormData: (values: any) => void                                   // изменение значений формы
}

/**
 * Обертка элемента на форме сбора
 */
const StatisticsFormConstructorElement: React.FC<StatisticsFormConstructorElementProps> = (props) => {
    const {
        currentElement, setFormData
    } = props

    const {
        type: currentElementType, id,
        component: {
            type = StatisticsFormComponentTypeEnum.TEXT
        } = {},
        config: {
            data: {
                columnSection, rowSection, multivalued, required
            } = {},
            view: {
                margin,
                ...view
            } = {}
        } = {},
        indicator: {
            id: indicatorId,
            code: indicatorCode,
            name: fieldTitle,
            description: fieldTooltip,
            entityAttr,
            config
        } = {} as StatisticsIndicatorClass
    } = currentElement

    // отступы из настроек отображения используются для контейнера
    const containerMargin = isArray(margin) ? margin.map((m: number) => `${m}px`).join(' ') : margin

    const isIndicator = currentElementType === DraggableElements.INDICATOR  // текущий элемент - это индикатор

    const isSection = columnSection || rowSection   // флаг сбора данных в разрезе
    const fieldName = indicatorCode || id           // название атрибута формы принимается равным коду элемента

    return (
        <div className={cn('component-container')}
             style={{margin: containerMargin}}
        >
            {isIndicator && !config &&
            <StatisticsFormFieldRequest label={fieldTitle} name={fieldName} id={indicatorId} code={indicatorCode}
                                 entityAttr={entityAttr}
                                 tooltip={fieldTooltip} disabled={false}
                                 isSection={isSection}
                                 multivalued={multivalued}
                                 currentElement={currentElement}
                                 style={{...view}}
                                 rules={[{required, message: `Не задан обязательный атрибут ${fieldTitle}`}]}
            />
            }

            {isIndicator && config &&
            <StatisticsFormFieldConfig label={fieldTitle} name={fieldName} id={indicatorId} code={indicatorCode}
                                       config={config}
                                       entityAttr={entityAttr}
                                       tooltip={fieldTooltip} disabled={false}
                                       isSection={isSection}
                                       multivalued={multivalued}
                                       currentElement={currentElement}
                                       setFormData={setFormData}
                                       style={{...view}}
                                       rules={[{required, message: `Не задан обязательный атрибут ${fieldTitle}`}]}
            />
            }
        </div>
    )
}

export default React.memo(StatisticsFormConstructorElement)
