/**
 * Результат проверки правил типа flc на реквизите формы
 */
type CheckResult<T = RuleResultFlc> = {
    rulesResult: T[]
    executeExceptions?: any[]
}
