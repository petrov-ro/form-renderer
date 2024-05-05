import {StatisticsFormElementClass} from "@/models/classes/StatisticsFormElementClass";

/**
 * Класс конфига формы сбора
 */
export class StatisticsFormConfig {
  elements: StatisticsFormElementClass[]

  constructor(elements = []) {
    this.elements = elements
  }
}
