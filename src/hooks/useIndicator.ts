import {useEffect, useState} from 'react';
import {getp} from "../services/AbstractService";
import {StatisticsIndicatorClass} from "../models/classes/StatisticsIndicatorClass";
import {FormTypes} from "../constants/FormTypes";

export type useIndicatorProps = {
  indicator?: StatisticsIndicatorClass
  loading: boolean
}

/**
 * Хук получения индикатора форм сбора
 * @param id
 */
const useIndicator = (
  id?: string,           // идентификатор показателя форм сбора или сущности
  entityAttr?: boolean   // флаг что показатель относится к сущности
): useIndicatorProps => {
  const executable = !!id
  const [result, setResult] = useState<useIndicatorProps>({loading: executable})

  useEffect(() => {
    let isMounted = true

    async function fetchList() {
      try {
        // генерация url
        const url = `${entityAttr ? FormTypes.ENTITY_ATTR.route : FormTypes.STATISTICS_INDICATOR.route}/${id}`

        // получение данных
        const data = await getp(url)

        if (isMounted) {
          setResult({indicator: data, loading: false})
        }
      } catch (error) {
        if (isMounted) {
          // console.log(error)
          setResult({loading: false})
        }
      }
    }

    if (executable) {
      fetchList()
    }

    return () => {
      isMounted = false
    };
  }, [id])

  return result
}

export default useIndicator
