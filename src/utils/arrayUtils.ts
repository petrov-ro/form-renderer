import {notEmpty} from "./objectUtils";

export const isArray = (array: any) => array instanceof Array;

/**
 * Преобразование значения к массиву
 *
 * @param val - значение или массив значений
 */
export const toArray = (val: any) =>
    isArray(val) ? val : [val]

/**
 * Удаление пустых значений из массива
 * @param arr - исходный массив
 * @return массив
 */
export const removeEmptyFromArray = (arr: any): any => {
    if (isArray(arr)) {
        return arr.filter(notEmpty)
    }
    return arr
}
