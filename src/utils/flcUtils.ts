import dayjs from "dayjs"

/**
 * Возвращает путь к реквизиту формы по данным из результата проверки (ключу реквизита, группе и цепочке родителей)
 */
export const getNamePath = (requisiteKey: number, groupNumber: number, parentsChain: RuleParentChain): any[] => {
    const result: any[] = parentsChain
        .flatMap(({groupNumber, requisiteKey}) => (
            groupNumber !== null && groupNumber !== undefined ? [requisiteKey, groupNumber] : requisiteKey
        ))
        .reverse()

    if (groupNumber !== null && groupNumber !== undefined) {
        result.push(groupNumber)
    }

    result.push(requisiteKey)


    return result.map(String)
}

/**
 * Получение типа по имени
 * @param str - имя типа
 */
export const getTypeByName = (str: string): number | string => {
    switch (str) {
        case "Time":
            return 70872951;
            break;
        case "Date":
            return 70138458;
            break;
        case "Integer":
            return 70138454;
            break;
        case "Reference":
            return 34213061;
            break;
        case "String":
            return 70138456;
            break;
        case "DateTime":
            return 99186942;
            break;
        case "Decimal":
            return 100865912;
            break;
        case "FILE":
            return 100973182;
            break;
        case "FIASADR":
            return 101199982;
            break;
        case "AnyReference":
            return 101549692;
            break;
        case "Number":
            return 101549693;
            break;
        case "Boolean":
            return 101549694;
            break;
    }
    return str
}

/**
 * Модификация значения реквизита после проверки
 * @param value - значение
 */
export const modifyValue = (value: any): any => {
    return value instanceof Date ? dayjs(value) : value
}
