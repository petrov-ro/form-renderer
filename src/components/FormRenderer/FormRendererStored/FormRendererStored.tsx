import React, {createContext, forwardRef, useEffect, useImperativeHandle, useMemo, useState} from "react";
import {Form, Layout, Space} from "antd";
import {Button} from "@gp-frontend-lib/ui-kit-5";
import {Provider} from 'react-redux'
import FormContentRenderer from "../../../components/FormContentRenderer/FormContentRenderer";
import {API, CODE} from "../../../constants/Constants";
import {modifyConfig} from "../../../services/ConfigService";
import {ClassicFormClass} from "../../../models/classes/ClassicFormElementClass";
import store from "../../../redux/store/index";
import useEntityCache from "../../../hooks/useEntityCache";
import {ButtonType, FormRendererProps, refType} from "../FormRenderer";
import {notEmpty, objectCompare, removeEmpty} from "../../../utils/objectUtils";
import useFLC from "../../../hooks/useFLC";
import {hide, flcCheck, flcCheckResult} from "../../../services/FLCService";
import {capitalize} from "../../../utils/stringHelper";
import {getNamePath} from "@/utils/flcUtils";
import {getFormItemId} from "../../../utils/formUtils";
import {deepFind} from "../../../utils/treeUtils";
import {isString} from "../../../utils/common";
import {isArray} from "../../../utils/arrayUtils";

const {Content} = Layout;

export const ConfigContext = createContext({});

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

        // получение ключа формы
        const {t_600000018: requisites = []} = config as ClassicFormClass

        // массив всех реквизитов формы
        const requisiteMap = useMemo(() => {
            return (
                requisites
                    .reduce((acc, req) => {
                        const reqKey = `${req[CODE] ? `${req[CODE]}. ` : ''} ${capitalize(req.name)}`
                        const reqIdKey = req.req_id?.key
                        if (reqIdKey) {
                            acc[reqIdKey] = reqKey
                        }
                        return acc
                    }, {} as Record<number, string>)
            )
        }, [])

        // массив ключей всех реквизитов формы
        const requisiteIdKeys = Object.keys(requisiteMap).map(Number)

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
                flcCheck: () => flcCheck(form, config as ClassicFormClass),
                flcCheckFlag: () => flcCheckResult(form)
            };
        }, []);

        // подгрузка данных о сущностях и справочников
        useEntityCache(dicts, dictDate, dictClosed)

        //const [hiding, setHiding] = useState<string[]>([])  // хранение скрытых элементов
        let hiding = [] as string[]

        // установка начальных значений
        useEffect(() => {
            form.setFieldsValue(data)

            return () => {
                // закрытие окна с результатом проверки ФЛК
                API.modal?.destroy()
            }
        }, [])

        // инициализация ФЛК
        useFLC(flcPath, config as ClassicFormClass)?.then(() => {
                const formData = form.getFieldsValue(true)

                // проверка HIDING
                const {rulesResult: rulesResultHIDING = []}: CheckResult<RuleResultHiding> = API.checkHIDING(requisiteIdKeys, formData)
                const hidePaths = rulesResultHIDING
                    .filter(({hideState}) => hideState)
                    .map(({requisiteKey, groupNumber, parentsChain}) => getNamePath(requisiteKey, groupNumber, parentsChain))
                    .map(getFormItemId)

                // скрытие элементов на форме
                setTimeout(() => {
                    hiding = hide(hiding, hidePaths)
                }, 0)
            })

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
            // проверка HIDING
            const {rulesResult: rulesResultHIDING = []}: CheckResult<RuleResultHiding> = API.checkHIDING(requisiteIdKeys, fullData)
            const hidePaths = rulesResultHIDING
                .filter(({hideState}) => hideState)
                .map(({requisiteKey, groupNumber, parentsChain}) => getNamePath(requisiteKey, groupNumber, parentsChain))
                .map(getFormItemId)

            // скрытие элементов на форме
            setTimeout(() => {
                hiding = hide(hiding, hidePaths)
            }, 0)

            // удаление значений скрытых реквизитов
            const namePaths = rulesResultHIDING
                .filter(({hideState}) => hideState)
                .map(({requisiteKey, groupNumber, parentsChain}) => getNamePath(requisiteKey, groupNumber, parentsChain))
                .filter(namePath => {
                    // получение значения по умолчанию для реквизита
                    const find = deepFind(initialValues, namePath.filter(p => !isString(p) && p > 1000))
                    const defaultValues = (isArray(find) && find.length > 0) ? find[0] : find

                    // если реквизит содержит не дефолтное значение, его нужно очистить, он попадает в выборку
                    const currentValue = form.getFieldsValue(namePath)
                    return !objectCompare(defaultValues, currentValue)
                })

            // если есть реквизиты которые нужно очистить
            if (namePaths.length > 0) {
                form.resetFields(namePaths)
                form.setFieldsValue(form.getFieldsValue(true))
            }

            // удаление пустых значений и вызов колбека
            const formData = form.getFieldsValue(true)  // полные данные формы получаются заново, т.к. могли быть удалены при скрытии
            if (noEmpty) {
                const fieldDataUnempty = removeEmpty(fieldData)
                const fullDataUnempty = removeEmpty(formData)
                if (notEmpty(fieldDataUnempty)) {
                    setData?.(fieldDataUnempty, fullDataUnempty)
                }
            } else {
                setData?.(fieldData, formData)
            }

        }

        return (
            <ConfigContext.Provider value={initialValues}>
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
            </ConfigContext.Provider>
        )
    }
)

export default FormRenderer
