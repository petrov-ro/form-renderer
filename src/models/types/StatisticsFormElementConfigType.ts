/**
 * Настройки элемента на форме сбора данных
 */
export type StatisticsFormElementConfigType<T = any, P = any> = {
  data?: T   // настроки ввода данных (актуально только для показателя)
  view?: P   // настройки отображения
}
