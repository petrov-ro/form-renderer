/**
 * Получение значения из объекта по пути
 * @param obj  - объект
 * @param path - путь
 */
export const deepFind = (record: Record<string, any>, path: string[]) =>
    path.reduce((record, item) => record[item], record);
