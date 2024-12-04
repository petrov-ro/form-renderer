import {isArray} from "./arrayUtils";

/**
 * Возвращает идентификтатор элемента формы
 */
export const getFormItemId = (name: any): string => {
    const id = `form-item-${isArray(name) ? name.join('-') : name}`
    return id
}
