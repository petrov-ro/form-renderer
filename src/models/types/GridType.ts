import {FormType} from "@/models/types/FormType";
import {ParamsType} from "@ant-design/pro-provider";
import {GridSearchSystem} from "@/models/classes/GridSearchSystem";
import {GridSearchOperType} from "@/models/types/SearchType";

export type GridType = {
  route: string,
  routeCount?: string,
  routeCountNoLimit?: string,
  code?: string,
  name: string,
  fields?: string[],
  valueKey?: string | string[],
  labelKey?: string | string[],
  path?: string,
  form?: FormType,
  data?: boolean
  reload?: boolean
  search?: Record<string, GridSearchOperType>  // оператор для атрибута при фильтрации в гриде (пример: status: GridSearchOperType.eq)
  transform?: (searchParams: ParamsType) => GridSearchSystem[]
  isTree?: boolean              // флаг древовидности
  uncut?: boolean               // флаг отображения полного содержимого атрибута в гриде
  limit?: number                // ограничение сверху на размер текста в колонках грида
  treeEntities?: TreeEntities[] // коды сущностей которые могут быть в дочерних
}

export type TreeEntities = {
  code?: string   // код сущности
  attr?: string   // атрибут, по которому устанавливается связь
}
