import {Button, Collapse, Icons, Input} from "@gp-frontend-lib/ui-kit-5";
import React, {ChangeEvent, useState} from "react";
import {Identifier} from 'dnd-core';
import {StatisticsFormElementExtendedType} from "../../../models/types/StatisticsFormElementExtendedType";
import {StatisticsFormElementClass} from "../../../models/classes/StatisticsFormElementClass";
import {StatisticsFormComponentType} from "../../../models/types/StatisticsFormComponentType";
import {StatisticsIndicatorClass} from "../../../models/classes/StatisticsIndicatorClass";
import {DraggableElements} from "../../../constants/DraggableElements";
import DropTarget from "../../../components/DropTarget/DropTarget";
import StatisticsFormConstructorElement from "../../StatisticsFormConstructorElement/StatisticsFormConstructorElement";

const EditOutlined = Icons.Edit
const CaretRightOutlined = Icons.Dropdown
const SaveOutlined = Icons.Save

type StatisticsPanelValueType = string               // тип значения элемента Раздел
type StatisticsPanelConfigViewType = any             // тип конфигурации отображения компонента Вкладки
type StatisticsPanelType = StatisticsFormElementExtendedType<StatisticsPanelValueType, undefined, StatisticsPanelConfigViewType>

/**
 * Компонент Раздел (раскрывающаяся панель) на форме статистики
 *
 * @param props
 * @constructor
 */
const StatisticsPanel: React.FC<StatisticsPanelType> = props => {
    const {
        elements, setElements, currentElement, edit, changeValue, editComponent, setEditComponent,
        setFormData = () => {}
    } = props
    const {id, value = '', content = []} = currentElement

    const empty = content.length < 1    // флаг отсутсвия элементов на панели

    const [editing, setEditing] = useState(false)   // флаг редактирования названия панели
    const [editValue, setEditValue] = useState(value)

    // заголовок панели
    const header = () => {
        // сохранение названия таба
        const save = () => {
            changeValue(editValue)
            setEditing(false)
        }

        return (
            <div style={{textAlign: 'left'}} className='panel-header'>
                {!editing &&
                <>
                    {edit &&
                    <Button type='link' icon={<EditOutlined/>}
                            onClick={(e) => {
                                e.stopPropagation()
                                setEditing(true)
                            }}/>
                    }
                    {value}
                </>
                }

                {editing &&
                <>
                    <Button type='link' icon={<SaveOutlined/>}
                            onClick={(e) => {
                                e.stopPropagation()
                                save()
                            }}/>
                    <Input defaultValue={editValue} style={{maxWidth: 'calc(100% - 60px)'}}
                           onKeyDown={(e) => {
                               if (e.which == 13) {
                                   save()
                               } else {
                                   e.stopPropagation()
                               }
                               e.stopPropagation()
                           }}
                           onClick={(e) => {
                               e.stopPropagation()
                           }}
                           onChange={(e: ChangeEvent<HTMLInputElement>) => {
                               setEditValue(e.target.value)
                               e.stopPropagation()
                           }}
                    />
                </>
                }
            </div>
        )
    }

    /**
     * Изменение контента (вложенных элементов) компонента
     */
    const changeContent = (e: StatisticsFormElementClass[]) => {
        const newElements = elements.map(el => el.id === id ? {...el, content: e} : el)
        setElements(newElements)
    }

    /**
     * Перемещение элемента на панель
     * @param dragElement  - перетаскиваемый элемент
     */
    const onDrop = (type: Identifier | null, item: StatisticsFormComponentType | StatisticsIndicatorClass) => {
        const elem =
            type === DraggableElements.COMPONENT ? (
                new StatisticsFormElementClass(
                    (item as StatisticsFormComponentType).defaultValue,
                    DraggableElements.COMPONENT,
                    item as StatisticsFormComponentType)
            ) : (
                new StatisticsFormElementClass(undefined, DraggableElements.INDICATOR, undefined,
                    item as StatisticsIndicatorClass)
            )

        // добавление атрибута в контент панели
        const newContent = [...content].concat(elem)
        changeContent(newContent)
    }

    return (
        <DropTarget onDrop={onDrop}>
            <div className={`statistics-panel-container component-${id}`}>
                <Collapse defaultActiveKey={['1']}
                          bordered={false}
                          expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                          items={[
                              {
                                  key: '1',
                                  label: header(),
                                  children: <>
                                      {empty &&
                                      <div>Перенесите компоненты и показатели сюда</div>}

                                      {!empty &&
                                      <div className='container'>
                                          {content
                                              .map((element: StatisticsFormElementClass) =>
                                                  <StatisticsFormConstructorElement key={element.id}
                                                                                    elements={content}
                                                                                    setElements={changeContent}
                                                                                    currentElement={element} edit={edit}
                                                                                    editComponent={editComponent}
                                                                                    setEditComponent={setEditComponent}
                                                                                    setFormData={setFormData}/>
                                              )}
                                      </div>
                                      }
                                  </>,
                              }
                          ]}
                />
            </div>
        </DropTarget>
    )
}

export default StatisticsPanel
