import {useEffect, useState} from "react";
import {entityDataGridType} from "../constants/GridTypes";
import {
    DATA_SYSTEM_KEY,
    DICT_VALUE_LABEL,
    DICT_VALUE_PROP,
    IS_UNSELECTABLE,
    SYS_DATA,
    SYS_DATA_TITLE_ATTR
} from "../constants/Constants";
import {flatNode, treeNode} from "./useGridData";
import {getEntityURL} from "./useEntity";
import {getJSON} from "@/services/AbstractService";
import {dictData} from "@/services/DictService";
import OptionData from "@/models/types/OptionData";

type resultType<T = any> = OptionData<T> & { item?: T }

type useDictProps<T = any> = {
    loading: boolean;
    data: resultType<T>[];
}

/**
 * Получение данных справочника (сущности)
 * @param entityCode   - код справочника (сущности)
 * @param dictDate     - дата на которую нужно отобразить справочник в формате YYYY-MM-DD
 * @param viewClosed   - флаг отображение последних актуальных версий для закрытых записей
 */
const useDict = <T>(entityCode: string, dictDate?: string, viewClosed?: boolean): useDictProps<T> => {
    const [current] = useState(1)       // номер страницы до которой нужно загрузить данные
    const [pageSize] = useState(1000)   // количество подгружаемых данных

    const [result, setResult] = useState({data: [] as resultType<T>[], loading: true})

    useEffect(() => {
        let isMounted = true

        // генерация url для получения сущности
        const url = getEntityURL(entityCode)

        // получение данных
        getJSON(url)
            .then(entity => {
                // добавление сущности в стор
                // putEntityToStore(entityCode, entity, false)
                return entity
            })
            .then(entity => {
                // формирование типа грида
                const gridType = entityDataGridType(entityCode, undefined, [
                    DATA_SYSTEM_KEY,
                    DICT_VALUE_PROP,
                    IS_UNSELECTABLE,
                    `${SYS_DATA}.${SYS_DATA_TITLE_ATTR}`,
                    DICT_VALUE_LABEL
                ])
                const gridTypeKeys = {
                    ...gridType,
                    labelKey: DICT_VALUE_LABEL,
                    valueKey: DICT_VALUE_PROP
                }

                dictData({current, pageSize}, gridTypeKeys, dictDate, viewClosed)
                    .then((data: Record<string, any>[]) => {
                        if (data) {
                            const {valueKey, labelKey, isTree} = gridTypeKeys

                            const options = data
                                .map((d: Record<string, any>) => isTree ? treeNode(d, valueKey, labelKey) : flatNode(d, valueKey, labelKey))

                            /*                      options.sort(({label: a = ''}, {label: b = ''}) =>
                                                      a && b && a.toString().toLowerCase() >= b.toString().toLowerCase() ? 1 : -1
                                                  )*/
                            setResult({data: options as resultType<T>[] || [], loading: false})
                        } else {
                            setResult({data: [], loading: false})
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        setResult({data: [], loading: false})
                    })
            })
            .catch(err => {
                console.log(err)
                setResult({data: [], loading: false})
            })

        return () => {
            isMounted = false
        }
    }, [entityCode, dictDate, viewClosed])

    return result
}

export default useDict
