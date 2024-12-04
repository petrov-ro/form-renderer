/**
 * Результат проверки правил типа AUTOCOMPLETE
 */
type RuleResultAUTOCOMPLETE = RuleResult & {
    applyWhenEditing: boolean
    hintMessage: string
    requisiteValues: any
}
