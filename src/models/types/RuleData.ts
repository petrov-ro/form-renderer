/**
 * Правило в результате проверки
 */
type RuleData = {
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
