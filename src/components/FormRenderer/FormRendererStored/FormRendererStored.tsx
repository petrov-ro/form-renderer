import React, {forwardRef, useCallback, useEffect, useImperativeHandle} from "react";
import {Form, Layout, Space} from "antd";
import {Button} from "@gp-frontend-lib/ui-kit-5";
import {Provider} from 'react-redux'
import FormContentRenderer from "../../../components/FormContentRenderer/FormContentRenderer";
import {API} from "../../../constants/Constants";
import {modifyConfig} from "../../../services/ConfigService";
import {ClassicFormClass} from "../../../models/classes/ClassicFormElementClass";
import store from "../../../redux/store/index";
import useDictCache from "../../../hooks/useDictCache";
import useEntityCache from "../../../hooks/useEntityCache";
import {ButtonType, FormRendererProps, refType} from "../FormRenderer";

const {Content} = Layout;

/**
 * Компонент рендера формы по метаданным
 *
 * @param props
 * @constructor
 */
const FormRenderer = forwardRef<refType, FormRendererProps>((props, ref) => {
    const {
        config, edit, data, setData, extraButtons = [], checkButton = true,
        apiPath, fetch, legacy = true
    } = props

    // приведение типа конфига
    // const modifiedConfig = legacy ? modifyConfig(config as ClassicFormClass) : (config as StatisticsFormConfig)
    const {result: modifiedConfig, dicts} = modifyConfig(config as ClassicFormClass)

    const {elements = []} = modifiedConfig

    const [form] = Form.useForm();

    // методы доступные по рефу
    const getData = async () => form.getFieldsValue(true)
    const setFieldsValue = async (newData: Record<string, any>) => form.setFieldsValue(newData)
    useImperativeHandle(ref, () => {
        return {
            getData,
            setFieldsValue
        };
    }, []);

    // подгрузка данных о сущностях
    useEntityCache(dicts)

    // подгрузка справочников
    // useDictCache(dicts)

    // установка адреса апи
    API.REACT_APP_API_URL = apiPath
    API.fetch = fetch as any

    const showButtons = (checkButton || extraButtons.length > 0)

    // кнопки в хедере формы
    const buttons: ButtonType[] = ([] as ButtonType[])
        .concat(extraButtons)

    /**
     * Установка данных формы
     * @param newValues
     */
    const setFormData = useCallback((newFieldValue: Record<string, any>) => {
        const formData = form?.getFieldsValue(true)
        const newFormData = {...formData, ...newFieldValue}
        form?.setFieldsValue(newFormData)
        setData?.(newFieldValue, newFormData)
    }, [])

    /**
     * Установка данных формы
     * @param newValues
     */
    const onValuesChange = (fieldData: Record<string, any>, fullData: Record<string, any>) => {
        setData?.(fieldData, fullData)
    }

    return (
        <Provider store={store}>
            <Form form={form} name="render-form" className='statistics-form-constructor'
                  initialValues={data}
                  onValuesChange={onValuesChange}
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
)

export default FormRenderer
