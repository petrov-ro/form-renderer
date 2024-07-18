import React, {ReactElement} from "react";
import {Button, Form, Layout, Space} from "antd";
import {StatisticsFormConfig} from "../../models/classes/StatisticsFormConfig";
import FormContentRenderer from "../../components/FormContentRenderer/FormContentRenderer";
import {CheckOutlined} from "@ant-design/icons";
import {API} from "../../constants/Constants";
import {modifyConfig} from "../../services/ConfigService";
import {ClassicFormClass} from "../../models/classes/ClassicFormElementClass";

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
    fetch: (url: string, params: Record<string, any>) => Promise<Response>   // адрес для вызова процедур
    apiPath: string                                             // адрес для вызова процедур
    config?: StatisticsFormConfig | ClassicFormClass            // конфиг (метаданные) формы
    edit?: boolean                                              // режим редактирования
    data?: Record<string, any>                                  // данные для отображения на форме
    checkHandle?: (data: string,
                   result: CheckResultType) => void             // колбек при проверке данных
    setData?: (data: string) => void                            // колбек при установке новых значений формы
    extraButtons?: ButtonType[]                                 // дополнительные кнопки
    checkButton?: boolean                                       // флаг отображения кнопки проверки
    legacy?: boolean                                            // старый формат конфига
}

/**
 * Компонент рендера формы по метаданным
 *
 * @param props
 * @constructor
 */
const FormRenderer: React.FC<FormRendererProps> = props => {
    const {
        config, edit, data, setData, checkHandle, extraButtons = [], checkButton = true,
        apiPath, fetch, legacy = true
    } = props

    // приведение типа конфига
    const modifiedConfig = legacy ? modifyConfig(config as ClassicFormClass) : (config as StatisticsFormConfig)

    const {elements = []} = modifiedConfig

    const [form] = Form.useForm();

    // установка адреса апи
    //if (apiPath) {
        API.REACT_APP_API_URL = apiPath
        API.fetch = fetch
        //Object.freeze(API)
    //}

    const showButtons = (checkButton || extraButtons.length > 0)

    /**
     * Изменение значений формы
     */
    const getFormData = () => {
        return JSON.stringify(form.getFieldsValue(true))
    }

     /**
     * Проверка значений формы
     */
    const checkValues = () => {
        const result: CheckResultType = {
            errors: [],
            warnings: []
        }
        checkHandle?.(getFormData(), result)
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
        <Form form={form} name="render-form" className='statistics-form-constructor'
              initialValues={data}
              layout='vertical'
        >
                <Space direction='vertical' size='small' style={{width: '100%'}}>
                    {showButtons &&
                    <div className='buttons-panel'>
                        {buttons
                            .map((button, i) =>
                            <Button key={i} type="primary" icon={button.icon} size='small'
                                    onClick={() => button.action(form.getFieldsValue(true))}>
                                {button.text}
                            </Button>
                        )}
                    </div>
                    }

                    <Layout style={{width: '100%'}}>
                        <Content style={{width: '100%', display: 'block', backgroundColor: 'white'}}>
                            <FormContentRenderer edit={edit}
                                                 elements={elements}
                                                 reportMode={edit}
                                                 className='statistics-form-layout-content'
                            />
                        </Content>
                    </Layout>
                </Space>
        </Form>
    )
}

export default React.memo(FormRenderer)
