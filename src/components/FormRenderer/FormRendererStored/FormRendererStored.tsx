import React, {forwardRef, useEffect, useImperativeHandle} from "react";
import {Form, Layout, Space} from "antd";
import {Button} from "@gp-frontend-lib/ui-kit-5";
import {Provider} from 'react-redux'
import FormContentRenderer from "../../../components/FormContentRenderer/FormContentRenderer";
import {API} from "../../../constants/Constants";
import {modifyConfig} from "../../../services/ConfigService";
import {ClassicFormClass} from "../../../models/classes/ClassicFormElementClass";
import store from "../../../redux/store/index";
import useEntityCache from "../../../hooks/useEntityCache";
import {ButtonType, FormRendererProps, refType} from "../FormRenderer";
import {notEmpty, removeEmpty} from "../../../utils/objectUtils";
import useFLC from "../../../hooks/useFLC";
import {flcCheck} from "../../../services/FLCService";

const {Content} = Layout;

/**
 * Компонент рендера формы по метаданным
 *
 * @param props
 * @constructor
 */
const FormRenderer = forwardRef<refType, FormRendererProps>((props, ref) => {
        const {
            config, edit, data, setData, noEmpty = false, extraButtons = [], checkButton = true,
            apiPath, fetch, flcPath,
            dictDate, dictClosed
        } = props

        // установка адреса апи
        API.REACT_APP_API_URL = apiPath
        API.REACT_APP_API_FLC_URL = flcPath
        API.fetch = fetch as any

        // приведение типа конфига
        const {result: modifiedConfig, dicts, initialValues} = modifyConfig({...config} as ClassicFormClass)

        const {elements = []} = modifiedConfig

        const [form] = Form.useForm();

        // методы доступные по рефу
        const getData = async () => form.getFieldsValue(true)

        const setFieldsValue = (newData: Record<string, any>) => {
            form.setFieldsValue(newData)
        }

        const resetFields = () => {
            form.resetFields()
        }

        useImperativeHandle(ref, () => {
            return {
                getData,
                resetFields,
                setFieldsValue,
                flcCheck: () => flcCheck(form, config as ClassicFormClass)
            };
        }, []);

        // подгрузка данных о сущностях и справочников
        useEntityCache(dicts, dictDate, dictClosed)

        // установка начальных значений
        useEffect(() => {
            form.setFieldsValue(data)
        }, [])

        // инициализация ФЛК
        useFLC(flcPath, config as ClassicFormClass)

        const showButtons = (checkButton || extraButtons.length > 0)

        // кнопки в хедере формы
        const buttons: ButtonType[] = ([] as ButtonType[])
            .concat(extraButtons)

        /**
         * Установка данных формы
         * @param fieldData - данные изменившегося реквизита
         * @param fullData  - все данные формы
         */
        const onValuesChange = (fieldData: Record<string, any>, fullData: Record<string, any>) => {
            // удаление пустых значений
            if (noEmpty) {
                const fieldDataUnempty = removeEmpty(fieldData)
                const fullDataUnempty = removeEmpty(fullData)
                if (notEmpty(fieldDataUnempty)) {
                    setData?.(fieldDataUnempty, fullDataUnempty)
                }
            } else {
                setData?.(fieldData, fullData)
            }
        }

        return (
            <Provider store={store}>
                <Form form={form} name="render-form" className='statistics-form-constructor'
                      initialValues={initialValues}
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
                                                     className='statistics-form-layout-content'
                                />
                            </Content>
                        </Layout>
                    </Space>
                </Form>

{/*                {openFlc &&
                <FLCResult/>
                }*/}
            </Provider>
        )
    }
)

export default FormRenderer
