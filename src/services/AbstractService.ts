import {errorHandle} from "../utils/messages";
import {API} from "../constants/Constants";

export const getp = <T = any>(url: string, params = {}, error: (err: string) => void = errorHandle, silent = false): Promise<any> => {
  // clear() // сброс всех сообщений пока отключил т.к. на формах после неудачного сохранения обновляются справочники и сбрасывают сообщения
  return fetch(`${API.REACT_APP_API_URL}/${url}`, {
    method: 'GET',
    ...params,
  })
    .catch((err: any) => {
      if (silent) {
        throw err
      }
      error?.(err)
    })
}
/**
 * Метод post. Обработка ошибок - если флаг silent установлен - проброс ошибки дальше,
 * если не установлен - вывод сообщения и ошибка дальше не пробрасывается
 *
 * @param url
 * @param data
 * @param params
 * @param silent
 */
export const postp = <T = any>(url: string, data?: any, params?: any, silent = false, throwout = false): Promise<any> => {
  // clear() // сброс всех сообщений пока отключил т.к. на формах после неудачного сохранения обновляются встроенные гриды и сбрасывают сообщения
  return fetch(`${API.REACT_APP_API_URL}/${url}`, {
    method: 'POST',
    data,
    ...params,
  })
    .catch((err: any) => {
      if (!silent) {
        errorHandle(err)
      }
      if (throwout) {
        throw err
      }
  })
}

export const putp = <T = any>(url: string, data?: any, params?: any, silent = false): Promise<any> => {
  return fetch(`${API.REACT_APP_API_URL}/${url}`, {
    method: 'PUT',
    data,
    ...params,
  })
  .catch((err: string) => {
    if (silent) {
      throw new Error(err)
    }
    errorHandle(err)
  })
}
