export let API = {
    REACT_APP_API_URL: '1.1.1.1',
    fetch: (url: string, params: Record<string, any>) => Promise.reject('Не задан метод получения данных')
}
export const ENTRIES_ON_PAGE = 100

export const DATE_FORMAT = 'DD.MM.YYYY'
export const TIME_FORMAT = 'HH:mm:ss'
export const DATE_TIME_FORMAT = 'DD.MM.YYYY HH:mm:ss'

export const BACK_DATE_FORMAT = 'YYYY-MM-DD'
export const BACK_TIME_FORMAT = 'HH:mm:ss.SSSZ'
export const BACK_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'


export const MDM_STORAGE_KEY = 'MDM'
export const MODEL_STORAGE_KEY = 'model'

export const exactPostfix = `-exact-value$$`               // постфикс для формирования  имени служебного параметра
export const exact = (p: string) => `${p}${exactPostfix}`  // флаг поиска по точному соответствию

export const gridMultivalueDelimeter = '; '
export const gridSearchParamArrayDelimeter = '|'

export const DATA_SYSTEM_KEY = '_id'
export const SYS_DATA = '_sysData'
export const FT_SEARCH_GRID_ATTR = '_sysData_ftSearch'
export const SYS_DATA_TITLE_ATTR = 'title'
export const EXCEPTION_COLLECTION = '_deduplicate_exceptions'
export const SECURITY_LOG_TABLE = 'log.security'
export const ADMINISTRATOR_SYSTEM_ROLE = 'ADMINISTRATOR_SYSTEM'
export const CHILDREN_NUMBER = 'childrenNumber'   // количество дочерних к этому документу в гриде (вычисляемое, не сохраняется)
export const ENTITY_CODE = 'entityCode'           // код сущности к которой относится запись (вычисляемое, не сохраняется)

export const BASE_COLOR_BLUE = '#40a9ff'
