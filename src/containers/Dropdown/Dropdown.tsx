import React, {Key, useState} from "react";
import {Select} from "@gp-frontend-lib/ui-kit-5";
import {SelectProps as SelectProps} from "antd";
import {BaseOptionType} from "antd/es/select";
import useDict from "../../hooks/useDict";
import {API} from "../../constants/Constants";
import {dictOptionRender} from "@/utils/optionDataHelper";

export interface DropdownProps extends SelectProps {
    fetch: (url: string, params: Record<string, any>) => Promise<Response>   // адрес для вызова процедур
    apiPath: string                         // адрес для вызова процедур
    dictCode: string                        // код справочника (сущности)
    dictDate?: string                       // дата на которую отображается состояние справочников (в формате YYYY-MM-DD)
    dictClosed?: boolean                    // полказывать закрытые записи справочников
    value?: Key | Key[]                     // начальное значение
    onChange?: (val: Key | Key[]) => void   // колбек изменения атрибута
}

/**
 * Компонент отображения дропдауна для записей сущности на форме
 *
 * @param props
 * @constructor
 */
const Dropdown: React.FC<DropdownProps> = props => {
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

    const {data: dictData, loading: dictLoading} = useDict(dictCode, dictDate, dictClosed)

    /**
     * Выбор элемента выпадающего списка
     * @param newVal - новое значение
     */
    const onChangeValues = (newVal: Key | Key[]) => {
        setValue(newVal)
        onChange?.(newVal)
    }

    return (
        <>
            <Select
                showSearch allowClear={true} loading={dictLoading}
                optionLabelProp='label' optionFilterProp='label'
                options={dictData} value={value}
                onChange={onChangeValues}
                optionRender={dictOptionRender}
                {...rest}
            />
        </>
    )
}

export default React.memo(Dropdown)
