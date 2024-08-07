import {
    ClassicFormClass,
    ClassicFormElementClass,
    ElementTypeEnum,
    ReqTypeEnum
} from "../models/classes/ClassicFormElementClass";
import {StatisticsFormConfig} from "../models/classes/StatisticsFormConfig";
import {StatisticsFormElementClass} from "../models/classes/StatisticsFormElementClass";
import {DraggableElements} from "../constants/DraggableElements";
import {StatisticsIndicatorClass} from "../models/classes/StatisticsIndicatorClass";
import {EntityAttrTypes} from "../constants/EntityAttrTypes";
import {EntityAttrValTypesEnum} from "../constants/EntityAttrValTypes";
import {FormConfigComponentType} from "../models/types/FormConfigComponentType";
import {FormConfigComponentTypeEnum} from "../constants/FormConfigComponentTypeEnum";
import {RefViewTypes} from "../constants/RefViewTypes";

/**
 * Возвращает тип нового формата соответствующий старому формату
 * @param typeId  - тип старого формата
 */
const getType = (typeId?: ReqTypeEnum): EntityAttrValTypesEnum => {
    switch (typeId) {
        case ReqTypeEnum.STRING: {
            return EntityAttrValTypesEnum.STRING
        }
        case ReqTypeEnum.INTEGER: {
            return EntityAttrValTypesEnum.INTEGER
        }
        case ReqTypeEnum.DATE: {
            return EntityAttrValTypesEnum.DATE
        }
        default: {
            return EntityAttrValTypesEnum.STRING
        }
    }
}

/**
 * Приведение элемента из старого формата в новый
 * @param elements   - массив всех элементов конфига
 * @param element    - текущий модифицируемый элемент
 */
export const convertElement = (elements: ClassicFormElementClass[],
                               element: ClassicFormElementClass
): StatisticsFormElementClass => {
    const {
        key: elementKey,
        name: elementName,
        primaryKey,
        is_extendable = false,
        req_id,
        struct_type_id
    } = element

    const {
        key: reqKey,
        name: reqName,
        type_id: {
            key: typeId
        } = {},
        dict_id
    } = req_id || {}

    const {
        key: elementType
    } = struct_type_id || {}

    const {
        key: dictKey
    } = dict_id || {}

    // формирование конфига показателя для элемента нового формата на основании данных старого формата
    let name, code, config
    switch (elementType) {
        case ElementTypeEnum.BLOCK:
        case ElementTypeEnum.BLOCK_2: {
            name = elementName
            code = elementKey.toString()

            // выборка дочерних элементов для текущего блока
            let childrenElements = elements
                .filter((el: ClassicFormElementClass) => el.parentKey === primaryKey)
                .filter((el: ClassicFormElementClass) => !!el.is_visible)
                .map(el => convertElement(elements, el))

            // формирование формы для отображения, она состоит просто из дочерних элементов
            const objectFormConfig = [{
                id: '1',                                             // айди формы произвольно
                name: 'Автоформа',                                   // наименование формы (в данном случае нужно только для отладки)
                type: FormConfigComponentTypeEnum.EMBEDDED_FORM,     // тип формы
                enabled: true,                                       // флаг что форма включена
                config: {                                            // конфиг формы сбора
                    elements: childrenElements
                } as StatisticsFormConfig
            } as FormConfigComponentType
            ]

            // формирование конфига, блок в старом формате соответсвует показателю с типом объект в новом формате
            config = {
                required: false,
                multivalued: !!is_extendable,
                typeId: EntityAttrTypes.PLAIN,
                valueTypeId: EntityAttrValTypesEnum.OBJECT,
                entityFormConfigComponents: objectFormConfig
            }

            break;
        }
        case ElementTypeEnum.REQ:
        default: {
            name = reqName
            code = (reqKey || elementKey).toString()

            // определение типов для реквизита и его значения
            let reqTypeId
            let valueTypeId
            let entityCode
            let viewType
            if (typeId === ReqTypeEnum.DICT) {
                reqTypeId = EntityAttrTypes.REF
                valueTypeId = EntityAttrValTypesEnum.INTEGER // для реквизитов-справочников устанавливается тип Integer (все справочники в системе-источнике имеют целочисленные ключи)
                entityCode = dictKey
                viewType = RefViewTypes.DROPDOWN
            } else {
                reqTypeId = EntityAttrTypes.PLAIN
                valueTypeId = getType(typeId)
            }

            // индикатор (реквизит) в старом формате соответсвует показателю с соответствующим типом в новом формате
            config = {
                required: false,
                multivalued: !!is_extendable,
                typeId: reqTypeId,
                valueTypeId: valueTypeId,
                entityCode,
                viewType
            }
        }
    }

    // формирование показателя для элемента нового формата
    const indicator = new StatisticsIndicatorClass(name, code, '', '', false, config)

    // формирование элемента нового формата
    const result = new StatisticsFormElementClass(undefined, DraggableElements.INDICATOR, undefined, indicator)
    return result
}

/**
 * Приведение типов конфига из старого формата в новый
 * @param config
 */
export const modifyConfig = (config: ClassicFormClass): StatisticsFormConfig => {
    const {elements = [] as ClassicFormElementClass[]} = config

    // выборка родительских элементов (не имеющих родителя)
    const topElements: StatisticsFormElementClass[] = elements
        .filter((el: ClassicFormElementClass) => !el.parentKey)
        .filter((el: ClassicFormElementClass) => !!el.is_visible)
        .map(el => convertElement(elements, el))

    const result = new StatisticsFormConfig(topElements)
    return result
}
