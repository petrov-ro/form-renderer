/**
 * Результат проверки правил типа flc на реквизите формы
 */
type RuleResultFlc = {
    requisiteKey: number
    groupNumber: number
    errorMessage: string
    parentsChain: {
        requisiteKey: number
        groupNumber: number
    }[],
    ruleData: {
        ruleKey: number
        ruleName: string
        requisites:
            {
                key: number
                parentsChain:
                    {
                        groupNumber: number
                        requisite_key: number
                    }[]
                value: null
            }[]
        variables: any[]
        attributes: any[]
    }
}
