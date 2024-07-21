import {GridSearchOperType} from "../../models/types/SearchType";
import {GridSearchDataType} from "../../models/classes/GridSearchDataGroup";

export class GridSearchDataConditon {
  type: GridSearchDataType
  field: string
  operation: GridSearchOperType
  value: string | string[] | boolean

  constructor(field: string,
              operation: GridSearchOperType,
              value: string | string[] | boolean
  ) {
    this.type = 'condition'
    this.field = field
    this.operation = operation
    this.value = value
  }
}
