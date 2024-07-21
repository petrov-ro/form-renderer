import React, {useState} from "react";
import {Checkbox, Radio, Spin} from "antd";
import type {CheckboxOptionType, RadioChangeEvent} from "antd";
import {FormFieldProps} from "../../models/types/FormFieldProps";
import useEntity from "../../hooks/useEntity";
import {DATA_SYSTEM_KEY, SYS_DATA, SYS_DATA_TITLE_ATTR} from "../../constants/Constants";
import {entityDataGridType} from "../../constants/GridTypes";
import useGridData from "../../hooks/useGridData";
import OptionData from "../../models/types/OptionData";

type RefCheckboxProps = Partial<FormFieldProps<any[]>> & {
  multivalued?: boolean   // флаг возможности множественного выбора
  label: string           // наименование сущности
  code: string            // код сущности для отображения записей
  disabled?: boolean      // отключить редактирование
  loading?: boolean
  dataSource?: any[]
  exclude?: string[]      // массив системных идентификторов, которые нельзя выбрать
}

/**
 * Компонент отображения чекбоксов (радиобаттонов) для записей сущности на форме
 *
 * @param props
 * @constructor
 */
const RefCheckbox: React.FC<RefCheckboxProps> = props => {
  const {
    code, value: initialValue, onChange, label, multivalued, loading: initialLoading, disabled
  } = props;

  const [current] = useState(1)       // номер страницы до которой нужно загрузить данные
  const [pageSize] = useState(100)    // количество подгружаемых данных
  const [loading] = useState(initialLoading)
  const [value, setValue] = useState(initialValue)
  const {entity} = useEntity(code)

  // формирование типа грида
  const gridType = entityDataGridType(code, label, [DATA_SYSTEM_KEY, `${SYS_DATA}.${SYS_DATA_TITLE_ATTR}`, 'name'], entity)
  const gridTypeKeys = {
    ...gridType,
    labelKey: 'name',
    valueKey: DATA_SYSTEM_KEY
  }

  // загрузка данных
  const {result: dict, loading: dictLoading} = useGridData<OptionData>(gridTypeKeys, {current, pageSize})

  /**
   *
   * @param newVal - новое значение
   */
  const onChangeCheckbox = (newVal: any[]) => {
    setValue(newVal)
    onChange?.(newVal)
  }

  const onChangeRadio = (e: RadioChangeEvent) => {
    const newVal = e.target.value
    setValue(newVal)
    onChange?.(newVal)
  }

  return (
    <Spin spinning={loading || dictLoading}>
      {multivalued && <Checkbox.Group value={value} onChange={onChangeCheckbox}
                                      options={dict as CheckboxOptionType[]}
                                      disabled={disabled}/>
      }

      {!multivalued && <Radio.Group value={value} onChange={onChangeRadio}
                                    options={dict as CheckboxOptionType[]}
                                    disabled={disabled}/>
      }
    </Spin>
  )
}

export default React.memo(RefCheckbox)
