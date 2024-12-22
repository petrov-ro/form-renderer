import { ReqType } from "rtcigs-flc-shared";

/**
 * Переменная из запрашиваемого контекста
 */
export type RequiredContextVariable = {
    id: number
    name: string
    type: ReqType
}
