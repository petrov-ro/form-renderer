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
