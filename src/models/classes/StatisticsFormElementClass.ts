import {DraggableElements} from "../../constants/DraggableElements";
import {StatisticsFormComponentType} from "../types/StatisticsFormComponentType";
import {StatisticsIndicatorClass} from "../classes/StatisticsIndicatorClass";
import {StatisticsFormElementConfigType} from "../types/StatisticsFormElementConfigType";
import {uuid} from "../../utils/common";



/**
 * Класс элемента размещенного на форме сбора
 */
export class StatisticsFormElementClass<T = any, P = any, U = any> {
  id: string                                          // идентификатор
  value: T | undefined                                // значение элемента (для показателя - данные, для компонента - описание, например массив вкладок для компонента Вкладки)
  type: DraggableElements                             // тип элемента
  component: StatisticsFormComponentType | undefined  // компонент
  indicator: StatisticsIndicatorClass  | undefined    // показатель
  config: StatisticsFormElementConfigType<P, U>       // настройки элемента
  content: StatisticsFormElementClass[]               // содержимое элемента (вложенные компоненты и показатели)

  constructor(value: T | undefined,
              type: DraggableElements,
              component?: StatisticsFormComponentType | undefined,
              indicator?: StatisticsIndicatorClass | undefined,
              config: StatisticsFormElementConfigType = {
                data: undefined,
                view: undefined
              } as StatisticsFormElementConfigType,
              content: StatisticsFormElementClass[] = []
  ) {
    this.id = uuid()
    this.value = value
    this.component = component
    this.indicator = indicator
    this.config = config
    this.type = type
    this.content = content
  }
}
