/**
 * Сервисы форматно-логического контроля форм
 */
import {getJSONRaw} from "./AbstractService";
import {API} from "@/constants/Constants";
import {FLCLocationEnum} from "@/constants/FLCLocationEnum";
import {FLCRuleTypeEnum} from "@/constants/FLCRuleTypeEnum";

/**
 * Запрос пакета правил
 *
 * @param formVersionId   - ключ версии формы
 * @param location        - справочник локаций
 * @param type            - вид правил ФЛК
 * @param requisiteKeys   - ключи реквизитов, для которых нужно выбрать связанные с ними правила ФЛК
 * @param multiForm       - флаг, обозначающий, что при выполнении правил ФЛК нужно включить/исключить правила с признаком межформенности.
 * @param debugOutput     - флаг, включающий дополнительный вывод информации для отладки. Например, в вывод результата выполнения правила добавится дополнительная информация с данными правила.
 */
export const getFLCPackage = (formVersionId: number,
                              location: FLCLocationEnum,
                              type: FLCRuleTypeEnum,
                              requisiteKeys: any[] = [],
                              multiForm: boolean = false,
                              debugOutput: boolean = true
) => {
    // парметры get-запроса
    const urlParams = new URLSearchParams({
        formVersionId: formVersionId.toString(),
        location: location.toString(),
        type: type.toString()
    }).toString()

    // формирование адреса
    const url = `${API.REACT_APP_API_FLC_URL}/flc/package/get?${urlParams}`

    return getJSONRaw(url)
}
