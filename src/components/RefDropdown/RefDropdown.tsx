import React, {Key, useEffect, useState} from "react";
import {Select} from "antd";
import {FormFieldProps} from "../../models/types/FormFieldProps";
import useEntity from "../../hooks/useEntity";
import {DATA_SYSTEM_KEY, SYS_DATA, SYS_DATA_TITLE_ATTR} from "../../constants/Constants";
import {entityDataGridType} from "../../constants/GridTypes";
import useGridData from "../../hooks/useGridData";
import OptionData from "../../models/types/OptionData";
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
const RefDropdown: React.FC<RefDropdownProps> = props => {
  const {
    code, value: initialValue, onChange, label, multivalued, loading: initialLoading, disabled, viewTypeForm
  } = props;

  const [current, setCurrent] = useState(1)       // номер страницы до которой нужно загрузить данные
  const [pageSize, setPageSize] = useState(1000)  // количество подгружаемых данных
  const [loading, setLoading] = useState(initialLoading)
  const [value, setValue] = useState(initialValue)
  const [dictData, setDictData] = useState([] as OptionData[])
  const {entity} = useEntity(code)

  // формирование типа грида
  const gridType = entityDataGridType(code, label, [DATA_SYSTEM_KEY, `${SYS_DATA}.${SYS_DATA_TITLE_ATTR}`], entity)
  const gridTypeKeys = {
    ...gridType,
    labelKey: [SYS_DATA, SYS_DATA_TITLE_ATTR],
    valueKey: DATA_SYSTEM_KEY
  }

  // загрузка данных выпадающего списка
  const {result: dict, loading: dictLoading} = useGridData<OptionData>(gridTypeKeys, {current, pageSize})

  // добавление в массив данных выпадающего списка
  useEffect(() => {
    setDictData(dict)
  }, [dict])

  /**
   *
   * @param newVal - новое значение
   */
  const onSelect = (newVal: Key | Key[]) => {
    setValue(newVal)
    onChange?.(newVal)
  }

  return (
    <>
      {value && !Array.isArray(value) && entity && viewTypeForm && !multivalued &&
      <RefDropdownEmbeddedForm viewTypeForm={viewTypeForm} entity={entity} id={value}/>
      }

      <Select
        showSearch allowClear={false} loading={loading || dictLoading} disabled={disabled}
        optionLabelProp='label' optionFilterProp='label'
        options={dictData} value={value}
        mode={multivalued ? "multiple" : undefined}
        onSelect={onSelect}
      />
    </>
  );
}

export default React.memo(RefDropdown)
