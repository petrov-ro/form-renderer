import {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {getTableDataOnly} from "../services/GridService";
import {setDict as storeDict} from "../redux/actions/dicts";
import {entityDataGridType} from "../constants/GridTypes";
import {DATA_SYSTEM_KEY, DICT_VALUE_PROP, SYS_DATA, SYS_DATA_TITLE_ATTR} from "../constants/Constants";
import {flatNode, treeNode} from "./useGridData";
import usePrevious from "./usePrevious";
import {objectCompare} from "../utils/objectUtils";

/**
 * Получение данных сущности и сохранение их в сторе
 * @param dicts - конфиги элементов ссылочного типа
 */
const useDictCache = (dicts: Record<string, any>) => {
    const [current] = useState(1)       // номер страницы до которой нужно загрузить данные
    const [pageSize] = useState(1000)   // количество подгружаемых данных
    const prevDicts = usePrevious(dicts)
    const dispatch = useDispatch()

    // получение данных сохраненных ранее
    const savedEntity = useSelector((state: Record<string, any>) => {
        return state.entities
    }) || {}
    const prevSavedEntity = usePrevious(savedEntity)

    useEffect(() => {
        if (objectCompare(dicts, prevDicts) && objectCompare(savedEntity, prevSavedEntity)) {
            return
        }

        let isMounted = true

        Object.keys(dicts).forEach(key => {
            const config = dicts[key]

            // код справочника в сторе
            const dictName = key
            const setDict = (data: any[], loading: boolean) => dispatch(storeDict(dictName, {config, data, loading}));

            // из конфига элемента вытаскивается код сущности
            const {entityCode} = config || {}

            // получение сущности из стора
            const entity = savedEntity[entityCode]
            if (!entity) {
                return // если сущность еще не подгружена, то справочник не может быть получен
            }

            // формирование типа грида
            const gridType = entityDataGridType(entityCode, undefined, [DATA_SYSTEM_KEY, DICT_VALUE_PROP, `${SYS_DATA}.${SYS_DATA_TITLE_ATTR}`, 'name'])
            const gridTypeKeys = {
                ...gridType,
                labelKey: 'name',
                valueKey: DICT_VALUE_PROP
            }

            getTableDataOnly({current, pageSize}, undefined, undefined, entity, gridTypeKeys)
                .then((response: { data?: any[], success?: boolean }) => {
                    if (!isMounted) {
                        return
                    }

                    const {success, data} = response
                    if (success && data) {
                        const {valueKey, labelKey, isTree} = gridType

                        const options = data
                            .map(d => isTree ? treeNode(d, valueKey, labelKey) : flatNode(d, valueKey, labelKey))

                        /*                      options.sort(({label: a = ''}, {label: b = ''}) =>
                                                  a && b && a.toString().toLowerCase() >= b.toString().toLowerCase() ? 1 : -1
                                              )*/
                        setDict(options || [], false)
                    } else {
                        setDict([], false)
                    }
                })
        })

        return () => {
            isMounted = false
        }
    }, [dicts, savedEntity])
}

export default useDictCache
