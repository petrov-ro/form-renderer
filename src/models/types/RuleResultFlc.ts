/**
 * Результат проверки правил типа flc на реквизите формы
 */
type RuleResultFlc = {
    requisiteKey: number
    groupNumber: number
    errorMessage: string
    parentsChain: RuleParentChain,
    ruleData: RuleData
}
