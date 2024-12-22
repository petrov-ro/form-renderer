import {isArray} from "./arrayUtils";

/**
 * Возвращает идентификтатор элемента формы
 */
export const getFormItemId = (name: any): string => {
    const id = `form-item-${isArray(name) ? name.join('-') : name}`
    return id
}

/**
 * Модификация объекта данных формы при передаче в метод проверки ФЛК
 *
 * @param formData  - исходные данные формы
 * @param config    - метаданные формы
 * @return Модифицированные данные формы
 */
export const formDataFLC = (formData: Record<string, any> = {}): Record<string, any> => {
    const jsonString = JSON.stringify(formData)
    const result = JSON.parse(jsonString);
    //console.log(result)
    return result

/*    // перенос элементов из t_600000018 в elements
    const {t_600000018, elements: configElements = []} = config || {}
    const elements = t_600000018 ? t_600000018 : configElements

    /!**
     * Получение реквизита по ключу
     * @param id - ключ реквизита
     *!/
    const getReq = (id: Key) => (elements || [])
        .find((element) => {

            const {
                key: elementKey,
                req_id,
                struct_type_id
            } = element

            const {
                key: elementType
            } = struct_type_id || {}

            const {
                key: reqKey
            } = req_id || {}

            const code = (reqKey || elementKey).toString()

            return code === id && ElementTypeEnum.REQ === elementType
        })

    // модификация данных
    const modifiedFormData = Object
        .keys(formData)
        .reduce((acc, key) => {
            const reqValue = formData[key]
            const req = getReq(key)

            if (req) {
                const { req_id } = req
                const {
                    type_id: {
                        key: typeId = undefined
                    } = {},
                } = req_id || {}

                if (typeId && [ReqTypeEnum.DATE, ReqTypeEnum.DATETIME].includes(typeId)) {
                    // реквизиты типа Дата, Датавремя преобразуются в формат js
                    try {
                        acc[key] = reqValue && reqValue.toDate ? reqValue.toISOString() : reqValue
                    } catch (ex) {
                        console.log('Ошибка при преобразовании даты', ex)
                        acc[key] = reqValue
                    }
                } else {
                    // реквизиты прочих типов остаются без изменений
                    acc[key] = reqValue
                }
            } else {
                // блоки обрабатываются рекурсивно
                acc[key] = formDataFLC(reqValue, config)
            }

            return acc
        }, {} as Record<string, any>)

    return modifiedFormData*/
}
