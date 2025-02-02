import {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {getTableDataOnly} from "../services/GridService";
import {setDict as storeDict} from "../redux/actions/dicts";
import {entityDataGridType} from "../constants/GridTypes";
import {CODE, DATA_SYSTEM_KEY, DICT_VALUE_PROP, IS_UNSELECTABLE, SYS_DATA, SYS_DATA_TITLE_ATTR} from "../constants/Constants";
import {flatNode, treeNode} from "./useGridData";

/**
 * Получение данных сущности и сохранение их в сторе
 * @param dicts - конфиги элементов ссылочного типа
 */
const useDictCache = (dicts: Record<string, any>) => {
    const [current] = useState(1)       // номер страницы до которой нужно загрузить данные
    const [pageSize] = useState(1000)   // количество подгружаемых данных
    const dispatch = useDispatch()

    const setDict = (dictName: string, config: any, data: any[], loading: boolean) => {
        dispatch(storeDict(dictName, {config, data, loading}));
    }

    // получение данных сохраненных ранее
    const savedEntity = useSelector((state: Record<string, any>) => {
        return state.entities
    }) || {}

    // получение данных словарей сохраненных ранее
    const savedDicts = useSelector((state: Record<string, any>) => {
        return state.dicts
    }) || {}

    useEffect(() => {
        let isMounted = true

        Object.keys(dicts).forEach(key => {
            const config = dicts[key]

            // из конфига элемента вытаскивается код сущности
            const {entityCode} = config || {}

            // получение сущности из стора
            const entity = savedEntity[entityCode]
            if (!entity) {
                return // если сущность еще не подгружена, то справочник не может быть получен
            }

            // код справочника в сторе
            const dictName = key

            // если данные справочника есть в сторе либо он загружается, то он не загружается повторно
            const {data, loading} = savedDicts[dictName] || {}
            if ((data?.length > 0) || loading) {
                return
            }

            // если справочника нет в сторе, то устанавливается флаг его загруки
            setDict(dictName, config, data, true)

            // формирование типа грида
            const gridType = entityDataGridType(entityCode, undefined,
                [
                    DATA_SYSTEM_KEY,
                    DICT_VALUE_PROP,
                    IS_UNSELECTABLE,
                    CODE,
                    `${SYS_DATA}.${SYS_DATA_TITLE_ATTR}`,
                    'name'
                ]
            )
            const gridTypeKeys = {
                ...gridType,
                labelKey: 'name',
                valueKey: DICT_VALUE_PROP
            }

            getTableDataOnly({current, pageSize}, undefined, undefined, entity, gridTypeKeys)
                .then((response: { data?: any[], success?: boolean }) => {
                    const {success, data} = response
                    if (success && data) {
                        const {valueKey, labelKey, isTree} = gridType

                        const options = data
                            .map(d => isTree ? treeNode(d, valueKey, labelKey) : flatNode(d, valueKey, labelKey))

                        /*                      options.sort(({label: a = ''}, {label: b = ''}) =>
                                                  a && b && a.toString().toLowerCase() >= b.toString().toLowerCase() ? 1 : -1
                                              )*/
                        setDict(dictName, config, options || [], false)
                    } else {
                        setDict(dictName, config, [], true) // TODO Loading false! write error
                    }
                })
                .catch(err => {
                    console.log(err)
                    setDict(dictName, config, [], true) // TODO Loading false! write error
                })
        })

        return () => {
            isMounted = false
        }
    }, [dicts, savedEntity])
}

export default useDictCache
