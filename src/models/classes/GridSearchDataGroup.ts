import {GridSearchDataConditon} from "../../models/classes/GridSearchDataConditon";

export type GridSearchDataType = 'group' | 'condition'
export type GridSearchDataJoinOperators = 'or' | 'and'

export class GridSearchDataGroup {
  type: GridSearchDataType
  joinOperator: GridSearchDataJoinOperators
  not: boolean
  searches: (GridSearchDataConditon | GridSearchDataGroup)[]

  constructor(joinOperator: GridSearchDataJoinOperators,
              not: boolean,
              searches: (GridSearchDataConditon | GridSearchDataGroup)[]
  ) {
    this.type = 'group'
    this.joinOperator = joinOperator
    this.not = not
    this.searches = searches
  }
}
