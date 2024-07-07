import React, {ReactElement, useEffect} from "react";
import {Button, Form, Layout, Space} from "antd";
import {StatisticsFormConfig} from "../../models/classes/StatisticsFormConfig";
import FormContentRenderer from "../../components/FormContentRenderer/FormContentRenderer";
import {CheckOutlined} from "@ant-design/icons";
import {REACT_APP_API_URL} from "../../constants/Constants";

const {Content} = Layout;

interface ButtonType {
    text: string,
    icon: ReactElement,
    action: (values: Record<string, any>) => void
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
    apiPath: string                                      // адрес для вызова процедур
    config?: StatisticsFormConfig                        // конфиг (метаданные) формы
    edit?: boolean                                       // режим редактирования
    data?: Record<string, any>                           // данные для отображения на форме
    checkHandle?: (data: Record<string, any>,
                   result: CheckResultType) => void      // колбек при проверке данных
    setData?: (data: Record<string, any>) => void        // колбек при установке новых значений формы
    extraButtons?: ButtonType[]                          // дополнительные кнопки
    checkButton?: boolean                                // флаг отображения кнопки проверки
}

/**
 * Компонент рендера формы по метаданным
 *
 * @param props
 * @constructor
 */
const FormRenderer: React.FC<FormRendererProps> = props => {
    const {
        config = {} as StatisticsFormConfig, edit, data, setData, checkHandle, extraButtons = [], checkButton = true,
        apiPath
    } = props
    const {elements = []} = config

    const [form] = Form.useForm();

    // установка адреса апи
    useEffect(() => {
        if (apiPath) {
            REACT_APP_API_URL = apiPath
            Object.freeze(REACT_APP_API_URL)
        }
    }, [apiPath])

    const showButtons = (checkButton || extraButtons.length > 0)

    /**
     * Изменение значений формы
     */
    const onFieldsChange = (values: any) => {
        form?.setFieldsValue(values)
        setData?.(values)
    }

    /**
     * Проверка значений формы
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
            icon: <CheckOutlined/>,
            action: checkValues
        }])
        .concat(extraButtons)

    return (
        <PathContext.Provider value={apiPath}>
            <Form form={form} name="render-form" className='statistics-form-constructor'
                  initialValues={data}
                  onFieldsChange={onFieldsChange}
                  layout='horizontal'
            >
                <Space direction='vertical' size='small' style={{width: '100%'}}>
                    {showButtons &&
                    <div className='buttons-panel'>
                        {buttons.map(button =>
                            <Button type="primary" icon={button.icon} size='small'
                                    onClick={() => button.action(form.getFieldsValue(true))}>
                                {button.text}
                            </Button>
                        )}
                    </div>
                    }

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
            </Form>
        </PathContext.Provider>
    )
}

export default FormRenderer
