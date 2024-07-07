import React from "react";
import {SortOrder} from "antd/lib/table/interface";
import {ParamsType} from "@ant-design/pro-provider";
import {GridType} from "../models/types/GridType";
import {GridTypes} from "../constants/GridTypes";
import {getp, postp} from "../services/AbstractService";
import {gidRequestParams} from "../utils/searchUtils";
import {isArray} from "../utils/arrayUtils";
import {isNumeric} from "../utils/common";
import {ENTRIES_ON_PAGE} from "../constants/Constants";
import {getEntityByType} from "../utils/entityHelper";
import {EntityClass} from "../models/classes/EntityClass";

export type GridParamType = ParamsType & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}

/**
 * Получение данных системного грида или сущности
 *
 * @param params
 * @param sort
 * @param filter
 * @param type
 */
const gridData = <T extends Record<string, any>>(params: GridParamType,
                                                 sort: Record<string, SortOrder> = {},
                                                 filter: Record<string, React.ReactText[] | null> = {},
                                                 type: GridType,
                                                 entity?: EntityClass
): Promise<T[]> => {
  const {current = 1, pageSize = ENTRIES_ON_PAGE, ...restParams} = params
  const url = `${type.data ? '' : 'system/grid/'}${type.route}`

  const data = {
    limit: pageSize,
    offset: pageSize * (current - 1),
    fields: type.fields || undefined,
    ...gidRequestParams(type, sort, restParams, undefined, undefined, entity)
  }

  return (
    postp<T[]>(url, data, filter)
      .then(resp => isArray(resp) ? resp : [])
  )
}

/**
 * Подсчет данных системного грида или сущности
 *
 * @param params
 * @param type
 */
const gridDataCount = (params: GridParamType,
                       sort: Record<string, SortOrder> = {},
                       type?: GridType,
                       total?: number,
                       entity?: EntityClass
): Promise<number> => {
  if (total !== undefined && isNumeric(total)) {
    return Promise.resolve(total)
  }

  if (type) {
    const {current = 1, pageSize = ENTRIES_ON_PAGE, ...restParams} = params

    if (type.data) {
      const url = type.routeCount || ''
      const offset = pageSize * (current - 1)
      const data = {
        ...gidRequestParams(type, sort, restParams, undefined, undefined, entity),
        limit: pageSize,
        offset
      }
      return postp(url, data)
        .then(t => t + offset)
    }

    const url = `system/grid/count/${type.route}`
    const data = {
      search: gidRequestParams(type, sort, restParams, undefined, undefined, entity)?.search
    }

    const uncoutable = [GridTypes.ENTITY_CATEGORY.route, GridTypes.STATISTICS_INDICATOR.route].includes(type.route)
    return uncoutable ? Promise.resolve(0) : postp(url, data)
  }
  return Promise.reject(
    new Error('Не задан тип грида')
  )
}

/**
 * Получение дерева категорий сущности
 *
 * @param params
 */
const getEntityCategory = <T extends Record<string, any>>(params: GridParamType): Promise<T[]> =>
  getp(`entity-category/tree?modelId=${params.model_id || ''}&categId=${params.categId || ''}&categOnly=${params.categ_only || false}`)


/**
 * Получение дерева категорий показателей
 *
 * @param params
 */
const getCategory = <T extends Record<string, any>>(params: GridParamType): Promise<T[]> =>
  getp(`statistics-indicator-category/tree?categId=${params.categId || ''}&categOnly=${params.categ_only || false}`)

/**
 * Получение данных
 *
 * @param params
 */
export const getData = <T extends Record<string, any>>(
  params: GridParamType,
  sort: Record<string, SortOrder> = {},
  filter: Record<string, React.ReactText[] | null> = {},
  type?: GridType,
  initialData?: T[],
  entity?: EntityClass
): Promise<T[]> => {
  if (type) {
    return (
      GridTypes.ENTITY_CATEGORY.route === type.route ? (
        getEntityCategory(params)
      ) : (
        GridTypes.STATISTICS_INDICATOR.route === type.route ? (
          getCategory(params)
        ) : (
          gridData(params, sort, filter, type, entity)
        )
      ))
  }

  return Promise.resolve(initialData || [])
}

/**
 * Получение данных системного грида или сущности
 *
 * @param params
 * @param sort
 * @param filter
 * @param type
 */
export const getTableData = <T extends Record<string, any>>(
  params: GridParamType,
  sort: Record<string, SortOrder> = {},
  filter: Record<string, React.ReactText[] | null> = {},
  type?: GridType,
  initialData?: T[],
  total?: number
): Promise<{ data?: any[], success?: boolean }> =>
  getEntityByType(type)
    .then((entity: EntityClass | undefined) =>
      Promise.all([
        getData(params, sort, filter, type, initialData, entity),
        gridDataCount(params, sort, type, total, entity)
      ])
        .then(([data = [], count]) => ({
          data: data as T[],
          total: count,
          success: true
        }))
        .catch(() => ({
            data: [],
            success: false
          })
        ))
