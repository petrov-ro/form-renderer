import React from 'react';
import {Form} from 'antd';
import FormContentRenderer from "../../../../FormContentRenderer/FormContentRenderer";
import {StatisticsFormConfig} from "../../../../../models/classes/StatisticsFormConfig";

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
  const onFieldsChange = (values: Record<string, any>) => {
    onChange(values)
  }

  return (
      <Form form={form} initialValues={value} onFieldsChange={onFieldsChange} layout={'horizontal'} style={{padding: 20}}>
        <FormContentRenderer
          elements={config?.elements}
        />
      </Form>
  )
}

export default React.memo(SingleObjectByForm)
