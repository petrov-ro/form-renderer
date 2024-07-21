import {Key} from "react";
import {GridSearchOperType} from "../models/types/SearchType";
import {GridType} from "../models/types/GridType";
import {SortOrder} from "antd/lib/table/interface";
import {ParamsType} from "@ant-design/pro-provider";
import {GridSearchSystem} from "../models/classes/GridSearchSystem";
import {GridSearchDataGroup} from "../models/classes/GridSearchDataGroup";
import {GridSearchDataConditon} from "../models/classes/GridSearchDataConditon";
import {isArray} from "../utils/arrayUtils";
import {isDate, isString, isUUID} from "../utils/common";
import {convertStrToStr, convertStrToStrNotNull} from "../utils/dateUtils";
import {exact, exactPostfix, FT_SEARCH_GRID_ATTR, gridSearchParamArrayDelimeter} from "../constants/Constants";
import {EntityClass} from "../models/classes/EntityClass";
import {EntityAttrTypes} from "../constants/EntityAttrTypes";
import {EntityAttrValTypesEnum} from "../constants/EntityAttrValTypes";

export type GridRequestParams = {
  sort?: object
  search?: object
  ftSearch?: string
}

/**
 * Проверка, что аргумент является объектом GridSearchSystem (проверяется наличие свойств)
 * @param val
 */
export const isCondition = (val: any): boolean => {
  if (!val) {
    return false
  }

  const result = val instanceof GridSearchSystem
  return result
}

/**
 * Дефолтный набор параметров поиска
 */
const defaultTransform = (searchParams: ParamsType, type: GridType): GridSearchSystem[] =>
  Object.keys(searchParams).flatMap(p => {
    const value = searchParams[p]

    // если в значении параметра передано готовое условие, то используется оно
    if (isCondition(value)) {
      return value
    }

    // случай массива
    if (isArray(value)) {
      // массив дат
      if (value.every(isDate)) {
        return ([] as GridSearchSystem[])
          .concat(value[0] ? [new GridSearchSystem(p, GridSearchOperType.gte, convertStrToStr(value[0]))] : [])
          .concat(value[1] ? [new GridSearchSystem(p, GridSearchOperType.lte, convertStrToStr(value[1]))] : [])
      }
      // массив значений
      const values = value.map((v: any) => v.toString()).join(gridSearchParamArrayDelimeter)
      return new GridSearchSystem(p, GridSearchOperType.in, values)
    }

    // проверка заданного оператора для этого атрибута в типе грида
    const operation = type.search?.[p]
    if (operation) {
      return new GridSearchSystem(p, operation, value)
    } else {
      if (isString(value) && !isUUID(value)) {
        return new GridSearchSystem(p, GridSearchOperType.like, `*${value}*`)
      }
      return new GridSearchSystem(p, GridSearchOperType.eq, value)
    }
  })

/**
 * Формирует параметры поиска для системных гридов
 */
export const gidRequestParamsSystem = (searchParams: ParamsType, type: GridType): GridSearchSystem[] =>
  type?.transform ? type.transform(searchParams) : defaultTransform(searchParams, type)

/**
 * Формирует параметры поиска для гридов данных
 */
export const gidRequestParamsData = (searchParams: ParamsType,
                                     type: GridType,
                                     parentAttr: string = 'parentId',
                                     parentId?: string,
                                     entity?: EntityClass): GridSearchDataGroup => {
  const params = new GridSearchDataGroup('and', false,
    Object.keys(searchParams)
      .filter(p => p !== FT_SEARCH_GRID_ATTR)  // параметр полнотекстового поиска обрабатывается отдельно
      .filter(p => searchParams[p] !== '')     // пустые строки не учитываются
      .filter(p => !p.includes(exactPostfix))  // служебные параметры не обрабатываются как самостоятельные
      .map(p => {
        const attrConfig = entity?.attrs.find(a => a.code === p)  // свойства атрибута с кодом p
        const value = searchParams[p]                 // поисковое значение атрибута
        const valueExact = searchParams[exact(p)]     // флаг точного поиска

        // для немногозначных строковых атрибутов без точного соответствия используется оператор like
        if (value && isString(value) && !valueExact) {
          return new GridSearchDataConditon(p, GridSearchOperType.like, `*${value}*`)
        }

        // если значение - массив
        if (isArray(value)) {
          // массив дат
          if (value.every((v: Key) =>
            attrConfig && attrConfig.valueTypeId && attrConfig.typeId === EntityAttrTypes.PLAIN &&
            [EntityAttrValTypesEnum.DATETIME, EntityAttrValTypesEnum.DATE, EntityAttrValTypesEnum.TIME].includes(attrConfig.valueTypeId) &&
            isDate(v)
          )) {
            const conditions = ([] as GridSearchDataConditon[])
              .concat(value[0] ? [new GridSearchDataConditon(p, GridSearchOperType.gte, convertStrToStrNotNull(value[0]))] : [])
              .concat(value[1] ? [new GridSearchDataConditon(p, GridSearchOperType.lte, convertStrToStrNotNull(value[1]))] : [])
            return new GridSearchDataGroup('and', false, conditions)
          }
          // массив значений
          return new GridSearchDataConditon(p, GridSearchOperType.in, value)
        }

        return new GridSearchDataConditon(p, GridSearchOperType.eq, value)
      })
  )

  // для дерева добавление условия отсутствия родителей
  // TODO атрибут брать из типа
  const result = (type.isTree || (parentAttr && parentId)) ? (
    new GridSearchDataGroup('and', false, [
      parentId ?
        new GridSearchDataConditon(parentAttr, GridSearchOperType.eq, parentId)
        :
        new GridSearchDataConditon(parentAttr, GridSearchOperType.exists, false),
      params
    ])
  ) : params

  return result
}

/**
 * Формирует параметры поиска для системных гридов и гридов данных
 */
export const gidRequestParams = (type: GridType,
                                 sortParams: Record<string, SortOrder> = {},
                                 searchParams: ParamsType = {},
                                 parentAttr?: string,
                                 parentId?: string,
                                 entity?: EntityClass): GridRequestParams => (
  {
    sort: sortParams && Object.keys(sortParams).map((o: any) => ({
        [type.data ? 'field' : 'column']: o,
        order: sortParams[o]?.replace('ascend', 'asc').replace('descend', 'desc')
      })
    ),
    search: type.data ? (
      gidRequestParamsData(searchParams, type, parentAttr, parentId, entity)
    ) : (
      gidRequestParamsSystem(searchParams, type)
    ),
    ftSearch: searchParams?.[FT_SEARCH_GRID_ATTR] || undefined
  }
)
