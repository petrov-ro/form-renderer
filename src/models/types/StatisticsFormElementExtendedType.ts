import {Dispatch, SetStateAction} from "react";
import {StatisticsFormElementClass} from "../../models/classes/StatisticsFormElementClass";

/**
 * Элемент формы статистики передаваемый на отрисовку
 */
export type StatisticsFormElementExtendedType<T = any, P = any, U = any> = {
  currentElement: StatisticsFormElementClass<T, P, U>                   // текущий отрисовываемый элемент
  edit: boolean                                                         // флаг отрисовки в режиме редактирования
  changeValue: (value: T) => void                                       // изменение значения элемента
  elements: StatisticsFormElementClass[]                                // элементы размещенные на форме
  setElements: (e: StatisticsFormElementClass[]) => void                // изменение элементов на форме
  editComponent?: string                                                // идентификатор редактируемого компонента
  setEditComponent: Dispatch<SetStateAction<string | undefined>>        // установка редактируемого компонента
}
