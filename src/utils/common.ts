import moment from "moment"

export const isString = (val: any) => typeof val === 'string'

export const isBoolean = (val: any) => typeof val === 'boolean'

export const isFunction = (val: any) => typeof val === 'function'

export const isNumeric = (val: any) => !Number.isNaN(parseFloat(val)) && Number.isFinite(val);

export const isDate = (val: any) => isString(val) && moment(val).isValid()

export const isUUID = (val: any) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val)

/**
 * Генератор uuid
 */
export const uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Переобразование строки к целому числу
 * @param x - строка
 * @param base - основание системы счисления
 * Возвращает число или 0
 */
export const stringToInt = (x: string, base = 10) => {
  const parsed = parseInt(x, base);
  if (isNaN(parsed)) {
    return 0
  }
  return parsed;
}
