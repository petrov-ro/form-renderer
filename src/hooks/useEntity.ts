import {useEffect, useState} from 'react';
import {getJSON} from "../services/AbstractService";
import {EntityClass} from "../models/classes/EntityClass";

export type useEntityProps = {
  loading: boolean
  entity: EntityClass | undefined
}

/**
 * Генерация url для получения сущности
 */
const getURL = (code?: string, modelId?: string, id?: string): string => {
  if (id) {
    return `entity/${id}`
  }

  if (modelId) {
    return `entity/by-model-and-code/${modelId}/${code}`
  }

  return `entity/by-code/${code}`
}

/**
 * Хук для получения сущности по коду или идентификатору
 *
 * @param code          - код сущности
 * @param defaultEntity - сущность по умолчанию
 * @param modelId       - идентификатор модели
 * @param id            - идентификатор сущности
 */
const useEntity = (code?: string, defaultEntity?: EntityClass, modelId?: string, id?: string): useEntityProps => {
  const [entity, setEntity] = useState({
    entity: defaultEntity,
    loading: !!((code && code !== defaultEntity?.code) || (id && id !== defaultEntity?.id))
  })

  useEffect(() => {
    let isMounted = true

    async function fetchList() {
      try {
        // генерация url
        const url = getURL(code, modelId, id)

        // получение данных
        const data = await getJSON(url)

        if (isMounted) {
          setEntity({
            entity: data,
            loading: false
          })
        }
      } catch (error) {
        if (isMounted) {
          // console.log(error)
          setEntity({
            entity: undefined,
            loading: false
          })
        }
      }
    }

    if ((code && code !== defaultEntity?.code) || (id && id !== defaultEntity?.id)) {
      fetchList()
    }

    return () => {
      isMounted = false
    };
  }, [code, id])

  return {
    ...entity,
    loading: entity.loading || !!((code && code !== entity.entity?.code) || (id && id !== entity.entity?.id))}
}

export default useEntity
