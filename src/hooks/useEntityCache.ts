import {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {setEntity} from "../redux/actions/entities";
import {getJSON} from "../services/AbstractService";
import {getEntityURL} from "./useEntity";
import {EntityClass} from "../models/classes/EntityClass";
import {entityDataGridType} from "../constants/GridTypes";
import {DATA_SYSTEM_KEY, DICT_VALUE_PROP, SYS_DATA, SYS_DATA_TITLE_ATTR} from "../constants/Constants";
import {getTableDataOnly} from "../services/GridService";
import {flatNode, treeNode} from "./useGridData";
import usePrevious from "./usePrevious";
import {objectCompare} from "../utils/objectUtils";
import {setDict as storeDict} from "../redux/actions/dicts";

/**
 * Получение информации о сущности и сохранение её в сторе
 * @param dicts - конфиги элементов ссылочного типа
 */
const useEntityCache = (dicts: Record<string, any>) => {
    const [current] = useState(1)       // номер страницы до которой нужно загрузить данные
    const [pageSize] = useState(1000)   // количество подгружаемых данных
    const dispatch = useDispatch()
    const prevDicts = usePrevious(dicts)

    const setDict = (dictName: string, config: any, data: any[], loading: boolean) => {
        dispatch(storeDict(dictName, {config, data, loading}));
    }

    const putEntityToStore = (entityName: string, entity: EntityClass | undefined, loading: boolean) => dispatch(setEntity(entityName, entity, loading));

    // получение данных сохраненных ранее
    const savedEntity = useSelector((state: Record<string, any>) => {
        return state.entities
    }) || {}

    useEffect(() => {
        if (objectCompare(dicts, prevDicts)) {
            return
        }

        let isMounted = true

        Object.keys(dicts).forEach(key => {
            const config = dicts[key]

            // из конфига элемента вытаскивается код сущности
            const {entityCode} = config || {}

            // если справочник есть в сторе, то он не загружается повторно
            if (savedEntity[entityCode]) {
                return
            }

            // добавление сущности в стор c флагом загрузки
            //putEntityToStore(entityCode, undefined, true)

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
                    const gridType = entityDataGridType(entityCode, undefined, [DATA_SYSTEM_KEY, DICT_VALUE_PROP, `${SYS_DATA}.${SYS_DATA_TITLE_ATTR}`, 'name'])
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
                                setDict(entityCode, config, options || [], false)
                            } else {
                                setDict(entityCode, config, [], false) // TODO Loading false! write error
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            setDict(entityCode, config, [], false) // TODO Loading false! write error
                        })
                })
                .catch(err => {
                    console.log(err)
                    //putEntityToStore(entityCode, undefined, false) // TODO loading = false обработка ошибок!
                })

        })

        return () => {
            isMounted = false
        }
    }, [dicts])
}

export default useEntityCache
