import {GridType} from "../models/types/GridType";
import {BACK_DATE_FORMAT, ENTRIES_ON_PAGE} from "../constants/Constants";
import {getJSON, postp} from "./AbstractService";
import {isArray} from "../utils/arrayUtils";
import {GridParamType} from "./GridService";
import {GridSearchDataGroup} from "../models/classes/GridSearchDataGroup";
import {GridSearchDataConditon} from "../models/classes/GridSearchDataConditon";
import {GridSearchOperType} from "../models/types/SearchType";
import {convertDateToStr, nowDate} from "../utils/dateUtils";
import { Key } from "react";

/**
 * Получение данных справочника
 *
 * @param params
 * @param sort
 * @param filter
 * @param type
 */
export const dictData = <T extends Record<string, any>>(
    params: GridParamType,
    type: GridType,
    date?: string,
    dictClosed: boolean = false
): Promise<T[]> => {
    const {current = 1, pageSize = ENTRIES_ON_PAGE, ...rest} = params
    const url = type.route

    const data = {
        limit: pageSize,
        offset: pageSize * (current - 1),
        fields: type.fields || undefined,
        ...dictDataRequestParams(date, dictClosed, rest)
    }

    return (
        postp<T[]>(url, data)
            .then(resp => isArray(resp) ? resp : [])
    )
}

/**
 * Формирование запроса на данные справочника с учетом даты и флага отображения закрытых
 * @param date          - дата на которую нужно отобразить справочник
 * @param viewClosed    - флаг отображение последних актуальных версий для закрытых записей
 */
const dictDataRequestParams = (
    date: string = convertDateToStr(nowDate(), BACK_DATE_FORMAT)!,
    dictClosed: boolean = false,
    params: Record<string, any>
) => {
    return ({
        sort: [{
            field: 'ord',
            order: 'asc'
        }, {
            field: 'name',
            order: 'desc'
        }],
        search: dictDataSearch(date, dictClosed, params)
    })
}

/**
 * Формирование поискового запроса на данные справочника с учетом даты и флага отображения закрытых
 * @param date          - дата на которую нужно отобразить справочник
 * @param viewClosed    - флаг отображение последних актуальных версий для закрытых записей
 * @param parentAttr    - флаг отображение последних актуальных версий для закрытых записей
 * @param parentId      - флаг отображение последних актуальных версий для закрытых записей
 */
const dictDataSearch = (
    date: string = convertDateToStr(nowDate(), BACK_DATE_FORMAT)!,
    dictClosed: boolean = false,
    params: Record<string, any>
) => {
    const {isTree = false, parentAttr = 'parentKey', parentId} = params
    let searches

    // группа условий на актуальные записи
    const inDateCond = new GridSearchDataConditon("inDate", GridSearchOperType.lte, date);
    const outDateCond = new GridSearchDataConditon("outDate", GridSearchOperType.gt, date);
    const actualCondGroup = new GridSearchDataGroup('and', false, [inDateCond, outDateCond])

    // группа условий на последние закрытые записи
    if (dictClosed) {
        const isHasOlderVersionsCond = new GridSearchDataConditon("isHasOlderVersions", GridSearchOperType.eq, false);
        const outDateCond = new GridSearchDataConditon("outDate", GridSearchOperType.lte, date);
        const lastActualCondGroup = new GridSearchDataGroup('and', false, [isHasOlderVersionsCond, outDateCond])
        searches = new GridSearchDataGroup('or', false, [actualCondGroup, lastActualCondGroup])
    } else {
        searches = new GridSearchDataGroup('or', false, [actualCondGroup])
    }

    // для дерева добавление условия отсутствия родителей
    const result = isTree ?
        new GridSearchDataGroup('and', false, [
            parentId ? (
                new GridSearchDataConditon(parentAttr, GridSearchOperType.eq, parentId)
            ) : (
                //new GridSearchDataConditon(parentAttr, GridSearchOperType.exists, false)
                new GridSearchDataConditon(parentAttr, GridSearchOperType.eq, null)
            ),
            searches
        ]) : searches

    return result
}

/**
 * Получение данных справочника
 *
 * @param entityCode        - код сущности
 * @param pkValue           - ключ записи
 * @param parentAttrCode    - код атрибута, по которому выбираются дочерние записи
 */
export const nodeBranch = <T extends Record<string, any>>(
    entityCode: string,
    parentAttrCode: string,
    pkValue: Key | Key[],
    dictDate: string
): Promise<T[]> => {
    const url = `tree-branch/by-pk/${entityCode}/${parentAttrCode}/${pkValue}/${dictDate}`

    return (
        getJSON<T[]>(url)
            .then(resp => isArray(resp) ? resp : [])
    )
}
