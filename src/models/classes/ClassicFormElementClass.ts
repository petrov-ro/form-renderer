

/**
 * Типы элементов
 */
export enum ElementTypeEnum {
    REQ = 71127123,      // реквизит
    SECTION = 71169432,  // Раздел
    BLOCK = 71169431,    // Заголовок
    BLOCK_2 = 71127103   // Группа реквизитов
}

/**
 * Типы реквизитов
 */
export enum ReqTypeEnum {
    STRING = 70138456,      // строка
    BOOLEAN = 101549694,    // логический
    INTEGER = 70138454,     // целое число
    NUMBER  = 101549693,    // число
    FLOAT = 100865912,      // дробное
    DATE = 70138458,        // дата
    TIME = 70872951,        // время
    DATETIME = 99186942,    // дата-время
    FILE = 100973182,       // файл
    DICT = 34213061,        // справочник
    FIASADR = 101199982,    // адрес ФИАС
    ANY  = 101549692        // any reference
};

/**
 * Тип элемента из метаданных формы
 */
export type ClassicFormElementClass = {
    __typename?: string
    name: string                    // наименование элемента
    ord: number                     // порядок расположения элемента
    key: number                     // ключ элемента (общий ключ для всех версий)
    primaryKey: number              // первичный ключ записи элемента
    parentKey: number | null        // ключ родителя
    uniqueId?: string               // уникальный идентификатор элемента, пример "600000018_1:101903394_3:101898568",
    gui?: {

    } | null
    req_id: {                       // атрибуты элемента-реквизита (для других элементов значение null)
        key: number
        name: string                // наименование реквизита, пример: "5.6 дополнительная характеристика выявленных однотипных нарушений законодательства"
        max_value?: number | null
        min_value?: number | null
        max_length?: number | null
        precision?: number | null
        multi_line?: boolean
        mask_id?: {                 // маска реквизита
            "key": number,
            "mask_name": string     // "Дата (ДД.ММ.ГГГГ)"
            "name": string          // "dd.MM.yyyy"
        } | null
        dict_id: {                  // данные справочника, если реквизит справочный
            name: string            // название справочника
            key: number             // ключ справочника
            __typename?: string
        } | null,
        type_id: {                  // данные реквизита
            key: ReqTypeEnum        // ключ типа
            name_2: string          // название типа
            __typename?: string
        },
        __typename?: string
    } | null
    is_visible: number              // видимость элемента на форме
    is_extendable: number           // многозначный (массив элементов)
    code: string                    // код элемента
    struct_type_id: {
        key: ElementTypeEnum        // тип элемента
        name?: string
        __typename?: string
    }
    version_id?: {
        primaryKey: number
        key: number
        version: number
        __typename?: string
    }
    t_600000096?: any[]              // TODO уточнить тип
}

/**
 * Тип метаданных формы
 */
export type ClassicFormClass = {
    key: number
    name: string
    ord?: number | null
    inDate?: string | null
    outDate?: string | null
    load_from?: string | null
    load_to?: string | null
    version?: number | null
    t_600000270?: {
        "name": string
        "short_name": string
        "key": number
    } | null,
    elements?: ClassicFormElementClass[]        // атрибут содержит элементы конфига
    t_600000018?: ClassicFormElementClass[]     // атрибут содержит элементы конфига (новая версия), если заполнено будет перенесено в elements
}
