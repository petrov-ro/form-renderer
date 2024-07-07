import React, {Dispatch, SetStateAction, useState} from "react";
import cn from 'classnames'
import {isArray} from "../../utils/arrayUtils";
import {Affix, Button, Popconfirm} from 'antd';
import {StatisticsFormElementClass} from "../../models/classes/StatisticsFormElementClass";
import {CloseOutlined} from "@ant-design/icons";
import {DraggableElements} from "../../constants/DraggableElements";
import {StatisticsFormComponentDict, StatisticsFormComponentTypeEnum} from "../../constants/StatisticsFormComponent";
import {StatisticsIndicatorClass} from "../../models/classes/StatisticsIndicatorClass";
import StatisticsFormField from "./StatisticsFormField/StatisticsFormField";
import {FormProps} from "../../models/types/FormPropsType";
import {FormConfigComponentTypeEnum} from "../../constants/FormConfigComponentTypeEnum";
import {StatisticsFormElementExtendedType} from "../../models/types/StatisticsFormElementExtendedType";

type StatisticsFormConstructorElementProps = FormProps & {
    elements: StatisticsFormElementClass[]                               // элементы размещенные на форме
    setElements: (e: StatisticsFormElementClass[]) => void               // изменение элементов на форме
    currentElement: StatisticsFormElementClass                           // текущий элемент, который нужно отрисовать
    edit: boolean                                                        // режим редактирования формы внутри режима конструктора
    reportMode?: boolean                                                 // режим ввода данных отчета
    editComponent?: string                                               // идентификатор редактируемого компонента
    setEditComponent: Dispatch<SetStateAction<string | undefined>>       // установка редактируемого компонента
}

/**
 * Обертка элемента на форме сбора
 */
const StatisticsFormConstructorElement: React.FC<StatisticsFormConstructorElementProps> = (props) => {
    const {
        elements, setElements, editComponent, setEditComponent, currentElement, edit
    } = props

    const [container, setContainer] = useState<HTMLDivElement | null>(null);

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
        } = {} as StatisticsIndicatorClass
    } = currentElement

    // отступы из настроек отображения используются для контейнера
    const containerMargin = isArray(margin) ? margin.map((m: number) => `${m}px`).join(' ') : margin

    const isIndicator = currentElementType === DraggableElements.INDICATOR  // текущий элемент - это индикатор
    const isComponent = currentElementType === DraggableElements.COMPONENT  // текущий элемент - это компонент
    const componentDictItem = isComponent && type && StatisticsFormComponentDict[type]  // запись из справочника компонентов

    const isEditing = edit && id === editComponent  // флаг режима редактирования формы в конструкторе
    const isSection = columnSection || rowSection   // флаг сбора данных в разрезе
    const fieldName = indicatorCode || id           // название атрибута формы принимается равным коду элемента

    /**
     * Удаление элемента с формы
     */
    const removeElement = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e?.stopPropagation()
        e?.preventDefault()

        setElements(elements.filter(el => el.id !== id))
        if (id === editComponent) {
            setEditComponent(undefined)
        }
    }

    /**
     * Изменение значения компонента формы
     */
    const changeValue = (newValue: any) => {
        setElements(elements.map(el => el.id === id ? {...el, value: newValue} : el))
    }

    /**
     * Клик по элементу на форме
     */
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // реагирует только верхний элемент
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (edit) {
            setEditComponent(id)
        }
    }

    return (
        <div ref={setContainer}
             className={cn(
                 'component-container',
                 {'component-container-editing': edit && isEditing},
                 {'component-container-not-editing': edit && !isEditing}
             )}
             onClick={onClick}
             style={{margin: containerMargin}}
        >
            {componentDictItem && componentDictItem.render(
                {
                    currentElement, edit, changeValue, elements, setElements, editComponent, setEditComponent
                } as StatisticsFormElementExtendedType
            )}

            {isIndicator &&
            <StatisticsFormField label={fieldTitle} name={fieldName} id={indicatorId} code={indicatorCode}
                                 entityAttr={entityAttr}
                                 tooltip={fieldTooltip} disabled={false}
                                 isSection={isSection}
                                 multivalued={multivalued}
                                 currentElement={currentElement}
                                 style={{...view}}
                                 rules={[{required, message: `Не задан обязательный атрибут ${fieldTitle}`}]}
            />
            }

            {edit &&
            <Affix target={() => container} style={{position: 'absolute', top: 0, right: 0}}>
                <Popconfirm
                    title="Удалить элемент с формы?"
                    onConfirm={removeElement}
                    okText="Да"
                    cancelText="Отмена"
                >
                    <div className='remove-button-container'>
                        <Button type='link' className='remove-button' title='Удалить элемент'
                                onClick={e => {
                                    e.preventDefault()
                                }}>
                            <CloseOutlined/>
                        </Button>
                    </div>
                </Popconfirm>
            </Affix>
            }
        </div>
    )
}

export default StatisticsFormConstructorElement
