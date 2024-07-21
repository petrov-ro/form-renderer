import {FormType} from "../models/types/FormType";
import {postp, putp} from "../services/AbstractService";
import {EntityAttrClass} from "../models/classes/EntityAttrClass";
import {DATA_SYSTEM_KEY} from "../constants/Constants";

export enum FormTypeIdsEnum {
  ENTITY_CATEGORY, ENTITY_ATTR, DATA,  STATISTICS_INDICATOR
}

export const FormTypes = {
  ENTITY_CATEGORY: {
    id: FormTypeIdsEnum.ENTITY_CATEGORY,
    route: 'entity-category',
    name: 'Категория сущности',
  } as FormType,
  ENTITY_ATTR: {
    id: FormTypeIdsEnum.ENTITY_ATTR,
    route: 'entity-attr',
    name: 'Атрибут сущности',
  } as FormType,
  STATISTICS_INDICATOR: {
    id: FormTypeIdsEnum.STATISTICS_INDICATOR,
    route: 'statistics-indicator',
    name: 'Показатель',
  } as FormType
}

/**
 * Формирование адреса запроса для формы данных
 *
 * @param id
 * @param entityCode
 * @param bySysId
 * @param version
 */
const url = (id: string | undefined = '', entityCode: string, bySysId?: boolean, version?: string): string => {
  if (version) {
    if (bySysId) {
      return `data/get-version/by-sys-id-and-number/${entityCode}/${id}/${version}?includeDeleted=true`
    }
    return `data/get-version/by-pk-and-number/${entityCode}/${id}/${version}?includeDeleted=true`
  }

  if (bySysId) {
    return `data/get/by-sys-id/${entityCode}/${id}?includeDeleted=true`
  }
  return `data/get/by-pk/${entityCode}/${id}?includeDeleted=true`

}

/**
 * Формирование адреса запроса для удаления данных
 *
 * @param id          - системный идентификатор записи
 * @param entityCode  - код сущности
 */
const urlRemove = (id: string | undefined, entityCode: string): string => {
  return `data/delete/by-sys-id/${entityCode}/${id}`
}

/**
 * Формирование типа формы для данных сущности
 *
 * @param entityCode  - код сущности
 * @param title       - заголовок формы
 * @param attrs       - массив атрибутов сущности
 * @param bySysId     - флаг работы по системному айди
 * @param version     - версия записи
 */
export const entityDataFormType = (entityCode: string,
                                   title: string = '',
                                   attrs: EntityAttrClass[] = [],
                                   bySysId?: boolean,
                                   version?: string): FormType => ({
  id: FormTypeIdsEnum.DATA,
  key: DATA_SYSTEM_KEY,
  name: `Данные ${title}`,
  url: (id) => url(id?.toString(), entityCode, bySysId, version),
  urlRemove: (id) => urlRemove(id?.toString(), entityCode),
  createRoute: `data/insert/${entityCode}`,
  updateRoute: `data/update/${bySysId ? 'by-sys-id' : 'by-pk'}/${entityCode}`,
  createMethod: putp,
  updateMethod: postp,
  attrs
})
