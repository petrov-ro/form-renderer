import {useEffect, useState} from 'react';
import _ from 'lodash';
import {getFLCPackage} from '@/services/FLCService';
import {FLCRuleTypeEnum} from '@/constants/FLCRuleTypeEnum';
import {ContextInitializer, ReqType, RequisiteMetaData} from 'rtcigs-flc-shared';
import {FLCLocationEnum} from "../constants/FLCLocationEnum";
import {doImport} from "../utils/importUtil";
import {API} from "../constants/Constants";
import {ClassicFormClass} from "..";
import {formDataFLC} from '@/utils/formUtils';
import {FLCRulePlaceEnum} from '@/constants/FLCRulePlaceEnum';
import {RequiredContextAttribute} from '@/models/types/RequiredContextAttribute';
import {RequiredContextVariable} from "../models/types/RequiredContextVariable";
import {getTypeByName} from "../utils/flcUtils";

/**
 * Получение пакета правил ФЛК, формирование метода проверки
 * @param flcPath   - адрес сервиса ФЛК
 * @param config    - конфиг формы (в том числе список реквизитов)
 */
const useFLC = (
    flcPath: string | undefined,
    config: ClassicFormClass
) => {
    const [result, setResult] = useState<Promise<any>>()

    useEffect(() => {
        // получение ключа формы
        const {key: formKey, version: formVersion, t_600000018: requisites = []} = config as ClassicFormClass

        // формирование метаданных реквизитов формы для проверки ФЛК
        const metaData: RequisiteMetaData[] = requisites.map(req => ({
            key: req.req_id?.key,
            type: req.req_id?.type_id?.key || ReqType.String,
            name: req.name,
            code: req.code
        } as RequisiteMetaData))

        if (formVersion && formKey && flcPath) {
            setResult(Promise.all([
                    // FLC
                    getFLCPackage(formVersion, FLCLocationEnum.URP, FLCRuleTypeEnum.FLC)
                        .then(res => {
                            return res.text()
                        })
                        .then(text => {
                            return doImport(text)
                        })
                        .then(module => {
                            const {flcPackage} = module

                            API.checkFLC = (requisiteKeys, formDataInitial) => {
                                const formData = formDataFLC(formDataInitial)

                                // фильтрование контекста для проверки конкретного реквизита
                                const filter = {
                                    requisiteKeys,
                                    multiForm: false,
                                    debugOutput: true,
                                    places: [FLCRulePlaceEnum.CLIENT]
                                } // формирование фильтра для проверки конкретного реквизита(ов) RuleFilterDto.executionFilter
                                const requiredContextDto = flcPackage.getRequiredContext(filter)    // возвращается RequiredContextDto - список используемых атрибутов контекста, системных переменных и реквизитов
                                const {variables, attributes} = requiredContextDto
                                console.log(requiredContextDto)

                                // формируется контекст и заполняется данными
                                const contextInitializer = new ContextInitializer()

                                // установка данных в контекст
                                contextInitializer.set_req_data(1, formData, metaData, formKey, true);

                                // заполнение значений переменных
                                if (variables && variables.length > 0) {
                                    variables.forEach((variable: RequiredContextVariable) => {
                                        const {name, type} = variable
                                        const value = API.variables?.[name]
                                        if (value !== undefined) {
                                            contextInitializer.set_variable(name, getTypeByName(type), value)
                                        }
                                    })
                                }

                                // заполнение значений атрибутов
                                if (attributes && attributes.length > 0) {
                                    attributes.forEach((attr: RequiredContextAttribute) => {
                                        const {entityName, name, type} = attr
                                        const value = API.attributes?.[name]
                                        if (value !== undefined) {
                                            contextInitializer.set_attribute(entityName, name, getTypeByName(type), value)
                                        }
                                    })
                                }

                                // вызов метода проверки правил
                                const context = contextInitializer.get_context()
                                const checkResult: CheckResult<RuleResultFlc> = flcPackage.execute(context, filter, _)
                                const checkResultFiltered: CheckResult<RuleResultFlc> = {
                                    ...checkResult,
                                    rulesResult: checkResult.rulesResult.filter(r => requisiteKeys.includes(r.requisiteKey))
                                }

                                return checkResultFiltered
                            }
                        }),

                    // AUTOCOMPLETE
                    getFLCPackage(formVersion, FLCLocationEnum.URP, FLCRuleTypeEnum.AUTOCOMPLETE)
                        .then(res => {
                            return res.text()
                        })
                        .then(text => {
                            return doImport(text)
                        })
                        .then(module => {
                            const {flcPackage} = module

                            API.checkAUTOCOMPLETE = (requisiteKeys, formDataInitial) => {
                                const formData = formDataFLC(formDataInitial)

                                // фильтрование контекста для проверки конкретного реквизита
                                const filter = {
                                    requisiteKeys,
                                    multiForm: false,
                                    debugOutput: true,
                                    places: [FLCRulePlaceEnum.CLIENT]
                                } // формирование фильтра для проверки конкретного реквизита(ов) RuleFilterDto.executionFilter
                                const requiredContextDto = flcPackage.getRequiredContext(filter)    // возвращается RequiredContextDto - список используемых атрибутов контекста, системных переменных и реквизитов
                                const {variables, attributes} = requiredContextDto
                                console.log(requiredContextDto)

                                // формируется контекст и заполняется данными
                                const contextInitializer = new ContextInitializer()

                                // установка данных в контекст
                                contextInitializer.set_req_data(1, formData, metaData, formKey, true);

                                // заполнение значений переменных
                                if (variables && variables.length > 0) {
                                    variables.forEach((variable: RequiredContextVariable) => {
                                        const {name, type} = variable
                                        const value = API.variables?.[name]
                                        if (value !== undefined) {
                                            contextInitializer.set_variable(name, getTypeByName(type), value)
                                        }
                                    })
                                }

                                // заполнение значений атрибутов
                                if (attributes && attributes.length > 0) {
                                    attributes.forEach((attr: RequiredContextAttribute) => {
                                        const {entityName, name, type} = attr
                                        const value = API.attributes?.[name]
                                        if (value !== undefined) {
                                            contextInitializer.set_attribute(entityName, name, getTypeByName(type), value)
                                        }
                                    })
                                }

                                // вызов метода проверки правил
                                const context = contextInitializer.get_context()
                                try {
                                    const checkResult: CheckResult<RuleResultAUTOCOMPLETE> = flcPackage.execute(context, filter, _)
                                    return checkResult
                                } catch (e) {
                                    console.log(e)
                                }

                                return {
                                    rulesResult: [],
                                    executeExceptions: []
                                }
                            }
                        }),

                    // HIDING
                    getFLCPackage(formVersion, FLCLocationEnum.URP, FLCRuleTypeEnum.HIDING)
                        .then(res => {
                            return res.text()
                        })
                        .then(text => {
                            return doImport(text)
                        })
                        .then(module => {
                            const {flcPackage} = module

                            API.checkHIDING = (requisiteKeys, formDataInitial) => {
                                const formData = formDataFLC(formDataInitial)

                                // фильтрование контекста для проверки конкретного реквизита
                                const filter = {
                                    requisiteKeys,
                                    multiForm: false,
                                    debugOutput: true,
                                    places: [FLCRulePlaceEnum.CLIENT]
                                } // формирование фильтра для проверки конкретного реквизита(ов) RuleFilterDto.executionFilter
                                const requiredContextDto = flcPackage.getRequiredContext(filter)    // возвращается RequiredContextDto - список используемых атрибутов контекста, системных переменных и реквизитов
                                const {variables, attributes} = requiredContextDto

                                // формируется контекст и заполняется данными
                                const contextInitializer = new ContextInitializer()

                                // установка данных в контекст
                                contextInitializer.set_req_data(1, formData, metaData, formKey, true);

                                // заполнение значений переменных
                                if (variables && variables.length > 0) {
                                    variables.forEach((variable: RequiredContextVariable) => {
                                        const {name, type} = variable
                                        const value = API.variables?.[name]
                                        if (value !== undefined) {
                                            contextInitializer.set_variable(name, getTypeByName(type), value)
                                        }
                                    })
                                }

                                // заполнение значений атрибутов
                                if (attributes && attributes.length > 0) {
                                    attributes.forEach((attr: RequiredContextAttribute) => {
                                        const {entityName, name, type} = attr
                                        const value = API.attributes?.[name]
                                        if (value !== undefined) {
                                            contextInitializer.set_attribute(entityName, name, getTypeByName(type), value)
                                        }
                                    })
                                }

                                // вызов метода проверки правил
                                const context = contextInitializer.get_context()
                                try {
                                    const checkResult: CheckResult<RuleResultHiding> = flcPackage.execute(context, filter, _)
                                    return checkResult
                                } catch (e) {
                                    console.log(e)
                                }

                                return {
                                    rulesResult: [],
                                    executeExceptions: []
                                }
                            }
                        }),

                    // LIMITATION
                    getFLCPackage(formVersion, FLCLocationEnum.URP, FLCRuleTypeEnum.LIMITATION)
                        .then(res => {
                            return res.text()
                        })
                        .then(text => {
                            return doImport(text)
                        })
                        .then(module => {
                            const {flcPackage} = module

                            API.checkLIMITATION = (requisiteKeys, formDataInitial) => {
                                const formData = formDataFLC(formDataInitial)

                                // фильтрование контекста для проверки конкретного реквизита
                                const filter = {
                                    requisiteKeys,
                                    multiForm: false,
                                    debugOutput: true,
                                    places: [FLCRulePlaceEnum.CLIENT]
                                } // формирование фильтра для проверки конкретного реквизита(ов) RuleFilterDto.executionFilter
                                const requiredContextDto = flcPackage.getRequiredContext(filter)    // возвращается RequiredContextDto - список используемых атрибутов контекста, системных переменных и реквизитов
                                const {variables, attributes} = requiredContextDto
                                console.log(requiredContextDto)

                                // формируется контекст и заполняется данными
                                const contextInitializer = new ContextInitializer()

                                // установка данных в контекст
                                contextInitializer.set_req_data(1, formData, metaData, formKey, true)

                                // заполнение значений переменных
                                if (variables && variables.length > 0) {
                                    variables.forEach((variable: RequiredContextVariable) => {
                                            const {name, type} = variable
                                            const value = API.variables?.[name]
                                            if (value !== undefined) {
                                                contextInitializer.set_variable(name, getTypeByName(type), value)
                                            }
                                        })
                                }

                                // заполнение значений атрибутов
                                if (attributes && attributes.length > 0) {
                                    attributes.forEach((attr: RequiredContextAttribute) => {
                                        const {entityName, name, type} = attr
                                        const value = API.attributes?.[name]
                                        if (value !== undefined) {
                                            contextInitializer.set_attribute(entityName, name, getTypeByName(type), value)
                                        }
                                    })
                                }

                                // вызов метода проверки правил
                                const context = contextInitializer.get_context()
                                try {
                                    const checkResult: CheckResult<RuleResultLIMITATION> = flcPackage.execute(context, filter, _)
                                    return checkResult
                                } catch (e) {
                                    console.log(e)
                                }

                                return {
                                    rulesResult: [],
                                    executeExceptions: []
                                }
                            }
                        })
                ]
                )
            )
        }
    }, [])

    return result
}

export default useFLC
