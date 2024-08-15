import {GridType} from "../models/types/GridType";
import {BACK_DATE_FORMAT, ENTRIES_ON_PAGE} from "../constants/Constants";
import {postp} from "./AbstractService";
import {isArray} from "../utils/arrayUtils";
import {GridParamType} from "./GridService";
import {GridSearchDataGroup} from "../models/classes/GridSearchDataGroup";
import {GridSearchDataConditon} from "../models/classes/GridSearchDataConditon";
import {GridSearchOperType} from "../models/types/SearchType";
import {convertDateToStr, nowDate} from "../utils/dateUtils";

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
    const {current = 1, pageSize = ENTRIES_ON_PAGE} = params
    const url = type.route

    const data = {
        limit: pageSize,
        offset: pageSize * (current - 1),
        fields: type.fields || undefined,
        ...dictDataRequestParams(date, dictClosed)
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
const dictDataRequestParams = (date: string = convertDateToStr(nowDate(), BACK_DATE_FORMAT)!, dictClosed: boolean = false) => {
    return ({
        sort: [{
                field: 'ord',
                order: 'asc'
            }],
        search: dictDataSearch(date, dictClosed)
    })
}

/**
 * Формирование поискового запроса на данные справочника с учетом даты и флага отображения закрытых
 * @param date          - дата на которую нужно отобразить справочник
 * @param viewClosed    - флаг отображение последних актуальных версий для закрытых записей
 */
const dictDataSearch = (date: string = convertDateToStr(nowDate(), BACK_DATE_FORMAT)!, dictClosed: boolean = false) => {
    // группа условий на актуальные записи
    const inDateCond = new GridSearchDataConditon("inDate", GridSearchOperType.lte, date);
    const outDateCond = new GridSearchDataConditon("outDate", GridSearchOperType.gt, date);
    const actualCondGroup = new GridSearchDataGroup('and', false, [inDateCond, outDateCond])

    // группа условий на последние закрытые записи
    if (dictClosed) {
        const isHasOlderVersionsCond = new GridSearchDataConditon("isHasOlderVersions", GridSearchOperType.eq, false);
        const outDateCond = new GridSearchDataConditon("outDate", GridSearchOperType.lte, date);
        const lastActualCondGroup = new GridSearchDataGroup('and', false, [isHasOlderVersionsCond, outDateCond])
        return new GridSearchDataGroup('or', false, [actualCondGroup, lastActualCondGroup])
    }

    return new GridSearchDataGroup('or', false, [actualCondGroup])
}
