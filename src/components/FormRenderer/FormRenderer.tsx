import React, {ReactElement} from "react";
import {Button, Form, Layout, Space} from "antd";
import {StatisticsFormConfig} from "@/models/classes/StatisticsFormConfig";
import FormContentRenderer from "@/components/FormContentRenderer/FormContentRenderer";
import '@antv/s2-react/dist/style.min.css';
import './FormRenderer.scss'

const {Content} = Layout;

interface ButtonType {
  text: string,
  icon?: ReactElement,
  action?: (values: Record<string, any>) => void
}

interface CheckResultType {
  errors: {
    type: number
  }[],
  warnings: {
    type: number
  }[],
}

interface FormRendererProps {
  config?: StatisticsFormConfig                        // конфиг (метаданные) формы
  edit?: boolean                                       // режим редактирования
  data?: Record<string, any>                           // данные для отображения на форме
  checkHandle?: (data: Record<string, any>,
                 result: CheckResultType) => void      // колбек при проверке данных
  setData?: (data: Record<string, any>) => void        // колбек при установке новых значений формы
  extraButtons?: ButtonType[]                          // дополнительные кнопки
}

/**
 * Компонент рендера формы по метаданным
 *
 * @param props
 * @constructor
 */
const FormRenderer: React.FC<FormRendererProps> = props => {
  const {config = {} as StatisticsFormConfig, edit, data, setData, checkHandle, extraButtons = []} = props
  const {elements = []} = config

  const [form] = Form.useForm();

  /**
   * Изменение значений формы
   */
  const onFieldsChange = (values: any) => {
    form?.setFieldsValue(values)
    setData?.(values)
  }

  /**
   * Првоерка значений формы
   */
  const checkValues = (values: Record<string, any>) => {
    const result: CheckResultType = {
      errors: [],
      warnings: []
    }
    checkHandle?.(values, result)
  }

  // кнопки в хедере формы
  const buttons: ButtonType[] = ([] as ButtonType[])
    .concat([{
      text: 'Проверить',
      action: checkValues
    }])
    .concat(extraButtons)

  return (
    <AbstractForm form={form} className='statistics-form-constructor'
                  initialValues={data}
                  onFieldsChange={onFieldsChange}>
      <Space direction='vertical' size='small' style={{width: '100%'}}>
        <div className='buttons-panel'>
          {buttons.map(button =>
            <Button type="primary" icon={button.icon} size='small'
                    onClick={() => button.action(form.getFieldsValue(true))}>
              {button.text}
            </Button>
          )}
        </div>

        <Layout style={{width: '100%'}}>
          <Content style={{width: '100%', display: 'flex', backgroundColor: 'white'}}>
            <FormContentRenderer edit={edit}
                                 elements={elements}
                                 reportMode={edit}
                                 className='statistics-form-layout-content'
            />
          </Content>
        </Layout>
      </Space>
    </AbstractForm>
  )
}

export default FormRenderer
