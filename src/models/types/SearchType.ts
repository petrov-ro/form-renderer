export declare type GridSortOrderType = 'asc' | 'desc'
export type GridSort = {
  column: string
  order: GridSortOrderType
}

export enum SearchFieldType {
  String = 'String', Integer = 'Integer', Float = 'Float', Date = 'Date', DateTime = 'DateTime', UUID = 'UUID',
  Boolean = 'Boolean', FileExtension = 'FileExtension'
}

export enum GridSearchOperType {
  'eq' = 'eq', 'ne' = 'ne', 'gt' = 'gt', 'gte' = 'gte', 'lt' = 'lt', 'lte' = 'lte',
  'like' = 'like', 'in' = 'in', 'notin' = 'notin', 'exists' = 'exists'
}
