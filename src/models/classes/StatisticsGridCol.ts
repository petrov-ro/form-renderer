import {StatisticsFormElementClass} from "../../models/classes/StatisticsFormElementClass";
import {uuid} from "../../utils/common";

/**
 * Класс колонки в компоненте Сетка на форме сбора
 */
export class StatisticsGridCol {
  id: string
  content: StatisticsFormElementClass[]

  constructor(id: string = uuid(), content = [] as StatisticsFormElementClass[]) {
    this.id = id
    this.content = content
  }
}
