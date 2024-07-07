import {getp} from "../services/AbstractService";
import {GridType} from "../models/types/GridType";
import {EntityClass} from "../models/classes/EntityClass";
import {EntityAttrClass} from "../models/classes/EntityAttrClass";

/**
 * Получение сущности по коду и модели
 *
 * @param code    - код сущности
 * @param modelId - модель (по умолчанию актуальная)
 */
export async function getEntityByCode(code: string, modelId?: string): Promise<EntityClass | undefined> {
  try {
    // генерация url
    const url = modelId ? `entity/by-model-and-code/${modelId}/${code}` : `entity/by-code/${code}`

    // получение данных
    const data = await getp(url)

    return data
  } catch (error) {
      // console.log(error)
      return undefined
  }
}

/**
 * Получение сущности по типу грида (объекту GridType)
 *
 * @param type - тип грида
 */
export async function getEntityByType(type?: GridType): Promise<EntityClass | undefined> {
  const {code, data} = type || {}

  // актуально только для гридов данных
  if (code && data) {
    return getEntityByCode(code)
  }

  return undefined;
}


/**
 * Получение атрибута сущности
 *
 * @param attrCode   - код атрибута
 * @param entity     - сущность
 */
export const getEntityAttrByCode = (attrCode: string, entity?: EntityClass): EntityAttrClass | undefined =>
  entity?.attrs?.find(a => a.code === attrCode)
