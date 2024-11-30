import {useEffect} from 'react';
import _ from 'lodash';
import {getFLCPackage} from '@/services/FLCService';
import {FLCRuleTypeEnum} from '@/constants/FLCRuleTypeEnum';
import {ContextInitializer, ReqType, RequisiteMetaData} from 'rtcigs-flc-shared';
import {FLCLocationEnum} from "../constants/FLCLocationEnum";
import {doImport} from "../utils/importUtil";
import {API} from "../constants/Constants";
import {ClassicFormClass} from "..";

/**
 * Получение пакета правил ФЛК, формирование метода проверки
 * @param flcPath   - адрес сервиса ФЛК
 * @param config    - конфиг формы (в том числе список реквизитов)
 */
const useFLC = (
    flcPath: string | undefined,
    config: ClassicFormClass
) => {
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
            getFLCPackage(formVersion, FLCLocationEnum.URP, FLCRuleTypeEnum.FLC)
                .then(res => {
                    return res.text()
                })
                .then(text => {
                    return doImport(text)
                })
                .then(module => {
                    const {flcPackage} = module

                    API.checkFLC = (requisiteKeys, formData) => {
                        // фильтрование контекста для проверки конкретного реквизита
                        const filter = {requisiteKeys, multiForm: false, debugOutput: true} // формирование фильтра для проверки конкретного реквизита(ов) RuleFilterDto.executionFilter
                        const requiredContextDto = flcPackage.getRequiredContext(filter)    // возвращается RequiredContextDto - список используемых атрибутов контекста, системных переменных и реквизитов
                        //console.log(requiredContextDto)

                        // формируется контекст и заполняется данными
                        const contextInitializer = new ContextInitializer()

                        // установка данных в контекст
                        contextInitializer.set_req_data(1, formData, metaData, formKey, true)

                        // заполнение значений переменных
                        // contextInitializer.set_variable(name, targetType, value)                // установка переменных если они требуются (указано в requiredContextDto)

                        // заполнение значений атрибутов
                        // contextInitializer.set_attribute(entityName, name, targetType, value)   // установка атрибутов сущности, если требуется (указано в requiredContextDto)

                        // вызов метода проверки правил
                        const context = contextInitializer.get_context()
                        const checkResult: CheckResult<RuleResultFlc> = flcPackage.execute(context, filter, _)
                        const checkResultFiltered: CheckResult<RuleResultFlc> = {
                            ...checkResult,
                            rulesResult: checkResult.rulesResult.filter(r => requisiteKeys.includes(r.requisiteKey))
                        }

                        return checkResultFiltered
                    }
                })
        }
    }, [])
}

export default useFLC
