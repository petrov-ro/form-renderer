import React, {Key, useEffect, useState} from "react";
import {TreeSelect as TreeSelectAnt} from "antd";
import {TreeSelectProps as TreeSelectAntProps} from "antd";
import {entityDataGridType} from "@/constants/GridTypes";
import {
    API,
    DATA_SYSTEM_KEY, DICT_PARENT_KEY,
    DICT_VALUE_LABEL,
    DICT_VALUE_PROP,
    SYS_DATA,
    SYS_DATA_TITLE_ATTR
} from "../../constants/Constants";
import {dictData} from "../../services/DictService";
import {treeNode} from "../../hooks/useGridData";
import {EntityTreeDataClass} from "../../models/classes/EntityDataClass";

export interface TreeSelectProps extends TreeSelectAntProps {
    fetch: (url: string, params: Record<string, any>) => Promise<Response>   // адрес для вызова процедур
    apiPath: string                         // адрес для вызова процедур
    dictCode: string                        // код справочника (сущности)
    dictDate?: string                       // дата на которую отображается состояние справочников (в формате YYYY-MM-DD)
    dictClosed?: boolean                    // полказывать закрытые записи справочников
    value?: Key | Key[]                     // начальное значение
    onChange?: (val: Key | Key[]) => void   // колбек изменения атрибута
}

interface DataNode {
    label: string;
    value: TreeSelectAntProps['value'];
    isLeaf?: boolean;
    children?: DataNode[];
}

/**
 *
 * @param list
 * @param key
 * @param children
 */
const updateTreeData = (list: DataNode[], value: React.Key, children: DataNode[]): DataNode[] =>
    list.map((node) => {
        if (node.value === value) {
            return {
                ...node,
                children,
            };
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, value, children),
            };
        }
        return node;
    });

/**
 * Компонент отображения дерева
 *
 * @param props
 * @constructor
 */
const TreeSelect: React.FC<TreeSelectProps> = props => {
    const {
        dictCode, dictDate, dictClosed = false,
        value: initialValue, onChange,
        apiPath, fetch,
        ...rest
    } = props;

    // установка адреса апи
    API.REACT_APP_API_URL = apiPath
    API.fetch = fetch as any

    const [value, setValue] = useState(initialValue)
    const [treeData, setTreeData] = useState<DataNode[]>([]);

    // формирование типа грида
    const gridType = entityDataGridType(dictCode, undefined, [DATA_SYSTEM_KEY, DICT_VALUE_PROP, `${SYS_DATA}.${SYS_DATA_TITLE_ATTR}`, DICT_VALUE_LABEL, DICT_PARENT_KEY])
    const gridTypeKeys = {
        ...gridType,
        labelKey: DICT_VALUE_LABEL,
        valueKey: DICT_VALUE_PROP
    }

    const onLoadData = ({ key, children }: any) =>
        new Promise<void>(resolve => {
            if (children) {
                resolve();
                return;
            }

            dictData({pageSize: 1000, parentAttr: 'parentKey', parentId: key, isTree: true}, gridTypeKeys, dictDate, dictClosed)
                .then((data: any[]) => {
                    if (data) {
                        const {valueKey, labelKey} = gridTypeKeys

                        const options = data
                            .map(d => treeNode<DataNode, EntityTreeDataClass>(d, valueKey, labelKey))

                        setTreeData(key ? (origin) =>
                            updateTreeData(origin, key, options) : options
                        );
                    }
                })
                .catch(console.log)
                .finally(() => resolve(undefined))
        });

    // первичная загрузка узлов верхнего уровня
    useEffect(() => {
        onLoadData({})
    }, [])

    /**
     * Выбор элемента выпадающего списка
     * @param newVal - новое значение
     */
    const onChangeValues = (value: Key | Key[]) => {
        setValue(value)
        onChange?.(value)
    }

    return (
        <>
            <TreeSelectAnt
                value={value}
                treeNodeFilterProp={'label'} filterTreeNode
                onChange={onChange}
                loadData={onLoadData}
                treeData={treeData}
                onSelect={onChangeValues}
                fieldNames={{ label: 'label', value: 'value', children: 'children' }}
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Выберите"
                {...rest}
            />
        </>
    );
}

export default React.memo(TreeSelect)
