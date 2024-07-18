import {GridType} from "../models/types/GridType";
import {EntityClass} from "../models/classes/EntityClass";
import {FormTypes} from "./FormTypes";

/**
 * Формирование типа грида для данных сущности
 *
 * @param code   - код сущности
 * @param title  - назнавание сущности для вывода в заголовке грида
 */
export const entityDataGridType = (code: string, title: string = '', initialFields: string[] = [], entity?: EntityClass): GridType => {
  const uncut = !!entity?.config?.gridConfig?.uncut
  const limit = entity?.config?.gridConfig?.limit
  const isTree = !!entity?.config?.gridConfig?.tree
  const treeEntities = entity?.config?.gridConfig?.entities
  const currentEntityAttr = treeEntities?.find(te => te.code === code)?.attr
  const primaryKeyCode = entity?.attrs?.find(a => a.primaryKey)?.code
  const fields = initialFields.concat(isTree && currentEntityAttr ? [`${currentEntityAttr}.${primaryKeyCode}`] : [])
  const route = isTree ? 'find-with-children' : 'find'

  return ({
    route: `external-data/${route}/${code}`,
    routeCount: `external-data/count/${code}`,
    fields,
    code,
    name: `Данные ${title}`,
    data: true,
    isTree,
    uncut,
    limit,
    treeEntities
  })
}

export const GridTypes = {
  ENTITY_CATEGORY: {
    route: 'entity-category',
    name: 'Категории данных',
    path: '/model/entity-category-grid',
    form: FormTypes.ENTITY_CATEGORY,
    isTree: true,
  } as GridType,
  STATISTICS_INDICATOR: {
    route: 'statistics-indicator-category',
    name: 'Показатели',
    path: '/statistics/indicator-grid',
    form: FormTypes.STATISTICS_INDICATOR,
    labelKey: 'title',
    valueKey: 'id',
    isTree: true,
  } as GridType,
}
