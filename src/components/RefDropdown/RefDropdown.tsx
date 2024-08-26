import React, {Key, useState} from "react";
import {Select} from "@gp-frontend-lib/ui-kit-5";
import {FormFieldProps} from "../../models/types/FormFieldProps";
import RefDropdownEmbeddedForm from "../../components/RefDropdown/RefDropdownEmbeddedForm/RefDropdownEmbeddedForm";
import {useSelector} from "react-redux";

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
const RefDropdown: React.FC<RefDropdownProps> = props => {
  const {
    code, value: initialValue, onChange, label, multivalued, loading, disabled, viewTypeForm
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

  return (
    <>
      {value && !Array.isArray(value) && entity && viewTypeForm && !multivalued &&
      <RefDropdownEmbeddedForm viewTypeForm={viewTypeForm} entity={entity} id={value}/>
      }

      <Select
        showSearch allowClear={true} loading={loading || dictLoading} disabled={disabled}
        optionLabelProp='label' optionFilterProp='label'
        options={dictData} value={value}
        mode={mode}
        onChange={onChangeValues}
      />
    </>
  );
}

export default React.memo(RefDropdown)
