import React, {useCallback} from "react";
import {Button, Form, Layout, Space} from "antd";
import {Provider} from 'react-redux'
import FormContentRenderer from "../../../components/FormContentRenderer/FormContentRenderer";
import {CheckOutlined} from "@ant-design/icons";
import {API} from "../../../constants/Constants";
import {modifyConfig} from "../../../services/ConfigService";
import {ClassicFormClass} from "../../../models/classes/ClassicFormElementClass";
import store from "../../../redux/store/index";
import useDictCache from "../../../hooks/useDictCache";
import useEntityCache from "../../../hooks/useEntityCache";
import {ButtonType, CheckResultType, FormRendererProps} from "../FormRenderer";

const {Content} = Layout;

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
    // const modifiedConfig = legacy ? modifyConfig(config as ClassicFormClass) : (config as StatisticsFormConfig)
    const {result: modifiedConfig, dicts} = modifyConfig(config as ClassicFormClass)

    const {elements = []} = modifiedConfig

    const [form] = Form.useForm();

    // подгрузка данных о сущностях
    useEntityCache(dicts)

    // подгрузка справочников
    useDictCache(dicts)

    // установка адреса апи
    //if (apiPath) {
    API.REACT_APP_API_URL = apiPath
    API.fetch = fetch as any
    //Object.freeze(API)
    //}

    const showButtons = (checkButton || extraButtons.length > 0)

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

    /**
     * Установка данных формы
     * @param newValues
     */
    const setFormData = useCallback((newValues: Record<string, any>) => {
        const formData = form?.getFieldsValue(true)
        form?.setFieldsValue({...formData, ...newValues})
    }, [])

    return (
        <Provider store={store}>
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
                                                 setFormData={setFormData}
                            />
                        </Content>
                    </Layout>
                </Space>
            </Form>
        </Provider>
    )
}

export default React.memo(FormRenderer)
