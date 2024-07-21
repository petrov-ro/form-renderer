export const isArray = (array: any) => array instanceof Array;

/**
 * Преобразование значения к массиву
 *
 * @param val - значение или массив значений
 */
export const toArray = (val: any) =>
    isArray(val) ? val : [val]
