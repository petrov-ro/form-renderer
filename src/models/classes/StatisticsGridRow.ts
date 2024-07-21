import {StatisticsGridCol} from "../../models/classes/StatisticsGridCol";
import {uuid} from "../../utils/common";

/**
 * Класс строки в компоненте Сетка на форме сбора
 */
export class StatisticsGridRow {
  id: string
  content: StatisticsGridCol[]

  constructor(id: string = uuid(), content = [] as StatisticsGridCol[]) {
    this.id = id
    this.content = content
  }
}
