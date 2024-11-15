/**
 * Результат проверки правил типа flc на реквизите формы
 */
type RuleResultFlc = {
    requisiteKey: number
    errorMessage: string
    parentsChain: {
        requisiteKey: number
    }[],
    ruleData: {
        ruleKey: number
        ruleName: string
        requisites:
            {
                key: number
                parentsChain:
                    {
                        requisite_key: number
                    }[]
                value: null
            }[]
        variables: any[]
        attributes: any[]
    }
}
