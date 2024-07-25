import {GridSearchOperType, SearchFieldType} from "../../models/types/SearchType";

export class GridSearchSystem {
  column: string
  operType: GridSearchOperType
  value?: any
  valueType: SearchFieldType | undefined

  constructor(column: string, operType: GridSearchOperType, value?: any, valueType?: SearchFieldType) {
    this.column = column
    this.operType = operType
    this.value = value
    this.valueType = valueType
  }
}
