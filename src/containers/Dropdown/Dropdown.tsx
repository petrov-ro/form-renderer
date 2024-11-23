import React, {Key, useState} from "react";
import {Select, Spin} from "@gp-frontend-lib/ui-kit-5";
import {SelectProps as SelectProps} from "antd";
import {BaseOptionType} from "antd/es/select";
import {dictOptionRender} from "@/utils/optionDataHelper";
import useDict, {resultType} from "../../hooks/useDict";
import {API} from "../../constants/Constants";

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
const Dropdown: React.FC<DropdownProps> = React.forwardRef((props, ref) => {
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
        const [current] = useState(1)         // номер страницы до которой нужно загрузить данные
        const [pageSize] = useState(1000)     // количество подгружаемых данных
        const [search, setSearch] = useState<string>()  // искомое значение
        const [result, setResult] = useState({data: [] as resultType[], loading: true})

        const {data: dictData, loading: dictLoading} = useDict(dictCode, dictDate, dictClosed,
            current, pageSize, result, setResult, search)

        /**
         * Выбор элемента выпадающего списка
         * @param newVal - новое значение
         */
        const onChangeValues = (newVal: Key | Key[]) => {
            setValue(newVal)
            setSearch(undefined)
            onChange?.(newVal)
        }

        // настройки поиска в зависимости от размера справочника
        let searchConfig;
        if (search || dictData.length > (pageSize - 1)) {
            searchConfig = {
                onSearch: setSearch,
                filterOption: false
            }
        } else {
            searchConfig = {
                onSearch: undefined,
                optionFilterProp: 'label'
            }
        }

        return (
            <>
                <Select
                    ref={ref}
                    showSearch allowClear={true} loading={dictLoading}
                    optionLabelProp='label'
                    options={dictData} value={value}
                    onChange={onChangeValues}
                    optionRender={dictOptionRender}
                    notFoundContent={dictLoading ? <Spin size="small" style={{width: '100%'}}/> : undefined}
                    {...searchConfig}
                    {...rest}
                />
            </>
        )
    }
)

export default React.memo(Dropdown)
