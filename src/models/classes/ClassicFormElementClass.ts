

/**
 * Типы элементов
 */
export enum ElementTypeEnum {
    REQ = 71127123,      // реквизит
    BLOCK = 71169431,    // блок
    BLOCK_2 = 71127103   // тоже блок TODO Уточнить разницу
}


/**
 * Типы реквизитов
 */
export enum ReqTypeEnum {
    STRING = 70138456,      // строка
    INTEGER = 70138454,     // целое число
    DATE = 70138458,        // дата
    DICT = 34213061         // справочник
};

/**
 * Тип элемента из метаданных формы
 */
export type ClassicFormElementClass = {
    __typename: string
    name: string                    // наименование элемента
    ord: number                     // порядок расположения элемента
    key: number                     // ключ элемента
    primaryKey: number              // ключ элемента
    parentKey: number | null        // ключ родителя
    uniqueId: string                // уникальный идентификатор элемента, пример "600000018_1:101903394_3:101898568",
    req_id: {                       // атрибуты элемента-реквизита (для других элементов значение null)
        key: number
        name: string                // наименование реквизита, пример: "5.6 дополнительная характеристика выявленных однотипных нарушений законодательства"
        dict_id: {                  // данные справочника, если реквизит справочный
            name: string            // название справочника
            key: number             // ключ справочника
            __typename: string
        } | null,
        type_id: {                  // данные реквизита
            key: ReqTypeEnum        // ключ типа
            name_2: string          // название типа
            __typename: string
        },
        __typename: string
    } | null
    is_visible: number              // видимость элемента на форме
    is_extendable: number           // многозначный (массив элементов)
    code: string                    // код элемента
    struct_type_id: {
        key: ElementTypeEnum        // тип элемента
        __typename: string
    }
    version_id: {
        primaryKey: number
        key: number
        version: number
        __typename: string
    }
    t_600000096: any[]              // TODO уточнить тип
}

/**
 * Тип элемента из метаданных формы
 */
export type ClassicFormClass = {
    key: number
    name: string
    elements?: ClassicFormElementClass[]        // атрибут содержит элементы конфига
    t_600000018?: ClassicFormElementClass[]     // атрибут содержит элементы конфига (новая версия), если заполнено будет перенесено в elements
}
