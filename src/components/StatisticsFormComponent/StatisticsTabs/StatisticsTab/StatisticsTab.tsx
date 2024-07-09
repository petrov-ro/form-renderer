import cn from 'classnames'
import {DraggableElements} from "../../../../constants/DraggableElements";
import {StatisticsFormElementClass} from "../../../../models/classes/StatisticsFormElementClass";
import {StatisticsFormElementExtendedType} from "../../../../models/types/StatisticsFormElementExtendedType";
import StatisticsFormConstructorElement
  from "../../../StatisticsFormConstructorElement/StatisticsFormConstructorElement";
import DropTarget from "../../../../components/DropTarget/DropTarget";
import {StatisticsFormComponentType} from "../../../../models/types/StatisticsFormComponentType";
import {StatisticsIndicatorClass} from "../../../../models/classes/StatisticsIndicatorClass";
import {Identifier} from 'dnd-core';
import './StatisticsTab.scss'

/**
 * Тип вкладки
 */
export type StatisticsTabsTabType = {
  id: string                                  // айди таба
  name: string                                // наименование таба
  ordNum: number                              // номер таба
  tabElements?: StatisticsFormElementClass[]  // элементы таба (компоненты и показатели)
}

/**
 * Тип компонента отображения содержимого вкладки
 */
export type StatisticsTabProps = Partial<StatisticsFormElementExtendedType> & {
  index: number                                       // индекс текущей вкладки
  value: StatisticsTabsTabType[]                      // массив всех вкладок
  onChange: (tabs: StatisticsTabsTabType[]) => void   // изменение массива вкладок
}

/**
 * Содержимое вкладки таба формы сбора
 *
 * @param props
 * @constructor
 */
const StatisticsTab: React.FC<StatisticsTabProps> = props => {
  const {
    index, value, onChange, edit = false, editComponent, setEditComponent = () => {
    }
  } = props

  const tab = value[index]                // текущая вкладка
  const {tabElements = []} = tab          // элементы на вкладке
  const empty = tabElements.length < 1    // флаг отсутсвия элементов на вкладке

  /**
   * Перемещение элемента на вкладку
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

    // добавление атрибута в объект вкладки
    const newTabs = value.map((t: StatisticsTabsTabType, i: number) => i === index ? {
      ...t,
      tabElements: [...(t.tabElements || [])].concat(elem)
    } : t)

    onChange(newTabs)
  }

  /**
   * Изменение состава элементов на вкладке
   */
  const changeTabElements = (newElements: StatisticsFormElementClass[]) => {
    // добавление атрибута в объект вкладки
    const newTabs = value.map((t, i) => i === index ? {...t, tabElements: newElements} : t)
    onChange(newTabs)
  }

  return (
    <DropTarget onDrop={onDrop}>
      <div className={cn('statistics-tab', {'empty': empty})}>
        {empty &&
        <div>Перенесите компоненты и показатели сюда</div>}

        {!empty &&
        <div className='container'>
          {tabElements
            .map((element: StatisticsFormElementClass) =>
              <StatisticsFormConstructorElement key={element.id} elements={tabElements} setElements={changeTabElements}
                                                currentElement={element} edit={edit}
                                                editComponent={editComponent}
                                                setEditComponent={setEditComponent}/>
            )}
        </div>
        }
      </div>
    </DropTarget>
  )
}

export default StatisticsTab
