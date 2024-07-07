import React, { useEffect } from "react";
import {Col, Row} from "antd";
import {StatisticsGridCol} from "../../../models/classes/StatisticsGridCol";
import {Identifier} from 'dnd-core';
import {uuid} from "../../../utils/common";
import {StatisticsFormElementExtendedType} from "../../../models/types/StatisticsFormElementExtendedType";
import {StatisticsFormElementClass} from "../../../models/classes/StatisticsFormElementClass";
import {StatisticsFormComponentType} from "../../../models/types/StatisticsFormComponentType";
import {StatisticsIndicatorClass} from "../../../models/classes/StatisticsIndicatorClass";
import {DraggableElements} from "../../../constants/DraggableElements";
import {StatisticsGridRow} from "../../../models/classes/StatisticsGridRow";
import DropTarget from "../../../components/DropTarget/DropTarget";
import StatisticsFormConstructorElement from "../../StatisticsFormConstructorElement/StatisticsFormConstructorElement";
import './StatisticsGrid.scss'
import {StatisticsFormElementConfigType} from "../../../models/types/StatisticsFormElementConfigType";

type StatisticsGridValueType = StatisticsGridRow[]  // тип значения элемента Сетка
type StatisticsGridConfigViewType = {
  colCount: number,
  rowCount: number,
}                                                   // тип конфигурации отображения компонента Сетка
type StatisticsGridType = StatisticsFormElementExtendedType<StatisticsGridValueType, undefined, StatisticsGridConfigViewType>

/**
 * Компонент Сетка на форме сбора
 *
 * @param props
 * @constructor
 */
const StatisticsGrid: React.FC<StatisticsGridType> = props => {
  const {currentElement, edit, changeValue, editComponent, setEditComponent} = props
  const {id, value = [] as StatisticsGridRow[], config = {} as StatisticsFormElementConfigType} = currentElement
  const {
    view: {
      colCount,
      colSpan = Math.floor(24/(colCount)),
      rowCount
    } = {} as any
  } = config

  // изменение значения компонента при смене конфига
  useEffect(() => {
    const modifyRow = (row: StatisticsGridRow) => {
      const content = row.content || []
      const newContent = new Array(colCount)
        .fill('')
        .map((col, colIndex) => content.length > colIndex ? content[colIndex] : new StatisticsGridCol(uuid()))
      const newRow = {...row, content: newContent}
      return newRow
    }

    const emptyRowContent = () => new Array(colCount)
      .fill(undefined)
      .map(() => new StatisticsGridCol(uuid()))

    const newRows = new Array(rowCount)
      .fill('')
      .map((row, rowIndex) => value.length > rowIndex ? modifyRow(value[rowIndex]) : new StatisticsGridRow(uuid(), emptyRowContent()))

    changeValue(newRows)
  }, [colCount, rowCount])

  /**
   * Изменение состава элементов ячейки
   */
  const changeCellElements = (rowId: string, colId: string) => (newElements: StatisticsFormElementClass[]) => {
    // добавление элемента в ячейку
    const newRows = value
      .map(row => row.id === rowId ? {
        ...row,
        content: row.content.map(col => col.id === colId ? {...col, content: newElements} : col)
      } : row)
    changeValue(newRows)
  }

  /**
   * Перемещение элемента на панель
   * @param dragElement  - перетаскиваемый элемент
   */
  const onDrop = (rowId: string, colId: string, cellContent: StatisticsFormElementClass[]) =>
    (type: Identifier | null, item: StatisticsFormComponentType | StatisticsIndicatorClass) => {
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
      const newCellContent = [...cellContent].concat(elem)
      changeCellElements(rowId, colId)(newCellContent)
    }

  return (
    <div className={`statistics-grid-container component-${id}`}>
      {value.map(({id: rowId, content: cols = [] as StatisticsGridCol[]}) =>
        <Row gutter={[5, 5]} style={{paddingBottom: 5}}>
          {cols.map(({id: colId, content: colElements = [] as StatisticsFormElementClass[]}) =>
            <Col span={colSpan}>
              <DropTarget onDrop={onDrop(rowId, colId, colElements)} className='statistics-grid-col'>
                <div className='statistics-grid-cell'>
                  {colElements
                    .map((element) =>
                      <StatisticsFormConstructorElement elements={colElements}
                                                        setElements={changeCellElements(rowId, colId)}
                                                        currentElement={element} edit={edit}
                                                        editComponent={editComponent}
                                                        setEditComponent={setEditComponent}/>
                    )}
                </div>
              </DropTarget>
            </Col>)}
        </Row>
      )}
    </div>
  )
}

export default StatisticsGrid
