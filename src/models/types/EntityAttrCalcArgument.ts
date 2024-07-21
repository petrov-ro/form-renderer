import {attrCalcAggregationEnum} from "../../constants/attrCalcAggregationNumberDict";

// аргументы, участвующие в формуле вычисляемого атрибута
export type EntityAttrCalcArgument = {
  code: string                    // код аргумента
  value: string[]                 // значение аргумента состоит из набора атрибутов
  aggr?: attrCalcAggregationEnum  // агрегатная функция
}
