import {message} from "antd";

export const success = (text: string, timeOut = 2) => { // таймаут в секундах
  console.log(text, timeOut)
}

export const warning = (content: string, duration = 10) => {
  console.log(content, duration)
}

export const error = (content: string, duration = 1000) => {
  console.log(content, duration)
}

/**
 * Обработка ощибок
 * @param o - объект ответа fetchAPI
 */
export const errorHandle = (o: any = 'Неизвестная ошибка', timeOut = 1000, prefix?: string): string | undefined => {
  // не выводить сообщений в случае ошибки 403 и 511
  if ([403, 511].includes(o.response?.status) || [403, 511].includes(o.status)) {
    return undefined
  }

  const text = (
    o?.data?.error ||
    o?.response?.data?.error || // дедупликация
    o?.error ||
    o?.response?.message || // проверка обязательных полей на форме данных
    o?.message ||
    o
  ).toString()

  const details = (
    o?.data?.details // создание журнала с повторяющимся кодом
  )

  const status = o?.response?.status?.toString()
  const errorMessage = `${prefix || ''}${status ? `(${status}) ` : ''}${text}${details ? `, ${details}` : ''}`
  error(errorMessage, timeOut);
  return text
}
