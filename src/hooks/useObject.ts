import {Key, useEffect, useState} from 'react';
import {FormType} from "../models/types/FormType";
import {getFormData} from "../services/FormService";

type useObjectType<T = any> = {
  object: T | undefined
  loading: boolean
}

/**
 * Получение записи по типу и идентификатору
 * @param type
 * @param id
 */
const useObject = <T = any>(type?: FormType, id?: Key): useObjectType<T> => {
  const executable = !!id
  const [result, setResult] = useState<useObjectType<T>>({object: undefined, loading: executable})

  useEffect(() => {
    let isMounted = true

    async function fetch() {
      getFormData(type, id, undefined,
        (data: T) => {
          if (isMounted) {
            setResult({object: data, loading: false})
          }
        }, (error: Error) => {
          if (isMounted) {
            // console.log(error)
            setResult({object: undefined, loading: false})
          }
        })
    }

    if (executable) {
      fetch()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  return result
}

export default useObject
