import {StatisticsFormElementClass} from "../classes/StatisticsFormElementClass";

/**
 * Класс конфига формы сбора
 */
export class StatisticsFormConfig {
  elements: StatisticsFormElementClass[]

  constructor(elements = [] as StatisticsFormElementClass[]) {
    this.elements = elements
  }
}
