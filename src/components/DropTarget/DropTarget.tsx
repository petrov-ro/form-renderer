import cn from 'classnames'
import {PropsWithChildren} from 'react';
import {DropTargetMonitor, useDrop} from "react-dnd";
import {DraggableElements} from "../../constants/DraggableElements";
import {StatisticsFormComponentType} from "../../models/types/StatisticsFormComponentType";
import {StatisticsIndicatorClass} from "../../models/classes/StatisticsIndicatorClass";
import {Identifier} from "dnd-core"
import './DropTarget.scss'

export type DropTargetProps = {
  onDrop: (type: Identifier | null, item: StatisticsFormComponentType | StatisticsIndicatorClass) => void
  accept?: DraggableElements[]  // принимаемые типы бросаемых элементов
  className?: string            // дополнительное название класса
}

/**
 * Элемент-цель для бросания
 *
 * @param props
 * @constructor
 */
const DropTarget = (props: PropsWithChildren<DropTargetProps>) => {
  const {
    onDrop, children, className = '',
    accept = [DraggableElements.COMPONENT, DraggableElements.INDICATOR]
  } = props

  const [{isOver}, drop] = useDrop({
    accept,
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
    drop: (attr: StatisticsFormComponentType, monitor: DropTargetMonitor) => {
      if (!monitor.didDrop()) {
        const type = monitor.getItemType()
        onDrop(type, attr)
      }
    },
  });

  return (
    <div ref={drop} className={cn('drop-target', {'hovered': isOver}, className)}>
      {children}
    </div>
  )
}

export default DropTarget
