import {useEffect, useState} from "react";
import OptionData from "../models/types/OptionData";
import {getTableData, GridParamType} from "../services/GridService";
import {GridType} from "../models/types/GridType";
import usePrevious from "../hooks/usePrevious";
import {objectCompare} from "../utils/objectUtils";
import {EntityTreeDataClass} from "../models/classes/EntityDataClass";
import _ from "lodash";

type ResultProps<T> = {
  loading: boolean;
  result: T[];
}

/**
 * Формирует запись древоводиного справочника категорий и сущностей (либо показателей форм сбора и их категорий)
 * @param d - категория или сущность (показатель или категория показателя)
 */
export const treeNode = <T, P extends Partial<EntityTreeDataClass>>(
    d: P,
    valueKey: string | string[] = 'id',
    labelKey: string | string[] = 'title'
): T => ({
  label: _.get(d, labelKey),
  value: _.get(d, valueKey),
  item: d
} as T)

/**
 * Формирует запись плоского справочника
 * @param d -
 * @param valueKey
 * @param labelKey
 */
export const flatNode = <T, P>(d: P, valueKey: string | string[] = 'id', labelKey: string | string[] = 'name'): T => ({
  label: _.get(d, labelKey) || _.get(d, 'title'),
  value: _.get(d, valueKey) || _.get(d, 'id'),
  item: d
} as T)

const defaultGridParams: GridParamType = {}

export type useGridDataType = OptionData & { children?: [], leaf?: boolean }

const useGridData = <T extends OptionData = useGridDataType, P extends Record<string, any> = any>(
  type: GridType,
  props: GridParamType = defaultGridParams,
  require?: string[]
): ResultProps<T> => {
  const {valueKey, labelKey, isTree} = type
  const [result, setResult] = useState({result: [] as T[], loading: true})
  const preProps = usePrevious(props)

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      getTableData<P>(props, undefined, undefined, type)
        .then((response: { data?: P[], success?: boolean }) => {
          const {success, data} = response
          if (success && data) {
            const options: T[] = data
              .map((d: P) => isTree ? treeNode<T, P>(d, valueKey, labelKey) : flatNode<T, P>(d, valueKey, labelKey))

            options.sort(({label: a = ''}, {label: b = ''}) =>
              a && b && a.toString().toLowerCase() >= b.toString().toLowerCase() ? 1 : -1
            )

            setResult({result: options || [], loading: false})
          } else {
            setResult({result: [], loading: false})
          }
        })
        .catch((e: Error) => {
          if (isMounted) {
            setResult({result: [], loading: false})
          }
        })
    }

    if (!objectCompare(props, preProps)) {
      if ((require || []).every(p => props[p])) {
        // if (type.reload) {
        fetchData();
        // }
      }
    }

    return () => {
      isMounted = false
    };
  }, [props]);

  return result
}

export default useGridData
