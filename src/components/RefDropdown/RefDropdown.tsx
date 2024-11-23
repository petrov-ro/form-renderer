import React, {Key, useState} from "react";
import {Select} from "@gp-frontend-lib/ui-kit-5";
import {useSelector} from "react-redux";
import {BaseOptionType} from "antd/es/select";
import {dictOptionRender} from "@/utils/optionDataHelper";
import Dropdown from "../../containers/Dropdown/Dropdown";
import {API} from "../../constants/Constants";
import {FormFieldProps} from "../../models/types/FormFieldProps";
import RefDropdownEmbeddedForm from "../../components/RefDropdown/RefDropdownEmbeddedForm/RefDropdownEmbeddedForm";

type RefDropdownProps = Partial<FormFieldProps<Key | Key[]>> & {
    multivalued?: boolean   // флаг возможности множественного выбора
    label: string           // наименование сущности
    code: string            // код сущности для отображения записей
    disabled?: boolean      // отключить редактирование
    viewTypeForm?: string   // идентификатор формы для отображения записи
    loading?: boolean
    exclude?: string[]      // массив системных идентификторов, которые нельзя выбрать
}

/**
 * Компонент отображения дропдауна для записей сущности на форме
 *
 * @param props
 * @constructor
 */
const RefDropdown: React.FC<RefDropdownProps> = React.forwardRef(
    (props, ref) => {
        const {
            code, id, value: initialValue, onChange, label, multivalued, loading, disabled, viewTypeForm
        } = props;

        const [value, setValue] = useState(initialValue)

        // получение сущности из стора
        const {data: entity} = useSelector((state: Record<string, any>) => {
            return state.entities?.[code]
        }) || {}

        // получение данных выпадающего списка из стора
        const {data: dictData = [], loading: dictLoading} = useSelector((state: Record<string, any>) => {
            return state.dicts?.[code]
        }) || {}

        /**
         * Выбор элемента выпадающего списка
         * @param newVal - новое значение
         */
        const onChangeValues = (newVal: Key | Key[]) => {
            setValue(newVal)
            onChange?.(newVal)
        }

        const mode = multivalued ? "multiple" : undefined

        const isData = dictData && dictData.length > 0

        return (
            <>
                {value && !Array.isArray(value) && entity && viewTypeForm && !multivalued &&
                <RefDropdownEmbeddedForm viewTypeForm={viewTypeForm} entity={entity} id={value}/>
                }

                {!isData &&
                <Dropdown
                    id={id}
                    disabled={disabled}
                    mode={mode}
                    optionRender={dictOptionRender}
                    value={value} onChange={onChangeValues}
                    dictCode={code} apiPath={API.REACT_APP_API_URL} fetch={API.fetch}
                />
                }

                {isData &&
                <Select
                    id={id}
                    showSearch allowClear={true} loading={loading || dictLoading} disabled={disabled}
                    optionLabelProp='label' optionFilterProp='label'
                    options={dictData} value={value}
                    mode={mode}
                    onChange={onChangeValues}
                    optionRender={dictOptionRender}
                />
                }
            </>
        );
    }
)

export default React.memo(RefDropdown)
