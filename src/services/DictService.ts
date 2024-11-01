import {GridType} from "../models/types/GridType";
import {BACK_DATE_FORMAT, ENTRIES_ON_PAGE} from "../constants/Constants";
import {postp} from "./AbstractService";
import {isArray} from "../utils/arrayUtils";
import {GridSearchDataGroup} from "../models/classes/GridSearchDataGroup";
import {GridSearchDataConditon} from "../models/classes/GridSearchDataConditon";
import {GridSearchOperType} from "../models/types/SearchType";
import {convertDateToStr, nowDate} from "../utils/dateUtils";
import {Key} from "react";
import {EntityClass} from "../models/classes/EntityClass";
import {gidRequestParamsData} from "../utils/searchUtils";

export type DictDataParamType = Record<string, any> & {
    pageSize?: number;
    current?: number;
    searchParams?: Record<string, any>   // параметры поиска в базе
}

/**
 * Получение данных справочника
 *
 * @param params
 * @param type
 * @param date
 * @param dictClosed
 */
export const dictData = <T extends Record<string, any>>(
    params: DictDataParamType,
    type: GridType,
    date?: string,
    dictClosed: boolean = false,
    entity?: EntityClass
): Promise<T[]> => {
    const {current = 1, pageSize = ENTRIES_ON_PAGE, ...rest} = params
    const url = type.route

    const data = {
        limit: pageSize,
        offset: pageSize * (current - 1),
        fields: type.fields || undefined,
        ...dictDataRequestParams(date, dictClosed, rest, type, entity)
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
    params: Record<string, any>,
    type?: GridType,
    entity?: EntityClass
) => {
    return ({
        sort: [{
            field: 'code',
            order: 'asc'
        }, {
            field: 'ord',
            order: 'asc'
        }, {
            field: 'name',
            order: 'desc'
        }],
        search: dictDataSearch(date, dictClosed, params, type, entity)
    })
}

/**
 * Формирование поискового запроса на данные справочника с учетом даты и флага отображения закрытых
 * @param dictDate      - дата на которую нужно отобразить справочник
 * @param dictClosed    - флаг отображение последних актуальных версий для закрытых записей
 * @param params        -
 */
const dictDataSearch = (
    dictDate: string = convertDateToStr(nowDate(), BACK_DATE_FORMAT)!,
    dictClosed: boolean = false,
    params: Record<string, any>,
    type?: GridType,
    entity?: EntityClass
) => {
    const {isTree = false, parentAttr = 'parentKey', parentId, isCommon, searchParams} = params

    // группа условий на актуальные записи
    let searches = getDictSearches(dictDate, dictClosed)

    // группа условий на параметры поиска
    if (type && searchParams && Object.values(searchParams).length > 0) {
        searches = new GridSearchDataGroup('and', false, [
            searches,
            gidRequestParamsData(searchParams, type, parentAttr, parentId, entity)
        ])
    }

    // если требуются только общие условия - выход на этом этапе
    if (isCommon) {
        return searches
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
 * @param type              - тип грида (этот тип используется для универсальности)
 * @param entityCode        - код сущности
 * @param key               - ключ записи
 * @param parentAttrCode    - код атрибута, по которому выбираются дочерние записи
 * @param dictDate          - дата на которую нужно отобразить справочник
 * @param dictClosed        - флаг отображения последних актуальных версий для закрытых записей
 * @param keyAttrCode       - код атрибута, по которому определяется ключ записи (для версионности)
 */
export const nodeBranch = <T extends Record<string, any>>(
    type: GridType,
    entityCode: string,
    parentAttrCode: string,
    key: Key | Key[],
    dictDate?: string,
    dictClosed: boolean = false,
    keyAttrCode: string = 'key'
): Promise<T[]> => {
    const url = `tree-branch/by-key/${entityCode}/${parentAttrCode}/${key}/${keyAttrCode}`

    const searches = {
        limit: 1,
        offset: 0,
        fields: type.fields || undefined,
        ...dictDataRequestParams(dictDate, dictClosed, {isCommon: true})
    }

    return (
        postp<T[]>(url, searches)
            .then(resp => isArray(resp) ? resp : [])
    )
}

/**
 * Получение группы условий на справочник
 *
 * @param dictDate    - дата на которую нужно отобразить справочник
 * @param dictClosed  - флаг отображения последних актуальных версий для закрытых записей
 */
export const getDictSearches = <T extends Record<string, any>>(
    dictDate: string = convertDateToStr(nowDate(), BACK_DATE_FORMAT)!,
    dictClosed: boolean = false
): GridSearchDataGroup => {
    let searches

    // группа условий на актуальные записи
    const inDateCond = new GridSearchDataConditon("inDate", GridSearchOperType.lte, dictDate);
    const outDateCond = new GridSearchDataConditon("outDate", GridSearchOperType.gt, dictDate);
    const actualCondGroup = new GridSearchDataGroup('and', false, [inDateCond, outDateCond])

    // группа условий на последние закрытые записи
    if (dictClosed) {
        const isHasOlderVersionsCond = new GridSearchDataConditon("isHasOlderVersions", GridSearchOperType.eq, false);
        const outDateCond = new GridSearchDataConditon("outDate", GridSearchOperType.lte, dictDate);
        const lastActualCondGroup = new GridSearchDataGroup('and', false, [isHasOlderVersionsCond, outDateCond])
        searches = new GridSearchDataGroup('or', false, [actualCondGroup, lastActualCondGroup])
    } else {
        searches = new GridSearchDataGroup('or', false, [actualCondGroup])
    }

    return searches
}
