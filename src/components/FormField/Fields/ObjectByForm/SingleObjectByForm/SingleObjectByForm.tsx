import React, {useCallback} from 'react';
import {Form} from 'antd';
import FormContentRenderer from "../../../../FormContentRenderer/FormContentRenderer";
import {StatisticsFormConfig} from "../../../../../models/classes/StatisticsFormConfig";
import {objectCompare} from "../../../../../utils/objectUtils";

type FormAttributeObjectProps = {
  value: Record<string, any>                  // объект который нужно показать на форме
  onChange: (v: Record<string, any>) => void  // колбек изменение значений на форме
  config: StatisticsFormConfig                // массив элементов (конфиг формы сбора)
}

/**
 * Компонент вывода объекта по форме (компонент формы сбора)
 *
 * @param props
 * @constructor
 */
const SingleObjectByForm: React.FC<FormAttributeObjectProps> = props => {
  const {
    value = {}, onChange, config
  } = props

  const [form] = Form.useForm();

  /**
   * Изменение полей формы
   * @param values
   */
  const onValuesChange = () => {
    onChange(form?.getFieldsValue(true))
  }

  /**
   * Установка данных формы
   * @param newValues
   */
  const setFormData = useCallback((newValues) => {
    const formData = form?.getFieldsValue(true)
    form?.setFieldsValue({...formData, ...newValues})
    onChange({...formData, ...newValues})
  }, [])

  return (
      <Form form={form} initialValues={value} onValuesChange={onValuesChange} layout={'horizontal'} style={{padding: 20}}>
        <FormContentRenderer
          elements={config?.elements}
          setFormData={setFormData}
        />
      </Form>
  )
}

export default React.memo(SingleObjectByForm)
