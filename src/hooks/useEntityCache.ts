import {useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {setEntity} from "../redux/actions/entities";
import {getJSON} from "../services/AbstractService";
import {getEntityURL} from "./useEntity";
import usePrevious from "./usePrevious";
import {objectCompare} from "../utils/objectUtils";
import {EntityClass} from "../models/classes/EntityClass";

/**
 * Получение информации о сущности и сохранение её в сторе
 * @param dicts - конфиги элементов ссылочного типа
 */
const useEntityCache = (dicts: Record<string, any>) => {
    const prevDicts = usePrevious(dicts)
    const dispatch = useDispatch()

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
            putEntityToStore(entityCode, undefined, true)

            // генерация url для получения сущности
            const url = getEntityURL(entityCode)

            // получение данных
            getJSON(url)
                .then(entity => {
                    if (!isMounted) {
                        return
                    }

                    // добавление сущности в стор
                    putEntityToStore(entityCode, entity, false)
                })
        })

        return () => {
            isMounted = false
        }
    }, [dicts])
}

export default useEntityCache
