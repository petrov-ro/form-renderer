import React from "react";
import cn from 'classnames'
import {Button} from "@gp-frontend-lib/ui-kit-5";
import {DropTargetMonitor, useDrop} from "react-dnd";
import {StatisticsFormElementExtendedType} from "../../../models/types/StatisticsFormElementExtendedType";
import {StatisticsFormElementClass} from "../../../models/classes/StatisticsFormElementClass";
import {DraggableElements} from "../../../constants/DraggableElements";
import StatisticsFormConstructorElement from "../../StatisticsFormConstructorElement/StatisticsFormConstructorElement";
import './EmbeddedObjects.scss'

type EmbeddedObjectsValueType = StatisticsFormElementClass[]    // тип значения элемента
type EmbeddedObjectsConfigViewType = any                        // тип конфигурации отображения
type EmbeddedObjectsType = StatisticsFormElementExtendedType<EmbeddedObjectsValueType, undefined, EmbeddedObjectsConfigViewType>

/**
 * Компонент со вложенными объектами на форме сбора
 *
 * @param props
 * @constructor
 */
const EmbeddedObjects: React.FC<EmbeddedObjectsType> = props => {
  const {currentElement, edit, changeValue, setEditComponent} = props
  const {id, value = [], config: currentConfig} = currentElement

  const config = {
    ...currentConfig,
  }

  const empty = !value?.length

  /**
   * Перемещение элемента на карточку
   * @param dragElement  - перетаскиваемый элемент
   */
  const moveElement = (dragElement: StatisticsFormElementClass) => {
    const newValue = [...value]
    newValue.push(dragElement)
    changeValue(newValue)
  }

  const [{isOver}, drop] = useDrop({
    accept: [DraggableElements.COMPONENT, DraggableElements.INDICATOR],
    canDrop: () => edit,
    collect: monitor => {
      const item = monitor.getItem<any>() || {};
      if (!item) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: 'dropping',
      };
    },
    drop: (element: StatisticsFormElementClass, monitor: DropTargetMonitor) => {
      if (!monitor.didDrop()) {
        moveElement(element)
      }
    },
  })

  return (
    <div className={`statistics-embedded-container component-${id}`}>
      <div ref={edit ? drop : undefined} className={cn('statistics-embedded', {'hovered': isOver}, {'empty': empty})}>
        {edit && empty && <div>Перенесите компоненты и показатели сюда</div>}

        {!empty && <div className='container'>
          {value
            .map((element: StatisticsFormElementClass) =>
              <StatisticsFormConstructorElement elements={value} setElements={changeValue} key={element.id}
                                                currentElement={element} edit={edit} setEditComponent={setEditComponent}/>
            )}
        </div>
        }
      </div>

      <Button>
        Добавить
      </Button>
    </div>
  )
}

export default EmbeddedObjects
