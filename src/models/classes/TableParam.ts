import { Key } from "react"
import {uuid} from "../../utils/common";

/**
 * Класс элемента массива значений
 */
export class TableParam<T = Key> {
    id: Key
    value?: T | undefined

    constructor(value?: T | undefined) {
        this.id = uuid()
        this.value = value
    }
}
