import {StatisticsFormElementClass} from "./StatisticsFormElementClass";

/**
 * Класс конфига формы сбора
 */
export class StatisticsFormConfig {
  elements: StatisticsFormElementClass[]

  constructor(elements: StatisticsFormElementClass[]) {
    this.elements = elements
  }
}
