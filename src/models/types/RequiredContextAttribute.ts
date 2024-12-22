import { ReqType } from "rtcigs-flc-shared";

/**
 * Атрибут из запрашиваемого контекста
 */
export type RequiredContextAttribute = {
    id: number
    name: string
    type: ReqType
    entityId: number
    entityName: string
}
